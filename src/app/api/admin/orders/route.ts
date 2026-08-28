import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";
import { revalidateStorefront } from "@/lib/admin/revalidate-storefront";
import { sortOrdersNewestFirst } from "@/lib/orders/create-order";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ orders: sortOrdersNewestFirst(db.orders) });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as {
    id: string;
    status?: string;
    trackingNumber?: string;
  };

  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    const order = data.orders.find((o) => o.id === body.id);
    if (!order) return;
    if (body.status) order.status = body.status as typeof order.status;
    if (body.trackingNumber !== undefined) order.trackingNumber = body.trackingNumber;
  });

  const order = db.orders.find((o) => o.id === body.id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  revalidateStorefront();
  return NextResponse.json({ order });
}
