import { NextResponse } from "next/server";
import { listAdminCustomers, readDb } from "@/lib/admin/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ customers: listAdminCustomers(db) });
}
