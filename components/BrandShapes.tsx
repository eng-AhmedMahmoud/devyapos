import { MARK } from "./Logo";
import MotionScope from "./MotionScope";

/**
 * Faint letters, outlines and receipts drifting behind a section — the mark
 * taken apart and scattered as texture. The meem and its outline are the
 * mark's own paths (`MARK` in Logo.tsx), the outline drawn the way Moving
 * Stores' Kufic trail draws its frames; the receipt is the one shape the mark
 * does not carry.
 *
 * Decorative only: `aria-hidden`, no pointer events, painted behind the
 * section's content (the section needs `relative isolate`), and clipped to its
 * own box so it never widens the page. Ink is `currentColor` at low opacity —
 * amber on the page, bone on the dark bands — so it follows the theme.
 *
 * Motion is a slow transform-only float, paused off screen by `MotionScope`,
 * plus a little parallax from the view timeline where the browser has one.
 * Reduced motion leaves the shapes where they are.
 *
 * In RTL the layout is mirrored — sides, tilt and drift all follow the reading
 * direction (`--dir` in globals.css) — but the artwork itself is not flipped:
 * a mirrored letter is not the mark.
 */

type Kind = "meem" | "frame" | "receipt";

type Placement = {
  kind: Kind;
  /** Rendered size in rem. */
  size: number;
  /** Distance from the section's top, as a percentage of its height. */
  top: number;
  side: "start" | "end";
  /** Distance from that side, as a percentage of the section's width. */
  inset: number;
  /** Resting tilt in degrees, measured toward the reading direction. */
  tilt: number;
  /** Seconds into the float cycle, so neighbours do not move in step. */
  phase: number;
};

const LAYOUTS = {
  // Features: a letter beside the head, an outline and a receipt among the cards.
  features: [
    { kind: "meem", size: 8, top: 4, side: "end", inset: 3, tilt: 0, phase: 0 },
    { kind: "frame", size: 5, top: 46, side: "start", inset: 1, tilt: -6, phase: -5 },
    { kind: "receipt", size: 6, top: 80, side: "end", inset: 6, tilt: 6, phase: -9 },
  ],
  // The proof band: a receipt and a letter, one at either edge.
  proof: [
    { kind: "receipt", size: 7, top: 10, side: "start", inset: 2, tilt: -7, phase: -3 },
    { kind: "meem", size: 7, top: 62, side: "end", inset: 2, tilt: 0, phase: -8 },
  ],
  // The closing card: kept to two, small, at the far side from the buttons.
  cta: [
    { kind: "frame", size: 6, top: 58, side: "start", inset: 44, tilt: 0, phase: -2 },
    { kind: "meem", size: 4, top: 12, side: "start", inset: 58, tilt: 6, phase: -7 },
  ],
} satisfies Record<string, Placement[]>;

/** A till receipt in a 512-unit box: torn edge along the bottom. */
const RECEIPT =
  "M150,64 H362 V440 L335.5,420 L309,440 L282.5,420 L256,440 L229.5,420 L203,440 L176.5,420 L150,440Z";
const RECEIPT_LINES = "M190,130 H322 M190,190 H300 M190,250 H322 M190,330 H250 M286,330 H322";

/** Each shape's own box, cropped to its ink so the sizes above are honest. */
const VIEWBOX: Record<Kind, string> = {
  meem: "6 6 52 52",
  frame: "6 6 52 52",
  receipt: "130 50 252 400",
};

function Shape({ kind }: { kind: Kind }) {
  if (kind === "receipt") {
    return (
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d={RECEIPT} />
        <path d={RECEIPT_LINES} />
      </g>
    );
  }
  if (kind === "frame") {
    return (
      <g fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d={MARK.outline} />
        <rect
          x={MARK.counter.x}
          y={MARK.counter.y}
          width={MARK.counter.size}
          height={MARK.counter.size}
        />
      </g>
    );
  }
  return <path d={MARK.glyph} fill="currentColor" fillRule="evenodd" />;
}

export default function BrandShapes({
  layout,
  tone = "page",
}: {
  layout: keyof typeof LAYOUTS;
  tone?: "page" | "espresso";
}) {
  return (
    <MotionScope
      className={`brand-shapes ${tone === "espresso" ? "brand-shapes-espresso" : ""}`.trim()}
    >
      {LAYOUTS[layout].map((p, i) => (
        <span
          key={i}
          className="bs-shape"
          style={
            {
              width: `${p.size}rem`,
              height: `${p.size}rem`,
              top: `${p.top}%`,
              [p.side === "start" ? "insetInlineStart" : "insetInlineEnd"]: `${p.inset}%`,
              "--tilt": `${p.tilt}deg`,
              "--phase": `${p.phase}s`,
            } as React.CSSProperties
          }
        >
          <svg
            viewBox={VIEWBOX[p.kind]}
            className="motion-loop block h-full w-full"
          >
            <Shape kind={p.kind} />
          </svg>
        </span>
      ))}
    </MotionScope>
  );
}
