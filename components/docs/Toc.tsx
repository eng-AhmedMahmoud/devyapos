/**
 * "On this page": the article's sections, as a closed disclosure under the
 * title (native <details>, no script). The umbrella help centre also sets it
 * as a third column from 1280 px; this site's column is the header's 72rem,
 * which leaves no room for one beside the sidebar and the article.
 */
export default function Toc({
  title,
  items,
}: {
  title: string;
  items: { id: string; text: string }[];
}) {
  if (items.length < 2) return null;
  return (
    <details className="border border-line-strong px-4">
      <summary className="flex min-h-12 cursor-pointer items-center justify-between font-medium text-ink">
        {title}
        <span aria-hidden="true" className="doc-plus t-index text-lg">+</span>
      </summary>
      <nav aria-label={title} className="pb-4">
        <ol className="flex flex-col gap-1 border-s border-line">
          {items.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="-ms-px flex gap-2.5 border-s-2 border-transparent py-1.5 ps-4 text-sm leading-snug text-ink-dim hover:border-saffron hover:text-ink"
              >
                <span className="t-index text-[0.6875rem] leading-[1.6]">{String(i + 1).padStart(2, "0")}</span>
                <span>{s.text}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
