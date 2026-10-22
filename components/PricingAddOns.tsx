import type { SiteContent } from "@/content/types";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./Section";

/**
 * Add-ons, under the plan grid.
 *
 * The product sells more than the three packages: modules it marks
 * `addOn: true` in `devya-pos:ops-app/lib/plans.ts`, switched on per tenant.
 * Until 2026-10-22 none of them was on this site, so a buyer could not ask for
 * what they could not see. Most are priced per restaurant, so a card shows
 * "Quoted" rather than an invented number; the one with a published price
 * (accounting) links to its own page.
 */
export default function PricingAddOns({
  copy: a,
}: {
  /** `pricing.addOns`, passed down by the server page. */
  copy: SiteContent["pricing"]["addOns"];
}) {
  return (
    <section className="bg-bg pb-16 sm:pb-20">
      <Container>
        <SectionHead title={a.title} sub={a.sub} />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {a.items.map((item, i) => (
            <Reveal as="li" key={item.id} delay={(i % 3) * 60}>
              <article className="card flex h-full flex-col gap-3 p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg text-ink">{item.name}</h3>
                  <span className="text-sm font-bold text-brand">
                    {item.price}
                  </span>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-ink-2">
                  {item.body}
                </p>
                {item.href && item.linkLabel ? (
                  <Link
                    href={item.href}
                    className="inline-flex min-h-11 items-center text-sm font-bold text-ink underline underline-offset-4"
                  >
                    {item.linkLabel}
                  </Link>
                ) : null}
              </article>
            </Reveal>
          ))}
        </ul>
        <p className="mt-5 max-w-3xl text-xs leading-relaxed text-ink-dim">
          {a.note}
        </p>
      </Container>
    </section>
  );
}
