"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useShop } from "@/lib/store/shop-store";
import { ordersApi } from "@/lib/api/orders";
import { productsApi } from "@/lib/api/products";
import { adaptProduct } from "@/lib/api/adapt";
import type { ApiOrder } from "@/lib/api/types";
import type { Product } from "@/types";
import { formatINR as fmtRupees, formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const tabs = [
  { id: "overview", label: "Overview", icon: "user" as const },
  { id: "orders", label: "Orders", icon: "package" as const },
  { id: "wishlist", label: "Wishlist", icon: "heart" as const },
  { id: "settings", label: "Settings", icon: "settings" as const },
];

const fmtPaise = (paise: number) => fmtRupees(paise / 100);

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const { wishlist } = useShop();

  const [tab, setTab] = useState<typeof tabs[number]["id"]>("overview");
  const [orders, setOrders] = useState<ApiOrder[] | null>(null);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);

  // Redirect to login if not authenticated.
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?next=/account");
    }
  }, [authLoading, user, router]);

  // Fetch orders for the current user.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    ordersApi
      .list({ pageSize: 25 })
      .then((res) => {
        if (!cancelled) setOrders(res);
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Hydrate wishlist product details from the API for whichever IDs are saved.
  useEffect(() => {
    if (wishlist.length === 0) {
      setWishlistProducts([]);
      return;
    }
    let cancelled = false;
    Promise.all(
      wishlist.map((id) =>
        productsApi
          .byId(id)
          .catch(() => productsApi.byCode(id))
          .catch(() => null),
      ),
    ).then((rows) => {
      if (cancelled) return;
      setWishlistProducts(rows.filter((p): p is NonNullable<typeof p> => p !== null).map(adaptProduct));
    });
    return () => {
      cancelled = true;
    };
  }, [wishlist]);

  if (authLoading || !user) {
    return (
      <Section className="!py-32 text-center">
        <p className="text-[var(--color-fg-muted)]">Checking your session…</p>
      </Section>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Guest";
  const initials = (user.firstName?.charAt(0) ?? user.email?.charAt(0) ?? "A").toUpperCase();

  const lifetimeSpend = (orders ?? [])
    .filter((o) => o.status !== "CANCELLED" && o.status !== "REFUNDED")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <Section className="!pt-8 !pb-24">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-full grid place-items-center gradient-maroon text-[var(--color-gold-bright)] text-3xl font-[family-name:var(--font-display)]">
            {initials}
          </div>
          <div>
            <Eyebrow>Welcome back</Eyebrow>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl">{fullName}</h1>
            <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">{user.email}</p>
          </div>
        </div>
        <button
          onClick={() => {
            void logout().then(() => router.replace("/"));
          }}
          className="text-sm text-[var(--color-maroon)] inline-flex items-center gap-2"
        >
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
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              {tab === "overview" && (
                <Overview
                  email={user.email ?? "—"}
                  phone={user.phone ?? "—"}
                  lifetimeSpend={lifetimeSpend}
                  orderCount={orders?.length ?? 0}
                  wishlistCount={wishlistProducts.length}
                  recentOrders={(orders ?? []).slice(0, 3)}
                />
              )}
              {tab === "orders" && <OrdersList orders={orders} />}
              {tab === "wishlist" && <WishlistTab products={wishlistProducts} />}
              {tab === "settings" && <SettingsTab phone={user.phone} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

function Overview({
  email,
  phone,
  lifetimeSpend,
  orderCount,
  wishlistCount,
  recentOrders,
}: {
  email: string;
  phone: string;
  lifetimeSpend: number;
  orderCount: number;
  wishlistCount: number;
  recentOrders: ApiOrder[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { l: "Lifetime spend", v: fmtPaise(lifetimeSpend) },
          { l: "Orders placed", v: orderCount },
          { l: "Saved pieces", v: wishlistCount },
        ].map((s) => (
          <div key={s.l} className="p-5 rounded-2xl bg-[var(--color-cream)]">
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">{s.l}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-[var(--color-maroon-deep)]">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-noir)] to-[var(--color-maroon-deep)] text-[var(--color-ivory)] grid sm:grid-cols-[auto_1fr] gap-5 items-center">
        <span className="grid place-items-center h-16 w-16 rounded-full gradient-gold text-[var(--color-noir)]">
          <Icon name="sparkle" size={22} />
        </span>
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-bright)]">Atelier Card</p>
          <h3 className="mt-1 font-[family-name:var(--font-display)] text-2xl">Member since today ✨</h3>
          <p className="text-sm text-[var(--color-ivory)]/70 mt-1">
            {email} · {phone}
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-[family-name:var(--font-display)] text-2xl">Recent orders</h3>
          <Link href="/tracking" className="text-sm text-[var(--color-maroon)]">
            Track an order →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-[var(--color-fg-muted)]">
            You haven't placed any orders yet.{" "}
            <Link href="/collections" className="text-[var(--color-maroon)] underline">
              Browse the atelier
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((o) => (
              <Link
                key={o.id}
                href={`/tracking?order=${encodeURIComponent(o.number)}`}
                className="block p-5 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] flex items-center gap-4 hover:bg-[var(--color-cream)]/40 transition-colors"
              >
                {o.items[0]?.imageUrl ? (
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-[var(--color-cream)] flex-shrink-0">
                    <Image src={o.items[0].imageUrl} alt={o.items[0].title} fill sizes="80px" className="object-cover" />
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-[var(--color-cream)] flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--color-fg-muted)]">{o.number} · {formatDate(o.placedAt)}</p>
                  <p className="text-sm truncate">{o.items.map((i) => i.title).join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[var(--color-maroon-deep)]">{fmtPaise(o.total)}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[var(--color-cream)] text-[10px] uppercase tracking-wide">
                    {o.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersList({ orders }: { orders: ApiOrder[] | null }) {
  if (orders === null) {
    return <p className="text-sm text-[var(--color-fg-muted)]">Loading your orders…</p>;
  }
  if (orders.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-[var(--color-fg-muted)]">No orders yet.</p>
        <Link href="/collections" className="inline-block mt-4">
          <Button variant="primary">Browse the atelier</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[rgba(90,15,26,0.08)]">
            <div>
              <p className="font-[family-name:var(--font-display)] text-lg">{o.number}</p>
              <p className="text-xs text-[var(--color-fg-muted)]">Placed on {formatDate(o.placedAt)}</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[var(--color-cream)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-maroon)]">
              {o.status}
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {o.items.map((it) => (
              <div key={it.id} className="flex items-center gap-3">
                {it.imageUrl ? (
                  <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-[var(--color-cream)]">
                    <Image src={it.imageUrl} alt={it.title} fill sizes="60px" className="object-cover" />
                  </div>
                ) : (
                  <div className="h-14 w-14 rounded-lg bg-[var(--color-cream)]" />
                )}
                <div className="flex-1 text-sm">
                  <p>{it.title}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">
                    {it.productCode} · Qty {it.quantity} · {fmtPaise(it.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-medium">{fmtPaise(it.lineTotal)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Link href={`/tracking?order=${encodeURIComponent(o.number)}`} className="text-sm text-[var(--color-maroon)]">
              Track this order →
            </Link>
            <span className="font-[family-name:var(--font-display)] text-lg text-[var(--color-maroon-deep)]">
              {fmtPaise(o.total)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WishlistTab({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-[var(--color-fg-muted)]">
        Your wishlist is empty. Tap the heart on any saree to save it.
      </p>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
      {products.map((p) => (
        <Link key={p.id} href={`/product/${p.code}`} className="group block">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--color-cream)]">
            <Image
              src={p.image}
              alt={p.name}
              fill
              sizes="300px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <p className="mt-3 font-[family-name:var(--font-display)] text-lg">{p.name}</p>
          <p className="text-sm text-[var(--color-maroon-deep)]">₹{p.price.toLocaleString("en-IN")}</p>
        </Link>
      ))}
    </div>
  );
}

function SettingsTab({ phone }: { phone: string | null }) {
  return (
    <div className="space-y-4">
      {[
        { l: "WhatsApp updates", d: phone ? `Order updates sent to ${phone}` : "Add a phone number to enable" },
        { l: "Atelier letter", d: "Monthly newsletter — new collections, weaver stories" },
        { l: "Drop alerts", d: "Be the first to know when limited pieces drop" },
      ].map((s, i) => (
        <div
          key={s.l}
          className="flex items-center justify-between p-5 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)]"
        >
          <div>
            <p className="font-medium">{s.l}</p>
            <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">{s.d}</p>
          </div>
          <button
            type="button"
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
