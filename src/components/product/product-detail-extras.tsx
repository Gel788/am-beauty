import type { Product } from "@/data/products";
import { Star } from "lucide-react";

export function ProductDetailFactsStrip({ product }: { product: Product }) {
  const facts = [
    { label: "Объём", value: product.volume },
    { label: "Тип кожи", value: product.skinTypeLabel },
    { label: "Ритуал", value: product.ritual ?? "Ежедневно" },
    {
      label: "Рейтинг",
      value: (
        <span className="inline-flex items-center gap-1.5">
          <Star className="size-3 fill-black text-black" strokeWidth={1} aria-hidden />
          {product.rating}
          <span className="text-grey">({product.reviewCount})</span>
        </span>
      ),
    },
  ];

  return (
    <section className="border-y border-border bg-white" aria-label="Характеристики товара">
      <div className="container-page">
        <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
          {facts.map((fact) => (
            <div key={fact.label} className="px-4 py-5 sm:px-6 sm:py-6">
              <p className="text-[9px] tracking-[0.2em] text-grey uppercase">{fact.label}</p>
              <p className="mt-2 text-sm leading-snug text-charcoal">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Краткий состав в колонке покупки — без дублирования эффектов/ритуала */
export function ProductDetailSidebarExtras({ product }: { product: Product }) {
  const highlights = product.ingredients.slice(0, 4);

  if (highlights.length === 0) return null;

  return (
    <div className="mt-8 border-t border-border pt-6">
      <p className="text-[10px] tracking-[0.2em] text-grey uppercase">Ключевые компоненты</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {highlights.map((ingredient) => (
          <span
            key={ingredient}
            className="border border-border bg-cream/50 px-2.5 py-1.5 text-[9px] leading-tight tracking-[0.1em] text-charcoal uppercase"
          >
            {ingredient}
          </span>
        ))}
      </div>
    </div>
  );
}
