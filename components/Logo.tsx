import { brand } from "@/lib/brand";

/**
 * Wordmark lockup.
 *
 * The mark is the house motif — a lidded takeaway cup, with a tablet-and-pen
 * glyph on the wall where the order is taken — rather than a generic SaaS
 * glyph, so the marketing site reads as the same family as the product it
 * sells. Traced from the brand artwork into flat paths, so it costs no image
 * request and stays crisp at any size.
 *
 * ── Why the tile does not follow the theme ─────────────────────────────────
 * Every other surface the mark appears on — the favicon, the iOS home screen,
 * the Facebook page, the demo tenant inside the POS — is a baked raster with
 * no CSS to read. A tile painted from `var(--brand)` would therefore be one
 * colour here and another everywhere else, and a logo that changes colour
 * between the tab and the page it opens reads as two brands. The plate is the
 * espresso the artwork was drawn on, fixed in both themes; only the wordmark
 * beside it takes theme ink.
 *
 * The three fills are layered, not stroked: cup, then the glyph inside it,
 * then the cream stripe. `evenodd` is what makes the cup an outline rather
 * than a solid — the inner loops are holes, and the default `nonzero` would
 * fill them.
 */
const MARK = {
  cup: "M324.3,81.9 L264.1,116.0 L259.8,119.3 L257.5,125.2 L249.2,169.0 L247.9,171.5 L194.5,171.7 L187.7,173.5 L182.8,176.7 L177.3,183.3 L175.9,186.3 L172.9,199.8 L171.0,201.4 L169.0,201.7 L164.3,204.0 L159.7,208.9 L157.1,214.2 L153.5,230.3 L152.7,237.9 L153.8,240.0 L157.8,243.1 L168.1,243.1 L170.6,244.4 L188.5,410.6 L189.9,415.0 L194.1,421.7 L199.8,426.6 L203.9,428.6 L211.5,430.1 L303.7,429.8 L308.7,428.3 L315.2,424.5 L318.8,420.5 L322.9,413.5 L324.7,405.3 L325.9,389.4 L341.4,245.0 L342.7,243.1 L354.2,243.1 L356.8,241.6 L358.7,239.4 L359.3,234.4 L355.8,217.1 L352.6,208.9 L348.0,204.3 L339.4,200.1 L337.0,188.9 L334.7,182.8 L330.1,177.3 L326.0,174.4 L322.8,172.9 L317.2,171.7 L267.0,171.7 L266.3,171.0 L266.3,168.7 L274.2,130.8 L278.5,127.7 L326.3,101.0 L332.6,96.7 L332.9,95.6 L326.5,83.8 L324.3,81.9Z M205.2,185.7 L318.1,185.8 L321.0,187.3 L322.6,189.5 L325.3,200.1 L324.3,201.1 L187.7,201.1 L187.0,200.4 L188.5,192.4 L191.3,187.3 L194.8,185.8 L205.2,185.7Z M173.5,215.0 L338.6,214.9 L340.4,215.8 L342.0,218.3 L344.1,228.3 L343.0,229.3 L169.3,229.3 L168.2,227.7 L169.7,218.9 L170.3,217.4 L173.5,215.0Z M185.3,243.2 L323.4,243.1 L327.2,243.4 L327.9,244.1 L310.3,407.6 L308.5,411.4 L306.1,413.9 L300.8,416.0 L210.6,416.0 L205.9,413.9 L203.2,410.9 L201.7,407.0 L185.5,257.9 L184.4,246.5 L184.4,244.1 L185.3,243.2Z",
  glyph: "M281.7,287.7 L276.3,293.1 L249.2,325.1 L246.6,330.4 L246.0,333.4 L246.8,334.1 L250.3,333.2 L254.5,330.4 L285.1,294.3 L286.2,292.5 L285.9,289.6 L283.4,287.7 L281.7,287.7Z M237.1,290.3 L233.7,292.5 L232.2,295.5 L232.2,349.8 L233.1,351.6 L237.1,354.6 L275.2,354.6 L276.4,354.0 L278.9,351.8 L280.1,349.5 L279.6,307.7 L273.9,314.6 L273.5,341.1 L247.0,341.4 L238.1,340.7 L238.1,297.0 L238.8,296.2 L267.6,296.2 L272.1,290.8 L237.1,290.3Z M256.0,343.9 L258.5,344.7 L260.1,346.9 L259.5,350.1 L256.7,352.0 L253.8,351.4 L251.9,348.3 L252.5,346.0 L254.1,344.4 L256.0,343.9Z",
  stripe: "M201.0,252.2 L196.7,255.0 L195.5,257.6 L195.5,262.0 L210.2,396.5 L212.0,403.8 L214.8,406.3 L219.5,406.6 L223.1,403.5 L224.0,401.5 L224.0,397.9 L208.7,257.9 L206.2,253.7 L204.2,252.5 L201.0,252.2Z",
};

/**
 * The mark's own palette. Deliberately not theme tokens: `--on-brand` is the
 * ink that sits ON the brand colour, so it inverts between themes — on a fixed
 * plate that would paint the cup dark-on-dark the moment the site switches to
 * the dark theme. These are the artwork's colours, the same three bytes the
 * favicon and the iOS icon are baked from.
 */
const PLATE = "#231717";
const CUP = "#FFF6EE";
const GLYPH = "#D8A98F";
const STRIPE = "#C8853C";

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
        viewBox="0 0 512 512"
        width={32}
        height={32}
        aria-hidden="true"
        className="shrink-0"
      >
        <rect width="512" height="512" rx="160" fill={PLATE} />
        {/* Cup, lid and straw */}
        <path d={MARK.cup} fill={CUP} fillRule="evenodd" />
        {/* The tablet and pen on the cup wall */}
        <path d={MARK.glyph} fill={GLYPH} fillRule="evenodd" />
        {/* The stripe, carried in gold so it holds against the cream cup */}
        <path d={MARK.stripe} fill={STRIPE} fillRule="evenodd" />
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
