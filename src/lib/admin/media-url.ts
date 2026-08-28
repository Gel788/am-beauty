/** Приводит путь к виду /uploads/... или /images/... */
export function normalizeMediaSrc(src: string) {
  const trimmed = src.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("uploads/")) return `/${trimmed}`;
  if (trimmed.startsWith("images/")) return `/${trimmed}`;
  if (trimmed.startsWith("videos/")) return `/${trimmed}`;
  return `/uploads/images/${trimmed}`;
}
