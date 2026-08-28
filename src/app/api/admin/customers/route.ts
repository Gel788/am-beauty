import { NextResponse } from "next/server";
import { deriveCustomers, readDb } from "@/lib/admin/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ customers: deriveCustomers(db.orders) });
}
