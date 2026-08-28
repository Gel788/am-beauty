"use client";

import Link from "next/link";
import { formatPrice } from "@/data/products";
import { ProductMedia } from "@/components/ui/product-media";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { useCatalog, useSite } from "@/context/catalog-context";
import { HomeSectionHeader } from "@/components/home/section-header";

function FeaturedCard({
  product,
  index,
  priority,
  className,
}: {
  product: (ReturnType<typeof useCatalog>["products"])[number];
  index: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={`group relative block overflow-hidden border border-border bg-black ${className ?? ""}`}
    >
      <ProductMedia
        src={product.image}
        alt={product.name}
        priority={priority}
        sizes="(max-width:768px) 85vw, 33vw"
        aspect="aspect-[4/5]"
        objectFit="cover"
        inset="none"
        zoom={false}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/92 via-black/40 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 z-10 px-5 pt-16 pb-5 md:px-6 md:pt-20 md:pb-6">
          <p className="text-[10px] tracking-[0.32em] text-white/75 uppercase">
            N°{String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 font-display text-xl leading-tight tracking-[0.02em] text-white md:text-2xl">
            {product.shortName}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-white/80">{product.actives}</p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-white">{formatPrice(product.price)}</p>
            <span className="text-[10px] tracking-[0.2em] text-white/70 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Смотреть →
            </span>
          </div>
        </div>
      </ProductMedia>
    </Link>
  );
}

export function HomeFeatured() {
  const { home } = useSite();
  const { products } = useCatalog();
  const trio = products.filter((p) => p.isBestseller).slice(0, 3);

  return (
    <section className="border-b border-border bg-cream/50 py-16 md:py-24">
      <div className="container-page">
        <HomeSectionHeader
          label={home.featuredLabel}
          title={home.featuredTitle}
          description={home.featuredHint}
        />

        <Stagger className="mt-10 hidden gap-5 md:mt-12 md:grid md:grid-cols-3 md:gap-6" stagger={0.12}>
          {trio.map((p, i) => (
            <StaggerItem key={p.slug}>
              <FeaturedCard product={p} index={i} priority={i === 0} />
            </StaggerItem>
          ))}
        </Stagger>

        <div className="scroll-snap-x mt-10 flex gap-4 overflow-x-auto pb-2 md:hidden">
          {trio.map((p, i) => (
            <FeaturedCard
              key={p.slug}
              product={p}
              index={i}
              priority={i === 0}
              className="w-[82vw] shrink-0 snap-center"
            />
          ))}
        </div>

        <Reveal className="mt-10 text-center md:mt-12">
          <Link href="/catalog" className="link-underline">
            Вся коллекция
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
