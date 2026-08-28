import { NextResponse } from "next/server";
import { readDb, updateDb } from "@/lib/admin/db";
import { mergeSiteSettings } from "@/lib/admin/site-merge";
import type { AdminSiteSettings } from "@/lib/admin/types";

export async function GET() {
  const db = await readDb();
  return NextResponse.json({ site: db.site });
}

export async function PATCH(request: Request) {
  const body = (await request.json()) as Partial<AdminSiteSettings>;
  const db = await updateDb((data) => {
    data.site = mergeSiteSettings({ ...data.site, ...body });
  });
  return NextResponse.json({ site: db.site });
}
