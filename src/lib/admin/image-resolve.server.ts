import { existsSync } from "node:fs";
import path from "node:path";
import { getMediaRoot } from "@/lib/admin/media-storage";

const IMAGE_EXT = [".webp", ".jpg", ".jpeg", ".png", ".avif", ".gif"] as const;

export function getAppRoot() {
  const cwd = process.cwd();
  if (existsSync(path.join(cwd, "package.json"))) return cwd;
  if (existsSync(path.join(cwd, "..", "package.json"))) return path.join(cwd, "..");
  return cwd;
}

function resolveWithFallback(baseDir: string, relative: string) {
  const absolute = path.join(baseDir, relative);
  if (!absolute.startsWith(baseDir)) return null;
  if (existsSync(absolute)) return { absolute, relative };

  const parsed = path.parse(relative);
  if (!parsed.ext) return null;

  for (const ext of IMAGE_EXT) {
    if (ext === parsed.ext.toLowerCase()) continue;
    const altRelative = path.join(parsed.dir, `${parsed.name}${ext}`);
    const altAbsolute = path.join(baseDir, altRelative);
    if (altAbsolute.startsWith(baseDir) && existsSync(altAbsolute)) {
      return { absolute: altAbsolute, relative: altRelative };
    }
  }

  return null;
}

export function resolveOptimizableImagePath(src: string) {
  if (src.startsWith("/uploads/images/")) {
    const relative = src.replace(/^\/uploads\//, "");
    const root = getMediaRoot();
    return resolveWithFallback(root, relative);
  }

  if (src.startsWith("/images/")) {
    const relative = src.replace(/^\//, "");
    const publicRoot = path.join(getAppRoot(), "public");
    return resolveWithFallback(publicRoot, relative);
  }

  return null;
}

export function isSupportedImageExt(ext: string) {
  return IMAGE_EXT.includes(ext.toLowerCase() as (typeof IMAGE_EXT)[number]);
}
