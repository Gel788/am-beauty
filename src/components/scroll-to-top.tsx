"use client";

import type { Lenis } from "lenis";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function resetScroll(lenis?: Lenis | null) {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  lenis?.scrollTo(0, { immediate: true, force: true });
}

/** Сброс скролла при смене страницы (внутри ReactLenis). */
export function LenisScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    requestAnimationFrame(() => resetScroll(lenis));
  }, [pathname, lenis]);

  return null;
}

/** Сброс скролла без Lenis (touch / reduced motion). */
export function NativeScrollToTop() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    requestAnimationFrame(() => resetScroll());
  }, [pathname]);

  return null;
}
