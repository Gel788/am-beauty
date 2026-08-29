"use client";

import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Product } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";
import { ProductMedia } from "@/components/ui/product-media";

type CatalogFeaturedCardProps = {
  product: Product;
};

export function CatalogFeaturedCard({ product }: CatalogFeaturedCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.slug));

  return (
    <article className="group relative overflow-hidden border border-border bg-white">
      <div className="grid md:grid-cols-[1.1fr_1fr]">
        <Link
          href={`/products/${product.slug}`}
          className="relative block min-h-[220px] overflow-hidden bg-cream sm:min-h-[280px] md:min-h-[420px]"
        >
          <ProductMedia
            src={product.image}
            alt={product.name}
            videoSrc={product.video}
            videoMode={product.video ? "always" : "off"}
            priority
            sizes="(max-width:768px) 100vw, 50vw"
            aspect="aspect-auto min-h-[220px] sm:min-h-[280px] md:min-h-[420px]"
            objectFit="contain"
            inset="md"
            className="size-full"
          >
          {product.badge ? (
            <span className="absolute top-0 left-0 z-10 bg-gold px-3 py-1.5 text-[9px] tracking-[0.2em] text-white uppercase">
              {product.badge}
            </span>
          ) : (
            <span className="absolute top-0 left-0 z-10 bg-black px-3 py-1.5 text-[9px] tracking-[0.2em] text-white uppercase">
              Выбор редакции
            </span>
          )}
          </ProductMedia>
        </Link>

        <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12">
          <p className="label-caps">Бестселлер</p>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-grey">
            <Star className="size-3 fill-gold text-gold" strokeWidth={1} />
            <span>{product.rating}</span>
            <span className="text-grey-light">· {product.reviewCount} отзывов</span>
          </div>
          <h2 className="headline-lg mt-4">{product.shortName}</h2>
          <p className="mt-3 text-sm leading-relaxed text-grey">{product.note}</p>
          <p className="mt-2 text-xs tracking-[0.14em] text-grey uppercase">{product.actives}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <p className="font-display text-2xl tracking-wide text-black">
              {formatPrice(product.price)}
            </p>
            {product.compareAt ? (
              <p className="text-sm text-grey line-through">{formatPrice(product.compareAt)}</p>
            ) : null}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/products/${product.slug}`}
              className="inline-flex min-h-11 w-full items-center justify-center bg-black px-8 text-[10px] tracking-[0.2em] text-white uppercase transition-colors hover:bg-charcoal sm:w-auto"
            >
              Подробнее
            </Link>
            <button
              type="button"
              onClick={() => {
                addItem(product.slug);
                toast.success(`${product.shortName} в корзине`);
              }}
              className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center border border-border px-8 text-[10px] tracking-[0.2em] uppercase transition-colors hover:border-black sm:w-auto"
            >
              В корзину
            </button>
            <button
              type="button"
              onClick={() => {
                toggleWishlist(product.slug);
                toast.success(inWishlist ? "Убрано из избранного" : "В избранном");
              }}
              aria-label={inWishlist ? "Убрать из избранного" : "В избранное"}
              className="inline-flex size-11 cursor-pointer items-center justify-center border border-border transition-colors hover:border-black"
            >
              <Heart className={cn("size-4", inWishlist && "fill-black")} strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
