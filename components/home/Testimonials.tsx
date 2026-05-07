"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";

const reviews = [
  {
    name: "Anaya Kapoor",
    title: "Bridal client · Mumbai",
    body: "My grandmother cried when she saw the Crimson Royal — she said it took her back to her own wedding day in 1968. The craftsmanship is unparalleled.",
  },
  {
    name: "Priya Mehta",
    title: "VIP client · Hyderabad",
    body: "I have ordered six pieces over the past year. Every saree arrives wrapped like a love letter. The WhatsApp concierge is genuinely thoughtful.",
  },
  {
    name: "Sneha Iyer",
    title: "Discovered via Instagram · Chennai",
    body: "I screenshotted a reel and uploaded it — they identified the saree in minutes. It came with a hand-signed note from the weaver. Magical.",
  },
];

export function Testimonials() {
  return (
    <Section className="bg-[var(--color-noir)] text-[var(--color-ivory)]">
      <div className="text-center mb-12">
        <span className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-gold-bright)]">
          Whispered between friends
        </span>
        <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[var(--color-ivory)]">
          Worn with <em className="font-[family-name:var(--font-script)] italic text-gradient-gold">reverence</em>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {reviews.map((r, i) => (
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.1 }}
            className="relative p-8 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent ring-1 ring-[var(--color-gold)]/15"
          >
            <div className="flex items-center gap-1 text-[var(--color-gold-bright)] mb-5">
              {Array.from({ length: 5 }).map((_, j) => (
                <Icon key={j} name="star" size={14} />
              ))}
            </div>
            <blockquote className="text-base leading-relaxed text-[var(--color-ivory)]/85 font-[family-name:var(--font-display)] font-light">
              &ldquo;{r.body}&rdquo;
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-white/10">
              <p className="text-sm font-medium">{r.name}</p>
              <p className="text-xs text-[var(--color-ivory)]/55 mt-0.5">{r.title}</p>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {/* metric strip */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-y-6 text-center">
        {[
          { v: "62", l: "Years of heritage" },
          { v: "500+", l: "Master weavers" },
          { v: "12k+", l: "Sarees delivered" },
          { v: "4.9★", l: "Customer love" },
        ].map((m) => (
          <div key={m.l}>
            <p className="font-[family-name:var(--font-display)] text-4xl md:text-5xl text-gradient-gold">{m.v}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[var(--color-ivory)]/55">{m.l}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
