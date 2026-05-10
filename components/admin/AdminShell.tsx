"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getSocket } from "@/lib/socket/client";
import { cn } from "@/lib/cn";

interface AdminAlert {
  id: number;
  kind: string;
  message: string;
  at: number;
}

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
  const router = useRouter();
  const { user, logout } = useAuth();
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Subscribe to live admin alerts (fired by the backend events bus).
  useEffect(() => {
    const socket = getSocket();
    let nextId = 1;
    const onAlert = (payload: { kind?: string; preview?: string; from?: string; template?: string }) => {
      const kind = payload.kind ?? "alert";
      const message =
        payload.preview ??
        (payload.template ? `WhatsApp · ${payload.template}` : null) ??
        (payload.from ? `From ${payload.from}` : kind);
      setAlerts((prev) => [{ id: nextId++, kind, message, at: Date.now() }, ...prev].slice(0, 12));
    };
    socket.on("admin:alert", onAlert);
    return () => {
      socket.off("admin:alert", onAlert);
    };
  }, []);

  // Close bell dropdown on outside click.
  useEffect(() => {
    if (!bellOpen) return;
    const onClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [bellOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace("/admin/login");
    }
  };

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email || "Admin"
    : "Admin";
  const displayInitial = (displayName[0] ?? "A").toUpperCase();
  const displayRole = user?.role === "STAFF" ? "Staff" : "Owner";

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
              {displayInitial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm truncate">{displayName}</p>
              <p className="text-[11px] text-[var(--color-ivory)]/55">{displayRole}</p>
            </div>
            <Link
              href="/"
              className="p-2 text-[var(--color-ivory)]/55 hover:text-[var(--color-gold-bright)] transition-colors"
              aria-label="Back to store"
              title="Back to store"
            >
              <Icon name="arrow-right" size={14} />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 text-[var(--color-ivory)]/55 hover:text-[var(--color-gold-bright)] transition-colors"
              aria-label="Sign out"
              title="Sign out"
            >
              <Icon name="logout" size={14} />
            </button>
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
              <div ref={bellRef} className="relative">
                <button
                  type="button"
                  onClick={() => setBellOpen((o) => !o)}
                  className="relative h-10 w-10 grid place-items-center rounded-full ring-1 ring-[rgba(90,15,26,0.12)] hover:bg-[var(--color-cream)]"
                  aria-label="Notifications"
                  aria-expanded={bellOpen}
                >
                  <Icon name="bell" size={16} />
                  {alerts.length > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full gradient-gold" />
                  )}
                </button>
                <AnimatePresence>
                  {bellOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.1)] luxury-shadow-soft z-40"
                    >
                      <div className="px-4 py-3 border-b border-[rgba(90,15,26,0.08)] flex items-center justify-between">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold-deep)]">Live alerts</p>
                        {alerts.length > 0 && (
                          <button
                            onClick={() => setAlerts([])}
                            className="text-[10px] text-[var(--color-fg-muted)] hover:text-[var(--color-maroon)]"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      {alerts.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm text-[var(--color-fg-muted)]">No new alerts</p>
                          <p className="text-xs text-[var(--color-fg-muted)]/70 mt-1">
                            Order, inventory, and WhatsApp events appear here in real time.
                          </p>
                        </div>
                      ) : (
                        <ul className="divide-y divide-[rgba(90,15,26,0.06)]">
                          {alerts.map((a) => (
                            <li key={a.id} className="px-4 py-3 hover:bg-[var(--color-cream)]/40">
                              <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold-deep)]">{a.kind}</p>
                              <p className="text-sm mt-0.5 line-clamp-2">{a.message}</p>
                              <p className="text-[10px] text-[var(--color-fg-muted)] mt-1">
                                {new Date(a.at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
