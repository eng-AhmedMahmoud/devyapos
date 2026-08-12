import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { brand, whatsappLink } from "@/lib/brand";
import { Arrow, Whatsapp } from "./icons";
import Reveal from "./Reveal";
import { Container } from "./Section";

/** Closing CTA — the last risk-reversal line does the work here, not the copy. */
export default async function CtaBand() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="bg-surface py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-14 text-center sm:px-12">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -end-16 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -start-10 h-64 w-64 rounded-full bg-black/10 blur-2xl"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-3xl leading-tight font-bold text-balance text-white sm:text-4xl">
                {c.cta.title}
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-pretty text-white/85">
                {c.cta.sub}
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/contact" className="btn btn-on-dark w-full sm:w-auto">
                  {c.cta.primary}
                  <Arrow width={18} height={18} className="flip-rtl" />
                </Link>
                <a
                  href={whatsappLink(c.contact.waTemplate)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn w-full border border-white/40 text-white hover:bg-white/10 sm:w-auto"
                >
                  <Whatsapp width={18} height={18} />
                  {c.cta.secondary}
                </a>
              </div>
              <p className="mt-5 text-sm text-white/75">{c.cta.trust}</p>
              <p className="mt-1 text-xs text-white/60">{brand.email}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
