import type { DocCategory } from "../types";
import { articles } from "./parts/assistant";

export const assistant: DocCategory = {
  id: "assistant",
  group: "grow",
  icon: "assistant",
  title: "AI assistant",
  description: "Ask the AI assistant about your figures by typing or by voice, read today's briefing, and approve the changes it drafts. An add-on switched on per restaurant.",
  articles,
};
