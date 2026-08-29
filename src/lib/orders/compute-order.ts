import { applyFreeShipping } from "@/lib/delivery/fallback";
import { readDb } from "@/lib/admin/db";
import type { AdminOrderItem } from "@/lib/admin/types";
import type { CreateOrderInput } from "@/lib/orders/create-order";

const TOTAL_TOLERANCE = 1;

export async function computeOrderTotals(
  input: CreateOrderInput,
): Promise<{ ok: true; data: CreateOrderInput } | { ok: false; error: string }> {
  const db = await readDb();
  const items: AdminOrderItem[] = [];
  let subtotal = 0;

  for (const item of input.items) {
    const product = db.products.find((p) => p.slug === item.slug && p.published);
    if (!product) {
      return { ok: false, error: `Товар «${item.name}» недоступен` };
    }
    if (item.qty > product.stock) {
      return {
        ok: false,
        error:
          product.stock <= 0
            ? `«${product.shortName}» нет в наличии`
            : `Доступно только ${product.stock} шт. «${product.shortName}»`,
      };
    }

    items.push({
      slug: product.slug,
      name: product.shortName,
      qty: item.qty,
      price: product.price,
      image: product.image,
    });
    subtotal += product.price * item.qty;
  }

  let discount = 0;
  let promoCode: string | null = null;

  if (input.promoCode) {
    const promo = db.promos.find(
      (p) => p.active && p.code.toLowerCase() === input.promoCode!.trim().toLowerCase(),
    );
    if (!promo) {
      return { ok: false, error: "Промокод недействителен или неактивен" };
    }
    promoCode = promo.code;
    discount = Math.round(subtotal * promo.discountPercent);
  }

  const merchandise = subtotal - discount;
  const deliveryPrice =
    typeof input.delivery?.price === "number" && input.delivery.price >= 0
      ? input.delivery.price
      : 0;
  const shipping = applyFreeShipping(deliveryPrice, merchandise);
  const total = merchandise + shipping;

  if (Math.abs(subtotal - input.subtotal) > TOTAL_TOLERANCE) {
    return { ok: false, error: "Сумма заказа изменилась. Обновите корзину" };
  }
  if (Math.abs(discount - input.discount) > TOTAL_TOLERANCE) {
    return { ok: false, error: "Скидка пересчитана. Проверьте промокод" };
  }
  if (Math.abs(shipping - input.shipping) > TOTAL_TOLERANCE) {
    return { ok: false, error: "Стоимость доставки изменилась. Выберите доставку заново" };
  }
  if (Math.abs(total - input.total) > TOTAL_TOLERANCE) {
    return { ok: false, error: "Итоговая сумма изменилась. Обновите заказ" };
  }

  return {
    ok: true,
    data: {
      ...input,
      items,
      subtotal,
      discount,
      shipping,
      total,
      promoCode,
      status: "pending",
    },
  };
}
