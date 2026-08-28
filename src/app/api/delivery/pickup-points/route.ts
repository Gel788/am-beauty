import { NextResponse } from "next/server";
import { listPickupPoints, type DeliveryCarrier } from "@/lib/delivery";

const VALID_CARRIERS: DeliveryCarrier[] = ["cdek", "russian_post", "yandex"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const carrier = searchParams.get("carrier") as DeliveryCarrier | null;
    const city = searchParams.get("city")?.trim();

    if (!carrier || !VALID_CARRIERS.includes(carrier)) {
      return NextResponse.json({ error: "Укажите carrier: cdek | russian_post | yandex" }, { status: 400 });
    }

    if (!city) {
      return NextResponse.json({ error: "Укажите город" }, { status: 400 });
    }

    const postalCode = searchParams.get("postalCode") ?? undefined;
    const points = await listPickupPoints({ carrier, city, postalCode });

    return NextResponse.json({ points });
  } catch {
    return NextResponse.json({ error: "Не удалось загрузить пункты выдачи" }, { status: 500 });
  }
}
