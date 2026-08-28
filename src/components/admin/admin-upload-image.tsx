"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type AdminUploadImageProps = {
  src: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  objectFit?: "contain" | "cover";
};

/** Превью для админки: uploads без _next/image (иначе 400), статика через next/image */
export function AdminUploadImage({
  src,
  alt = "",
  className,
  fill,
  sizes = "160px",
  objectFit = "contain",
}: AdminUploadImageProps) {
  const [failed, setFailed] = useState(false);
  const fitClass = objectFit === "cover" ? "object-cover" : "object-contain";

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-cream text-[10px] tracking-wide text-grey uppercase",
          fill && "absolute inset-0",
          className,
        )}
      >
        Нет превью
      </div>
    );
  }

  if (src.startsWith("/uploads/")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn(fill && "absolute inset-0 h-full w-full", fitClass, className)}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      unoptimized={src.startsWith("/videos/")}
      className={cn(fitClass, className)}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}
