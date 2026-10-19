import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { brand, mailtoLink, telLink, whatsappLink } from "@/lib/brand";
import { Arrow, Mail, Phone, Whatsapp } from "@/components/icons";
import PearlRule from "@/components/PearlRule";
import ReachDrawing from "@/components/ReachDrawing";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";
import WhatsappLink from "@/components/WhatsappLink";

/**
 * "Reach us" on the home page, just above the closing CTA: WhatsApp, the
 * business line and the inbox as three plain rows, beside a drawing of the
 * messages arriving. No form here — /contact has it — so nothing is stored.
 *
 * Each value is its own LTR run inside a block that keeps the page's
 * direction, so the number and the address read correctly and still sit on
 * the reading edge in Arabic.
 */
export default async function HomeContact() {
  const locale = await getLocale();
  const c = getContent(locale);
  const t = c.homeContact;

  const row = "group flex min-h-18 items-center gap-4 py-3 text-ink";
  const body = (
    Icon: typeof Mail,
    label: string,
    value: string,
    tile: string,
  ) => (
    <>
      <span
        className="icon-tile shrink-0"
        style={{ ["--tile" as string]: tile }}
      >
        <Icon width={20} height={20} />
      </span>
      <span className="min-w-0 flex-1 text-start">
        <span className="block text-xs font-bold tracking-wide text-ink-dim">
          {label}
        </span>
        <span
          dir="ltr"
          className="text-base font-semibold [overflow-wrap:anywhere] [unicode-bidi:isolate] group-hover:underline group-hover:underline-offset-4 sm:text-lg"
        >
          {value}
        </span>
      </span>
      <Arrow
        width={18}
        height={18}
        className="reach-arrow flip-rtl shrink-0 text-caramel"
      />
    </>
  );

  return (
    <section
      id="reach"
      aria-labelledby="reach-title"
      className="band-cream py-20 sm:py-24"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="min-w-0">
          <PearlRule className="mb-8" />
          <Reveal className="flex flex-col items-start gap-4">
            <span className="kicker">
              <span className="pearl" aria-hidden="true" />
              {t.eyebrow}
            </span>
            <h2
              id="reach-title"
              className="font-display max-w-xl text-3xl text-balance text-ink sm:text-[2.6rem]"
            >
              {t.title}
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-pretty text-ink-dim sm:text-lg">
              {t.sub}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <ul className="mt-8 flex flex-col border-t border-line">
              <li className="border-b border-line">
                <WhatsappLink
                  href={whatsappLink(c.contact.waTemplate)}
                  place="home_contact"
                  className={row}
                >
                  {body(Whatsapp, t.whatsapp, brand.phoneDisplay, "var(--mint)")}
                </WhatsappLink>
              </li>
              <li className="border-b border-line">
                <a href={telLink} className={row}>
                  {body(Phone, t.phone, brand.phoneDisplay, "var(--brand)")}
                </a>
              </li>
              <li className="border-b border-line">
                <a href={mailtoLink(t.emailSubject)} className={row}>
                  {body(Mail, t.email, brand.email, "var(--caramel)")}
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <ReachDrawing
            rtl={locale === "ar"}
            className="mx-auto w-full max-w-md text-ink"
          />
        </Reveal>
      </Container>
    </section>
  );
}
