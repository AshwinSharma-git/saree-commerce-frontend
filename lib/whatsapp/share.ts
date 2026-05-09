/**
 * Build wa.me share / deep-link URLs.
 *
 *   buildWaLink({ message })           → opens WhatsApp with text drafted (no recipient)
 *   buildWaLink({ phone, message })    → opens chat with the business and drafts text
 *
 * The recipient phone is read from `NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE`
 * (E.164, no leading "+"), with a sensible localhost-friendly fallback.
 */

const BUSINESS_PHONE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WHATSAPP_BUSINESS_PHONE) ||
  "919999999999";

export interface WaLinkOptions {
  /** Override the business phone (optional). */
  phone?: string;
  message: string;
}

export const buildWaLink = ({ phone, message }: WaLinkOptions): string => {
  const target = (phone ?? BUSINESS_PHONE).replace(/[^0-9]/g, "");
  const text = encodeURIComponent(message);
  return target
    ? `https://wa.me/${target}?text=${text}`
    : `https://wa.me/?text=${text}`;
};

/** Compose the message for "Send code on WhatsApp" — the customer sends
 *  the saree code to the business and the inbound webhook handles it. */
export const buildSendCodeMessage = (code: string): string =>
  `Hi! I'd like more details on saree ${code}.`;

/** Compose the message for "Share on WhatsApp" — the customer forwards a
 *  product they like to a friend, with a deep link to the PDP. */
export const buildShareMessage = (title: string, code: string, url: string): string =>
  `✨ Look at this: ${title} (${code})\n${url}`;

export const businessPhone = BUSINESS_PHONE;
