"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { WhatsAppActions } from "@/components/product/WhatsAppActions";
import { useShop } from "@/lib/store/shop-store";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

const sizes = ["XS", "S", "M", "L", "XL"];

const SITE_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_SITE_URL) ||
  (typeof window !== "undefined" ? window.location.origin : "");

export default function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"story" | "weave" | "care">("story");
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const wished = isInWishlist(product.code);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <Section className="!pt-8 !pb-16">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-fg-muted)] mb-8">
          <Link href="/" className="hover:text-[var(--color-maroon)]">Home</Link>
          <Icon name="chevron-right" size={12} />
          <Link href="/collections" className="hover:text-[var(--color-maroon)]">Collections</Link>
          <Icon name="chevron-right" size={12} />
          <span className="text-[var(--color-maroon)]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Gallery */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 md:max-h-[640px] md:overflow-y-auto hide-scrollbar">
              {product.gallery.map((img, i) => (
                <button
                  key={img + i}
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "relative h-20 w-20 md:h-24 md:w-24 rounded-xl overflow-hidden flex-shrink-0 ring-2 transition-all",
                    activeIndex === i ? "ring-[var(--color-maroon)]" : "ring-transparent hover:ring-[var(--color-gold)]/40",
                  )}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill sizes="100px" className="object-cover" />
                </button>
              ))}
            </div>
            <div className="flex-1 relative aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--color-cream)] luxury-shadow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={product.gallery[activeIndex]}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
              <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-[var(--color-noir)]/85 text-[var(--color-gold-bright)] text-[10px] uppercase tracking-[0.32em]">
                Code · {product.code}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5">
            <Eyebrow>{product.collection}</Eyebrow>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-5xl text-[var(--color-noir)] leading-[1.05]">
              {product.name}
            </h1>

            <div className="mt-4 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-[var(--color-gold-deep)]">
                <Icon name="star" size={13} /> {product.rating.toFixed(1)}
              </span>
              <span className="text-[var(--color-fg-muted)]">{product.reviews} reviews</span>
              <span className="opacity-30">·</span>
              <span className="text-[var(--color-fg-muted)]">SKU {product.sku}</span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="text-3xl font-[family-name:var(--font-display)] text-[var(--color-maroon-deep)]">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-[var(--color-fg-muted)] line-through pb-1">
                    {formatINR(product.originalPrice)}
                  </span>
                  <span className="px-2 py-0.5 rounded-full gradient-gold text-[var(--color-noir)] text-[10px] uppercase tracking-wide font-medium pb-1">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-[var(--color-fg-muted)] mt-1">Inclusive of all taxes · 5 EMI options at checkout</p>

            <p className="mt-6 text-base text-[var(--color-fg-muted)] leading-relaxed">{product.description}</p>

            {/* Color */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold-deep)] mb-3">Colour palette</p>
              <div className="flex items-center gap-2">
                {product.colors.map((c) => (
                  <div
                    key={c}
                    className="h-9 w-9 rounded-full ring-2 ring-[rgba(0,0,0,0.06)]"
                    style={{ background: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            {/* Blouse size */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold-deep)]">Blouse size</p>
                <button className="text-xs text-[var(--color-maroon)] underline">Size guide</button>
              </div>
              <div className="flex items-center gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "h-12 w-12 rounded-xl text-sm font-medium transition-all",
                      size === s
                        ? "bg-[var(--color-maroon)] text-[var(--color-ivory)] ring-1 ring-[var(--color-maroon)]"
                        : "ring-1 ring-[rgba(90,15,26,0.18)] text-[var(--color-noir)] hover:ring-[var(--color-maroon)]",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center rounded-full ring-1 ring-[rgba(90,15,26,0.18)] overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3 hover:bg-[var(--color-cream)] transition-colors"
                >
                  <Icon name="minus" size={14} />
                </button>
                <span className="px-5 py-3 min-w-[3rem] text-center text-sm font-medium">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="px-4 py-3 hover:bg-[var(--color-cream)] transition-colors"
                >
                  <Icon name="plus" size={14} />
                </button>
              </div>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => addToCart(product.code, qty)}
                iconLeft={<Icon name="bag" size={16} />}
              >
                Add to Bag · {formatINR(product.price * qty)}
              </Button>
              <button
                onClick={() => toggleWishlist(product.code)}
                className={cn(
                  "h-14 w-14 grid place-items-center rounded-full ring-1 transition-all",
                  wished
                    ? "bg-[var(--color-maroon)] text-[var(--color-ivory)] ring-[var(--color-maroon)]"
                    : "ring-[rgba(90,15,26,0.18)] text-[var(--color-maroon-deep)] hover:bg-[var(--color-cream)]",
                )}
                aria-label="Wishlist"
              >
                <Icon name="heart" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className={cn("h-2 w-2 rounded-full", product.stock <= 5 ? "bg-[var(--color-maroon)]" : "bg-emerald-600")} />
              <span className="text-[var(--color-fg-muted)]">
                {product.stock <= 5 ? `Only ${product.stock} left in the world` : `${product.stock} in stock`}
              </span>
            </div>

            {/* Trust row */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: "truck" as const, t: "Free express delivery" },
                { icon: "shield" as const, t: "Authenticity certificate" },
                { icon: "package" as const, t: "Hand-wrapped in linen" },
                { icon: "credit-card" as const, t: "Secure payments · 5 EMI" },
              ].map((it) => (
                <div key={it.t} className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[var(--color-cream)] text-sm">
                  <Icon name={it.icon} size={16} className="text-[var(--color-maroon)]" />
                  <span className="text-[var(--color-noir)]">{it.t}</span>
                </div>
              ))}
            </div>

            <WhatsAppActions
              code={product.code}
              title={product.name}
              productUrl={`${SITE_URL}/product/${product.code}`}
            />
          </div>
        </div>

        {/* Story tabs */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-1 p-1 rounded-full bg-[var(--color-cream)] w-fit mx-auto">
            {(
              [
                { k: "story", l: "The Story" },
                { k: "weave", l: "Weave & Craft" },
                { k: "care", l: "Care Guide" },
              ] as const
            ).map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.28em] transition-all",
                  tab === t.k
                    ? "bg-[var(--color-noir)] text-[var(--color-gold-bright)]"
                    : "text-[var(--color-noir)] hover:bg-[var(--color-cream-warm)]",
                )}
              >
                {t.l}
              </button>
            ))}
          </div>

          <div className="mt-10 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                {tab === "story" && (
                  <p className="text-base md:text-lg text-[var(--color-fg-muted)] leading-relaxed italic max-w-2xl mx-auto font-[family-name:var(--font-display)] font-light">
                    &ldquo;{product.story ?? product.description}&rdquo;
                  </p>
                )}
                {tab === "weave" && (
                  <div className="grid md:grid-cols-3 gap-4 text-left">
                    {[
                      { l: "Fabric", v: product.fabric },
                      { l: "Crafted in", v: product.craftedIn },
                      { l: "Drape length", v: "6.5 metres incl. blouse piece" },
                      { l: "Weave time", v: "21–28 days on a pit loom" },
                      { l: "Dye process", v: "Natural botanical dyes" },
                      { l: "Edition", v: product.isLimited ? "Limited — single piece" : "Small batch" },
                    ].map((r) => (
                      <div key={r.l} className="p-5 rounded-xl bg-[var(--color-cream)]">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold-deep)] mb-1">{r.l}</p>
                        <p className="text-sm text-[var(--color-noir)]">{r.v}</p>
                      </div>
                    ))}
                  </div>
                )}
                {tab === "care" && (
                  <div className="text-left max-w-2xl mx-auto space-y-4 text-sm text-[var(--color-fg-muted)]">
                    <p>· Dry-clean only — entrust your saree to a specialist for delicate silks.</p>
                    <p>· Store wrapped in our complimentary muslin pouch, away from direct sunlight.</p>
                    <p>· Air the saree every two months and refold along a new line to preserve the zari.</p>
                    <p>· Avoid contact with perfumes, deodorants and water — gold zari oxidises.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <Section className="bg-[var(--color-cream)]">
          <div className="flex justify-between items-end mb-10">
            <div>
              <Eyebrow>Style it with</Eyebrow>
              <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl md:text-4xl">
                More from this collection
              </h2>
            </div>
            <Link href="/collections" className="text-sm text-[var(--color-maroon)]">
              View all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
