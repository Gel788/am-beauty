"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { normalizeMediaSrc } from "@/lib/admin/media-url";

type ContentImageProps = {
  src: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  objectFit?: "contain" | "cover";
  priority?: boolean;
};

function isDirectMediaPath(src: string) {
  return src.startsWith("/uploads/") || src.startsWith("/videos/");
}

/** Локальные upload-файлы без _next/image (иначе 400), остальное через next/image */
export function ContentImage({
  src,
  alt = "",
  className,
  fill,
  sizes = "160px",
  objectFit = "contain",
  priority,
}: ContentImageProps) {
  const [failed, setFailed] = useState(false);
  const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";
  const resolvedSrc = normalizeMediaSrc(src);

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

  if (isDirectMediaPath(resolvedSrc)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt={alt}
        className={cn(fill && "absolute inset-0 h-full w-full", fitClass, className)}
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
      className={cn(fitClass, className)}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
