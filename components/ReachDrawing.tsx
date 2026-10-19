import { MarkShapes } from "./Logo";

/**
 * The contact section's line drawing: a chat bubble, a phone and an envelope,
 * each on a dashed line that runs into the Drinki POS tile.
 *
 * Decorative only (`aria-hidden`). The dashes run and a pearl rides each line
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
        {/* A chat bubble with three pearls in it. */}
        <path
          d="M16 8H66A10 10 0 0 1 76 18V40A10 10 0 0 1 66 50H34L20 61V50H16A10 10 0 0 1 6 40V18A10 10 0 0 1 16 8Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="27" cy="29" r="4" fill="currentColor" />
        <circle cx="41" cy="29" r="4" fill="var(--caramel)" />
        <circle cx="55" cy="29" r="4" fill="currentColor" />

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
            stroke={i === 1 ? "var(--caramel)" : "currentColor"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* Pearls where the lines turn, always drawn. */}
        <circle cx="122" cy="49" r="4.5" fill="var(--caramel)" />
        <circle cx="122" cy="121" r="4.5" fill="currentColor" />
        {/* Pearls that ride the lines, only while they animate: a round-capped
            dash of length zero, moved along its line by its dash offset. */}
        {LINES.map((d) => (
          <path
            key={`ride-${d}`}
            className="reach-ride"
            d={d}
            pathLength={100}
            stroke="var(--gold)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        ))}
      </g>
      {/* The tile stays outside the flip: a mirrored cup is not the mark. */}
      <g transform={`translate(${rtl ? 6 : 180} 50) scale(0.1445)`}>
        <MarkShapes />
      </g>
    </svg>
  );
}
