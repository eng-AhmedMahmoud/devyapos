import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { brand, mailtoLink, telLink, whatsappLink } from "@/lib/brand";
import { buildMetadata } from "@/lib/meta";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import { Icon } from "@/components/icons";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "contact", "/contact");
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);

  // Each channel card links where its title implies: WhatsApp, phone, mail,
  // and the demo (booked over WhatsApp like everything else in this market).
  const hrefs = [
    whatsappLink(c.contact.waTemplate),
    telLink,
    mailtoLink(c.meta.contact.title),
    whatsappLink(c.contact.waTemplate),
  ];

  return (
    <>
      <PageHero
        badge={c.contact.badge}
        title={c.contact.title}
        sub={c.contact.sub}
      />

      <section className="bg-bg pt-10 pb-20 sm:pb-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delay={100}>
              <div className="flex flex-col gap-4">
                <h2 className="font-display text-lg text-ink">
                  {c.contact.channels.title}
                </h2>
                {c.contact.channels.items.map((item, i) => (
                  <a
                    key={item.title}
                    href={hrefs[i]}
                    target={hrefs[i].startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="card lift flex items-start gap-4 p-5"
                  >
                    <span
                      className="icon-tile shrink-0"
                      style={{ ["--tile" as string]: "var(--brand)" }}
                    >
                      <Icon name={item.icon} />
                    </span>
                    <span>
                      <span className="block font-semibold text-ink">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm text-ink-dim">
                        {item.body}
                      </span>
                    </span>
                  </a>
                ))}
                {/* The concrete details, spelled out — a visitor should be
                    able to read the number and the inbox without clicking. */}
                <dl className="card-flat mt-2 flex flex-col gap-3 p-5 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-dim">{c.contact.channels.items[1].title}</dt>
                    <dd>
                      <a
                        href={telLink}
                        dir="ltr"
                        className="font-semibold text-brand transition-colors hover:text-caramel"
                      >
                        {brand.phoneDisplay}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-dim">{c.contact.channels.items[2].title}</dt>
                    <dd>
                      <a
                        href={mailtoLink(c.meta.contact.title)}
                        dir="ltr"
                        className="font-semibold text-brand transition-colors hover:text-caramel"
                      >
                        {brand.email}
                      </a>
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                    <dt className="text-ink-dim">{c.footer.madeBy}</dt>
                    <dd>
                      <a
                        href={brand.parent.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-brand transition-colors hover:text-caramel"
                      >
                        {brand.parent.name}
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Faq />
    </>
  );
}
