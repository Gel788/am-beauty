"use client";

import { ContentImage } from "@/components/ui/content-image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Check } from "lucide-react";
import { CommerceTrustMarquee } from "@/components/commerce/commerce-trust-marquee";
import { formatPrice } from "@/data/products";
import { useAccountStore } from "@/store/account-store";
import { BrandLoader } from "@/components/ui/brand-loader";
import { Button } from "@/components/ui/button";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order");
  const demo = searchParams.get("demo");
  const welcome = searchParams.get("welcome");
  const deliveryParam = searchParams.get("delivery");
  const lastOrder = useAccountStore((s) => s.orders[0]);

  const deliveryInfo = deliveryParam
    ? decodeURIComponent(deliveryParam)
    : lastOrder
      ? `${lastOrder.delivery.city}${lastOrder.delivery.address ? `, ${lastOrder.delivery.address}` : ""}${lastOrder.delivery.pickupPoint ? ` — ${lastOrder.delivery.pickupPoint.name}` : ""}`
      : null;

  const orderId = order ?? lastOrder?.id;
  const items = lastOrder?.items ?? [];

  return (
    <>
      <div className="container-page section-pad pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex size-16 items-center justify-center border border-gold bg-cream">
            <Check className="size-7 text-gold" strokeWidth={1.5} aria-hidden />
          </div>

          <p className="mt-8 text-[10px] tracking-[0.32em] text-grey uppercase">Спасибо за заказ</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-light tracking-[0.02em]">
            Заказ оформлен
          </h1>

          {orderId ? (
            <p className="mt-4 text-sm text-grey">
              Номер заказа:{" "}
              <span className="border-l-2 border-gold pl-3 text-black">{orderId}</span>
            </p>
          ) : null}

          {deliveryInfo ? (
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-grey">
              Доставка: <span className="text-charcoal">{deliveryInfo}</span>
            </p>
          ) : null}

          {welcome === "1" ? (
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-charcoal">
              Личный кабинет создан. Пароль для входа отправлен на ваш email — проверьте почту
              (и папку «Спам»). Повторные заказы можно оформлять без входа.
            </p>
          ) : null}

          {demo === "1" ? (
            <p className="mt-3 text-xs text-grey">
              Демо-режим оплаты. Подключите YOOKASSA_* или ROBOKASSA_* в .env для реальных платежей.
            </p>
          ) : null}

          {items.length > 0 ? (
            <div className="mt-12 border border-border bg-cream/40 p-6 text-left">
              <p className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.22em] uppercase">
                Состав заказа
              </p>
              <ul className="mt-5 divide-y divide-border">
                {items.map((item) => (
                  <li key={item.slug} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative size-14 shrink-0 bg-white">
                      <div className="absolute inset-1.5">
                        <ContentImage
                          src={item.image}
                          alt=""
                          fill
                          className="object-contain object-bottom"
                          sizes="56px"
                        />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] tracking-[0.12em] uppercase">{item.name}</p>
                      <p className="text-xs text-grey">× {item.qty}</p>
                    </div>
                    <p className="shrink-0 text-sm tabular-nums">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </li>
                ))}
              </ul>
              {lastOrder ? (
                <p className="mt-4 border-t border-border pt-4 text-right font-display text-xl tracking-wide">
                  {formatPrice(lastOrder.total)}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              nativeButton={false}
              className="h-11 cursor-pointer text-[10px] tracking-[0.2em] uppercase"
              render={<Link href="/catalog" />}
            >
              Продолжить покупки
            </Button>
            <Button
              variant="outline"
              nativeButton={false}
              className="h-11 cursor-pointer text-[10px] tracking-[0.2em] uppercase"
              render={<Link href="/account?tab=orders" />}
            >
              Мои заказы
            </Button>
          </div>
        </div>
      </div>
      <CommerceTrustMarquee />
    </>
  );
}

export function CheckoutSuccessView() {
  return (
    <Suspense
      fallback={<BrandLoader className="container-page min-h-[50vh]" label="Оформление заказа" />}
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
