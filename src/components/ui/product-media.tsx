"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ProductMediaProps = {
  src: string;
  alt: string;
  videoSrc?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspect?: string;
  zoom?: boolean;
  inset?: "sm" | "md" | "lg";
  children?: ReactNode;
};

const insetMap = {
  sm: "inset-2 sm:inset-2.5",
  md: "inset-2.5 sm:inset-3.5 md:inset-5",
  lg: "inset-3 sm:inset-4 md:inset-6 lg:inset-8",
} as const;

export function ProductMedia({
  src,
  alt,
  videoSrc,
  priority,
  sizes = "50vw",
  className,
  aspect = "aspect-[3/4]",
  zoom = true,
  inset = "md",
  children,
}: ProductMediaProps) {
  const [active, setActive] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || !active) return;

    const play = async () => {
      try {
        await video.play();
      } catch {
        // autoplay blocked — остаётся постер
      }
    };

    void play();
    return () => {
      video.pause();
      video.currentTime = 0;
    };
  }, [active, videoSrc]);

  return (
    <div
      className={cn("relative overflow-hidden bg-cream", aspect, className)}
      onMouseEnter={() => videoSrc && setActive(true)}
      onMouseLeave={() => videoSrc && setActive(false)}
      onFocus={() => videoSrc && setActive(true)}
      onBlur={() => videoSrc && setActive(false)}
    >
      <div
        className={cn(
          "absolute transition-opacity duration-300 motion-reduce:transition-none",
          insetMap[inset],
          videoSrc && active && videoReady ? "opacity-0" : "opacity-100",
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-contain object-bottom", zoom && "img-zoom")}
        />
      </div>

      {videoSrc ? (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          preload="metadata"
          poster={src}
          aria-hidden
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
          className={cn(
            "absolute inset-0 size-full object-contain object-bottom transition-opacity duration-300 motion-reduce:transition-none",
            active && videoReady ? "opacity-100" : "opacity-0",
          )}
        />
      ) : null}

      {children}
    </div>
  );
}
