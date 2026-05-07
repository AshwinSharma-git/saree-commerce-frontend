"use client";

import { motion } from "framer-motion";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { Icon } from "@/components/ui/Icon";
import { monthlyRevenue, channelMix, insights } from "@/lib/data/orders";
import { products } from "@/lib/data/products";
import { formatINR } from "@/lib/format";

export default function AnalyticsPage() {
  const revenueThisMonth = monthlyRevenue[monthlyRevenue.length - 1].value;
  const total = monthlyRevenue.reduce((s, m) => s + m.value, 0);

  return (
    <AdminShell title="Analytics" subtitle="Atelier performance & customer behaviour">
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Revenue · 7M" value={formatINR(total)} delta="+24% YoY" positive icon="trending" accent="gold" />
        <StatCard label="Avg order value" value={formatINR(18450)} delta="+₹1,200 vs last quarter" positive icon="package" accent="maroon" />
        <StatCard label="Conversion rate" value="3.8%" delta="+0.6 pts" positive icon="ai" accent="noir" />
        <StatCard label="Returning customers" value="48%" delta="+4 pts vs last quarter" positive icon="heart" accent="maroon" />
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft">
          <h3 className="font-[family-name:var(--font-display)] text-xl mb-1">Revenue trajectory</h3>
          <p className="text-xs text-[var(--color-fg-muted)] mb-6">Monthly revenue · last 7 months</p>
          <BarChart />
        </div>

        <div className="p-6 rounded-2xl bg-[var(--color-noir)] text-[var(--color-ivory)]">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-bright)]">Channel split</p>
          <h3 className="font-[family-name:var(--font-display)] text-xl mt-1">Where the orders come from</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {channelMix.map((c) => (
              <li key={c.name}>
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Icon name={c.name === "WhatsApp" ? "whatsapp" : c.name === "Instagram" ? "instagram" : "user"} size={12} className="text-[var(--color-gold-bright)]" />
                    {c.name}
                  </span>
                  <span className="text-[var(--color-ivory)]/70">{c.value}%</span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.value}%` }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full gradient-gold"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs text-[var(--color-ivory)]/65 mb-2">This month</p>
            <p className="font-[family-name:var(--font-display)] text-3xl text-gradient-gold">{formatINR(revenueThisMonth)}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-cream-warm)]/40 to-transparent ring-1 ring-[rgba(201,169,106,0.3)]">
          <div className="flex items-center gap-2 mb-3">
            <span className="grid place-items-center h-8 w-8 rounded-full gradient-gold text-[var(--color-noir)]">
              <Icon name="ai" size={14} />
            </span>
            <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">AI insights</p>
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-xl">Recommendations from Atelier AI</h3>
          <ul className="mt-5 space-y-4">
            {insights.map((i) => (
              <li key={i.id} className="p-4 rounded-xl bg-[var(--color-ivory)]">
                <p className="text-sm font-medium">{i.title}</p>
                <p className="text-xs text-[var(--color-fg-muted)] mt-1">{i.description}</p>
                <span className="inline-block mt-3 px-2 py-0.5 rounded-full bg-[var(--color-cream)] text-[10px] uppercase tracking-wide text-[var(--color-maroon-deep)]">
                  {i.category}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft">
          <h3 className="font-[family-name:var(--font-display)] text-xl mb-5">Top-selling fabrics</h3>
          <ul className="space-y-3">
            {Array.from(
              products.reduce((acc, p) => {
                const cur = acc.get(p.fabric) ?? { count: 0, revenue: 0 };
                acc.set(p.fabric, { count: cur.count + 1, revenue: cur.revenue + p.price });
                return acc;
              }, new Map<string, { count: number; revenue: number }>()),
            )
              .sort((a, b) => b[1].revenue - a[1].revenue)
              .slice(0, 5)
              .map(([fabric, stats], i) => (
                <li key={fabric}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{fabric}</span>
                    <span className="text-[var(--color-fg-muted)]">{formatINR(stats.revenue)}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-[var(--color-cream)] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${100 - i * 14}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className="h-full gradient-maroon"
                    />
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </AdminShell>
  );
}

function BarChart() {
  const max = Math.max(...monthlyRevenue.map((m) => m.value));
  return (
    <div className="flex items-end justify-between gap-3 h-56">
      {monthlyRevenue.map((m, i) => {
        const h = (m.value / max) * 100;
        const isMax = m.value === max;
        return (
          <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
            <span className={`text-[11px] ${isMax ? "text-[var(--color-maroon)] font-medium" : "text-[var(--color-fg-muted)]"}`}>
              {Math.round(m.value / 1000)}k
            </span>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full rounded-t-xl ${isMax ? "gradient-maroon" : "bg-[var(--color-cream-warm)]"}`}
              style={{ minHeight: 4 }}
            />
            <span className="text-[10px] text-[var(--color-fg-muted)] uppercase tracking-wider">{m.month}</span>
          </div>
        );
      })}
    </div>
  );
}
