import { Link } from "@/i18n/navigation";
import type { Crumb } from "@/lib/docs";
import Icon from "./DocIcon";

export type { Crumb };

/**
 * The trail above a help-centre page. The separator is the site's chevron,
 * mirrored in RTL like the arrows. The same list feeds the BreadcrumbList
 * structured data (lib/jsonld.ts), so the two cannot disagree.
 */
export default function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-ink-dim">
        {items.map((c, i) => (
          <li key={`${i}-${c.label}`} className="flex items-center gap-1.5">
            {i > 0 ? (
              <Icon name="chevron" size={14} className="doc-arrow text-ink-dim" />
            ) : null}
            {c.href ? (
              <Link href={c.href} className="inline-flex min-h-8 items-center hover:text-ink hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
