"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "gold" | "outline" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const base =
  "relative inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-all duration-300 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed focus-ring select-none";

const variants: Record<Variant, string> = {
  primary:
    "gradient-maroon text-ivory shadow-[0_10px_30px_rgba(90,15,26,0.28)] hover:shadow-[0_14px_36px_rgba(90,15,26,0.36)] hover:brightness-110",
  secondary:
    "bg-cream text-maroon-deep ring-1 ring-[rgba(90,15,26,0.18)] hover:bg-cream-warm hover:ring-[rgba(90,15,26,0.28)]",
  ghost: "text-maroon-deep hover:bg-cream/70",
  gold:
    "gradient-gold text-noir shadow-[0_10px_30px_rgba(201,169,106,0.36)] hover:shadow-[0_14px_36px_rgba(201,169,106,0.5)] hover:brightness-105",
  outline:
    "bg-transparent text-maroon-deep ring-1 ring-[rgba(90,15,26,0.35)] hover:bg-maroon hover:text-ivory hover:ring-maroon",
  dark: "bg-noir text-ivory hover:bg-noir-soft",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-4 py-2 rounded-full",
  md: "text-sm px-6 py-3 rounded-full",
  lg: "text-base px-8 py-4 rounded-full",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", iconLeft, iconRight, loading, fullWidth, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {!loading && iconLeft}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
});
