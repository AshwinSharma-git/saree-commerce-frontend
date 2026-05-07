"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { collections } from "@/lib/data/products";

export function CollectionsBento() {
  return (
    <Section>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <SectionHeading
          eyebrow="Curated Collections"
          title={
            <>
              Selected for the <em className="font-[family-name:var(--font-script)] italic text-gradient-maroon">discerning eye</em>
            </>
          }
          subtitle="Four collections, each a chapter in our atelier's story — from royal bridal heirlooms to modern muses."
        />
        <Link
          href="/collections"
          className="group inline-flex items-center gap-2 text-sm tracking-wide text-[var(--color-maroon)] font-medium"
        >
          View all collections
          <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-5 md:gap-6 h-auto md:h-[640px]">
        <BentoCard collection={collections[0]} className="col-span-12 md:col-span-7 md:row-span-2" featured />
        <BentoCard collection={collections[1]} className="col-span-6 md:col-span-5" />
        <BentoCard collection={collections[2]} className="col-span-6 md:col-span-5" />
        <BentoCard collection={collections[3]} className="col-span-12 md:col-span-12 h-[260px] md:h-auto" wide />
      </div>
    </Section>
  );
}

interface CardProps {
  collection: { name: string; tagline: string; slug: string; image: string };
  className?: string;
  featured?: boolean;
  wide?: boolean;
}

function BentoCard({ collection, className = "", featured, wide }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl luxury-shadow-soft min-h-[280px] ${className}`}
    >
      <Link href={`/collections?collection=${encodeURIComponent(collection.name)}`} className="block h-full w-full">
        <Image
          src={collection.image}
          alt={collection.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-noir)]/85 via-[var(--color-noir)]/30 to-transparent" />

        <div
          className={`absolute inset-0 p-6 md:p-10 flex flex-col ${
            wide ? "justify-center items-center text-center" : "justify-end"
          }`}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-bright)] mb-2">
            Collection
          </span>
          <h3
            className={`font-[family-name:var(--font-display)] text-[var(--color-ivory)] leading-tight ${
              featured ? "text-4xl md:text-6xl" : "text-2xl md:text-3xl"
            }`}
          >
            {collection.name}
          </h3>
          <p
            className={`mt-2 text-[var(--color-ivory)]/75 max-w-md ${
              featured ? "text-base md:text-lg" : "text-sm"
            } ${wide ? "mx-auto" : ""}`}
          >
            {collection.tagline}
          </p>
          <span className="inline-flex items-center gap-2 mt-5 text-[11px] uppercase tracking-[0.32em] text-[var(--color-ivory)] group-hover:text-[var(--color-gold-bright)] transition-colors">
            Explore <Icon name="arrow-right" size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
