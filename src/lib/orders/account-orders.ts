import type { AdminOrder } from "@/lib/admin/types";
import type { AccountOrder } from "@/store/account-store";

export function adminOrderToAccount(order: AdminOrder): AccountOrder {
  return {
    id: order.id,
    date: order.date,
    status: order.status,
    items: order.items,
    delivery: order.delivery,
    payment: order.payment,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    promoCode: order.promoCode,
    trackingNumber: order.trackingNumber,
  };
}

export function mergeAccountOrders(local: AccountOrder[], remote: AccountOrder[]) {
  const byId = new Map<string, AccountOrder>();
  for (const order of local) byId.set(order.id, order);
  for (const order of remote) {
    const existing = byId.get(order.id);
    byId.set(order.id, existing ? { ...existing, ...order } : order);
  }
  return [...byId.values()].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}
