"use client";

import { useState } from "react";
import { ContentImage } from "@/components/ui/content-image";
import { ViewTransition } from "react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  name?: string;
};

export function ProductGallery({ images, alt, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  const mainImage = (
    <div className="relative size-full">
      {images.map((src, i) => (
        <ContentImage
          key={src}
          src={src}
          alt={i === 0 ? alt : `${alt} — вид ${i + 1}`}
          fill
          priority={i === 0}
          objectFit="cover"
          sizes="(max-width: 1024px) 100vw, 55vw"
          className={cn(
            "transition-opacity duration-700 ease-out",
            i === active ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-24">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {name ? (
          <ViewTransition name={name} share="morph" default="none">
            {mainImage}
          </ViewTransition>
        ) : (
          mainImage
        )}

        {images.length > 1 ? (
          <div className="absolute bottom-4 left-4 z-10 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Фото ${i + 1}`}
                onClick={() => setActive(i)}
                className={cn(
                  "h-0.5 w-8 cursor-pointer transition-colors",
                  i === active ? "bg-white" : "bg-white/40"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative aspect-square cursor-pointer overflow-hidden bg-secondary",
                i === active ? "ring-2 ring-foreground ring-offset-2" : "opacity-70 hover:opacity-100"
              )}
            >
              <ContentImage src={src} alt="" fill objectFit="cover" sizes="120px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
