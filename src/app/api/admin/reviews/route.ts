import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ reviews: db.reviews });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as { id: string; published?: boolean };

  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const db = await updateDb((data) => {
    const review = data.reviews.find((r) => r.id === body.id);
    if (!review) return;
    if (body.published !== undefined) review.published = body.published;
  });

  const review = db.reviews.find((r) => r.id === body.id);
  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({ review });
}
