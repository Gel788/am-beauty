export type ProductVideoSource = {
  src: string;
  type: string;
};

function videoMimeType(src: string) {
  const lower = src.toLowerCase();
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".webm")) return "video/webm";
  if (lower.endsWith(".mov")) return "video/quicktime";
  return undefined;
}

/** MP4-версия рядом с MOV (лучше для Chrome/Android). */
export function mp4SiblingUrl(src: string) {
  return src.replace(/\.(mov|MOV|mp4|webm)$/i, ".mp4");
}

export function productVideoSources(videoSrc: string): ProductVideoSource[] {
  const sources: ProductVideoSource[] = [];
  const mp4 = mp4SiblingUrl(videoSrc);
  const mp4Type = videoMimeType(mp4);

  if (mp4 !== videoSrc && mp4Type) {
    sources.push({ src: mp4, type: mp4Type });
  }

  const primaryType = videoMimeType(videoSrc);
  if (primaryType) {
    sources.push({ src: videoSrc, type: primaryType });
  } else {
    sources.push({ src: videoSrc, type: "video/mp4" });
  }

  return sources;
}
