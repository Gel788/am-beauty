import { existsSync } from "node:fs";
import { chmod, mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { MediaFile, MediaKind } from "@/lib/admin/media-types";
import { urlToMediaPath } from "@/lib/admin/media-types";

export type { MediaFile, MediaKind } from "@/lib/admin/media-types";

const IMAGE_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const VIDEO_MIME = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/avif": ".avif",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

export function getMediaRoot() {
  if (process.env.MEDIA_DIR) return path.resolve(process.env.MEDIA_DIR);
  const cwd = process.cwd();
  const appRoot = path.join(cwd, "..", "..", "public", "uploads");
  if (existsSync(path.join(cwd, "..", "..", "public"))) return appRoot;
  return path.join(cwd, "public", "uploads");
}

function safeName(original: string) {
  const base = path
    .basename(original)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  const stamp = Date.now();
  const rand = randomBytes(4).toString("hex");
  const ext = path.extname(base).toLowerCase().slice(0, 8);
  const stem = path.basename(base, path.extname(base)).slice(0, 40) || "file";
  return `${stem}-${stamp}-${rand}${ext}`;
}

function kindFromMime(mime: string): MediaKind | null {
  if (IMAGE_MIME.has(mime)) return "image";
  if (VIDEO_MIME.has(mime)) return "video";
  return null;
}

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO_EXT = new Set([".mp4", ".webm", ".mov"]);
const HEIC_EXT = new Set([".heic", ".heif"]);

function kindFromFile(file: File): MediaKind | "heic" | null {
  const fromMime = kindFromMime(file.type);
  if (fromMime) return fromMime;

  const ext = path.extname(file.name).toLowerCase();
  if (HEIC_EXT.has(ext)) return "heic";
  if (IMAGE_EXT.has(ext)) return "image";
  if (VIDEO_EXT.has(ext)) return "video";
  return null;
}

function mimeFromFile(file: File, kind: MediaKind) {
  if (file.type && (IMAGE_MIME.has(file.type) || VIDEO_MIME.has(file.type))) {
    return file.type;
  }
  const ext = path.extname(file.name).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".avif": "image/avif",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
  };
  return map[ext] ?? (kind === "image" ? "image/jpeg" : "video/mp4");
}

export function validateUpload(file: File, accept?: MediaKind) {
  const kind = kindFromFile(file);
  if (kind === "heic") {
    return {
      ok: false as const,
      error: "HEIC не поддерживается — сохраните фото как JPG или PNG",
    };
  }
  if (!kind) {
    return { ok: false as const, error: "Неподдерживаемый формат файла" };
  }
  if (accept && kind !== accept) {
    return { ok: false as const, error: accept === "image" ? "Нужно изображение" : "Нужно видео" };
  }
  const max = kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > max) {
    const mb = Math.round(max / (1024 * 1024));
    return { ok: false as const, error: `Файл больше ${mb} МБ` };
  }
  return { ok: true as const, kind };
}

export async function ensureMediaDirs() {
  const root = getMediaRoot();
  await mkdir(path.join(root, "images"), { recursive: true });
  await mkdir(path.join(root, "videos"), { recursive: true });
  return root;
}

export async function saveUpload(file: File): Promise<MediaFile> {
  const check = validateUpload(file);
  if (!check.ok) throw new Error(check.error);

  const root = await ensureMediaDirs();
  const folder = check.kind === "image" ? "images" : "videos";
  const mime = mimeFromFile(file, check.kind);
  const ext = EXT_BY_MIME[mime] || path.extname(file.name).toLowerCase() || "";
  const filename = safeName(file.name || `upload${ext}`);
  const relative = `${folder}/${filename}`;
  const absolute = path.join(root, relative);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolute, buffer);
  await chmod(absolute, 0o644);

  const st = await stat(absolute);
  return {
    url: `/uploads/${relative}`,
    path: relative,
    name: filename,
    kind: check.kind,
    size: st.size,
    updatedAt: st.mtime.toISOString(),
  };
}

async function readDirFiles(dir: string, kind: MediaKind): Promise<MediaFile[]> {
  const root = getMediaRoot();
  const absolute = path.join(root, dir);
  if (!existsSync(absolute)) return [];

  const names = await readdir(absolute);
  const files: MediaFile[] = [];

  for (const name of names) {
    if (name.startsWith(".")) continue;
    const filePath = path.join(absolute, name);
    const st = await stat(filePath);
    if (!st.isFile()) continue;
    const relative = `${dir}/${name}`;
    files.push({
      url: `/uploads/${relative}`,
      path: relative,
      name,
      kind,
      size: st.size,
      updatedAt: st.mtime.toISOString(),
    });
  }

  return files;
}

export async function listMedia(filter?: MediaKind): Promise<MediaFile[]> {
  const images = filter === "video" ? [] : await readDirFiles("images", "image");
  const videos = filter === "image" ? [] : await readDirFiles("videos", "video");
  return [...images, ...videos].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export function resolveMediaPath(relativePath: string) {
  const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  if (!normalized.startsWith("images/") && !normalized.startsWith("videos/")) {
    throw new Error("Invalid path");
  }
  const root = getMediaRoot();
  const absolute = path.join(root, normalized);
  if (!absolute.startsWith(root)) throw new Error("Invalid path");
  return { absolute, normalized };
}

export async function deleteMedia(relativePath: string) {
  const { absolute } = resolveMediaPath(relativePath);
  if (!existsSync(absolute)) return false;
  await unlink(absolute);
  return true;
}

export { urlToMediaPath };
