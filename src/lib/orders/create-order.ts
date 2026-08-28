import type { AdminOrder, AdminOrderItem } from "@/lib/admin/types";
import type { DeliverySelection } from "@/lib/delivery/types";
import type { OrderStatus } from "@/store/account-store";

export type CreateOrderInput = {
  id: string;
  date?: string;
  status?: OrderStatus;
  items: AdminOrderItem[];
  delivery: DeliverySelection;
  payment: "card" | "sbp";
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  promoCode?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateCreateOrderInput(body: unknown): { ok: true; data: CreateOrderInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Некорректные данные заказа" };
  }

  const raw = body as Record<string, unknown>;

  if (!isNonEmptyString(raw.id)) {
    return { ok: false, error: "Не указан номер заказа" };
  }
  if (!Array.isArray(raw.items) || raw.items.length === 0) {
    return { ok: false, error: "Корзина пуста" };
  }
  if (!raw.delivery || typeof raw.delivery !== "object") {
    return { ok: false, error: "Не указана доставка" };
  }
  if (!isNonEmptyString(raw.customerEmail)) {
    return { ok: false, error: "Укажите email" };
  }
  if (!isNonEmptyString(raw.customerName)) {
    return { ok: false, error: "Укажите имя" };
  }
  if (!isNonEmptyString(raw.customerPhone)) {
    return { ok: false, error: "Укажите телефон" };
  }

  const items: AdminOrderItem[] = [];
  for (const item of raw.items) {
    if (!item || typeof item !== "object") {
      return { ok: false, error: "Некорректный товар в заказе" };
    }
    const row = item as Record<string, unknown>;
    if (
      !isNonEmptyString(row.slug) ||
      !isNonEmptyString(row.name) ||
      typeof row.qty !== "number" ||
      row.qty < 1 ||
      typeof row.price !== "number" ||
      row.price < 0 ||
      !isNonEmptyString(row.image)
    ) {
      return { ok: false, error: "Некорректный товар в заказе" };
    }
    items.push({
      slug: row.slug,
      name: row.name,
      qty: row.qty,
      price: row.price,
      image: row.image,
    });
  }

  const payment = raw.payment === "sbp" ? "sbp" : raw.payment === "card" ? "card" : null;
  if (!payment) {
    return { ok: false, error: "Не указан способ оплаты" };
  }

  const subtotal = typeof raw.subtotal === "number" ? raw.subtotal : NaN;
  const discount = typeof raw.discount === "number" ? raw.discount : NaN;
  const shipping = typeof raw.shipping === "number" ? raw.shipping : NaN;
  const total = typeof raw.total === "number" ? raw.total : NaN;
  if ([subtotal, discount, shipping, total].some((n) => Number.isNaN(n) || n < 0)) {
    return { ok: false, error: "Некорректная сумма заказа" };
  }

  const status =
    raw.status === "pending" ||
    raw.status === "processing" ||
    raw.status === "shipped" ||
    raw.status === "delivered" ||
    raw.status === "cancelled"
      ? raw.status
      : "processing";

  return {
    ok: true,
    data: {
      id: raw.id.trim(),
      date: isNonEmptyString(raw.date) ? raw.date.trim() : new Date().toISOString().slice(0, 10),
      status,
      items,
      delivery: raw.delivery as DeliverySelection,
      payment,
      subtotal,
      discount,
      shipping,
      total,
      promoCode: isNonEmptyString(raw.promoCode) ? raw.promoCode.trim() : null,
      customerName: raw.customerName.trim(),
      customerEmail: raw.customerEmail.trim(),
      customerPhone: raw.customerPhone.trim(),
    },
  };
}

export function toAdminOrder(input: CreateOrderInput): AdminOrder {
  return {
    id: input.id,
    date: input.date ?? new Date().toISOString().slice(0, 10),
    status: input.status ?? "processing",
    items: input.items,
    delivery: input.delivery,
    payment: input.payment,
    subtotal: input.subtotal,
    discount: input.discount,
    shipping: input.shipping,
    total: input.total,
    promoCode: input.promoCode,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    customerPhone: input.customerPhone,
  };
}

export function sortOrdersNewestFirst(orders: AdminOrder[]) {
  return [...orders].sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    if (byDate !== 0) return byDate;
    return b.id.localeCompare(a.id);
  });
}
