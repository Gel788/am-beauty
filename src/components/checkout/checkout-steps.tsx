"use client";

import { cn } from "@/lib/utils";

type CheckoutStepsProps = {
  steps: readonly string[];
  current: number;
  onStepClick?: (index: number) => void;
};

export function CheckoutSteps({ steps, current, onStepClick }: CheckoutStepsProps) {
  return (
    <ol className="flex gap-0 border-b border-border" aria-label="Шаги оформления">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const clickable = onStepClick && i < current;

        return (
          <li key={label} className="flex-1">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(i)}
              className={cn(
                "relative w-full pb-4 text-center text-[10px] tracking-[0.16em] uppercase transition-colors motion-safe:duration-300",
                active && "text-black",
                done && "text-black",
                !active && !done && "text-grey",
                clickable ? "cursor-pointer hover:text-black" : "cursor-default",
              )}
            >
              <span
                className={cn(
                  "mb-2 inline-flex size-6 items-center justify-center border text-[9px] tabular-nums",
                  active && "border-gold bg-black text-white",
                  done && !active && "border-black bg-cream text-black",
                  !active && !done && "border-border text-grey",
                )}
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="block">{label}</span>
              {active ? (
                <span
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-gold motion-safe:transition-all"
                  aria-hidden
                />
              ) : done ? (
                <span className="absolute inset-x-0 bottom-0 h-px bg-black/20" aria-hidden />
              ) : null}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
