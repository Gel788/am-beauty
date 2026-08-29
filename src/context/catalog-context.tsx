"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Product, Review } from "@/data/types";
import { hydrateCatalog } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import type { AdminBlogPost, AdminCategory, AdminSiteSettings } from "@/lib/admin/types";

type CatalogContextValue = {
  products: Product[];
  categories: AdminCategory[];
  reviews: Review[];
  blog: AdminBlogPost[];
  site: AdminSiteSettings;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

async function fetchCatalog(): Promise<CatalogContextValue | null> {
  try {
    const res = await fetch("/api/catalog", { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as CatalogContextValue;
  } catch {
    return null;
  }
}

export function CatalogProvider({
  data,
  children,
}: {
  data: CatalogContextValue;
  children: ReactNode;
}) {
  const [catalog, setCatalog] = useState(data);

  useEffect(() => {
    hydrateCatalog(data.products);

    const refreshCatalog = async () => {
      const next = await fetchCatalog();
      if (!next) return;
      setCatalog(next);
      hydrateCatalog(next.products);
      if (useCartStore.persist.hasHydrated()) {
        useCartStore.getState().pruneInvalidItems();
      }
    };

    void refreshCatalog();

    const onVisible = () => {
      if (document.visibilityState === "visible") void refreshCatalog();
    };

    const onFocus = () => {
      void refreshCatalog();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [data.products]);

  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
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

export function useSite() {
  return useCatalog().site;
}

export function useBlogPosts() {
  return useCatalog().blog;
}

export function useProductReviews(slug: string) {
  return useCatalog().reviews.filter((r) => r.productSlug === slug);
}
