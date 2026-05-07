import { cn } from "@/lib/cn";

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Delivered" ? "bg-emerald-50 text-emerald-700"
    : status === "Cancelled" ? "bg-[#ffd5d2] text-[#7a1f15]"
    : status === "Out for Delivery" || status === "Shipped" ? "bg-[var(--color-cream-warm)] text-[var(--color-maroon-deep)]"
    : status === "Packed" ? "bg-[#e6e1d4] text-[var(--color-noir)]"
    : "bg-[var(--color-cream)] text-[var(--color-noir)]";
  return (
    <span className={cn("inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-medium whitespace-nowrap", tone)}>
      {status}
    </span>
  );
}
