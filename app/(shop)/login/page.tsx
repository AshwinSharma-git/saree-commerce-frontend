"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthProvider";
import { ApiError } from "@/lib/api/client";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/account";
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed-in? Bounce them straight to the destination.
  if (user) {
    router.replace(user.role === "ADMIN" || user.role === "STAFF" ? "/admin/dashboard" : next);
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const u = await login({ email: email.trim().toLowerCase(), password });
      router.replace(u.role === "ADMIN" || u.role === "STAFF" ? "/admin/dashboard" : next);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't sign in. Please check your details and try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <Section className="!pt-12 !pb-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
        {/* Left: brand panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:flex relative rounded-3xl overflow-hidden bg-[var(--color-noir)] text-[var(--color-ivory)]"
        >
          <div
            className="absolute inset-0 opacity-90 kenburns"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1600&q=85')",
              backgroundSize: "cover",
              backgroundPosition: "center 22%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-noir)]/95 via-[var(--color-noir)]/55 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end p-12">
            <Eyebrow className="!text-[var(--color-gold-bright)]">Welcome back</Eyebrow>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl xl:text-5xl leading-tight">
              Sign in to continue your{" "}
              <em className="font-[family-name:var(--font-script)] italic text-gradient-gold">
                heirloom
              </em>{" "}
              journey.
            </h2>
            <p className="mt-4 max-w-md text-[var(--color-ivory)]/75 leading-relaxed">
              Track orders, save pieces to your wishlist, and chat with our concierge — all in one
              place.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <span className="h-px w-12 gradient-gold" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-bright)]">
                Rājavastra · Est. 1962
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto lg:mx-0"
        >
          <Eyebrow>Atelier Account</Eyebrow>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[var(--color-noir)] leading-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-[var(--color-fg-muted)]">
            New here?{" "}
            <Link
              href={`/signup${sp.get("next") ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-[var(--color-maroon)] underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
            .
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <Field
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={setEmail}
              placeholder="anaya@example.com"
              required
            />
            <Field
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              required
            />

            {error && (
              <p
                role="alert"
                className="px-4 py-3 rounded-xl bg-[var(--color-maroon)]/10 text-[var(--color-maroon)] text-sm"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={submitting}
              iconRight={<Icon name="arrow-right" size={16} />}
            >
              {submitting ? "Signing in…" : "Sign in"}
            </Button>

            <div className="pt-4 text-xs text-[var(--color-fg-muted)] text-center">
              Demo customer · <span className="font-mono">anaya@example.com</span> /{" "}
              <span className="font-mono">Customer@1</span>
            </div>
            <Link
              href="/admin/login"
              className="block text-center text-[11px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)] hover:text-[var(--color-maroon)]"
            >
              Atelier console (admin) →
            </Link>
          </form>
        </motion.div>
      </div>
    </Section>
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

function Field({ label, type, value, onChange, placeholder, autoComplete, required }: FieldProps) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="mt-2 w-full px-4 py-3.5 rounded-xl bg-[var(--color-cream)] text-base focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)]/40 transition-shadow"
      />
    </label>
  );
}
