import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import Faq from "@/components/Faq";
import FeatureGrid from "@/components/FeatureGrid";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata(locale, "features", "/features");
}

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);

  return (
    <>
      <PageHero
        badge={c.featuresPage.badge}
        title={c.featuresPage.title}
        sub={c.featuresPage.sub}
      />

      {c.featuresPage.groups.map((group, i) => (
        <section
          key={group.title}
          className={i % 2 ? "band-cream py-16 sm:py-20" : "bg-bg py-16 sm:py-20"}
        >
          <Container>
            <Reveal>
              <div className="flex flex-col gap-2">
                <span className="kicker">
                  <span className="pearl" aria-hidden="true" />
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display mt-2 text-2xl text-ink sm:text-3xl">
                  {group.title}
                </h2>
                <p className="max-w-2xl text-ink-dim">{group.body}</p>
              </div>
            </Reveal>
            <div className="mt-9">
              <FeatureGrid items={group.items} variant="even" />
            </div>
          </Container>
        </section>
      ))}

      <Faq />
      <CtaBand />
    </>
  );
}
