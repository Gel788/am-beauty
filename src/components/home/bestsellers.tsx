import Link from "next/link";
import { getBestsellers } from "@/data/products";
import { ProductCard } from "@/components/catalog/product-card";
import { Reveal, Stagger, StaggerItem } from "@/components/reveal";

export function HomeBestsellers() {
  const items = getBestsellers(4);

  return (
    <section className="section-pad bg-white">
      <div className="container-page">
        <Reveal>
          <div className="flex items-end justify-between gap-6 border-b border-border pb-8">
            <h2 className="headline-lg">Хиты продаж</h2>
            <Link href="/catalog" className="link-underline hidden sm:inline-block">
              Каталог
            </Link>
          </div>
        </Reveal>

        <Stagger className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-8">
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
