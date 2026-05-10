"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useShop } from "@/lib/store/shop-store";
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

/**
 * Wishlist keys are product codes (RV-2401, …) — same convention as the
 * cart. All product data comes from /products/code/:code.
 */
function WishlistInner() {
  const { wishlist, hydrated } = useShop();
  const codes = useMemo(() => wishlist, [wishlist]);
  const [resolved, setResolved] = useState<Record<string, Product>>({});
  const [attempted, setAttempted] = useState<Set<string>>(new Set());
  const resolving = codes.some((c) => !resolved[c] && !attempted.has(c));

  useEffect(() => {
    let cancelled = false;
    const missing = codes.filter((c) => !attempted.has(c));
    if (missing.length === 0) return;
    setAttempted((prev) => {
      const next = new Set(prev);
      missing.forEach((c) => next.add(c));
      return next;
    });

    const fetchOne = (code: string): Promise<Product | null> => {
      const inner = productsApi
        .byCode(code)
        .catch(() => productsApi.byId(code))
        .then((api) => adaptProduct(api))
        .catch(() => null as Product | null);
      const timeout = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), 6_000),
      );
      return Promise.race([inner, timeout]);
    };

    Promise.all(missing.map(fetchOne)).then((results) => {
      if (cancelled) return;
      const ok: Record<string, Product> = {};
      results.forEach((p, i) => {
        if (p) ok[missing[i]] = p;
      });
      if (Object.keys(ok).length > 0) setResolved((prev) => ({ ...prev, ...ok }));
    });
    return () => {
      cancelled = true;
    };
  }, [codes, attempted]);

  const items = codes.map((c) => resolved[c]).filter((p): p is Product => Boolean(p));

  return (
    <Section className="!pt-8 !pb-24">
      <Eyebrow>Saved for Later</Eyebrow>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">Your wishlist</h1>
      <p className="mt-2 text-[var(--color-fg-muted)] max-w-xl">
        Pieces you&rsquo;ve fallen in love with. We&rsquo;ll let you know if they go on a private edit.
      </p>

      {!hydrated || (items.length === 0 && codes.length > 0 && resolving) ? (
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
            <ProductCard key={p.code} product={p} />
          ))}
        </div>
      )}
    </Section>
  );
}
