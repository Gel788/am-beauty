"use client";

import { useCatalog } from "@/context/catalog-context";
import { Reveal } from "@/components/reveal";

export function HomeReviews() {
  const { reviews, products } = useCatalog();
  const featured = reviews[0];
  const product = featured ? products.find((p) => p.slug === featured.productSlug) : null;

  if (!featured) return null;

  return (
    <section className="border-y border-border bg-black py-16 text-white md:py-24">
      <div className="container-page mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="text-[10px] tracking-[0.28em] text-white/45 uppercase">Отзывы</p>
          <blockquote className="mt-8 font-display text-[clamp(1.35rem,3.2vw,1.875rem)] leading-snug font-light tracking-[0.02em] text-white">
            «{featured.text}»
          </blockquote>
          <footer className="mt-8 text-[10px] tracking-[0.2em] text-white/50 uppercase">
            {featured.author}
            {product ? (
              <span className="mt-2 block text-[11px] tracking-[0.14em] text-white/35 normal-case">
                {product.shortName}
              </span>
            ) : null}
          </footer>
        </Reveal>
      </div>
    </section>
  );
}
