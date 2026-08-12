import { brand } from "@/lib/brand";

/**
 * Wordmark lockup.
 *
 * The mark is the house motif — a cup with boba pearls — rather than a generic
 * SaaS glyph, so the marketing site reads as the same family as the product it
 * sells. Pure SVG on brand tokens, so it re-tints with the theme and costs no
 * image request.
 */
export default function Logo({
  tone = "auto",
  className = "",
}: {
  tone?: "auto" | "espresso";
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        width={32}
        height={32}
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="10" fill="var(--brand)" />
        {/* Cup */}
        <path
          d="M9.8 11.2h12.4l-1.5 11.1a2.4 2.4 0 0 1-2.4 2.1h-4.6a2.4 2.4 0 0 1-2.4-2.1L9.8 11.2Z"
          fill="none"
          stroke="var(--on-brand)"
          strokeWidth="1.9"
          strokeLinejoin="round"
        />
        {/* Straw */}
        <path
          d="M19.4 11.2 21.9 5.9"
          fill="none"
          stroke="var(--on-brand)"
          strokeWidth="1.9"
          strokeLinecap="round"
        />
        {/* Boba pearls */}
        <circle cx="13.9" cy="20.2" r="1.55" fill="var(--gold)" />
        <circle cx="17.9" cy="21" r="1.55" fill="var(--gold)" />
      </svg>
      <span
        className={`font-display text-xl ${
          tone === "espresso" ? "text-on-espresso" : "text-ink"
        }`}
      >
        {brand.wordmark}
      </span>
    </span>
  );
}
