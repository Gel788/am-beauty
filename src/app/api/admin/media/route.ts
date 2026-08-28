import { NextResponse } from "next/server";
import {
  deleteMedia,
  listMedia,
  saveUpload,
  urlToMediaPath,
  type MediaKind,
} from "@/lib/admin/media-storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as MediaKind | null;
  const files = await listMedia(type ?? undefined);
  return NextResponse.json({ files });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file required" }, { status: 400 });
    }

    const saved = await saveUpload(file);
    return NextResponse.json({ file: saved }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as { path?: string; url?: string };
    const relative = body.path ?? (body.url ? urlToMediaPath(body.url) : null);
    if (!relative) {
      return NextResponse.json({ error: "path or url required" }, { status: 400 });
    }

    const ok = await deleteMedia(relative);
    if (!ok) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
