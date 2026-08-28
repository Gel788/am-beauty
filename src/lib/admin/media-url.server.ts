import { existsSync } from "node:fs";
import path from "node:path";
import { normalizeMediaSrc } from "@/lib/admin/media-url";

export function mediaFileExists(url: string) {
  const normalized = normalizeMediaSrc(url);
  if (!normalized.startsWith("/uploads/") && !normalized.startsWith("/images/") && !normalized.startsWith("/videos/")) {
    return true;
  }
  const absolute = path.join(process.cwd(), "public", normalized);
  return existsSync(absolute);
}

export function assertMediaFilesExist(urls: string[]) {
  const missing = urls
    .map(normalizeMediaSrc)
    .filter((url) => url && !mediaFileExists(url));
  if (missing.length) {
    throw new Error(`IMAGE_NOT_FOUND:${missing[0]}`);
  }
}
