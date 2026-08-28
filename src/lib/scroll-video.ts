export type ScrollVideoOptions = {
  video: HTMLVideoElement;
  scroller: HTMLElement;
  onProgress?: (progress: number) => void;
};

export function bindScrollVideo({ video, scroller, onProgress }: ScrollVideoOptions) {
  let raf = 0;

  const update = () => {
    raf = 0;
    const rect = scroller.getBoundingClientRect();
    const total = scroller.offsetHeight - window.innerHeight;
    if (total <= 0) return;

    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = scrolled / total;

    if (video.duration && Number.isFinite(video.duration)) {
      video.currentTime = progress * video.duration;
    }

    onProgress?.(progress);
  };

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  const onResize = () => {
    if (!raf) raf = requestAnimationFrame(update);
  };

  const onMeta = () => update();

  video.pause();
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.addEventListener("loadedmetadata", onMeta);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  update();

  return () => {
    cancelAnimationFrame(raf);
    video.removeEventListener("loadedmetadata", onMeta);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
  };
}
