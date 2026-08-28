import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { getMediaRoot } from "@/lib/admin/media-storage";
import { normalizeMediaSrc } from "@/lib/admin/media-url";
import { parseRequestedWidth, resizeForDelivery } from "@/lib/admin/image-process";
import path from "node:path";
import { existsSync } from "node:fs";

export const dynamic = "force-dynamic";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = normalizeMediaSrc(searchParams.get("src") ?? "");
  const width = parseRequestedWidth(searchParams.get("w"), 1200);
  const quality = Math.min(Math.max(Number.parseInt(searchParams.get("q") ?? "82", 10) || 82, 40), 95);

  if (!src.startsWith("/uploads/images/")) {
    return NextResponse.json({ error: "Invalid src" }, { status: 400 });
  }

  const relative = src.replace(/^\/uploads\//, "");
  const ext = path.extname(relative).toLowerCase();
  if (!IMAGE_EXT.has(ext)) {
    return NextResponse.json({ error: "Not an image" }, { status: 400 });
  }

  const absolute = path.join(getMediaRoot(), relative);
  if (!absolute.startsWith(getMediaRoot()) || !existsSync(absolute)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const input = await readFile(absolute);
    const { buffer, mime } = await resizeForDelivery(input, width, quality);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
