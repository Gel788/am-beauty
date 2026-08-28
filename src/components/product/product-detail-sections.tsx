"use client";

import { ChevronDown } from "lucide-react";
import type { Review } from "@/data/types";
import type { Product } from "@/data/products";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export function ProductDetailMarquee({ product }: { product: Product }) {
  const items = [
    product.actives,
    product.skinTypeLabel,
    product.volume,
    ...(product.ritual ? [product.ritual] : []),
  ];

  const row = items.map((item) => (
    <span key={item} className="inline-flex items-center gap-12 md:gap-20">
      <span>{item}</span>
      <span className="text-[10px] opacity-40" aria-hidden>
        —
      </span>
    </span>
  ));

  return (
    <div className="overflow-x-clip border-y border-border bg-black py-3" aria-hidden>
      <div className="marquee-track flex w-max items-center gap-12 px-6 text-[10px] tracking-[0.28em] text-white/70 uppercase md:gap-20">
        <span className="inline-flex items-center gap-12 md:gap-20">{row}</span>
        <span className="inline-flex items-center gap-12 md:gap-20">{row}</span>
      </div>
    </div>
  );
}

/** Единый блок: эффекты, ритуал, состав — без трёх разрозненных секций */
export function ProductDetailEditorial({ product }: { product: Product }) {
  return (
    <section className="overflow-x-clip border-b border-border bg-white">
      <div className="container-page max-w-full py-12 md:py-16 lg:py-20">
        <div className="grid min-w-0 gap-12 lg:grid-cols-2 lg:gap-0">
          <EditorialColumn
            label="Преимущества"
            title="Почему это работает"
            className="lg:pr-12 xl:pr-16"
          >
            <ul className="divide-y divide-border">
              {product.benefits.map((benefit, i) => (
                <li key={benefit} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <span
                    className="w-8 shrink-0 font-display text-2xl leading-none text-gold/90 tabular-nums"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="min-w-0 pt-0.5 text-[15px] leading-relaxed break-words text-charcoal">{benefit}</p>
                </li>
              ))}
            </ul>
          </EditorialColumn>

          <EditorialColumn
            label="Ритуал"
            title="Как применять"
            className="border-t border-border pt-12 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12 xl:pl-16"
          >
            <ol className="divide-y divide-border">
              {product.howToUse.map((step, i) => (
                <li key={step} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <span className="w-14 shrink-0 pt-0.5 text-[10px] tracking-[0.2em] text-gold uppercase">
                    Шаг {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="min-w-0 text-[15px] leading-relaxed break-words text-charcoal">{step}</p>
                </li>
              ))}
            </ol>
          </EditorialColumn>
        </div>

        <div className="mt-12 border border-border bg-cream/40 md:mt-14">
          <DetailAccordion title="Состав INCI" defaultOpen>
            <p className="text-sm leading-[1.85] break-words text-charcoal/90">{product.ingredients.join(" · ")}</p>
          </DetailAccordion>
          <DetailAccordion title="Тип кожи">
            <p className="text-sm leading-relaxed text-charcoal/90">{product.skinTypeLabel}</p>
          </DetailAccordion>
          {product.ritual ? (
            <DetailAccordion title="Время применения">
              <p className="text-sm leading-relaxed text-charcoal/90">{product.ritual}</p>
            </DetailAccordion>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function EditorialColumn({
  label,
  title,
  className,
  children,
}: {
  label: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className={cn("min-w-0", className)}>
      <p className="text-[10px] tracking-[0.28em] text-grey uppercase">{label}</p>
      <h2 className="mt-3 font-display text-[clamp(1.5rem,3vw,2rem)] leading-tight font-light tracking-[0.02em] text-black">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </Reveal>
  );
}

export function ProductDetailReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;

  const featured = reviews[0];

  return (
    <section className="section-invert section-pad">
      <div className="container-page mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-[10px] tracking-[0.32em] text-white/45 uppercase">Отзывы</p>
          <blockquote className="mt-10 font-display text-[clamp(1.25rem,3vw,1.75rem)] leading-snug font-light tracking-[0.02em] !normal-case">
            «{featured.text}»
          </blockquote>
          <footer className="mt-8 text-[10px] tracking-[0.22em] text-white/50 uppercase">
            {featured.author}
          </footer>
        </Reveal>

        {reviews.length > 1 ? (
          <div className="mt-16 grid gap-8 border-t border-white/10 pt-12 text-left md:grid-cols-2">
            {reviews.slice(1).map((r) => (
              <blockquote key={r.id} className="text-sm leading-relaxed text-white/75">
                «{r.text}»
                <footer className="mt-3 text-[10px] tracking-[0.18em] text-white/40 uppercase">
                  {r.author}
                </footer>
              </blockquote>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function DetailAccordion({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group border-b border-border last:border-b-0 motion-safe:transition-colors open:bg-white/60"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[10px] tracking-[0.22em] uppercase transition-colors hover:text-grey sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronDown
          className="size-4 shrink-0 text-grey transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
          strokeWidth={1}
          aria-hidden
        />
      </summary>
      <div className="border-t border-border/60 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">{children}</div>
    </details>
  );
}
