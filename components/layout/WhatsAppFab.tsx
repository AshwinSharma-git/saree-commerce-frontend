"use client";

import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

export function WhatsAppFab() {
  return (
    <motion.a
      href="https://wa.me/919999999999?text=Hi!%20I%20saw%20your%20sarees%20on%20Instagram"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 left-6 z-[150] group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full gradient-gold blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
      <span className="relative flex items-center gap-3 pl-3 pr-5 py-3 rounded-full bg-[#25D366] text-white shadow-[0_18px_40px_rgba(37,211,102,0.36)] ring-1 ring-white/30">
        <span className="grid place-items-center h-9 w-9 rounded-full bg-white/15">
          <Icon name="whatsapp" size={18} />
        </span>
        <span className="hidden sm:block text-sm font-medium tracking-wide">Concierge</span>
      </span>
    </motion.a>
  );
}
