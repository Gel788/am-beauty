"use client";

import Link from "next/link";
import { AccountLoginForm } from "@/components/account/account-login-form";
import { Button } from "@/components/ui/button";

type AccountLoginGateProps = {
  onSuccess?: (customer: { email: string; name: string; phone: string }) => void;
  onOpenWishlist?: () => void;
};

export function AccountLoginGate({ onSuccess, onOpenWishlist }: AccountLoginGateProps) {
  return (
    <div className="mx-auto max-w-md py-4 sm:py-8">
      <p className="border-l-2 border-gold py-0.5 pl-3 text-[10px] tracking-[0.22em] uppercase text-grey">
        Вход
      </p>
      <h2 className="mt-4 font-display text-2xl tracking-[0.02em] md:text-3xl">Личный кабинет</h2>
      <p className="mt-3 text-sm leading-relaxed text-grey">
        Войдите по email и паролю, чтобы видеть заказы и профиль на всех устройствах. После первого
        заказа аккаунт создаётся автоматически — пароль приходит на почту.
      </p>

      <div className="mt-8 border border-border bg-cream/30 p-5 sm:p-6">
        <AccountLoginForm onSuccess={onSuccess} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {onOpenWishlist ? (
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer text-[10px] tracking-[0.16em] uppercase"
            onClick={onOpenWishlist}
          >
            Избранное без входа
          </Button>
        ) : null}
        <Button
          nativeButton={false}
          variant="outline"
          className="cursor-pointer text-[10px] tracking-[0.16em] uppercase"
          render={<Link href="/catalog" />}
        >
          В каталог
        </Button>
      </div>
    </div>
  );
}
