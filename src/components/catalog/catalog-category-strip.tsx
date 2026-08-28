"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { AdminCategory } from "@/lib/admin/types";

type CatalogCategoryStripProps = {
  categories: AdminCategory[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
};

export function CatalogCategoryStrip({
  categories,
  activeId,
  onSelect,
}: CatalogCategoryStripProps) {
  return (
    <div className="border-b border-border bg-cream/80 backdrop-blur-sm">
      <div className="container-page py-5">
        <div className="scroll-snap-x flex gap-3 overflow-x-auto pb-1 md:gap-4">
          <CategoryPill active={!activeId} onClick={() => onSelect(null)} label="Все" />
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              active={activeId === cat.id}
              onClick={() => onSelect(cat.id)}
              label={cat.title}
              image={cat.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryPill({
  label,
  image,
  active,
  onClick,
}: {
  label: string;
  image?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group flex shrink-0 snap-start cursor-pointer items-center gap-3 border px-3 py-2 transition-colors md:px-4 md:py-2.5",
        active
          ? "border-gold bg-white shadow-[inset_3px_0_0_0_var(--gold)]"
          : "border-border bg-white/60 hover:border-black/30 hover:bg-white",
      )}
    >
      {image ? (
        <span className="relative size-9 overflow-hidden bg-cream md:size-10">
          <Image src={image} alt="" fill className="object-cover" sizes="40px" />
        </span>
      ) : (
        <span className="flex size-9 items-center justify-center bg-black text-[9px] tracking-widest text-white uppercase md:size-10">
          All
        </span>
      )}
      <span
        className={cn(
          "text-[10px] tracking-[0.16em] uppercase whitespace-nowrap",
          active ? "text-black" : "text-grey group-hover:text-black",
        )}
      >
        {label}
      </span>
    </button>
  );
}
