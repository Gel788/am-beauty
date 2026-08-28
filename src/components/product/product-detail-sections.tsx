"use client";

import { ChevronDown } from "lucide-react";
import type { Review } from "@/data/types";
import type { Product } from "@/data/products";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
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
    <div className="overflow-hidden border-y border-border bg-black py-3" aria-hidden>
      <div className="marquee-track flex w-max items-center gap-12 px-6 text-[10px] tracking-[0.28em] text-white/70 uppercase md:gap-20">
        <span className="inline-flex items-center gap-12 md:gap-20">{row}</span>
        <span className="inline-flex items-center gap-12 md:gap-20">{row}</span>
      </div>
    </div>
  );
}

export function ProductDetailBenefits({ product }: { product: Product }) {
  return (
    <section className="section-pad bg-cream/60">
      <div className="container-page">
        <Reveal>
          <p className="text-center text-[10px] tracking-[0.32em] text-grey uppercase">Преимущества</p>
          <h2 className="headline-lg mt-4 text-center !normal-case !tracking-[0.02em]">
            Почему это работает
          </h2>
        </Reveal>

        <Stagger className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {product.benefits.map((benefit, i) => (
            <StaggerItem
              key={benefit}
              className={cn(
                "border-t border-black/10 pt-6 text-center md:border-t-0 md:border-l md:pt-0 md:pl-8 md:text-left",
                i === 0 && "md:border-l-0 md:pl-0",
              )}
            >
              <span className="font-display text-4xl leading-none text-gold/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-sm leading-relaxed text-charcoal">{benefit}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function ProductDetailRitual({ product }: { product: Product }) {
  return (
    <section className="container-page section-pad">
      <Reveal>
        <p className="text-[10px] tracking-[0.32em] text-grey uppercase">Ритуал</p>
        <h2 className="headline-lg mt-4 !normal-case !tracking-[0.02em]">Как применять</h2>
      </Reveal>

      <ol className="mt-12 grid gap-0 md:grid-cols-3">
        {product.howToUse.map((step, i) => (
          <li
            key={step}
            className={cn(
              "relative border-t border-border py-8 md:border-t-0 md:border-l md:px-8 md:py-0",
              i === 0 && "md:border-l-0 md:pl-0",
            )}
          >
            <span className="text-[10px] tracking-[0.24em] text-gold uppercase">
              Шаг {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-charcoal">{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ProductDetailSpecs({ product }: { product: Product }) {
  return (
    <section className="container-page pb-16">
      <div className="mx-auto max-w-3xl">
        <DetailAccordion title="Состав INCI" defaultOpen>
          <p className="font-mono text-xs leading-[1.9] text-grey">{product.ingredients.join(" · ")}</p>
        </DetailAccordion>
        <DetailAccordion title="Тип кожи">
          <p className="text-sm leading-relaxed text-grey">{product.skinTypeLabel}</p>
        </DetailAccordion>
      </div>
    </section>
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
    <details className="group border-b border-border" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[10px] tracking-[0.22em] uppercase transition-colors hover:text-grey [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown
          className="size-4 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
          strokeWidth={1}
        />
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}
