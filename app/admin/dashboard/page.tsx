"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { StatusPill } from "@/components/admin/StatusPill";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { orders, insights, monthlyRevenue, channelMix } from "@/lib/data/orders";
import { products } from "@/lib/data/products";
import { formatINR, formatNumber, relativeDate } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function AdminDashboard() {
  const revenueThisMonth = monthlyRevenue[monthlyRevenue.length - 1].value;
  const revenuePrev = monthlyRevenue[monthlyRevenue.length - 2].value;
  const revenueDelta = (((revenueThisMonth - revenuePrev) / revenuePrev) * 100).toFixed(1);
  const lowStock = products.filter((p) => p.stock <= 5);

  return (
    <AdminShell
      title="Good evening, Sanjay"
      subtitle="Here's how the atelier is doing today · 6 May 2026"
      actions={
        <Button variant="primary" size="sm" iconLeft={<Icon name="plus" size={14} />}>
          New Product
        </Button>
      }
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Revenue · this month" value={formatINR(revenueThisMonth)} delta={`+${revenueDelta}% vs last month`} positive icon="trending" accent="gold" />
        <StatCard label="Orders this week" value="42" delta="+18% week-over-week" positive icon="package" accent="maroon" />
        <StatCard label="Active customers" value={formatNumber(1284)} delta="+12 VIPs added" positive icon="users" accent="noir" />
        <StatCard label="Low-stock alerts" value={String(lowStock.length)} delta="Restock recommended" icon="alert" accent="maroon" />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">Revenue</p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl">Last 7 months</h3>
            </div>
            <div className="flex gap-2 text-xs">
              {["7M", "1Y", "All"].map((p, i) => (
                <button
                  key={p}
                  className={cn(
                    "px-3 py-1.5 rounded-full",
                    i === 0
                      ? "bg-[var(--color-noir)] text-[var(--color-gold-bright)]"
                      : "ring-1 ring-[rgba(90,15,26,0.12)] text-[var(--color-fg-muted)]",
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <RevenueChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 rounded-2xl bg-[var(--color-noir)] text-[var(--color-ivory)]"
        >
          <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-bright)]">Channel mix</p>
          <h3 className="font-[family-name:var(--font-display)] text-2xl mt-1">Where orders come from</h3>
          <ChannelDonut />
          <ul className="mt-4 space-y-2 text-sm">
            {channelMix.map((c, i) => (
              <li key={c.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: ["#c9a96a", "#5a0f1a", "#9d7d3c"][i] }}
                  />
                  {c.name}
                </span>
                <span className="text-[var(--color-ivory)]/70">{c.value}%</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">Orders</p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl">Recent activity</h3>
            </div>
            <Link href="/admin/orders" className="text-sm text-[var(--color-maroon)]">View all →</Link>
          </div>
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
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id} className="border-t border-[rgba(90,15,26,0.06)]">
                  <td className="py-3.5 font-medium">{o.id}</td>
                  <td className="py-3.5">
                    <p>{o.customer}</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">{relativeDate(o.placedAt)}</p>
                  </td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <Icon name={o.channel === "WhatsApp" ? "whatsapp" : o.channel === "Instagram" ? "instagram" : "user"} size={12} />
                      {o.channel}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <StatusPill status={o.status} />
                  </td>
                  <td className="py-3.5 text-right font-medium">{formatINR(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-cream-warm)]/40 to-transparent ring-1 ring-[rgba(201,169,106,0.3)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="grid place-items-center h-8 w-8 rounded-full gradient-gold text-[var(--color-noir)]">
              <Icon name="ai" size={14} />
            </span>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">Atelier AI</p>
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl">Today&rsquo;s insights</h3>
          <ul className="mt-5 space-y-4">
            {insights.map((i) => (
              <li key={i.id} className="flex gap-3">
                <span className={cn(
                  "mt-1 h-2 w-2 rounded-full flex-shrink-0",
                  i.impact === "high" ? "bg-[var(--color-maroon)]" : "bg-[var(--color-gold)]",
                )} />
                <div>
                  <p className="text-sm font-medium">{i.title}</p>
                  <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">{i.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-[family-name:var(--font-display)] text-xl">Low-stock alerts</h3>
            <Link href="/admin/inventory" className="text-sm text-[var(--color-maroon)]">Manage →</Link>
          </div>
          <ul className="space-y-3">
            {lowStock.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-cream)]">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                  <Image src={p.image} alt={p.name} fill sizes="60px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{p.name}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">{p.code} · {p.fabric}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[var(--color-maroon)]/10 text-[var(--color-maroon)] text-xs font-medium">
                  {p.stock} left
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft">
          <h3 className="font-[family-name:var(--font-display)] text-xl mb-5">Best-sellers this week</h3>
          <ul className="space-y-3">
            {products.filter((p) => p.isBestseller).map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="font-[family-name:var(--font-display)] text-3xl text-gradient-gold w-8">{i + 1}</span>
                <div className="relative h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={p.image} alt={p.name} fill sizes="60px" className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{p.name}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">{formatINR(p.price)}</p>
                </div>
                <span className="text-xs text-emerald-700 flex items-center gap-1">
                  <Icon name="trending" size={12} /> +{30 - i * 6}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}

function RevenueChart() {
  const max = Math.max(...monthlyRevenue.map((m) => m.value));
  const w = 600;
  const h = 200;
  const step = w / (monthlyRevenue.length - 1);
  const points = monthlyRevenue.map((m, i) => [i * step, h - (m.value / max) * (h - 30)]);
  const path = points.reduce((acc, [x, y], i) => acc + (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`), "");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h + 24}`} className="w-full h-auto">
      <defs>
        <linearGradient id="rev-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#c9a96a" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#c9a96a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#rev-area)" />
      <motion.path
        d={path}
        stroke="#5a0f1a"
        strokeWidth={2.4}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      {points.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={4} fill="#5a0f1a" />
          <text x={x} y={h + 18} textAnchor="middle" fontSize="11" fill="#4a3f37">
            {monthlyRevenue[i].month}
          </text>
        </g>
      ))}
    </svg>
  );
}

function ChannelDonut() {
  const total = channelMix.reduce((s, c) => s + c.value, 0);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const colors = ["#c9a96a", "#5a0f1a", "#9d7d3c"];
  const segments = channelMix.reduce<{ name: string; dash: number; offset: number; color: string }[]>(
    (acc, c, i) => {
      const dash = (c.value / total) * circumference;
      const offset = acc.reduce((s, x) => s + x.dash, 0);
      acc.push({ name: c.name, dash, offset, color: colors[i] });
      return acc;
    },
    [],
  );
  return (
    <div className="mt-5 flex justify-center">
      <svg width={170} height={170} viewBox="0 0 170 170" className="-rotate-90">
        <circle cx={85} cy={85} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={18} />
        {segments.map((s, i) => (
          <motion.circle
            key={s.name}
            cx={85}
            cy={85}
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth={18}
            strokeDasharray={`${s.dash} ${circumference}`}
            strokeDashoffset={-s.offset}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${s.dash} ${circumference}` }}
            transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </svg>
    </div>
  );
}

