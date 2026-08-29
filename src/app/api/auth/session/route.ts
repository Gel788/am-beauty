import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const customer = await getCustomerSession();
  return NextResponse.json({ customer });
}
