"use client";

import {
  createContext,
  useCallback,
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
  const pruneInvalidItems = useCartStore((s) => s.pruneInvalidItems);

  const refresh = useCallback(async () => {
    const next = await fetchCatalog();
    if (!next) return;
    setCatalog(next);
    hydrateCatalog(next.products);
    pruneInvalidItems();
  }, [pruneInvalidItems]);

  useEffect(() => {
    hydrateCatalog(data.products);
  }, [data.products]);

  useEffect(() => {
    void refresh();

    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };

    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

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
