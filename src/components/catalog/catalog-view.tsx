"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { categories, lineLabels, skinTypeLabels } from "@/data/categories";
import { products } from "@/data/products";
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
import { ProductCard } from "@/components/catalog/product-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { SkinType } from "@/data/types";

export function CatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [draft, setDraft] = useState<CatalogFilters>(defaultFilters);

  const filters = useMemo(
    () => parseCatalogFilters(searchParams),
    [searchParams],
  );

  const filtered = useMemo(() => filterProducts(products, filters), [filters]);
  const activeCount = countActiveFilters(filters);

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

  const resetFilters = () => pushFilters({ ...defaultFilters, query: filters.query, sort: filters.sort });

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

  const FilterPanel = ({
    value,
    onChange,
  }: {
    value: CatalogFilters;
    onChange: (patch: Partial<CatalogFilters>) => void;
  }) => (
    <div className="space-y-8">
      <FilterGroup label="Категория">
        <FilterChip active={!value.category} onClick={() => onChange({ category: null })}>
          Все
        </FilterChip>
        {categories.map((c) => (
          <FilterChip
            key={c.id}
            active={value.category === c.id}
            onClick={() => onChange({ category: c.id })}
          >
            {c.title}
          </FilterChip>
        ))}
      </FilterGroup>

      <FilterGroup label="Тип кожи">
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

      <FilterGroup label="Линия">
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

      <FilterGroup label="Цена">
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
  }, [filters]);

  return (
    <div className="container-page section-pad">
      <PageHeader
        label="Каталог"
        title="Все продукты"
        description={filters.query ? `Результаты по запросу «${filters.query}»` : undefined}
      />

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
        <p className="text-sm text-grey">
          {filtered.length} {filtered.length === 1 ? "товар" : "товаров"}
          {isPending ? " · обновление…" : ""}
        </p>
        <div className="flex items-center gap-3">
          <label className="sr-only" htmlFor="catalog-sort">
            Сортировка
          </label>
          <select
            id="catalog-sort"
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as SortOption })}
            className="h-11 min-w-[160px] cursor-pointer border border-border bg-white px-4 text-[11px] tracking-[0.14em] uppercase"
          >
            <option value="popular">По популярности</option>
            <option value="price-asc">Цена: по возрастанию</option>
            <option value="price-desc">Цена: по убыванию</option>
            <option value="new">Новинки</option>
          </select>

          <Button
            variant="outline"
            className="cursor-pointer gap-2 lg:hidden"
            onClick={openMobileFilters}
          >
            <SlidersHorizontal className="size-4" strokeWidth={1} />
            Фильтры
            {activeCount > 0 ? <span className="ml-1 text-[10px]">({activeCount})</span> : null}
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetContent side="left" className="flex w-full flex-col bg-white sm:max-w-sm">
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
                  onClick={() => setDraft({ ...defaultFilters, query: filters.query, sort: filters.sort })}
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
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={chip.clear}
              className="inline-flex cursor-pointer items-center gap-2 border border-border px-3 py-1.5 text-[10px] tracking-[0.14em] uppercase transition-colors hover:border-black"
            >
              {chip.label}
              <X className="size-3" strokeWidth={1} />
            </button>
          ))}
          <button
            type="button"
            onClick={resetFilters}
            className="text-[10px] tracking-[0.14em] text-grey uppercase underline underline-offset-4"
          >
            Сбросить всё
          </button>
        </div>
      ) : null}

      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel value={filters} onChange={update} />
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-8 text-[10px] tracking-[0.18em] text-grey uppercase underline underline-offset-4"
            >
              Сбросить фильтры
            </button>
          ) : null}
        </aside>

        {filtered.length === 0 ? (
          <EmptyState
            title="Ничего не найдено"
            description="Попробуйте изменить фильтры или посмотрите всю коллекцию."
            actionLabel="Сбросить фильтры"
            onAction={resetFilters}
          />
        ) : (
          <div
            className={`grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-8 ${isPending ? "opacity-60" : ""}`}
          >
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
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
      className={`cursor-pointer border px-3 py-2 text-[11px] tracking-[0.12em] uppercase transition-colors ${
        active
          ? "border-black bg-black text-white"
          : "border-border bg-white text-grey hover:border-black hover:text-black"
      }`}
    >
      {children}
    </button>
  );
}
