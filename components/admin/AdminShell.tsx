"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/admin/dashboard", label: "Overview", icon: "dashboard" as const },
  { href: "/admin/orders", label: "Orders", icon: "package" as const, badge: 7 },
  { href: "/admin/products", label: "Products", icon: "boxes" as const },
  { href: "/admin/inventory", label: "Inventory", icon: "alert" as const, badge: 3, badgeTone: "warn" as const },
  { href: "/admin/customers", label: "Customers", icon: "users" as const },
  { href: "/admin/analytics", label: "Analytics", icon: "trending" as const },
];

export function AdminShell({ children, title, subtitle, actions }: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen flex bg-[var(--color-ivory)]">
      <aside className="hidden lg:flex flex-col w-64 fixed inset-y-0 left-0 bg-[var(--color-noir)] text-[var(--color-ivory)]">
        <Link href="/admin/dashboard" className="px-6 py-7 border-b border-white/5">
          <p className="font-[family-name:var(--font-display)] text-2xl">
            Rāja<span className="text-gradient-gold italic">vastra</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-bright)] mt-1">Atelier Console</p>
        </Link>
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((it) => {
            const active = pathname === it.href || pathname.startsWith(it.href + "/");
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all",
                  active
                    ? "bg-white/5 text-[var(--color-gold-bright)]"
                    : "text-[var(--color-ivory)]/72 hover:bg-white/5 hover:text-[var(--color-ivory)]",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="admin-active"
                    className="absolute left-0 top-2 bottom-2 w-1 rounded-r gradient-gold"
                  />
                )}
                <Icon name={it.icon} size={16} />
                <span className="flex-1">{it.label}</span>
                {it.badge && (
                  <span className={cn(
                    "px-1.5 min-w-[20px] h-[20px] grid place-items-center rounded-full text-[10px] font-medium",
                    it.badgeTone === "warn"
                      ? "bg-[#b83230]/15 text-[#ff7b78]"
                      : "bg-[var(--color-gold)]/15 text-[var(--color-gold-bright)]",
                  )}>
                    {it.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-5 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full grid place-items-center gradient-maroon text-[var(--color-gold-bright)] font-medium">
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">Sanjay Verma</p>
              <p className="text-[11px] text-[var(--color-ivory)]/55">Owner</p>
            </div>
            <Link href="/" className="p-2 hover:text-[var(--color-gold-bright)] transition-colors" aria-label="Back to store">
              <Icon name="logout" size={14} />
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-30 bg-[var(--color-ivory)]/85 backdrop-blur-xl border-b border-[rgba(90,15,26,0.08)]">
          <div className="px-6 lg:px-10 py-5 flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">Atelier Console</p>
              <h1 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-[var(--color-noir)]">{title}</h1>
              {subtitle && <p className="text-sm text-[var(--color-fg-muted)] mt-0.5">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
              {actions}
              <button className="relative h-10 w-10 grid place-items-center rounded-full ring-1 ring-[rgba(90,15,26,0.12)] hover:bg-[var(--color-cream)]" aria-label="Notifications">
                <Icon name="bell" size={16} />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full gradient-gold" />
              </button>
              <Link href="/admin/dashboard" className="lg:hidden h-10 w-10 grid place-items-center rounded-full ring-1 ring-[rgba(90,15,26,0.12)]">
                <Icon name="dashboard" size={16} />
              </Link>
            </div>
          </div>
          {/* Mobile nav */}
          <nav className="lg:hidden px-6 pb-4 flex gap-2 overflow-x-auto hide-scrollbar">
            {navItems.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all",
                    active ? "bg-[var(--color-noir)] text-[var(--color-gold-bright)]" : "bg-[var(--color-cream)] text-[var(--color-noir)]",
                  )}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="px-6 lg:px-10 py-8">{children}</main>
      </div>
    </div>
  );
}
