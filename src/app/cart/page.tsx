import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Корзина покупок AM Beauty",
};

export default function CartPage() {
  return <CartView />;
}
