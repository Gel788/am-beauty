"use client";

import Link from "next/link";
import { useState } from "react";
import { ProductCard } from "@/components/catalog/product-card";
import { Reveal } from "@/components/reveal";
import { getProductsBySlugs, type Product } from "@/data/products";
import { getReviewsForProduct } from "@/data/reviews";
import { ProductDetailBuyBox, ProductDetailHeroMeta } from "@/components/product/product-detail-buy-box";
import { ProductDetailGallery } from "@/components/product/product-detail-gallery";
import {
  ProductDetailBenefits,
  ProductDetailMarquee,
  ProductDetailReviews,
  ProductDetailRitual,
  ProductDetailSpecs,
} from "@/components/product/product-detail-sections";

type Slide = "video" | number;

export function ProductDetail({ product }: { product: Product }) {
  const hasVideo = Boolean(product.video);
  const [activeSlide, setActiveSlide] = useState<Slide>(hasVideo ? "video" : 0);
  const [qty, setQty] = useState(1);

  const related = getProductsBySlugs(product.relatedSlugs);
  const bundle = getProductsBySlugs(product.bundleSlugs);
  const productReviews = getReviewsForProduct(product.slug);

  return (
    <>
      <div className="pb-28 lg:pb-0">
        <div className="container-page pt-6 lg:pt-10">
          <nav
            aria-label="Хлебные крошки"
            className="text-[10px] tracking-[0.18em] text-grey uppercase"
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

          <div className="mt-8 grid gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-16 xl:gap-24">
            <ProductDetailGallery
              product={product}
              activeSlide={activeSlide}
              onSlideChange={setActiveSlide}
            />

            <div className="lg:sticky lg:top-20 lg:self-start lg:py-4">
              <ProductDetailHeroMeta product={product} />
              <ProductDetailBuyBox product={product} qty={qty} onQtyChange={setQty} />
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-24">
          <ProductDetailMarquee product={product} />
        </div>

        <ProductDetailBenefits product={product} />
        <ProductDetailRitual product={product} />
        <ProductDetailSpecs product={product} />
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

      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
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
