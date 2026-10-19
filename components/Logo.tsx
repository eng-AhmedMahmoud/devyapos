import { brand } from "@/lib/brand";

/**
 * The Moving mark, and the Moving POS lockup.
 *
 * The mark is Moving Stores' (devya-commerce apps/admin/components/brand/
 * brand-mark.tsx, also the moving.devya.dev umbrella site): on an 8 × 8 grid of
 * 8-unit cells, a square-Kufic "م" — meem, the first letter of موفينج — whose
 * counter is a lit saffron window. One mark for the whole family; the product
 * is named by the wordmark beside it, not by a variant of the letter.
 *
 * Colours come from `--mark-*` (globals.css), so the mark follows the theme
 * and the band it sits on: an ink tile on bone paper, a bone tile on the night
 * ground and on the dark bands. `app/icon.svg` does the same through
 * `prefers-color-scheme`, and the baked rasters (apple-icon, the 192/512 PNGs,
 * the OG cards) carry the light-theme colours, as Moving Stores' do. Never
 * mirrored in RTL: a mirrored letter is not the mark.
 *
 * `evenodd` is what cuts the counter out of the loop; the saffron square is
 * painted into that hole. Exported so drawings built from the mark
 * (`MarkDraw`, `BrandShapes`, `ReachDrawing`) reuse these exact shapes rather
 * than carrying a second, drifting copy. `scripts/render-brand-assets.mjs` and
 * `app/icon.svg` carry the same path.
 */
export const MARK = {
  viewBox: "0 0 64 64",
  radius: 3,
  glyph: "M24 8H56V40H16V56H8V32H24Z M32 16V32H48V16Z",
  /** The letter's outer edge alone, without the counter — what gets traced. */
  outline: "M24 8H56V40H16V56H8V32H24Z",
  counter: { x: 32, y: 16, size: 16 },
} as const;

/** The tile, the letter and its lit window as SVG shapes in a 64-unit box. */
export function MarkShapes() {
  return (
    <>
      <rect width="64" height="64" rx={MARK.radius} fill="var(--mark-tile)" />
      <path d={MARK.glyph} fill="var(--mark-glyph)" fillRule="evenodd" />
      <rect
        x={MARK.counter.x}
        y={MARK.counter.y}
        width={MARK.counter.size}
        height={MARK.counter.size}
        fill="var(--mark-accent)"
      />
    </>
  );
}

/**
 * Mark + wordmark, as Moving Stores sets "Moving Stores": the display face,
 * the family name bold and the product regular at 70%, the type at 0.68 of the
 * mark and the gap at 0.4. Arabic pages set the Arabic family name. No
 * letter-spacing in Arabic.
 */
export default function Logo({
  locale,
  size = 30,
  tone = "auto",
  className = "",
}: {
  locale: string;
  size?: number;
  tone?: "auto" | "espresso";
  className?: string;
}) {
  const [family, product] = locale === "ar" ? brand.wordmark.ar : brand.wordmark.en;

  return (
    <span
      className={`inline-flex items-center ${className}`}
      style={{ gap: size * 0.4 }}
    >
      <svg
        viewBox={MARK.viewBox}
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
        className="shrink-0"
      >
        <MarkShapes />
      </svg>
      <span
        className={`font-display leading-none whitespace-nowrap ${
          locale === "en" ? "tracking-[-0.01em]" : ""
        } ${tone === "espresso" ? "text-on-espresso" : "text-ink"}`}
        style={{ fontSize: size * 0.68 }}
      >
        <span className="font-bold">{family}</span>{" "}
        <span className="font-normal opacity-70">{product}</span>
      </span>
    </span>
  );
}
