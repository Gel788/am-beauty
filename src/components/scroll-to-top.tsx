"use client";

import type { Lenis } from "lenis";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

function resetScroll(lenis?: Lenis | null) {
  lenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/** Сброс скролла при смене страницы (внутри ReactLenis). */
export function LenisScrollToTop() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prevPath = useRef(pathname);

  useLayoutEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    resetScroll(lenis);
  }, [pathname, lenis]);

  return null;
}

/** Сброс скролла без Lenis (touch / reduced motion). */
export function NativeScrollToTop() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useLayoutEffect(() => {
    if (prevPath.current === pathname) return;
    prevPath.current = pathname;
    resetScroll();
  }, [pathname]);

  return null;
}
