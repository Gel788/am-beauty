import { Suspense } from "react";
import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/catalog-view";
import { CatalogSkeleton } from "@/components/catalog/catalog-skeleton";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Каталог косметики AM Beauty: сыворотки, уход, макияж. Фильтры по типу кожи и цене.",
};

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogView />
    </Suspense>
  );
}
