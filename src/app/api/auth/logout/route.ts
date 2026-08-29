import { NextResponse } from "next/server";
import { clearCustomerSession } from "@/lib/customer/session";

export const dynamic = "force-dynamic";

export async function POST() {
  await clearCustomerSession();
  return NextResponse.json({ ok: true });
}
