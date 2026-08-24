import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Container } from "@/components/Section";
import Reveal from "@/components/Reveal";

/**
 * The payment gateways a restaurant can run through Sufra.
 *
 * Two statuses, kept visually distinct on purpose. Paymob is integrated and
 * shipping; the rest are gateways we wire to your account during onboarding.
 * Listing them all as equals would read as "supported out of the box" and would
 * not be true — the only payment integration in the backend today is Paymob,
 * so anything else is a piece of work we do for you, and the badge says so.
 *
 * The marks are typographic, not the providers' own logo files. Embedding
 * someone else's trademarked artwork is a licensing decision for the business
 * to make deliberately, and a hand-drawn imitation of a logo is worse than none
 * — it misrepresents a brand's identity. Each chip is a plain name; dropping in
 * a real asset later means swapping the <span> for an <Image>.
 */
export default async function PaymentProviders() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="bg-bg py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="flex flex-col gap-2">
            <span className="kicker">
              <span className="pearl" aria-hidden="true" />
              {c.payments.eyebrow}
            </span>
            <h2 className="font-display mt-2 text-2xl text-ink sm:text-3xl">
              {c.payments.title}
            </h2>
            <p className="max-w-2xl text-ink-dim">{c.payments.sub}</p>
          </div>
        </Reveal>

        <Reveal delay={90}>
          <ul className="mt-8 flex flex-wrap gap-3">
            {c.payments.providers.map((p) => (
              <li
                key={p.name}
                className={`
                  flex items-center gap-3 rounded-2xl border px-4 py-3
                  transition-colors
                  ${
                    p.live
                      ? "border-brand/45 bg-surface-2"
                      : "border-line bg-surface hover:border-brand/35"
                  }
                `}
              >
                {/* Latin-script names, so they are pinned to LTR even in the
                    Arabic layout — an Arabic paragraph would otherwise reorder
                    a bare brand name sitting next to a badge. */}
                <span
                  dir="ltr"
                  className="font-display text-base text-ink"
                >
                  {p.name}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    p.live
                      ? "bg-brand text-on-brand"
                      : "bg-line-soft text-ink-dim"
                  }`}
                >
                  {p.live ? c.payments.liveLabel : c.payments.onRequestLabel}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-ink-dim">
            {c.payments.note}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
