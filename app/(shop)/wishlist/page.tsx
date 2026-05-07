"use client";

import Link from "next/link";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { useShop } from "@/lib/store/shop-store";
import { products } from "@/lib/data/products";

export default function WishlistPage() {
  const { wishlist } = useShop();
  const items = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  return (
    <Section className="!pt-8 !pb-24">
      <Eyebrow>Saved for Later</Eyebrow>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">Your wishlist</h1>
      <p className="mt-2 text-[var(--color-fg-muted)] max-w-xl">
        Pieces you&rsquo;ve fallen in love with. We&rsquo;ll let you know if they go on a private edit.
      </p>

      {items.length === 0 ? (
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
