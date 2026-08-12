import { brand } from "@/lib/brand";

/**
 * Wordmark lockup. The mark is a cloche (سفرة = the laid table) drawn as a
 * dome over a plate line — pure SVG so it stays crisp on any background and
 * costs no image request.
 */
export default function Logo({
  tone = "light",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        width={30}
        height={30}
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="9" fill="var(--brand)" />
        <path
          d="M8 20.5h16M16 9.4v1.6M9.8 20.2a6.2 6.2 0 0 1 12.4 0"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="8.4" r="1.5" fill="#fff" />
      </svg>
      <span
        className={`font-display text-lg font-semibold tracking-tight ${
          tone === "dark" ? "text-dark-ink" : "text-ink"
        }`}
      >
        {brand.wordmark}
      </span>
    </span>
  );
}
