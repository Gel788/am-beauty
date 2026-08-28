"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/catalog/product-card";
import { formatPrice, getProductsBySlugs, type Product } from "@/data/products";
import { getReviewsForProduct } from "@/data/reviews";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductDetail({ product }: { product: Product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.slug));

  const related = getProductsBySlugs(product.relatedSlugs);
  const bundle = getProductsBySlugs(product.bundleSlugs);
  const productReviews = getReviewsForProduct(product.slug);

  const handleAdd = () => {
    addItem(product.slug, qty);
    toast.success(`${product.shortName} × ${qty} в корзине`);
  };

  const buyBox = (
    <>
      <div className="mt-8 flex items-baseline gap-4">
        <p className="text-xl tracking-wide">{formatPrice(product.price)}</p>
        {product.compareAt ? (
          <p className="text-sm text-grey line-through">{formatPrice(product.compareAt)}</p>
        ) : null}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center border border-border" role="group" aria-label="Количество">
          <button
            type="button"
            aria-label="Уменьшить"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex size-11 cursor-pointer items-center justify-center"
          >
            <Minus className="size-4" strokeWidth={1} />
          </button>
          <span className="w-10 text-center text-sm" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Увеличить"
            onClick={() => setQty((q) => q + 1)}
            className="flex size-11 cursor-pointer items-center justify-center"
          >
            <Plus className="size-4" strokeWidth={1} />
          </button>
        </div>
        <Button className="h-11 flex-1 cursor-pointer" onClick={handleAdd}>
          В корзину
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="size-11 shrink-0 cursor-pointer"
          aria-label={inWishlist ? "Убрать из избранного" : "В избранное"}
          aria-pressed={inWishlist}
          onClick={() => {
            toggleWishlist(product.slug);
            toast.success(inWishlist ? "Убрано из избранного" : "В избранном");
          }}
        >
          <Heart className={cn("size-4", inWishlist && "fill-black")} strokeWidth={1} />
        </Button>
      </div>

      <p className="mt-4 text-xs text-grey">
        Бесплатная доставка от 7 500 ₽ · Возврат 14 дней · Оплата картой и СБП
      </p>
    </>
  );

  return (
    <>
      <div className="container-page section-pad-sm pb-28 lg:pb-16">
        <nav aria-label="Хлебные крошки" className="text-[10px] tracking-[0.18em] text-grey uppercase">
          <Link href="/" className="hover:text-black">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link href="/catalog" className="hover:text-black">
            Каталог
          </Link>
          <span className="mx-2">/</span>
          <span className="text-black">{product.shortName}</span>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <div className="relative aspect-square overflow-hidden bg-cream">
              <Image
                src={product.gallery[activeImage] ?? product.image}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="50vw"
              />
            </div>
            {product.gallery.length > 1 ? (
              <div className="mt-3 flex gap-2" role="tablist" aria-label="Фото товара">
                {product.gallery.map((src: string, i: number) => (
                  <button
                    key={src}
                    type="button"
                    role="tab"
                    aria-selected={i === activeImage}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative size-16 cursor-pointer overflow-hidden border",
                      i === activeImage ? "border-black" : "border-border",
                    )}
                  >
                    <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            {product.badge ? <span className="label-caps">{product.badge}</span> : null}
            <h1 className="headline-lg mt-4 !normal-case">{product.name}</h1>
            <p className="mt-2 text-sm text-grey">
              {product.rating} · {product.reviewCount} отзывов · {product.volume}
            </p>
            <p className="mt-6 text-sm tracking-wide text-black">{product.actives}</p>
            <p className="mt-4 leading-relaxed text-grey">{product.description}</p>
            {buyBox}
          </div>
        </div>

        <div className="mt-16 max-w-2xl">
          <DetailAccordion title="Преимущества">
            <ul className="space-y-2 text-sm text-grey">
              {product.benefits.map((b: string) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </DetailAccordion>
          <DetailAccordion title="Способ применения">
            <ol className="list-decimal space-y-2 pl-4 text-sm text-grey">
              {product.howToUse.map((s: string) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </DetailAccordion>
          <DetailAccordion title="Состав INCI">
            <p className="text-sm leading-relaxed text-grey">{product.ingredients.join(" · ")}</p>
          </DetailAccordion>
          <DetailAccordion title="Тип кожи">
            <p className="text-sm text-grey">{product.skinTypeLabel}</p>
          </DetailAccordion>
        </div>

        {productReviews.length > 0 ? (
          <section className="mt-20 border-t border-border pt-16">
            <h2 className="headline-lg text-center">Отзывы</h2>
            <div className="mx-auto mt-10 max-w-2xl space-y-10">
              {productReviews.map((r) => (
                <blockquote key={r.id} className="text-center">
                  <p className="leading-relaxed">«{r.text}»</p>
                  <footer className="mt-4 text-[10px] tracking-[0.2em] text-grey uppercase">
                    {r.author}
                  </footer>
                </blockquote>
              ))}
            </div>
          </section>
        ) : null}

        {bundle.length > 0 ? (
          <section className="mt-20">
            <h2 className="headline-lg text-center">Покупают вместе</h2>
            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3">
              {bundle.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-20 border-t border-border pt-16">
            <h2 className="headline-lg text-center">Похожие товары</h2>
            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <p className="shrink-0 text-sm font-medium">{formatPrice(product.price * qty)}</p>
          <Button className="h-11 flex-1 cursor-pointer" onClick={handleAdd}>
            В корзину
          </Button>
        </div>
      </div>
    </>
  );
}

function DetailAccordion({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-border">
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 text-[10px] tracking-[0.22em] uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown className="size-4 transition-transform group-open:rotate-180" strokeWidth={1} />
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}
