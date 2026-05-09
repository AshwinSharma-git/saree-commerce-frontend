"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ApiError } from "@/lib/api/client";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-noir)]" />}>
      <AdminLoginInner />
    </Suspense>
  );
}

function AdminLoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin/dashboard";
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already authenticated as admin/staff? Skip the form.
  if (!loading && user && (user.role === "ADMIN" || user.role === "STAFF")) {
    router.replace(next);
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const u = await login({ email: email.trim().toLowerCase(), password });
      if (u.role !== "ADMIN" && u.role !== "STAFF") {
        setError("This account doesn't have access to the atelier console.");
        setSubmitting(false);
        return;
      }
      router.replace(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't sign in.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-noir)] text-[var(--color-ivory)] flex items-center justify-center px-6 py-16 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full gradient-maroon blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full gradient-gold blur-3xl opacity-40" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="text-center">
          <Link href="/" className="inline-block">
            <p className="font-[family-name:var(--font-display)] text-3xl">
              Rāja<span className="text-gradient-gold italic">vastra</span>
            </p>
          </Link>
          <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-bright)]">
            Atelier Console
          </p>
        </div>

        <div className="mt-10 p-8 rounded-3xl bg-white/[0.03] ring-1 ring-[var(--color-gold)]/20 backdrop-blur-xl">
          <h1 className="font-[family-name:var(--font-display)] text-3xl">Admin sign-in</h1>
          <p className="mt-2 text-sm text-[var(--color-ivory)]/65">
            Enter the credentials issued for the atelier console.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <DarkField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              placeholder="admin@rajavastra.in"
              required
            />
            <DarkField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />

            {error && (
              <p
                role="alert"
                className="px-4 py-3 rounded-xl bg-[#b83230]/15 text-[#ff8a85] text-sm"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="gold"
              size="lg"
              fullWidth
              loading={submitting}
              iconRight={<Icon name="arrow-right" size={16} />}
            >
              {submitting ? "Signing in…" : "Enter console"}
            </Button>

            <div className="pt-2 text-xs text-[var(--color-ivory)]/55 text-center">
              Demo admin · <span className="font-mono">admin@rajavastra.in</span> /{" "}
              <span className="font-mono">Admin@12345</span>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-[var(--color-ivory)]/55">
          <Link href="/login" className="hover:text-[var(--color-gold-bright)]">
            ← Back to customer sign-in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

interface FieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

function DarkField({ label, type, value, onChange, placeholder, autoComplete, required }: FieldProps) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-bright)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="mt-2 w-full px-4 py-3.5 rounded-xl bg-white/5 ring-1 ring-white/10 text-base text-[var(--color-ivory)] placeholder:text-[var(--color-ivory)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] transition-shadow"
      />
    </label>
  );
}
