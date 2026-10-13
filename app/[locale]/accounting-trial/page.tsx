import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import { Check } from "@/components/icons";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";
import TrialForm from "@/components/TrialForm";
import AccountingPricing from "@/components/AccountingPricing";
import PageFaq, { pageFaqJsonLd } from "@/components/pages/PageFaq";

const PATH = "/accounting-trial";
/** The form's section, which every plan card's CTA scrolls back to. */
const FORM_ID = "start";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "accountingTrial", PATH);
}

/**
 * The self-serve trial of DevyaPOS Accounting.
 *
 * The form is the page: a visitor who fills it leaves with an accounting
 * system of their own and the token that opens it (`components/TrialForm`).
 * Beside it, what they are getting and what happens next — the two questions
 * a person asks before typing their phone number into anything. Under it, what
 * the system costs once the trial ends (`components/AccountingPricing`), whose
 * buttons lead back up to the form. No CtaBand underneath: that band sells the
 * POS, and this page's one action is the form.
 */
export default async function AccountingTrialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = getContent(locale).accountingTrial;

  const jsonLd = [
    ...pageJsonLd(locale, PATH).filter((node) => node["@type"] !== "FAQPage"),
    pageFaqJsonLd(locale, PATH, t.faq.items),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHero badge={t.badge} title={t.title} sub={t.sub} />

      <section id={FORM_ID} className="bg-bg pt-10 pb-20 sm:pb-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <Reveal className="min-w-0">
              <TrialForm />
            </Reveal>

            <Reveal delay={100} className="flex min-w-0 flex-col gap-6">
              <div className="card-flat p-6">
                <h2 className="font-display text-lg text-ink">{t.includes.title}</h2>
                <ul className="mt-4 flex flex-col gap-4">
                  {t.includes.items.map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span
                        className="icon-tile !h-8 !w-8 shrink-0"
                        style={{ ["--tile" as string]: "var(--mint)" }}
                      >
                        <Check width={16} height={16} />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">{item.title}</span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-ink-dim">
                          {item.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-flat p-6">
                <h2 className="font-display text-lg text-ink">{t.steps.title}</h2>
                <ol className="mt-4 flex flex-col gap-4">
                  {t.steps.items.map((step) => (
                    <li key={step.n} className="flex items-start gap-3">
                      <span className="font-display w-8 shrink-0 text-lg text-caramel">{step.n}</span>
                      <span>
                        <span className="block text-sm font-semibold text-ink">{step.title}</span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-ink-dim">
                          {step.body}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <AccountingPricing formId={FORM_ID} />

      {/* Plain background, so the cream plans band above keeps its edges. */}
      <PageFaq title={t.faq.title} items={t.faq.items} band="bg-bg" />
    </>
  );
}
