import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { brand, mailtoLink, socialLinks, telLink } from "@/lib/brand";
import { Icon } from "./icons";
import Logo from "./Logo";

export default async function Footer() {
  const locale = await getLocale();
  const c = getContent(locale);
  const year = 2026;

  return (
    <footer className="band-espresso pearl-grid-dark">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-4">
            <Logo tone="espresso" />
            <p className="max-w-xs text-sm leading-relaxed text-on-espresso-dim">
              {c.footer.blurb}
            </p>
            {/* Both routes spelled out; `dir="ltr"` keeps the number and the
                address from being reordered inside the Arabic column. */}
            <div className="flex flex-col gap-1.5">
              <a
                href={telLink}
                dir="ltr"
                className="w-fit text-sm font-bold text-gold transition-colors hover:text-on-espresso"
              >
                {brand.phoneDisplay}
              </a>
              <a
                href={mailtoLink()}
                dir="ltr"
                className="w-fit text-sm font-bold text-gold transition-colors hover:text-on-espresso"
              >
                {brand.email}
              </a>
            </div>

            {/* No `dir` override here, unlike the phone and email above. Those
                two carry Latin digits and an address that RTL would reorder, so
                they need pinning; a row of icons has nothing to reorder. Forcing
                `ltr` only made the row start from the left edge of a column that
                is right-aligned in Arabic, leaving the icons adrift under a
                flush-right email. Letting them inherit direction puts them
                directly under it in both locales. */}
            <ul aria-label={c.footer.social} className="mt-1 flex gap-3">
              {socialLinks.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="me noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-espresso-line text-on-espresso-dim transition-colors hover:border-gold hover:text-gold"
                  >
                    <Icon name={s.key} width={20} height={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {c.footer.cols.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-bold text-on-espresso">{col.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>
                    <Link
                      href={l.href}
                      className="text-sm text-on-espresso-dim transition-colors hover:text-gold"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/*
          Who operates the product, in one sentence, on every page in both
          locales. `trustLine.withCr` says the same thing with a commercial
          registration number, but it still carries the literal `{cr}`
          placeholder — shipping that token is worse than shipping no number,
          so `short` is what renders until a real CR replaces it.
        */}
        <p className="mt-12 max-w-3xl border-t border-espresso-line pt-6 text-xs leading-relaxed text-on-espresso-dim">
          {c.trustLine.short}
        </p>

        <div className="mt-6 flex flex-col gap-3 text-xs text-on-espresso-dim sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand.wordmark}. {c.footer.legal}
          </p>
          <p>
            {c.footer.madeBy}{" "}
            <a
              href={brand.parent.url}
              className="font-bold text-gold transition-colors hover:text-on-espresso"
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
