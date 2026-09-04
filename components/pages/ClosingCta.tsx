import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { whatsappLink } from "@/lib/brand";
import { Arrow, Whatsapp } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";

/**
 * A page's own closing invitation, in the card shape /about ends on.
 *
 * `CtaBand` still closes the page beneath it — it carries the site-wide offer.
 * This one carries the argument the page just made, which is the sentence a
 * visitor is actually answering.
 *
 * `whatsappFirst` exists because the pages disagree about the warmer route:
 * /hardware asks for a photo of your counter, which is a WhatsApp message, not
 * a booked demo.
 */
export default async function ClosingCta({
  title,
  body,
  primary,
  secondary,
  note,
  whatsappFirst = false,
}: {
  title: string;
  body: string;
  primary: string;
  secondary: string;
  note?: string;
  whatsappFirst?: boolean;
}) {
  const locale = await getLocale();
  const c = getContent(locale);

  const demoLabel = whatsappFirst ? secondary : primary;
  const waLabel = whatsappFirst ? primary : secondary;

  const demo = (
    <Link
      href="/contact"
      className={`btn ${whatsappFirst ? "btn-ghost bg-surface" : "btn-primary"}`}
    >
      {demoLabel}
      <Arrow width={18} height={18} className="flip-rtl" />
    </Link>
  );

  const whatsapp = (
    <a
      href={whatsappLink(c.contact.waTemplate)}
      target="_blank"
      rel="noreferrer"
      className={`btn ${whatsappFirst ? "btn-primary" : "btn-ghost bg-surface"}`}
    >
      <Whatsapp width={18} height={18} />
      {waLabel}
    </a>
  );

  return (
    <section className="bg-bg py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="card flex flex-col items-start gap-4 p-8 sm:p-10">
            <h2 className="font-display max-w-xl text-2xl text-balance text-ink sm:text-3xl">
              {title}
            </h2>
            <p className="max-w-2xl leading-relaxed text-pretty text-ink-dim">
              {body}
            </p>
            <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {whatsappFirst ? whatsapp : demo}
              {whatsappFirst ? demo : whatsapp}
            </div>
            {note ? (
              <p className="text-xs leading-relaxed text-ink-dim">{note}</p>
            ) : null}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
