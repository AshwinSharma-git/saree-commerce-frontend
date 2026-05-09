/**
 * Product API helpers — typed wrappers over `/products`.
 */
import { api, apiFetchWithMeta, type ApiSuccess } from "./client";
import type { ApiCategory, ApiProduct, ApiVariant } from "./types";

export interface ListProductsParams {
  q?: string;
  category?: string;
  fabric?: string;
  collection?: string;
  occasion?: string;
  color?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  trending?: boolean;
  inStock?: boolean;
  sort?: "new" | "price-asc" | "price-desc" | "popular" | "rating";
  page?: number;
  pageSize?: number;
}

export const productsApi = {
  list: (params: ListProductsParams = {}) =>
    apiFetchWithMeta<ApiProduct[]>("/products", {
      searchParams: params as Record<string, string | number | boolean | undefined>,
    }),

  featured: (limit = 12) =>
    api.get<ApiProduct[]>("/products/featured", { searchParams: { limit } }),

  trending: (limit = 12) =>
    api.get<ApiProduct[]>("/products/trending", { searchParams: { limit } }),

  collections: () =>
    api.get<{ collection: string; count: number }[]>("/products/meta/collections"),

  fabrics: () =>
    api.get<{ fabric: string; count: number }[]>("/products/meta/fabrics"),

  byId: (id: string) => api.get<ApiProduct>(`/products/${encodeURIComponent(id)}`),
  byCode: (code: string) => api.get<ApiProduct>(`/products/code/${encodeURIComponent(code)}`),
  bySlug: (slug: string) => api.get<ApiProduct>(`/products/slug/${encodeURIComponent(slug)}`),

  related: (id: string, limit = 4) =>
    api.get<ApiProduct[]>(`/products/${encodeURIComponent(id)}/related`, {
      searchParams: { limit },
    }),

  variants: (id: string) =>
    api.get<ApiVariant[]>(`/products/${encodeURIComponent(id)}/variants`),
};

export const categoriesApi = {
  list: (params: { rootOnly?: boolean; withChildren?: boolean; q?: string } = {}) =>
    api.get<ApiCategory[]>("/categories", {
      searchParams: params as Record<string, string | boolean | undefined>,
    }),
  bySlug: (slug: string) =>
    api.get<ApiCategory>(`/categories/slug/${encodeURIComponent(slug)}`),
  byId: (id: string) => api.get<ApiCategory>(`/categories/${encodeURIComponent(id)}`),
};

export type { ApiSuccess };
