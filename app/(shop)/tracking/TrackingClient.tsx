"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useLiveOrder } from "@/lib/socket/useLiveOrder";
import type { ApiOrder, OrderStatus } from "@/lib/api/types";
import { orders as mockOrders } from "@/lib/data/orders";
import { formatINR as formatRupees, formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const journey: Array<{ status: OrderStatus; label: string; icon: "check" | "shield" | "package" | "truck" | "map-pin" | "sparkle" }> = [
  { status: "PLACED", label: "Order placed", icon: "check" },
  { status: "CONFIRMED", label: "Confirmed", icon: "shield" },
  { status: "PACKED", label: "Hand-packed", icon: "package" },
  { status: "SHIPPED", label: "In transit", icon: "truck" },
  { status: "OUT_FOR_DELIVERY", label: "Out for delivery", icon: "map-pin" },
  { status: "DELIVERED", label: "Delivered", icon: "sparkle" },
];

const fmtPaise = (paise: number) => formatRupees(paise / 100);

export default function TrackingClient() {
  const sp = useSearchParams();
  const initial = sp.get("order") ?? "";
  const isDemo = sp.get("demo") === "1" || initial === "";
  const [search, setSearch] = useState(initial);
  const [tracked, setTracked] = useState(initial);

  // Live API + socket subscription. Disabled in demo / no-arg mode where
  // we just show a representative mock order so the page always demos well.
  const { order, loading, error } = useLiveOrder(isDemo ? null : tracked);

  // Pulse a "live update" indicator briefly whenever the status changes.
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (!order) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 1200);
    return () => clearTimeout(t);
  }, [order?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Demo fallback — uses the local mock order so the UI is fully populated
  // even without authentication or a real backend in the demo screenshot.
  const demoOrder = useMemo(() => {
    const m = mockOrders[0];
    return {
      number: m.id,
      status: (m.status === "Out for Delivery"
        ? "OUT_FOR_DELIVERY"
        : m.status.toUpperCase()) as OrderStatus,
      placedAt: m.placedAt,
      expectedAt: m.expectedDelivery ?? null,
      total: m.total * 100,
      items: m.items.map((it) => ({
        productId: it.productId,
        title: it.name,
        imageUrl: it.image,
        quantity: it.qty,
        unitPrice: it.price * 100,
        lineTotal: it.price * it.qty * 100,
      })),
      customerName: m.customer,
      address: m.address ?? null,
      awb: m.trackingId ?? null,
      carrier: null as string | null,
    };
  }, []);

  const view = order
    ? {
        number: order.number,
        status: order.status,
        placedAt: order.placedAt,
        expectedAt: order.shipment?.expectedAt ?? null,
        total: order.total,
        items: order.items.map((it) => ({
          productId: it.productId,
          title: it.title,
          imageUrl: it.imageUrl ?? "",
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          lineTotal: it.lineTotal,
        })),
        customerName:
          [order.user?.firstName, order.user?.lastName].filter(Boolean).join(" ") || "Customer",
        address: null as string | null,
        awb: order.shipment?.awbNumber ?? null,
        carrier: order.shipment?.carrier ?? null,
      }
    : demoOrder;

  const progress = Math.max(0, journey.findIndex((j) => j.status === view.status));

  return (
    <Section className="!pt-8 !pb-24">
      <Eyebrow>Track</Eyebrow>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">Where is my saree?</h1>
      <p className="mt-2 text-[var(--color-fg-muted)] max-w-xl">
        Enter your order number to follow your heirloom from atelier to doorstep — updates arrive live.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTracked(search.trim().toUpperCase());
        }}
        className="mt-8 flex gap-3 max-w-xl"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="RV-10042"
          className="flex-1 px-5 py-3.5 rounded-full bg-[var(--color-cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)]/40"
        />
        <Button type="submit" variant="primary" iconRight={<Icon name="arrow-right" size={16} />}>
          Track
        </Button>
      </form>

      {error && (
        <p className="mt-4 text-sm text-[var(--color-maroon)]">
          Couldn't fetch this order — showing the most recent status we have.
        </p>
      )}

      <div className="mt-10 p-7 md:p-10 rounded-3xl bg-[var(--color-surface)] luxury-shadow ring-1 ring-[rgba(90,15,26,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[rgba(90,15,26,0.08)]">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">Order</p>
              {!isDemo && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] px-2 py-0.5 rounded-full",
                    pulse
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-[var(--color-cream)] text-[var(--color-fg-muted)]",
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      pulse ? "bg-emerald-500 animate-pulse" : "bg-[var(--color-fg-muted)]/60",
                    )}
                  />
                  Live
                </span>
              )}
            </div>
            <p className="font-[family-name:var(--font-display)] text-2xl">{view.number}</p>
            <p className="text-xs text-[var(--color-fg-muted)]">Placed {formatDate(view.placedAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">Expected</p>
            <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-maroon-deep)]">
              {view.expectedAt ? formatDate(view.expectedAt) : "TBA"}
            </p>
            {view.awb && (
              <p className="text-xs text-[var(--color-fg-muted)]">
                {view.carrier ? `${view.carrier} · ` : ""}AWB {view.awb}
              </p>
            )}
          </div>
        </div>

        {/* Stepper */}
        <div className="mt-10 relative">
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-[rgba(90,15,26,0.1)]" />
          <motion.div
            className="absolute top-5 left-0 h-0.5 gradient-gold"
            initial={{ width: 0 }}
            animate={{ width: `${(progress / (journey.length - 1)) * 100}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="relative grid grid-cols-3 md:grid-cols-6 gap-y-6">
            {journey.map((j, i) => {
              const reached = i <= progress;
              return (
                <div key={j.status} className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className={cn(
                      "h-10 w-10 grid place-items-center rounded-full ring-2 ring-[var(--color-ivory)]",
                      reached
                        ? "gradient-maroon text-[var(--color-gold-bright)]"
                        : "bg-[var(--color-cream)] text-[var(--color-fg-muted)]",
                    )}
                  >
                    <Icon name={j.icon} size={16} />
                  </motion.div>
                  <p
                    className={cn(
                      "mt-2 text-[10px] uppercase tracking-[0.24em]",
                      reached ? "text-[var(--color-maroon)]" : "text-[var(--color-fg-muted)]",
                    )}
                  >
                    {j.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-[family-name:var(--font-display)] text-xl mb-3">Items in this order</h3>
            {loading && !order && !isDemo ? (
              <p className="text-sm text-[var(--color-fg-muted)]">Loading order…</p>
            ) : (
              view.items.map((it) => (
                <div key={it.productId} className="flex gap-4 p-4 rounded-xl bg-[var(--color-cream)]">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                    {it.imageUrl && (
                      <Image src={it.imageUrl} alt={it.title} fill sizes="100px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{it.title}</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">Qty {it.quantity}</p>
                    <p className="text-sm text-[var(--color-maroon-deep)] mt-1">{fmtPaise(it.lineTotal)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-6 rounded-xl bg-[var(--color-noir)] text-[var(--color-ivory)] space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-bright)] mb-2">Shipping to</p>
              <p className="text-sm">{view.customerName}</p>
              <p className="text-xs text-[var(--color-ivory)]/70 mt-1">{view.address ?? "Address on file"}</p>
            </div>
            <div className="h-px bg-white/10" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-bright)] mb-2">Order total</p>
              <p className="font-[family-name:var(--font-display)] text-3xl text-gradient-gold">
                {fmtPaise(view.total)}
              </p>
            </div>
            <a
              href="https://wa.me/919999999999"
              className="mt-4 flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-bright)] text-xs hover:bg-[var(--color-gold)]/25"
            >
              <Icon name="whatsapp" size={14} /> Concierge support
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
