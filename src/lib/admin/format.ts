import { formatPrice } from "@/data/products";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/store/account-store";

export function formatAdminPrice(value: number) {
  return formatPrice(value);
}

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export function orderStatusLabel(status: OrderStatus) {
  return ORDER_STATUS_LABELS[status];
}

export function formatAdminDate(date: string) {
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
