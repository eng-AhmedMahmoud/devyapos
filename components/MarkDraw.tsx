import { MARK } from "./Logo";
import MotionScope from "./MotionScope";

/**
 * The mark, drawing itself in: the tile settles, the letter is traced along
 * its outer edge and then filled, the window lights — and then, now and
 * again, the window flickers off and on like a shop sign.
 *
 * Every step is a CSS keyframe already in the server HTML (`.md-*` in
 * globals.css), so it plays at first paint without waiting for hydration, in
 * the manner of `Reveal immediate`. Each element's resting style is its final
 * state and the keyframes only describe where it comes from, so reduced
 * motion — which switches the animations off — is simply the finished mark,
 * identical to `MarkShapes`. The one paint-bound step is the trace
 * (`stroke-dashoffset`): it plays once, for about a second, on a 100-pixel
 * drawing. Everything after it is transform and opacity.
 *
 * The drawing is never mirrored in RTL — a mirrored letter is not the mark —
 * only its placement follows the reading direction (see `.hero-mark`).
 */
export default function MarkDraw({ className = "" }: { className?: string }) {
  const { x, y, size } = MARK.counter;

  return (
    <MotionScope className={className}>
      <svg viewBox={MARK.viewBox} className="block h-full w-full">
        <rect
          className="md-plate"
          width="64"
          height="64"
          rx={MARK.radius}
          fill="var(--mark-tile)"
        />
        {/* The trace: a stroked copy of the letter's edge, drawn along its
            length and faded once the fill underneath it has arrived. */}
        <path
          className="md-trace"
          d={MARK.outline}
          pathLength={100}
          fill="none"
          stroke="var(--mark-glyph)"
          strokeWidth="1.25"
        />
        <path
          className="md-glyph"
          d={MARK.glyph}
          fill="var(--mark-glyph)"
          fillRule="evenodd"
        />
        {/* The window: lands once the letter is there, then flickers now and
            again. Lit at rest. */}
        <rect
          className="md-window"
          x={x}
          y={y}
          width={size}
          height={size}
          fill="var(--mark-accent)"
        />
        <rect
          className="md-flicker motion-loop"
          x={x}
          y={y}
          width={size}
          height={size}
          fill="var(--mark-glyph)"
        />
      </svg>
    </MotionScope>
  );
}
