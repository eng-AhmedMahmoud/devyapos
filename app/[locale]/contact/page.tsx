import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { mailtoLink, telLink, whatsappLink } from "@/lib/brand";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import ContactForm from "@/components/ContactForm";
import Faq from "@/components/Faq";
import { Icon } from "@/components/icons";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";
import WhatsappLink from "@/components/WhatsappLink";

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
  // The two WhatsApp cards are tracked apart — "message us" and "book a demo"
  // are different intents even though they open the same thread.
  const channels: { href: string; place?: string }[] = [
    { href: whatsappLink(c.contact.waTemplate), place: "contact_channel" },
    { href: telLink },
    { href: mailtoLink(c.meta.contact.title) },
    { href: whatsappLink(c.contact.waTemplate), place: "contact_channel_demo" },
  ];

  return (
    <>
      <JsonLd data={pageJsonLd(locale, "/contact")} />
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
                {c.contact.channels.items.map((item, i) => {
                  const channel = channels[i];
                  const body = (
                    <>
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
                    </>
                  );
                  const className = "card lift flex items-start gap-4 p-5";

                  return channel.place ? (
                    <WhatsappLink
                      key={item.title}
                      href={channel.href}
                      place={channel.place}
                      className={className}
                    >
                      {body}
                    </WhatsappLink>
                  ) : (
                    <a key={item.title} href={channel.href} className={className}>
                      {body}
                    </a>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Faq />
    </>
  );
}
