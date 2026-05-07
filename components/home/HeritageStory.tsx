"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function HeritageStory() {
  return (
    <Section className="bg-[var(--color-ivory)]">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 relative"
        >
          <div className="absolute -top-4 -left-4 hidden md:block w-full h-full rounded-2xl ring-1 ring-[var(--color-gold)]/40 -z-10" />
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden luxury-shadow-deep">
            <Image
              src="https://images.unsplash.com/photo-1604782206219-3b9576575203?auto=format&fit=crop&w=1400&q=85"
              alt="A weaver at the pit loom in Varanasi"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-noir)]/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-[var(--color-ivory)]">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-bright)] mb-1">In conversation with</p>
              <p className="font-[family-name:var(--font-display)] text-xl">Ramesh Yadav · Master Weaver, Varanasi</p>
            </div>
            <button
              type="button"
              className="absolute top-6 right-6 h-14 w-14 rounded-full grid place-items-center bg-[var(--color-ivory)]/90 text-[var(--color-maroon-deep)] backdrop-blur hover:scale-105 transition-transform focus-ring"
              aria-label="Play story"
            >
              <Icon name="play" size={20} />
            </button>
          </div>

          {/* floating stat card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -bottom-8 -right-4 md:-right-8 hidden sm:block bg-[var(--color-noir)] text-[var(--color-ivory)] rounded-2xl p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-[var(--color-gold)]/30 floaty"
          >
            <p className="font-[family-name:var(--font-display)] text-3xl text-[var(--color-gold-bright)]">500+</p>
            <p className="text-xs text-[var(--color-ivory)]/70 tracking-wide mt-1">Weaver families empowered</p>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-6">
          <Eyebrow>Our Philosophy</Eyebrow>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-tight text-[var(--color-noir)]">
            The <em className="font-[family-name:var(--font-script)] italic text-gradient-maroon">soul</em> in every stitch.
          </h2>
          <p className="mt-5 text-base md:text-lg text-[var(--color-fg-muted)] leading-relaxed">
            A saree is more than six yards of fabric — it is a living canvas of memory, a thread that ties one
            generation to the next. Our artisans honour the slow, rhythmic process of hand-weaving that no machine
            can replicate.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 gap-5">
            {[
              { icon: "leaf" as const, title: "Botanical Dyes", body: "Indigo, madder root, turmeric — kind to skin and earth." },
              { icon: "users" as const, title: "Fair Atelier", body: "Direct partnerships with weaver families across Bharat." },
              { icon: "shield" as const, title: "Authenticity", body: "Every piece carries a hand-numbered certificate." },
              { icon: "sparkle" as const, title: "Pure Zari", body: "Real silver-gilt threads, lab-tested for purity." },
            ].map((it) => (
              <div key={it.title} className="flex gap-4">
                <span className="grid place-items-center h-11 w-11 rounded-full bg-[var(--color-cream)] text-[var(--color-maroon)]">
                  <Icon name={it.icon} size={18} />
                </span>
                <div>
                  <h4 className="font-medium text-[var(--color-noir)]">{it.title}</h4>
                  <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">{it.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/about">
              <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" size={16} />}>
                Read our story
              </Button>
            </Link>
            <Link
              href="https://wa.me/919999999999"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-maroon)]"
            >
              <Icon name="whatsapp" size={16} /> Speak to a stylist
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
