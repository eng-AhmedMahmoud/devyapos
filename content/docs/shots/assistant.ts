import { BOTH, DESKTOP, type ShotSpec } from "../surfaces.ts";

/**
 * Screenshot slots used by the "assistant" articles. Ids start with "pos-".
 * Every slot needs the demo tenant's `aiCompanion` flag (the seed turns every flag on) and an
 * owner holding `insights.view`; none of them sends a question, so no model is called. The tab
 * draws its empty state ("What would you like to know?") only when the backend has a text model
 * configured — ANTHROPIC_API_KEY, or AI_API_KEY with AI_PROVIDER=google (the default) — and
 * "Not set up yet" otherwise. admin-app needs no NEXT_PUBLIC_* for any of it.
 */
export const shots = {
  /* ask-the-assistant: admin-app /assistant, the empty thread with role-picked suggestions. */
  "pos-assistant-chat": {
    surface: "pos-admin",
    path: "/assistant",
    devices: BOTH,
    waitFor: "role=heading[name=/^(What would you like to know\\?|ماذا تريد أن تعرف؟)$/]",
  },
  /* morning-briefing: the header's Briefings button (aiBriefing; aria-label = assistant.header.briefings,
     with " — n unread" appended when there are unread ones). Opens the inbox; nothing is generated. */
  "pos-assistant-briefings": {
    surface: "pos-admin",
    path: "/assistant",
    devices: DESKTOP,
    clicks: ["role=button[name=/^(Briefings|الملخصات)/]"],
    // "." for the apostrophe: a quote inside the pattern ends Playwright's selector string.
    waitFor: "role=button[name=/^(Generate today.s briefing|إنشاء ملخص اليوم)$/]",
  },
  /* approve-its-changes: the floating dock's "Do it with me" (components/corner/LiveLauncher.tsx,
     aria-label = corner.liveOpen) opens the live panel (@bohub/ui LiveAssistant, role=dialog named by
     its title). Needs aiCompanion + aiLiveActions and assistant.live; not drawn on /assistant. */
  "pos-assistant-live-panel": {
    surface: "pos-admin",
    path: "/dashboard",
    devices: BOTH,
    clicks: ["role=button[name=/^(Open the live assistant|فتح المساعد المباشر)/]"],
    waitFor: "role=dialog[name=/^(Live assistant|المساعد المباشر)$/]",
  },
} as const satisfies Record<string, ShotSpec>;
