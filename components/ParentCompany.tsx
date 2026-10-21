import { brand } from "@/lib/brand";

/**
 * One of the `parentCompany` sentences from `content/{ar,en}.ts`, with the
 * parent's name linking to devya.dev. The linked words sit inside the
 * sentence (tests/parent.test.ts), so the split always yields two parts.
 */
export default function ParentCompany({
  sentence,
  className,
}: {
  sentence: { text: string; link: string };
  className?: string;
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
        {sentence.link}
      </a>
      {after}
    </>
  );
}
