import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import FeatureGrid from "@/components/FeatureGrid";
import { Arrow } from "@/components/icons";
import Reveal from "@/components/Reveal";
import { Container, SectionHead } from "@/components/Section";

export default async function Features() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section id="features" className="bg-bg py-20 sm:py-24">
      <Container>
        {/* Head and CTA share a row, so the section opens on a line rather than
            a centred stack — the rhythm the rest of the page keeps. */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHead
            kicker={c.features.eyebrow}
            title={c.features.title}
            sub={c.features.sub}
          />
          <Reveal delay={80}>
            <Link href="/features" className="btn btn-ghost shrink-0">
              {c.features.more}
              <Arrow width={16} height={16} className="flip-rtl" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12">
          <FeatureGrid items={c.features.items} />
        </div>
      </Container>
    </section>
  );
}
