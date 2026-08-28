import { cache } from "react";
import type { Product, Review } from "@/data/types";
import { readDb } from "@/lib/admin/db";
import type { AdminCategory, AdminSiteSettings, PublicCatalog } from "@/lib/admin/types";

export function stripAdminProduct<T extends { stock?: number; published?: boolean }>(
  product: T,
): Omit<T, "stock" | "published"> {
  const { stock: _s, published: _p, ...rest } = product;
  return rest;
}

export const getPublicCatalog = cache(async (): Promise<PublicCatalog> => {
  const db = await readDb();
  return {
    products: db.products
      .filter((p) => p.published)
      .map((p) => stripAdminProduct(p) as Product),
    categories: db.categories
      .filter((c) => c.published)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    reviews: db.reviews
      .filter((r) => r.published)
      .map(({ published: _p, ...r }) => r as Review),
    blog: db.blog.filter((p) => p.published),
    site: db.site,
  };
});

export async function getRuntimeProduct(slug: string) {
  const { products } = await getPublicCatalog();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getRuntimeCategories(): Promise<AdminCategory[]> {
  const { categories } = await getPublicCatalog();
  return categories;
}

export async function getRuntimeSite(): Promise<AdminSiteSettings> {
  const { site } = await getPublicCatalog();
  return site;
}
