import { CUP, GLYPH, MARK, PLATE, STRIPE } from "./Logo";
import MotionScope from "./MotionScope";

/**
 * The mark, drawing itself in: the plate settles, the cup is traced in cream
 * and then filled, the tablet and pen land on its wall, the stripe pours up
 * from the base — and then, now and again, a boba pearl travels up the straw.
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
 * The drawing is never mirrored in RTL — a mirrored cup is not the mark — only
 * its placement follows the reading direction (see `.hero-mark`).
 */
export default function MarkDraw({ className = "" }: { className?: string }) {
  return (
    <MotionScope className={className}>
      <svg viewBox="0 0 512 512" className="block h-full w-full">
        <rect
          className="md-plate"
          width="512"
          height="512"
          rx="160"
          fill={PLATE}
        />
        {/* The trace: a stroked copy of the cup, drawn along its length and
            faded once the fill underneath it has arrived. */}
        <path
          className="md-trace"
          d={MARK.cup}
          pathLength={100}
          fill="none"
          stroke={CUP}
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path className="md-cup" d={MARK.cup} fill={CUP} fillRule="evenodd" />
        <path
          className="md-glyph"
          d={MARK.glyph}
          fill={GLYPH}
          fillRule="evenodd"
        />
        <path
          className="md-stripe"
          d={MARK.stripe}
          fill={STRIPE}
          fillRule="evenodd"
        />
        {/* Pearls sipped up the straw: up its upright stretch out of the lid,
            round the elbow, along the slant to the tip. Hidden at rest. */}
        <circle
          className="md-pearl motion-loop"
          cx="258"
          cy="164"
          r="6"
          fill={PLATE}
        />
        <circle
          className="md-pearl md-pearl-2 motion-loop"
          cx="258"
          cy="164"
          r="6"
          fill={PLATE}
        />
      </svg>
    </MotionScope>
  );
}
