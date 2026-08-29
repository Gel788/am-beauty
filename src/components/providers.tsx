"use client";

import type { ReactNode } from "react";
import { SplashScreen } from "@/components/splash/splash-screen";
import { StoreHydration } from "@/components/store-hydration";
import { Toaster } from "@/components/ui/sonner";
import { CookieBanner } from "@/components/legal/cookie-banner";
import { SmoothScroll } from "@/components/smooth-scroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      <StoreHydration />
      <SplashScreen />
      {children}
      <CookieBanner />
      <Toaster position="top-center" richColors closeButton />
    </SmoothScroll>
  );
}
