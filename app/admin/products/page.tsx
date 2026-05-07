"use client";

import { useState } from "react";
import Image from "next/image";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { products } from "@/lib/data/products";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function AdminProductsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) =>
    !search ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminShell
      title="Products"
      subtitle={`${products.length} pieces in your atelier · ${products.filter((p) => p.isLimited).length} limited editions`}
      actions={
        <Button variant="primary" size="sm" iconLeft={<Icon name="plus" size={14} />}>
          Add product
        </Button>
      }
    >
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div className="relative">
          <Icon name="search" size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code or name…"
            className="pl-10 pr-4 py-2.5 rounded-full bg-[var(--color-cream)] text-sm w-72 focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)]/30"
          />
        </div>
        <div className="flex gap-1 p-1 rounded-full bg-[var(--color-cream)]">
          <button
            onClick={() => setView("grid")}
            className={cn("px-4 py-1.5 rounded-full text-xs", view === "grid" && "bg-[var(--color-noir)] text-[var(--color-gold-bright)]")}
          >
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("px-4 py-1.5 rounded-full text-xs", view === "list" && "bg-[var(--color-noir)] text-[var(--color-gold-bright)]")}
          >
            List
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] overflow-hidden luxury-shadow-soft">
              <div className="relative aspect-[3/4] bg-[var(--color-cream)]">
                <Image src={p.image} alt={p.name} fill sizes="300px" className="object-cover" />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {p.isLimited && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--color-noir)] text-[var(--color-gold-bright)] text-[10px] uppercase tracking-wide">Limited</span>
                  )}
                  {p.stock <= 5 && (
                    <span className="px-2 py-0.5 rounded-full bg-[var(--color-maroon)] text-[var(--color-ivory)] text-[10px] uppercase tracking-wide">Low stock</span>
                  )}
                </div>
                <button className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full bg-[var(--color-ivory)]/90 text-[var(--color-noir)]">
                  <Icon name="settings" size={14} />
                </button>
              </div>
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold-deep)]">{p.code}</p>
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-xs text-[var(--color-fg-muted)]">{p.fabric}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-medium text-[var(--color-maroon-deep)]">{formatINR(p.price)}</span>
                  <span className="text-xs text-[var(--color-fg-muted)]">{p.stock} stock</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-fg-muted)] bg-[var(--color-cream)]">
              <tr>
                <th className="text-left px-5 py-3.5">Product</th>
                <th className="text-left px-5 py-3.5">Code</th>
                <th className="text-left px-5 py-3.5">Fabric</th>
                <th className="text-right px-5 py-3.5">Price</th>
                <th className="text-right px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-[rgba(90,15,26,0.06)]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[var(--color-cream)] flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill sizes="60px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-[var(--color-fg-muted)]">{p.collection}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs">{p.code}</td>
                  <td className="px-5 py-3.5 text-xs">{p.fabric}</td>
                  <td className="px-5 py-3.5 text-right font-medium">{formatINR(p.price)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={cn("text-xs", p.stock <= 5 ? "text-[var(--color-maroon)] font-medium" : "text-[var(--color-fg-muted)]")}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button className="p-2 rounded-full hover:bg-[var(--color-cream)]">
                      <Icon name="settings" size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
