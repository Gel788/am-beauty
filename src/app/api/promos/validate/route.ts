import { NextResponse } from "next/server";
import { readDb } from "@/lib/admin/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string };
    const code = body.code?.trim();
    if (!code) {
      return NextResponse.json({ valid: false, error: "Введите промокод" }, { status: 400 });
    }

    const db = await readDb();
    const promo = db.promos.find(
      (p) => p.active && p.code.toLowerCase() === code.toLowerCase(),
    );

    if (!promo) {
      return NextResponse.json({ valid: false, error: "Промокод недействителен" });
    }

    return NextResponse.json({
      valid: true,
      code: promo.code,
      discountPercent: promo.discountPercent,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Не удалось проверить промокод" }, { status: 500 });
  }
}
