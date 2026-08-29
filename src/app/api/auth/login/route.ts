import { NextResponse } from "next/server";
import { authenticateCustomer } from "@/lib/customer/accounts";
import { setCustomerSession } from "@/lib/customer/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim() ?? "";
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json({ error: "Укажите email и пароль" }, { status: 400 });
    }

    const customer = await authenticateCustomer(email, password);
    if (!customer) {
      return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
    }

    await setCustomerSession(customer.email);
    return NextResponse.json({ customer });
  } catch {
    return NextResponse.json({ error: "Не удалось войти" }, { status: 500 });
  }
}
