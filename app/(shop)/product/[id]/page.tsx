import { notFound } from "next/navigation";
import { products, getProductById } from "@/lib/data/products";
import ProductDetail from "./ProductDetail";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  const related = products.filter((p) => p.id !== product.id && p.collection === product.collection).slice(0, 4);
  return <ProductDetail product={product} related={related} />;
}
