#!/usr/bin/env node
/**
 * Пакетная обработка фото: public/uploads/images + public/images
 * ресайз, webp/png, обновление ссылок в admin-db.json
 *
 * Запуск: npm run reprocess:images
 */
import { existsSync } from "node:fs";
import { chmod, mkdir, readdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const MAX_UPLOAD_EDGE = 1600;
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".gif", ".avif", ".webp", ".heif", ".heic"]);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = process.env.APP_DIR
  ? path.resolve(process.env.APP_DIR)
  : path.join(scriptDir, "..");

const mediaRoot = process.env.MEDIA_DIR
  ? path.resolve(process.env.MEDIA_DIR)
  : path.join(appDir, "public", "uploads");

const dbDir = process.env.ADMIN_DB_DIR
  ? path.resolve(process.env.ADMIN_DB_DIR)
  : path.join(appDir, ".data");

const dbPath = path.join(dbDir, "admin-db.json");

const IMAGE_SOURCES = [
  { label: "uploads", dir: path.join(mediaRoot, "images"), urlPrefix: "/uploads/images" },
  { label: "static", dir: path.join(appDir, "public", "images"), urlPrefix: "/images" },
];

async function processUploadImage(input) {
  const image = sharp(input).rotate();
  const meta = await image.metadata();
  const hasAlpha = meta.hasAlpha;

  const resized = image.resize({
    width: MAX_UPLOAD_EDGE,
    height: MAX_UPLOAD_EDGE,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (hasAlpha) {
    const buffer = await resized.png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
    return { buffer, extension: ".png" };
  }

  const buffer = await resized.webp({ quality: 86, effort: 4 }).toBuffer();
  return { buffer, extension: ".webp" };
}

async function needsReprocess(absolute) {
  const ext = path.extname(absolute).toLowerCase();
  if (!IMAGE_EXT.has(ext)) return false;

  try {
    const meta = await sharp(absolute).metadata();
    const width = meta.width ?? 0;
    const height = meta.height ?? 0;
    const { size } = await stat(absolute);

    if (ext === ".webp" && width <= MAX_UPLOAD_EDGE && height <= MAX_UPLOAD_EDGE && size < 900_000) {
      return false;
    }

    if (ext === ".png" && meta.hasAlpha && width <= MAX_UPLOAD_EDGE && height <= MAX_UPLOAD_EDGE && size < 1_200_000) {
      return false;
    }

    return (
      width > MAX_UPLOAD_EDGE ||
      height > MAX_UPLOAD_EDGE ||
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

function replaceUrlsInValue(value, map) {
  if (typeof value === "string") return map.get(value) ?? value;
  if (Array.isArray(value)) return value.map((item) => replaceUrlsInValue(item, map));
  if (value && typeof value === "object") {
    const next = {};
    for (const [key, item] of Object.entries(value)) {
      next[key] = replaceUrlsInValue(item, map);
    }
    return next;
  }
  return value;
}

async function readDb() {
  const raw = await readFile(dbPath, "utf-8");
  return JSON.parse(raw);
}

async function writeDb(db) {
  await mkdir(dbDir, { recursive: true });
  db.updatedAt = new Date().toISOString();
  const json = JSON.stringify(db, null, 2);
  const tmp = `${dbPath}.${process.pid}.tmp`;
  await writeFile(tmp, json, "utf-8");
  await rename(tmp, dbPath);
}

async function reprocessDirectory(source, result, urlMap) {
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

async function main() {
  const result = {
    scanned: 0,
    converted: 0,
    skipped: 0,
    urlUpdates: 0,
    errors: [],
  };

  const urlMap = new Map();

  for (const source of IMAGE_SOURCES) {
    await reprocessDirectory(source, result, urlMap);
  }

  if (urlMap.size > 0 && existsSync(dbPath)) {
    const db = await readDb();
    const beforeJson = JSON.stringify(db);
    const updated = replaceUrlsInValue(db, urlMap);
    for (const [from, to] of urlMap) {
      if (from !== to && beforeJson.includes(from)) result.urlUpdates += 1;
    }
    await writeDb(updated);
  }

  return result;
}

const result = await main();
console.log(
  `reprocess-images: scanned=${result.scanned} converted=${result.converted} skipped=${result.skipped} urlUpdates=${result.urlUpdates}`,
);

if (result.errors.length > 0) {
  console.error("errors:");
  for (const line of result.errors) console.error(`  - ${line}`);
  process.exitCode = 1;
}
