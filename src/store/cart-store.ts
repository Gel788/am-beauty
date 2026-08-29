import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getProduct, type Product } from "@/data/products";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/commerce";

export type CartItem = {
  slug: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  promoCode: string | null;
  promoDiscountPercent: number | null;
  addItem: (slug: string, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  setPromo: (code: string, discountPercent: number) => void;
  clearPromo: () => void;
  pruneInvalidItems: () => void;
};

function resolveLines(items: CartItem[]) {
  return items
    .map((item) => {
      const product = getProduct(item.slug);
      if (!product) return null;
      return { product, qty: item.qty };
    })
    .filter(Boolean) as { product: Product; qty: number }[];
}

export function getCartLines(items: CartItem[]) {
  return resolveLines(items);
}

export function getCartSubtotal(items: CartItem[]) {
  return resolveLines(items).reduce((sum, l) => sum + l.product.price * l.qty, 0);
}

export function getCartDiscount(
  subtotal: number,
  promoCode: string | null,
  promoDiscountPercent: number | null,
) {
  if (!promoCode || promoDiscountPercent == null) return 0;
  return Math.round(subtotal * promoDiscountPercent);
}

export async function validatePromoCode(code: string) {
  const res = await fetch("/api/promos/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  const data = (await res.json()) as {
    valid?: boolean;
    code?: string;
    discountPercent?: number;
    error?: string;
  };
  if (!res.ok || !data.valid || !data.code || data.discountPercent == null) {
    return { ok: false as const, error: data.error ?? "Неверный промокод" };
  }
  return {
    ok: true as const,
    code: data.code,
    discountPercent: data.discountPercent,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      promoDiscountPercent: null,
      addItem: (slug, qty = 1) => {
        const product = getProduct(slug);
        if (!product) return;
        const stock = product.stock ?? Number.POSITIVE_INFINITY;
        if (stock <= 0) return;

        set((state) => {
          const existing = state.items.find((i) => i.slug === slug);
          if (existing) {
            const nextQty = Math.min(stock, existing.qty + qty);
            return {
              items: state.items.map((i) =>
                i.slug === slug ? { ...i, qty: nextQty } : i,
              ),
            };
          }
          return { items: [...state.items, { slug, qty: Math.min(stock, qty) }] };
        });
      },
      removeItem: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) => {
        const product = getProduct(slug);
        const stock = product?.stock ?? Number.POSITIVE_INFINITY;
        if (qty < 1) {
          get().removeItem(slug);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.slug === slug ? { ...i, qty: Math.min(stock, qty) } : i,
          ),
        }));
      },
      clearCart: () => set({ items: [], promoCode: null, promoDiscountPercent: null }),
      setPromo: (code, discountPercent) =>
        set({ promoCode: code, promoDiscountPercent: discountPercent }),
      clearPromo: () => set({ promoCode: null, promoDiscountPercent: null }),
      pruneInvalidItems: () =>
        set((state) => ({
          items: state.items.filter((i) => Boolean(getProduct(i.slug))),
        })),
    }),
    {
      name: "am-beauty-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export function getDefaultShipping(subtotal: number): number {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_COST;
}

export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const promoDiscountPercent = useCartStore((s) => s.promoDiscountPercent);
  const lines = resolveLines(items);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const discount = getCartDiscount(subtotal, promoCode, promoDiscountPercent);
  const shipping = getDefaultShipping(subtotal);
  const total = Math.max(0, subtotal - discount + shipping);
  return { lines, count, subtotal, discount, shipping, total, promoCode };
}

export function isInStock(product: Pick<Product, "stock">) {
  return product.stock == null || product.stock > 0;
}

export function maxPurchasableQty(product: Pick<Product, "stock">, currentQty = 0) {
  if (product.stock == null) return Number.POSITIVE_INFINITY;
  return Math.max(0, product.stock - currentQty);
}
