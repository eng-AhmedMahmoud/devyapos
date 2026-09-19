# DevyaPOS — Facebook & Instagram launch plan

**Status:** draft for the owner to execute. Nothing in here has been acted on — no
account created, no handle claimed, no post published.
**Written:** 2026-09-19. All competitor observations carry that date; social accounts
change weekly, so re-check anything load-bearing before you spend money on it.
**Scope:** Facebook and Instagram only. TikTok and LinkedIn are noted where the
research touched them, but they are out of scope here.

---

## 0. What this plan assumes DevyaPOS actually is

Everything written below — every caption, every ad angle — is constrained to this
list. If a claim is not on it, it does not go in a post.

| Package | Price (per branch / month) | What it is |
|---|---|---|
| **Counter** | 199 EGP | Quick service, cloud kitchens, takeaway. POS, kitchen display, menu, own-branded online ordering site, delivery zones, reports, inventory, per-user permissions, multi-branch console. |
| **Dining room** | 499 EGP | Counter, plus the dine-in pack: table floor plan, coursing, split checks, a waiter's phone flow, pay-at-table by QR. |
| **Group** | Custom | Plus purchasing / stock / waste / variance, HR and payroll, double-entry books fed by each day's close, and a scoped API with signed webhooks. |

The six true differentiators, in the operator's own language:

1. The entry bundle from the regional incumbent is **2,848.95 EGP per branch per
   month**; ours starts at **199 EGP**. Different market positions — not the same
   product priced differently. *(See §2.4 — there is a sourcing problem with this
   number that must be fixed before it goes in a paid creative.)*
2. **Zero commission** on the restaurant's own online orders.
3. Runs **in a browser on hardware they already own** — no terminal to buy, prints
   to any ESC/POS thermal printer.
4. A guest **scans the QR on their table**, sees their own check, and pays it — or
   just their share.
5. A **second round joins the check already running** and reaches the kitchen as the
   next course. No second scan, no second order.
6. A **typed coupon always beats an automatic offer, and they never stack**, so a
   discount is never double-counted.

### Things that must never appear in a post

Not because they are bad ideas — because they do not exist:

- loyalty tiers / points programmes
- marketing campaigns (scheduled sends, blasts)
- push notifications
- offline mode ("works without internet")
- aggregator integrations (Talabat, elmenus, Uber Eats, Breadfast…)

> **Open conflict — resolve before launch.** The live marketing site at
> `pos.devya.dev` currently sells loyalty. The Arabic hero literally reads
> `كاشير + شاشة مطبخ لحظية + طلبات أونلاين بعلامتك + ولاء + مخزون بوصفات مُسعّرة`,
> and `content/ar.ts` / `content/en.ts` carry "loyalty and gift cards", "نقاط ولاء
> تُكتسب وتُنفق" and "loyalty points" in the feature grid, the comparison table and
> the ROI copy. Either the capability exists and this plan is too conservative, or
> the site is overclaiming and needs a copy fix before we drive traffic to it. The
> social account cannot be more honest than the landing page it links to — a
> prospect who reads "ولاء" on the site and doesn't find it in the trial churns
> angrier than one who never heard the word. **Pick one and make the site and the
> social account agree.** Until that happens, the captions in this plan omit loyalty
> entirely.
>
> Same question, smaller: the site has a `/ar/eta-einvoicing` page. Nothing in the
> capability list above says DevyaPOS submits to the ETA. Pillar 5 below is written
> as *education about* Egyptian e-invoicing, not as a claim that we do it. If we do
> do it, that is a much stronger pillar and should be rewritten.

---

## 1. Competitor research — what was actually observed

### 1.1 Method and its limits

Everything marked **observed** below was read directly off the live page on
2026-09-19: the Instagram profile and individual post pages were read logged out,
the Facebook page and the Meta Ad Library were read in a logged-in browser session.
Everything marked **inferred** is a judgement built on those observations.

What a public page will **not** give us, and where anybody claiming otherwise is
guessing: reach, impressions, story views, saves, shares, click-through, follower
demographics, ad spend, audience growth curve, and which posts were boosted. I have
none of those numbers and neither does any third-party "Instagram stats" site.
Facebook's post-level engagement counts also defeated extraction — its feed is
virtualised and the reaction counts did not survive scraping — so **there are no
Facebook engagement numbers in this document at all.** That is a gap, not a zero.

### 1.2 Instagram — @foodicsegypt (observed)

| Metric | Observed value |
|---|---|
| Handle | `foodicsegypt` |
| Display name | `Foodics Egypt \| فودكس مصر 🇪🇬` |
| Posts | 983 |
| Followers | 25.5K |
| Following | 123 |
| Location on profile | W51 Mall, North Teseen, Fifth Settlement, Cairo, Egypt |
| Link in bio | `linktr.ee/foodicsegypt` (a Linktree, not a direct URL) |

Bio, verbatim — note it is Egyptian colloquial, not Modern Standard:

```
إدارة أسهل لمطعمك ! 👌🏼
البرنامج السحابي الأفضل لإدارة مطعمك بكل سهولة وأمان من أي مكان 🍔
اتعرّف أكثر على خدماتنا من...
```

Story highlights, in order: `FoodicsProTip`, `تحدي المحترفين`, `MPM`,
`PioneersElScene`, `Partners Tips`, `ليه فودكس؟`, `فودكس POS`, `فودكس Pay`,
`فودكس Online`, `Meet The X-Pert`. Read that list as their product and programme
map — POS, Pay, Online are the three product lines they push, and the rest is
community/partner programming.

**Cadence (observed).** The twelve grid tiles visible logged out resolved to posts
on Sep 6, 7, 9, 10, 11, 13, 15 and 17 — **roughly every other day, about four feed
posts a week**, plus three pinned posts from October 2025. Format mix in that
window: 7 reels to 5 statics. Reels lead.

**Engagement (observed).** This is the finding the whole plan turns on.

| Date | Format | Likes | Comments | Caption opening |
|---|---|---|---|---|
| Sep 17 | Reel | 25 | 2 | نظّم مطعمك وكبّره …بسيستم محترف يكبر معاك |
| Sep 15 | Reel | 54 | 2 | تشغيل مطعمك بسلاسة مش بس في الأوردرات والعمليات… حساباتك كمان |
| Sep 13 | Static | 8 | 0 | خليك دايمًا سابق المشاكل بخطوة |
| Sep 11 | Static | 21 | 0 | الإجازة خلصت؟ عادي… هنكمل سفر (Scene المطاعم) |
| Sep 10 | Reel | 2 | 0 | عايز تفضل دايمًا في بال عميلك؟ (برنامج الولاء) |
| Sep 9 | Static | 37 | 0 | At Entlaq 2026, Egypt's leading think tank… *(English)* |
| Sep 7 | Reel | 35 | 2 | محمد حمامة من @basq.eg بيحكيلنا… *(customer story)* |
| Sep 6 | Static | 15 | 0 | قبل ما تحكم على كفاءة الشيف والعاملين… |

Median: **~23 likes and 0 comments, on 25,500 followers.** That is an engagement
rate around **0.09%** — roughly a tenth of the weakest published B2B benchmark.

