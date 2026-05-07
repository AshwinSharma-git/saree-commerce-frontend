"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useShop } from "@/lib/store/shop-store";
import { cn } from "@/lib/cn";

const links = [
  { href: "/collections", label: "Collections" },
  { href: "/collections?fabric=Banarasi+Silk", label: "Banarasi" },
  { href: "/collections?fabric=Kanjivaram+Silk", label: "Kanjivaram" },
  { href: "/collections?fabric=Organic+Cotton", label: "Cotton" },
  { href: "/collections?fabric=Linen", label: "Linen" },
  { href: "/about", label: "Heritage" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlistCount } = useShop();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawers on navigation. Pathname is a derived URL value; reacting
  // to URL changes from an effect is the canonical React pattern.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setOpen(false);
    setSearchOpen(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "glass shadow-[0_4px_24px_rgba(61,8,16,0.06)]" : "bg-transparent",
        )}
      >
        {/* Top bar */}
        <div className="hidden md:block border-b border-[rgba(201,169,106,0.18)]">
          <div className="mx-auto max-w-[1320px] px-6 md:px-10 flex justify-between items-center py-2 text-[11px] tracking-wider text-[var(--color-fg-muted)]">
            <span className="uppercase">Complimentary express delivery on every order</span>
            <div className="flex items-center gap-5">
              <a href="https://wa.me/919999999999" className="inline-flex items-center gap-1.5 hover:text-[var(--color-maroon)] transition-colors">
                <Icon name="whatsapp" size={14} /> WhatsApp Concierge
              </a>
              <a href="https://instagram.com" className="inline-flex items-center gap-1.5 hover:text-[var(--color-maroon)] transition-colors">
                <Icon name="instagram" size={14} /> @rajavastra
              </a>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="mx-auto max-w-[1320px] px-6 md:px-10 flex items-center justify-between py-4 md:py-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="md:hidden p-2 -ml-2 text-[var(--color-noir)]"
            aria-label="Open menu"
          >
            <Icon name="menu" size={22} />
          </button>

          <Link href="/" className="flex flex-col items-start group">
            <span className="font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[0.02em] text-[var(--color-maroon-deep)] leading-none">
              Rāja<span className="text-gradient-gold italic">vastra</span>
            </span>
            <span className="hidden md:block text-[9px] uppercase tracking-[0.4em] text-[var(--color-gold-deep)] mt-1">
              Heritage Sarees · Est. 1962
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7 text-[13px] tracking-wide">
            {links.map((l) => {
              const active = pathname === l.href.split("?")[0];
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative py-1 transition-colors",
                    active ? "text-[var(--color-maroon)]" : "text-[var(--color-noir)] hover:text-[var(--color-maroon)]",
                  )}
                >
                  {l.label}
                  {active && (
                    <motion.span
                      layoutId="navbar-underline"
                      className="absolute -bottom-1 left-0 right-0 h-px gradient-gold"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1 md:gap-2 text-[var(--color-noir)]">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-[var(--color-cream)] transition-colors focus-ring"
              aria-label="Search by saree code"
            >
              <Icon name="search" size={20} />
            </button>
            <Link
              href="/wishlist"
              className="relative p-2.5 rounded-full hover:bg-[var(--color-cream)] transition-colors focus-ring"
              aria-label="Wishlist"
            >
              <Icon name="heart" size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full gradient-maroon text-[10px] font-semibold text-[var(--color-ivory)]">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className="hidden sm:inline-grid p-2.5 rounded-full hover:bg-[var(--color-cream)] transition-colors focus-ring"
              aria-label="Account"
            >
              <Icon name="user" size={20} />
            </Link>
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full hover:bg-[var(--color-cream)] transition-colors focus-ring"
              aria-label="Shopping bag"
            >
              <Icon name="bag" size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full gradient-maroon text-[10px] font-semibold text-[var(--color-ivory)]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-noir/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 z-[61] w-[80vw] max-w-sm bg-[var(--color-ivory)] p-6 flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-maroon-deep)]">
                  Rāja<span className="text-gradient-gold italic">vastra</span>
                </span>
                <button onClick={() => setOpen(false)} className="p-2" aria-label="Close menu">
                  <Icon name="close" />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)] text-[var(--color-noir)] hover:text-[var(--color-maroon)] transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link href="/account" className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)]">
                  My Account
                </Link>
                <Link href="/tracking" className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)]">
                  Track Order
                </Link>
                <Link href="/admin/dashboard" className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)]">
                  Admin Dashboard
                </Link>
              </nav>
              <div className="mt-auto pt-8">
                <a
                  href="https://wa.me/919999999999"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--color-cream)] text-[var(--color-maroon-deep)]"
                >
                  <Icon name="whatsapp" />
                  <span>WhatsApp concierge</span>
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center pt-[12vh] bg-[var(--color-noir)]/55 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl mx-6 bg-[var(--color-ivory)] rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.4)] overflow-hidden"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/collections?q=${encodeURIComponent(q)}`;
              }}
              className="flex items-center gap-3 px-6 py-5 border-b border-[rgba(201,169,106,0.25)]"
            >
              <Icon name="search" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by saree code (e.g. RV-2401), fabric, or collection…"
                className="flex-1 bg-transparent outline-none text-base placeholder:text-[var(--color-fg-muted)]"
              />
              <button type="button" onClick={onClose} className="p-1 text-[var(--color-fg-muted)]">
                <Icon name="close" size={18} />
              </button>
            </form>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold-deep)] mb-3">Quick search</p>
                <div className="flex flex-wrap gap-2">
                  {["Bridal", "Banarasi", "RV-2401", "Cream", "Under ₹15,000"].map((t) => (
                    <Link
                      key={t}
                      href={`/collections?q=${encodeURIComponent(t)}`}
                      className="px-4 py-1.5 rounded-full text-xs bg-[var(--color-cream)] text-[var(--color-maroon-deep)] hover:bg-[var(--color-cream-warm)] transition-colors"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--color-surface-3)] text-sm">
                <Icon name="image-up" />
                <div>
                  <p className="font-medium">Found a saree on Instagram?</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">
                    <Link href="/visual-search" className="text-[var(--color-maroon)] underline">Upload a screenshot</Link> and we&rsquo;ll identify it for you.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
