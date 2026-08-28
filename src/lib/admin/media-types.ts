export type MediaKind = "image" | "video";

export type MediaFile = {
  url: string;
  path: string;
  name: string;
  kind: MediaKind;
  size: number;
  updatedAt: string;
};

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function urlToMediaPath(url: string): string | null {
  if (!url.startsWith("/uploads/")) return null;
  return url.slice("/uploads/".length);
}
