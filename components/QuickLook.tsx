"use client";

import { useEffect, useId, useRef } from "react";
import IpadFrame from "@/components/IpadFrame";
import { ASPECT_BY_SRC } from "@/lib/screenshots";
import { Arrow, Close } from "./icons";

export interface QuickLookItem {
  src: string;
  alt: string;
  caption: string;
  orientation?: "landscape" | "portrait";
}

export interface QuickLookLabels {
  hint: string;
  open: string;
  close: string;
  previous: string;
  next: string;
  position: string;
}

/**
 * A screenshot full size, Apple quick-look style: the page blurs behind a
 * sheet, the screen sits in the same iPad frame, and ‹ › or the arrow keys
 * step through the set.
 *
 * A native `<dialog>` opened with `showModal()`, so the browser owns the hard
 * parts: the rest of the page is inert (focus cannot leave the sheet), Escape
 * closes it, and it sits in the top layer above the header and the consent
 * banner. `onClose` hands back the screen the visitor ended on, so the
 * carousel can follow and take the focus back.
 */
export default function QuickLook({
  items,
  index,
  labels,
  onStep,
  onClose,
}: {
  items: QuickLookItem[];
  /** The screen on show; `null` while closed. */
  index: number | null;
  labels: QuickLookLabels;
  onStep: (index: number) => void;
  onClose: (lastIndex: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const last = useRef(0);
  const captionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null) {
      last.current = index;
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [index]);

  const item = index === null ? null : items[index];
  const total = items.length;
  const step = (by: number) => {
    if (index === null) return;
    onStep((index + by + total) % total);
  };
  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      className="ql-dialog"
      aria-labelledby={captionId}
      onClose={() => onClose(last.current)}
      onClick={(e) => {
        // A click on the blurred page around the sheet closes it.
        const target = e.target as HTMLElement;
        if (target === e.currentTarget || target.dataset.backdrop === "true")
          close();
      }}
      onKeyDown={(e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault();
        // Physical keys: in Arabic the next screen is to the left.
        const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
        step((e.key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1));
      }}
    >
      {item ? (
        <div className="ql-sheet" data-backdrop="true">
          <div className="ql-bar" data-backdrop="true">
            <span className="ql-pill" aria-live="polite">
              {labels.position
                .replace("{n}", String((index ?? 0) + 1))
                .replace("{total}", String(total))}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              title={labels.close}
              className="ql-round ql-close"
              autoFocus
            >
              <Close width={20} height={20} />
            </button>
          </div>

          <div className="ql-stage" data-backdrop="true">
            <div key={item.src} className="ql-device">
              <IpadFrame
                src={item.src}
                alt={item.alt}
                orientation={item.orientation}
                maxWidth={`min(72rem, calc((100dvh - 12rem) * ${
                  ASPECT_BY_SRC[item.src] ?? 4 / 3
                }))`}
                sizes="(min-width: 1280px) 1152px, 100vw"
              />
            </div>
          </div>

          <div className="ql-foot">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={labels.previous}
              title={labels.previous}
              className="ql-round"
            >
              <Arrow width={20} height={20} className="flip-rtl rotate-180" />
            </button>
            <p id={captionId} className="ql-caption">
              {item.caption}
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={labels.next}
              title={labels.next}
              className="ql-round"
            >
              <Arrow width={20} height={20} className="flip-rtl" />
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
