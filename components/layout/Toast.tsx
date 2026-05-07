"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useShop } from "@/lib/store/shop-store";
import { Icon } from "@/components/ui/Icon";

export function Toast() {
  const { toast } = useShop();
  return (
    <div className="fixed bottom-6 right-6 z-[200] pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-full bg-[var(--color-noir)] text-[var(--color-ivory)] shadow-[0_24px_60px_rgba(0,0,0,0.35)] ring-1 ring-[rgba(201,169,106,0.35)]"
          >
            <span className="grid place-items-center h-7 w-7 rounded-full gradient-gold text-[var(--color-noir)]">
              <Icon name="check" size={16} />
            </span>
            <span className="text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
