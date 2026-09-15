// app/product/[id]/page.tsx
import { notFound } from "next/navigation";
import { SAMPLE_PRODUCTS } from "@/app/Components/Products/data";
import ProductDetails from "@/app/Components/Products/ProductDetails";
import Header from "@/app/Components/header";
import Footer from "@/app/Components/Footer";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = SAMPLE_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  // No .slice() — every product in the same category is included
  const relatedProducts = SAMPLE_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

  return (
    <div>
      <Header />
      <ProductDetails product={product} relatedProducts={relatedProducts} />
      <Footer />
    </div>
  );
}

export function generateStaticParams() {
  return SAMPLE_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = SAMPLE_PRODUCTS.find((p) => p.id === id);
  return {
    title: product ? `${product.name} — Your Store` : "Product not found",
    description: product?.shortDescription,
  };
}