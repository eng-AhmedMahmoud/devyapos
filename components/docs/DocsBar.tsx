import type { DocsContent } from "@/content/docs/types";
import { Link } from "@/i18n/navigation";
import { DOCS_BASE } from "@/lib/docs";
import Icon from "./DocIcon";
import DocsSearch from "./DocsSearch";

/** The strip under the site header on every help-centre page but its home: the way back, and search. */
export default function DocsBar({ docs, locale }: { docs: DocsContent; locale: string }) {
  const { ui } = docs;
  return (
    <div className="band-cream border-b border-line no-print">
      <div className="doc-wrap flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <Link
          href={DOCS_BASE}
          className="inline-flex min-h-11 shrink-0 items-center gap-2.5 font-display text-lg font-semibold text-ink"
        >
          <span className="inline-flex size-8 items-center justify-center bg-saffron text-on-saffron">
            <Icon name="book" size={18} />
          </span>
          {ui.name}
        </Link>
        <div className="w-full sm:max-w-md">
          <DocsSearch locale={locale} ui={ui.search} />
        </div>
      </div>
    </div>
  );
}
