import { NextResponse } from "next/server";
import { updateCustomerProfile } from "@/lib/customer/accounts";
import { getCustomerSession, setCustomerSession } from "@/lib/customer/session";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request) {
  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json({ error: "Требуется вход в аккаунт" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
    };

    const result = await updateCustomerProfile(session.email, body);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (result.emailChanged) {
      await setCustomerSession(result.customer.email);
    }

    return NextResponse.json({
      customer: result.customer,
      emailChanged: result.emailChanged,
    });
  } catch {
    return NextResponse.json({ error: "Не удалось сохранить профиль" }, { status: 500 });
  }
}
