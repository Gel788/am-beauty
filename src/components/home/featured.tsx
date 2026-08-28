"use client";

import Link from "next/link";
import { useRef } from "react";
import { formatPrice, products } from "@/data/products";
import { ProductMedia } from "@/components/ui/product-media";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { useSite } from "@/context/catalog-context";

const trio = products.slice(0, 3);

export function HomeFeatured() {
  const { home } = useSite();
  const railRef = useRef<HTMLDivElement>(null);

  return (
    <section className="overflow-hidden bg-white py-20 md:py-28">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-caps">{home.featuredLabel}</p>
              <h2 className="headline-lg mt-3">{home.featuredTitle}</h2>
            </div>
            <p className="max-w-xs text-sm text-grey">{home.featuredHint}</p>
          </div>
        </Reveal>
      </div>

      <div
        ref={railRef}
        className="scroll-snap-x mt-12 flex gap-5 overflow-x-auto px-6 pb-4 md:gap-8 md:px-10 lg:px-16"
      >
        <Stagger className="flex gap-5 md:gap-8" stagger={0.15}>
          {trio.map((p, i) => (
            <StaggerItem key={p.slug}>
              <Link
                href={`/products/${p.slug}`}
                className="group relative block w-[85vw] shrink-0 snap-center sm:w-[52vw] md:w-[38vw] lg:w-[28vw]"
              >
                <ProductMedia
                  src={p.image}
                  alt={p.name}
                  priority={i === 0}
                  sizes="(max-width:768px) 85vw, 40vw"
                  inset="lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent md:from-black/70 md:via-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                    <p className="text-[10px] tracking-[0.36em] text-white/50 uppercase">
                      N°{String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 text-lg tracking-[0.12em] uppercase md:text-xl">
                      {p.shortName}
                    </h3>
                    <p className="mt-2 text-sm text-white/70">{p.actives}</p>
                    <p className="mt-4 text-sm">{formatPrice(p.price)}</p>
                    <span className="mt-4 inline-block text-[10px] tracking-[0.24em] uppercase underline underline-offset-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Смотреть
                    </span>
                  </div>
                </ProductMedia>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <Reveal className="container-page mt-12 text-center">
        <Link href="/catalog" className="link-underline">
          Вся коллекция
        </Link>
      </Reveal>
    </section>
  );
}
