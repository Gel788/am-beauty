"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import type { Product } from "@/data/products";
import { ProductMedia } from "@/components/ui/product-media";
import { ContentImage } from "@/components/ui/content-image";
import { cn } from "@/lib/utils";

type Slide = "video" | number;

type ProductDetailGalleryProps = {
  product: Product;
  activeSlide: Slide;
  onSlideChange: (slide: Slide) => void;
};

function slideKey(slide: Slide) {
  return slide === "video" ? "video" : `image-${slide}`;
}

function slideImage(product: Product, slide: Slide) {
  if (slide === "video") return product.image;
  return product.gallery[slide] ?? product.image;
}

export function ProductDetailGallery({
  product,
  activeSlide,
  onSlideChange,
}: ProductDetailGalleryProps) {
  const reduce = useReducedMotion();
  const hasVideo = Boolean(product.video);
  const hasThumbs = hasVideo || product.gallery.length > 1;

  const thumbButton = (slide: Slide, content: ReactNode, label: string) => {
    const selected = activeSlide === slide;
    return (
      <button
        type="button"
        role="tab"
        aria-selected={selected}
        aria-label={label}
        onClick={() => onSlideChange(slide)}
        className={cn(
          "relative shrink-0 cursor-pointer overflow-hidden border bg-cream transition-colors motion-safe:duration-300 motion-reduce:transition-none",
          "size-14 lg:size-[4.25rem]",
          selected ? "border-black ring-1 ring-black" : "border-border hover:border-black/40",
        )}
      >
        {content}
        {selected ? (
          <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gold" aria-hidden />
        ) : null}
      </button>
    );
  };

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden lg:sticky lg:top-20 lg:self-start">
      <div className={cn("flex w-full min-w-0 max-w-full gap-3 lg:gap-5", hasThumbs && "lg:flex-row-reverse")}>
        <div className="relative min-w-0 w-full max-w-full flex-1">
          <div className="relative w-full max-w-full overflow-hidden border border-border bg-cream">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slideKey(activeSlide)}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductMedia
                  src={slideImage(product, activeSlide)}
                  alt={product.name}
                  videoSrc={product.video}
                  videoMode={activeSlide === "video" ? "always" : "off"}
                  priority
                  aspect="aspect-[3/4]"
                  sizes="(max-width:1024px) 100vw, 55vw"
                  objectFit="contain"
                  inset="md"
                  zoom={false}
                />
              </motion.div>
            </AnimatePresence>

            {product.badge ? (
              <span className="absolute top-4 left-4 z-10 bg-black px-3 py-1.5 text-[9px] tracking-[0.2em] text-white uppercase">
                {product.badge}
              </span>
            ) : null}
          </div>

          {hasThumbs ? (
            <div
              className="scroll-snap-x mt-3 flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 lg:hidden"
              role="tablist"
              aria-label="Медиа товара"
            >
              {hasVideo
                ? thumbButton(
                    "video",
                    <>
                      <div className="absolute inset-1.5">
                        <ContentImage
                          src={product.image}
                          alt=""
                          fill
                          objectFit="contain"
                          sizes="56px"
                          className="object-bottom"
                        />
                      </div>
                      <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Play className="size-3.5 fill-white text-white" strokeWidth={1} />
                      </span>
                    </>,
                    "Видео",
                  )
                : null}
              {product.gallery.map((src, i) =>
                thumbButton(
                  i,
                  <div className="absolute inset-1.5">
                    <ContentImage
                      src={src}
                      alt=""
                      fill
                      objectFit="contain"
                      sizes="56px"
                      className="object-bottom"
                    />
                  </div>,
                  `Фото ${i + 1}`,
                ),
              )}
            </div>
          ) : null}
        </div>

        {hasThumbs ? (
          <div
            className="hidden flex-col gap-2 lg:flex"
            role="tablist"
            aria-label="Медиа товара"
          >
            {hasVideo
              ? thumbButton(
                  "video",
                  <>
                    <div className="absolute inset-1.5">
                      <ContentImage
                        src={product.image}
                        alt=""
                        fill
                        objectFit="contain"
                        sizes="68px"
                        className="object-bottom"
                      />
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="size-4 fill-white text-white" strokeWidth={1} />
                    </span>
                  </>,
                  "Видео",
                )
              : null}
            {product.gallery.map((src, i) =>
              thumbButton(
                i,
                <div className="absolute inset-1.5">
                  <ContentImage
                    src={src}
                    alt=""
                    fill
                    objectFit="contain"
                    sizes="68px"
                    className="object-bottom"
                  />
                </div>,
                `Фото ${i + 1}`,
              ),
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
