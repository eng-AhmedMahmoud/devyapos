"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Small "?" affordance that explains a number.
 *
 * Opens on hover AND on focus, and toggles on click — hover alone is unusable
 * on touch, where there is no pointer to rest, and unreachable by keyboard.
 * A real `<button>` rather than a `tabindex` span so Enter and Space work for
 * free, with `aria-describedby` pointing at the bubble so a screen reader
 * announces the explanation as part of the control rather than as loose text.
 *
 * Escape closes, and so does a pointer press anywhere outside — otherwise a
 * tooltip opened by tap on a phone has no way to be dismissed.
 *
 * The bubble is centred over the trigger with a symmetric transform rather than
 * a `left`/`right` offset, so it needs no RTL special-casing. `clamp` on the
 * width keeps it inside narrow viewports without a positioning library.
 */
export default function InfoTip({
  label,
  text,
}: {
  /** Accessible name — what this explains, e.g. "About average order value". */
  label: string;
  /** The explanation itself. */
  text: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="
          grid h-4 w-4 place-items-center rounded-full border border-line-soft
          text-[10px] leading-none font-bold text-ink-dim transition-colors
          hover:border-brand hover:text-brand focus-visible:border-brand
          focus-visible:text-brand
        "
      >
        {/* Drawn rather than typed. A "?" glyph is Latin punctuation that looks
            imported inside Arabic UI, and "؟" looks equally wrong in English;
            an info mark belongs to neither script and needs no font. */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="h-2.5 w-2.5"
        >
          <circle cx="12" cy="6" r="2.1" />
          <rect x="10.2" y="10" width="3.6" height="9" rx="1.8" />
        </svg>
      </button>

      <span
        id={id}
        role="tooltip"
        /* Kept in the DOM and hidden with opacity so it can fade, but
           `invisible` too — a transparent bubble still swallows pointer events
           and would block the control underneath it. */
        className={`
          pointer-events-none absolute bottom-full left-1/2 z-30 mb-2
          -translate-x-1/2 rounded-xl border border-line bg-surface p-3
          text-start text-xs leading-relaxed font-normal text-ink-dim shadow-lg
          transition-opacity duration-150
          ${open ? "opacity-100" : "invisible opacity-0"}
        `}
        style={{ width: "clamp(11rem, 62vw, 17rem)" }}
      >
        {text}
      </span>
    </span>
  );
}
