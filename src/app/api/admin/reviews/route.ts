import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";
import type { AdminReview } from "@/lib/admin/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ reviews: db.reviews });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<AdminReview>;
  if (!body.productSlug || !body.author?.trim() || !body.text?.trim()) {
    return NextResponse.json({ error: "productSlug, author, text required" }, { status: 400 });
  }

  const id = body.id ?? `r-${Date.now()}`;
  const productSlug = body.productSlug;
  const db = await updateDb((data) => {
    data.reviews.unshift({
      id,
      productSlug,
      author: body.author!.trim(),
      rating: body.rating ?? 5,
      text: body.text!.trim(),
      date: body.date ?? new Date().toISOString().slice(0, 10),
      published: body.published ?? true,
    });
  });

  return NextResponse.json({ review: db.reviews.find((r) => r.id === id) }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Partial<AdminReview> & { id: string };
  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    const review = data.reviews.find((r) => r.id === body.id);
    if (!review) return;
    Object.assign(review, {
      ...body,
      id: review.id,
    });
  });

  const review = db.reviews.find((r) => r.id === body.id);
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ review });
}

export async function DELETE(request: Request) {
  const body = (await request.json()) as { id: string };
  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  await updateDb((data) => {
    data.reviews = data.reviews.filter((r) => r.id !== body.id);
  });

  return NextResponse.json({ ok: true });
}
