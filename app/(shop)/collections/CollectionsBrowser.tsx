"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { Icon } from "@/components/ui/Icon";
import { products as fallbackProducts } from "@/lib/data/products";
import { productsApi } from "@/lib/api/products";
import { adaptProducts } from "@/lib/api/adapt";
import type { Product } from "@/types";
import { cn } from "@/lib/cn";

const fabrics = ["Banarasi Silk", "Kanjivaram Silk", "Mulberry Silk", "Tussar Silk", "Organic Cotton", "Linen", "Chiffon", "Georgette"];
const occasions = ["Wedding", "Festive", "Party", "Office", "Casual"];
const collectionsList = ["Heritage Bridal", "Festive Edit", "Modern Heritage", "Everyday Luxe"];
const colorChips = [
  { hex: "#5a0f1a", name: "Deep Maroon" },
  { hex: "#c9a96a", name: "Champagne Gold" },
  { hex: "#0f0a08", name: "Onyx Black" },
  { hex: "#faf6ee", name: "Ivory" },
  { hex: "#1f3d2b", name: "Forest Emerald" },
  { hex: "#1a2347", name: "Midnight Indigo" },
  { hex: "#b96a3a", name: "Rust Marigold" },
  { hex: "#b8848c", name: "Rose Gold" },
];

type Sort = "curated" | "price-asc" | "price-desc" | "new";

