"use client";

import { MapPin } from "lucide-react";
import type { AccountAddress } from "@/store/account-store";
import { cn } from "@/lib/utils";

type SavedAddressPickerProps = {
  addresses: AccountAddress[];
  selectedId: string | null;
  onSelect: (address: AccountAddress | null) => void;
};

export function SavedAddressPicker({ addresses, selectedId, onSelect }: SavedAddressPickerProps) {
  if (addresses.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-[10px] tracking-[0.22em] text-grey uppercase">Сохранённые адреса</h3>
      <div className="space-y-2" role="radiogroup" aria-label="Сохранённые адреса">
        {addresses.map((addr) => {
          const selected = selectedId === addr.id;
          return (
            <button
              key={addr.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(selected ? null : addr)}
              className={cn(
                "flex w-full gap-3 border p-4 text-left transition-colors cursor-pointer motion-safe:duration-300",
                selected
                  ? "border-black bg-cream/80 ring-1 ring-black"
                  : "border-border hover:border-black/40",
              )}
            >
              <MapPin
                className={cn("mt-0.5 size-4 shrink-0", selected ? "text-gold" : "text-grey")}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.14em] uppercase">
                  {addr.label}
                  {addr.isDefault ? (
                    <span className="text-[9px] tracking-[0.12em] text-gold">По умолчанию</span>
                  ) : null}
                </span>
                <span className="mt-1 block text-sm text-charcoal">
                  {addr.city}, {addr.address}
                </span>
                {addr.postalCode ? (
                  <span className="mt-0.5 block text-xs text-grey">{addr.postalCode}</span>
                ) : null}
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            "w-full border border-dashed px-4 py-3 text-[10px] tracking-[0.16em] uppercase transition-colors cursor-pointer",
            selectedId === null
              ? "border-gold text-black"
              : "border-border text-grey hover:border-black/40 hover:text-black",
          )}
        >
          Ввести новый адрес
        </button>
      </div>
    </div>
  );
}
