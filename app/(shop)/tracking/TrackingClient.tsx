"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { orders } from "@/lib/data/orders";
import { formatINR, formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const journey = [
  { id: "Placed", label: "Order placed", icon: "check" as const },
  { id: "Confirmed", label: "Confirmed", icon: "shield" as const },
  { id: "Packed", label: "Hand-packed", icon: "package" as const },
  { id: "Shipped", label: "In transit", icon: "truck" as const },
  { id: "Out for Delivery", label: "Out for delivery", icon: "map-pin" as const },
  { id: "Delivered", label: "Delivered", icon: "sparkle" as const },
];

export default function TrackingClient() {
  const sp = useSearchParams();
  const initialId = sp.get("order") ?? orders[0].id;
  const [orderId, setOrderId] = useState(initialId);
  const [search, setSearch] = useState(initialId);

  const order = orders.find((o) => o.id === orderId) ?? orders[0];
  const currentStep = journey.findIndex((j) => j.id === order.status);
  const progress = currentStep >= 0 ? currentStep : 0;

  return (
    <Section className="!pt-8 !pb-24">
      <Eyebrow>Track</Eyebrow>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">Where is my saree?</h1>
      <p className="mt-2 text-[var(--color-fg-muted)] max-w-xl">
        Enter your order ID to follow your heirloom from atelier to doorstep.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setOrderId(search.trim().toUpperCase());
        }}
        className="mt-8 flex gap-3 max-w-xl"
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ORD-10472"
          className="flex-1 px-5 py-3.5 rounded-full bg-[var(--color-cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)]/40"
        />
        <Button type="submit" variant="primary" iconRight={<Icon name="arrow-right" size={16} />}>
          Track
        </Button>
      </form>

      <div className="mt-12 p-7 md:p-10 rounded-3xl bg-[var(--color-surface)] luxury-shadow ring-1 ring-[rgba(90,15,26,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[rgba(90,15,26,0.08)]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">Order</p>
            <p className="font-[family-name:var(--font-display)] text-2xl">{order.id}</p>
            <p className="text-xs text-[var(--color-fg-muted)]">Placed {formatDate(order.placedAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">Expected</p>
            <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-maroon-deep)]">
              {order.expectedDelivery ? formatDate(order.expectedDelivery) : "TBA"}
            </p>
            {order.trackingId && (
              <p className="text-xs text-[var(--color-fg-muted)]">AWB {order.trackingId}</p>
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
                <div key={j.id} className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className={cn(
                      "h-10 w-10 grid place-items-center rounded-full ring-2 ring-[var(--color-ivory)]",
                      reached
                        ? "gradient-maroon text-[var(--color-gold-bright)]"
                        : "bg-[var(--color-cream)] text-[var(--color-fg-muted)]",
                    )}
                  >
                    <Icon name={j.icon} size={16} />
                  </motion.div>
                  <p className={cn("mt-2 text-[10px] uppercase tracking-[0.24em]", reached ? "text-[var(--color-maroon)]" : "text-[var(--color-fg-muted)]")}>
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
            {order.items.map((it) => (
              <div key={it.productId} className="flex gap-4 p-4 rounded-xl bg-[var(--color-cream)]">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={it.image} alt={it.name} fill sizes="100px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{it.name}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">Qty {it.qty}</p>
                  <p className="text-sm text-[var(--color-maroon-deep)] mt-1">{formatINR(it.price * it.qty)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-xl bg-[var(--color-noir)] text-[var(--color-ivory)] space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-bright)] mb-2">Shipping to</p>
              <p className="text-sm">{order.customer}</p>
              <p className="text-xs text-[var(--color-ivory)]/70 mt-1">{order.address ?? "Address on file"}</p>
            </div>
            <div className="h-px bg-white/10" />
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-bright)] mb-2">Order total</p>
              <p className="font-[family-name:var(--font-display)] text-3xl text-gradient-gold">{formatINR(order.total)}</p>
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
