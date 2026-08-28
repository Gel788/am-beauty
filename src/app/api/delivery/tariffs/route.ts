import { NextResponse } from "next/server";
import { calculateTariffs, estimateCartWeightGrams } from "@/lib/delivery";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      city?: string;
      postalCode?: string;
      weightGrams?: number;
      dimensions?: { length: number; width: number; height: number };
      subtotal?: number;
      itemCount?: number;
    };

    const city = body.city?.trim();
    if (!city) {
      return NextResponse.json({ error: "Укажите город" }, { status: 400 });
    }

    const weightGrams =
      body.weightGrams && body.weightGrams > 0
        ? body.weightGrams
        : estimateCartWeightGrams(body.itemCount ?? 1);

    const subtotal = typeof body.subtotal === "number" ? body.subtotal : 0;

    const tariffs = await calculateTariffs({
      city,
      postalCode: body.postalCode,
      weightGrams,
      dimensions: body.dimensions,
      subtotal,
    });

    return NextResponse.json({ tariffs });
  } catch {
    return NextResponse.json({ error: "Не удалось рассчитать доставку" }, { status: 500 });
  }
}
