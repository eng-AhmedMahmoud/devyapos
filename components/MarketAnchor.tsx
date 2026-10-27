import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Container } from "@/components/Section";
import Reveal from "@/components/Reveal";
import { formatDate } from "@/lib/format";

/**
 * What the rest of the Egyptian market charges, next to what we charge.
 *
 * "Affordable" is a claim; 799 against 2,848.95 is a number. The comparison is
 * per branch per month, because that is the only unit where the two are
 * actually comparable — the enterprise tiers also bill per terminal and sell
 * loyalty and delivery as add-ons, which the row notes say rather than quietly
 * ignoring.
 *
 * The competitor figures are our own record, not a price list Foodics
 * publishes (social-launch-plan §1.5), so the copy says whose record it is and
 * the date comes from `retrievedAt` rather than being typed into the sentence:
 * a test fails once that date is 90 days old. Someone else's price is not ours
 * to promise; it moves, and a stale number on a live page is a liability.
 * Keeping the rows in one content key means updating them is a copy edit, not
 * a code change.
 */
export default async function MarketAnchor() {
  const locale = await getLocale();
  const c = getContent(locale);
  const a = c.pricing.marketAnchor;
  const date = formatDate(locale, a.retrievedAt);

  return (
    <section className="bg-bg py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-2xl text-ink sm:text-3xl">
              {a.title}
            </h2>
            <p className="max-w-2xl text-ink-dim">
              {a.sub.replace("{date}", date)}
            </p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <ul className="mt-8 flex flex-col gap-3">
            {a.rows.map((row) => (
              <li
                key={row.name}
                className={`
                  flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-2xl
                  border p-5
                  ${
                    row.ours
                      ? "border-brand/50 bg-brand-soft"
                      : "border-line bg-surface"
                  }
                `}
              >
                <span
                  className={`font-display text-base ${
                    row.ours ? "text-brand" : "text-ink"
                  }`}
                >
                  {row.name}
                </span>
                <span
                  className={`font-display ms-auto text-xl ${
                    row.ours ? "text-brand" : "text-ink-dim"
                  }`}
                >
                  {row.price}
                </span>
                {/* Full-width on its own line: the caveat is the part that
                    keeps the comparison honest, so it must not be clipped. */}
                <span className="w-full text-xs text-ink-dim">{row.note}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-dim">
            {a.note}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
