/**
 * A string of pearls and a hairline from the reading edge across the column:
 * the house motif as a divider. Decorative. Where the scroll-linked rules in
 * globals.css run, it is laid down from the reading edge as it scrolls in.
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
