"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusPill } from "@/components/admin/StatusPill";
import { Icon } from "@/components/ui/Icon";
import { orders } from "@/lib/data/orders";
import { formatINR, formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const statusFilters = ["All", "Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== "All" && o.status !== filter) return false;
      if (search) {
        const t = search.toLowerCase();
        if (!o.id.toLowerCase().includes(t) && !o.customer.toLowerCase().includes(t)) return false;
      }
      return true;
    });
  }, [filter, search]);

  return (
    <AdminShell title="Orders" subtitle={`${orders.length} total orders · ${orders.filter((o) => o.status === "Placed").length} pending action`}>
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-4 py-2 rounded-full text-xs transition-all",
                filter === s
                  ? "bg-[var(--color-noir)] text-[var(--color-gold-bright)]"
                  : "bg-[var(--color-cream)] text-[var(--color-noir)] hover:bg-[var(--color-cream-warm)]",
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
            placeholder="Search order id or customer…"
            className="pl-10 pr-4 py-2.5 rounded-full bg-[var(--color-cream)] text-sm w-64 focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)]/30"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="p-5 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {o.items.slice(0, 3).map((it) => (
                    <div key={it.productId} className="relative h-12 w-12 rounded-lg overflow-hidden ring-2 ring-[var(--color-ivory)]">
                      <Image src={it.image} alt={it.name} fill sizes="60px" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-medium">{o.id}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">{o.customer} · {formatDate(o.placedAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-fg-muted)]">
                  <Icon name={o.channel === "WhatsApp" ? "whatsapp" : o.channel === "Instagram" ? "instagram" : "user"} size={12} />
                  {o.channel}
                </span>
                <StatusPill status={o.status} />
                <p className="font-medium">{formatINR(o.total)}</p>
                <button className="p-2 rounded-full hover:bg-[var(--color-cream)]">
                  <Icon name="chevron-right" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-[var(--color-fg-muted)]">No orders match your filters.</p>
        )}
      </div>
    </AdminShell>
  );
}
