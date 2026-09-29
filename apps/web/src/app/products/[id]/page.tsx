import { notFound } from "next/navigation";
import { fetchCatalog } from "@/lib/catalog";
import ProductDetails from "@/components/products/ProductDetails";

export async function generateStaticParams() {
  const catalog = await fetchCatalog();
  return catalog.map((product) => ({
    id: product.id,
  }));
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const catalog = await fetchCatalog();
  const product = catalog.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = catalog.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return <ProductDetails product={product} relatedProducts={relatedProducts} />;
}
