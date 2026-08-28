import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { NextResponse } from "next/server";
import path from "node:path";
import { normalizeMediaSrc } from "@/lib/admin/media-url";
import { isOptimizableImageSrc } from "@/lib/admin/image-paths";
import { isSupportedImageExt, resolveOptimizableImagePath } from "@/lib/admin/image-resolve.server";
import { parseRequestedWidth, resizeForDelivery } from "@/lib/admin/image-process";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = normalizeMediaSrc(searchParams.get("src") ?? "");
  const width = parseRequestedWidth(searchParams.get("w"), 1200);
  const quality = Math.min(Math.max(Number.parseInt(searchParams.get("q") ?? "82", 10) || 82, 40), 95);

  if (!isOptimizableImageSrc(src)) {
    return NextResponse.json({ error: "Invalid src" }, { status: 400 });
  }

  const resolved = resolveOptimizableImagePath(src);
  if (!resolved) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const ext = path.extname(resolved.relative).toLowerCase();
  if (!isSupportedImageExt(ext)) {
    return NextResponse.json({ error: "Not an image" }, { status: 400 });
  }

  if (!existsSync(resolved.absolute)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const input = await readFile(resolved.absolute);
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
