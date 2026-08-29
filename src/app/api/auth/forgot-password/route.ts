import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/customer/accounts";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email?.trim() ?? "";
    if (!email) {
      return NextResponse.json({ error: "Укажите email" }, { status: 400 });
    }

    await requestPasswordReset(email);

    return NextResponse.json({
      ok: true,
      message: "Если аккаунт существует, мы отправили ссылку для восстановления пароля",
    });
  } catch {
    return NextResponse.json({ error: "Не удалось отправить письмо" }, { status: 500 });
  }
}
