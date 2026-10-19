/**
 * A section edge in the square-Kufic step of the mark: flat, a step up, a
 * plateau, a step down — cut on the same grid the meem is drawn on, stretched
 * along the seam between two bands.
 *
 * Place it as a child of the section it belongs to (which needs `relative`):
 * it sits just above that section's top edge, painted in the section's own
 * colour, so the band appears to rise into the one before it. Absolutely
 * positioned, so it adds no height and shifts nothing.
 *
 * The plateau sits toward the inline end, so in RTL the drawing is mirrored —
 * a plain profile, not the mark, so flipping it is correct. Where view
 * timelines run, the step rises as the seam scrolls in (globals.css).
 */
export default function StepDivider({
  fill = "var(--surface-2)",
}: {
  fill?: string;
}) {
  return (
    <div aria-hidden="true" className="step-divider" style={{ color: fill }}>
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none">
        <path
          d="M0,48 H784 V26 H856 V4 H1224 V26 H1296 V48 H1440 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
