import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";
import { createPayment } from "@/lib/payment";
import { computeOrderTotals } from "@/lib/orders/compute-order";
import {
  sortOrdersNewestFirst,
  toAdminOrder,
  validateCreateOrderInput,
} from "@/lib/orders/create-order";
import { normalizePhone } from "@/lib/phone";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateCreateOrderInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const computed = await computeOrderTotals(parsed.data);
    if (!computed.ok) {
      return NextResponse.json({ error: computed.error }, { status: 400 });
    }

    const input = computed.data;
    const existing = (await readDb()).orders.find((o) => o.id === input.id);
    if (existing) {
      const payment = await createPayment({
        orderId: existing.id,
        amount: existing.total,
        description: `Заказ AM Beauty ${existing.id}`,
        returnUrl: inputReturnUrl(request, existing.id),
      });
      if (!payment.ok) {
        return NextResponse.json({ error: payment.error }, { status: 502 });
      }
      return NextResponse.json({ order: existing, redirectUrl: payment.redirectUrl, duplicate: true });
    }

    const order = toAdminOrder(input);

    await updateDb((data) => {
      data.orders.unshift(order);
      for (const item of order.items) {
        const product = data.products.find((p) => p.slug === item.slug);
        if (product) {
          product.stock = Math.max(0, product.stock - item.qty);
        }
      }
      if (order.promoCode) {
        const promo = data.promos.find(
          (p) => p.code.toLowerCase() === order.promoCode!.toLowerCase(),
        );
        if (promo) promo.uses += 1;
      }
    });

    const payment = await createPayment({
      orderId: order.id,
      amount: order.total,
      description: `Заказ AM Beauty ${order.id}`,
      returnUrl: inputReturnUrl(request, order.id),
    });

    if (!payment.ok) {
      return NextResponse.json({ error: payment.error }, { status: 502 });
    }

    return NextResponse.json({ order, redirectUrl: payment.redirectUrl }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Не удалось создать заказ" }, { status: 500 });
  }
}

function inputReturnUrl(request: Request, orderId: string) {
  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return `${origin}/checkout/success?order=${encodeURIComponent(orderId)}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id")?.trim();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!id || !email) {
    return NextResponse.json({ error: "id and email required" }, { status: 400 });
  }

  const db = await readDb();
  const order = db.orders.find(
    (o) => o.id === id && o.customerEmail.toLowerCase() === email,
  );
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
