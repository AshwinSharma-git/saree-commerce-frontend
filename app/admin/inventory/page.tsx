"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatCard } from "@/components/admin/StatCard";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { inventoryApi, type InventoryRow } from "@/lib/api/admin";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/cn";

const fmtPaise = (paise: number) => formatINR(Math.round(paise / 100));

export default function InventoryPage() {
  const [rows, setRows] = useState<InventoryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const list = await inventoryApi.list({ pageSize: 100 });
      setRows(list);
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRestock = async (row: InventoryRow) => {
    const input = window.prompt(`Restock ${row.product.title} (${row.product.code})\nQuantity to add:`, "5");
    if (!input) return;
    const qty = Number.parseInt(input, 10);
    if (!Number.isFinite(qty) || qty <= 0) {
      window.alert("Quantity must be a positive whole number.");
      return;
    }
    try {
      setBusyId(row.id);
      await inventoryApi.restock(row.productId, qty, "Restock from admin dashboard");
      await load();
    } catch (err) {
      window.alert(`Restock failed: ${(err as Error).message}`);
    } finally {
      setBusyId(null);
    }
  };

  const onExportCsv = () => {
    if (!rows || rows.length === 0) return;
    const header = ["Code", "Title", "Fabric", "Collection", "Price (INR)", "On hand", "Reserved", "Reorder point"];
    const escape = (v: string | number) => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const lines = [
      header.join(","),
      ...rows.map((r) =>
        [
          r.product.code,
          r.product.title,
          r.product.fabric,
          r.product.collection,
          Math.round(r.product.price / 100),
          r.onHand,
          r.reserved,
          r.reorderPoint,
        ]
          .map(escape)
          .join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rajavastra-stock-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const sorted = rows ? [...rows].sort((a, b) => a.onHand - b.onHand) : null;
  const totalUnits = rows?.reduce((s, r) => s + r.onHand, 0) ?? 0;
  const totalValuePaise = rows?.reduce((s, r) => s + r.onHand * r.product.price, 0) ?? 0;
  const lowCount = rows?.filter((r) => r.onHand > 0 && r.onHand <= r.reorderPoint).length ?? 0;
  const outCount = rows?.filter((r) => r.onHand === 0).length ?? 0;

  return (
    <AdminShell
      title="Inventory"
      subtitle="Real-time stock across the atelier"
      actions={
        <Button
          variant="secondary"
          size="sm"
          iconLeft={<Icon name="package" size={14} />}
          onClick={onExportCsv}
          disabled={!rows || rows.length === 0}
        >
          Stock-take CSV
        </Button>
      }
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total units" value={String(totalUnits)} icon="boxes" accent="noir" />
        <StatCard label="Inventory value" value={fmtPaise(totalValuePaise)} icon="trending" accent="gold" />
        <StatCard
          label="Low-stock alerts"
          value={String(lowCount)}
          delta={lowCount > 0 ? "Restock soon" : "All healthy"}
          icon="alert"
          accent="maroon"
        />
        <StatCard label="Out of stock" value={String(outCount)} icon="alert" accent="maroon" />
      </div>

      {error && (
        <p className="mt-6 text-sm text-[var(--color-maroon)]">Couldn&rsquo;t load inventory: {error}</p>
      )}

      <div className="mt-8 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] overflow-hidden luxury-shadow-soft">
        <div className="p-5 flex items-center justify-between border-b border-[rgba(90,15,26,0.06)]">
          <h3 className="font-[family-name:var(--font-display)] text-xl">Stock by product</h3>
          <span className="text-xs text-[var(--color-fg-muted)]">Sorted by lowest stock</span>
        </div>
        {!sorted ? (
          <div className="p-8 text-center text-sm text-[var(--color-fg-muted)]">Loading inventory…</div>
        ) : sorted.length === 0 ? (
          <div className="p-8 text-center text-sm text-[var(--color-fg-muted)]">No products yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-fg-muted)]">
              <tr>
                <th className="text-left px-5 py-3.5">Product</th>
                <th className="text-left px-5 py-3.5">Code</th>
                <th className="text-right px-5 py-3.5">Price</th>
                <th className="text-right px-5 py-3.5">Stock</th>
                <th className="px-5 py-3.5">Health</th>
                <th className="px-5 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => {
                const pct = Math.min(100, (r.onHand / Math.max(r.reorderPoint * 4, 20)) * 100);
                const tone =
                  r.onHand === 0
                    ? "bg-[var(--color-maroon)]"
                    : r.onHand <= r.reorderPoint
                      ? "bg-[var(--color-gold)]"
                      : "bg-emerald-600";
                const imageUrl = r.product.images[0]?.url;
                return (
                  <tr key={r.id} className="border-t border-[rgba(90,15,26,0.06)]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[var(--color-cream)] flex-shrink-0">
                          {imageUrl && (
                            <Image src={imageUrl} alt={r.product.title} fill sizes="60px" className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{r.product.title}</p>
                          <p className="text-xs text-[var(--color-fg-muted)]">{r.product.collection}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[var(--color-fg-muted)]">{r.product.code}</td>
                    <td className="px-5 py-3.5 text-right font-medium">{fmtPaise(r.product.price)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={cn("font-medium", r.onHand <= r.reorderPoint ? "text-[var(--color-maroon)]" : "text-[var(--color-noir)]")}>
                        {r.onHand}
                      </span>
                      {r.reserved > 0 && (
                        <span className="ml-1 text-[10px] text-[var(--color-fg-muted)]">({r.reserved} reserved)</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="h-2 w-32 rounded-full bg-[var(--color-cream)] overflow-hidden">
                        <div className={cn("h-full transition-all", tone)} style={{ width: `${pct}%` }} />
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onRestock(r)}
                        disabled={busyId === r.id}
                        className="px-3 py-1.5 rounded-full bg-[var(--color-maroon)] text-[var(--color-ivory)] text-xs hover:bg-[var(--color-maroon-deep)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {busyId === r.id ? "Restocking…" : "Restock"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
