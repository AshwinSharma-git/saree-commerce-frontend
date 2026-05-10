"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";

/**
 * Customer-side auth gate. Wrap any route that requires a signed-in user
 * (checkout, account, wishlist) with this component.
 *
 *   - Waits for the AuthProvider's initial refresh.
 *   - If unauthenticated, redirects to /login?next=<original-path>
 *     so the user lands back here after signing in.
 *   - Otherwise renders the children unchanged.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, pathname, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="flex items-center gap-3 text-[var(--color-fg-muted)]">
          <span className="h-4 w-4 rounded-full border-2 border-[var(--color-maroon)] border-t-transparent animate-spin" />
          <span className="text-sm tracking-wide">
            {loading ? "Checking your session…" : "Redirecting to sign in…"}
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
