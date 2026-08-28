"use client";

import { ContentImage } from "@/components/ui/content-image";
import Link from "next/link";
import { useCatalogCategories, useSite } from "@/context/catalog-context";
import { Reveal } from "@/components/reveal";
import { HomeSectionHeader } from "@/components/home/section-header";

export function HomeCategories() {
  const categories = useCatalogCategories();
  const { home } = useSite();
  const [lead, ...rest] = categories;

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container-page">
        <HomeSectionHeader label="Категории" title={home.categoriesTitle} align="center" className="mx-auto" />

        {lead ? (
          <Reveal delay={0.1} className="mt-10 md:mt-12">
            <Link
              href={`/catalog?category=${lead.id}`}
              className="group relative block aspect-[5/4] overflow-hidden sm:aspect-[16/9] md:aspect-[21/9]"
            >
              <ContentImage
                src={lead.image}
                alt={lead.title}
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 transition-colors duration-500 group-hover:from-black/85" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-6 text-left text-white md:p-10">
                <p className="text-[10px] tracking-[0.28em] text-white/70 uppercase">Главная категория</p>
                <h3 className="mt-3 font-display text-2xl tracking-[0.02em] text-white md:text-3xl">
                  {lead.title}
                </h3>
                <span className="link-underline mt-5 !text-white opacity-80 transition-opacity group-hover:opacity-100">
                  Смотреть
                </span>
              </div>
            </Link>
          </Reveal>
        ) : null}

        <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-3 md:gap-5">
          {rest.map((cat, i) => (
            <Reveal key={cat.id} delay={0.08 * (i + 1)}>
              <Link
                href={`/catalog?category=${cat.id}`}
                className="group relative flex min-h-[220px] items-end overflow-hidden bg-black p-5 md:min-h-[260px] md:p-6"
              >
                <ContentImage
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover object-center opacity-70 transition-transform duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-80"
                  sizes="33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <h3 className="relative text-[11px] tracking-[0.2em] text-white uppercase">{cat.title}</h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
