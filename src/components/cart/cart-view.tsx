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
import { Reveal } from "@/components/reveal";
import { formatPrice, getBestsellers } from "@/data/products";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function CartThumbnailStrip({
  lines,
}: {
  lines: { product: { slug: string; image: string; shortName: string }; qty: number }[];
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {lines.map(({ product, qty }) => (
        <Link
          key={product.slug}
          href={`/products/${product.slug}`}
          className="relative flex shrink-0 flex-col items-center gap-1.5"
          title={product.shortName}
        >
          <div className="relative size-14 border border-border bg-white">
            <div className="absolute inset-1.5">
              <ContentImage
                src={product.image}
                alt=""
                fill
                objectFit="contain"
                sizes="56px"
                className="object-bottom"
              />
            </div>
          </div>
          <span className="text-[9px] tracking-[0.1em] text-grey uppercase">×{qty}</span>
        </Link>
      ))}
    </div>
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
      <div className="bg-cream/30">
        <div className="container-page section-pad">
          <CommercePageHeader
            label="Корзина"
            title="Ваш ритуал"
            description="Добавьте продукты из каталога — доставка бесплатно от 7 500 ₽."
            align="center"
          />
          <div className="mx-auto mt-10 max-w-lg border border-border bg-white p-8">
            <EmptyState
              title="Корзина пуста"
              description="Откройте каталог и выберите средства для вашего ухода."
              actionLabel="В каталог"
              actionHref="/catalog"
            />
          </div>
          <section className="mt-16 border border-border bg-white p-8 md:p-10">
            <Reveal>
              <p className="text-center text-[10px] tracking-[0.32em] text-grey uppercase">
                Рекомендуем
              </p>
              <h2 className="headline-lg mt-4 text-center !normal-case !tracking-[0.02em]">
                Вам может понравиться
              </h2>
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
              {getBestsellers(4).map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        </div>
        <CommerceTrustMarquee />
      </div>
    );
  }

  const itemWord =
    lines.length === 1 ? "товар" : lines.length < 5 ? "товара" : "товаров";

  return (
    <>
      <div className="bg-cream/30 pb-32 lg:pb-0">
        <div className="container-page section-pad">
          <CommercePageHeader
            label="Корзина"
            title={`${lines.length} ${itemWord}`}
            description="Проверьте состав заказа перед оформлением."
          />

          <div className="mt-8 border border-border bg-white p-5 md:p-6 lg:hidden">
            <p className="text-[10px] tracking-[0.18em] text-grey uppercase">Состав</p>
            <div className="mt-3">
              <CartThumbnailStrip lines={lines} />
            </div>
            <ShippingProgress subtotal={subtotal} className="mt-5" />
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px] lg:gap-12">
            <div className="space-y-6">
              <div className="hidden border border-border bg-white p-6 lg:block">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.22em] uppercase">
                      Состав заказа
                    </p>
                    <p className="mt-2 text-sm text-grey">
                      {lines.length} {itemWord} · {formatPrice(subtotal)}
                    </p>
                  </div>
                  <CartThumbnailStrip lines={lines} />
                </div>
                <ShippingProgress subtotal={subtotal} className="mt-6" />
              </div>

              <ul className="space-y-4">
                {lines.map(({ product, qty }) => {
                  const inWishlist = hasInWishlist(product.slug);
                  return (
                    <li
                      key={product.slug}
                      className="group border border-border bg-white p-5 sm:p-6"
                    >
                      <div className="flex gap-5">
                        <Link
                          href={`/products/${product.slug}`}
                          className="relative block size-28 shrink-0 overflow-hidden border border-border bg-cream sm:size-32"
                        >
                          <div className="absolute inset-2.5 sm:inset-3">
                            <ContentImage
                              src={product.image}
                              alt={product.name}
                              fill
                              objectFit="contain"
                              sizes="128px"
                              className="object-bottom"
                            />
                          </div>
                        </Link>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/products/${product.slug}`}
                                className="text-[11px] tracking-[0.16em] uppercase transition-opacity hover:opacity-60"
                              >
                                {product.shortName}
                              </Link>
                              <p className="mt-1 text-xs text-grey">{product.volume}</p>
                              <p className="mt-2 border-l border-gold/60 py-0.5 pl-2 text-[10px] tracking-[0.12em] text-charcoal uppercase">
                                {product.actives}
                              </p>
                              {product.note ? (
                                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-grey italic">
                                  {product.note}
                                </p>
                              ) : null}
                            </div>
                            <div className="flex shrink-0 gap-1">
                              <button
                                type="button"
                                aria-label={inWishlist ? "Убрать из избранного" : "В избранное"}
                                aria-pressed={inWishlist}
                                onClick={() => {
                                  toggleWishlist(product.slug);
                                  toast.success(
                                    inWishlist ? "Убрано из избранного" : "В избранном",
                                  );
                                }}
                                className="cursor-pointer p-2 text-grey transition-colors hover:text-black"
                              >
                                <Heart
                                  className={cn("size-4", inWishlist && "fill-black text-black")}
                                  strokeWidth={1}
                                />
                              </button>
                              <button
                                type="button"
                                aria-label="Удалить"
                                onClick={() => {
                                  removeItem(product.slug);
                                  toast.success("Удалено из корзины");
                                }}
                                className="cursor-pointer p-2 text-grey transition-colors hover:text-black"
                              >
                                <Trash2 className="size-4" strokeWidth={1} />
                              </button>
                            </div>
                          </div>
                          <p className="mt-3 text-sm tabular-nums">{formatPrice(product.price)}</p>

                          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                            <div
                              className="flex items-center border border-border bg-cream/50"
                              role="group"
                              aria-label="Количество"
                            >
                              <button
                                type="button"
                                aria-label="Уменьшить"
                                onClick={() => setQty(product.slug, qty - 1)}
                                className="flex size-10 cursor-pointer items-center justify-center transition-colors hover:bg-cream"
                              >
                                <Minus className="size-3.5" strokeWidth={1} />
                              </button>
                              <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
                              <button
                                type="button"
                                aria-label="Увеличить"
                                onClick={() => setQty(product.slug, qty + 1)}
                                className="flex size-10 cursor-pointer items-center justify-center transition-colors hover:bg-cream"
                              >
                                <Plus className="size-3.5" strokeWidth={1} />
                              </button>
                            </div>
                            <p className="font-display text-lg tracking-wide tabular-nums">
                              {formatPrice(product.price * qty)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="border border-border bg-cream/50 p-5">
                <CommerceTrustPills className="flex flex-wrap gap-2" />
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <OrderSummary
                lines={lines}
                subtotal={subtotal}
                discount={discount}
                shipping={shipping}
                total={total}
                promoCode={promoCode}
                showThumbnails
              />

              <form
                className="mt-6 flex gap-2"
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
                  className="h-11 bg-white"
                  aria-label="Промокод"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="h-11 shrink-0 cursor-pointer bg-white text-[10px] tracking-[0.16em] uppercase"
                >
                  Применить
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

              <Button
                nativeButton={false}
                className="mt-6 h-12 w-full cursor-pointer text-[10px] tracking-[0.2em] uppercase"
                render={<Link href="/checkout" />}
              >
                Оформить заказ
              </Button>
              <p className="mt-4 text-center text-xs text-grey">
                Безопасная оплата · Возврат 14 дней
              </p>
            </div>
          </div>

          {crossSell.length > 0 ? (
            <section className="mt-16 border border-border bg-white p-8 md:p-10">
              <Reveal>
                <p className="text-[10px] tracking-[0.32em] text-grey uppercase">
                  Дополните ритуал
                </p>
                <h2 className="headline-lg mt-4 !normal-case !tracking-[0.02em]">
                  Покупают вместе
                </h2>
              </Reveal>
              <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
                {crossSell.slice(0, 4).map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <CommerceTrustMarquee />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/90 p-4 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-grey uppercase">К оплате</p>
            <p className="font-display text-xl tracking-wide tabular-nums">{formatPrice(total)}</p>
          </div>
          <Button
            nativeButton={false}
            className="h-11 flex-1 cursor-pointer text-[10px] tracking-[0.2em] uppercase"
            render={<Link href="/checkout" />}
          >
            Оформить
          </Button>
        </div>
      </div>
    </>
  );
}
