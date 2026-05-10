"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useShop } from "@/lib/store/shop-store";
import { useAuth } from "@/lib/auth/AuthProvider";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { products as staticProducts } from "@/lib/data/products";
import { productsApi } from "@/lib/api/products";
import { adaptProduct } from "@/lib/api/adapt";
import { ordersApi } from "@/lib/api/orders";
import { ApiError } from "@/lib/api/client";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

const steps = ["Address", "Delivery", "Payment"] as const;

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutInner />
    </RequireAuth>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const { cart, clearCart, removeFromCart } = useShop();
  const { user } = useAuth();
  const cartIds = useMemo(() => Object.keys(cart), [cart]);
  const [fetched, setFetched] = useState<Record<string, Product>>({});
  // Map of cart-key (id used in the cart store) → real DB product id.
  // For live products this is identity; for static p_xxx ids we resolve
  // by code to the actual DB product so /orders/create accepts them.
  const [liveIdByCartKey, setLiveIdByCartKey] = useState<Record<string, string>>({});
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());
  const resolving = cartIds.some(
    (id) => !fetched[id] && !staticProducts.find((p) => p.id === id) && !attemptedIds.has(id),
  );

  // Resolve cart ids:
  //  1. If id is a live cuid, byId() returns the product directly.
  //  2. If id is a static p_xxx, byId() 404s; fall back to byCode() using
  //     the static product's saree code so we still get the live DB id.
  useEffect(() => {
    let cancelled = false;
    const missing = cartIds.filter((id) => !attemptedIds.has(id));
    if (missing.length === 0) return;
    setAttemptedIds((prev) => {
      const next = new Set(prev);
      missing.forEach((id) => next.add(id));
      return next;
    });
    Promise.all(
      missing.map(async (id) => {
        // Try as a live cuid first.
        const direct = await productsApi.byId(id).catch(() => null);
        if (direct) return { cartKey: id, api: direct };
        // Fallback: if it's a static id, look up by the saree code.
        const stat = staticProducts.find((p) => p.id === id);
        if (stat) {
          const byCode = await productsApi.byCode(stat.code).catch(() => null);
          if (byCode) return { cartKey: id, api: byCode };
        }
        return { cartKey: id, api: null };
      }),
    ).then((results) => {
      if (cancelled) return;
      const fetchedNext: Record<string, Product> = {};
      const idMap: Record<string, string> = {};
      results.forEach(({ cartKey, api }) => {
        if (api) {
          fetchedNext[cartKey] = adaptProduct(api);
          idMap[cartKey] = api.id;
        }
      });
      if (Object.keys(fetchedNext).length > 0) {
        setFetched((prev) => ({ ...prev, ...fetchedNext }));
      }
      if (Object.keys(idMap).length > 0) {
        setLiveIdByCartKey((prev) => ({ ...prev, ...idMap }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [cartIds, attemptedIds]);

  const items = cartIds
    .map((id) => {
      const product = fetched[id] ?? staticProducts.find((p) => p.id === id);
      return product ? { product, qty: cart[id], cartKey: id } : null;
    })
    .filter((x): x is { product: Product; qty: number; cartKey: string } => x !== null);

  const subtotal = items.reduce((sum, it) => sum + it.product.price * it.qty, 0);
  const shipping = 0;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState<"express" | "standard" | "white-glove">("express");
  const [payment, setPayment] = useState<"upi" | "card" | "netbanking" | "cod">("upi");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (items.length === 0 && cartIds.length > 0 && resolving) {
    return (
      <Section className="!py-32 text-center">
        <div className="inline-flex items-center gap-3 text-[var(--color-fg-muted)]">
          <span className="h-4 w-4 rounded-full border-2 border-[var(--color-maroon)] border-t-transparent animate-spin" />
          <span className="text-sm tracking-wide">Loading your bag…</span>
        </div>
      </Section>
    );
  }
  if (items.length === 0) {
    return (
      <Section className="!py-32 text-center">
        <p className="text-[var(--color-fg-muted)]">Your bag is empty.</p>
        <Link href="/collections" className="inline-block mt-4 text-[var(--color-maroon)] underline">
          Browse collections
        </Link>
      </Section>
    );
  }

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setSubmitError(null);

    // RequireAuth guarantees `user` is set before this component renders,
    // so this branch is unreachable. Kept as a safety net so we never
    // POST /orders without an Authorization header.
    if (!user) {
      setSubmitError("Please sign in to place an order.");
      setSubmitting(false);
      return;
    }

    // Build the payload using LIVE DB ids (resolved via API). Items whose
    // cart key never resolved to a real product get dropped here — they
    // can't be ordered, and submitting them would 400 with "Some items are
    // unavailable". We surface that to the user instead of silently failing.
    const payload = items
      .map((it) => ({
        cartKey: it.cartKey,
        liveId: liveIdByCartKey[it.cartKey],
        qty: it.qty,
        title: it.product.name,
      }))
      .filter((x) => Boolean(x.liveId));
    const dropped = items.length - payload.length;

    if (payload.length === 0) {
      setSubmitError(
        "None of the items in your bag are available right now. Please refresh or browse the latest collection.",
      );
      setSubmitting(false);
      return;
    }

    try {
      const order = await ordersApi.create({
        channel: "WEB",
        items: payload.map((it) => ({
          productId: it.liveId as string,
          quantity: it.qty,
        })),
      });
      // Clear out the orphan static-id cart entries that were dropped, so
      // they don't keep haunting future checkouts.
      items.forEach((it) => {
        if (!liveIdByCartKey[it.cartKey]) removeFromCart(it.cartKey);
      });
      clearCart();
      router.push(`/tracking?order=${encodeURIComponent(order.number)}`);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not place order. Please try again.";
      setSubmitError(
        dropped > 0
          ? `${message} (${dropped} item${dropped === 1 ? "" : "s"} were unavailable and skipped.)`
          : message,
      );
      setSubmitting(false);
    }
  };

  return (
    <Section className="!pt-8 !pb-24">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Eyebrow>Checkout</Eyebrow>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
            One last drape away.
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={cn(
                  "h-8 w-8 grid place-items-center rounded-full text-xs font-medium transition-all",
                  i <= step ? "bg-[var(--color-maroon)] text-[var(--color-ivory)]" : "bg-[var(--color-cream)] text-[var(--color-fg-muted)]",
                )}
              >
                {i < step ? <Icon name="check" size={14} /> : i + 1}
              </div>
              <span className={cn("text-xs uppercase tracking-[0.28em]", i === step ? "text-[var(--color-maroon)]" : "text-[var(--color-fg-muted)]")}>
                {s}
              </span>
              {i < steps.length - 1 && <span className="h-px w-6 bg-[rgba(90,15,26,0.2)]" />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.section
                key="addr"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-7 rounded-2xl bg-[var(--color-surface)] luxury-shadow-soft ring-1 ring-[rgba(90,15,26,0.06)]"
              >
                <h2 className="font-[family-name:var(--font-display)] text-2xl mb-6">Shipping address</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" placeholder="Anaya Kapoor" />
                  <Field label="Phone" placeholder="+91 98765 43210" />
                  <Field label="Email" placeholder="anaya@example.com" className="sm:col-span-2" />
                  <Field label="Address line 1" placeholder="Flat 12, Walkeshwar Road" className="sm:col-span-2" />
                  <Field label="Address line 2" placeholder="Near Banganga Tank" className="sm:col-span-2" />
                  <Field label="City" placeholder="Mumbai" />
                  <Field label="State" placeholder="Maharashtra" />
                  <Field label="Pincode" placeholder="400006" />
                  <Field label="Landmark (optional)" placeholder="Beside Hanging Gardens" />
                </div>
                <div className="mt-7 flex justify-end">
                  <Button variant="primary" onClick={() => setStep(1)} iconRight={<Icon name="arrow-right" size={16} />}>
                    Continue to delivery
                  </Button>
                </div>
              </motion.section>
            )}

            {step === 1 && (
              <motion.section
                key="del"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-7 rounded-2xl bg-[var(--color-surface)] luxury-shadow-soft ring-1 ring-[rgba(90,15,26,0.06)]"
              >
                <h2 className="font-[family-name:var(--font-display)] text-2xl mb-6">Choose your delivery</h2>
                <div className="space-y-3">
                  {[
                    { id: "express", t: "Express delivery", sub: "2–3 working days · Complimentary", icon: "truck" as const, badge: "Recommended" },
                    { id: "standard", t: "Standard delivery", sub: "5–7 working days · Complimentary", icon: "package" as const },
                    { id: "white-glove", t: "White-glove concierge", sub: "Hand-delivered by atelier · ₹1,500", icon: "sparkle" as const },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setDelivery(opt.id as typeof delivery)}
                      className={cn(
                        "w-full flex items-center gap-4 p-5 rounded-xl ring-1 transition-all text-left",
                        delivery === opt.id
                          ? "ring-[var(--color-maroon)] bg-[var(--color-cream)]"
                          : "ring-[rgba(90,15,26,0.12)] hover:ring-[var(--color-gold)]",
                      )}
                    >
                      <span className="grid place-items-center h-12 w-12 rounded-full bg-[var(--color-noir)] text-[var(--color-gold-bright)]">
                        <Icon name={opt.icon} />
                      </span>
                      <div className="flex-1">
                        <p className="font-medium flex items-center gap-2">
                          {opt.t}
                          {opt.badge && <span className="px-2 py-0.5 rounded-full text-[10px] gradient-gold text-[var(--color-noir)]">{opt.badge}</span>}
                        </p>
                        <p className="text-xs text-[var(--color-fg-muted)] mt-0.5">{opt.sub}</p>
                      </div>
                      <span className={cn("h-5 w-5 rounded-full grid place-items-center", delivery === opt.id ? "bg-[var(--color-maroon)] text-[var(--color-ivory)]" : "ring-1 ring-[rgba(90,15,26,0.25)]")}>
                        {delivery === opt.id && <Icon name="check" size={11} />}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-7 flex justify-between">
                  <Button variant="secondary" onClick={() => setStep(0)} iconLeft={<Icon name="arrow-left" size={16} />}>Back</Button>
                  <Button variant="primary" onClick={() => setStep(2)} iconRight={<Icon name="arrow-right" size={16} />}>
                    Continue to payment
                  </Button>
                </div>
              </motion.section>
            )}

            {step === 2 && (
              <motion.section
                key="pay"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="p-7 rounded-2xl bg-[var(--color-surface)] luxury-shadow-soft ring-1 ring-[rgba(90,15,26,0.06)]"
              >
                <h2 className="font-[family-name:var(--font-display)] text-2xl mb-6">Payment method</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    { id: "upi", t: "UPI / GPay", icon: "phone" as const },
                    { id: "card", t: "Credit / debit card", icon: "credit-card" as const },
                    { id: "netbanking", t: "Net banking", icon: "shield" as const },
                    { id: "cod", t: "Cash on delivery", icon: "package" as const },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setPayment(opt.id as typeof payment)}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl ring-1 transition-all text-left",
                        payment === opt.id
                          ? "ring-[var(--color-maroon)] bg-[var(--color-cream)]"
                          : "ring-[rgba(90,15,26,0.12)] hover:ring-[var(--color-gold)]",
                      )}
                    >
                      <span className="grid place-items-center h-10 w-10 rounded-full bg-[var(--color-cream-warm)] text-[var(--color-maroon)]">
                        <Icon name={opt.icon} size={16} />
                      </span>
                      <span className="text-sm font-medium">{opt.t}</span>
                    </button>
                  ))}
                </div>

                {payment === "card" && (
                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    <Field label="Card number" placeholder="1234 5678 9012 3456" className="sm:col-span-2" />
                    <Field label="Expiry" placeholder="MM / YY" />
                    <Field label="CVV" placeholder="•••" />
                  </div>
                )}
                {payment === "upi" && (
                  <div className="mt-6">
                    <Field label="UPI ID" placeholder="anaya@upi" />
                  </div>
                )}

                {submitError && (
                  <p className="mt-5 px-4 py-3 rounded-xl bg-[var(--color-maroon)]/10 text-[var(--color-maroon)] text-sm" role="alert">
                    {submitError}
                  </p>
                )}

                {!user && (
                  <p className="mt-5 px-4 py-3 rounded-xl bg-[var(--color-cream-warm)] text-[var(--color-maroon-deep)] text-xs" role="status">
                    You're checking out as a guest. <Link href="/account" className="underline">Sign in</Link> to track your order in your account.
                  </p>
                )}

                <div className="mt-7 flex justify-between">
                  <Button variant="secondary" onClick={() => setStep(1)} iconLeft={<Icon name="arrow-left" size={16} />}>Back</Button>
                  <Button variant="gold" onClick={handlePlaceOrder} loading={submitting}>
                    {submitting ? "Placing order…" : `Pay ${formatINR(total)} (demo)`}
                  </Button>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Mini cart */}
        <aside className="lg:col-span-4">
          <div className="sticky top-32 p-6 rounded-2xl bg-[var(--color-cream)]">
            <h3 className="font-[family-name:var(--font-display)] text-xl mb-4">Your bag</h3>
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 hide-scrollbar">
              {items.map(({ product, qty }) => (
                <div key={product.id} className="flex gap-3">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={product.image} alt={product.name} fill sizes="100px" className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{product.name}</p>
                    <p className="text-xs text-[var(--color-fg-muted)]">Qty {qty} · {formatINR(product.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="my-4 h-px gold-divider" />
            <div className="space-y-2 text-sm">
              <Row l="Subtotal" v={formatINR(subtotal)} />
              <Row l="GST (5%)" v={formatINR(tax)} />
              <Row l="Shipping" v="Complimentary" />
              <div className="my-2 h-px bg-[rgba(90,15,26,0.12)]" />
              <Row l="Total" v={formatINR(total)} bold />
            </div>
            <p className="mt-4 text-[10px] text-[var(--color-fg-muted)] uppercase tracking-wide flex items-center gap-1.5">
              <Icon name="lock" size={12} /> Encrypted · PCI-DSS compliant
            </p>
          </div>
        </aside>
      </div>
    </Section>
  );
}

function Row({ l, v, bold }: { l: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--color-fg-muted)]">{l}</span>
      <span className={bold ? "font-[family-name:var(--font-display)] text-lg text-[var(--color-maroon-deep)]" : ""}>{v}</span>
    </div>
  );
}

function Field({
  label,
  placeholder,
  className,
}: {
  label: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold-deep)]">{label}</span>
      <input
        placeholder={placeholder}
        className="mt-2 w-full px-4 py-3 rounded-xl bg-[var(--color-cream)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)]/40"
      />
    </label>
  );
}
