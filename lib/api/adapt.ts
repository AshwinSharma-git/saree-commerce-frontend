/**
 * Adapters between the backend's `ApiProduct` shape and the existing local
 * `Product` type used by frontend cards / pages.
 *
 *   - Backend money is in **paise** (Int).  Local UI expects **rupees**.
 *   - Backend gallery lives in `images[]`.  Local UI expects `image` + `gallery`.
 *   - Backend uses `comparePrice` (≥ price).  Local UI uses `originalPrice`.
 *
 * The adapter is the single point where these conventions are reconciled
 * — every call site stays UI-shaped.
 */
import type { ApiProduct } from "./types";
import type { Product, SareeFabric, SareeOccasion } from "@/types";

const paiseToRupees = (paise: number) => Math.round(paise) / 100;

const fabricMap: Record<string, SareeFabric> = {
  "banarasi silk": "Banarasi Silk",
  "kanjivaram silk": "Kanjivaram Silk",
  "mulberry silk": "Mulberry Silk",
  "tussar silk": "Tussar Silk",
  "organic cotton": "Organic Cotton",
  linen: "Linen",
  chiffon: "Chiffon",
  georgette: "Georgette",
};

const normaliseFabric = (raw: string): SareeFabric => {
  const key = raw.trim().toLowerCase();
  return fabricMap[key] ?? "Mulberry Silk";
};

const normaliseOccasion = (raw: string): SareeOccasion | null => {
  const v = raw.trim().toLowerCase();
  if (["wedding", "festive", "casual", "party", "office"].includes(v)) {
    return (v[0].toUpperCase() + v.slice(1)) as SareeOccasion;
  }
  return null;
};

export const adaptProduct = (api: ApiProduct): Product => {
  const gallery =
    api.images.length > 0
      ? api.images.map((i) => i.url)
      : ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80"];

  return {
    id: api.id,
    code: api.code,
    name: api.title,
    collection: api.collection ?? api.category?.name ?? "Heritage",
    fabric: normaliseFabric(api.fabric),
    price: paiseToRupees(api.price),
    originalPrice: api.comparePrice ? paiseToRupees(api.comparePrice) : undefined,
    rating: api.rating,
    reviews: api.reviewCount,
    image: gallery[0],
    gallery,
    colors: api.colors,
    occasion: api.occasions
      .map(normaliseOccasion)
      .filter((x): x is SareeOccasion => x !== null),
    description: api.description,
    story: api.story ?? undefined,
    craftedIn: api.craftedIn ?? "—",
    stock: api.inventory?.onHand ?? 0,
    sku: api.code,
    tags: api.tags,
    isNew: api.isFeatured && !api.isLimited,
    isBestseller: api.isTrending,
    isLimited: api.isLimited,
  };
};

export const adaptProducts = (list: ApiProduct[]): Product[] => list.map(adaptProduct);
