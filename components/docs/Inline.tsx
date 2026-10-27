import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { brand } from "@/lib/brand";
import { parseInline } from "@/lib/docs/inline";

/**
 * A link out of an article. Content names no host (lib/brand.ts holds them),
 * so the sister product's site is written `{stores}` and lands on its page in
 * the reader's language. No campaign tags: the site runs no tracker.
 */
function outboundHref(href: string, locale: string) {
  return href.replace("{stores}", `${brand.stores.url}/${locale}`);
}

/**
 * Renders the help centre's inline marks (lib/docs/inline.ts): UI labels in
 * the weight the screen sets them, literals as one isolated LTR run so a URL
 * or a code never reorders inside Arabic, links to this site's pages and
 * articles through the locale-aware Link, and links out in a new tab.
 */
export default function Inline({ text }: { text: string }) {
  const locale = useLocale();
  return (
    <>
      {parseInline(text).map((token, i) => {
        switch (token.k) {
          case "text":
            return token.v;
          case "ui":
            return (
              <strong key={i} className="font-semibold text-ink">
                {token.v}
              </strong>
            );
          case "code":
            return (
              <code
                key={i}
                dir="ltr"
                className="t-index rounded-[2px] border border-line bg-surface px-1 py-px text-[0.875em] whitespace-nowrap text-ink"
              >
                {token.v}
              </code>
            );
          case "link":
            // One leading slash: "//host" is protocol-relative, not this site.
            return /^\/(?!\/)/.test(token.href) ? (
              <Link key={i} href={token.href} className="doc-more font-medium text-ink">
                {token.v}
              </Link>
            ) : (
              <a
                key={i}
                href={outboundHref(token.href, locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="doc-more font-medium text-ink"
              >
                {token.v}
              </a>
            );
        }
      })}
    </>
  );
}
