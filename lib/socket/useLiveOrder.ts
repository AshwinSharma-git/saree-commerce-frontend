"use client";

import { useEffect, useState } from "react";
import { getSocket } from "./client";
import { ordersApi } from "@/lib/api/orders";
import type { ApiOrder } from "@/lib/api/types";

interface UseLiveOrderResult {
  order: ApiOrder | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Subscribes to live `order:updated` Socket.IO events for the given order
 * and re-fetches the full order whenever its status flips. Used by the
 * customer tracking page so the timeline progresses without a refresh.
 */
export function useLiveOrder(orderNumber: string | null): UseLiveOrderResult {
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      setOrder(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    ordersApi
      .byNumber(orderNumber)
      .then((o) => {
        if (!cancelled) setOrder(o);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const socket = getSocket();

    type OrderUpdate = { id: string; number: string; status: string };
    const onUpdate = (payload: OrderUpdate) => {
      if (payload.number !== orderNumber && payload.id !== order?.id) return;
      ordersApi.byNumber(orderNumber).then((o) => {
        if (!cancelled) setOrder(o);
      });
    };

    socket.on("order:updated", onUpdate);
    return () => {
      cancelled = true;
      socket.off("order:updated", onUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber]);

  const refresh = async () => {
    if (!orderNumber) return;
    const fresh = await ordersApi.byNumber(orderNumber);
    setOrder(fresh);
  };

  return { order, loading, error, refresh };
}
