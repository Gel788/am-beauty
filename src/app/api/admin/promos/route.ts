import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";
import type { AdminPromo } from "@/lib/admin/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ promos: db.promos });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<AdminPromo>;
  const code = body.code?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    if (data.promos.some((p) => p.code === code)) throw new Error("exists");
    data.promos.push({
      code,
      discountPercent: body.discountPercent ?? 0.1,
      active: body.active ?? true,
      uses: 0,
    });
  }).catch(() => null);

  if (!db) {
    return NextResponse.json({ error: "Promo exists" }, { status: 409 });
  }

  return NextResponse.json({ promo: db.promos.find((p) => p.code === code) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Partial<AdminPromo> & { code: string };
  if (!body.code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    const promo = data.promos.find((p) => p.code === body.code);
    if (!promo) return;
    if (body.discountPercent !== undefined) promo.discountPercent = body.discountPercent;
    if (body.active !== undefined) promo.active = body.active;
    if (body.uses !== undefined) promo.uses = body.uses;
  });

  const promo = db.promos.find((p) => p.code === body.code);
  if (!promo) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ promo });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { code: string };
  if (!body.code) {
    return NextResponse.json({ error: "code required" }, { status: 400 });
  }

  await updateDb((data) => {
    data.promos = data.promos.filter((p) => p.code !== body.code);
  });

  return NextResponse.json({ ok: true });
}
