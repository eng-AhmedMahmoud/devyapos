import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Container } from "@/components/Section";
import Reveal from "@/components/Reveal";

/**
 * The positioning statement: a fitted experience, not a licence to software.
 *
 * It sits after the showcase deliberately. Making this claim before the visitor
 * has seen the product reads as a slogan; making it straight after they have
 * just looked at seven screens and a recording reframes what they saw — that
 * was one deployment, and theirs would be built to look like them.
 *
 * Set on the espresso band because the sentence is the loudest thing the site
 * says about itself, and it should not share visual weight with the feature
 * grid above it.
 */
export default async function BrandPromise() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="band-espresso pearl-grid-dark border-y border-espresso-line py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="flex max-w-3xl flex-col gap-3">
            <span className="kicker">
              <span className="pearl" aria-hidden="true" />
              {c.promise.eyebrow}
            </span>
            <h2 className="font-display mt-1 text-2xl leading-tight text-on-espresso sm:text-3xl md:text-4xl">
              {c.promise.title}
            </h2>
            <p className="text-on-espresso-dim">{c.promise.sub}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {c.promise.items.map((item, i) => (
            <Reveal key={item.title} delay={90 + i * 80}>
              <div
                className="
                  h-full rounded-2xl border border-espresso-line p-6
                  transition-colors duration-300 hover:border-gold/50
                "
                style={{
                  background:
                    "color-mix(in srgb, var(--on-espresso) 4%, transparent)",
                }}
              >
                <h3 className="font-display text-lg text-on-espresso">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-on-espresso-dim">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
