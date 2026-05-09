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

export const inventoryApi = {
  summary: () =>
    api.get<{ inStock: number; lowStock: number; outOfStock: number }>("/inventory/summary"),
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
