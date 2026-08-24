import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import FeatureGrid from "@/components/FeatureGrid";
import PageHero from "@/components/PageHero";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";

/** Paths pair by index with `gallery.items` in the content tree. */
const GALLERY = [
  "/screenshots/pos-payment.webp",
  "/screenshots/pos-receipt-print.webp",
  "/screenshots/admin-reports.webp",
  "/screenshots/shell-settings.webp",
];

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

      {/* Captures of the live deployment. The FAQ used to sit here too, but it
          also ran on /pricing — objections belong next to the price, and two
          copies of the same answers only split the search signal. */}
      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <Reveal>
            <div className="flex flex-col gap-2">
              <span className="kicker">
                <span className="pearl" aria-hidden="true" />
                {c.gallery.eyebrow}
              </span>
              <h2 className="font-display mt-2 text-2xl text-ink sm:text-3xl">
                {c.gallery.title}
              </h2>
              <p className="max-w-2xl text-ink-dim">{c.gallery.sub}</p>
            </div>
          </Reveal>
          <div className="mt-9">
            <ScreenshotCarousel
              ariaLabel={c.gallery.title}
              items={GALLERY.map((src, i) => ({
                src,
                alt: c.gallery.items[i].alt,
                caption: c.gallery.items[i].caption,
                ...(src.includes("shell-settings")
                  ? { orientation: "portrait" as const }
                  : {}),
              }))}
            />
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
