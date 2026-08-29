"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ContentImage } from "@/components/ui/content-image";
import { productVideoSources } from "@/lib/product-video";
import { cn } from "@/lib/utils";

type VideoMode = "hover" | "always" | "off";

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
  objectFit?: "contain" | "cover";
  inset?: "none" | "sm" | "md" | "lg";
  children?: ReactNode;
};

const insetMap = {
  none: "inset-0",
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
  objectFit = "contain",
  inset = "md",
  children,
}: ProductMediaProps) {
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const mode: VideoMode = videoMode ?? (videoSrc ? "hover" : "off");
  const wantsVideo =
    mode === "always" || (mode === "hover" && (coarsePointer ? inView : hovering));
  const showVideo = Boolean(videoSrc && !videoFailed && wantsVideo && (videoReady || isPlaying));

  useEffect(() => {
    setVideoReady(false);
    setVideoFailed(false);
    setIsPlaying(false);
  }, [videoSrc]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setCoarsePointer(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!videoSrc || mode !== "hover" || !coarsePointer) return;

    const node = rootRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.45),
      { threshold: [0, 0.45, 0.6] },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [coarsePointer, mode, videoSrc]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc || mode === "off" || videoFailed) return;

    if (wantsVideo) {
      void video.play().catch(() => {
        // На части браузеров MOV не декодируется — остаётся постер.
        setVideoFailed(true);
      });
      return;
    }

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  }, [wantsVideo, videoSrc, mode, videoFailed]);

  return (
    <div
      ref={rootRef}
      className={cn("relative overflow-hidden bg-cream", aspect, className)}
      onPointerEnter={() => mode === "hover" && !coarsePointer && setHovering(true)}
      onPointerLeave={() => mode === "hover" && !coarsePointer && setHovering(false)}
    >
      <div
        className={cn(
          "absolute",
          insetMap[inset],
          "transition-opacity duration-300 motion-reduce:transition-none",
          showVideo ? "opacity-0" : "opacity-100",
        )}
      >
        <ContentImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          objectFit={objectFit}
          className={cn(objectFit === "cover" ? "object-center" : "object-bottom", zoom && "img-zoom")}
        />
      </div>

      {videoSrc && mode !== "off" && !videoFailed ? (
        <video
          key={videoSrc}
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay={mode === "always"}
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          preload={wantsVideo ? "auto" : "metadata"}
          poster={src}
          aria-hidden
          onCanPlay={() => setVideoReady(true)}
          onLoadedData={() => setVideoReady(true)}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setVideoFailed(true);
            setVideoReady(false);
            setIsPlaying(false);
          }}
          className={cn(
            "product-media-video pointer-events-none absolute inset-0 size-full border-0 object-contain object-bottom outline-none transition-opacity duration-300 motion-reduce:transition-none",
            showVideo ? "opacity-100" : "opacity-0",
          )}
        >
          {productVideoSources(videoSrc).map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      ) : null}

      {children}
    </div>
  );
}
