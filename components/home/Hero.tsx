"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const heroImg =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=2400&q=85";

export function Hero() {
  return (
    <section className="relative -mt-24 md:-mt-32 h-[100svh] min-h-[640px] max-h-[920px] w-full overflow-hidden">
      {/* Background image with ken-burns. object-position keeps the upper portion
          (head / shoulders) in frame on wide desktops; falls back to a higher
          framing on portrait mobile so the model is never cropped weirdly. */}
      <div className="absolute inset-0">
        <Image
          src={heroImg}
          alt="Royal heritage Banarasi saree, hand-woven in Varanasi"
          fill
          priority
          sizes="100vw"
          className="object-cover kenburns object-[50%_22%] md:object-[50%_18%]"
        />
        {/* Strong dark band at top so navbar stays readable, then a softer
            cinematic vignette across the rest. */}
        <div className="absolute inset-x-0 top-0 h-44 md:h-56 bg-gradient-to-b from-[var(--color-noir)]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-noir)]/82 via-[var(--color-noir)]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-noir)]/75 via-transparent to-transparent" />
      </div>

      {/* Decorative gold flourish */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-[1320px] h-full px-6 md:px-10 flex items-end md:items-center pb-20 md:pb-0 pt-32 md:pt-0">
        <div className="max-w-2xl text-[var(--color-ivory)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 mb-5 md:mb-6"
          >
            <span className="h-px w-8 md:w-10 gradient-gold" />
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.32em] md:tracking-[0.4em] text-[var(--color-gold-bright)]">
              Heritage Edit · Spring 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-[family-name:var(--font-display)] text-[2.6rem] sm:text-5xl md:text-7xl lg:text-[5.5rem] font-light leading-[0.98] tracking-tight"
          >
            Six yards of <span className="font-[family-name:var(--font-script)] italic text-gradient-gold">soul</span>,
            <br />
            woven by hand.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-5 md:mt-7 text-sm sm:text-base md:text-lg text-[var(--color-ivory)]/82 leading-relaxed max-w-lg font-light"
          >
            Heirloom Banarasis, regal Kanjivarams and modern muses — drawn from a fifth-generation atelier
            of master weavers across Bharat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-7 md:mt-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4"
          >
            <Link href="/collections">
              <Button variant="gold" size="lg" fullWidth className="sm:!w-auto" iconRight={<Icon name="arrow-right" size={16} />}>
                Explore the Heritage
              </Button>
            </Link>
            <Link href="/visual-search">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                className="sm:!w-auto !text-[var(--color-ivory)] !ring-[rgba(255,255,255,0.35)] hover:!bg-[var(--color-ivory)]/10 hover:!text-[var(--color-ivory)]"
                iconLeft={<Icon name="image-up" size={16} />}
              >
                Find by Screenshot
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-8 md:mt-12 flex flex-wrap items-center gap-x-6 md:gap-x-8 gap-y-3 text-[10px] md:text-[11px] uppercase tracking-[0.28em] md:tracking-[0.3em] text-[var(--color-ivory)]/70"
          >
            <span className="flex items-center gap-2">
              <Icon name="leaf" size={14} className="text-[var(--color-gold-bright)]" /> Natural Dyes
            </span>
            <span className="flex items-center gap-2">
              <Icon name="shield" size={14} className="text-[var(--color-gold-bright)]" /> Authenticity Mark
            </span>
            <span className="flex items-center gap-2">
              <Icon name="truck" size={14} className="text-[var(--color-gold-bright)]" /> Worldwide Delivery
            </span>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-[var(--color-ivory)]/65 text-[10px] tracking-[0.4em]"
      >
        <span className="uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="h-7 w-px bg-gradient-to-b from-[var(--color-gold)] to-transparent"
        />
      </motion.div>
    </section>
  );
}
