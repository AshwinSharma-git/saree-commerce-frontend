import { api, tokenStore } from "./client";
import type { ApiUser } from "./types";

export interface LoginInput {
  email: string;
  password: string;
}
export interface SignupInput extends LoginInput {
  firstName: string;
  lastName?: string;
  phone?: string;
}

interface AuthSession {
  user: ApiUser;
  accessToken: string;
}

export const authApi = {
  signup: async (input: SignupInput): Promise<AuthSession> => {
    const session = await api.post<AuthSession>("/auth/signup", input, { auth: false });
    tokenStore.set(session.accessToken);
    return session;
  },
  login: async (input: LoginInput): Promise<AuthSession> => {
    const session = await api.post<AuthSession>("/auth/login", input, { auth: false });
    tokenStore.set(session.accessToken);
    return session;
  },
  refresh: async (): Promise<{ accessToken: string }> => {
    const session = await api.post<{ accessToken: string }>("/auth/refresh", {}, { auth: false });
    tokenStore.set(session.accessToken);
    return session;
  },
  logout: async () => {
    try {
      await api.post<void>("/auth/logout");
    } finally {
      tokenStore.set(null);
    }
  },
  me: () => api.get<{ user: ApiUser }>("/auth/me"),
};
