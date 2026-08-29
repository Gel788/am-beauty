export type SkinType = "all" | "dry" | "oily" | "combination" | "sensitive";

export type ProductCategory = string;

export type ProductLine = "atelier" | "glow" | "pure";

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  line: ProductLine;
  skinTypes: SkinType[];
  ritual?: string;
  note: string;
  volume: string;
  actives: string;
  price: number;
  compareAt?: number;
  badge?: string;
  image: string;
  gallery: string[];
  /** Видео для карточки: положите файл в public/videos/ */
  video?: string;
  description: string;
  benefits: string[];
  ingredients: string[];
  howToUse: string[];
  skinTypeLabel: string;
  rating: number;
  reviewCount: number;
  isBestseller?: boolean;
  relatedSlugs: string[];
  bundleSlugs: string[];
  /** Остаток на складе (из admin DB) */
  stock?: number;
};

export type Review = {
  id: string;
  productSlug: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export type CategoryMeta = {
  id: ProductCategory;
  title: string;
  description: string;
  image: string;
};
