import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { brand } from "@/lib/brand";
import Logo from "./Logo";

export default async function Footer() {
  const locale = await getLocale();
  const c = getContent(locale);
  const year = 2026;

  return (
    <footer className="dot-grid-dark bg-dark text-dark-ink-dim">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <Logo tone="dark" />
            <p className="max-w-xs text-sm leading-relaxed">{c.footer.blurb}</p>
            <a
              href={`mailto:${brand.email}`}
              className="text-sm font-medium text-brand-300 transition-colors hover:text-brand"
            >
              {brand.email}
            </a>
          </div>

          {c.footer.cols.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-dark-ink">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>
                    <Link
                      href={l.href}
                      className="text-sm transition-colors hover:text-brand-300"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-dark-line pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.wordmark}. {c.footer.legal}
          </p>
          <p>
            {c.footer.madeBy}{" "}
            <a
              href={brand.parent.url}
              className="font-semibold text-brand-300 transition-colors hover:text-brand"
              target="_blank"
              rel="noreferrer"
            >
              {brand.parent.name}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
