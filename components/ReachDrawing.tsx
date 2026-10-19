import { MarkShapes } from "./Logo";

/**
 * The contact section's line drawing: a chat bubble, a phone and an envelope,
 * each on a dashed line that runs into the Moving POS tile.
 *
 * Decorative only (`aria-hidden`). The dashes run and a square rides each line
 * as the drawing scrolls by, where the browser has view timelines and motion
 * is welcome (globals.css, "Scroll-linked touches"); otherwise it is a still
 * drawing. In Arabic the sources sit on the right and the lines run left into
 * a tile on the left, so the drawing reads in the page's direction.
 */
const LINES = [
  "M76 30H122V68H178",
  "M54 87H178",
  "M74 136H122V106H178",
] as const;

export default function ReachDrawing({
  rtl,
  className = "",
}: {
  rtl: boolean;
  className?: string;
}) {
  const flip = rtl ? "translate(260 0) scale(-1 1)" : undefined;

  return (
    <svg
      viewBox="0 0 260 162"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g transform={flip}>
        {/* A chat bubble with three dots in it — cells of the Kufic grid. */}
        <path
          d="M16 8H66A10 10 0 0 1 76 18V40A10 10 0 0 1 66 50H34L20 61V50H16A10 10 0 0 1 6 40V18A10 10 0 0 1 16 8Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <rect x="23" y="25" width="8" height="8" fill="currentColor" />
        <rect x="37" y="25" width="8" height="8" fill="var(--gold)" />
        <rect x="51" y="25" width="8" height="8" fill="currentColor" />

        {/* A phone. */}
        <rect
          x="26"
          y="64"
          width="28"
          height="46"
          rx="7"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M35 70H45M37 103H43"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* An envelope. */}
        <rect
          x="6"
          y="118"
          width="68"
          height="38"
          rx="4"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M8 121L40 141L72 121"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {LINES.map((d, i) => (
          <path
            key={d}
            className="reach-dash"
            d={d}
            stroke={i === 1 ? "var(--gold)" : "currentColor"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* Squares where the lines turn, always drawn. */}
        <rect x="117.5" y="44.5" width="9" height="9" fill="var(--gold)" />
        <rect x="117.5" y="116.5" width="9" height="9" fill="currentColor" />
        {/* Squares that ride the lines, only while they animate: a square-capped
            dash of length zero, moved along its line by its dash offset. */}
        {LINES.map((d) => (
          <path
            key={`ride-${d}`}
            className="reach-ride"
            d={d}
            pathLength={100}
            stroke="var(--gold)"
            strokeWidth="8"
            strokeLinecap="square"
          />
        ))}
      </g>
      {/* The tile stays outside the flip: a mirrored letter is not the mark. */}
      <g transform={`translate(${rtl ? 6 : 180} 50) scale(1.156)`}>
        <MarkShapes />
      </g>
    </svg>
  );
}
