"use client";

import Link from "next/link";
import { ProductCard } from "@/components/catalog/product-card";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { useCatalog } from "@/context/catalog-context";
import { HomeSectionHeader } from "@/components/home/section-header";

export function HomeBestsellers() {
  const { products } = useCatalog();
  const featured = products.filter((p) => p.isBestseller).slice(0, 3);
  const featuredSlugs = new Set(featured.map((p) => p.slug));
  const items = products.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="border-b border-border bg-white py-16 md:py-24">
      <div className="container-page">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <HomeSectionHeader label="Магазин" title="Ещё из коллекции" className="sm:mb-0" />
          <Reveal>
            <Link href="/catalog" className="link-underline shrink-0">
              Каталог
            </Link>
          </Reveal>
        </div>

        <Stagger className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-12 md:grid-cols-4 md:gap-x-8 md:gap-y-12">
          {items.map((p, i) => (
            <StaggerItem key={p.slug}>
              <ProductCard product={p} priority={i < 2} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
