"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { products, type SerumProduct } from "@/data/products";

type CartLine = { product: SerumProduct; qty: number };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (slug: string) => void;
  remove: (slug: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = useCallback((slug: string) => {
    const product = products.find((p) => p.slug === slug);
    if (!product) return;
    setLines((prev) => {
      const hit = prev.find((l) => l.product.slug === slug);
      if (hit) {
        return prev.map((l) =>
          l.product.slug === slug ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => prev.filter((l) => l.product.slug !== slug));
  }, []);

  const value = useMemo(() => {
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const total = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    return { lines, count, total, add, remove };
  }, [lines, add, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart вне CartProvider");
  return ctx;
}
