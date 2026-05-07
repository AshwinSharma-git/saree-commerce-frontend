"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

type IconName = React.ComponentProps<typeof Icon>["name"];

export function StatCard({
  label,
  value,
  delta,
  positive,
  icon,
  accent,
}: {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  icon: IconName;
  accent?: "gold" | "maroon" | "noir";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-2xl bg-[var(--color-surface)] ring-1 ring-[rgba(90,15,26,0.06)] luxury-shadow-soft"
    >
      <div className="flex items-start justify-between">
        <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-deep)]">{label}</p>
        <span
          className={cn(
            "grid place-items-center h-9 w-9 rounded-full",
            accent === "gold" ? "gradient-gold text-[var(--color-noir)]" :
            accent === "noir" ? "bg-[var(--color-noir)] text-[var(--color-gold-bright)]" :
            "gradient-maroon text-[var(--color-gold-bright)]",
          )}
        >
          <Icon name={icon} size={14} />
        </span>
      </div>
      <p className="mt-5 font-[family-name:var(--font-display)] text-3xl text-[var(--color-noir)]">{value}</p>
      {delta && (
        <p className={cn("mt-2 text-xs flex items-center gap-1.5", positive ? "text-emerald-700" : "text-[var(--color-maroon)]")}>
          <Icon name={positive ? "trending" : "alert"} size={12} />
          {delta}
        </p>
      )}
    </motion.div>
  );
}
