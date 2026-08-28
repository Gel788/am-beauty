"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order");
  const demo = searchParams.get("demo");

  return (
    <div className="container-page section-pad text-center">
      <p className="label-caps text-accent">Спасибо за заказ</p>
      <h1 className="font-display mt-4 text-4xl">Заказ оформлен</h1>
      {order ? (
        <p className="mt-4 text-muted-foreground">
          Номер заказа: <strong>{order}</strong>
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
        <Button variant="outline" nativeButton={false} className="cursor-pointer" render={<Link href="/account" />}>
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
