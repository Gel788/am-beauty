import { NextResponse } from "next/server";
import { getPublicCatalog } from "@/lib/catalog/runtime";

export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getPublicCatalog();
  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
