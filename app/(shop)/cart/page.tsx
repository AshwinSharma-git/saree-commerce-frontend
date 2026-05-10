"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useShop } from "@/lib/store/shop-store";
import { products as staticProducts } from "@/lib/data/products";
import { productsApi } from "@/lib/api/products";
import { adaptProduct } from "@/lib/api/adapt";
import { formatINR } from "@/lib/format";
import type { Product } from "@/types";

export default function CartPage() {
  const { cart, setQty, removeFromCart, clearCart } = useShop();
  const cartIds = useMemo(() => Object.keys(cart), [cart]);
  const [fetched, setFetched] = useState<Record<string, Product>>({});
  const [resolving, setResolving] = useState(false);

  // Resolve any cart ids that aren't in the static fallback by hitting the
  // live products API. Without this, products created via seed/admin (which
  // have Prisma cuids) render as "missing" and the page shows the empty
  // state even though the bag count says 1+.
  useEffect(() => {
    let cancelled = false;
    const missing = cartIds.filter(
      (id) => !staticProducts.find((p) => p.id === id) && !fetched[id],
    );
    if (missing.length === 0) return;
    setResolving(true);
    Promise.all(
      missing.map((id) =>
        productsApi
          .byId(id)
          .catch(() => productsApi.byCode(id).catch(() => null)),
      ),
    )
      .then((results) => {
        if (cancelled) return;
        const next: Record<string, Product> = { ...fetched };
        results.forEach((api, i) => {
          if (api) next[missing[i]] = adaptProduct(api);
        });
        setFetched(next);
      })
      .finally(() => {
        if (!cancelled) setResolving(false);
      });
    return () => {
      cancelled = true;
    };
  }, [cartIds, fetched]);

  const items = cartIds
    .map((id) => {
      const product = staticProducts.find((p) => p.id === id) ?? fetched[id];
      return product ? { product, qty: cart[id] } : null;
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);

  // Auto-prune stale ids that the API definitively could not resolve.
  // (Don't prune while we're still fetching — the UI would briefly flicker
  //  to empty before the resolved product lands.)
  const unresolved = !resolving && cartIds.length > items.length;
  useEffect(() => {
    if (!unresolved) return;
    cartIds.forEach((id) => {
      const known = staticProducts.find((p) => p.id === id) ?? fetched[id];
      if (!known) removeFromCart(id);
    });
  }, [unresolved, cartIds, fetched, removeFromCart]);

  const subtotal = items.reduce((sum, it) => sum + it.product.price * it.qty, 0);
  const shipping = subtotal > 0 && subtotal < 5000 ? 250 : 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  // Show loading while we resolve cart ids — otherwise the page flashes
  // the "empty bag" state before the API call lands.
  if (items.length === 0 && cartIds.length > 0 && resolving) {
    return (
      <Section className="!py-32 text-center">
        <div className="inline-flex items-center gap-3 text-[var(--color-fg-muted)]">
          <span className="h-4 w-4 rounded-full border-2 border-[var(--color-maroon)] border-t-transparent animate-spin" />
          <span className="text-sm tracking-wide">Loading your bag…</span>
        </div>
      </Section>
    );
  }
  if (items.length === 0) return <EmptyCart />;

  return (
    <Section className="!pt-8 !pb-24">
      <div className="mb-10">
        <Eyebrow>Your Bag</Eyebrow>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">Shopping Bag</h1>
        <p className="mt-2 text-[var(--color-fg-muted)]">
          Review your selected pieces of heritage. {items.length} {items.length === 1 ? "item" : "items"}.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-5">
          {items.map(({ product, qty }, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col sm:flex-row gap-5 p-5 rounded-2xl bg-[var(--color-surface)] luxury-shadow-soft ring-1 ring-[rgba(90,15,26,0.06)]"
            >
              <Link
                href={`/product/${product.id}`}
                className="relative h-40 sm:h-44 sm:w-40 flex-shrink-0 rounded-xl overflow-hidden bg-[var(--color-cream)]"
              >
                <Image src={product.image} alt={product.name} fill sizes="200px" className="object-cover" />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">{product.collection}</p>
                      <Link href={`/product/${product.id}`} className="font-[family-name:var(--font-display)] text-xl text-[var(--color-noir)] hover:text-[var(--color-maroon)]">
                        {product.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-2 -mt-1 -mr-1 text-[var(--color-fg-muted)] hover:text-[var(--color-maroon)] transition-colors"
                      aria-label="Remove"
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-fg-muted)]">{product.fabric} · Code {product.code}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {product.colors.slice(0, 3).map((c) => (
                      <span key={c} className="h-3 w-3 rounded-full ring-1 ring-black/10" style={{ background: c }} />
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-end">
                  <div className="flex items-center rounded-full ring-1 ring-[rgba(90,15,26,0.18)]">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      className="px-3 py-2 hover:bg-[var(--color-cream)] transition-colors rounded-l-full"
                    >
                      <Icon name="minus" size={12} />
                    </button>
                    <span className="px-4 text-sm font-medium min-w-[2.5rem] text-center">{qty}</span>
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      className="px-3 py-2 hover:bg-[var(--color-cream)] transition-colors rounded-r-full"
                    >
                      <Icon name="plus" size={12} />
                    </button>
                  </div>
                  <p className="text-lg font-[family-name:var(--font-display)] text-[var(--color-maroon-deep)]">
                    {formatINR(product.price * qty)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          <div className="pt-4 flex items-center justify-between text-sm">
            <Link href="/collections" className="inline-flex items-center gap-2 text-[var(--color-maroon)]">
              <Icon name="arrow-left" size={14} /> Continue shopping
            </Link>
            <button onClick={clearCart} className="text-[var(--color-fg-muted)] hover:text-[var(--color-maroon)]">
              Clear bag
            </button>
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 p-7 rounded-2xl bg-[var(--color-noir)] text-[var(--color-ivory)]">
            <h2 className="font-[family-name:var(--font-display)] text-2xl mb-6">Order summary</h2>
            <div className="space-y-3 text-sm">
              <Row label="Subtotal" value={formatINR(subtotal)} />
              <Row label="Tax (5% GST)" value={formatINR(tax)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Complimentary" : formatINR(shipping)}
                highlight={shipping === 0}
              />
            </div>
            <div className="my-5 h-px gradient-gold opacity-50" />
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-[0.28em] text-[var(--color-ivory)]/65">Total</span>
              <span className="font-[family-name:var(--font-display)] text-3xl text-gradient-gold">
                {formatINR(total)}
              </span>
            </div>
            <Link href="/checkout">
              <Button variant="gold" size="lg" fullWidth className="mt-6" iconRight={<Icon name="arrow-right" size={16} />}>
                Proceed to checkout
              </Button>
            </Link>
            <div className="mt-6 grid grid-cols-2 gap-2 text-[10px] text-[var(--color-ivory)]/55 tracking-wide">
              <span className="flex items-center gap-1.5">
                <Icon name="lock" size={12} /> 256-bit secure
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="package" size={12} /> Linen-wrapped
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="truck" size={12} /> Express ship
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="shield" size={12} /> 14-day returns
              </span>
            </div>
          </div>
        </aside>
      </div>
    </Section>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[var(--color-ivory)]/70">{label}</span>
      <span className={highlight ? "text-[var(--color-gold-bright)] font-medium" : "text-[var(--color-ivory)]"}>
        {value}
      </span>
    </div>
  );
}

function EmptyCart() {
  return (
    <Section className="!py-32 text-center">
      <div className="max-w-md mx-auto">
        <span className="grid place-items-center h-20 w-20 rounded-full bg-[var(--color-cream)] text-[var(--color-maroon)] mx-auto mb-6">
          <Icon name="bag" size={28} />
        </span>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-noir)]">Your bag is waiting</h1>
        <p className="mt-3 text-[var(--color-fg-muted)]">
          Begin curating your heirloom moments — every drape tells a story.
        </p>
        <Link href="/collections" className="inline-block mt-6">
          <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" size={16} />}>
            Browse collections
          </Button>
        </Link>
      </div>
    </Section>
  );
}
