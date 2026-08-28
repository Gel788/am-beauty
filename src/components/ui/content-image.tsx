"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { normalizeMediaSrc } from "@/lib/admin/media-url";

type ContentImageProps = {
  src: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  objectFit?: "contain" | "cover";
  priority?: boolean;
};

function isUploadImagePath(src: string) {
  return src.startsWith("/uploads/images/");
}

function isDirectMediaPath(src: string) {
  return src.startsWith("/uploads/") || src.startsWith("/videos/");
}

function widthFromSizes(sizes?: string, fallback = 1200) {
  if (!sizes) return fallback;
  const vw = sizes.match(/(\d+)vw/);
  if (vw) {
    const viewport = typeof window !== "undefined" ? window.innerWidth : 1280;
    return Math.min(Math.round((Number(vw[1]) / 100) * viewport), 2000);
  }
  const px = sizes.match(/(\d+)px/);
  if (px) return Math.min(Number(px[1]), 2000);
  return fallback;
}

function optimizedUploadUrl(src: string, width: number) {
  return `/api/image?src=${encodeURIComponent(src)}&w=${width}`;
}

/** Локальные upload-фото через /api/image (авто-размер), видео — напрямую, /images — next/image */
export function ContentImage({
  src,
  alt = "",
  className,
  fill,
  sizes = "160px",
  width: widthProp,
  objectFit = "contain",
  priority,
}: ContentImageProps) {
  const [failed, setFailed] = useState(false);
  const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";
  const resolvedSrc = normalizeMediaSrc(src);

  const deliveryWidth = useMemo(
    () => widthProp ?? widthFromSizes(sizes, 1200),
    [widthProp, sizes],
  );

  if (!resolvedSrc || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-cream text-[10px] tracking-wide text-grey uppercase",
          fill && "absolute inset-0",
          className,
        )}
      >
        Нет фото
      </div>
    );
  }

  if (isUploadImagePath(resolvedSrc)) {
    const deliverySrc = optimizedUploadUrl(resolvedSrc, deliveryWidth);
    const srcSet = [
      `${optimizedUploadUrl(resolvedSrc, Math.round(deliveryWidth * 0.5))} ${Math.round(deliveryWidth * 0.5)}w`,
      `${optimizedUploadUrl(resolvedSrc, deliveryWidth)} ${deliveryWidth}w`,
      `${optimizedUploadUrl(resolvedSrc, Math.min(deliveryWidth * 2, 2000))} ${Math.min(deliveryWidth * 2, 2000)}w`,
    ].join(", ");

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={deliverySrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(
          fill && "absolute inset-0 h-full w-full",
          fitClass,
          "object-center",
          className,
        )}
        onError={() => setFailed(true)}
      />
    );
  }

  if (isDirectMediaPath(resolvedSrc)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={cn(fill && "absolute inset-0 h-full w-full", fitClass, "object-center", className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill={fill}
      priority={priority}
      className={cn(fitClass, "object-center", className)}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
