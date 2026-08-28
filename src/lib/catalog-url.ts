import type { CatalogFilters, SortOption } from "@/lib/catalog";
import { defaultFilters } from "@/lib/catalog";
import type { SkinType } from "@/data/types";

export function parseCatalogFilters(params: URLSearchParams): CatalogFilters {
  return {
    ...defaultFilters,
    query: params.get("q") ?? "",
    category: params.get("category"),
    skinType: (params.get("skin") as SkinType) || null,
    line: params.get("line"),
    priceMin: params.get("priceMin") ? Number(params.get("priceMin")) : null,
    priceMax: params.get("priceMax") ? Number(params.get("priceMax")) : null,
    sort: (params.get("sort") as SortOption) || "popular",
  };
}

export function catalogFiltersToSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.category) params.set("category", filters.category);
  if (filters.skinType) params.set("skin", filters.skinType);
  if (filters.line) params.set("line", filters.line);
  if (filters.priceMin != null) params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax != null) params.set("priceMax", String(filters.priceMax));
  if (filters.sort !== "popular") params.set("sort", filters.sort);
  return params;
}

export function countActiveFilters(filters: CatalogFilters): number {
  let n = 0;
  if (filters.category) n++;
  if (filters.skinType) n++;
  if (filters.line) n++;
  if (filters.priceMin != null || filters.priceMax != null) n++;
  return n;
}
