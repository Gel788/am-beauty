export const FREE_SHIPPING_THRESHOLD = 7500;
export const SHIPPING_COST = 390;

export function shippingRemaining(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

export function shippingProgress(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
}

export function hasFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}
