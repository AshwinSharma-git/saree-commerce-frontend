"use client";

import { useRef } from "react";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/lib/data/products";

export function NewArrivals() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const newArrivals = products.filter((p) => p.isNew || p.isLimited).slice(0, 8);

  const scroll = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 360 : -360, behavior: "smooth" });
  };

  return (
    <Section className="bg-[var(--color-cream)]" containerClassName="!max-w-none px-0">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <SectionHeading
          eyebrow="Fresh Off The Loom"
          title={
            <>
              The new <em className="font-[family-name:var(--font-script)] italic text-gradient-maroon">arrivals</em>
            </>
          }
          subtitle="Each piece below is one of just a few in the world. Hand-numbered, certificate-signed."
        />
        <div className="flex items-center gap-3">
          <Link href="/collections" className="text-sm tracking-wide text-[var(--color-maroon)] underline-offset-4 hover:underline">
            View all
          </Link>
          <button
            onClick={() => scroll("left")}
            className="h-11 w-11 grid place-items-center rounded-full ring-1 ring-[rgba(90,15,26,0.25)] text-[var(--color-maroon-deep)] hover:bg-[var(--color-maroon)] hover:text-[var(--color-ivory)] transition-all focus-ring"
            aria-label="Previous"
          >
            <Icon name="chevron-left" size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="h-11 w-11 grid place-items-center rounded-full gradient-maroon text-[var(--color-ivory)] hover:brightness-110 transition-all focus-ring"
            aria-label="Next"
          >
            <Icon name="chevron-right" size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="hide-scrollbar flex gap-6 px-6 md:px-10 overflow-x-auto snap-x snap-mandatory pb-4"
      >
        {newArrivals.map((p) => (
          <div key={p.id} className="snap-start flex-none w-[280px] md:w-[320px]">
            <ProductCard product={p} />
          </div>
        ))}
        <div className="snap-start flex-none w-[280px] md:w-[320px] grid place-items-center">
          <Link
            href="/collections"
            className="group h-full w-full min-h-[420px] flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-[rgba(90,15,26,0.3)] text-[var(--color-maroon-deep)] hover:bg-[var(--color-ivory)] transition-all"
          >
            <span className="grid place-items-center h-14 w-14 rounded-full gradient-gold text-[var(--color-noir)]">
              <Icon name="arrow-right" />
            </span>
            <span className="text-sm tracking-wide">Browse the entire collection</span>
          </Link>
        </div>
      </div>
    </Section>
  );
}
