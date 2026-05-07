"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { orders } from "@/lib/data/orders";
import { useShop } from "@/lib/store/shop-store";
import { products } from "@/lib/data/products";
import { formatINR, formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "overview", label: "Overview", icon: "user" as const },
  { id: "orders", label: "Orders", icon: "package" as const },
  { id: "wishlist", label: "Wishlist", icon: "heart" as const },
  { id: "addresses", label: "Addresses", icon: "map-pin" as const },
  { id: "settings", label: "Settings", icon: "settings" as const },
];

export default function AccountPage() {
  const [tab, setTab] = useState<typeof tabs[number]["id"]>("overview");
  const { wishlist } = useShop();
  const wishlistItems = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
  const myOrders = orders.slice(0, 4);

  return (
    <Section className="!pt-8 !pb-24">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full grid place-items-center gradient-maroon text-[var(--color-gold-bright)] text-3xl font-[family-name:var(--font-display)]">
            A
          </div>
          <div>
            <Eyebrow>Welcome back</Eyebrow>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl">Anaya Kapoor</h1>
            <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">VIP member · since August 2024</p>
          </div>
        </div>
        <button className="text-sm text-[var(--color-maroon)] inline-flex items-center gap-2">
          <Icon name="logout" size={14} /> Sign out
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <aside className="lg:col-span-3">
          <nav className="lg:sticky lg:top-32 flex lg:flex-col gap-1 overflow-x-auto hide-scrollbar lg:overflow-visible">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm whitespace-nowrap transition-all",
                  tab === t.id
                    ? "bg-[var(--color-noir)] text-[var(--color-gold-bright)]"
                    : "text-[var(--color-noir)] hover:bg-[var(--color-cream)]",
                )}
              >
                <Icon name={t.icon} size={16} />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              {tab === "overview" && (
                <div className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { l: "Lifetime spend", v: formatINR(184500) },
                      { l: "Orders placed", v: 9 },
                      { l: "Saved pieces", v: wishlistItems.length },
                    ].map((s) => (
                      <div key={s.l} className="p-5 rounded-2xl bg-[var(--color-cream)]">
                        <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">{s.l}</p>
                        <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--color-maroon-deep)]">{s.v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-noir)] to-[var(--color-maroon-deep)] text-[var(--color-ivory)] flex flex-col md:flex-row gap-6 items-center">
                    <span className="grid place-items-center h-16 w-16 rounded-full gradient-gold text-[var(--color-noir)]">
                      <Icon name="sparkle" size={22} />
                    </span>
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-bright)]">Atelier Card · VIP</p>
                      <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl">12% off the next heritage piece</h3>
                      <p className="text-sm text-[var(--color-ivory)]/70 mt-1">Auto-applied at checkout. Valid through 30 May.</p>
                    </div>
                  </div>

                  <RecentOrders />
                </div>
              )}

              {tab === "orders" && <OrdersTab orders={myOrders} />}
              {tab === "wishlist" && <WishlistTab items={wishlistItems} />}
              {tab === "addresses" && <AddressesTab />}
              {tab === "settings" && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

function RecentOrders() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-[family-name:var(--font-display)] text-2xl">Recent orders</h3>
        <Link href="/tracking" className="text-sm text-[var(--color-maroon)]">Track an order →</Link>
      </div>
      <div className="space-y-3">
        {orders.slice(0, 3).map((o) => (
          <div key={o.id} className="p-5 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[var(--color-cream)] flex-shrink-0">
              <Image src={o.items[0].image} alt={o.items[0].name} fill sizes="80px" className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[var(--color-fg-muted)]">{o.id} · {formatDate(o.placedAt)}</p>
              <p className="text-sm truncate">{o.items.map((i) => i.name).join(", ")}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-[var(--color-maroon-deep)]">{formatINR(o.total)}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[var(--color-cream)] text-[10px] uppercase tracking-wide">
                {o.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab({ orders }: { orders: typeof import("@/lib/data/orders").orders }) {
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[rgba(90,15,26,0.08)]">
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg">{o.id}</p>
              <p className="text-xs text-[var(--color-fg-muted)]">Placed on {formatDate(o.placedAt)}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--color-cream)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-maroon)]">
              {o.status}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {o.items.map((it) => (
              <div key={it.productId} className="flex items-center gap-3">
                <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-[var(--color-cream)]">
                  <Image src={it.image} alt={it.name} fill sizes="60px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p>{it.name}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">Qty {it.qty} · {formatINR(it.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm text-[var(--color-fg-muted)]">Total</span>
            <span className="font-[family-name:var(--font-display)] text-lg text-[var(--color-maroon-deep)]">{formatINR(o.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WishlistTab({ items }: { items: typeof products }) {
  if (items.length === 0)
    return <p className="text-[var(--color-fg-muted)]">Your wishlist is empty. Tap the heart on any saree to save it.</p>;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {items.map((p) => (
        <Link key={p.id} href={`/product/${p.id}`} className="group block">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--color-cream)]">
            <Image src={p.image} alt={p.name} fill sizes="300px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <p className="mt-3 font-[family-name:var(--font-display)] text-lg">{p.name}</p>
          <p className="text-sm text-[var(--color-maroon-deep)]">{formatINR(p.price)}</p>
        </Link>
      ))}
    </div>
  );
}

function AddressesTab() {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {[
        { name: "Home", line1: "12 Walkeshwar Road", line2: "Mumbai, MH 400006", default: true },
        { name: "Office", line1: "Tower B, Lower Parel", line2: "Mumbai, MH 400013" },
      ].map((a) => (
        <div key={a.name} className="p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)]">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{a.name}</h4>
            {a.default && <span className="px-2 py-0.5 rounded-full bg-[var(--color-cream)] text-[10px] uppercase tracking-wide">Default</span>}
          </div>
          <p className="mt-2 text-sm text-[var(--color-fg-muted)]">{a.line1}<br />{a.line2}</p>
          <div className="mt-4 flex gap-3 text-xs">
            <button className="text-[var(--color-maroon)]">Edit</button>
            <button className="text-[var(--color-fg-muted)] hover:text-[var(--color-maroon)]">Delete</button>
          </div>
        </div>
      ))}
      <button className="p-6 rounded-2xl border border-dashed border-[rgba(90,15,26,0.25)] text-[var(--color-maroon)] flex items-center justify-center gap-2 text-sm hover:bg-[var(--color-cream)]">
        <Icon name="plus" size={16} /> Add a new address
      </button>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="space-y-4">
      {[
        { l: "WhatsApp updates", d: "Order updates and concierge messages on WhatsApp." },
        { l: "Atelier letter", d: "Monthly newsletter — new collections, weaver stories." },
        { l: "Drop alerts", d: "Be the first to know when limited pieces drop." },
      ].map((s, i) => (
        <div key={s.l} className="flex items-center justify-between p-5 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)]">
          <div>
            <p className="font-medium">{s.l}</p>
            <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">{s.d}</p>
          </div>
          <button
            className={cn(
              "h-7 w-12 rounded-full p-0.5 flex transition-colors",
              i === 1 ? "bg-[rgba(90,15,26,0.18)] justify-start" : "gradient-maroon justify-end",
            )}
          >
            <span className="h-6 w-6 rounded-full bg-[var(--color-ivory)]" />
          </button>
        </div>
      ))}
    </div>
  );
}
