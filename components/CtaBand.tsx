import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { brand, whatsappLink } from "@/lib/brand";
import { Arrow, Whatsapp } from "./icons";
import Reveal from "./Reveal";
import { Container } from "./Section";

/**
 * Closing CTA — an espresso card floated on the page rather than a full-bleed
 * band, so it does not merge into the footer directly beneath it.
 */
export default async function CtaBand() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="bg-bg py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="band-espresso pearl-grid-dark relative overflow-hidden rounded-[2rem] px-6 py-14 sm:px-12">
            <span
              aria-hidden="true"
              className="blob -top-24 h-72 w-72 bg-caramel"
              style={{ insetInlineEnd: "-3rem" }}
            />
            <div className="relative flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-display max-w-xl text-3xl text-balance text-on-espresso sm:text-4xl">
                  {c.cta.title}
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-pretty text-on-espresso-dim">
                  {c.cta.sub}
                </p>
                <p className="mt-5 text-sm text-on-espresso-dim">
                  {c.cta.trust}
                </p>
                <p className="mt-1 text-xs text-on-espresso-dim opacity-75">
                  {brand.email}
                </p>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row lg:flex-col">
                <Link href="/contact" className="btn btn-on-espresso">
                  {c.cta.primary}
                  <Arrow width={18} height={18} className="flip-rtl" />
                </Link>
                <a
                  href={whatsappLink(c.contact.waTemplate)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-espresso"
                >
                  <Whatsapp width={18} height={18} />
                  {c.cta.secondary}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
