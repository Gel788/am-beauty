"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Product } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
  priority?: boolean;
};

export function ProductCard({ product, className, priority }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.slug));

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product.slug);
    toast.success(`${product.shortName} в корзине`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.slug);
    toast.success(inWishlist ? "Убрано из избранного" : "Добавлено в избранное");
  };

  return (
    <article className={cn("group text-center", className)}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-cream">
          {product.badge ? (
            <span className="absolute top-0 left-0 z-10 bg-black px-2.5 py-1.5 text-[9px] tracking-[0.18em] text-white uppercase">
              {product.badge}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={inWishlist ? "Убрать из избранного" : "В избранное"}
            aria-pressed={inWishlist}
            className="absolute top-2 right-2 z-10 flex size-10 cursor-pointer items-center justify-center bg-white/95 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100"
          >
            <Heart className={cn("size-4", inWishlist && "fill-black")} strokeWidth={1} />
          </button>
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            className="img-zoom object-cover"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex items-center justify-center gap-1 text-[11px] text-grey">
            <Star className="size-3 fill-black text-black" strokeWidth={1} />
            <span>{product.rating}</span>
            <span className="text-grey-light">({product.reviewCount})</span>
          </div>
          <h3 className="text-[11px] tracking-[0.18em] uppercase">{product.shortName}</h3>
          <p className="text-xs text-grey">{product.volume}</p>
          <p className="text-sm">{formatPrice(product.price)}</p>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-3 w-full cursor-pointer border border-border py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors hover:border-black hover:bg-black hover:text-white sm:opacity-0 sm:transition-all sm:group-hover:opacity-100"
      >
        В корзину
      </button>
    </article>
  );
}
