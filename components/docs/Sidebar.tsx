import type { DocsContent } from "@/content/docs/types";
import { Link } from "@/i18n/navigation";
import { articleHref, categoriesByGroup, categoryHref } from "@/lib/docs";
import Icon from "./DocIcon";
import SidebarToggle from "./SidebarToggle";

/**
 * Every category and article, grouped by who reads them. From 1024 px it is a sticky
 * column beside the page; below, a "browse topics" button opens it in place.
 * The current category is open, the current page is marked for screen readers
 * and with the saffron rule.
 */
export default function Sidebar({
  docs,
  current,
}: {
  docs: DocsContent;
  current: { category?: string; slug?: string };
}) {
  const { ui } = docs;
  return (
    <SidebarToggle label={ui.browse}>
      <nav aria-label={ui.browse} className="flex flex-col gap-7 pb-6">
        {categoriesByGroup(docs).map(({ group, categories }) => (
          <div key={group} className="flex flex-col gap-2">
            <p className="doc-label text-ink-dim">{ui.groups[group].title}</p>
            <ul className="flex flex-col">
              {categories.map((category) => {
                const open = category.id === current.category;
                const here = open && !current.slug;
                return (
                  <li key={category.id}>
                    <details open={open} className="group/cat">
                      <summary className="flex min-h-10 cursor-pointer items-center justify-between gap-2 text-[0.9375rem] font-medium text-ink">
                        <span className="flex items-center gap-2.5">
                          <Icon name={category.icon} size={16} className="text-ink-dim" />
                          {category.title}
                        </span>
                        <Icon
                          name="chevron"
                          size={14}
                          className="text-ink-dim transition-transform group-open/cat:rotate-90 rtl:-scale-x-100 rtl:group-open/cat:-rotate-90"
                        />
                      </summary>
                      <ul className="mb-2 flex flex-col border-s border-line ms-2">
                        <li>
                          <Link
                            href={categoryHref(category.id)}
                            aria-current={here ? "page" : undefined}
                            className={`-ms-px flex min-h-9 items-center border-s-2 ps-4 text-sm ${
                              here ? "border-saffron font-medium text-ink" : "border-transparent text-ink-dim hover:text-ink"
                            }`}
                          >
                            {ui.articles}
                          </Link>
                        </li>
                        {category.articles.map((a) => {
                          const active = open && a.slug === current.slug;
                          return (
                            <li key={a.slug}>
                              <Link
                                href={articleHref(category.id, a.slug)}
                                aria-current={active ? "page" : undefined}
                                className={`-ms-px flex min-h-9 items-center border-s-2 py-1.5 ps-4 text-sm leading-snug ${
                                  active
                                    ? "border-saffron font-medium text-ink"
                                    : "border-transparent text-ink-dim hover:text-ink"
                                }`}
                              >
                                {a.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </SidebarToggle>
  );
}
