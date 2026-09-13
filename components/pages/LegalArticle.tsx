import { getLocale } from "next-intl/server";
import { getContent, type LegalDoc } from "@/content";
import { Link } from "@/i18n/navigation";
import { Arrow } from "@/components/icons";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { Container } from "@/components/Section";

/**
 * The three legal documents, rendered as documents.
 *
 * One column at a readable measure, real headings, loose leading and no cards,
 * bands or feature grids: a visitor here is checking a clause, not being sold
 * to — which is also why `CtaBand` is deliberately absent and the page ends on
 * the contact line the copy itself carries.
 *
 * `updated` is the hero badge rather than fine print at the bottom. A legal
 * page whose date is hard to find is a legal page nobody trusts.
 */
export default async function LegalArticle({ doc }: { doc: LegalDoc }) {
  const locale = await getLocale();
  const c = getContent(locale);

  /* Read out of the footer rather than hard-coded, so the label for /contact
     is the same word in the same locale wherever it appears. */
  const contactLabel =
    c.footer.cols
      .flatMap((col) => col.links)
      .find((l) => l.href === "/contact")?.label ?? c.cta.primary;

  return (
    <>
      <PageHero badge={doc.updated} title={doc.title} sub={doc.sub} />

      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <article className="flex max-w-3xl flex-col gap-11">
            {/* Prominent template/draft notice — impossible to miss on the two
                policies that carry one, so the text is never mistaken for
                reviewed, relied-upon legal terms. */}
            {doc.disclaimer ? (
              <Reveal>
                <aside
                  role="note"
                  className="rounded-2xl border-2 border-caramel/50 bg-caramel/10 p-5 sm:p-6"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-caramel">
                    ⚠︎
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-pretty text-ink-2">
                    {doc.disclaimer}
                  </p>
                </aside>
              </Reveal>
            ) : null}

            {doc.sections.map((section, i) => (
              <Reveal key={section.title} delay={Math.min(i, 3) * 40}>
                <section>
                  <h2 className="font-display text-xl text-balance text-ink sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="mt-4 flex flex-col gap-4">
                    {section.body.map((p, j) => (
                      <p
                        key={j}
                        className="leading-loose text-pretty text-ink-2"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}

            {/* Cookie inventory. Scrolls inside its own container on narrow
                screens so the article never scrolls sideways. */}
            {doc.cookieTable ? (
              <Reveal>
                <section>
                  <h2 className="font-display text-xl text-balance text-ink sm:text-2xl">
                    {doc.cookieTable.title}
                  </h2>
                  <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
                    <table className="w-full min-w-[38rem] border-collapse text-start text-sm">
                      <thead>
                        <tr className="bg-surface-2 text-ink">
                          <th className="p-3 text-start font-bold">
                            {doc.cookieTable.columns.name}
                          </th>
                          <th className="p-3 text-start font-bold">
                            {doc.cookieTable.columns.purpose}
                          </th>
                          <th className="p-3 text-start font-bold">
                            {doc.cookieTable.columns.duration}
                          </th>
                          <th className="p-3 text-start font-bold">
                            {doc.cookieTable.columns.category}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {doc.cookieTable.rows.map((row) => (
                          <tr
                            key={row.name}
                            className="border-t border-line align-top text-ink-2"
                          >
                            <td className="p-3 font-medium text-ink" dir="ltr">
                              {row.name}
                            </td>
                            <td className="p-3 leading-relaxed">{row.purpose}</td>
                            <td className="p-3 leading-relaxed">{row.duration}</td>
                            <td className="p-3 leading-relaxed">{row.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </Reveal>
            ) : null}

            <Reveal>
              <div className="card flex flex-col items-start gap-4 p-7">
                <p className="leading-relaxed text-pretty text-ink-dim">
                  {doc.contact}
                </p>
                <Link href="/contact" className="btn btn-ghost bg-surface">
                  {contactLabel}
                  <Arrow width={16} height={16} className="flip-rtl" />
                </Link>
                {/* Who the contract is actually with, stated on the page that
                    describes the contract. */}
                <p className="w-full border-t border-line pt-4 text-xs leading-relaxed text-ink-dim">
                  {c.trustLine.short}
                </p>
              </div>
            </Reveal>
          </article>
        </Container>
      </section>
    </>
  );
}
