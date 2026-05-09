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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <SignupInner />
    </Suspense>
  );
}

function SignupInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/account";
  const { signup, user } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) router.replace(next);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signup({
        email: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      router.replace(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't create your account.");
      setSubmitting(false);
    }
  };

  return (
    <Section className="!pt-12 !pb-24">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:flex relative rounded-3xl overflow-hidden bg-[var(--color-noir)] text-[var(--color-ivory)]"
        >
          <div
            className="absolute inset-0 opacity-90 kenburns"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&w=1600&q=85')",
              backgroundSize: "cover",
              backgroundPosition: "center 25%",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-noir)]/95 via-[var(--color-noir)]/55 to-transparent" />
          <div className="relative z-10 flex flex-col justify-end p-12">
            <Eyebrow className="!text-[var(--color-gold-bright)]">Join the atelier</Eyebrow>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl xl:text-5xl leading-tight">
              Be the first to receive{" "}
              <em className="font-[family-name:var(--font-script)] italic text-gradient-gold">
                heritage
              </em>{" "}
              drops &amp; private invitations.
            </h2>
            <p className="mt-4 max-w-md text-[var(--color-ivory)]/75 leading-relaxed">
              Save pieces to your wishlist, track your orders live, and chat with our concierge over
              WhatsApp.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto lg:mx-0"
        >
          <Eyebrow>Create Account</Eyebrow>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl text-[var(--color-noir)] leading-tight">
            Begin your story
          </h1>
          <p className="mt-2 text-[var(--color-fg-muted)]">
            Already have an account?{" "}
            <Link
              href={`/login${sp.get("next") ? `?next=${encodeURIComponent(next)}` : ""}`}
              className="text-[var(--color-maroon)] underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
            .
          </p>

          <form onSubmit={onSubmit} className="mt-10 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="First name" value={firstName} onChange={setFirstName} required />
              <Field label="Last name" value={lastName} onChange={setLastName} />
            </div>
            <Field label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} required />
            <Field
              label="WhatsApp number"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={setPhone}
              placeholder="+919876543210"
            />
            <Field
              label="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={setPassword}
              placeholder="At least 8 characters · 1 uppercase · 1 digit"
              required
            />

            {error && (
              <p role="alert" className="px-4 py-3 rounded-xl bg-[var(--color-maroon)]/10 text-[var(--color-maroon)] text-sm">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="lg" fullWidth loading={submitting} iconRight={<Icon name="arrow-right" size={16} />}>
              {submitting ? "Creating account…" : "Create account"}
            </Button>
            <p className="text-xs text-[var(--color-fg-muted)] text-center">
              By creating an account you agree to our heritage policies.
            </p>
          </form>
        </motion.div>
      </div>
    </Section>
  );
}

interface FieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: FieldProps) {
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
