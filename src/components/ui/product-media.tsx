import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProductMediaProps = {
  src: string;
  alt: string;
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
  priority,
  sizes = "50vw",
  className,
  aspect = "aspect-[3/4]",
  zoom = true,
  inset = "md",
  children,
}: ProductMediaProps) {
  return (
    <div className={cn("relative overflow-hidden bg-cream", aspect, className)}>
      <div className={cn("absolute", insetMap[inset])}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-contain object-bottom", zoom && "img-zoom")}
        />
      </div>
      {children}
    </div>
  );
}
