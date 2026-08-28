"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="mx-auto w-full max-w-sm space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });
        if (res.ok) {
          router.push("/admin");
          router.refresh();
        } else {
          setError("Неверный пароль");
        }
        setLoading(false);
      }}
    >
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Пароль администратора"
        aria-label="Пароль"
        className="h-12 bg-white"
        autoFocus
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button
        type="submit"
        disabled={loading}
        className="h-12 w-full cursor-pointer text-[10px] tracking-[0.2em] uppercase"
      >
        {loading ? "Вход…" : "Войти"}
      </Button>
    </form>
  );
}
