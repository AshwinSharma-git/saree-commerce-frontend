"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/lib/data/products";

export default function VisualSearchPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<typeof products | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = (file: File | null) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setResults(null);
    setSearching(true);
    setTimeout(() => {
      setResults(products.slice(0, 4));
      setSearching(false);
    }, 1800);
  };

  return (
    <Section className="!pt-8 !pb-24">
      <Eyebrow>Visual Search</Eyebrow>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
        Spotted on a reel? <em className="font-[family-name:var(--font-script)] italic text-gradient-maroon">Find it here.</em>
      </h1>
      <p className="mt-2 text-[var(--color-fg-muted)] max-w-xl">
        Upload a screenshot from Instagram, WhatsApp or any image — our AI will find matching sarees from our atelier.
      </p>

      <div className="mt-10 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <label
            htmlFor="visual-upload"
            className="relative block aspect-square rounded-3xl border-2 border-dashed border-[rgba(90,15,26,0.3)] bg-[var(--color-cream)]/60 hover:bg-[var(--color-cream)] transition-colors cursor-pointer overflow-hidden"
          >
            {preview ? (
              <>
                <Image src={preview} alt="Uploaded saree" fill sizes="500px" className="object-cover" />
                {searching && (
                  <div className="absolute inset-0 grid place-items-center bg-[var(--color-noir)]/55 text-[var(--color-ivory)]">
                    <div className="text-center">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                        className="inline-grid place-items-center h-12 w-12 rounded-full bg-[var(--color-gold)]/20 text-[var(--color-gold-bright)]"
                      >
                        <Icon name="ai" size={20} />
                      </motion.span>
                      <p className="mt-3 text-sm tracking-wide">Identifying weave & motif…</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0 grid place-items-center text-center p-8">
                <div>
                  <span className="grid place-items-center h-16 w-16 rounded-full bg-[var(--color-noir)] text-[var(--color-gold-bright)] mx-auto mb-4">
                    <Icon name="image-up" size={22} />
                  </span>
                  <p className="font-medium text-[var(--color-noir)]">Drop a screenshot here</p>
                  <p className="text-xs text-[var(--color-fg-muted)] mt-1">PNG, JPG or HEIC · up to 8MB</p>
                  <span className="inline-block mt-4 px-4 py-2 rounded-full text-xs gradient-maroon text-[var(--color-ivory)]">
                    Choose a file
                  </span>
                </div>
              </div>
            )}
            <input
              ref={inputRef}
              id="visual-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {preview && (
            <div className="mt-3 flex justify-between items-center text-sm">
              <button
                onClick={() => {
                  setPreview(null);
                  setResults(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="text-[var(--color-fg-muted)] hover:text-[var(--color-maroon)]"
              >
                Clear
              </button>
              <span className="text-[var(--color-fg-muted)]">Powered by Atelier AI</span>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          {!results && !searching && (
            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-display)] text-2xl">Or try a different way</h3>
              <a
                href="https://wa.me/919999999999"
                className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-noir)] text-[var(--color-ivory)] hover:opacity-95"
              >
                <span className="grid place-items-center h-12 w-12 rounded-full bg-[#25D366]/20 text-[#25D366]">
                  <Icon name="whatsapp" />
                </span>
                <div>
                  <p className="font-medium">Send the screenshot on WhatsApp</p>
                  <p className="text-xs text-[var(--color-ivory)]/65">A real human stylist will reply within 10 minutes.</p>
                </div>
                <Icon name="arrow-right" size={16} className="ml-auto" />
              </a>
              <div className="flex items-center gap-4 p-5 rounded-2xl bg-[var(--color-cream)]">
                <span className="grid place-items-center h-12 w-12 rounded-full bg-[var(--color-noir)] text-[var(--color-gold-bright)]">
                  <Icon name="search" />
                </span>
                <div className="flex-1">
                  <p className="font-medium">Have the saree code?</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">Like RV-2401 — paste it in the search bar above to skip ahead.</p>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--color-cream-warm)]/40 to-transparent ring-1 ring-[rgba(201,169,106,0.25)]">
                <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">How it works</p>
                <ol className="mt-3 space-y-2 text-sm text-[var(--color-fg-muted)]">
                  <li>1. Upload a clear photo of the saree (close-ups work best).</li>
                  <li>2. Our AI matches it against our atelier&rsquo;s catalogue.</li>
                  <li>3. We show the closest pieces — and similar handloom alternatives.</li>
                </ol>
              </div>
            </div>
          )}

          {results && (
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)] mb-3">Matches found</p>
              <h3 className="font-[family-name:var(--font-display)] text-2xl mb-6">Here are 4 closest matches</h3>
              <div className="grid sm:grid-cols-2 gap-x-5 gap-y-10">
                {results.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button variant="secondary">
                  Refine match with stylist
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
