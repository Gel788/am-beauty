import type { MetadataRoute } from "next";
import { getPublicCatalog } from "@/lib/catalog/runtime";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ambeauty-cosmetica.ru";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getPublicCatalog();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/catalog",
    "/about",
    "/blog",
    "/contacts",
    "/cart",
    "/legal/offer",
    "/legal/privacy",
    "/legal/returns",
    "/legal/delivery",
    "/legal/cookies",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const products: MetadataRoute.Sitemap = catalog.products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const posts: MetadataRoute.Sitemap = catalog.blog.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...products, ...posts];
}
