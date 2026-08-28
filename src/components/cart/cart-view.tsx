"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/catalog/product-card";
import { OrderSummary } from "@/components/commerce/order-summary";
import { formatPrice, getBestsellers } from "@/data/products";
import { useCartStore, useCartTotals } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

export function CartView() {
  const { lines, subtotal, discount, shipping, total, promoCode } = useCartTotals();
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const applyPromo = useCartStore((s) => s.applyPromo);
  const clearPromo = useCartStore((s) => s.clearPromo);
  const suggestions = getBestsellers(4);

  if (lines.length === 0) {
    return (
      <div className="container-page section-pad">
        <EmptyState
          title="Корзина пуста"
          description="Добавьте продукты из каталога — доставка бесплатно от 7 500 ₽."
          actionLabel="В каталог"
          actionHref="/catalog"
        />
        <section className="mt-8 border-t border-border pt-16">
          <h2 className="headline-lg text-center">Вам может понравиться</h2>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <>
      <div className="container-page section-pad pb-32 lg:pb-16">
        <PageHeader label="Корзина" title={`${lines.length} ${lines.length === 1 ? "товар" : "товара"}`} align="left" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
          <ul className="divide-y divide-border">
            {lines.map(({ product, qty }) => (
              <li key={product.slug} className="flex gap-5 py-8 first:pt-0">
                <Link
                  href={`/products/${product.slug}`}
                  className="relative block size-28 shrink-0 bg-cream sm:size-32"
                >
                  <div className="absolute inset-2.5 sm:inset-3">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain object-bottom"
                      sizes="128px"
                    />
                  </div>
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-[11px] tracking-[0.16em] uppercase hover:opacity-60"
                  >
                    {product.shortName}
                  </Link>
                  <p className="mt-1 text-xs text-grey">{product.volume}</p>
                  <p className="mt-2 text-sm">{formatPrice(product.price)}</p>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
                    <div className="flex items-center border border-border" role="group" aria-label="Количество">
                      <button
                        type="button"
                        aria-label="Уменьшить"
                        onClick={() => setQty(product.slug, qty - 1)}
                        className="flex size-10 cursor-pointer items-center justify-center"
                      >
                        <Minus className="size-3.5" strokeWidth={1} />
                      </button>
                      <span className="w-10 text-center text-sm">{qty}</span>
                      <button
                        type="button"
                        aria-label="Увеличить"
                        onClick={() => setQty(product.slug, qty + 1)}
                        className="flex size-10 cursor-pointer items-center justify-center"
                      >
                        <Plus className="size-3.5" strokeWidth={1} />
                      </button>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(product.price * qty)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Удалить"
                  onClick={() => {
                    removeItem(product.slug);
                    toast.success("Удалено из корзины");
                  }}
                  className="cursor-pointer self-start p-2 text-grey transition-colors hover:text-black"
                >
                  <Trash2 className="size-4" strokeWidth={1} />
                </button>
              </li>
            ))}
          </ul>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <OrderSummary
              lines={lines}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              promoCode={promoCode}
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
                className="h-11"
                aria-label="Промокод"
              />
              <Button type="submit" variant="outline" className="shrink-0 cursor-pointer">
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

            <Button
              nativeButton={false}
              className="mt-6 h-12 w-full cursor-pointer"
              render={<Link href="/checkout" />}
            >
              Оформить заказ
            </Button>
            <p className="mt-4 text-center text-xs text-grey">Безопасная оплата · Возврат 14 дней</p>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-4 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-grey uppercase">Итого</p>
            <p className="text-base font-medium">{formatPrice(total)}</p>
          </div>
          <Button nativeButton={false} className="h-11 flex-1 cursor-pointer" render={<Link href="/checkout" />}>
            Оформить
          </Button>
        </div>
      </div>
    </>
  );
}
