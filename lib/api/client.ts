/**
 * Typed fetch wrapper for the Rājavastra API.
 *
 *  - Reads the base URL from `NEXT_PUBLIC_API_URL`.
 *  - Sends credentials so the HttpOnly refresh cookie travels with every request.
 *  - Injects a Bearer access token from the in-memory `tokenStore` when present.
 *  - On a 401 response, attempts a single transparent refresh and retries.
 *  - Decodes the standard `{ success, data, error, meta }` envelope.
 */

const BASE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
  "http://localhost:4000/api/v1";

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: {
    requestId?: string;
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
      hasNext?: boolean;
      hasPrev?: boolean;
    };
  };
}

export interface ApiFailure {
  success: false;
  error: { code: string; message: string; details?: unknown };
  meta?: { requestId?: string };
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
  constructor(status: number, code: string, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// ── Access token store (in-memory, lives only for the session) ───────────────
let accessToken: string | null = null;
const subscribers = new Set<(t: string | null) => void>();

export const tokenStore = {
  get: () => accessToken,
  set: (t: string | null) => {
    accessToken = t;
    subscribers.forEach((s) => s(t));
  },
  subscribe: (fn: (t: string | null) => void) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  },
};

// ── Refresh coordination — only one in-flight refresh at a time ──────────────
let refreshPromise: Promise<string | null> | null = null;
const tryRefresh = async (): Promise<string | null> => {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!res.ok) return null;
      const json = (await res.json()) as ApiEnvelope<{ accessToken: string }>;
      if (!json.success) return null;
      tokenStore.set(json.data.accessToken);
      return json.data.accessToken;
    } catch {
      return null;
    } finally {
      // small grace window in case multiple callers landed simultaneously
      setTimeout(() => {
        refreshPromise = null;
      }, 100);
    }
  })();
  return refreshPromise;
};

// ── Core request ─────────────────────────────────────────────────────────────
interface RequestInit2 extends Omit<RequestInit, "body"> {
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined | null>;
  /** Set to false to skip the access-token header (for `/auth/login` etc.). */
  auth?: boolean;
  /** Internal — set when retrying after a refresh. */
  _retry?: boolean;
}

const buildUrl = (path: string, search?: RequestInit2["searchParams"]): string => {
  const url = new URL(path.startsWith("http") ? path : `${BASE_URL}${path}`);
  if (search) {
    for (const [k, v] of Object.entries(search)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }
  return url.toString();
};

export async function apiFetch<T>(path: string, init: RequestInit2 = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (init.auth !== false && accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const url = buildUrl(path, init.searchParams);
  const res = await fetch(url, {
    method: init.method ?? "GET",
    credentials: "include",
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const json = (await res.json()) as ApiEnvelope<T>;

  if (!res.ok || !json.success) {
    const failure = (json as ApiFailure).error ?? { code: "UNKNOWN", message: res.statusText };
    // Single transparent retry after a successful refresh.
    if (res.status === 401 && init.auth !== false && !init._retry) {
      const newToken = await tryRefresh();
      if (newToken) return apiFetch<T>(path, { ...init, _retry: true });
    }
    throw new ApiError(res.status, failure.code, failure.message, failure.details);
  }

  return json.data;
}

export const api = {
  get: <T>(path: string, init?: Omit<RequestInit2, "method" | "body">) =>
    apiFetch<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body?: unknown, init?: Omit<RequestInit2, "method">) =>
    apiFetch<T>(path, { ...init, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, init?: Omit<RequestInit2, "method">) =>
    apiFetch<T>(path, { ...init, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, init?: Omit<RequestInit2, "method">) =>
    apiFetch<T>(path, { ...init, method: "PUT", body }),
  delete: <T = void>(path: string, init?: Omit<RequestInit2, "method" | "body">) =>
    apiFetch<T>(path, { ...init, method: "DELETE" }),
};

/**
 * Same as `apiFetch<T>` but returns the meta block alongside the payload —
 * used for paginated lists.
 */
export async function apiFetchWithMeta<T>(
  path: string,
  init: RequestInit2 = {},
): Promise<ApiSuccess<T>> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (init.auth !== false && accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const url = buildUrl(path, init.searchParams);
  const res = await fetch(url, {
    method: init.method ?? "GET",
    credentials: "include",
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const json = (await res.json()) as ApiEnvelope<T>;
  if (!res.ok || !json.success) {
    if (res.status === 401 && init.auth !== false && !init._retry) {
      const newToken = await tryRefresh();
      if (newToken) return apiFetchWithMeta<T>(path, { ...init, _retry: true });
    }
    const failure = (json as ApiFailure).error ?? { code: "UNKNOWN", message: res.statusText };
    throw new ApiError(res.status, failure.code, failure.message, failure.details);
  }
  return json;
}

export const API_BASE_URL = BASE_URL;
