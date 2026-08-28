import { NextResponse } from "next/server";
import { computeDashboardStats, readDb } from "@/lib/admin/db";

export async function GET() {
  const db = await readDb();
  const stats = computeDashboardStats(db);
  return NextResponse.json({ stats, updatedAt: db.updatedAt });
}
