import { NextResponse } from "next/server";
import { readDb } from "@/lib/admin/db";
import { adminOrderToAccount } from "@/lib/orders/account-orders";
import { sortOrdersNewestFirst } from "@/lib/orders/create-order";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  const orderId = searchParams.get("orderId")?.trim();

  if (!email && !orderId) {
    return NextResponse.json({ error: "email or orderId required" }, { status: 400 });
  }

  const db = await readDb();
  let orders = db.orders;

  if (email) {
    orders = orders.filter((o) => o.customerEmail.toLowerCase() === email);
  }
  if (orderId) {
    orders = orders.filter((o) => o.id === orderId);
  }

  return NextResponse.json({
    orders: sortOrdersNewestFirst(orders).map(adminOrderToAccount),
  });
}
