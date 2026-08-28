"use client";

import { Reveal, Stagger, StaggerItem } from "@/components/reveal";
import { useSite } from "@/context/catalog-context";
import { HomeSectionHeader } from "@/components/home/section-header";

export function HomeBenefits() {
  const pillars = useSite().home.benefits;

  return (
    <section className="border-b border-border bg-cream/40 py-16 md:py-24">
      <div className="container-page">
        <HomeSectionHeader label="Стандарты" title="Почему AM Beauty" align="center" className="mx-auto" />

        <Stagger className="mt-12 grid gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {pillars.map((item, i) => (
            <StaggerItem key={item.title}>
              <Reveal delay={0.05 * i}>
                <article className="h-full border-l-2 border-gold/80 py-1 pl-5">
                  <h3 className="text-[10px] tracking-[0.22em] text-black uppercase">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-grey">{item.text}</p>
                </article>
              </Reveal>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
