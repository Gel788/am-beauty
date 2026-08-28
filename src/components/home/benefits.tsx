"use client";

import { useSite } from "@/context/catalog-context";

export function HomeBenefits() {
  const pillars = useSite().home.benefits;

  return (
    <section className="section-pad-sm">
      <div className="container-page">
        <div className="hairline mb-16" />
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {pillars.map((item) => (
            <div key={item.title} className="text-center">
              <h3 className="text-[10px] tracking-[0.28em] uppercase">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-grey">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="hairline mt-16" />
      </div>
    </section>
  );
}