The three pinned posts, all from October 2025, did far better: **111 likes / 14
comments**, **146 / 16**, **114 / 2**. So either engagement has fallen four-to-six
fold in eleven months, or those three are pinned precisely because they were the
only ones that worked. Either reading says the same thing.

**Language mix (observed).** Egyptian colloquial Arabic (عامية) for every product
and customer post — `نظّم`, `عشان`, `مش`, `هتلف`, `بيحكيلنا`. Modern Standard
appears essentially nowhere. English appears only on ecosystem and PR posts (the
Entlaq 2026 one). Franco/Arabizi: not observed in captions. Recurring hashtags:
`#فودكس_مصر` `#إدارة_المطاعم` `#قدها_مع_بعض`.

**Compliance detail worth copying (observed).** Captions carry
`رقم التسجيل الضريبي: 601-937-864`. That is Egyptian consumer-protection /
advertising practice. We should do the same once Devya's tax registration is issued.

### 1.3 Facebook — Foodics Egypt (observed)

| Metric | Observed value |
|---|---|
| Followers | 48K |
| Following | 20 |
| Category | Information Technology Company |
| Contact shown | `sales@foodics.com`, `foodics.com` |

Page description, verbatim — and note it is **English**, unlike the Instagram bio:

```
The #1 Cloud POS Solution in the Middle East.
Request a demo and start your success story today.
```

The top post on the page carried the **identical** Arabic caption to the Sep 17
Instagram reel (`نظّم مطعمك وكبّره …بسيستم محترف يكبر معاك`). They cross-post 1:1.

*Inferred, not observed:* a page with 48K followers and no platform-native craft —
same asset, same caption, same day, on two platforms with different aspect ratios
and different reading behaviour — is being run as a distribution checkbox, not as a
channel. Their FB audience is roughly double their IG audience, which is the normal
shape for Egyptian SMB, and they are serving it Instagram copy.

### 1.4 Meta Ad Library — the part that actually matters (observed)

Searched: `country=EG`, `active_status=active`, keyword `foodics`, all media types.

- **~64 active results.** They are running a real, funded, always-on paid programme.
- Creatives observed with start dates of **Sep 12** and **Sep 16, 2026** — i.e. the
  creative set was refreshed inside the previous week. They iterate.
- The headline offer is **صفقة ملوك الصيف** ("Kings of Summer deal"): *up to 90% off
  the hardware for your main branch* when you subscribe to Foodics together with an
  app from the Foodics app marketplace. Terms-and-conditions line included
  (`تُطبق الشروط والأحكام`), hotline `15796`, tax registration number in the creative.
