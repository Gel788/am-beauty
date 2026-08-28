import { existsSync } from "node:fs";
import { chmod, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { readDb, writeDb } from "@/lib/admin/db";
import type { AdminDatabase } from "@/lib/admin/types";
import { getAppRoot } from "@/lib/admin/image-resolve.server";
import { processUploadImage } from "@/lib/admin/image-process";
import { getMediaRoot } from "@/lib/admin/media-storage";

const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".avif", ".webp", ".heif", ".heic"]);

export type ReprocessResult = {
  scanned: number;
  converted: number;
  skipped: number;
  urlUpdates: number;
  errors: string[];
};

type ImageSource = {
  label: string;
  dir: string;
  urlPrefix: string;
};

async function needsReprocess(absolute: string) {
  const ext = path.extname(absolute).toLowerCase();
  if (!IMAGE_EXT.has(ext)) return false;

  try {
    const meta = await sharp(absolute).metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    const { size } = await stat(absolute);

    if (ext === ".webp" && width <= 1600 && height <= 1600 && size < 900_000) {
      return false;
    }

    if (ext === ".png" && meta.hasAlpha && width <= 1600 && height <= 1600 && size < 1_200_000) {
      return false;
    }

    return (
      width > 1600 ||
      height > 1600 ||
      ext === ".jpeg" ||
      ext === ".jpg" ||
      ext === ".heic" ||
      ext === ".heif" ||
      size > 1_500_000
    );
  } catch {
    return true;
  }
}

function replaceUrlsInValue(value: unknown, map: Map<string, string>): unknown {
  if (typeof value === "string") {
    return map.get(value) ?? value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => replaceUrlsInValue(item, map));
  }
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      next[key] = replaceUrlsInValue(item, map);
    }
    return next;
  }
  return value;
}

function countUrlUpdates(before: AdminDatabase, map: Map<string, string>) {
  if (map.size === 0) return 0;
  let count = 0;
  const beforeJson = JSON.stringify(before);
  for (const [from, to] of map) {
    if (from !== to && beforeJson.includes(from)) count += 1;
  }
  return count;
}

function getImageSources(): ImageSource[] {
  const uploadsDir = path.join(getMediaRoot(), "images");
  const staticDir = path.join(getAppRoot(), "public", "images");
  return [
    { label: "uploads", dir: uploadsDir, urlPrefix: "/uploads/images" },
    { label: "static", dir: staticDir, urlPrefix: "/images" },
  ];
}

async function reprocessDirectory(source: ImageSource, result: ReprocessResult, urlMap: Map<string, string>) {
  if (!existsSync(source.dir)) return;

  const names = await readdir(source.dir);

  for (const name of names) {
    if (name.startsWith(".")) continue;
    const absolute = path.join(source.dir, name);
    const st = await stat(absolute);
    if (!st.isFile()) continue;

    const ext = path.extname(name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;

    result.scanned += 1;
    const oldUrl = `${source.urlPrefix}/${name}`;

    try {
      if (!(await needsReprocess(absolute))) {
        result.skipped += 1;
        continue;
      }

      const input = await readFile(absolute);
      const processed = await processUploadImage(input);
      const stem = name.replace(/\.[^.]+$/, "");
      const newName = `${stem}${processed.extension}`;
      const newAbsolute = path.join(source.dir, newName);
      const newUrl = `${source.urlPrefix}/${newName}`;

      await writeFile(newAbsolute, processed.buffer);
      await chmod(newAbsolute, 0o644);

      if (newAbsolute !== absolute) {
        await unlink(absolute);
      }

      if (oldUrl !== newUrl) {
        urlMap.set(oldUrl, newUrl);
      }

      result.converted += 1;
    } catch (err) {
      result.errors.push(`${source.label}/${name}: ${err instanceof Error ? err.message : "error"}`);
    }
  }
}

export async function reprocessAllUploadImages(): Promise<ReprocessResult> {
  const result: ReprocessResult = {
    scanned: 0,
    converted: 0,
    skipped: 0,
    urlUpdates: 0,
    errors: [],
  };

  const urlMap = new Map<string, string>();

  for (const source of getImageSources()) {
    await reprocessDirectory(source, result, urlMap);
  }

  if (urlMap.size > 0) {
    const db = await readDb();
    const before = structuredClone(db);
    const updated = replaceUrlsInValue(db, urlMap) as AdminDatabase;
    result.urlUpdates = countUrlUpdates(before, urlMap);
    await writeDb(updated);
  }

  return result;
}
