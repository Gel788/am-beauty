import { NextResponse } from "next/server";
import { readDb } from "@/lib/admin/db";
import { getCustomerSession } from "@/lib/customer/session";
import { adminOrderToAccount } from "@/lib/orders/account-orders";
import { sortOrdersNewestFirst } from "@/lib/orders/create-order";
import { normalizePhone } from "@/lib/phone";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId")?.trim();
  const session = await getCustomerSession();

  let email = searchParams.get("email")?.trim().toLowerCase() ?? "";
  let phone = searchParams.get("phone") ?? "";

  if (session) {
    email = session.email;
    phone = session.phone;
  }

  if (!email || !phone) {
    return NextResponse.json({ error: "email and phone required" }, { status: 400 });
  }

  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length < 10) {
    return NextResponse.json({ error: "invalid phone" }, { status: 400 });
  }

  const db = await readDb();
  let orders = db.orders.filter(
    (o) =>
      o.customerEmail.toLowerCase() === email &&
      normalizePhone(o.customerPhone) === normalizedPhone,
  );

  if (orderId) {
    orders = orders.filter((o) => o.id === orderId);
  }

  return NextResponse.json({
    orders: sortOrdersNewestFirst(orders).map(adminOrderToAccount),
  });
}
