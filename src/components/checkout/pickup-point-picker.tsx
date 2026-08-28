"use client";

import { useMemo, useState } from "react";
import { MapPin, Search } from "lucide-react";
import type { PickupPoint } from "@/lib/delivery/types";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type PickupPointPickerProps = {
  points: PickupPoint[];
  selected: PickupPoint | null;
  loading?: boolean;
  onSelect: (point: PickupPoint) => void;
};

export function PickupPointPicker({
  points,
  selected,
  loading,
  onSelect,
}: PickupPointPickerProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return points;
    return points.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.postalCode?.includes(q),
    );
  }, [points, query]);

  if (loading) {
    return (
      <div className="space-y-2" aria-busy="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse border border-border bg-cream/60" />
        ))}
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <p className="text-sm text-grey">
        Пункты выдачи не найдены для выбранного города.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-grey"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по адресу или индексу"
          aria-label="Поиск пункта выдачи"
          className="h-11 pl-10"
        />
      </div>

      <ScrollArea className="h-64 border border-border bg-white">
        <ul className="divide-y divide-border" role="listbox" aria-label="Пункты выдачи">
          {filtered.map((point) => {
            const isSelected = selected?.id === point.id;
            return (
              <li key={point.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => onSelect(point)}
                  className={cn(
                    "flex w-full gap-3 p-4 text-left transition-colors cursor-pointer motion-safe:duration-300",
                    isSelected
                      ? "bg-cream ring-1 ring-inset ring-gold"
                      : "hover:bg-cream/50",
                  )}
                >
                  <MapPin
                    className={cn("mt-0.5 size-4 shrink-0", isSelected ? "text-gold" : "text-grey")}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block text-[11px] tracking-[0.12em] uppercase">{point.name}</span>
                    <span className="mt-0.5 block text-xs text-grey">{point.address}</span>
                    {point.schedule ? (
                      <span className="mt-0.5 block text-[10px] text-grey">{point.schedule}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {filtered.length === 0 ? (
          <p className="p-4 text-center text-xs text-grey">Ничего не найдено</p>
        ) : null}
      </ScrollArea>
    </div>
  );
}
