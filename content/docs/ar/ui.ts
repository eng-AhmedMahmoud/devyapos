import type { DocsUi } from "../types";

/* The help centre's chrome, in Arabic first; content/docs/en/ui.ts follows key for key. */
export const ui: DocsUi = {
  name: "مركز المساعدة",
  breadcrumb: "مسار التنقل",
  eyebrow: "مركز المساعدة",
  title: "كيف نساعدك اليوم؟",
  subtitle:
    "شروحات مكتوبة من داخل موفينج POS نفسه، خطوة بخطوة ومعها صور الشاشات — لصاحب المطعم وهو يجهّز حسابه، وللكاشير وفريق الفرع في يوم العمل.",
  search: {
    label: "ابحث في مركز المساعدة",
    placeholder: "ابحث: إضافة صنف، فتح وردية، ربط Paymob…",
    submit: "ابحث",
    loading: "جارٍ تحميل الفهرس…",
    empty: "لا توجد نتائج. جرّب كلمة أقصر أو اسم الشاشة كما يظهر في التطبيق.",
    hint: "↑ ↓ للتنقل · Enter للفتح · Esc للإغلاق",
    resultsCount: {
      zero: "لا نتائج لـ «{query}»",
      one: "نتيجة واحدة لـ «{query}»",
      two: "نتيجتان لـ «{query}»",
      few: "{count} نتائج لـ «{query}»",
      many: "{count} نتيجة لـ «{query}»",
      other: "{count} نتيجة لـ «{query}»",
    },
    noQuery: "اكتب ما تبحث عنه في المربع بالأعلى.",
  },
  groups: {
    setup: {
      title: "جهّز مطعمك",
      body: "لصاحب المطعم: الحساب، والقائمة، والموظفين والصلاحيات، وطرق الدفع، والطابعات، والفروع.",
    },
    daily: {
      title: "يوم العمل",
      body: "للكاشير وفريق الفرع: الوردية من فتحها إلى إغلاقها، والطلبات من الكاشير والموقع، والمطبخ، والمخزون.",
    },
    grow: {
      title: "الأرقام والربط",
      body: "التقارير، والمساعد الذكي، ونقاط الولاء، وما يتصل بموفينج POS من أنظمة أخرى.",
    },
  },
  surfaces: {
    "pos-admin": "لوحة الإدارة",
    "pos-register": "الكاشير",
    "pos-ordering": "موقع الطلبات",
  },
  startHere: "ابدأ من هنا",
  startAll: "كل مقالات البداية",
  popular: "الأكثر قراءة",
  articles: "كل المقالات",
  articleCount: {
    zero: "لا مقالات",
    one: "مقالة واحدة",
    two: "مقالتان",
    few: "{count} مقالات",
    many: "{count} مقالة",
    other: "{count} مقالة",
  },
  browse: "تصفّح المواضيع",
  onThisPage: "في هذه الصفحة",
  before: "قبل أن تبدأ",
  reviewed: "رُوجعت على المنتج في",
  related: "مقالات ذات صلة",
  previous: "السابق",
  next: "التالي",
  stepLabel: "الخطوة",
  figure: "شكل",
  callout: { note: "ملاحظة", tip: "نصيحة", warning: "تنبيه" },
  shotPending: "صورة الشاشة قيد التحديث",
  shotPendingBody: "تظهر هنا لقطة من {surface} فور التقاطها.",
  help: {
    title: "ما زلت تحتاج مساعدة؟",
    body: "كلّمنا على واتساب ونردّ عليك من الفريق الذي بنى موفينج POS.",
    whatsapp: "كلّمنا على واتساب",
    whatsappText: "مرحبًا، أحتاج مساعدة من مركز المساعدة",
    privacyNote: "تصل رسائل واتساب إلينا عبر Meta. كيف نتعامل معها: [سياسة الخصوصية](/privacy).",
  },
  searchPage: { title: "نتائج البحث" },
};
