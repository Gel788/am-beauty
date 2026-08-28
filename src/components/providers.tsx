"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/legal/cookie-banner";
import { SmoothScroll } from "@/components/smooth-scroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      {children}
      <CookieBanner />
      <Toaster position="top-center" richColors closeButton />
    </SmoothScroll>
  );
}
