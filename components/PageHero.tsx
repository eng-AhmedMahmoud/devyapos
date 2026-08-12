import Reveal from "./Reveal";
import { Container } from "./Section";

/** Compact hero for interior pages — same peach wash as home, start-aligned. */
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
    <section className="hero-wash relative overflow-hidden py-16 sm:py-20">
      <span
        aria-hidden="true"
        className="blob -top-20 h-64 w-64 bg-caramel"
        style={{ insetInlineEnd: "-3rem" }}
      />
      <Container className="relative">
        <Reveal immediate>
          <span className="kicker">
            <span className="pearl" aria-hidden="true" />
            {badge}
          </span>
        </Reveal>
        <Reveal immediate delay={60}>
          <h1 className="font-display mt-5 max-w-3xl text-[2.2rem] text-balance text-ink sm:text-5xl">
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
