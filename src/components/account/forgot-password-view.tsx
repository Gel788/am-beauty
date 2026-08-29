"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CommercePageHeader } from "@/components/commerce/commerce-page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="container-page section-pad">
      <div className="mx-auto max-w-md border border-border bg-white p-6 sm:p-8">
        <CommercePageHeader
          label="Аккаунт"
          title="Восстановление пароля"
          description="Укажите email — отправим ссылку для сброса пароля."
          align="left"
          className="!text-left"
        />

        {sent ? (
          <div className="mt-8 space-y-4 text-sm text-grey">
            <p>
              Если аккаунт с таким email существует, мы отправили инструкцию. Проверьте почту
              (и папку «Спам»).
            </p>
            <Link href="/account" className="text-[10px] tracking-[0.16em] uppercase underline">
              Вернуться в кабинет
            </Link>
          </div>
        ) : (
          <form
            className="mt-8 space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              if (loading) return;
              setLoading(true);
              try {
                const res = await fetch("/api/auth/forgot-password", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                if (!res.ok) {
                  const data = (await res.json()) as { error?: string };
                  toast.error(data.error ?? "Не удалось отправить письмо");
                  return;
                }
                setSent(true);
              } catch {
                toast.error("Не удалось отправить письмо");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              aria-label="Email"
              className="h-11"
              autoComplete="email"
            />
            <Button type="submit" disabled={loading} className="w-full cursor-pointer">
              {loading ? "Отправка..." : "Отправить ссылку"}
            </Button>
            <Link
              href="/account"
              className="block text-center text-[10px] tracking-[0.16em] text-grey uppercase underline"
            >
              Назад
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
