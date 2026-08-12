import Reveal from "./Reveal";
import { Container } from "./Section";

/** Compact hero for interior pages — same wash as the home hero, less height. */
export default function PageHero({
  badge,
  title,
  sub,
}: {
  badge: string;
  title: string;
  sub: string;
}) {
  return (
    <section className="hero-wash pt-28 pb-14 sm:pt-36 sm:pb-16">
      <Container className="flex flex-col items-center text-center">
        <Reveal immediate>
          <span className="eyebrow">{badge}</span>
        </Reveal>
        <Reveal immediate delay={60}>
          <h1 className="mt-5 max-w-3xl text-3xl leading-tight font-bold tracking-tight text-balance text-ink sm:text-5xl">
            {title}
          </h1>
        </Reveal>
        <Reveal immediate delay={120}>
          <p className="mt-5 max-w-2xl leading-relaxed text-pretty text-ink-dim">
            {sub}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
