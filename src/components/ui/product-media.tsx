"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ContentImage } from "@/components/ui/content-image";
import { cn } from "@/lib/utils";

type VideoMode = "hover" | "always" | "off";

function videoMimeType(src: string) {
  const lower = src.toLowerCase();
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mov")) return "video/quicktime";
  return undefined;
}

type ProductMediaProps = {
  src: string;
  alt: string;
  videoSrc?: string;
  videoMode?: VideoMode;
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
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mode: VideoMode = videoMode ?? (videoSrc ? "hover" : "off");
  const showVideo =
    !videoFailed &&
    (mode === "always" ? videoReady : mode === "hover" && hovering && videoReady);

  useEffect(() => {
    setVideoReady(false);
    setVideoFailed(false);
  }, [videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || mode === "off" || videoFailed) return;

    if (mode === "always" || hovering) {
      void video.play().catch(() => {
        setVideoFailed(true);
      });
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [hovering, videoSrc, mode, videoFailed]);

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
        <ContentImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          objectFit="contain"
          className={cn("object-bottom", zoom && "img-zoom")}
        />
      </div>

      {videoSrc && mode !== "off" && !videoFailed ? (
        <video
          key={videoSrc}
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          autoPlay={mode === "always"}
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          preload="auto"
          poster={src}
          aria-hidden
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          onError={() => {
            setVideoFailed(true);
            setVideoReady(false);
          }}
          className={cn(
            "product-media-video pointer-events-none absolute inset-0 size-full border-0 object-contain object-bottom outline-none transition-opacity duration-300 motion-reduce:transition-none",
            showVideo ? "opacity-100" : "opacity-0",
          )}
        >
          {videoMimeType(videoSrc) ? (
            <source src={videoSrc} type={videoMimeType(videoSrc)} />
          ) : null}
        </video>
      ) : null}

      {children}
    </div>
  );
}
