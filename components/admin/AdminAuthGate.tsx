"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Wraps every page under `/admin/*` (except `/admin/login`).
 *
 *   - Waits for the AuthProvider's initial refresh to settle.
 *   - If the user is not signed in, or signed in as a CUSTOMER,
 *     redirects to `/admin/login?next=<original-path>`.
 *   - Otherwise renders the children.
 */
export function AdminAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Login page itself bypasses the gate.
  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (loading || isLoginRoute) return;
    if (!user) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role !== "ADMIN" && user.role !== "STAFF") {
      router.replace("/admin/login?error=forbidden");
    }
  }, [loading, user, pathname, isLoginRoute, router]);

  if (isLoginRoute) return <>{children}</>;

  if (loading || !user || (user.role !== "ADMIN" && user.role !== "STAFF")) {
    return (
      <div className="min-h-screen grid place-items-center bg-[var(--color-ivory)]">
        <div className="flex items-center gap-3 text-[var(--color-fg-muted)]">
          <span className="h-4 w-4 rounded-full border-2 border-[var(--color-maroon)] border-t-transparent animate-spin" />
          <span className="text-sm tracking-wide">Verifying access…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
