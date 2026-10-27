"use client";

import { useId } from "react";

/**
 * One segmented switch on the pricing page — billing or currency — with its
 * label above it, as Moving Stores sets its pricing switch. Buttons with
 * `aria-pressed` inside a labelled group, the pattern the accounting plans
 * already use on this site.
 */
export default function PricingToggle<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string; hint?: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <span id={id} className="text-xs font-bold text-ink-dim">
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={id}
        className="inline-flex w-fit items-center gap-1 rounded-full border border-line bg-surface-2 p-1"
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold transition-colors sm:px-4 ${
                active ? "bg-surface text-ink shadow-[var(--shadow-warm)]" : "text-ink-dim"
              }`}
            >
              {option.label}
              {option.hint ? (
                <span className="whitespace-nowrap rounded-full bg-brand-soft px-2 py-0.5 text-xs text-brand">
                  {option.hint}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
