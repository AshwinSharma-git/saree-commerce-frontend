"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import { productsApi } from "@/lib/api/products";
import { adaptProduct, adaptProducts } from "@/lib/api/adapt";
import { products as mockProducts, getProductById } from "@/lib/data/products";
import type { Product } from "@/types";

interface State {
  loading: boolean;
  product: Product | null;
  related: Product[];
  notFoundFlag: boolean;
}

export default function ProductDetailLoader({ id }: { id: string }) {
  const [state, setState] = useState<State>({
    loading: true,
    product: null,
    related: [],
    notFoundFlag: false,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      // Try the live API first.
      try {
        const apiProduct = await productsApi.byId(id).catch(() => productsApi.byCode(id));
        if (cancelled) return;
        const product = adaptProduct(apiProduct);
        const relatedRaw = await productsApi.related(apiProduct.id, 4).catch(() => []);
        if (cancelled) return;
        setState({ loading: false, product, related: adaptProducts(relatedRaw), notFoundFlag: false });
        return;
      } catch {
        // fall through to local fallback
      }
      // Local mock fallback (works when backend is offline or seed IDs differ).
      const local = getProductById(id);
      if (!local) {
        if (!cancelled) setState({ loading: false, product: null, related: [], notFoundFlag: true });
        return;
      }
      const related = mockProducts
        .filter((p) => p.id !== local.id && p.collection === local.collection)
        .slice(0, 4);
      if (!cancelled) setState({ loading: false, product: local, related, notFoundFlag: false });
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.notFoundFlag) notFound();
  if (state.loading || !state.product) {
    return (
      <div className="min-h-[70vh] grid place-items-center">
        <div className="flex items-center gap-3 text-[var(--color-fg-muted)]">
          <span className="h-4 w-4 rounded-full border-2 border-[var(--color-maroon)] border-t-transparent animate-spin" />
          <span className="text-sm tracking-wide">Loading saree…</span>
        </div>
      </div>
    );
  }
  return <ProductDetail product={state.product} related={state.related} />;
}
