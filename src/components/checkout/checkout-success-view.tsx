"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAccountStore } from "@/store/account-store";
import { Button } from "@/components/ui/button";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order");
  const demo = searchParams.get("demo");
  const deliveryParam = searchParams.get("delivery");
  const lastOrder = useAccountStore((s) => s.orders[0]);

  const deliveryInfo =
    deliveryParam
      ? decodeURIComponent(deliveryParam)
      : lastOrder
        ? `${lastOrder.delivery.city}${lastOrder.delivery.address ? `, ${lastOrder.delivery.address}` : ""}${lastOrder.delivery.pickupPoint ? ` — ${lastOrder.delivery.pickupPoint.name}` : ""}`
        : null;

  return (
    <div className="container-page section-pad text-center">
      <p className="label-caps text-accent">Спасибо за заказ</p>
      <h1 className="font-display mt-4 text-4xl">Заказ оформлен</h1>
      {order ? (
        <p className="mt-4 text-muted-foreground">
          Номер заказа: <strong>{order}</strong>
        </p>
      ) : null}
      {deliveryInfo ? (
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          Доставка: <span className="text-foreground">{deliveryInfo}</span>
        </p>
      ) : null}
      {demo === "1" ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Демо-режим оплаты. Подключите YOOKASSA_* или ROBOKASSA_* в .env для реальных платежей.
        </p>
      ) : null}
      <div className="mt-8 flex justify-center gap-3">
        <Button nativeButton={false} className="cursor-pointer" render={<Link href="/catalog" />}>
          Продолжить покупки
        </Button>
        <Button variant="outline" nativeButton={false} className="cursor-pointer" render={<Link href="/account?tab=orders" />}>
          Мои заказы
        </Button>
      </div>
    </div>
  );
}

export function CheckoutSuccessView() {
  return (
    <Suspense fallback={<div className="container-page section-pad text-center">Загрузка…</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
