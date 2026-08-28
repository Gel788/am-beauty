import { useCartStore } from "@/store/cart-store";
import { getCartDiscount, getDefaultShipping } from "@/store/cart-store";
import { getProduct, type Product } from "@/data/products";
import { useCheckoutStore } from "@/store/checkout-store";

type CartItem = { slug: string; qty: number };

function resolveLines(items: CartItem[]) {
  return items
    .map((item) => {
      const product = getProduct(item.slug);
      if (!product) return null;
      return { product, qty: item.qty };
    })
    .filter(Boolean) as { product: Product; qty: number }[];
}

export function useOrderTotals() {
  const items = useCartStore((s) => s.items);
  const promoCode = useCartStore((s) => s.promoCode);
  const deliveryTariff = useCheckoutStore((s) => s.tariff);

  const lines = resolveLines(items);
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const discount = getCartDiscount(subtotal, promoCode);
  const shipping =
    deliveryTariff != null ? deliveryTariff.price : getDefaultShipping(subtotal);
  const total = Math.max(0, subtotal - discount + shipping);

  return { lines, count, subtotal, discount, shipping, total, promoCode, deliveryTariff };
}
