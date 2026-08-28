import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ promos: db.promos });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { code: string; active?: boolean };

  if (!body.code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    const promo = data.promos.find((p) => p.code === body.code);
    if (!promo) return;
    if (body.active !== undefined) promo.active = body.active;
  });

  const promo = db.promos.find((p) => p.code === body.code);
  if (!promo) {
    return NextResponse.json({ error: "Promo not found" }, { status: 404 });
  }

  return NextResponse.json({ promo });
}
