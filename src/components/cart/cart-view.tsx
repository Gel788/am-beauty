"use client";

import Link from "next/link";
import { ContentImage } from "@/components/ui/content-image";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/catalog/product-card";
import { CommercePageHeader } from "@/components/commerce/commerce-page-header";
import { CommerceTrustMarquee, CommerceTrustPills } from "@/components/commerce/commerce-trust-marquee";
import { OrderSummary } from "@/components/commerce/order-summary";
import { ShippingProgress } from "@/components/commerce/shipping-progress";
import { HomeSectionHeader } from "@/components/home/section-header";
import { Reveal } from "@/components/reveal";
import { formatPrice, getBestsellers } from "@/data/products";
import type { Product } from "@/data/products";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CartLine = { product: Product; qty: number };

function CartQtyStepper({
  qty,
  onDecrease,
  onIncrease,
  compact,
}: {
  qty: number;
  onDecrease: () => void;
  onIncrease: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center border border-border bg-white",
        compact ? "h-9" : "h-10",
      )}
      role="group"
      aria-label="Количество"
    >
      <button
        type="button"
        aria-label="Уменьшить"
        onClick={onDecrease}
        className="flex size-9 cursor-pointer items-center justify-center transition-colors hover:bg-cream sm:size-10"
      >
        <Minus className="size-3.5" strokeWidth={1} />
      </button>
      <span className="w-8 text-center text-sm tabular-nums sm:w-10">{qty}</span>
      <button
        type="button"
        aria-label="Увеличить"
        onClick={onIncrease}
        className="flex size-9 cursor-pointer items-center justify-center transition-colors hover:bg-cream sm:size-10"
      >
        <Plus className="size-3.5" strokeWidth={1} />
      </button>
    </div>
  );
}

function CartLineActions({
  inWishlist,
  onToggleWishlist,
  onRemove,
}: {
  inWishlist: boolean;
  onToggleWishlist: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <button
        type="button"
        aria-label={inWishlist ? "Убрать из избранного" : "В избранное"}
        aria-pressed={inWishlist}
        onClick={onToggleWishlist}
        className="cursor-pointer p-2 text-grey transition-colors hover:text-black"
      >
        <Heart className={cn("size-4", inWishlist && "fill-black text-black")} strokeWidth={1} />
      </button>
      <button
        type="button"
        aria-label="Удалить"
        onClick={onRemove}
        className="cursor-pointer p-2 text-grey transition-colors hover:text-black"
      >
        <Trash2 className="size-4" strokeWidth={1} />
      </button>
    </div>
  );
}

