"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { Product, Review } from "@/data/types";
import { hydrateCatalog } from "@/data/products";
import type { AdminCategory, AdminSiteSettings } from "@/lib/admin/types";

type CatalogContextValue = {
  products: Product[];
  categories: AdminCategory[];
  reviews: Review[];
  site: AdminSiteSettings;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({
  data,
  children,
}: {
  data: CatalogContextValue;
  children: ReactNode;
}) {
  useEffect(() => {
    hydrateCatalog(data.products);
  }, [data.products]);

  return <CatalogContext.Provider value={data}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error("useCatalog requires CatalogProvider");
  }
  return ctx;
}

export function useCatalogProducts() {
  return useCatalog().products;
}

export function useCatalogCategories() {
  return useCatalog().categories;
}

export function useProductReviews(slug: string) {
  return useCatalog().reviews.filter((r) => r.productSlug === slug);
}
