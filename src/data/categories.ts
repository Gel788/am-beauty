import type { CategoryMeta } from "./types";

export const categories: CategoryMeta[] = [
  {
    id: "serums",
    title: "Сыворотки",
    description: "Концентрированные формулы для точечного ухода",
    image: "/images/bakuchiol-v2.jpg",
  },
  {
    id: "face-care",
    title: "Уход за лицом",
    description: "Кремы, маски и восстановление барьера",
    image: "/images/cica-v2.jpg",
  },
  {
    id: "cleansing",
    title: "Очищение",
    description: "Мягкое снятие макияжа и загрязнений",
    image: "/images/peptide-v2.jpg",
  },
  {
    id: "makeup",
    title: "Декоративная",
    description: "Тон, сияние и естественный финиш",
    image: "/images/hero-v2.jpg",
  },
];

export const skinTypeLabels: Record<string, string> = {
  all: "Все типы",
  dry: "Сухая",
  oily: "Жирная",
  combination: "Комбинированная",
  sensitive: "Чувствительная",
};

export const lineLabels: Record<string, string> = {
  atelier: "Atelier",
  glow: "Glow",
  pure: "Pure",
};
