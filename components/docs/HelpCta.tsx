import type { DocsUi } from "@/content/docs/types";
import { whatsappLink } from "@/lib/brand";
import Icon from "./DocIcon";
import Inline from "./Inline";

/**
 * "Still stuck?" at the foot of every help-centre page: WhatsApp with the
 * article's title already typed, so the conversation starts where the reader
 * is. Set on the espresso band, as the site's closing cards are.
 */
export default function HelpCta({ ui, topic }: { ui: DocsUi; topic?: string }) {
  const text = topic ? `${ui.help.whatsappText} — ${topic}` : ui.help.whatsappText;
  return (
    <aside className="band-espresso pearl-grid-dark flex flex-col gap-5 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
      <div className="flex flex-col gap-2">
        <p className="font-display text-xl font-semibold">{ui.help.title}</p>
        <p className="max-w-xl text-on-espresso-dim">{ui.help.body}</p>
        {/* Just in time: the chat goes through Meta. */}
        <p className="max-w-xl text-sm text-on-espresso-dim">
          <Inline text={ui.help.privacyNote} />
        </p>
      </div>
      <a
        href={whatsappLink(text, "docs")}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-on-espresso shrink-0"
      >
        <Icon name="whatsapp" size={20} />
        {ui.help.whatsapp}
      </a>
    </aside>
  );
}
