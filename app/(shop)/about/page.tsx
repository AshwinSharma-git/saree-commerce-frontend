import Image from "next/image";
import Link from "next/link";
import { Section, Eyebrow, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const milestones = [
  { year: "1962", title: "The atelier opens in Banaras", body: "Founded by Smt. Lalitha Devi with three pit looms and a single weaver." },
  { year: "1988", title: "Kanchipuram partnership", body: "We extend our atelier to South India, partnering with master weavers in Kanchipuram." },
  { year: "2008", title: "The natural dye revival", body: "We pledge to use only botanical dyes — indigo, madder, turmeric — across all collections." },
  { year: "2024", title: "Beyond the boutique", body: "500+ weaver families partnered. Sarees shipped to 32 countries." },
  { year: "2026", title: "Atelier digital", body: "Reimagined as a modern atelier — Instagram, WhatsApp and a global website." },
];

export default function AboutPage() {
  return (
    <>
      <Section className="!pt-12 !pb-20">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <Eyebrow>Our heritage</Eyebrow>
            <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl md:text-7xl leading-[1.02] text-[var(--color-noir)]">
              Six decades of <em className="font-[family-name:var(--font-script)] italic text-gradient-maroon">soulful</em> weaving.
            </h1>
            <p className="mt-6 text-base md:text-lg text-[var(--color-fg-muted)] leading-relaxed">
              From a single pit loom in Banaras in 1962 to a global atelier today — Rājavastra has been a quiet
              guardian of India&rsquo;s hand-weaving traditions. Our founder believed every saree should carry the soul
              of its weaver. Three generations later, that belief still guides every drape.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/collections">
                <Button variant="primary" size="lg" iconRight={<Icon name="arrow-right" size={16} />}>
                  Shop the heritage
                </Button>
              </Link>
              <Link href="https://wa.me/919999999999">
                <Button variant="outline" size="lg" iconLeft={<Icon name="whatsapp" size={16} />}>
                  Visit our atelier
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
              <Image src="https://images.unsplash.com/photo-1604782206219-3b9576575203?auto=format&fit=crop&w=900&q=80" alt="Weaver" fill sizes="400px" className="object-cover" />
            </div>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden relative mt-10">
              <Image src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80" alt="Saree" fill sizes="400px" className="object-cover" />
            </div>
          </div>
        </div>
      </Section>

      <Section className="bg-[var(--color-noir)] text-[var(--color-ivory)]">
        <div className="text-center mb-14">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[var(--color-gold-bright)]">Milestones</span>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl md:text-5xl">
            A story <em className="font-[family-name:var(--font-script)] italic text-gradient-gold">woven</em> across decades
          </h2>
        </div>
        <div className="space-y-8 max-w-3xl mx-auto">
          {milestones.map((m, i) => (
            <div key={m.year} className="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] gap-6 items-start relative">
              <p className="font-[family-name:var(--font-display)] text-2xl md:text-3xl text-gradient-gold">{m.year}</p>
              <div className="border-l border-[var(--color-gold)]/30 pl-6 pb-6">
                <h3 className="font-[family-name:var(--font-display)] text-xl md:text-2xl">{m.title}</h3>
                <p className="mt-2 text-[var(--color-ivory)]/70">{m.body}</p>
              </div>
              {i === milestones.length - 1 && (
                <span className="absolute left-[80px] md:left-[120px] -ml-px top-12 bottom-0 w-0.5 bg-gradient-to-b from-[var(--color-gold)]/30 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          align="center"
          eyebrow="The promise"
          title="Crafted with reverence, delivered with care"
        />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: "leaf" as const, t: "Botanical dyes", b: "Only natural plant-based dyes — kind to skin and earth." },
            { icon: "shield" as const, t: "Authenticity", b: "Every saree carries a hand-numbered certificate of origin." },
            { icon: "users" as const, t: "Fair atelier", b: "Direct partnerships with 500+ weaver families across Bharat." },
          ].map((c) => (
            <div key={c.t} className="p-8 rounded-2xl bg-[var(--color-cream)]">
              <span className="grid place-items-center h-14 w-14 rounded-full gradient-maroon text-[var(--color-gold-bright)]">
                <Icon name={c.icon} />
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl">{c.t}</h3>
              <p className="mt-2 text-sm text-[var(--color-fg-muted)] leading-relaxed">{c.b}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
