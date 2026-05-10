"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useShop } from "@/lib/store/shop-store";
import { products as staticProducts } from "@/lib/data/products";
import { productsApi } from "@/lib/api/products";
import { adaptProduct } from "@/lib/api/adapt";
import type { Product } from "@/types";

export default function WishlistPage() {
  return (
    <RequireAuth>
      <WishlistInner />
    </RequireAuth>
  );
}

function WishlistInner() {
  const { wishlist } = useShop();
  const wishlistIds = useMemo(() => wishlist, [wishlist]);
  const [fetched, setFetched] = useState<Record<string, Product>>({});
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());
  const resolving = wishlistIds.some(
    (id) => !staticProducts.find((p) => p.id === id) && !fetched[id] && !attemptedIds.has(id),
  );

  // Same fix as the cart page: live products have Prisma cuids that don't
  // appear in the static fallback. Track attempted ids so we don't refetch
  // forever or race with renders.
  useEffect(() => {
    let cancelled = false;
    const missing = wishlistIds.filter(
      (id) =>
        !staticProducts.find((p) => p.id === id) &&
        !fetched[id] &&
        !attemptedIds.has(id),
    );
    if (missing.length === 0) return;
    setAttemptedIds((prev) => {
      const next = new Set(prev);
      missing.forEach((id) => next.add(id));
      return next;
    });
    Promise.all(
      missing.map((id) =>
        productsApi
          .byId(id)
          .catch(() => productsApi.byCode(id).catch(() => null)),
      ),
    ).then((results) => {
      if (cancelled) return;
      const next: Record<string, Product> = {};
      results.forEach((api, i) => {
        if (api) next[missing[i]] = adaptProduct(api);
      });
      if (Object.keys(next).length > 0) {
        setFetched((prev) => ({ ...prev, ...next }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [wishlistIds, fetched, attemptedIds]);

  const items = wishlistIds
    .map((id) => staticProducts.find((p) => p.id === id) ?? fetched[id])
    .filter((p): p is Product => Boolean(p));

  return (
    <Section className="!pt-8 !pb-24">
      <Eyebrow>Saved for Later</Eyebrow>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">Your wishlist</h1>
      <p className="mt-2 text-[var(--color-fg-muted)] max-w-xl">
        Pieces you&rsquo;ve fallen in love with. We&rsquo;ll let you know if they go on a private edit.
      </p>

      {items.length === 0 && wishlistIds.length > 0 && resolving ? (
        <div className="mt-16 inline-flex items-center gap-3 text-[var(--color-fg-muted)]">
          <span className="h-4 w-4 rounded-full border-2 border-[var(--color-maroon)] border-t-transparent animate-spin" />
          <span className="text-sm tracking-wide">Loading your saved pieces…</span>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-16 max-w-md text-center mx-auto">
          <span className="grid place-items-center h-20 w-20 rounded-full bg-[var(--color-cream)] text-[var(--color-maroon)] mx-auto mb-6">
            <Icon name="heart" size={28} />
          </span>
          <p className="text-[var(--color-fg-muted)]">Your wishlist is waiting for its first heirloom.</p>
          <Link href="/collections" className="inline-block mt-5">
            <Button variant="primary" iconRight={<Icon name="arrow-right" size={16} />}>
              Browse the atelier
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </Section>
  );
}