export default function CollectionsBrowser() {
  const sp = useSearchParams();
  const initialQ = sp.get("q") ?? "";
  const initialFabric = sp.get("fabric");
  const initialCollection = sp.get("collection");

  const [q, setQ] = useState(initialQ);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>(initialFabric ? [initialFabric] : []);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    initialCollection ? [initialCollection] : [],
  );
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState(50000);
  const [sort, setSort] = useState<Sort>("curated");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  // Fetch live catalogue once on mount. Filtering / sorting stays client-side
  // so the rich filter UX keeps working without round-tripping each change.
  // If the API is unreachable (cold start, dev offline) we keep the seeded
  // mock data so the page never looks empty.
  useEffect(() => {
    let cancelled = false;
    productsApi
      .list({ pageSize: 100 })
      .then((res) => {
        if (cancelled) return;
        if (res.data.length > 0) setProducts(adaptProducts(res.data));
      })
      .catch(() => {
        // Stay on the mock fallback.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const list = useMemo(() => {
    const baseSearch = (term: string): Product[] => {
      const t = term.trim().toLowerCase();
      if (!t) return products;
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(t) ||
          p.code.toLowerCase().includes(t) ||
          p.fabric.toLowerCase().includes(t) ||
          p.collection.toLowerCase().includes(t) ||
          p.tags.some((tag) => tag.toLowerCase().includes(t)),
      );
    };
    let r = q ? baseSearch(q) : [...products];
    if (selectedFabrics.length) r = r.filter((p) => selectedFabrics.includes(p.fabric));
    if (selectedCollections.length) r = r.filter((p) => selectedCollections.includes(p.collection));
    if (selectedOccasions.length) r = r.filter((p) => p.occasion.some((o) => selectedOccasions.includes(o)));
    if (selectedColors.length)
      r = r.filter((p) => p.colors.some((c) => selectedColors.map((x) => x.toLowerCase()).includes(c.toLowerCase())));
    r = r.filter((p) => p.price <= priceMax);
    switch (sort) {
      case "price-asc":
        r = [...r].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        r = [...r].sort((a, b) => b.price - a.price);
        break;
      case "new":
        r = [...r].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
        break;
    }
    return r;
  }, [q, selectedFabrics, selectedOccasions, selectedCollections, selectedColors, priceMax, sort, products]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, v: string) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const clearAll = () => {
    setQ("");
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setSelectedCollections([]);
    setSelectedColors([]);
    setPriceMax(50000);
  };

  const activeCount =
    selectedFabrics.length +
    selectedOccasions.length +
    selectedCollections.length +
    selectedColors.length +
    (priceMax < 50000 ? 1 : 0);

  return (
    <>
      <Section className="!py-12 md:!py-16 bg-gradient-to-b from-[var(--color-cream)] to-[var(--color-ivory)]">
        <nav className="flex items-center gap-2 text-xs text-[var(--color-fg-muted)] mb-4">
          <Link href="/" className="hover:text-[var(--color-maroon)]">Home</Link>
          <Icon name="chevron-right" size={12} />
          <span className="text-[var(--color-maroon)]">All Collections</span>
        </nav>
        <Eyebrow>The Atelier</Eyebrow>
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-6xl text-[var(--color-noir)] leading-[1.05]">
          Woven <em className="font-[family-name:var(--font-script)] italic text-gradient-maroon">heritage</em>, curated for you
        </h1>
        <p className="mt-4 max-w-2xl text-[var(--color-fg-muted)] text-base md:text-lg leading-relaxed">
          Discover {products.length}+ heirloom sarees — every thread a story of ancient craftsmanship and sustainable elegance.
        </p>
      </Section>

      <Section className="!pt-4 !pb-24">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="hidden lg:block w-72 flex-shrink-0 space-y-8 sticky top-32 h-fit">
            <FilterPanel
              q={q} setQ={setQ}
              fabrics={fabrics} selectedFabrics={selectedFabrics} toggleFabric={(v) => toggle(selectedFabrics, setSelectedFabrics, v)}
              collectionsList={collectionsList} selectedCollections={selectedCollections} toggleCollection={(v) => toggle(selectedCollections, setSelectedCollections, v)}
              occasions={occasions} selectedOccasions={selectedOccasions} toggleOccasion={(v) => toggle(selectedOccasions, setSelectedOccasions, v)}
              colorChips={colorChips} selectedColors={selectedColors} toggleColor={(v) => toggle(selectedColors, setSelectedColors, v)}
              priceMax={priceMax} setPriceMax={setPriceMax}
              clearAll={clearAll} activeCount={activeCount}
            />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[rgba(90,15,26,0.12)]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full ring-1 ring-[rgba(90,15,26,0.18)] text-sm"
                >
                  <Icon name="filter" size={14} /> Filters
                  {activeCount > 0 && (
                    <span className="ml-1 px-1.5 rounded-full bg-[var(--color-maroon)] text-[var(--color-ivory)] text-[10px]">
                      {activeCount}
                    </span>
                  )}
                </button>
                <span className="text-sm text-[var(--color-fg-muted)]">
                  <span className="font-medium text-[var(--color-noir)]">{list.length}</span> heirlooms found
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="sort" size={14} className="text-[var(--color-fg-muted)]" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as Sort)}
                  className="bg-transparent text-sm text-[var(--color-noir)] focus:outline-none cursor-pointer"
                >
                  <option value="curated">Curated picks</option>
                  <option value="new">New arrivals first</option>
                  <option value="price-asc">Price: low to high</option>
                  <option value="price-desc">Price: high to low</option>
                </select>
              </div>
            </div>

            {list.length === 0 ? (
              <div className="py-24 text-center">
                <p className="text-lg text-[var(--color-fg-muted)]">No sarees match your filters.</p>
                <button onClick={clearAll} className="mt-4 text-[var(--color-maroon)] underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-12">
                {list.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: Math.min(i * 0.04, 0.4) }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {filtersOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFiltersOpen(false)} />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 bottom-0 w-[88vw] max-w-md bg-[var(--color-ivory)] p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-[family-name:var(--font-display)] text-2xl">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="p-2"><Icon name="close" /></button>
            </div>
            <FilterPanel
              q={q} setQ={setQ}
              fabrics={fabrics} selectedFabrics={selectedFabrics} toggleFabric={(v) => toggle(selectedFabrics, setSelectedFabrics, v)}
              collectionsList={collectionsList} selectedCollections={selectedCollections} toggleCollection={(v) => toggle(selectedCollections, setSelectedCollections, v)}
              occasions={occasions} selectedOccasions={selectedOccasions} toggleOccasion={(v) => toggle(selectedOccasions, setSelectedOccasions, v)}
              colorChips={colorChips} selectedColors={selectedColors} toggleColor={(v) => toggle(selectedColors, setSelectedColors, v)}
              priceMax={priceMax} setPriceMax={setPriceMax}
              clearAll={clearAll} activeCount={activeCount}
            />
            <button
              onClick={() => setFiltersOpen(false)}
              className="mt-8 w-full py-3 rounded-full gradient-maroon text-[var(--color-ivory)] text-sm"
            >
              Show {list.length} results
            </button>
          </motion.aside>
        </div>
      )}
    </>
  );
}

