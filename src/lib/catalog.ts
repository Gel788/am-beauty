import type { Product, SkinType } from "@/data/types";

export type SortOption = "popular" | "price-asc" | "price-desc" | "new";

export type CatalogFilters = {
  query: string;
  category: string | null;
  skinType: SkinType | null;
  line: string | null;
  priceMin: number | null;
  priceMax: number | null;
  sort: SortOption;
};

export const defaultFilters: CatalogFilters = {
  query: "",
  category: null,
  skinType: null,
  line: null,
  priceMin: null,
  priceMax: null,
  sort: "popular",
};

export function filterProducts(products: Product[], filters: CatalogFilters) {
  let result = [...products];

  if (filters.query.trim()) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.note.toLowerCase().includes(q) ||
        p.actives.toLowerCase().includes(q),
    );
  }

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.skinType && filters.skinType !== "all") {
    result = result.filter(
      (p) => p.skinTypes.includes(filters.skinType!) || p.skinTypes.includes("all"),
    );
  }

  if (filters.line) {
    result = result.filter((p) => p.line === filters.line);
  }

  if (filters.priceMin != null) {
    result = result.filter((p) => p.price >= filters.priceMin!);
  }

  if (filters.priceMax != null) {
    result = result.filter((p) => p.price <= filters.priceMax!);
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "new":
      result.sort((a, b) => b.id.localeCompare(a.id));
      break;
    default:
      result.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return result;
}

export function searchSuggestions(products: Product[], query: string, limit = 5) {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortName.toLowerCase().includes(q) ||
        p.category.includes(q),
    )
    .slice(0, limit);
}
