export function drawSerumFrame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number,
) {
  const p = Math.min(Math.max(progress, 0), 1);
  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createRadialGradient(w * 0.5, h * 0.35, 0, w * 0.5, h * 0.4, w * 0.85);
  bg.addColorStop(0, "#2a221c");
  bg.addColorStop(0.45, "#14110f");
  bg.addColorStop(1, "#080706");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const spot = ctx.createRadialGradient(w * 0.42, h * 0.28, 0, w * 0.42, h * 0.28, w * 0.35);
  spot.addColorStop(0, "rgba(196, 168, 130, 0.14)");
  spot.addColorStop(1, "rgba(196, 168, 130, 0)");
  ctx.fillStyle = spot;
  ctx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const baseY = h * 0.72;
  const scale = Math.min(w, h) / 900;

  const capLift = Math.min(p / 0.35, 1) * 90 * scale;
  const dropPhase = Math.max(0, (p - 0.42) / 0.25);
  const fallPhase = Math.max(0, (p - 0.68) / 0.32);

  ctx.save();
  ctx.translate(cx, baseY);
  ctx.scale(scale, scale);

  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 118, 72, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  const bottleW = 88;
  const bottleTop = -200;
  const bottleBottom = 110;

  const glass = ctx.createLinearGradient(-bottleW, bottleTop, bottleW, bottleBottom);
  glass.addColorStop(0, "rgba(255,248,240,0.55)");
  glass.addColorStop(0.5, "rgba(232,220,205,0.25)");
  glass.addColorStop(1, "rgba(180,165,148,0.45)");

  ctx.beginPath();
  ctx.moveTo(-bottleW * 0.55, bottleTop + 40);
  ctx.lineTo(-bottleW * 0.55, bottleBottom);
  ctx.quadraticCurveTo(0, bottleBottom + 18, bottleW * 0.55, bottleBottom);
  ctx.lineTo(bottleW * 0.55, bottleTop + 40);
  ctx.quadraticCurveTo(0, bottleTop + 10, -bottleW * 0.55, bottleTop + 40);
  ctx.closePath();
  ctx.fillStyle = glass;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 1.2;
  ctx.stroke();

  const liquidTop = bottleBottom - 40 - p * 28;
  const liquid = ctx.createLinearGradient(0, liquidTop, 0, bottleBottom);
  liquid.addColorStop(0, "#c4a882");
  liquid.addColorStop(0.5, "#8a6a4a");
  liquid.addColorStop(1, "#4a3528");
  ctx.beginPath();
  ctx.moveTo(-bottleW * 0.48, liquidTop);
  ctx.lineTo(-bottleW * 0.48, bottleBottom - 4);
  ctx.quadraticCurveTo(0, bottleBottom + 8, bottleW * 0.48, bottleBottom - 4);
  ctx.lineTo(bottleW * 0.48, liquidTop);
  ctx.quadraticCurveTo(0, liquidTop - 6, -bottleW * 0.48, liquidTop);
  ctx.closePath();
  ctx.fillStyle = liquid;
  ctx.globalAlpha = 0.88;
  ctx.fill();
  ctx.globalAlpha = 1;

  const neckY = bottleTop + 40 - capLift;
  ctx.fillStyle = "#8a7b6c";
  ctx.fillRect(-10, neckY - 52, 20, 52);
  ctx.fillStyle = "#6b5d50";
  ctx.fillRect(-16, neckY - 58, 32, 10);

  const pipetteY = neckY - 58 - capLift * 0.35;
  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, pipetteY);
  ctx.lineTo(0, pipetteY + 36 + capLift * 0.2);
  ctx.stroke();

  if (dropPhase > 0 && fallPhase < 1) {
    const dropY = pipetteY + 40 + dropPhase * 18 - fallPhase * 120;
    const dropR = 5 + dropPhase * 4;
    const drop = ctx.createRadialGradient(0, dropY, 0, 0, dropY, dropR * 2);
    drop.addColorStop(0, "#e8d4b8");
    drop.addColorStop(0.6, "#c4a882");
    drop.addColorStop(1, "rgba(196,168,130,0)");
    ctx.fillStyle = drop;
    ctx.beginPath();
    ctx.ellipse(0, dropY, dropR * 0.85, dropR, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  if (fallPhase > 0.15) {
    const splash = (fallPhase - 0.15) / 0.85;
    ctx.strokeStyle = `rgba(196,168,130,${0.35 * (1 - splash)})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const r = 12 + splash * 36;
      ctx.beginPath();
      ctx.moveTo(0, bottleTop + 120);
      ctx.lineTo(Math.cos(a) * r, bottleTop + 120 + Math.sin(a) * r * 0.35);
      ctx.stroke();
    }
  }

  ctx.restore();
}

export function bindScrollCanvas(
  canvas: HTMLCanvasElement,
  scroller: HTMLElement,
  onProgress?: (p: number) => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let raf = 0;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const paint = () => {
    raf = 0;
    const rect = scroller.getBoundingClientRect();
    const total = scroller.offsetHeight - window.innerHeight;
    if (total <= 0) return;
    const scrolled = Math.min(Math.max(-rect.top, 0), total);
    const progress = scrolled / total;
    const { width, height } = canvas.getBoundingClientRect();
    drawSerumFrame(ctx, width, height, progress);
    onProgress?.(progress);
  };

  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(paint);
  };

  const onResize = () => {
    resize();
    paint();
  };

  resize();
  paint();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
  };
}