function CartLineMobile({
  line,
  inWishlist,
  onQtyChange,
  onToggleWishlist,
  onRemove,
}: {
  line: CartLine;
  inWishlist: boolean;
  onQtyChange: (qty: number) => void;
  onToggleWishlist: () => void;
  onRemove: () => void;
}) {
  const { product, qty } = line;

  return (
    <li className="border border-border bg-white p-4 sm:p-5">
      <div className="flex min-w-0 gap-4">
        <Link
          href={`/products/${product.slug}`}
          className="relative block size-24 shrink-0 overflow-hidden border border-border bg-cream sm:size-28"
        >
          <ContentImage
            src={product.image}
            alt={product.name}
            fill
            objectFit="cover"
            sizes="112px"
            className="object-center"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={`/products/${product.slug}`}
                className="font-display text-lg leading-tight tracking-[0.02em] break-words text-black"
              >
                {product.shortName}
              </Link>
              <p className="mt-1 text-xs text-grey">{product.volume}</p>
            </div>
            <CartLineActions
              inWishlist={inWishlist}
              onToggleWishlist={onToggleWishlist}
              onRemove={onRemove}
            />
          </div>

          <p className="mt-3 text-sm tabular-nums text-charcoal">{formatPrice(product.price)}</p>

          <div className="mt-4 flex min-w-0 items-center justify-between gap-3">
            <CartQtyStepper
              qty={qty}
              onDecrease={() => onQtyChange(qty - 1)}
              onIncrease={() => onQtyChange(qty + 1)}
              compact
            />
            <p className="shrink-0 font-display text-lg tracking-wide tabular-nums">
              {formatPrice(product.price * qty)}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}

function CartLineDesktop({
  line,
  inWishlist,
  onQtyChange,
  onToggleWishlist,
  onRemove,
}: {
  line: CartLine;
  inWishlist: boolean;
  onQtyChange: (qty: number) => void;
  onToggleWishlist: () => void;
  onRemove: () => void;
}) {
  const { product, qty } = line;

  return (
    <li className="grid grid-cols-[minmax(0,1fr)_6rem_9rem_6.5rem_3rem] items-center gap-4 border-b border-border px-6 py-5 last:border-b-0">
      <div className="flex min-w-0 items-center gap-5">
        <Link
          href={`/products/${product.slug}`}
          className="relative block size-20 shrink-0 overflow-hidden border border-border bg-cream"
        >
          <ContentImage
            src={product.image}
            alt={product.name}
            fill
            objectFit="cover"
            sizes="80px"
            className="object-center"
          />
        </Link>
        <div className="min-w-0">
          <Link
            href={`/products/${product.slug}`}
            className="font-display text-xl leading-tight tracking-[0.02em] break-words text-black transition-opacity hover:opacity-70"
          >
            {product.shortName}
          </Link>
          <p className="mt-1 text-xs text-grey">{product.volume}</p>
          <p className="mt-2 line-clamp-1 text-[10px] tracking-[0.12em] text-charcoal/80 uppercase">
            {product.actives}
          </p>
        </div>
      </div>

      <p className="text-center text-sm tabular-nums">{formatPrice(product.price)}</p>

      <div className="flex justify-center">
        <CartQtyStepper
          qty={qty}
          onDecrease={() => onQtyChange(qty - 1)}
          onIncrease={() => onQtyChange(qty + 1)}
        />
      </div>

      <div className="flex items-center justify-end">
        <p className="font-display text-lg tracking-wide tabular-nums">
          {formatPrice(product.price * qty)}
        </p>
      </div>

      <CartLineActions
        inWishlist={inWishlist}
        onToggleWishlist={onToggleWishlist}
        onRemove={onRemove}
      />
    </li>
  );
}

function CartCheckoutAside({
  lines,
  subtotal,
  discount,
  shipping,
  total,
  promoCode,
  applyPromo,
  clearPromo,
}: {
  lines: CartLine[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string | null;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
}) {
  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
      <OrderSummary
        lines={lines}
        subtotal={subtotal}
        discount={discount}
        shipping={shipping}
        total={total}
        promoCode={promoCode}
        showThumbnails={false}
        showShippingBar={false}
        className="bg-white"
      />

      <form
        className="mt-4 flex min-w-0 gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          const code = String(fd.get("promo") ?? "");
          if (!code.trim()) return;
          if (applyPromo(code)) toast.success("Промокод применён");
          else toast.error("Неверный промокод");
        }}
      >
        <Input
          name="promo"
          placeholder="Промокод"
          defaultValue={promoCode ?? ""}
          className="h-11 min-w-0 flex-1 bg-white"
          aria-label="Промокод"
        />
        <Button
          type="submit"
          variant="outline"
          className="h-11 shrink-0 cursor-pointer bg-white px-4 text-[10px] tracking-[0.16em] uppercase"
        >
          OK
        </Button>
      </form>

      {promoCode ? (
        <button
          type="button"
          onClick={() => {
            clearPromo();
            toast.success("Промокод удалён");
          }}
          className="mt-2 cursor-pointer text-[10px] tracking-[0.16em] text-grey uppercase underline"
        >
          Убрать промокод
        </button>
      ) : null}

      <Link
        href="/checkout"
        className={buttonVariants({
          className: "mt-6 h-12 w-full cursor-pointer text-[10px] tracking-[0.2em] uppercase",
        })}
      >
        Оформить заказ
      </Link>

      <p className="mt-4 text-center text-xs text-grey">Безопасная оплата · Возврат 14 дней</p>

      <div className="mt-6 hidden border-t border-border pt-6 lg:block">
        <CommerceTrustPills className="flex flex-wrap gap-2" />
      </div>
    </aside>
  );
}

