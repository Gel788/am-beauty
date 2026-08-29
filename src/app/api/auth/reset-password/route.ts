import { NextResponse } from "next/server";
import { resetPasswordWithToken } from "@/lib/customer/accounts";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string; password?: string };
    const token = body.token?.trim() ?? "";
    const password = body.password ?? "";

    if (!token || !password) {
      return NextResponse.json({ error: "Укажите новый пароль" }, { status: 400 });
    }

    const result = await resetPasswordWithToken(token, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Не удалось сменить пароль" }, { status: 500 });
  }
}
