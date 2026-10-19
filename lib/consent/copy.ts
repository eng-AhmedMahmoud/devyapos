import type { ConsentCategory } from "./core";

/**
 * The consent copy — identical on every Devya and Moving site apart from the
 * `vendors` lines, which must name what this site really loads
 * (docs/compliance/consent-design.md). Arabic is written first.
 */
export interface ConsentCopy {
  bannerTitle: string;
  bannerBody: string;
  policyLink: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  panelTitle: string;
  panelIntro: string;
  save: string;
  close: string;
  alwaysOn: string;
  /** The footer / policy-page entry point that reopens the panel. */
  settingsLink: string;
  /** Panel intro on a site with no optional category. */
  noOptional: string;
  /** `vendors`: what this site stores as strictly necessary, by name. */
  necessary: { title: string; body: string; vendors?: string };
  categories: Partial<Record<ConsentCategory, { title: string; body: string; vendors?: string }>>;
}

export const consentCopyBase = {
  ar: {
    bannerTitle: "خيارات الخصوصية",
    bannerBody:
      "نستخدم التخزين الضروري فقط لتشغيل الموقع. أي أداة اختيارية تبقى متوقفة حتى تسمح بها، ويمكنك تغيير اختيارك في أي وقت من «إعدادات الكوكيز» أسفل كل صفحة.",
    policyLink: "سياسة الكوكيز",
    acceptAll: "قبول الكل",
    rejectAll: "رفض الكل",
    customize: "تخصيص",
    panelTitle: "إعدادات الكوكيز",
    panelIntro:
      "اختر ما يُسمح للموقع باستخدامه. التخزين الضروري يعمل دائمًا لأن الموقع لا يعمل بدونه. يُحفظ اختيارك على هذا الجهاز ستة أشهر، ثم نسألك من جديد.",
    save: "حفظ اختياراتي",
    close: "إغلاق",
    alwaysOn: "يعمل دائمًا",
    settingsLink: "إعدادات الكوكيز",
    noOptional:
      "لا يستخدم هذا الموقع أي كوكيز أو أدوات تتبع اختيارية، فلا يوجد ما نطلب موافقتك عليه. هذا كل ما يحفظه على جهازك:",
    necessary: {
      title: "ضروري",
      body: "ما يحتاجه الموقع ليعمل فقط — مثل لغتك، والمظهر الفاتح أو الداكن، واختياراتك هنا، وتأمين النماذج وتسجيل الدخول حيث توجد. لا يُستخدم لتتبعك ولا يُشارك مع أي معلِن.",
    },
    categories: {
      preferences: {
        title: "التفضيلات",
        body: "تتذكر إعدادات اختيارية تضبطها بنفسك بين الزيارات.",
      },
      analytics: {
        title: "التحليلات",
        body: "تحسب الزيارات وكيف تُستخدم الصفحات، لنعرف ما الذي يحتاج إلى تحسين.",
      },
      marketing: {
        title: "التسويق",
        body: "تقيس أي إعلان أو حملة جاء منها الزائر — ولا تتيح لمنصة إعلانية أن تعرض إعلاناتنا لك في أماكن أخرى إلا إذا ذُكرت في السطر أدناه.",
      },
    },
  },
  en: {
    bannerTitle: "Your privacy choices",
    bannerBody:
      "We only use the storage this site needs to work. Anything optional stays off until you allow it, and you can change your mind any time from “Cookie settings” at the bottom of every page.",
    policyLink: "Cookie policy",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    customize: "Customize",
    panelTitle: "Cookie settings",
    panelIntro:
      "Choose what this site may use. Strictly necessary storage is always on because the site cannot work without it. Your choice is kept on this device for six months, then we ask again.",
    save: "Save my choices",
    close: "Close",
    alwaysOn: "Always on",
    settingsLink: "Cookie settings",
    noOptional:
      "This site uses no optional cookies or trackers, so there is nothing to ask your permission for. This is everything it keeps on your device:",
    necessary: {
      title: "Strictly necessary",
      body: "Only what the site needs to work — such as your language, light or dark appearance, the choices you make here, and securing forms and sign-in where there are any. Never used to track you, never shared with advertisers.",
    },
    categories: {
      preferences: {
        title: "Preferences",
        body: "Remembers optional settings you choose between visits.",
      },
      analytics: {
        title: "Analytics",
        body: "Counts visits and how pages are used, so we know what to improve.",
      },
      marketing: {
        title: "Marketing",
        body: "Measures which ad or campaign brought a visitor — and lets an ad platform show you our ads elsewhere only if the line below names one.",
      },
    },
  },
} satisfies Record<"ar" | "en", ConsentCopy>;
