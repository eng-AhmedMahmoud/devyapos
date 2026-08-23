import IpadFrame, { type IpadOrientation } from "./IpadFrame";

/**
 * A set of product screenshots framed as iPads.
 *
 * Every user-facing string — alt text, captions, the group label — arrives as a
 * prop, so the same component serves the Arabic and English trees without a
 * translation call of its own. Nothing here is localised, and nothing here is
 * directional: captions use `text-start` and a logical `me-*` gap, so the pearl
 * sits on the reading edge in both scripts.
 *
 * Two layouts:
 *   `lead`  (default) — the first shot at full width, the rest in a grid under it.
 *   `grid`            — every shot the same size.
 */

export type ShowcaseShot = {
  /** Path under /public, e.g. "/screenshots/pos-order.webp". */
  src: string;
  /** Translated description of the screen. */
  alt: string;
  /** Translated caption rendered beneath the device. */
  caption: string;
  orientation?: IpadOrientation;
};

export type ScreenshotShowcaseProps = {
  items: ShowcaseShot[];
  /** Translated label for the group, for screen readers. */
  ariaLabel?: string;
  layout?: "lead" | "grid";
  /** Columns for the supporting shots at `lg` and up. */
  columns?: 2 | 3;
  /** Eager-load the first device. Set only when the showcase is above the fold. */
  priority?: boolean;
  className?: string;
};

/** Written out in full so the Tailwind scanner sees the class names. */
const GRID: Record<2 | 3, string> = {
  2: "grid gap-8 sm:grid-cols-2 sm:gap-10",
  3: "grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3",
};

/** Caps handed to IpadFrame per slot, mirrored onto the caption so both align. */
const CAP = {
  lead: { landscape: "56rem", portrait: "26rem" },
  support: { landscape: "26rem", portrait: "17rem" },
} as const;

export default function ScreenshotShowcase({
  items,
  ariaLabel,
  layout = "lead",
  columns = 3,
  priority = false,
  className = "",
}: ScreenshotShowcaseProps) {
  if (items.length === 0) return null;

  const useLead = layout === "lead" && items.length > 1;
  const lead = useLead ? items[0] : null;
  const rest = useLead ? items.slice(1) : items;

  return (
    <div className={className || undefined} aria-label={ariaLabel}>
      {lead ? (
        <Shot
          shot={lead}
          slot="lead"
          priority={priority}
          sizes="(min-width: 1024px) 896px, 100vw"
        />
      ) : null}

      {rest.length > 0 ? (
        <ul className={`${GRID[columns]} ${lead ? "mt-12 sm:mt-14" : ""}`.trim()}>
          {rest.map((shot, i) => (
            <li key={shot.src}>
              <Shot
                shot={shot}
                slot="support"
                priority={priority && !lead && i === 0}
                sizes={
                  columns === 3
                    ? "(min-width: 1024px) 416px, (min-width: 640px) 45vw, 100vw"
                    : "(min-width: 640px) 45vw, 100vw"
                }
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function Shot({
  shot,
  slot,
  sizes,
  priority,
}: {
  shot: ShowcaseShot;
  slot: "lead" | "support";
  sizes: string;
  priority: boolean;
}) {
  const orientation = shot.orientation ?? "landscape";
  const cap = CAP[slot][orientation];

  return (
    <figure className="flex flex-col gap-4">
      <IpadFrame
        src={shot.src}
        alt={shot.alt}
        orientation={orientation}
        maxWidth={cap}
        sizes={sizes}
        priority={priority}
      />
      <figcaption
        className={`mx-auto w-full text-start leading-relaxed text-ink-dim ${
          slot === "lead" ? "text-base" : "text-sm"
        }`}
        style={{ maxWidth: cap }}
      >
        <span className="pearl me-2 align-baseline" aria-hidden="true" />
        {shot.caption}
      </figcaption>
    </figure>
  );
}