interface PanelProps {
  q: string; setQ: (v: string) => void;
  fabrics: string[]; selectedFabrics: string[]; toggleFabric: (v: string) => void;
  collectionsList: string[]; selectedCollections: string[]; toggleCollection: (v: string) => void;
  occasions: string[]; selectedOccasions: string[]; toggleOccasion: (v: string) => void;
  colorChips: { hex: string; name: string }[]; selectedColors: string[]; toggleColor: (v: string) => void;
  priceMax: number; setPriceMax: (v: number) => void;
  clearAll: () => void; activeCount: number;
}

function FilterPanel(props: PanelProps) {
  const {
    q, setQ, fabrics, selectedFabrics, toggleFabric,
    collectionsList, selectedCollections, toggleCollection,
    occasions, selectedOccasions, toggleOccasion,
    colorChips, selectedColors, toggleColor,
    priceMax, setPriceMax, clearAll, activeCount,
  } = props;
  return (
    <div className="space-y-7">
      <div className="relative">
        <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search code, name…"
          className="w-full pl-11 pr-4 py-3 rounded-full bg-[var(--color-cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)]/40"
        />
      </div>

      {activeCount > 0 && (
        <button onClick={clearAll} className="text-xs text-[var(--color-maroon)] underline">
          Clear all filters ({activeCount})
        </button>
      )}

      <FilterGroup title="Collection">
        {collectionsList.map((c) => (
          <CheckRow key={c} label={c} checked={selectedCollections.includes(c)} onClick={() => toggleCollection(c)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Fabric">
        {fabrics.map((f) => (
          <CheckRow key={f} label={f} checked={selectedFabrics.includes(f)} onClick={() => toggleFabric(f)} />
        ))}
      </FilterGroup>

      <FilterGroup title="Occasion">
        <div className="flex flex-wrap gap-2">
          {occasions.map((o) => (
            <button
              key={o}
              onClick={() => toggleOccasion(o)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs ring-1 transition-all",
                selectedOccasions.includes(o)
                  ? "bg-[var(--color-maroon)] text-[var(--color-ivory)] ring-[var(--color-maroon)]"
                  : "bg-transparent text-[var(--color-noir)] ring-[rgba(90,15,26,0.2)] hover:bg-[var(--color-cream)]",
              )}
            >
              {o}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Colour">
        <div className="flex flex-wrap gap-3">
          {colorChips.map((c) => (
            <button
              key={c.hex}
              onClick={() => toggleColor(c.hex)}
              title={c.name}
              className={cn(
                "h-9 w-9 rounded-full ring-2 transition-all",
                selectedColors.includes(c.hex) ? "ring-[var(--color-gold)] scale-110" : "ring-[rgba(0,0,0,0.08)]",
              )}
              style={{ background: c.hex }}
              aria-label={c.name}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Maximum price">
        <input
          type="range"
          min={5000}
          max={50000}
          step={1000}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-[var(--color-maroon)]"
        />
        <div className="flex justify-between text-xs text-[var(--color-fg-muted)] mt-1">
          <span>₹5,000</span>
          <span className="font-medium text-[var(--color-maroon)]">Up to ₹{priceMax.toLocaleString()}</span>
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)] mb-4">{title}</h4>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function CheckRow({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 group w-full text-left">
      <span
        className={cn(
          "h-4 w-4 rounded grid place-items-center transition-all",
          checked
            ? "bg-[var(--color-maroon)] text-[var(--color-ivory)]"
            : "ring-1 ring-[rgba(90,15,26,0.3)] group-hover:ring-[var(--color-maroon)]",
        )}
      >
        {checked && <Icon name="check" size={11} />}
      </span>
      <span className="text-sm text-[var(--color-noir)] group-hover:text-[var(--color-maroon)] transition-colors">
        {label}
      </span>
    </button>
  );
}
