import { api } from "./client";
import type { ApiAdminOverview } from "./types";

export const adminApi = {
  overview: () => api.get<ApiAdminOverview>("/admin/overview"),
  settings: () => api.get<{
    whatsapp: { mode: string; provider: string; configured: boolean; hint: string };
    payment: { mode: string; configured: boolean; autoCapture: boolean };
    tracking: { mode: string; delaysSeconds: Record<string, number> };
  }>("/admin/settings"),
};

export interface InventoryRow {
  id: string;
  productId: string;
  onHand: number;
  reserved: number;
  reorderPoint: number;
  product: {
    id: string;
    code: string;
    title: string;
    slug: string;
    price: number;
    fabric: string;
    collection: string;
    images: { url: string }[];
  };
}

export const inventoryApi = {
  summary: () =>
    api.get<{ inStock: number; lowStock: number; outOfStock: number }>("/inventory/summary"),
  list: (params: { status?: "all" | "in-stock" | "low-stock" | "out-of-stock"; q?: string; pageSize?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.status) qs.set("status", params.status);
    if (params.q) qs.set("q", params.q);
    if (params.pageSize) qs.set("pageSize", String(params.pageSize));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return api.get<InventoryRow[]>(`/inventory${suffix}`);
  },
  restock: (productId: string, qty: number, note?: string) =>
    api.post<InventoryRow>(`/inventory/${productId}/restock`, { qty, note }),
};

export const whatsappApi = {
  status: () =>
    api.get<{
      provider: string;
      mode: "demo" | "live";
      configured: boolean;
      hasWebhookSecret: boolean;
      hasVerifyToken: boolean;
      businessPhone: string;
      failedLast24h: number;
      totals: Record<string, number>;
    }>("/whatsapp/admin/status"),
};
