"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/components/cart-provider";
import { ProductGallery } from "@/components/product-gallery";
import { Reveal } from "@/components/reveal";
import { formatPrice, products, type SerumProduct } from "@/data/products";
import { productImageTransitionName } from "@/lib/product-transition";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ProductDetailViewProps = {
  product: SerumProduct;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { add } = useCart();
  const others = products.filter((p) => p.slug !== product.slug);

  const handleAdd = () => {
    add(product.slug);
    toast.success(`${product.name} в корзине`);
  };

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
        <Link
          href="/#shop"
          className="inline-flex cursor-pointer items-center gap-2 text-[10px] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Коллекция
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery
            images={product.gallery}
            alt={product.name}
            name={productImageTransitionName(product.slug)}
          />

          <div className="flex flex-col lg:py-4">
            <Reveal>
              {product.badge ? (
                <span className="inline-block w-fit bg-accent px-2.5 py-1 text-[9px] tracking-[0.18em] text-accent-foreground uppercase">
                  {product.badge}
                </span>
              ) : null}
              <p className="mt-4 text-[10px] tracking-[0.24em] text-muted-foreground uppercase">
                {product.ritual} · {product.volume}
              </p>
              <h1 className="font-display mt-3 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
                {product.name}
              </h1>
              <p className="mt-3 text-sm text-accent">{product.actives}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <p className="mt-6 text-base leading-[1.8] text-muted-foreground">
                {product.description}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 flex items-baseline gap-3">
                <p className="font-display text-3xl">{formatPrice(product.price)}</p>
                {product.compareAt ? (
                  <p className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.compareAt)}
                  </p>
                ) : null}
              </div>
              <Button
                className="mt-6 h-12 w-full cursor-pointer rounded-sm text-sm tracking-wide sm:w-auto sm:px-12"
                onClick={handleAdd}
              >
                В корзину — {formatPrice(product.price)}
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                Бесплатная доставка от 7 500 ₽ · 1–3 дня по России
              </p>
            </Reveal>

            <Separator className="my-10" />

            <Reveal delay={0.14}>
              <DetailBlock title="Преимущества">
                <ul className="space-y-3">
                  {product.benefits.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} />
                      {b}
                    </li>
                  ))}
                </ul>
              </DetailBlock>
            </Reveal>

            <Reveal delay={0.18}>
              <DetailBlock title="Как наносить" className="mt-10">
                <ol className="space-y-4">
                  {product.howToUse.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span className="font-display text-2xl leading-none text-accent/70">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="pt-0.5 text-sm leading-relaxed text-muted-foreground">{step}</p>
                    </li>
                  ))}
                </ol>
              </DetailBlock>
            </Reveal>

            <Reveal delay={0.22}>
              <DetailBlock title="Состав INCI" className="mt-10">
                <p className="text-sm leading-[1.9] text-muted-foreground">
                  {product.ingredients.join(" · ")}
                </p>
              </DetailBlock>
            </Reveal>

            <Reveal delay={0.26}>
              <DetailBlock title="Тип кожи" className="mt-10">
                <p className="text-sm text-muted-foreground">{product.skinTypeLabel}</p>
              </DetailBlock>
            </Reveal>
          </div>
        </div>
      </div>

      <section className="border-t border-border bg-secondary/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="font-display text-3xl tracking-tight">Также в коллекции</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                transitionTypes={["nav-forward"]}
                className="group flex cursor-pointer gap-5 border border-border/80 bg-card p-4 transition-colors hover:border-accent/30"
              >
                <div className="relative size-24 shrink-0 overflow-hidden bg-black">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="96px"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
                    {p.ritual}
                  </p>
                  <p className="font-display mt-1 text-xl">{p.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function DetailBlock({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="text-[10px] tracking-[0.24em] text-muted-foreground uppercase">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
