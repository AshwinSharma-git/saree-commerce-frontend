"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

const reels = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1623091410901-00e2d268901f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1611042553365-9b101441c135?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1594387303170-1b76d3eaad1e?auto=format&fit=crop&w=600&q=80",
];

export function InstagramRail() {
  return (
    <Section className="bg-[var(--color-cream-warm)]/40">
      <div className="text-center mb-10">
        <SectionHeading
          align="center"
          eyebrow="@rajavastra"
          title={
            <>
              From the <em className="font-[family-name:var(--font-script)] italic text-gradient-maroon">reels</em> to your wardrobe
            </>
          }
          subtitle="Tap any look to find it on the website. Found a saree on a reel? Search by code or upload a screenshot."
        />
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {reels.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative aspect-[3/4] rounded-xl overflow-hidden ring-1 ring-[rgba(90,15,26,0.08)]"
          >
            <Image src={src} alt={`Reel ${i + 1}`} fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-noir)]/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="absolute top-2 right-2 grid place-items-center h-7 w-7 rounded-full bg-[var(--color-ivory)]/85 text-[var(--color-maroon-deep)]">
              <Icon name="instagram" size={14} />
            </span>
            <Link
              href="/visual-search"
              className="absolute inset-x-0 bottom-0 p-3 text-[10px] uppercase tracking-[0.28em] text-[var(--color-ivory)] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Find this saree →
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="https://instagram.com"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-noir)] text-[var(--color-ivory)] text-sm hover:opacity-90"
        >
          <Icon name="instagram" size={16} /> Follow @rajavastra
        </Link>
        <Link
          href="/visual-search"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-ivory)] text-[var(--color-maroon-deep)] text-sm ring-1 ring-[rgba(90,15,26,0.18)] hover:bg-[var(--color-cream)]"
        >
          <Icon name="image-up" size={16} /> Upload a reel screenshot
        </Link>
      </div>
    </Section>
  );
}
