"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { LenisScrollToTop, NativeScrollToTop } from "@/components/scroll-to-top";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const disableLenis =
    reduce ||
    isTouch ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/account");

  if (disableLenis) {
    return (
      <>
        <NativeScrollToTop />
        {children}
      </>
    );
  }

  return (
    <ReactLenis root options={{ autoRaf: true, lerp: 0.1, duration: 1.2 }}>
      <LenisScrollToTop />
      {children}
    </ReactLenis>
  );
}
