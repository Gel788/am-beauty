"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, SlidersHorizontal, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { lineLabels, skinTypeLabels } from "@/data/categories";
import { useCatalogCategories, useCatalogProducts } from "@/context/catalog-context";
import {
  defaultFilters,
  filterProducts,
  type CatalogFilters,
  type SortOption,
} from "@/lib/catalog";
import {
  catalogFiltersToSearchParams,
  countActiveFilters,
  parseCatalogFilters,
} from "@/lib/catalog-url";
import { CatalogCategoryStrip } from "@/components/catalog/catalog-category-strip";
import { CatalogFeaturedCard } from "@/components/catalog/catalog-featured-card";
import { CatalogHero } from "@/components/catalog/catalog-hero";
import { ProductCard } from "@/components/catalog/product-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MarqueeStrip } from "@/components/marquee-strip";
import type { SkinType } from "@/data/types";
import { cn } from "@/lib/utils";

export function CatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categories = useCatalogCategories();
  const products = useCatalogProducts();
  const reduce = useReducedMotion();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draft, setDraft] = useState<CatalogFilters>(defaultFilters);

  const filters = useMemo(
    () => parseCatalogFilters(searchParams),
    [searchParams],
  );

  const filtered = useMemo(() => filterProducts(products, filters), [filters, products]);
  const activeCount = countActiveFilters(filters);

  const featured = useMemo(() => {
    if (filters.query || activeCount > 1) return null;
    return filtered.find((p) => p.isBestseller) ?? filtered[0] ?? null;
  }, [filtered, filters.query, activeCount]);

  const gridProducts = useMemo(() => {
    if (!featured) return filtered;
    return filtered.filter((p) => p.slug !== featured.slug);
  }, [filtered, featured]);

  const pushFilters = useCallback(
    (next: CatalogFilters) => {
      const qs = catalogFiltersToSearchParams(next).toString();
      startTransition(() => {
        router.replace(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
      });
    },
    [router],
  );

  const update = (patch: Partial<CatalogFilters>) => pushFilters({ ...filters, ...patch });

  const resetFilters = () =>
    pushFilters({ ...defaultFilters, query: filters.query, sort: filters.sort });

  const openMobileFilters = () => {
    setDraft(filters);
    setMobileOpen(true);
  };

  useEffect(() => {
    if (mobileOpen) setDraft(filters);
  }, [mobileOpen, filters]);

  const applyMobileFilters = () => {
    pushFilters(draft);
    setMobileOpen(false);
  };

  const activeChips = useMemo(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (filters.category) {
      const cat = categories.find((c) => c.id === filters.category);
      chips.push({ label: cat?.title ?? filters.category, clear: () => update({ category: null }) });
    }
    if (filters.skinType) {
      chips.push({
        label: skinTypeLabels[filters.skinType],
        clear: () => update({ skinType: null }),
      });
    }
    if (filters.line) {
      chips.push({
        label: lineLabels[filters.line as keyof typeof lineLabels],
        clear: () => update({ line: null }),
      });
    }
    if (filters.priceMax === 4000 && filters.priceMin == null) {
      chips.push({ label: "до 4 000 ₽", clear: () => update({ priceMin: null, priceMax: null }) });
    } else if (filters.priceMin === 4000 && filters.priceMax === 8000) {
      chips.push({ label: "4–8 тыс.", clear: () => update({ priceMin: null, priceMax: null }) });
    } else if (filters.priceMin === 8000) {
      chips.push({ label: "от 8 000 ₽", clear: () => update({ priceMin: null, priceMax: null }) });
    }
    return chips;
  }, [filters, categories, update]);

  return (
    <div className="bg-cream">
      <CatalogHero
        categories={categories}
        activeCategoryId={filters.category}
        productCount={filtered.length}
        query={filters.query}
      />

      <CatalogCategoryStrip
        categories={categories}
        activeId={filters.category}
        onSelect={(id) => update({ category: id })}
      />

      <MarqueeStrip />

      <div className="container-page py-12 md:py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="label-caps">Подбор</p>
            <p className="mt-2 text-sm text-grey">
              {filtered.length}{" "}
              {filtered.length === 1 ? "позиция" : filtered.length < 5 ? "позиции" : "позиций"}
              {isPending ? " · обновление…" : ""}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="sr-only" htmlFor="catalog-sort">
              Сортировка
            </label>
            <select
              id="catalog-sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortOption })}
              className="h-11 min-w-[180px] cursor-pointer border border-border bg-white px-4 text-[11px] tracking-[0.14em] uppercase transition-colors hover:border-gold focus:border-gold focus:outline-none"
            >
              <option value="popular">По популярности</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
              <option value="new">Новинки</option>
            </select>

            <Button
              variant="outline"
              className="cursor-pointer gap-2 lg:hidden"
              onClick={openMobileFilters}
            >
              <SlidersHorizontal className="size-4" strokeWidth={1} />
              Фильтры
              {activeCount > 0 ? (
                <span className="ml-1 rounded-full bg-gold px-1.5 py-0.5 text-[9px] text-white">
                  {activeCount}
                </span>
              ) : null}
            </Button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetContent side="left" className="flex w-full flex-col bg-cream sm:max-w-sm">
                <h2 className="headline-lg !text-lg">Фильтры</h2>
                <div className="mt-6 flex-1 overflow-y-auto">
                  <FilterPanel
                    value={draft}
                    onChange={(patch) => setDraft((f) => ({ ...f, ...patch }))}
                  />
                </div>
                <div className="mt-6 flex gap-3 border-t border-border pt-6">
                  <Button
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={() =>
                      setDraft({ ...defaultFilters, query: filters.query, sort: filters.sort })
                    }
                  >
                    Сбросить
                  </Button>
                  <Button className="flex-1 cursor-pointer" onClick={applyMobileFilters}>
                    Показать
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {activeChips.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={chip.clear}
                className="inline-flex cursor-pointer items-center gap-2 border border-gold/40 bg-white px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase transition-colors hover:border-gold"
              >
                {chip.label}
                <X className="size-3" strokeWidth={1} />
              </button>
            ))}
            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] tracking-[0.14em] text-grey uppercase underline underline-offset-4 hover:text-black"
            >
              Сбросить всё
            </button>
          </div>
        ) : null}

        <div className="mt-10 grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-24 border border-border bg-white p-6">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <LayoutGrid className="size-4 text-gold" strokeWidth={1.25} />
                <p className="text-[10px] tracking-[0.2em] uppercase">Фильтры</p>
              </div>
              <div className="mt-6">
                <FilterPanel value={filters} onChange={update} />
              </div>
              {activeCount > 0 ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-8 w-full border border-border py-2.5 text-[10px] tracking-[0.18em] text-grey uppercase transition-colors hover:border-black hover:text-black"
                >
                  Сбросить фильтры
                </button>
              ) : null}
            </div>
          </aside>

          <div className={cn(isPending && "opacity-60 transition-opacity")}>
            {filtered.length === 0 ? (
              <EmptyState
                title="Ничего не найдено"
                description="Попробуйте другую категорию или сбросьте фильтры."
                actionLabel="Сбросить фильтры"
                onAction={resetFilters}
              />
            ) : (
              <ProductGrid
                featured={featured}
                products={gridProducts}
                reduceMotion={reduce}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductGrid({
  featured,
  products,
  reduceMotion,
}: {
  featured: ReturnType<typeof filterProducts>[number] | null;
  products: ReturnType<typeof filterProducts>;
  reduceMotion: boolean | null;
}) {
  const content = (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-2 md:gap-x-8 lg:grid-cols-3">
      {featured ? <CatalogFeaturedCard product={featured} /> : null}
      {products.map((p, i) => (
        <ProductCard key={p.slug} product={p} priority={i < 2 && !featured} />
      ))}
    </div>
  );

  if (reduceMotion) return content;

  return (
    <motion.div
      key={`${featured?.slug ?? "none"}-${products.map((p) => p.slug).join(",")}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {content}
    </motion.div>
  );
}

function FilterPanel({
  value,
  onChange,
}: {
  value: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
}) {
  return (
    <div className="space-y-8">
      <FilterGroup label="Тип кожи" active={Boolean(value.skinType)}>
        <FilterChip active={!value.skinType} onClick={() => onChange({ skinType: null })}>
          Все
        </FilterChip>
        {Object.entries(skinTypeLabels)
          .filter(([id]) => id !== "all")
          .map(([id, label]) => (
            <FilterChip
              key={id}
              active={value.skinType === id}
              onClick={() => onChange({ skinType: id as SkinType })}
            >
              {label}
            </FilterChip>
          ))}
      </FilterGroup>

      <FilterGroup label="Линия" active={Boolean(value.line)}>
        <FilterChip active={!value.line} onClick={() => onChange({ line: null })}>
          Все
        </FilterChip>
        {Object.entries(lineLabels).map(([id, label]) => (
          <FilterChip
            key={id}
            active={value.line === id}
            onClick={() => onChange({ line: id })}
          >
            {label}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup
        label="Цена"
        active={
          value.priceMin != null ||
          value.priceMax != null
        }
      >
        <FilterChip
          active={value.priceMax === 4000 && value.priceMin == null}
          onClick={() => onChange({ priceMin: null, priceMax: 4000 })}
        >
          до 4 000 ₽
        </FilterChip>
        <FilterChip
          active={value.priceMin === 4000 && value.priceMax === 8000}
          onClick={() => onChange({ priceMin: 4000, priceMax: 8000 })}
        >
          4–8 тыс.
        </FilterChip>
        <FilterChip
          active={value.priceMin === 8000 && value.priceMax == null}
          onClick={() => onChange({ priceMin: 8000, priceMax: null })}
        >
          от 8 000 ₽
        </FilterChip>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  label,
  children,
  active,
}: {
  label: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className={cn("border-l-2 pl-4", active ? "border-gold" : "border-transparent")}>
      <p className="label-caps">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "cursor-pointer border px-3 py-2 text-[10px] tracking-[0.12em] uppercase transition-colors",
        active
          ? "border-black bg-black text-white"
          : "border-border bg-cream/50 text-grey hover:border-black/40 hover:text-black",
      )}
    >
      {children}
    </button>
  );
}
