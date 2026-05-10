"use client";

import Image from "next/image";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { products } from "@/lib/data/products";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/cn";

export default function InventoryPage() {
  const sorted = [...products].sort((a, b) => a.stock - b.stock);
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const totalValue = products.reduce((s, p) => s + p.stock * p.price, 0);
  const lowCount = products.filter((p) => p.stock <= 5).length;

  return (
    <AdminShell title="Inventory" subtitle="Real-time stock across the atelier" actions={
      <Button variant="secondary" size="sm" iconLeft={<Icon name="package" size={14} />}>Stock-take CSV</Button>
    }>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total units" value={String(totalUnits)} icon="boxes" accent="noir" />
        <StatCard label="Inventory value" value={formatINR(totalValue)} icon="trending" accent="gold" />
        <StatCard label="Low-stock alerts" value={String(lowCount)} delta="Restock soon" icon="alert" accent="maroon" />
        <StatCard label="Out of stock" value={String(products.filter((p) => p.stock === 0).length)} icon="alert" accent="maroon" />
      </div>

      <div className="mt-8 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] overflow-hidden luxury-shadow-soft">
        <div className="p-5 flex items-center justify-between border-b border-[rgba(90,15,26,0.06)]">
          <h3 className="font-[family-name:var(--font-display)] text-xl">Stock by product</h3>
          <span className="text-xs text-[var(--color-fg-muted)]">Sorted by lowest stock</span>
        </div>
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-fg-muted)]">
            <tr>
              <th className="text-left px-5 py-3.5">Product</th>
              <th className="text-left px-5 py-3.5">SKU</th>
              <th className="text-right px-5 py-3.5">Price</th>
              <th className="text-right px-5 py-3.5">Stock</th>
              <th className="px-5 py-3.5">Health</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const pct = Math.min(100, (p.stock / 30) * 100);
              const tone = p.stock <= 5 ? "bg-[var(--color-maroon)]" : p.stock <= 15 ? "bg-[var(--color-gold)]" : "bg-emerald-600";
              return (
                <tr key={p.id} className="border-t border-[rgba(90,15,26,0.06)]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[var(--color-cream)] flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill sizes="60px" className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-[var(--color-fg-muted)]">{p.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-[var(--color-fg-muted)]">{p.sku}</td>
                  <td className="px-5 py-3.5 text-right font-medium">{formatINR(p.price)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={cn("font-medium", p.stock <= 5 ? "text-[var(--color-maroon)]" : "text-[var(--color-noir)]")}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="h-2 w-32 rounded-full bg-[var(--color-cream)] overflow-hidden">
                      <div className={cn("h-full", tone)} style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {p.stock <= 5 && (
                      <button className="px-3 py-1.5 rounded-full bg-[var(--color-maroon)] text-[var(--color-ivory)] text-xs">
                        Restock
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
