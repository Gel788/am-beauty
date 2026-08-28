"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type VideoMode = "hover" | "always" | "off";

type ProductMediaProps = {
  src: string;
  alt: string;
  videoSrc?: string;
  videoMode?: VideoMode;
  videoControls?: boolean;
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
  videoMode,
  videoControls = false,
  priority,
  sizes = "50vw",
  className,
  aspect = "aspect-[3/4]",
  zoom = true,
  inset = "md",
  children,
}: ProductMediaProps) {
  const [hovering, setHovering] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mode: VideoMode = videoMode ?? (videoSrc ? "hover" : "off");
  const showVideo =
    mode === "always" ? videoReady : mode === "hover" && hovering && videoReady;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || mode === "off") return;

    if (mode === "always" || hovering) {
      void video.play().catch(() => {
        // autoplay blocked
      });
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [hovering, videoSrc, mode]);

  return (
    <div
      className={cn("relative overflow-hidden bg-cream", aspect, className)}
      onMouseEnter={() => mode === "hover" && setHovering(true)}
      onMouseLeave={() => mode === "hover" && setHovering(false)}
      onFocus={() => mode === "hover" && setHovering(true)}
      onBlur={() => mode === "hover" && setHovering(false)}
    >
      <div
        className={cn(
          "absolute transition-opacity duration-300 motion-reduce:transition-none",
          insetMap[inset],
          showVideo ? "opacity-0" : "opacity-100",
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

      {videoSrc && mode !== "off" ? (
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          controls={videoControls}
          preload="metadata"
          poster={src}
          aria-label={videoControls ? `Видео: ${alt}` : undefined}
          aria-hidden={!videoControls}
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
          className={cn(
            "absolute inset-0 size-full object-contain object-bottom transition-opacity duration-300 motion-reduce:transition-none",
            showVideo ? "opacity-100" : "opacity-0",
            videoControls && showVideo && "z-[1]",
          )}
        />
      ) : null}

      {children}
    </div>
  );
}
