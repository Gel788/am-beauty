import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { StorefrontChrome } from "@/components/layout/storefront-chrome";
import { Providers } from "@/components/providers";
import { CatalogProvider } from "@/context/catalog-context";
import { getPublicCatalog } from "@/lib/catalog/runtime";
import { hydrateCatalog } from "@/data/products";
import { cn } from "@/lib/utils";
import "./globals.css";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const sans = Geist({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AM Beauty — премиальная косметика",
    template: "%s · AM Beauty",
  },
  description:
    "Интернет-магазин AM Beauty: уход за кожей и декоративная косметика. Натуральный состав, доставка по России.",
  openGraph: {
    title: "AM Beauty",
    description: "Премиальная косметика для ухода и макияжа",
    locale: "ru_RU",
    type: "website",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const catalog = await getPublicCatalog();
  hydrateCatalog(catalog.products);

  return (
    <html lang="ru" className={cn("h-full", sans.variable)}>
      <body className="flex min-h-full flex-col font-sans">
        <a href="#main" className="skip-link">
          Перейти к содержимому
        </a>
        <CatalogProvider data={catalog}>
          <Providers>
            <StorefrontChrome>{children}</StorefrontChrome>
          </Providers>
        </CatalogProvider>
      </body>
    </html>
  );
}
