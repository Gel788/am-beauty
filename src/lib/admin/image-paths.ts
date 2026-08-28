export function isOptimizableImageSrc(src: string) {
  return src.startsWith("/uploads/images/") || src.startsWith("/images/");
}
