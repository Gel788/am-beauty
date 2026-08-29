"use client";

import { useCallback, useEffect, useState } from "react";

export type CustomerSession = {
  id: string;
  email: string;
  phone: string;
  name: string;
};

export function useCustomerSession() {
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { cache: "no-store" });
      if (!res.ok) {
        setCustomer(null);
        return;
      }
      const data = (await res.json()) as { customer: CustomerSession | null };
      setCustomer(data.customer);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { customer?: CustomerSession; error?: string };
      if (!res.ok || !data.customer) {
        throw new Error(data.error ?? "Не удалось войти");
      }
      setCustomer(data.customer);
      return data.customer;
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setCustomer(null);
  }, []);

  return { customer, loading, refresh, login, logout, isAuthenticated: Boolean(customer) };
}
