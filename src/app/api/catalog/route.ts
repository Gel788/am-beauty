import { NextResponse } from "next/server";
import { getPublicCatalog } from "@/lib/catalog/runtime";

export async function GET() {
  const catalog = await getPublicCatalog();
  return NextResponse.json(catalog);
}
