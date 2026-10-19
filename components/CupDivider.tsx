/**
 * A section edge in the profile of the cup's lid: flat, a step up to the rim,
 * the dome, and back down — the mark's silhouette stretched along the seam
 * between two bands.
 *
 * Place it as a child of the section it belongs to (which needs `relative`):
 * it sits just above that section's top edge, painted in the section's own
 * colour, so the band appears to rise into the one before it. Absolutely
 * positioned, so it adds no height and shifts nothing.
 *
 * The dome sits toward the inline end, so in RTL the drawing is mirrored —
 * a plain curve, not the mark, so flipping it is correct. Where view
 * timelines run, the dome rises as the seam scrolls in (globals.css).
 */
export default function CupDivider({
  fill = "var(--surface-2)",
}: {
  fill?: string;
}) {
  return (
    <div aria-hidden="true" className="cup-divider" style={{ color: fill }}>
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none">
        <path
          d="M0,48 H760 C780,48 784,30 804,30 H836 C880,30 900,6 1040,6 C1180,6 1200,30 1244,30 H1276 C1296,30 1300,48 1320,48 H1440 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
