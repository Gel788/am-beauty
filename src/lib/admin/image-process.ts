import sharp from "sharp";

const MAX_UPLOAD_EDGE = 1600;
const MAX_SERVE_EDGE = 2000;

export type ProcessedImage = {
  buffer: Buffer;
  width: number;
  height: number;
  extension: string;
  mime: string;
};

/** Нормализует загрузку: EXIF-поворот, вписывание в рамку, webp/png. */
export async function processUploadImage(input: Buffer): Promise<ProcessedImage> {
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
    const info = await sharp(buffer).metadata();
    return {
      buffer,
      width: info.width ?? MAX_UPLOAD_EDGE,
      height: info.height ?? MAX_UPLOAD_EDGE,
      extension: ".png",
      mime: "image/png",
    };
  }

  const buffer = await resized.webp({ quality: 86, effort: 4 }).toBuffer();
  const info = await sharp(buffer).metadata();
  return {
    buffer,
    width: info.width ?? MAX_UPLOAD_EDGE,
    height: info.height ?? MAX_UPLOAD_EDGE,
    extension: ".webp",
    mime: "image/webp",
  };
}

/** Отдача на витрине — ресайз по ширине без увеличения мелких файлов. */
export async function resizeForDelivery(input: Buffer, width: number, quality = 82) {
  const safeWidth = Math.min(Math.max(width, 64), MAX_SERVE_EDGE);
  const meta = await sharp(input).metadata();
  const hasAlpha = meta.hasAlpha;

  const pipeline = sharp(input)
    .rotate()
    .resize({ width: safeWidth, withoutEnlargement: true });

  if (hasAlpha) {
    const buffer = await pipeline.png({ compressionLevel: 9 }).toBuffer();
    return { buffer, mime: "image/png" as const };
  }

  const buffer = await pipeline.webp({ quality, effort: 4 }).toBuffer();
  return { buffer, mime: "image/webp" as const };
}

export function parseRequestedWidth(raw: string | null, fallback = 1200) {
  const width = Number.parseInt(raw ?? "", 10);
  if (!Number.isFinite(width) || width < 1) return fallback;
  return Math.min(width, MAX_SERVE_EDGE);
}
