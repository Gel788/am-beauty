"use client";

import { useEffect, useState } from "react";
import { ContentImage } from "@/components/ui/content-image";
import Link from "next/link";
import { ViewTransition } from "react";
import { toast } from "sonner";
import { useCart } from "@/components/cart-provider";
import { Reveal } from "@/components/reveal";
import { formatPrice, products } from "@/data/products";
import { productImageTransitionName } from "@/lib/product-transition";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function useIsLargeScreen() {
  const [isLarge, setIsLarge] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsLarge(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isLarge;
}

export function Collection() {
  const { add } = useCart();
  const isLarge = useIsLargeScreen();

  const handleAdd = (slug: string, name: string) => {
    add(slug);
    toast.success(`${name} в корзине`);
  };

  return (
    <section id="shop" className="relative py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,var(--glow),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <Reveal className="text-center md:text-left">
          <p className="label-caps">Витрина</p>
          <h2 className="font-display mt-3 text-[clamp(2.25rem,4.5vw,3.5rem)] tracking-tight">
            Коллекция
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:mx-0">
            Три сыворотки — каждая для своего момента. Нажмите на карточку, чтобы
            открыть детали.
          </p>
        </Reveal>

        {isLarge === null ? (
          <div className="mt-14 grid animate-pulse gap-5 lg:grid-cols-12">
            <div className="product-well aspect-[4/5] lg:col-span-7" />
            <div className="flex flex-col gap-5 lg:col-span-5">
              <div className="product-well aspect-[4/3] flex-1" />
              <div className="product-well aspect-[4/3] flex-1" />
            </div>
          </div>
        ) : isLarge ? (
          <div className="mt-14 grid gap-5 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <ShowcaseCard product={products[0]} onAdd={handleAdd} featured />
            </Reveal>
            <div className="flex flex-col gap-5 lg:col-span-5">
              <Reveal delay={0.06}>
                <ShowcaseCard product={products[1]} onAdd={handleAdd} />
              </Reveal>
              <Reveal delay={0.1}>
                <ShowcaseCard product={products[2]} onAdd={handleAdd} />
              </Reveal>
            </div>
          </div>
        ) : (
          <div className="mt-10">
            <Carousel opts={{ align: "start" }} className="w-full">
              <CarouselContent className="-ml-4">
                {products.map((product) => (
                  <CarouselItem key={product.slug} className="basis-[86%] pl-4 sm:basis-[72%]">
                    <ShowcaseCard product={product} onAdd={handleAdd} featured />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="mt-6 flex justify-end gap-2">
                <CarouselPrevious className="static translate-y-0 rounded-none border-border bg-card" />
                <CarouselNext className="static translate-y-0 rounded-none border-border bg-card" />
              </div>
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}

function ShowcaseCard({
  product,
  onAdd,
  featured = false,
}: {
  product: (typeof products)[number];
  onAdd: (slug: string, name: string) => void;
  featured?: boolean;
}) {
  const transitionName = productImageTransitionName(product.slug);

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/products/${product.slug}`}
        transitionTypes={["nav-forward"]}
        className="product-well relative block cursor-pointer overflow-hidden"
      >
        <div className={`relative ${featured ? "aspect-[4/5]" : "aspect-[5/4] lg:aspect-[4/3]"}`}>
          <span
            className="index-outline pointer-events-none absolute top-3 right-4 z-0 font-display text-[clamp(3.5rem,8vw,5.5rem)] leading-none select-none"
            aria-hidden
          >
            {product.id}
          </span>

          {product.badge ? (
            <span className="absolute top-4 left-4 z-10 bg-[var(--copper)] px-2.5 py-1 text-[9px] tracking-[0.18em] text-[var(--ink)] uppercase">
              {product.badge}
            </span>
          ) : null}

          <ViewTransition name={transitionName} share="morph" default="none">
            <div className="absolute inset-4 z-10 md:inset-6">
              <div className="relative size-full">
                <ContentImage
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  sizes={featured ? "50vw" : "30vw"}
                />
              </div>
            </div>
          </ViewTransition>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f0c09] via-[#0f0c09]/80 to-transparent px-5 pt-16 pb-5 md:px-6 md:pb-6">
            <p className="label-caps !text-[var(--copper)]/70">{product.ritual}</p>
            <p className="font-display mt-1 text-xl text-foreground md:text-2xl">
              {product.name}
            </p>
          </div>
        </div>
      </Link>

      <div className="flex items-end justify-between gap-4 border-b border-border py-5">
        <div className="min-w-0">
          <p className="text-sm text-[var(--copper)]">{product.actives}</p>
          <p className="mt-1 truncate text-sm text-muted-foreground">{product.note}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-xl">{formatPrice(product.price)}</p>
          {product.compareAt ? (
            <p className="text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAt)}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex gap-6 pt-4">
        <Link
          href={`/products/${product.slug}`}
          transitionTypes={["nav-forward"]}
          className="label-caps cursor-pointer text-foreground transition-colors hover:text-[var(--copper)]"
        >
          Открыть
        </Link>
        <button
          type="button"
          onClick={() => onAdd(product.slug, product.name)}
          className="label-caps cursor-pointer text-muted-foreground transition-colors hover:text-[var(--copper)]"
        >
          В корзину
        </button>
      </div>
    </article>
  );
}
