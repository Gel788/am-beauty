"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/catalog/product-card";
import { Reveal } from "@/components/reveal";
import { getProductsBySlugs, type Product } from "@/data/products";
import { useProductReviews } from "@/context/catalog-context";
import { ProductDetailBuyBox, ProductDetailHeroMeta } from "@/components/product/product-detail-buy-box";
import { ProductDetailGallery } from "@/components/product/product-detail-gallery";
import {
  ProductDetailEditorial,
  ProductDetailMarquee,
  ProductDetailReviews,
} from "@/components/product/product-detail-sections";
import { ProductDetailFactsStrip, ProductDetailSidebarExtras } from "@/components/product/product-detail-extras";

type Slide = "video" | number;

export function ProductDetail({ product }: { product: Product }) {
  const hasVideo = Boolean(product.video);
  const [activeSlide, setActiveSlide] = useState<Slide>(hasVideo ? "video" : 0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setActiveSlide(hasVideo ? "video" : 0);
  }, [product.slug, hasVideo]);

  const related = getProductsBySlugs(product.relatedSlugs);
  const bundle = getProductsBySlugs(product.bundleSlugs);
  const productReviews = useProductReviews(product.slug);

  return (
    <>
      <div className="overflow-x-clip pb-28 lg:pb-0">
        <section className="overflow-x-clip border-b border-border bg-cream/50">
          <div className="container-page max-w-full pt-6 pb-10 lg:pt-10 lg:pb-14">
            <nav
              aria-label="Хлебные крошки"
              className="text-[10px] tracking-[0.18em] break-words text-grey uppercase"
            >
              <Link href="/" className="transition-colors hover:text-black">
                Главная
              </Link>
              <span className="mx-2">/</span>
              <Link href="/catalog" className="transition-colors hover:text-black">
                Каталог
              </Link>
              <span className="mx-2">/</span>
              <span className="text-black">{product.shortName}</span>
            </nav>

            <div className="mt-8 grid w-full min-w-0 max-w-full gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12 xl:gap-16">
            <ProductDetailGallery
              key={product.slug}
              product={product}
              activeSlide={activeSlide}
              onSlideChange={setActiveSlide}
            />

              <div className="min-w-0 max-w-full lg:sticky lg:top-20 lg:self-start">
                <div className="min-w-0 border border-border bg-white p-4 sm:p-6 lg:p-8">
                  <ProductDetailHeroMeta product={product} />
                  <ProductDetailBuyBox product={product} qty={qty} onQtyChange={setQty} />
                  <div className="hidden lg:block">
                    <ProductDetailSidebarExtras product={product} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProductDetailFactsStrip product={product} />

        <ProductDetailMarquee product={product} />

        <ProductDetailEditorial product={product} />
        <ProductDetailReviews reviews={productReviews} />

        {bundle.length > 0 ? (
          <section className="container-page section-pad border-t border-border">
            <Reveal>
              <p className="text-center text-[10px] tracking-[0.32em] text-grey uppercase">
                Комплект
              </p>
              <h2 className="headline-lg mt-4 text-center !normal-case !tracking-[0.02em]">
                Покупают вместе
              </h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3">
              {bundle.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="container-page section-pad border-t border-border bg-cream/40">
            <Reveal>
              <p className="text-center text-[10px] tracking-[0.32em] text-grey uppercase">
                Коллекция
              </p>
              <h2 className="headline-lg mt-4 text-center !normal-case !tracking-[0.02em]">
                Похожие товары
              </h2>
            </Reveal>
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 max-w-[100vw] overflow-hidden pb-[env(safe-area-inset-bottom)] lg:hidden">
        <ProductDetailBuyBox
          product={product}
          qty={qty}
          onQtyChange={setQty}
          variant="sticky"
        />
      </div>
    </>
  );
}
