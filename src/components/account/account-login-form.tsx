"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AccountLoginFormProps = {
  onSuccess?: (customer: { email: string; name: string; phone: string }) => void;
};

export function AccountLoginForm({ onSuccess }: AccountLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
          const data = (await res.json()) as {
            customer?: { email: string; name: string; phone: string };
            error?: string;
          };
          if (!res.ok || !data.customer) {
            toast.error(data.error ?? "Неверный email или пароль");
            return;
          }
          toast.success("Вы вошли в личный кабинет");
          onSuccess?.(data.customer);
        } catch {
          toast.error("Не удалось войти");
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
        className="h-11 bg-white"
        autoComplete="email"
      />
      <Input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль"
        aria-label="Пароль"
        className="h-11 bg-white"
        autoComplete="current-password"
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/account/forgot-password"
          className="text-[10px] tracking-[0.16em] text-grey uppercase underline underline-offset-2"
        >
          Забыли пароль?
        </Link>
      </div>
      <Button type="submit" disabled={loading} className="w-full cursor-pointer">
        {loading ? "Вход..." : "Войти"}
      </Button>
      <p className="text-xs leading-relaxed text-grey">
        Аккаунт создаётся автоматически после первого заказа. Пароль приходит на email.
      </p>
    </form>
  );
}
