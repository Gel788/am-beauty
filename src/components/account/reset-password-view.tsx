"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { CommercePageHeader } from "@/components/commerce/commerce-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrandLoader } from "@/components/ui/brand-loader";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="mt-8 text-sm text-grey">
        <p>Ссылка недействительна. Запросите восстановление пароля заново.</p>
        <Link href="/account/forgot-password" className="mt-4 inline-block underline">
          Восстановить пароль
        </Link>
      </div>
    );
  }

  return (
    <form
      className="mt-8 space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (password !== confirm) {
          toast.error("Пароли не совпадают");
          return;
        }
        if (password.length < 8) {
          toast.error("Пароль должен быть не короче 8 символов");
          return;
        }
        setLoading(true);
        try {
          const res = await fetch("/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token, password }),
          });
          const data = (await res.json()) as { error?: string };
          if (!res.ok) {
            toast.error(data.error ?? "Не удалось сменить пароль");
            return;
          }
          toast.success("Пароль обновлён. Войдите в кабинет.");
          router.push("/account");
        } catch {
          toast.error("Не удалось сменить пароль");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Input
        type="password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Новый пароль"
        aria-label="Новый пароль"
        className="h-11"
        autoComplete="new-password"
      />
      <Input
        type="password"
        required
        minLength={8}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Повторите пароль"
        aria-label="Повторите пароль"
        className="h-11"
        autoComplete="new-password"
      />
      <Button type="submit" disabled={loading} className="w-full cursor-pointer">
        {loading ? "Сохранение..." : "Сохранить пароль"}
      </Button>
    </form>
  );
}

export function ResetPasswordView() {
  return (
    <div className="container-page section-pad">
      <div className="mx-auto max-w-md border border-border bg-white p-6 sm:p-8">
        <CommercePageHeader
          label="Аккаунт"
          title="Новый пароль"
          description="Придумайте новый пароль для входа в личный кабинет."
          align="left"
          className="!text-left"
        />
        <Suspense fallback={<BrandLoader className="mt-8" />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
