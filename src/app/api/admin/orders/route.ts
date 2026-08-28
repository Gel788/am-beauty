import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ orders: db.orders });
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

  return NextResponse.json({ order });
}
