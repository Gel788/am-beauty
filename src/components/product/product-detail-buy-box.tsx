"use client";

import { Heart, Minus, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { formatPrice, type Product } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINE_LABELS: Record<Product["line"], string> = {
  atelier: "Atelier Collection",
  glow: "Glow Collection",
  pure: "Pure Collection",
};

type ProductDetailBuyBoxProps = {
  product: Product;
  qty: number;
  onQtyChange: (qty: number) => void;
  variant?: "inline" | "sticky";
};

export function ProductDetailBuyBox({
  product,
  qty,
  onQtyChange,
  variant = "inline",
}: ProductDetailBuyBoxProps) {
  const addItem = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.slug));

  const savings =
    product.compareAt && product.compareAt > product.price
      ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
      : null;

  const handleAdd = () => {
    addItem(product.slug, qty);
    toast.success(`${product.shortName} × ${qty} в корзине`);
  };

  return (
    <div
      className={cn(
        variant === "sticky" && "border-t border-border bg-white/90 p-4 backdrop-blur-md",
      )}
    >
      <div className={cn("flex items-baseline gap-4", variant === "inline" ? "mt-8" : "")}>
        <p className="text-2xl tracking-wide">{formatPrice(product.price)}</p>
        {product.compareAt ? (
          <p className="text-sm text-grey line-through">{formatPrice(product.compareAt)}</p>
        ) : null}
        {savings ? (
          <span className="text-[10px] tracking-[0.16em] text-gold uppercase">−{savings}%</span>
        ) : null}
      </div>

      <div className={cn("flex items-center gap-3", variant === "inline" ? "mt-6" : "mt-3")}>
        <div
          className="flex items-center border border-border bg-white"
          role="group"
          aria-label="Количество"
        >
          <button
            type="button"
            aria-label="Уменьшить"
            onClick={() => onQtyChange(Math.max(1, qty - 1))}
            className="flex size-11 cursor-pointer items-center justify-center transition-colors hover:bg-cream"
          >
            <Minus className="size-4" strokeWidth={1} />
          </button>
          <span className="w-10 text-center text-sm tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            aria-label="Увеличить"
            onClick={() => onQtyChange(qty + 1)}
            className="flex size-11 cursor-pointer items-center justify-center transition-colors hover:bg-cream"
          >
            <Plus className="size-4" strokeWidth={1} />
          </button>
        </div>
        <Button className="h-11 flex-1 cursor-pointer text-[10px] tracking-[0.2em] uppercase" onClick={handleAdd}>
          В корзину
        </Button>
        {variant === "inline" ? (
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
        ) : null}
      </div>

      {variant === "inline" ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {["Доставка от 1 дня", "Возврат 14 дней", "Оплата СБП"].map((item) => (
            <li
              key={item}
              className="border border-border px-3 py-1.5 text-[9px] tracking-[0.14em] text-grey uppercase"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ProductDetailHeroMeta({ product }: { product: Product }) {
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const inWishlist = useWishlistStore((s) => s.has(product.slug));

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[10px] tracking-[0.32em] text-grey uppercase">{LINE_LABELS[product.line]}</p>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 text-[10px] tracking-[0.16em] text-grey uppercase transition-colors hover:text-black lg:hidden"
          aria-pressed={inWishlist}
          onClick={() => {
            toggleWishlist(product.slug);
            toast.success(inWishlist ? "Убрано из избранного" : "В избранном");
          }}
        >
          <Heart className={cn("size-3.5", inWishlist && "fill-black text-black")} strokeWidth={1} />
          Избранное
        </button>
      </div>

      <h1 className="mt-5 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-light tracking-[0.02em] text-black">
        {product.name}
      </h1>

      <p className="mt-4 max-w-md text-base leading-relaxed text-grey italic">{product.note}</p>

      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-grey">
        <span className="inline-flex items-center gap-1.5">
          <Star className="size-3.5 fill-black text-black" strokeWidth={1} />
          <span className="text-black">{product.rating}</span>
          <span>({product.reviewCount})</span>
        </span>
        <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
        <span>{product.volume}</span>
        {product.ritual ? (
          <>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            <span className="text-[10px] tracking-[0.18em] uppercase">{product.ritual}</span>
          </>
        ) : null}
      </div>

      <p className="mt-8 border-l-2 border-gold py-1 pl-4 text-[11px] tracking-[0.2em] text-black uppercase">
        {product.actives}
      </p>

      <p className="mt-6 max-w-lg text-[15px] leading-[1.75] text-charcoal">{product.description}</p>
    </>
  );
}
