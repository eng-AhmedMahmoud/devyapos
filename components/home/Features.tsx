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
    <section id="features" className="bg-surface-2 py-20 sm:py-24">
      <Container>
        <SectionHead
          eyebrow={c.features.eyebrow}
          title={c.features.title}
          sub={c.features.sub}
        />
        <div className="mt-12">
          <FeatureGrid items={c.features.items} />
        </div>
        <Reveal delay={120}>
          <div className="mt-10 flex justify-center">
            <Link href="/features" className="btn btn-ghost bg-surface">
              {c.features.more}
              <Arrow width={16} height={16} className="flip-rtl" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
