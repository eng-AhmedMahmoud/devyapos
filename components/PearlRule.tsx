/**
 * Three cells of the Kufic grid and a hairline from the reading edge across
 * the column: the house motif as a divider. The cells are `.pearl` — saffron
 * squares now, the class name kept from the boba pearls they replaced.
 * Decorative. Where the scroll-linked rules in globals.css run, it is laid
 * down from the reading edge as it scrolls in.
 */
export default function PearlRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pearl-rule ${className}`.trim()}>
      <span className="pearl" />
      <span className="pearl pearl-lg" />
      <span className="pearl" />
      <span className="pearl-rule-line" />
    </div>
  );
}
