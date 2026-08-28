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

export function ProductDetailSidebarExtras({ product }: { product: Product }) {
  return (
    <div className="mt-8 space-y-6 border-t border-border pt-8">
      <div>
        <h3 className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.22em] uppercase">
          Ключевые эффекты
        </h3>
        <ul className="mt-4 space-y-3">
          {product.benefits.map((benefit, i) => (
            <li key={benefit} className="flex gap-3 text-sm leading-relaxed text-charcoal">
              <span className="shrink-0 font-display text-lg leading-none text-gold/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border border-border bg-white p-5">
        <p className="text-[10px] tracking-[0.18em] text-grey uppercase">Как применять</p>
        <ol className="mt-3 space-y-2">
          {product.howToUse.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm text-charcoal">
              <span className="shrink-0 text-[10px] tracking-[0.14em] text-gold uppercase">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {product.ingredients.slice(0, 4).map((ingredient) => (
          <span
            key={ingredient}
            className="border border-border bg-cream/60 px-3 py-2 text-center text-[9px] tracking-[0.12em] text-grey uppercase"
          >
            {ingredient}
          </span>
        ))}
      </div>
    </div>
  );
}
