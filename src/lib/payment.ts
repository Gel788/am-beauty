export type PaymentProvider = "yookassa" | "robokassa";

export type PaymentIntent = {
  orderId: string;
  amount: number;
  description: string;
  returnUrl: string;
};

export type PaymentResult =
  | { ok: true; redirectUrl: string; provider: PaymentProvider }
  | { ok: false; error: string };

/**
 * Заглушка оплаты. Подключите YOOKASSA_SHOP_ID + YOOKASSA_SECRET_KEY
 * или ROBOKASSA_LOGIN + ROBOKASSA_PASSWORD в .env для продакшена.
 */
export async function createPayment(intent: PaymentIntent): Promise<PaymentResult> {
  const hasYooKassa = Boolean(
    process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY,
  );
  const hasRobokassa = Boolean(
    process.env.ROBOKASSA_LOGIN && process.env.ROBOKASSA_PASSWORD,
  );

  if (!hasYooKassa && !hasRobokassa) {
    return {
      ok: true,
      provider: "yookassa",
      redirectUrl: `/checkout/success?order=${intent.orderId}&demo=1`,
    };
  }

  // Production: integrate real API here
  return {
    ok: true,
    provider: hasYooKassa ? "yookassa" : "robokassa",
    redirectUrl: `/checkout/success?order=${intent.orderId}`,
  };
}
