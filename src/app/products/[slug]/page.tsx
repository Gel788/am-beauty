import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/product-detail";
import { hydrateCatalog } from "@/data/products";
import { getPublicCatalog, getRuntimeProduct } from "@/lib/catalog/runtime";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getRuntimeProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const catalog = await getPublicCatalog();
  hydrateCatalog(catalog.products);

  const { slug } = await params;
  const product = await getRuntimeProduct(slug);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
