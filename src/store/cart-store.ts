import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getProduct, type Product } from "@/data/products";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/commerce";

export type CartItem = {
  slug: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  promoCode: string | null;
  addItem: (slug: string, qty?: number) => void;
  removeItem: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clearCart: () => void;
  applyPromo: (code: string) => boolean;
  clearPromo: () => void;
};

const PROMO_CODES: Record<string, number> = {
  AMBEAUTY10: 0.1,
  WELCOME15: 0.15,
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

export function getCartDiscount(subtotal: number, promoCode: string | null) {
  if (!promoCode) return 0;
  const rate = PROMO_CODES[promoCode.toUpperCase()];
  return rate ? Math.round(subtotal * rate) : 0;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: null,
      addItem: (slug, qty = 1) => {
        if (!getProduct(slug)) return;
        set((state) => {
          const existing = state.items.find((i) => i.slug === slug);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === slug ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return { items: [...state.items, { slug, qty }] };
        });
      },
      removeItem: (slug) =>
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) => {
        if (qty < 1) {
          get().removeItem(slug);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
        }));
      },
      clearCart: () => set({ items: [], promoCode: null }),
      applyPromo: (code) => {
        const normalized = code.trim().toUpperCase();
        if (!PROMO_CODES[normalized]) return false;
        set({ promoCode: normalized });
        return true;
      },
      clearPromo: () => set({ promoCode: null }),
    }),
    { name: "am-beauty-cart" },
  ),
);

export function getDefaultShipping(subtotal: number): number {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return SHIPPING_COST;
}

export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const lines = resolveLines(items);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const discount = getCartDiscount(subtotal, promoCode);
  const shipping = getDefaultShipping(subtotal);
  const total = Math.max(0, subtotal - discount + shipping);
  return { lines, count, subtotal, discount, shipping, total, promoCode };
}
