import { getLocale } from "next-intl/server";
import { getContent } from "@/content";
import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/icons";
import { Container } from "@/components/Section";

export default async function NotFound() {
  const locale = await getLocale();
  const c = getContent(locale);

  return (
    <section className="hero-wash flex min-h-[70vh] items-center py-24">
      <Container className="flex flex-col items-center text-center">
        <span className="font-display text-6xl text-caramel-grad">404</span>
        <h1 className="font-display mt-4 text-2xl text-ink">
          {c.notFound.title}
        </h1>
        <p className="mt-3 max-w-md text-ink-dim">{c.notFound.body}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            {c.notFound.cta}
            <Arrow width={18} height={18} className="flip-rtl" />
          </Link>
          <Link href="/pricing" className="btn btn-ghost bg-surface">
            {c.nav.links[3].label}
          </Link>
        </div>
      </Container>
    </section>
  );
}
