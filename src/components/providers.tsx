"use client";

import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/smooth-scroll";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SmoothScroll>
      {children}
      <Toaster position="top-center" richColors closeButton />
    </SmoothScroll>
  );
}
