import { brand } from "@/lib/brand";

/**
 * One of the `parentCompany` sentences from `content/{ar,en}.ts`, with the
 * parent's name linking to devya.dev. The linked words sit inside the
 * sentence (tests/parent.test.ts), so the split always yields two parts.
 *
 * `isolate` wraps the name in `<bdi>`. The footer credit keeps the name in
 * Latin letters inside the Arabic line, and an isolated run cannot reorder the
 * words or the punctuation around it. The notice names the parent in Arabic
 * letters on Arabic pages, so it renders as it always has.
 */
export default function ParentCompany({
  sentence,
  className,
  isolate = false,
}: {
  sentence: { text: string; link: string };
  className?: string;
  isolate?: boolean;
}) {
  const [before, after = ""] = sentence.text.split(sentence.link);

  return (
    <>
      {before}
      <a
        href={brand.parent.url}
        target="_blank"
        rel="noopener"
        className={className}
      >
        {isolate ? <bdi>{sentence.link}</bdi> : sentence.link}
      </a>
      {after}
    </>
  );
}