function CartCrossSell({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border pt-14 md:mt-16 md:pt-16">
      <HomeSectionHeader label="Дополните ритуал" title="Покупают вместе" />
      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-8 md:gap-y-12">
        {products.slice(0, 4).map((p, i) => (
          <Reveal key={p.slug} delay={0.05 * i}>
            <ProductCard product={p} priority={i < 2} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function CartView() {
  const { lines, subtotal, discount, shipping, total, promoCode } = useCartTotals();
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const clearPromo = useCartStore((s) => s.clearPromo);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const hasInWishlist = useWishlistStore((s) => s.has);

  const cartSlugs = new Set(lines.map((l) => l.product.slug));
  const suggestions = getBestsellers(4).filter((p) => !cartSlugs.has(p.slug));
  const crossSell = suggestions.length > 0 ? suggestions : getBestsellers(4);

  if (lines.length === 0) {
    return (
      <div className="overflow-x-clip bg-cream/30">
        <div className="container-page max-w-full section-pad">
          <CommercePageHeader
            label="Корзина"
            title="Ваш ритуал"
            description="Добавьте продукты из каталога — доставка бесплатно от 7 500 ₽."
            align="center"
          />
          <div className="mx-auto mt-10 max-w-lg border border-border bg-white p-8 sm:p-10">
            <EmptyState
              title="Корзина пуста"
              description="Откройте каталог и выберите средства для вашего ухода."
              actionLabel="В каталог"
              actionHref="/catalog"
            />
          </div>
          <CartCrossSell products={getBestsellers(4)} />
        </div>
        <CommerceTrustMarquee />
      </div>
    );
  }

  const itemWord =
    lines.length === 1 ? "товар" : lines.length < 5 ? "товара" : "товаров";

  const renderLine = (line: CartLine, variant: "mobile" | "desktop") => {
    const inWishlist = hasInWishlist(line.product.slug);
    const handlers = {
      inWishlist,
      onQtyChange: (qty: number) => setQty(line.product.slug, qty),
      onToggleWishlist: () => {
        toggleWishlist(line.product.slug);
        toast.success(inWishlist ? "Убрано из избранного" : "В избранном");
      },
      onRemove: () => {
        removeItem(line.product.slug);
        toast.success("Удалено из корзины");
      },
    };

    return variant === "mobile" ? (
      <CartLineMobile key={line.product.slug} line={line} {...handlers} />
    ) : (
      <CartLineDesktop key={line.product.slug} line={line} {...handlers} />
    );
  };

  return (
    <>
      <div className="overflow-x-clip bg-cream/30 pb-32 lg:pb-20">
        <div className="container-page max-w-full section-pad">
          <CommercePageHeader
            label="Корзина"
            title={`${lines.length} ${itemWord}`}
            description="Проверьте состав заказа перед оформлением."
          />

          <div className="mt-8 border border-border bg-white p-5 md:p-6">
            <ShippingProgress subtotal={subtotal} />
          </div>

          <div className="mt-10 grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] lg:gap-12 xl:gap-16">
            <div className="min-w-0 space-y-4">
              <ul className="space-y-3 lg:hidden">{lines.map((line) => renderLine(line, "mobile"))}</ul>

              <div className="hidden overflow-hidden border border-border bg-white lg:block">
                <div className="grid grid-cols-[minmax(0,1fr)_6rem_9rem_6.5rem_3rem] gap-4 border-b border-border bg-cream/40 px-6 py-4 text-[10px] tracking-[0.18em] text-grey uppercase">
                  <span>Товар</span>
                  <span className="text-center">Цена</span>
                  <span className="text-center">Кол-во</span>
                  <span className="text-right">Сумма</span>
                  <span className="sr-only">Действия</span>
                </div>
                <ul>{lines.map((line) => renderLine(line, "desktop"))}</ul>
              </div>

              <div className="border border-border bg-white p-4 lg:hidden">
                <CommerceTrustPills className="flex flex-wrap gap-2" />
              </div>
            </div>

            <CartCheckoutAside
              lines={lines}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              promoCode={promoCode}
              applyPromo={applyPromo}
              clearPromo={clearPromo}
            />
          </div>

          <CartCrossSell products={crossSell} />
        </div>

        <CommerceTrustMarquee />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 max-w-[100vw] overflow-hidden border-t border-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
        <div className="flex min-w-0 items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6">
          <div className="min-w-0 shrink">
            <p className="text-[10px] tracking-[0.18em] text-grey uppercase">К оплате</p>
            <p className="font-display text-xl tracking-wide tabular-nums">{formatPrice(total)}</p>
          </div>
          <Link
            href="/checkout"
            className={buttonVariants({
              className:
                "h-11 min-w-0 flex-1 cursor-pointer px-4 text-center text-[10px] tracking-[0.2em] uppercase sm:max-w-[220px]",
            })}
          >
            Оформить
          </Link>
        </div>
      </div>
    </>
  );
}
