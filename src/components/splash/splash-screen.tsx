"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "am-beauty-splash-seen";
const SHOW_MS = 1500;
const EXIT_MS = 650;

function shouldSkip(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    typeof window === "undefined"
  );
}

export function SplashScreen() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"hidden" | "visible" | "exit">("hidden");

  useEffect(() => {
    if (shouldSkip(pathname)) {
      setPhase("hidden");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem(STORAGE_KEY) === "1") {
      setPhase("hidden");
      return;
    }

    setPhase("visible");
    document.body.classList.add("splash-active");

    const exitTimer = window.setTimeout(() => setPhase("exit"), SHOW_MS);
    const hideTimer = window.setTimeout(() => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setPhase("hidden");
      document.body.classList.remove("splash-active");
    }, SHOW_MS + EXIT_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
      document.body.classList.remove("splash-active");
    };
  }, [pathname]);

  if (phase === "hidden") return null;

  return (
    <div
      className={cn("splash-screen", phase === "exit" && "splash-screen--exit")}
      aria-hidden="true"
    >
      <p className="splash-screen__watermark" aria-hidden>
        AM
      </p>
      <div className="splash-screen__inner">
        <p className="splash-screen__logo">AM Beauty</p>
        <div className="splash-screen__line" />
        <p className="splash-screen__tagline">Премиальная косметика</p>
      </div>
    </div>
  );
}