- Observed creative angles: app-marketplace integration ("connect all the apps you
  already use to one system"); "there are still a lot of restaurants working
  manually with no system"; the **waiter app** ("the order goes from the waiter's
  hand to the cashier and the kitchen screen in seconds, so no order gets lost");
  a podcast collaboration (`consolto.podcast`); and the summer offer itself.
- Ad hashtag set: `#ملوك_الصيف #سيستم_المحترفين #عروض_الصيف #فودكس_مصر`
  `#نظام_الكاشير #إدارة_المطاعم #مطاعم #فودكس #مطاعم_مصر #برنامج_مطاعم`

Two things follow from this, and they point in opposite directions.

First, **their organic is not the competition — their paid is.** ~64 live ads
against a median of 23 organic likes means almost everything a restaurant owner in
Egypt sees from Foodics is bought. Beating their organic is easy and worth almost
nothing on its own.

Second, **the hardware discount is a confession.** You do not discount hardware 90%
unless hardware is the thing killing your close rate. We do not sell hardware. Our
answer to the same objection is structurally better than theirs and costs us
nothing: *you don't need to buy the box.*

### 1.5 The price we are attacking is not currently public (observed — important)

This needs to be read carefully, because the entire "7% of their price" angle rests
on it.

- `foodics.com/pricing/` was fetched and contains **no price literals at all**. The
  page's call to action is "Talk to sales".
- `foodics.com/eg/pricing/` and `foodics.com/eg/` both **redirect to the homepage**.
- No `2,848.95` or `3,019.89` string appears anywhere on foodics.com's pricing or
  Egypt pages as of 2026-09-19.

The `2,848.95 EGP / branch / month` figure currently lives in **our own** repo —
`content/en.ts:49`, `content/ar.ts:610` — annotated `تُدفع سنوياً (٣٬٠١٩٫٨٩ ربع سنوية)`
with loyalty, API, delivery apps and BI all billed on top. That annotation is
detailed enough that it almost certainly came from a real quote or a page that has
since been taken down. **It is probably true. It is not currently verifiable by a
stranger.** See §2.4 for what to do about that.

### 1.6 Other players

Foodics' own regional accounts (`@foodics` Saudi, `@foodicsuae`, `@foodicskuwait`)
run the same playbook per market, and `@foodicsegypt` also runs a TikTok. No
Egyptian-native restaurant-POS competitor was found with a social presence at
anything like this scale; the search surfaced only generic POS listing sites and
small local IT shops. **Inferred:** in Egyptian restaurant social media, Foodics is
not the leading competitor, it is effectively the only one. That is unusually good
news for a challenger with a specific story, and unusually bad news for a challenger
with a generic one.

---

## 2. Positioning against the incumbent

### 2.1 What they own — do not fight for any of it

- **The category noun.** In Egyptian F&B, "فودكس" is drifting toward meaning
  "restaurant POS" the way "Xerox" meant photocopier. We will not win a brand
  awareness contest and should not enter one.
- **Hardware, payments, and the app marketplace.** فودكس Pay, terminals, an
  integration ecosystem. We have none of it and should not imply we do.
- **Distribution muscle.** A hotline (15796), a field sales force, ~64 live ads,
  events (Entlaq 2026), partner programmes, podcast placements, 48K + 25.5K
  followers.
- **Enterprise logos.** Big chains, regional footprint, "#1 in the Middle East".

Attacking any of these reads as a small company shouting at a big one, and every
Egyptian restaurant owner has seen that movie.

### 2.2 Where they are weak — this is the whole opening

1. **Their price is invisible.** To find out what a POS costs you have to call
   15796, sit through a discovery call, and wait for a quote you cannot compare
   against anything. Every owner who has done this hated it. *We publish ours.*
2. **Their organic content says nothing.** "نظّم مطعمك وكبّره", "خليك دايمًا سابق
   المشاكل بخطوة" — these are posters, not information. Nobody ever shows a screen
   doing a specific thing. *Every single one of our posts will show a screen doing a
   specific thing.*
3. **Their audience is inert.** 23 likes on 25,500 followers. Whatever that
   audience is, it is not listening, and it is certainly not a pipeline. *We are not
   trying to out-follow them. We are trying to out-convert them.*
4. **Hardware is their friction and our non-problem.** Their answer is 90% off. Our
   answer is "use the tablet on your counter."
5. **They cross-post identically.** No platform-native work at all. Cheap to beat.

### 2.3 The one-line position

> **Modern Standard, for the site and the pinned post:**
> نظام تشغيل مطاعم مصري، بسعر منشور بالجنيه، يعمل على الأجهزة التي تملكها — ويبدأ من
> ١٩٩ جنيهاً للفرع شهرياً، بدون عمولة على طلباتك.

> **Egyptian colloquial, for the feed:**
> سيستم مطاعم مصري، سعره مكتوب قدامك، وبيشتغل على التابلت اللي عندك — من ١٩٩ جنيه
> للفرع في الشهر، وبدون عمولة على أوردراتك.

### 2.4 Do we name them? — yes, but not everywhere, and not with that number

This is a deliberate decision, not a default. Three surfaces, three answers.

**Owned surfaces (site, SEO): name them.** The site already ships a
`/ar/foodics-alternative` page and a `/ar/compare` page. Somebody typing "بديل
فودكس" is the single highest-intent search we will ever get, and refusing to use the
word forfeits it. Keep those pages. Link to them from the bio.

**Replies and DMs: name them, calmly.** When a prospect says "أنا شغال على فودكس" —
answer it straight: what transfers, what doesn't, what it costs, and say honestly
where they are better (hardware, payments, marketplace, scale). An honest comparison
from the small vendor is more persuasive than a hostile one.

**Paid and organic feed creative: do not put their price in it — yet.** Not out of
politeness. Three reasons:

1. **We cannot cite it.** §1.5 established that foodics.com publishes no prices
   today. A creative that says "their published price is 2,848.95" invites the
   obvious reply — *published where?* — and we currently have no answer. One
   screenshot-less price claim, publicly challenged, costs more credibility than the
   ad ever bought.
2. **Meta ad policy.** Comparative claims about an identified competitor's pricing
   need substantiation; a competitor complaint can get an ad account restricted, and
   a new advertiser has no goodwill buffer.
3. **Egyptian comparative-advertising exposure.** Naming a named competitor's price
   without a documented source is the kind of thing that generates a lawyer's letter
   to a startup that cannot absorb one.

**What to do instead, starting now:** attack the *behaviour*, which is verifiable by
anyone in ten seconds, rather than the *number*, which isn't.

> لو سألت أي سيستم كاشير: "بكام؟" وردّ عليك: "كلّمنا وهنبعتلك عرض سعر" — ده مش سعر،
> ده مفاوضة.
> إحنا كاتبينه على الموقع: ١٩٩ جنيه للفرع في الشهر للكاونتر، ٤٩٩ للصالة.
> تقراه قبل ما تكلّم حد.

That lands the same blow, is completely true, and nobody can send a letter about it.

**How to unlock the number.** Ask one of the 25 branches already running DevyaPOS —
or any owner who has been quoted — for **a redacted copy of their Foodics quote or
invoice** (branch name and account number blacked out), with **written permission to
cite the figure**. The moment that document exists, the 199-vs-2,848.95 post becomes
the strongest thing this account will ever publish, and it can carry the
screenshot. Until then it stays in the drawer. Owner action, week 1.

**One deliberate exception, on day 1.** A founder-voice post that names Foodics
respectfully and concedes the ground in §2.1 out loud. This is not generosity, it is
inoculation: a challenger who says "they're good, and they're built for a different
restaurant than yours" is believed on everything else afterward. A challenger who
only sneers is filed under "cheap" and never reconsidered. Draft in §3, Pillar 4.

---

## 3. Content pillars

Six pillars. The mix per week: **2 × Pillar 1, 1 × Pillar 2, 1 × Pillar 3, and one
rotating slot** from Pillars 4–6.

A note on register, since this is the thing most Egyptian B2B accounts get wrong.
**Egyptian colloquial (عامية) is the default**, because the reader is a restaurant
owner scrolling at 11pm after a shift and فصحى reads like a bank letter to him. But
colloquial is a bad register for money, contracts and law — it reads unserious
exactly where seriousness is the product. So: **عامية for pain, product and
demonstration; فصحى for price, terms, data handling and compliance; English only for
the ecosystem/hiring/founder audience, which is a different reader entirely.** This
is also, as it happens, what the incumbent does — except they never switch to فصحى,
which is part of why their pricing is invisible.

Franco/Arabizi (`3ayez`, `mn8`) stays out of captions: it reads young and consumer,
and we are selling to a 45-year-old with three branches. In *replies*, mirror
whatever the commenter used.

---

### Pillar 1 — الحقيقة في الشاشة · "Show the screen"

**What it is:** 10–25 second screen recordings of the demo tenant, one feature, one
claim, no music bed needed. This is the pillar that does the actual differentiating,
because the incumbent never does it.

**Register:** عامية. **Format:** Reel, vertical, big text, readable muted.

**Post 1.1 — the kitchen display**

> الأوردر ده اتظبط على الكاشير…
> ووصل شاشة المطبخ في أقل من ثانية.
>
> مفيش ورقة بتتعلّق، ومفيش حد بينادي على الشيف.
>
> الفيديو مسجّل من حساب تجريبي — مش بيانات عميل حقيقي.
> جرّب بنفسك: pos.devya.dev

**Post 1.2 — pay at the table** *(the strongest single asset we have)*

> الزبون بيصوّر الكود اللي على الترابيزة…
> بيلاقي حسابه هو، بالظبط اللي طلبه.
> يدفع الحساب كله — أو نصيبه هو بس.
>
> مفيش تطبيق يتحمّل، ومفيش كابتن مستني جنب الترابيزة عشان يجيب المكنة.
>
> ده جوّه باقة الصالة — ٤٩٩ جنيه للفرع في الشهر.

**Post 1.3 — the second round** *(nobody else in this market shows this)*

> الترابيزة طلبت جولة تانية.
>
> مش أوردر جديد، ومش كود جديد.
> الطلب بيتضاف على نفس الحساب اللي شغّال، وبيوصل المطبخ كـ course تاني.
>
> يعني الكاشير مش هيعمل فاتورتين، والمطبخ مش هيتلخبط في الترتيب، والزبون مش هيصوّر
> الكود تاني.

**Post 1.4 — the coupon rule** *(boring, specific, and the most trust-building post
on the list)*

> سؤال بييجي كل أسبوع: لو عندي عرض شغّال أوتوماتيك، والزبون كاتب كوبون كمان — الخصم
> بيتحسب مرتين؟
>
> لأ.
> الكوبون المكتوب بيتقدّم على العرض التلقائي **دايماً**، وهما عمرهم ما بيتجمعوا.
>
> يعني مفيش خصم اتحسب مرتين، ومفيش وردية بتقفل وفيه فرق في الدرج محدش عارف جه منين.

**Post 1.5 — hardware**

> مش هتشتري جهاز.
>
> DevyaPOS بيشتغل في المتصفح — على التابلت اللي معاك، أو اللابتوب، أو أي شاشة لمس في
> الفرع — وبيطبع على أي طابعة ESC/POS عندك.
>
> لو الجهاز ده بيفتح فيسبوك، يبقى بيفتح الكاشير.

---

### Pillar 2 — وجع التشغيل · "The operator's pain"

**What it is:** name a problem the owner recognises in the first three words, before
naming any product. Written from inside a kitchen, not from a marketing department.

**Register:** عامية. **Format:** carousel (3–5 slides) or static.

**Post 2.1**

> الفرع مليان. الطابور من بره. والشهر بيقفل بأرقام مش مفهومة.
>
> المشكلة مش دايماً في المبيعات — المشكلة إن محدش عارف الصنف ده بيكلّف كام فعلاً.
>
> لما كل صنف يبقى مربوط بوصفة مُسعّرة، الطلب اللي بيتنفّذ بيخصم مكوّناته من مخزون
> الفرع لوحده، وتقرير التكلفة بيبقى جاهز آخر اليوم من غير ما حد يقعد يدخّل أرقام.

**Post 2.2 — commission** *(the highest-intent pain in Egyptian F&B right now)*

> على كل أوردر من التطبيقات بتدفع عمولة.
> وبعد ما تدفعها، العميل يفضل عميلهم مش عميلك — اسمه ورقمه وعدد مرات طلبه، كله عندهم.
>
> موقع طلب باسمك أنت، بمناطق توصيل بتحددها أنت، وبصفر عمولة.
> والبيانات بتفضل بتاعتك.

**Post 2.3 — carousel, 5 slides**

> **الغلطة رقم ١:** الكاشير بينادي على المطبخ.
> **الغلطة رقم ٢:** الأوردر اتكتب على ورقة، والورقة راحت.
> **الغلطة رقم ٣:** حد عمل خصم، ومحدش عارف مين.
> **الغلطة رقم ٤:** المخزون بيتعدّ آخر الشهر على ورق.
> **الغلطة رقم ٥:** كل فرع بيقفل بطريقته.
>
> الخمسة دول مش إهمال من الناس. دول نتيجة إن مفيش سيستم واحد ماسك الفرع.

---

### Pillar 3 — الفلوس بالورقة والقلم · "The maths, in the open"

**What it is:** price, commission, payback — stated plainly. This is the pillar that
separates us from the incumbent structurally, so it must never sound like a discount
announcement. It is a posture: *we tell you what it costs.*

**Register:** فصحى for the numbers themselves, عامية for the framing sentence around
them. **Format:** static with large legible numerals, or a 3-slide carousel.

**Post 3.1 — the pinned pricing post**

> السعر مكتوب. بالجنيه المصري. للفرع في الشهر.
>
> • **Counter — ١٩٩ جنيهاً**
> للسرفيس السريع والمطابخ السحابية والتيك أواي: نقطة بيع، شاشة مطبخ، قائمة طعام،
> موقع طلب أونلاين بعلامتك، مناطق توصيل، تقارير، مخزون، صلاحيات لكل مستخدم، ولوحة
> متعددة الفروع.
>
> • **Dining room — ٤٩٩ جنيهاً**
> كل ما سبق، مع خريطة الصالة، وترتيب الأطباق على مراحل، وتقسيم الفاتورة، وتطبيق
> الكابتن على الموبايل، والدفع من الطاولة بكود QR.
>
> • **Group — بعرض سعر**
> مع المشتريات والمخزون والهالك وفروق الجرد، والموارد البشرية والأجور، ودفاتر
> محاسبية مزدوجة القيد تتغذّى من إقفال كل يوم، وواجهة برمجية محدودة الصلاحية مع
> إشعارات موقّعة.
>
> بدون عمولة على طلبات موقعك. وبدون رسوم لكل جهاز.
> الأسعار كاملة: pos.devya.dev/ar/pricing

**Post 3.2 — the "call us" post** (the §2.4 attack — no competitor named)

> لو سألت أي سيستم كاشير "بكام؟" وردّ عليك "كلّمنا وهنبعتلك عرض سعر" — ده مش سعر، ده
> مفاوضة. وانت هتدخلها وانت مش عارف الرقم الطبيعي كام.
>
> إحنا كاتبينه على الموقع، من غير ما تكلّم حد:
> ١٩٩ جنيه للفرع في الشهر للكاونتر. ٤٩٩ للصالة.
>
> اقراه الأول. لو ناسبك، كلّمنا.

**Post 3.3 — the per-branch arithmetic**

> ١٩٩ جنيهاً للفرع في الشهر.
> أقل من ٧ جنيهات في اليوم.
> أقل من ثمن وجبة واحدة على قائمتك.
>
> وبدون رسوم على كل جهاز — الفرع اللي عنده كاشيرين ما بيدفعش الضِعف.

---

### Pillar 4 — مبني جوّه مطبخ · "Built inside a kitchen"

**What it is:** the origin story, and the only credible answer to "why should I trust
a small Egyptian vendor". It was built inside a working restaurant. That is not a
marketing line, it is the product's actual development history, and it is the single
thing the incumbent structurally cannot say.

**Register:** عامية for the Arabic version, English for the separate
ecosystem/founder version. **Format:** static portrait + long caption; or
talking-head reel *if and when* somebody is willing to be on camera (see §7.4).

**Post 4.1 — day 1, the inoculation post** *(this is the deliberate naming exception
from §2.4)*

> فودكس شركة كويسة. وبتخدم مطاعم كبيرة بجد.
>
> إحنا مش بنقولك سيبها. إحنا بنقولك إن فيه مطاعم كتير في مصر — تلات فروع، تسع عمال،
> مطبخ واحد — مش هما دول اللي الأنظمة الكبيرة دي اتبنت عشانهم، ولا اتسعّرت عشانهم.
>
> DevyaPOS اتبنى جوّه مطعم شغّال، مش في اجتماع. كل حاجة فيه موجودة لأن وردية احتاجتها،
> مش لأنها شكلها حلو في عرض تقديمي.
>
> السعر مكتوب على الموقع. والتجربة ١٤ يوم بدون بطاقة ائتمان.

**Post 4.2 — English, for the ecosystem / future hires**

> We did not build a POS and then go looking for a restaurant.
>
> We were running the restaurant. The kitchen display exists because tickets were
> getting lost on a Thursday night. Recipe-costed inventory exists because nobody
> could say what a dish actually cost. Pay-at-table exists because the card machine
> was always at the other end of the room.
>
> Every feature in DevyaPOS is there because a shift needed it — which is also why
> there are features it does not have, and we would rather say so than sell you a
> slide.

---

### Pillar 5 — الامتثال، بدون وعود · "Compliance, without promises"

**What it is:** plain explanation of Egyptian VAT and ETA e-invoicing obligations —
what the law asks of a restaurant, what a receipt has to carry, what happens at
audit. **Educational, from us, about the rules — not a claim that DevyaPOS files to
the ETA.** (See the flag in §0. If we *do* integrate, rewrite this pillar; it becomes
much stronger.)

**Register:** فصحى, without exception. This is the pillar where colloquial would
destroy the credibility it exists to build. **Format:** carousel, 4–6 slides, dense,
saveable — this is the pillar people screenshot and send to their accountant, and
**saves are the metric here, not likes.**

**Post 5.1 — opening slide**

> ما الذي يجب أن تحمله فاتورة المطعم في مصر؟
> وما الفرق بين الإيصال الحراري الذي تطبعه للعميل، والمستند الذي يُطلب منك عند
> المراجعة؟
>
> هذه سلسلة تشرح الالتزامات، لا تبيع حلاً.
> اقرأ المزيد: pos.devya.dev/ar/eta-einvoicing

---

### Pillar 6 — الردّ الصريح · "The plain answer"

**What it is:** one real objection per post, answered without hedging — including the
answers that lose the sale. This pillar is also the account's recycling system: every
good question in the comments or the DMs becomes next week's post.

**Register:** عامية. **Format:** static with the question as the headline.

**Post 6.1 — the most important post in this plan**

> **"طب النت لو قطع؟"**
>
> إجابة صريحة: DevyaPOS بيشتغل في المتصفح، يعني محتاج نت. مفيش وضع أوفلاين دلوقتي.
>
> قلناها كده عشان تعرفها مننا، مش من أول يوم شغل.

**Post 6.2**

> **"أنا عندي فرع واحد بس. ينفع؟"**
>
> ينفع. ١٩٩ جنيه للفرع في الشهر — ومفيش حد أدنى لعدد الفروع، ومفيش رسوم تركيب، ومفيش
> عقد سنة.

**Post 6.3**

> **"الداتا بتاعتي هتبقى فين؟"**
>
> كل مطعم على قاعدة بياناته لوحده. ومفيش حد من فريقنا بيفتح بيانات مطعم من غير طلب
> مكتوب منك. والصلاحيات انت اللي بتحددها لكل مستخدم عندك.

**Post 6.4 — say no out loud**

> **"بتتوصلوا بطلبات وتطبيقات التوصيل؟"**
>
> لأ. مفيش ربط مع تطبيقات التوصيل دلوقتي.
>
> اللي عندنا هو موقع طلب باسمك انت، بصفر عمولة — وده حاجة تانية خالص. لو اللي محتاجه
> هو الربط بالتطبيقات، يبقى إحنا مش الحل بتاعك دلوقتي.

> Post 6.4 will feel like self-harm to the owner. It isn't. Publishing the boundary
> is what makes every other claim on the account believable, and it disqualifies the
> prospects who would have churned in month two anyway.

---

## 4. The 30-day launch calendar

### 4.1 Cold-start reality — read this before the table

A brand-new Facebook Page and a brand-new Instagram professional account have, for
practical purposes, **zero organic distribution**. Instagram will show post #1 to
almost nobody. Facebook will show post #1 to nobody at all. Any plan that assumes
"post good content and it will find them" is a plan to talk to an empty room for a
month.

So the first 30 days are **not** a content plan with distribution attached. They are
a **distribution plan with content attached**, and the distribution comes from five
places, in this order of value:

1. **The owner's own network, by hand.** The single highest-value action in month
   one: the owner personally sends the pricing post to restaurant owners he already
   knows, in WhatsApp, one at a time. This will out-perform the entire feed.
2. **The 25 branches already running DevyaPOS.** Their staff and their owner already
   know the product works. Ask them to follow and share day 1. Costs nothing.
3. **Facebook groups where Egyptian restaurant owners actually are.** In this market
   B2B SMB conversation lives in groups, not on pages — groups for restaurant and
   café owners, restaurant supplies and equipment, and F&B jobs. *Find and verify
   the specific groups yourself; I am not going to guess names.* **Rules: join as a
   person, not as the page; read for a week before posting; answer three operational
   questions with no link before ever mentioning DevyaPOS; obey each group's promo
   rules.** Getting the page banned from the two big groups on day 3 costs more than
   the first month of ads could buy.
4. **A small paid boost** purely to escape zero (see §5.2).
5. **The feed itself** — which only starts compounding in month two or three.

**Timing.** The Egyptian work week is Sunday–Thursday, but restaurants are at their
busiest Thursday through Saturday night. The owner is on the floor then and on his
phone Sunday and Monday morning. **Post Sunday–Wednesday, at roughly 11:00–13:00 or
21:00–23:00 Cairo time.** Avoid Friday entirely.

**Volume.** Five feed posts a week (Sun–Thu), stories most days. Do not attempt
daily feed posts: a new account with thin content burns credibility faster than it
builds reach.

### 4.2 Week 0 — before day 1 (do not skip)

| # | Task | Notes |
|---|---|---|
| W0.1 | Claim the handles (§6) | Instagram first — it is the scarcer namespace |
| W0.2 | Build the Business Portfolio and link Page ↔ IG (§6.4) | |
| W0.3 | **Bank 12 finished posts** | Launching with 2 posts in the drawer is how accounts die in week 3 |
| W0.4 | Prepare the demo tenant for screenshots (§7.2) | Plausible menu, plausible figures, placeholder `013…` phone numbers, no client name anywhere |
| W0.5 | Set the WhatsApp number and write the 6 canned replies (§5.1) | Every CTA in this plan lands in WhatsApp; if nobody answers it, none of this works |
| W0.6 | **Ask an existing customer for a redacted competitor quote** (§2.4) | Unlocks the strongest post we have |
| W0.7 | Start business verification (§6.5) | It takes days-to-weeks; starting on day 20 delays paid by a month |
| W0.8 | Resolve the loyalty / ETA copy conflict (§0) | Blocking. The account cannot be more honest than the site. |

### 4.3 Days 1–30

Format key: **R** = reel · **C** = carousel · **S** = static · **ST** = story

| Day | Pillar | Format | Post | What it is FOR |
|---|---|---|---|---|
| 1 | 4 | S + long caption | **4.1** — "فودكس شركة كويسة… وإحنا اتبنينا جوّه مطبخ" | Founding statement. Inoculates against "you're just the cheap one" before anyone can say it. Pin it. |
| 1 | — | ST ×3 | Handle reveal, "we're live", link sticker | Convert the owner's personal network into followers on day 1 |
| 2 | 3 | S | **3.1** — the full price list | **Pin as the second pinned post.** This is the page's actual product. Every ad, DM and group reply will point back here. |
| 3 | 1 | R | **1.1** — order → kitchen display in under a second | First proof-of-existence. Shows a screen doing a thing, which the incumbent never does. |
| 4 | 2 | C (5) | **2.3** — the five mistakes | Recognition, not persuasion. Built to be shared into a group by someone who isn't us. |
| 5 | 6 | S | **6.2** — "عندي فرع واحد. ينفع؟" | Removes the biggest silent disqualifier. Most of the market is one or two branches. |
| 6 | — | ST | Poll: "بتقفل الوردية إزاي؟ ورق / إكسل / سيستم" | Cheap engagement signal + genuine market research |
| 8 | 1 | R | **1.2** — pay at the table by QR | The strongest asset we own. Post it in week 1 while the account still has novelty. |
| 9 | 3 | S | **3.2** — "كلّمنا وهنبعتلك عرض سعر — ده مش سعر" | The competitive blow, landed on behaviour not on an uncitable number (§2.4) |
| 10 | 2 | C (4) | **2.2** — commission and who owns the customer | Highest-intent pain in Egyptian F&B. Expect the best comments of week 2 here. |
| 11 | 6 | S | **6.1** — "طب النت لو قطع؟" | Deliberate honesty post. The single biggest trust builder on the calendar. |
| 12 | 1 | R | **1.5** — no terminal to buy | Direct counter to the incumbent's 90%-off-hardware offer, without naming it |
| 13 | — | ST ×4 | Behind-the-scenes: a fix shipped this week | Humanises the account; proves somebody is actually home |
| 15 | 1 | R | **1.3** — the second round joins the running check | Nobody else in this market shows this. Wins the dine-in operator outright. |
| 16 | 5 | C (5) | **5.1** — what an Egyptian restaurant invoice must carry | The save-and-send-to-my-accountant post. Optimise for **saves**, ignore likes. |
| 17 | 3 | S | **3.3** — 199 = under 7 EGP a day, no per-terminal fee | Reframes the price against a number the owner already has in his head |
| 18 | 2 | S | **2.1** — full restaurant, unreadable month-end | Sets up recipe costing without pitching it |
| 19 | 6 | S | **6.3** — where does my data live | Pre-empts the objection that quietly kills deals in DMs |
| 20 | — | ST | Re-share the week's best comment thread | Social proof from a real question, not a testimonial we don't have |
| 22 | 1 | R | **1.4** — a coupon always beats an automatic offer, and they never stack | Boring, specific, and the most trust-building post in the set |
| 23 | 4 | S | **4.2** — English founder post | Different audience: ecosystem, future hires, partners. Do not translate it into Arabic; it is a different reader. |
| 24 | 6 | S | **6.4** — "لأ، مفيش ربط بتطبيقات التوصيل" | Publishes the boundary. Disqualifies the prospects who would churn in month two. |
| 25 | 1 | R | Multi-branch console: two branches, one screen | Opens the 3–10 branch segment, which is the real target |
| 26 | 2 | C (3) | Permissions: who is allowed to discount | Speaks directly to the owner's oldest fear — theft at the till |
| 29 | 3 | C (3) | Counter vs Dining room — what the 300 EGP difference buys | Pure conversion post; run it at the end when there is finally an audience |
| 30 | 6 | S | **Month-one recap: the questions we were asked most** | Turns the month's DMs into content, and signals the account is a conversation |

**Stories, throughout:** 3–5 frames most weekdays. Polls, a question sticker, a
screen clip, a re-shared comment. Stories are where a cold account earns the right
to be seen in the feed, and they cost almost nothing to produce.

**Do not** post on days 7, 14, 21, 28 (Fridays), and leave day 27 free as slack —
something will slip, and a gap you planned reads better than a gap you didn't.

---

## 5. Budget

### 5.1 With almost no money (0 – ~1,500 EGP/month)

Ranked by return per pound. The first three are free and beat everything below them.

1. **The owner sends the pricing post by hand, every day, to five people.** One
   WhatsApp message, personally written, to a restaurant owner he already knows.
   This is the highest-converting activity available to this business for the next
   six months and it costs nothing but discipline.
2. **Answer WhatsApp within minutes, in Egyptian Arabic, as a person.** Egyptian SMB
   buying happens in WhatsApp. Make the WhatsApp CTA the primary button on the
   Facebook Page. Pre-write six canned replies: price, does it work for one branch,
   what do I need to buy, how do I move my menu across, is there a trial, and how
   long does setup take. **A DM answered in four hours is a lost deal.**
3. **The 25 existing branches.** Ask the owner and staff to follow and share on day
   1. Ask for a Google review. Ask — carefully, once, and accept no — whether one of
   them would let us film thirty seconds of the counter during a quiet hour (§7.4).
4. **Facebook groups, played long.** Per §4.1(3): join as a person, give real
   operational answers with no link for a week or two, and become the person who
   knows the answer. This is slow, unglamorous, and the single best organic channel
   in this market.
5. **Repurpose, don't re-create.** Each screen recording is one reel + three story
   frames + one carousel slide + one WhatsApp reply asset. Twelve recordings covers
   two months.
6. **Answer every comment within the hour**, including the hostile ones. On a new
   account, a live comment thread is worth more than the post it hangs from.

### 5.2 With a small paid budget — what to buy first

Assume **5,000–15,000 EGP/month**. Buy in this order and do not skip ahead.

1. **Click-to-WhatsApp ads. Not traffic ads. Not "page likes". Not boosts.** The
   objective is `Messages`, the destination is WhatsApp, the creative is the pricing
   post (3.1) or the "call us for a quote isn't a price" post (3.2). An Egyptian
   restaurant owner will not fill in a web form; he will send a voice note. Buy the
   conversation, not the click. *~50% of budget.*
2. **Retargeting.** Install the Meta pixel on `pos.devya.dev` (it is a Next.js app
   on Vercel — a ten-minute job) and retarget everyone who hit `/ar/pricing`,
   `/ar/compare` or `/ar/foodics-alternative`. Highest-intent audience we will ever
   have. This audience does not exist until the pixel has been live a few weeks —
   **which is why the pixel goes in during week 0, not when you start spending.**
   *~25%.*
3. **One reel, boosted properly.** Take whichever of 1.2 / 1.3 / 1.4 performed best
   organically and put real money behind that one — not a fresh creative. *~15%.*
4. **A small always-on awareness layer** in Cairo, Giza and Alexandria against
   restaurant-owner and small-business-admin interest and behaviour segments.
   *~10%.*

**Do not buy, in month one:** page likes or follower campaigns (a follower is not a
pipeline — §6 of this document exists to prove it); "boost post" from the app, which
optimises for the wrong thing; influencer placements, which are food-consumer
audiences and we sell to operators; or a broad national reach campaign.

**Targeting note.** Meta will not let you target "restaurant owner" precisely.
Realistically: geo Cairo/Giza/Alexandria, 28–55, plus small-business-owner and
restaurant-industry interest stacks — and then let the **creative** do the
qualifying. A creative that opens with "١٩٩ جنيه للفرع في الشهر" self-selects
ruthlessly, which is the whole reason to lead with the price.

**Required for any Egyptian ad account:** the advertiser/beneficiary-payer
disclosure, and — following the incumbent's practice — the tax registration number
in offer creative plus a `تُطبق الشروط والأحكام` line on anything promotional.

---

## 6. Account setup

### 6.1 Handles — recommendation and how availability was checked

**Recommended, both platforms: `devyapos`.**

- Instagram: **`@devyapos`**
- Facebook Page username: **`facebook.com/devyapos`**

Matching the two is worth more than any cleverness; it is what a prospect types after
seeing the other one.

**How this was checked (2026-09-19), and what the check is worth.** Each profile URL
was fetched and the returned `<title>` read. An Instagram account that exists returns
`Name (@handle) • Instagram photos and videos`; one that does not returns the generic
`Instagram` error page. Facebook was checked in a logged-in session: an unclaimed
username renders "This content isn't available right now".

| Handle | Instagram | Facebook |
|---|---|---|
| `devyapos` | **appears free** | **appears free** |
| `devyapos.eg` | appears free | appears free |
| `devya.pos` | appears free | — |
| `devya_pos` | appears free | — |
| `devyapos_eg` | appears free | — |
| `devyasolutions` | appears free | appears free |
| `getdevyapos` | appears free | — |
| `devya` | **TAKEN** — "Devya Patel Patel" | — |
| `devyatech` | **TAKEN** — "Ruchi" | — |

**Fallback order if `devyapos` is gone by the time you sign up:** `devyapos.eg` →
`devya.pos` → `getdevyapos`. Avoid `devya_pos` — underscores get lost when people
retype a handle from memory.

> **Caveat, and it matters.** "Appears free" is an inference from an error page, not
> a reservation. Instagram and Facebook only confirm availability inside the signup
> form, and handles can be reserved, restricted, or recycled in ways the public URL
> does not reveal. **Claim `devyapos` on both platforms in the same sitting**, before
> writing a single post. Handles are the one thing in this plan with a deadline.

### 6.2 Profile copy — Instagram

**Display name** (this field is searched, so it must carry the keyword, not just the
brand):

```
DevyaPOS | نظام مطاعم مصري
```

**Bio — Arabic (recommended default):**

```
سيستم مطاعم بيشتغل على الأجهزة اللي عندك 🇪🇬
كاشير + شاشة مطبخ + موقع طلب باسمك + مخزون
من ١٩٩ ج.م للفرع/الشهر — بدون عمولة على أوردراتك
السعر مكتوب تحت 👇
```

*Line 1 colloquial (the reader), line 3 carries the number in numerals (scannable),
line 4 is an instruction. No hashtags in the bio — they do nothing there.*

**Bio — English (for the `en` variant, or if the owner prefers an English bio):**

```
The Egyptian restaurant OS 🇪🇬
POS · kitchen display · your own ordering site · inventory
From EGP 199/branch/month — zero commission on your orders
Price published 👇
```

**Category:** `Software Company`.
**Contact buttons:** WhatsApp (primary), Email, Call.
**Location:** set it. The incumbent does (Fifth Settlement), and a visible Egyptian
address is worth real trust to a buyer deciding whether we are a real company.

### 6.3 Profile copy — Facebook

**Page name:** `DevyaPOS`
**Username:** `facebook.com/devyapos`
**Category:** `Software Company` (secondary: `Information Technology Company` — what
the incumbent uses)

**Short description (255 chars) — Arabic:**

```
نظام تشغيل مطاعم مصري: نقطة بيع، شاشة مطبخ، موقع طلب أونلاين بعلامتك، ومخزون
بوصفات مُسعّرة. يعمل في المتصفح على أجهزتك. من ١٩٩ جنيهاً للفرع شهرياً، بدون عمولة
على طلباتك، وبدون رسوم لكل جهاز.
```

*Modern Standard here, deliberately: the Facebook About section is the closest thing
the page has to a company registration document, and it is read by people checking
whether we are real.*

**Call-to-action button:** `Send WhatsApp Message` — not "Learn More", not "Sign Up".
This is where the deals happen.

> **Note the incumbent's mistake and don't copy it:** their Facebook description is
> in **English** while all their actual posts are in Egyptian Arabic. Their About
> section is talking to a different person than their feed is.

### 6.4 Link strategy

**Do not use Linktree.** The incumbent does (`linktr.ee/foodicsegypt`), and it is a
mistake: it inserts a dead interstitial between intent and the page, leaks the click
to a third party, and hands your attribution to someone else's analytics.

Instead:

- **Instagram bio link:**
  `https://pos.devya.dev/ar/pricing?utm_source=instagram&utm_medium=bio&utm_campaign=launch`
  Point it at **pricing**, not the homepage. Price is the differentiator; make it
  the destination, not something they have to navigate to.
- **Facebook Page website field:** the same URL with `utm_source=facebook`.
- **Per-post links:** unique `utm_content` per post, so post-level attribution is
  possible without a link-in-bio tool.
- **Instagram Stories:** link sticker straight to the relevant page — `/ar/pricing`,
  `/ar/foodics-alternative`, `/ar/hardware`, `/ar/eta-einvoicing` all exist already
  and all are better story destinations than the homepage.
- **WhatsApp:** a `wa.me` click-to-chat link with a pre-filled Arabic message
  (`عايز أعرف تفاصيل أكتر عن DevyaPOS`) so the prospect does not have to compose the
  awkward first sentence. Put it in the IG bio's contact button and the FB CTA.

### 6.5 Meta structure, and what needs documents

Build it in this order. Getting it wrong is painful to unwind once there is ad spend
and pixel history attached.

1. **Business Portfolio** in Meta Business Suite, owning everything.
   ⚠️ **A "Devya Solutions" Page/business identity already exists on the owner's Meta
   account** — it surfaced during this research as the active commenting identity.
   Decide deliberately: DevyaPOS should be its **own Page** inside a shared Devya
   business portfolio, not a rename of the existing one. The parent brand and the
   product need separate audiences, separate pixels and separate ad accounts, and a
   rename destroys whatever history the existing page has.
2. **Facebook Page** `DevyaPOS`, owned by the portfolio — never by the owner's
   personal profile alone.
3. **Instagram professional account**, set to **Business** (not Creator — Creator
   loses shop features, some scheduling, and some ad placements), linked to the Page
   *through the Business Portfolio*, not through the Instagram app.
4. **Ad account** (EGP as the currency — do not set it to USD, it complicates
   invoicing and the beneficiary disclosure), plus a **payment method**.
5. **Meta Pixel / Conversions API** on `pos.devya.dev`. **Week 0** — the retargeting
   audience in §5.2(2) does not exist until the pixel has been collecting for weeks.
6. **WhatsApp Business.** Start on the free **WhatsApp Business app** with a
   dedicated SIM. Only move to the **WhatsApp Business Platform (API)** when volume
   justifies it — and note that the API path *requires* completed business
   verification.

**Requires business verification documents** — start in week 0, it can take
days to weeks:

- Egyptian **commercial register** (السجل التجاري)
- **Tax card** (البطاقة الضريبية) — and the tax registration number then goes in
  offer creative, as the incumbent does
- Proof of address matching the register (utility bill or lease)
- A business email on the `devya.dev` domain (a Gmail address will fail verification)
- A phone number that can receive the verification call/SMS

Blocked until verification completes: WhatsApp Business Platform API, higher ad
spend limits, the Meta verified badge, and some lead-gen and messaging ad features.
**This is the long pole in the launch. Start it first.**

---

## 7. Measurement, rules and risks

### 7.1 What to measure

**The whole argument for this section, in one observed fact:** the incumbent has
25,500 Instagram followers and gets a median of 23 likes. A follower count is not a
pipeline. Do not build a dashboard that would have told Foodics they were winning.

**Numbers that matter** — in descending order:

| Metric | Why |
|---|---|
| **Qualified WhatsApp conversations started** | The actual top of funnel. Someone who asks "بكام؟" is worth more than 1,000 followers. |
| **Demo requests / trials started** | 14-day trial, no card. Count trials, not signups-in-progress. |
| **Trial → paid conversion rate** | The only number that says whether the *product* is landing |
| **Branches activated** (not accounts) | Revenue is per branch per month. A 4-branch customer is four units. |
| **MRR and MRR per branch** | |
| **CAC per activated branch, by channel** | Tag every conversation with its source. Without this, §5's budget order is faith. |
| **Payback period** | At 199 EGP/branch/month, a 3,000 EGP CAC takes 15 months to repay before churn. This number governs how much paid is sane. |

**Content metrics that are actually leading indicators** — and note that likes is not
among them:

- **Saves** — the strongest B2B signal there is. A save means "I'll need this when I
  decide." Pillar 5 (compliance) and Pillar 3 (pricing) should be judged almost
  entirely on saves.
- **Shares / sends** — someone sending a post to a business partner is a two-person
  lead.
- **Profile visits → link clicks → WhatsApp opens** — the actual funnel. Watch the
  ratios, not the absolute numbers.
- **Comment *questions*** (as distinct from comment emoji). Every question is a lead
  and should be answered as one.
- **DM reply rate and time-to-first-reply**, ours. If median first-reply time is over
  30 minutes in business hours, fix that before buying any ads.

**Vanity metrics to ignore, by name:** follower count, follower growth rate,
impressions, reach, likes, "engagement rate", reel plays, and Page likes. Every one
of these can be bought for a few hundred pounds and none of them has ever paid a
salary. If the owner wants one number on a wall, make it **WhatsApp conversations
per week**.

**Review cadence:** weekly, one page, three numbers — conversations started, trials
started, branches activated. Do not review daily; a new account's daily numbers are
noise and reacting to them produces a scattered feed.

### 7.2 What must never be posted

Hard rules. No exceptions, no "just this once", no "we blurred it".

- **No real client data, ever.** No branch name, no real sales figures, no staff
  names, no order values, no real customer names or phone numbers, no client menu
  prices, no screenshots of WhatsApp threads with a client.
- **No screenshot with live figures.** Every screenshot and screen recording comes
  from **the demo tenant**, seeded deliberately for the purpose. Per repo policy,
  seed fixtures use placeholder phone numbers in the **`013` range** (unallocated by
  the NTRA — the Egyptian shape is intact and the number reaches nobody). Verify
  before every capture that the tenant selector shows the demo tenant, not a client
  stack. A screen recording made on a production stack at 2am is exactly how this
  rule gets broken.
- **No customer's face without written consent.** Not staff, not diners, not a wide
  shot of a full dining room. "They didn't mind" is not consent. Get it in writing,
  and re-get it if the clip is reused in a paid ad — organic consent is not ad
  consent.
- **No client named without written permission**, and none of the 25 existing
  branches referenced identifiably until the owner has said yes in writing.
- **No capability we don't have.** The §0 list: loyalty, marketing campaigns, push
  notifications, offline mode, aggregator integrations. Specifically: never write
  "بيشتغل من غير نت" or anything that implies offline operation.
- **No competitor price figure without a citable, dated source** (§2.4).
- **No fabricated social proof.** No invented testimonials, no "trusted by 500
  restaurants", no stock-photo "customers". In a market this small, one fabricated
  claim discovered ends the brand.
- **No screenshots containing internal URLs, staging hostnames, tenant slugs, admin
  emails or JWTs.** Crop deliberately; the browser address bar has ended other
  companies.

### 7.3 Handling a public complaint

It will happen — most likely on a paid post, in Arabic, from someone who is not even
a customer. The response is a procedure, not a mood.

1. **Reply within the hour, in business hours. Always reply.** A deleted or ignored
   complaint gets screenshotted and reposted; a replied-to complaint gets scrolled
   past. Never delete, never hide, never block — unless it is spam, a scam link, or
   abuse of a named individual.
2. **Reply in the language and register the complainant used.** If they wrote
   colloquial, answer colloquial. If they wrote Franco, answer Franco. Switching to
   فصحى to sound official reads as a brush-off.
3. **First reply does three things and nothing else:** acknowledge specifically (not
   "نعتذر عن الإزعاج"), state what you are doing about it, and move to DM.

   > حصل معاك ايه بالظبط وفي أنهي فرع؟ بعتلنا على الخاص دلوقتي وأنا شايفها معاك
   > حالاً.

4. **Never confirm or deny whether someone is a customer in public.** Not even to
   defend yourself — that is their information, not ours. If a complainant names
   their own restaurant, that is their choice; we still do not repeat it.
5. **Never argue in the thread, never correct them publicly, never reply twice.**
   One public reply, then DM. A second public reply is the start of a fight and
   the fight is the content everyone else will see.
6. **If it is our fault, say so plainly, in public, once.** An Egyptian SMB audience
   forgives a straight admission far faster than it forgives a corporate
   non-apology. If the fix ships, post the fix — with the complainant's permission,
   name them as the person who found it. That converts a critic into the best
   reference you have.
7. **If it is a competitor's ad-hominem or an obvious brigade:** do not engage at
   all. Screenshot it, log it, move on.
8. **Escalation:** anything involving money lost, data, a legal threat, or a
   journalist goes to the owner before any reply is typed. No exceptions and no
   speed requirement — a considered reply at hour six beats a wrong one at minute
   ten.

### 7.4 What this plan needs that the business does not have yet

Stated plainly so nothing here is quietly assumed into existence:

- **No videographer, and no budget for one.** Every reel in the calendar is
  therefore a **screen recording**, which one person can produce on a laptop. Two
  genuine advantages come with that constraint: it is free, and it is exactly the
  specificity the incumbent's polished, empty video never has. Do not wait for a
  camera crew before launching.
- **No customer who has agreed to appear.** The incumbent runs customer-story reels
  (the `@basq.eg` one, Sep 7). We cannot, today. **Ask one of the 25 branches — once,
  in writing, and accept a no.** Until someone says yes, there are no customer
  stories, and Pillar 4 carries the credibility load on founder voice alone.
- **No paid budget assumed.** §5.1 is written to work at zero, and the calendar in
  §4.3 does not depend on a single boosted post. §5.2 activates whenever money
  appears.
- **No Arabic copywriter.** The captions in §3 are launch-ready drafts, not a
  content engine. A native Egyptian ear should read anything new before it ships —
  the owner's own is fine and probably better than a hire.
- **No business verification yet**, which blocks the WhatsApp API, higher spend
  limits, and the verified badge (§6.5). Start week 0.
- **No pixel history**, which means retargeting — the highest-ROI paid tactic
  available — does not work in month one no matter what is spent. Install the pixel
  in week 0 so month two has something to retarget.
- **No social proof of scale.** 25 branches is a real number and a good one; it is
  not "500 restaurants" and must never be inflated into one. Use the real number:
  *٢٥ فرعاً شغّالين عليه دلوقتي* is more persuasive than a round number nobody
  believes.

---

## 8. Sources

All fetched or read on **2026-09-19**:

- Instagram — `instagram.com/foodicsegypt` (profile and individual post pages, read
  logged out)
- Facebook — `facebook.com/Foodicsegypt` (read logged in; per-post engagement counts
  could not be extracted)
- Meta Ad Library — `facebook.com/ads/library`, `country=EG`, active, keyword
  `foodics`
- `foodics.com`, `foodics.com/pricing/`, `foodics.com/eg/pricing/` (the last
  redirects to the homepage; no price literals found on any of them)
- `pos.devya.dev`, and `content/ar.ts` / `content/en.ts` in this repo
- Instagram and Facebook handle-availability probes as described in §6.1
