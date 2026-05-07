import { Icon } from "@/components/ui/Icon";

const items = [
  { icon: "leaf", title: "Natural Dyes", sub: "Indigo, madder, turmeric" },
  { icon: "sparkle", title: "Pure Zari", sub: "Tested & certified gold" },
  { icon: "users", title: "500+ Weavers", sub: "Direct artisan partnerships" },
  { icon: "truck", title: "Free Express", sub: "On every order, worldwide" },
] as const;

export function TrustStrip() {
  return (
    <div className="bg-[var(--color-noir)] text-[var(--color-ivory)]">
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-6 grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-4">
            <span className="grid place-items-center h-11 w-11 rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold-bright)] ring-1 ring-[var(--color-gold)]/30">
              <Icon name={it.icon} size={18} />
            </span>
            <div>
              <p className="text-sm">{it.title}</p>
              <p className="text-[11px] text-[var(--color-ivory)]/55 tracking-wide">{it.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
