import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { brand, whatsappLink } from "@/lib/brand";
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

  // Each channel card links where its title implies: WhatsApp, mail, demo.
  const hrefs = [
    whatsappLink(c.contact.waTemplate),
    `mailto:${brand.email}`,
    whatsappLink(c.contact.waTemplate),
  ];

  return (
    <>
      <PageHero
        badge={c.contact.badge}
        title={c.contact.title}
        sub={c.contact.sub}
      />

      <section className="bg-surface pt-6 pb-20 sm:pb-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal delay={100}>
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-ink">
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
                <p className="mt-2 text-sm text-ink-dim">
                  {brand.email} · {brand.domain}
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Faq />
    </>
  );
}
