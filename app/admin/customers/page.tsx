"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { Icon } from "@/components/ui/Icon";
import { customers } from "@/lib/data/orders";
import { formatINR, formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const segmentTones: Record<string, string> = {
  VIP: "gradient-gold text-[var(--color-noir)]",
  Regular: "bg-[var(--color-cream-warm)] text-[var(--color-noir)]",
  New: "bg-emerald-50 text-emerald-700",
};

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState<"All" | "VIP" | "Regular" | "New">("All");
  const filtered = customers.filter((c) => {
    if (segment !== "All" && c.segment !== segment) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <AdminShell title="Customers" subtitle={`${customers.length} customers in the atelier`}>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total customers" value="1,284" delta="+38 this month" positive icon="users" accent="noir" />
        <StatCard label="VIP segment" value="92" delta="+12 this month" positive icon="sparkle" accent="gold" />
        <StatCard label="Avg lifetime value" value={formatINR(74200)} delta="+8% YoY" positive icon="trending" accent="maroon" />
        <StatCard label="Repeat rate" value="48%" delta="+4% vs last quarter" positive icon="heart" accent="maroon" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          {(["All", "VIP", "Regular", "New"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSegment(s)}
              className={cn(
                "px-4 py-2 rounded-full text-xs",
                segment === s ? "bg-[var(--color-noir)] text-[var(--color-gold-bright)]" : "bg-[var(--color-cream)] text-[var(--color-noir)]",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative">
          <Icon name="search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name…"
            className="pl-10 pr-4 py-2.5 rounded-full bg-[var(--color-cream)] text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)]/30"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] overflow-hidden luxury-shadow-soft">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-fg-muted)] bg-[var(--color-cream)]">
            <tr>
              <th className="text-left px-5 py-3.5">Customer</th>
              <th className="text-left px-5 py-3.5">Channel</th>
              <th className="text-left px-5 py-3.5">City</th>
              <th className="text-right px-5 py-3.5">Orders</th>
              <th className="text-right px-5 py-3.5">Lifetime spend</th>
              <th className="px-5 py-3.5">Segment</th>
              <th className="px-5 py-3.5">Joined</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t border-[rgba(90,15,26,0.06)]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full grid place-items-center gradient-maroon text-[var(--color-gold-bright)] font-medium text-sm">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs text-[var(--color-fg-muted)]">{c.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs">
                    <Icon name={c.channel === "WhatsApp" ? "whatsapp" : c.channel === "Instagram" ? "instagram" : "user"} size={12} />
                    {c.channel}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs">{c.city}</td>
                <td className="px-5 py-4 text-right font-medium">{c.totalOrders}</td>
                <td className="px-5 py-4 text-right font-medium text-[var(--color-maroon-deep)]">{formatINR(c.totalSpend)}</td>
                <td className="px-5 py-4">
                  <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-medium", segmentTones[c.segment])}>
                    {c.segment}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-[var(--color-fg-muted)]">{formatDate(c.joinedAt)}</td>
                <td className="px-5 py-4 text-right">
                  <button className="p-2 rounded-full hover:bg-[var(--color-cream)]">
                    <Icon name="chevron-right" size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
