"use client";

import { getProduct } from "@/data/products";
import { useCatalog } from "@/context/catalog-context";

export function HomeReviews() {
  const { reviews } = useCatalog();
  const featured = reviews[0];

  return (
    <section className="section-pad-sm bg-cream">
      <div className="container-page max-w-4xl">
        <p className="label-caps text-center">Отзывы</p>
        {featured ? (
          <blockquote className="mt-10 text-center">
            <p className="text-lg leading-relaxed font-light md:text-xl">
              «{featured.text}»
            </p>
            <footer className="mt-8">
              <p className="text-[10px] tracking-[0.24em] uppercase">{featured.author}</p>
              {getProduct(featured.productSlug) ? (
                <p className="mt-2 text-xs text-grey">
                  {getProduct(featured.productSlug)?.shortName}
                </p>
              ) : null}
            </footer>
          </blockquote>
        ) : null}
      </div>
    </section>
  );
}
