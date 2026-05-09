"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthProvider";
import { adminApi } from "@/lib/api/admin";
import { getSocket } from "@/lib/socket/client";
import type { ApiAdminOverview } from "@/lib/api/types";
import { formatINR as formatRupees, relativeDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const fmtPaise = (paise: number) => formatRupees(Math.round(paise / 100));

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<ApiAdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pulse, setPulse] = useState<string | null>(null);

  // Initial fetch + revalidate every 30s as a safety net.
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const overview = await adminApi.overview();
        if (!cancelled) setData(overview);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      }
    };
    void load();
    const id = setInterval(load, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Live updates: re-fetch on inventory or order changes (debounced via simple flag).
  useEffect(() => {
    const socket = getSocket();
    let pending = false;
    const refresh = (kind: string) => {
      setPulse(kind);
      setTimeout(() => setPulse(null), 1200);
      if (pending) return;
      pending = true;
      setTimeout(async () => {
        try {
          setData(await adminApi.overview());
        } catch {
          /* ignore — keep current data */
        } finally {
          pending = false;
        }
      }, 600);
    };
    const onOrder = () => refresh("order");
    const onInventory = () => refresh("stock");
    const onAdminAlert = (payload: { kind?: string }) => refresh(payload.kind ?? "alert");
    socket.on("order:updated", onOrder);
    socket.on("inventory:updated", onInventory);
    socket.on("admin:alert", onAdminAlert);
    return () => {
      socket.off("order:updated", onOrder);
      socket.off("inventory:updated", onInventory);
      socket.off("admin:alert", onAdminAlert);
    };
  }, []);

  const greetingName = user?.firstName ?? "Admin";
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (!data) {
    return (
      <AdminShell title={`Good day, ${greetingName}`} subtitle={`Today · ${today}`}>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-[var(--color-cream)] animate-pulse" />
          ))}
        </div>
        {error && <p className="mt-6 text-sm text-[var(--color-maroon)]">{error}</p>}
      </AdminShell>
    );
  }

  const channelCounts = data.channelMix.reduce(
    (acc, c) => {
      acc[c.channel] = c.count;
      return acc;
    },
    {} as Record<string, number>,
  );
  const totalChannelOrders = Object.values(channelCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <AdminShell
      title={`Good day, ${greetingName}`}
      subtitle={`${today} · ${data.mode.payment === "demo" ? "Demo payments" : "Live payments"} · ${data.mode.tracking === "demo" ? "Simulated tracking" : "Live tracking"} · WhatsApp ${data.mode.whatsapp}`}
      actions={
        <div className="flex items-center gap-3">
          {pulse && (
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.28em] px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live · {pulse}
            </span>
          )}
          <Link href="/admin/products">
            <Button variant="primary" size="sm" iconLeft={<Icon name="plus" size={14} />}>
              New Product
            </Button>
          </Link>
        </div>
      }
    >
      {/* Top stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Revenue · this month"
          value={fmtPaise(data.revenue.thisMonth)}
          delta={`Today: ${fmtPaise(data.revenue.today)}`}
          positive
          icon="trending"
          accent="gold"
        />
        <StatCard
          label="Orders · last 7 days"
          value={String(data.orders.last7Days)}
          delta={`${data.orders.pending} awaiting confirmation`}
          icon="package"
          accent="maroon"
        />
        <StatCard
          label="Customers · active 30d"
          value={String(data.customers.activeLast30Days)}
          icon="users"
          accent="noir"
        />
        <StatCard
          label="Low-stock alerts"
          value={String(data.inventory.lowStock)}
          delta={data.inventory.lowStock > 0 ? "Restock recommended" : "Everything healthy"}
          positive={data.inventory.lowStock === 0}
          icon="alert"
          accent="maroon"
        />
      </div>

      {/* Revenue chart + channel mix */}
      <div className="mt-8 grid lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">Revenue</p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl">Last 7 days</h3>
            </div>
          </div>
          <RevenueChart series={data.revenueSeries} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="p-6 rounded-2xl bg-[var(--color-noir)] text-[var(--color-ivory)]"
        >
          <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-bright)]">Channel mix · 30d</p>
          <h3 className="font-[family-name:var(--font-display)] text-2xl mt-1">Where orders arrive</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {(["WEB", "WHATSAPP", "INSTAGRAM", "ADMIN"] as const).map((channel, i) => {
              const value = channelCounts[channel] ?? 0;
              const pct = Math.round((value / totalChannelOrders) * 100);
              return (
                <li key={channel}>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: ["#c9a96a", "#5a0f1a", "#9d7d3c", "#2a201c"][i] }}
                      />
                      {channel}
                    </span>
                    <span className="text-[var(--color-ivory)]/70">{value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${pct}%`,
                        background: ["#c9a96a", "#5a0f1a", "#9d7d3c", "#2a201c"][i],
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>

      {/* Recent orders + Top products */}
      <div className="mt-8 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">Orders</p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl">Recent activity</h3>
            </div>
            <Link href="/admin/orders" className="text-sm text-[var(--color-maroon)]">
              View all →
            </Link>
          </div>
          {data.recentOrders.length === 0 ? (
            <p className="text-sm text-[var(--color-fg-muted)]">No orders yet — they'll appear here in real time.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-fg-muted)]">
                <tr>
                  <th className="text-left pb-3">Order</th>
                  <th className="text-left pb-3">Customer</th>
                  <th className="text-left pb-3">Channel</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-right pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-[rgba(90,15,26,0.06)]">
                    <td className="py-3.5 font-medium">{o.number}</td>
                    <td className="py-3.5">
                      <p>
                        {o.user
                          ? [o.user.firstName, o.user.lastName].filter(Boolean).join(" ") || o.user.email
                          : "Guest"}
                      </p>
                      <p className="text-xs text-[var(--color-fg-muted)]">{relativeDate(o.placedAt)}</p>
                    </td>
                    <td className="py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <Icon
                          name={o.channel === "WHATSAPP" ? "whatsapp" : o.channel === "INSTAGRAM" ? "instagram" : "user"}
                          size={12}
                        />
                        {o.channel}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="py-3.5 text-right font-medium">{fmtPaise(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-[family-name:var(--font-display)] text-xl">Top sellers · 30d</h3>
            <Link href="/admin/products" className="text-xs text-[var(--color-maroon)]">
              All products →
            </Link>
          </div>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-[var(--color-fg-muted)]">No sales data yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.topProducts.map((t, i) => (
                <li key={t.productId} className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-display)] text-3xl text-gradient-gold w-8">
                    {i + 1}
                  </span>
                  {t.product?.images[0]?.url ? (
                    <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={t.product.images[0].url}
                        alt={t.product.title}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-[var(--color-cream)]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{t.product?.title ?? "—"}</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">
                      {t.unitsSold} sold · {fmtPaise(t.revenue)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function RevenueChart({ series }: { series: ApiAdminOverview["revenueSeries"] }) {
  if (series.length === 0) {
    return (
      <div className="h-56 grid place-items-center text-sm text-[var(--color-fg-muted)]">
        No revenue in the last 7 days yet.
      </div>
    );
  }
  const max = Math.max(...series.map((s) => s.revenue), 1);
  return (
    <div className="flex items-end justify-between gap-3 h-56">
      {series.map((s) => {
        const h = (s.revenue / max) * 100;
        const isMax = s.revenue === max;
        const day = new Date(s.day).toLocaleDateString("en-IN", { weekday: "short" });
        return (
          <div key={s.day} className="flex-1 flex flex-col items-center gap-2">
            <span
              className={cn(
                "text-[11px]",
                isMax ? "text-[var(--color-maroon)] font-medium" : "text-[var(--color-fg-muted)]",
              )}
            >
              {Math.round(s.revenue / 1000 / 100)}k
            </span>
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(4, h)}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "w-full rounded-t-xl",
                isMax ? "gradient-maroon" : "bg-[var(--color-cream-warm)]",
              )}
              style={{ minHeight: 4 }}
            />
            <span className="text-[10px] text-[var(--color-fg-muted)] uppercase tracking-wider">{day}</span>
          </div>
        );
      })}
    </div>
  );
}
