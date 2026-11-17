"use client";

import { type KeyboardEvent } from "react";
import { cn } from "~/lib/utils";

export type ViewTab<T extends string> = { value: T; label: string };

// Always-visible segmented tabs in the bracket style: [ read ]  [ ask ai ].
// Used on mobile where panels can't sit side by side.
export function ViewTabs<T extends string>({
  tabs,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: {
  tabs: ViewTab<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
}) {
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.value === value);
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const step = e.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      if (next) onChange(next.value);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      className={cn("grid font-mono text-sm", className)}
      style={{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(tab.value)}
            className={cn(
              "flex items-baseline justify-center gap-1 border-b-2 py-3 transition-colors focus-visible:bg-cyan-400/10 focus-visible:outline-none",
              active
                ? "border-cyan-400 bg-cyan-400/[0.06] text-cyan-300"
                : "border-transparent text-slate-400",
            )}
          >
            <span
              aria-hidden
              className={active ? "text-cyan-400" : "text-slate-600"}
            >
              [
            </span>
            <span className="px-0.5">{tab.label}</span>
            <span
              aria-hidden
              className={active ? "text-cyan-400" : "text-slate-600"}
            >
              ]
            </span>
          </button>
        );
      })}
    </div>
  );
}
