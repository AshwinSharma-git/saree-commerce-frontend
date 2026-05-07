"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useShop } from "@/lib/store/shop-store";
import { formatINR } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const wished = isInWishlist(product.id);
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[var(--color-cream)] aspect-[3/4] luxury-shadow-soft">
        <Link href={`/product/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-noir)]/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </Link>

        {/* badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {product.isLimited && (
            <span className="px-3 py-1 rounded-full bg-[var(--color-noir)] text-[var(--color-gold-bright)] text-[10px] uppercase tracking-[0.28em] font-medium">
              Limited
            </span>
          )}
          {product.isNew && (
            <span className="px-3 py-1 rounded-full bg-[var(--color-ivory)]/90 text-[var(--color-maroon-deep)] text-[10px] uppercase tracking-[0.28em] font-medium">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="px-3 py-1 rounded-full gradient-gold text-[var(--color-noir)] text-[10px] uppercase tracking-[0.28em] font-medium">
              {discount}% off
            </span>
          )}
        </div>

        {/* wishlist */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={cn(
            "absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-full backdrop-blur-md transition-all focus-ring",
            wished
              ? "bg-[var(--color-maroon)] text-[var(--color-ivory)]"
              : "bg-[var(--color-ivory)]/85 text-[var(--color-maroon-deep)] hover:bg-[var(--color-ivory)]",
          )}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Icon name="heart" size={16} />
        </button>

        {/* hover quick add */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <button
            type="button"
            onClick={() => addToCart(product.id)}
            className="w-full py-3 px-4 rounded-full gradient-maroon text-[var(--color-ivory)] text-xs uppercase tracking-[0.28em] font-medium flex items-center justify-center gap-2 hover:brightness-110 transition-all"
          >
            <Icon name="bag" size={14} /> Add to Bag
          </button>
        </div>
      </div>

      <div className="pt-5 px-1">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)] mb-1">
          {product.collection}
        </p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--color-noir)] leading-tight hover:text-[var(--color-maroon)] transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-baseline gap-2.5">
          <span className="text-base font-medium text-[var(--color-maroon-deep)]">
            {formatINR(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-[var(--color-fg-muted)] line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-fg-muted)]">
          <span className="flex items-center gap-1 text-[var(--color-gold-deep)]">
            <Icon name="star" size={11} /> {product.rating.toFixed(1)}
          </span>
          <span className="opacity-60">·</span>
          <span>{product.fabric}</span>
        </div>
      </div>
    </motion.div>
  );
}
