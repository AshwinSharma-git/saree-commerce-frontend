"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useShop } from "@/lib/store/shop-store";
import { useAuth } from "@/lib/auth/AuthProvider";
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
  const [accountMenu, setAccountMenu] = useState(false);
  const { cartCount, wishlistCount, hydrated } = useShop();
  const { user, logout, isAdmin } = useAuth();

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

  // Light-text mode applies only on the homepage hero, before the user scrolls.
  // Everywhere else (and once scrolled) we revert to the glass + dark-text look.
  const overHero = pathname === "/" && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass shadow-[0_4px_24px_rgba(61,8,16,0.06)]"
            : overHero
              ? "bg-gradient-to-b from-[rgba(15,10,8,0.55)] via-[rgba(15,10,8,0.25)] to-transparent"
              : "bg-[var(--color-ivory)]/90 backdrop-blur-md",
        )}
      >
        {/* Top bar */}
        <div
          className={cn(
            "hidden md:block border-b transition-colors",
            overHero ? "border-white/15" : "border-[rgba(201,169,106,0.18)]",
          )}
        >
          <div
            className={cn(
              "mx-auto max-w-[1320px] px-6 md:px-10 flex justify-between items-center py-2 text-[11px] tracking-wider transition-colors",
              overHero ? "text-[var(--color-ivory)]/80" : "text-[var(--color-fg-muted)]",
            )}
          >
            <span className="uppercase">Complimentary express delivery on every order</span>
            <div className="flex items-center gap-5">
              <a
                href="https://wa.me/919999999999"
                className={cn(
                  "inline-flex items-center gap-1.5 transition-colors",
                  overHero ? "hover:text-[var(--color-gold-bright)]" : "hover:text-[var(--color-maroon)]",
                )}
              >
                <Icon name="whatsapp" size={14} /> WhatsApp Concierge
              </a>
              <a
                href="https://instagram.com"
                className={cn(
                  "inline-flex items-center gap-1.5 transition-colors",
                  overHero ? "hover:text-[var(--color-gold-bright)]" : "hover:text-[var(--color-maroon)]",
                )}
              >
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
            className={cn("lg:hidden p-2 -ml-2 transition-colors", overHero ? "text-[var(--color-ivory)]" : "text-[var(--color-noir)]")}
            aria-label="Open menu"
          >
            <Icon name="menu" size={22} />
          </button>

          <Link href="/" className="flex flex-col items-start group">
            <span
              className={cn(
                "font-[family-name:var(--font-display)] text-2xl md:text-3xl tracking-[0.02em] leading-none transition-colors",
                overHero ? "text-[var(--color-ivory)]" : "text-[var(--color-maroon-deep)]",
              )}
            >
              Rāja<span className="text-gradient-gold italic">vastra</span>
            </span>
            <span
              className={cn(
                "hidden md:block text-[9px] uppercase tracking-[0.4em] mt-1 transition-colors",
                overHero ? "text-[var(--color-gold-bright)]" : "text-[var(--color-gold-deep)]",
              )}
            >
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
                    active
                      ? overHero
                        ? "text-[var(--color-gold-bright)]"
                        : "text-[var(--color-maroon)]"
                      : overHero
                        ? "text-[var(--color-ivory)] hover:text-[var(--color-gold-bright)]"
                        : "text-[var(--color-noir)] hover:text-[var(--color-maroon)]",
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

          <div
            className={cn(
              "flex items-center gap-1 md:gap-2 transition-colors",
              overHero ? "text-[var(--color-ivory)]" : "text-[var(--color-noir)]",
            )}
          >
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={cn(
                "p-2.5 rounded-full transition-colors focus-ring",
                overHero ? "hover:bg-white/15" : "hover:bg-[var(--color-cream)]",
              )}
              aria-label="Search by saree code"
            >
              <Icon name="search" size={20} />
            </button>
            <Link
              href="/wishlist"
              className={cn(
                "relative p-2.5 rounded-full transition-colors focus-ring",
                overHero ? "hover:bg-white/15" : "hover:bg-[var(--color-cream)]",
              )}
              aria-label="Wishlist"
            >
              <Icon name="heart" size={20} />
              {hydrated && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full gradient-gold text-[10px] font-semibold text-[var(--color-noir)]">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <div className="hidden sm:block relative">
              <button
                type="button"
                onClick={() => setAccountMenu((v) => !v)}
                className={cn(
                  "p-2.5 rounded-full transition-colors focus-ring inline-flex items-center gap-2",
                  overHero ? "hover:bg-white/15" : "hover:bg-[var(--color-cream)]",
                )}
                aria-label={user ? "Account menu" : "Sign in"}
                aria-expanded={accountMenu}
              >
                {user ? (
                  <span className="h-7 w-7 rounded-full grid place-items-center gradient-maroon text-[10px] font-medium text-[var(--color-gold-bright)]">
                    {(user.firstName?.charAt(0) ?? user.email?.charAt(0) ?? "A").toUpperCase()}
                  </span>
                ) : (
                  <Icon name="user" size={20} />
                )}
              </button>
              <AnimatePresence>
                {accountMenu && (
                  <>
                    <motion.div
                      className="fixed inset-0 z-[50]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setAccountMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-60 z-[60] p-2 rounded-2xl bg-[var(--color-ivory)] ring-1 ring-[rgba(90,15,26,0.12)] shadow-[0_24px_60px_rgba(61,8,16,0.18)] text-[var(--color-noir)]"
                    >
                      {user ? (
                        <>
                          <div className="px-3 pt-2 pb-3 border-b border-[rgba(90,15,26,0.08)]">
                            <p className="text-sm font-medium truncate">
                              {[user.firstName, user.lastName].filter(Boolean).join(" ") || "Account"}
                            </p>
                            <p className="text-xs text-[var(--color-fg-muted)] truncate">{user.email}</p>
                          </div>
                          <MenuLink href="/account" icon="user">My account</MenuLink>
                          <MenuLink href="/wishlist" icon="heart">Wishlist</MenuLink>
                          <MenuLink href="/tracking" icon="truck">Track an order</MenuLink>
                          {isAdmin && (
                            <MenuLink href="/admin/dashboard" icon="dashboard">
                              Atelier console
                            </MenuLink>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setAccountMenu(false);
                              void logout();
                            }}
                            className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-[var(--color-cream)] text-[var(--color-maroon)]"
                          >
                            <Icon name="logout" size={14} /> Sign out
                          </button>
                        </>
                      ) : (
                        <>
                          <MenuLink href="/login" icon="user">Sign in</MenuLink>
                          <MenuLink href="/signup" icon="sparkle">Create account</MenuLink>
                          <div className="my-1 h-px bg-[rgba(90,15,26,0.08)]" />
                          <MenuLink href="/admin/login" icon="lock">
                            Atelier console
                          </MenuLink>
                        </>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            <Link
              href="/cart"
              className={cn(
                "relative p-2.5 rounded-full transition-colors focus-ring",
                overHero ? "hover:bg-white/15" : "hover:bg-[var(--color-cream)]",
              )}
              aria-label="Shopping bag"
            >
              <Icon name="bag" size={20} />
              {hydrated && cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full gradient-gold text-[10px] font-semibold text-[var(--color-noir)]">
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
                {user ? (
                  <>
                    <Link href="/account" className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)]">
                      My Account
                    </Link>
                    <Link href="/tracking" className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)]">
                      Track Order
                    </Link>
                    {isAdmin && (
                      <Link href="/admin/dashboard" className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)]">
                        Atelier console
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        void logout();
                      }}
                      className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)] text-[var(--color-maroon)] text-left"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)]">
                      Sign in
                    </Link>
                    <Link href="/signup" className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)]">
                      Create account
                    </Link>
                    <Link href="/admin/login" className="py-3 text-lg border-b border-[rgba(201,169,106,0.18)] text-[var(--color-fg-muted)]">
                      Atelier console
                    </Link>
                  </>
                )}
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

function MenuLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ComponentProps<typeof Icon>["name"];
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm hover:bg-[var(--color-cream)] text-[var(--color-noir)]"
    >
      <Icon name={icon} size={14} className="text-[var(--color-fg-muted)]" />
      <span>{children}</span>
    </Link>
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
