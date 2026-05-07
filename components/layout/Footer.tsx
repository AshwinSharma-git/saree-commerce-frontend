import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export function Footer() {
  return (
    <footer className="relative mt-32 bg-[var(--color-noir)] text-[var(--color-ivory)] overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full gradient-maroon blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full gradient-gold blur-3xl opacity-40" />
      </div>

      <div className="relative mx-auto max-w-[1320px] px-6 md:px-10">
        {/* Newsletter band */}
        <div className="border-b border-[rgba(201,169,106,0.18)] py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-gold)] mb-4">
              The Atelier Letter
            </p>
            <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl leading-tight">
              Be the first to receive new heritage drops & private invitations.
            </h3>
          </div>
          <form className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border border-[rgba(201,169,106,0.35)] rounded-full px-6 py-4 text-sm text-[var(--color-ivory)] placeholder:text-[var(--color-ivory)]/50 focus:outline-none focus:border-[var(--color-gold)] transition-colors"
            />
            <Button variant="gold" size="lg" type="submit">
              Subscribe
            </Button>
          </form>
        </div>

        {/* Columns */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <span className="font-[family-name:var(--font-display)] text-3xl">
              Rāja<span className="text-gradient-gold italic">vastra</span>
            </span>
            <p className="mt-4 text-sm text-[var(--color-ivory)]/70 leading-relaxed max-w-sm">
              Curating heirloom sarees from the master weavers of India since 1962. Every drape, a story —
              hand-woven, hand-dyed, lovingly delivered.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {(
                [
                  { name: "instagram" as const, href: "https://instagram.com" },
                  { name: "whatsapp" as const, href: "https://wa.me/919999999999" },
                  { name: "mail" as const, href: "mailto:atelier@rajavastra.in" },
                  { name: "phone" as const, href: "tel:+919999999999" },
                ]
              ).map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="h-10 w-10 grid place-items-center rounded-full ring-1 ring-[rgba(201,169,106,0.35)] hover:bg-[var(--color-gold)]/10 hover:ring-[var(--color-gold)] transition-all"
                  aria-label={s.name}
                >
                  <Icon name={s.name} size={16} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Shop"
            items={[
              { label: "All Collections", href: "/collections" },
              { label: "Heritage Bridal", href: "/collections?collection=Heritage+Bridal" },
              { label: "Festive Edit", href: "/collections?collection=Festive+Edit" },
              { label: "Modern Heritage", href: "/collections?collection=Modern+Heritage" },
              { label: "Everyday Luxe", href: "/collections?collection=Everyday+Luxe" },
            ]}
          />
          <FooterCol
            title="Service"
            items={[
              { label: "Track Order", href: "/tracking" },
              { label: "Visual Search", href: "/visual-search" },
              { label: "WhatsApp Concierge", href: "https://wa.me/919999999999" },
              { label: "Shipping & Returns", href: "/about" },
              { label: "Care Guide", href: "/about" },
            ]}
          />
          <FooterCol
            title="Atelier"
            items={[
              { label: "Our Heritage", href: "/about" },
              { label: "The Weavers", href: "/about" },
              { label: "Sustainability", href: "/about" },
              { label: "Press", href: "/about" },
              { label: "Admin Portal", href: "/admin/dashboard" },
            ]}
          />
        </div>

        <div className="border-t border-[rgba(201,169,106,0.18)] py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-[var(--color-ivory)]/55">
          <p>© {new Date().getFullYear()} Rājavastra Heritage. Woven with reverence in Bharat.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-[var(--color-gold)]">Privacy</Link>
            <Link href="/about" className="hover:text-[var(--color-gold)]">Terms</Link>
            <Link href="/about" className="hover:text-[var(--color-gold)]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-gold)] mb-5">{title}</h4>
      <ul className="space-y-3 text-sm text-[var(--color-ivory)]/75">
        {items.map((it) => (
          <li key={it.label}>
            <Link href={it.href} className="hover:text-[var(--color-gold-bright)] transition-colors">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
