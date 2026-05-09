import { api } from "./client";
import type { ApiOrder, OrderStatus } from "./types";

export interface CreateOrderInput {
  channel?: "WEB" | "WHATSAPP" | "INSTAGRAM" | "ADMIN";
  shippingAddressId?: string;
  billingAddressId?: string;
  couponCode?: string;
  notes?: string;
  items: { productId: string; variantId?: string; quantity: number }[];
}

export const ordersApi = {
  list: (params: { status?: OrderStatus; channel?: string; page?: number; pageSize?: number } = {}) =>
    api.get<ApiOrder[]>("/orders", {
      searchParams: params as Record<string, string | number | undefined>,
    }),

  byId: (id: string) => api.get<ApiOrder>(`/orders/${encodeURIComponent(id)}`),
  byNumber: (number: string) =>
    api.get<ApiOrder>(`/orders/by-number/${encodeURIComponent(number)}`),

  create: (input: CreateOrderInput) => api.post<ApiOrder>("/orders", input),

  updateStatus: (id: string, status: OrderStatus, note?: string) =>
    api.patch<ApiOrder>(`/orders/${encodeURIComponent(id)}/status`, { status, note }),
};

export const paymentsApi = {
  status: () =>
    api.get<{
      mode: string;
      provider: string;
      providerMode: "demo" | "live";
      autoCapture: boolean;
      methods: string[];
    }>("/payments/status", { auth: false }),
  init: (orderId: string) =>
    api.post<{
      provider: string;
      mode: "demo" | "live";
      providerOrderId: string;
      autoCaptured: boolean;
      clientPayload?: Record<string, unknown>;
    }>("/payments/init", { orderId }),
};

export const couponsApi = {
  preview: (code: string, subtotal: number) =>
    api.get<{ coupon: { code: string; type: "PERCENT" | "FIXED"; value: number }; discount: number }>(
      "/coupons/preview",
      { searchParams: { code, subtotal }, auth: false },
    ),
};
