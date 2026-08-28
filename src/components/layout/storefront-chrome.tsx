"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function StorefrontChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <div className="h-full min-h-0">{children}</div>;
  }

  return (
    <>
      <Header />
      <main id="main" className="flex-1 pt-[3.75rem]">
        {children}
      </main>
      <Footer />
    </>
  );
}
