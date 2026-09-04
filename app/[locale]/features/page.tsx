import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import { pageJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/meta";
import CtaBand from "@/components/CtaBand";
import FeatureGrid from "@/components/FeatureGrid";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import PaymentProviders from "@/components/PaymentProviders";
import ScreenshotCarousel from "@/components/ScreenshotCarousel";
import { PRODUCT_MEDIA_AVAILABLE, SHOTS } from "@/lib/screenshots";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";

/** Pairs by index with `gallery.items`; aspects come from the manifest. */
const GALLERY = [
  SHOTS.posOrder,
  SHOTS.kds,
  SHOTS.shopMenu,
  SHOTS.adminDashboard,
  SHOTS.adminReports,
  SHOTS.adminMenu,
  SHOTS.adminInventory,
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
      <JsonLd data={pageJsonLd(locale, "/features")} />
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
      {/* Gallery hidden while product media is withdrawn — see
          PRODUCT_MEDIA_AVAILABLE in lib/screenshots.ts. */}
      {PRODUCT_MEDIA_AVAILABLE && (
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
              items={GALLERY.map((shot, i) => ({
                src: shot.src,
                alt: c.gallery.items[i].alt,
                caption: c.gallery.items[i].caption,
              }))}
            />
          </div>
        </Container>
      </section>
      )}

      <PaymentProviders />

      <CtaBand />
    </>
  );
}
