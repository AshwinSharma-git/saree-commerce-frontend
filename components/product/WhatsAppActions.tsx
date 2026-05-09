"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  buildSendCodeMessage,
  buildShareMessage,
  buildWaLink,
} from "@/lib/whatsapp/share";

interface Props {
  code: string;
  title: string;
  /** Canonical URL for the product (PDP). */
  productUrl: string;
}

/**
 * Two complementary WhatsApp actions on a product page:
 *
 *  - "Send code on WhatsApp" → opens a chat with the business pre-filled
 *    with the saree code. The inbound webhook handler picks up that code
 *    and replies with the product card automatically.
 *
 *  - "Share on WhatsApp"     → opens WhatsApp without a recipient, drafted
 *    with the product title + deep link, ready to forward to a friend.
 */
export function WhatsAppActions({ code, title, productUrl }: Props) {
  const [copied, setCopied] = useState(false);

  const sendCodeUrl = buildWaLink({ message: buildSendCodeMessage(code) });
  const shareUrl = buildWaLink({
    phone: "", // no recipient — opens contact picker
    message: buildShareMessage(title, code, productUrl),
  });

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — silently no-op.
    }
  };

  return (
    <div className="mt-6 grid sm:grid-cols-2 gap-3">
      <a
        href={sendCodeUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#25D366] text-white text-sm font-medium hover:brightness-110 transition-all"
      >
        <span className="grid place-items-center h-9 w-9 rounded-full bg-white/15">
          <Icon name="whatsapp" size={16} />
        </span>
        <span className="flex-1 text-left">
          Send code <span className="opacity-90">{code}</span> on WhatsApp
        </span>
        <Icon name="arrow-right" size={14} className="opacity-80 group-hover:translate-x-0.5 transition-transform" />
      </a>

      <a
        href={shareUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl ring-1 ring-[rgba(90,15,26,0.18)] text-[var(--color-noir)] text-sm hover:bg-[var(--color-cream)] transition-all"
      >
        <span className="grid place-items-center h-9 w-9 rounded-full bg-[var(--color-cream)] text-[var(--color-maroon)]">
          <Icon name="share" size={16} />
        </span>
        <span className="flex-1 text-left">Share on WhatsApp</span>
      </a>

      <button
        type="button"
        onClick={copyCode}
        className="sm:col-span-2 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[var(--color-cream)] text-xs uppercase tracking-[0.28em] text-[var(--color-fg-muted)] hover:bg-[var(--color-cream-warm)] transition-all"
      >
        <Icon name={copied ? "check" : "package"} size={12} />
        <span>{copied ? `Copied ${code}` : `Saree code · ${code} (tap to copy)`}</span>
      </button>
    </div>
  );
}
