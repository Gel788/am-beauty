import type { Review } from "./types";

export const reviews: Review[] = [
  {
    id: "r1",
    productSlug: "bakuchiol-night",
    author: "Алина К.",
    rating: 5,
    text: "Кожа утром плотнее и ровнее. Текстура густая, но не липкая — одной капли хватает.",
    date: "2026-07-12",
  },
  {
    id: "r2",
    productSlug: "peptide-dew",
    author: "Мария С.",
    rating: 5,
    text: "Идеальная база под макияж. Сияние естественное, без жирного блеска.",
    date: "2026-06-28",
  },
  {
    id: "r3",
    productSlug: "cica-repair",
    author: "Елена В.",
    rating: 5,
    text: "После пилинга спасает. Покраснение уходит за пару дней, кожа спокойная.",
    date: "2026-06-15",
  },
  {
    id: "r4",
    productSlug: "velvet-tint",
    author: "Дарья Л.",
    rating: 4,
    text: "Бархатный финиш, не сушит губы. Оттенок Rose Nude — точно как на фото.",
    date: "2026-05-30",
  },
  {
    id: "r5",
    productSlug: "hydra-cream",
    author: "Ольга П.",
    rating: 5,
    text: "Лёгкий крем с приятным ароматом. Увлажняет на весь день, подходит под макияж.",
    date: "2026-05-18",
  },
];

export function getReviewsForProduct(slug: string) {
  return reviews.filter((r) => r.productSlug === slug);
}
