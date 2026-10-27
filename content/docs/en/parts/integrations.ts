import type { DocArticle } from "../../types";

/* Follows content/docs/ar/parts/integrations-pos.ts article for article, block for block; the sources are listed there. */
export const articles: DocArticle[] = [
    {
      slug: "zatca-e-invoicing",
      title: "Issue e-invoices with ZATCA",
      summary:
        "On Saudi accounts each paid order becomes a signed simplified tax invoice reported to Fatoora once it's on and your branches onboarded. Egypt's aren't sent.",
      keywords: [
        "ZATCA",
        "زاتكا",
        "Fatoora",
        "فاتورة",
        "e-invoicing",
        "Phase 2",
        "simplified tax invoice",
        "credit note",
        "الفوترة الإلكترونية",
        "ETA",
      ],
      reviewed: "2026-10-27",
      before: [
        "Your Moving POS account is a Saudi account in riyals, and the Moving team has switched on ZATCA e-invoicing for it.",
        "**VAT rate (%)** in **Settings** is 15. See [Set business settings and VAT](/docs/setup/business-settings-and-tax).",
        "You hold the **Manage ZATCA e-invoicing** permission, given to the **Admin** role by default.",
        "You can sign in to your business's Fatoora portal to generate onboarding codes.",
      ],
      body: [
        {
          t: "p",
          text: "You don't issue invoices by hand. The system issues a signed simplified tax invoice for each order when it is paid: at the till, when an online payment is confirmed, or when a table check is settled. An online order paid in cash on pickup or delivery is invoiced when it is handed over. If an order is cancelled after it was invoiced, a credit note is issued for it automatically.",
        },
        {
          t: "callout",
          tone: "note",
          text: "ZATCA e-invoicing is switched on for your Saudi account by the Moving team, and it doesn't appear on Egyptian accounts. If you don't see **ZATCA e-invoicing** in the sidebar, message us.",
        },
        { t: "h2", id: "set-up", text: "Enter the seller and onboard your branches" },
        {
          t: "steps",
          items: [
            {
              title: "From the sidebar, open **System › ZATCA e-invoicing**.",
              body: "The **Before this stack can issue invoices** strip shows what is missing before onboarding, such as the VAT rate or the seller profile.",
              shot: {
                id: "pos-integrations-zatca",
                alt: "The ZATCA e-invoicing page in the back office: the readiness strip, the alerts, and the Seller profile, Branches, Documents, VAT report and Archive tabs.",
                caption: "Set-up starts on the Seller profile tab; each branch is then onboarded from the Branches tab.",
              },
            },
            {
              title: "Fill in the **Seller profile** tab and click **Save profile**.",
              body: "Enter the **Seller legal name** exactly as registered, the **VAT registration number** (15 digits, starting and ending with 3) and the **National address**, and choose the **ZATCA environment**.",
            },
            {
              title: "Clear the **Arabic checklist**.",
              body: "Arabic is mandatory on a Saudi invoice, so no branch can be onboarded until the seller details and every item and option have an Arabic name.",
            },
            {
              title: "Generate an onboarding code in the Fatoora portal.",
              body: "Under “Onboard new solution unit/device”, generate one code per branch. It is 6 digits and valid for 1 hour. Sandbox needs no code.",
            },
            {
              title: "Onboard each branch from the **Branches** tab.",
              body: "Click **Onboard** next to the branch, enter the **One-time password (OTP)**, then click **Start onboarding**. The system requests the branch's certificate and runs the **Compliance checks**; the unit becomes **Active** or **Failed**, with ZATCA's reason.",
            },
          ],
        },
        {
          t: "table",
          head: ["Environment", "What it means"],
          rows: [
            ["**Sandbox**", "Test — not reported to ZATCA"],
            ["**Simulation**", "ZATCA simulation — not a legal record"],
            ["**Production**", "Live — reported to ZATCA as tax records"],
          ],
        },
        {
          t: "callout",
          tone: "warning",
          text: "**Production** asks you to tick an acknowledgement that its invoices are legal tax records, and needs fresh codes from the Fatoora portal. The Moving team never asks for your Fatoora sign-in.",
        },
        { t: "h2", id: "at-the-till", text: "At the till and on your ordering site" },
        {
          t: "list",
          items: [
            "The receipt prints **Simplified Tax Invoice** with the invoice's QR code, and the order page on your ordering site shows the invoice and its code.",
            "For a buyer who needs an invoice in their company's name, turn on **Tax invoice for a business** in the **Payment** dialog, and enter the **Registered name**, the **VAT number (15 digits)** or another ID type, and the **National address**. ZATCA clears this invoice before it is handed over.",
            "If clearance is slow, the receipt prints **Awaiting ZATCA clearance — not yet a tax invoice. Reprint once it is cleared.** Press **Check clearance**, then reprint.",
          ],
        },
        { t: "h2", id: "documents", text: "Follow documents and reports" },
        {
          t: "list",
          items: [
            "**Documents**: search by document or order number, click **Retry** for a **Rejected** or **Pending** document, and download **XML** or **Buyer's XML**.",
            "**Credit note** to correct part of an invoice: choose **Items** or **Amount**, enter the reason, then click **Issue credit note**. It needs the **Issue ZATCA credit notes** permission, and the money itself is refunded at the till or on the card as usual.",
            "**VAT report**: output VAT for a period of up to 92 days, with **Download CSV**.",
            "**Archive**: **Download archive (ZIP)** of every signed document in a period, with the **Export the ZATCA archive** permission. Keep each file at least six years after the end of its tax period.",
            "The page alerts you to rejected documents, anything waiting to be reported for more than 12 hours, branches with no active unit, and certificates that expire within 30 days. Renew them with **Renew certificate**.",
          ],
        },
        { t: "h2", id: "egypt", text: "In Egypt" },
        {
          t: "p",
          text: "Moving POS doesn't send e-invoices or e-receipts to the Egyptian Tax Authority. It works out VAT within the inclusive price of each order, and sales are exported from the [reports](/docs/reports/sales-reports) as CSV.",
        },
        {
          t: "qa",
          items: [
            {
              q: "What do I do with a **Rejected** document?",
              a: "Open it under **Documents**, click **Show error**, fix the cause, then click **Retry**.",
            },
            {
              q: "Do I issue a credit note for every cancelled order?",
              a: "No, one is issued automatically when an invoiced order is cancelled. A manual note is only for a partial correction.",
            },
            {
              q: "Does Moving POS send Egyptian invoices to the tax authority?",
              a: "No. E-invoicing in Moving POS is with ZATCA in Saudi Arabia only.",
            },
          ],
        },
      ],
      related: [
        "setup/business-settings-and-tax",
        "selling/take-payment",
        "selling/receipts-and-order-numbers",
        "integrations/accounting",
      ],
    },
    {
      slug: "delivery-apps",
      title: "Record delivery-app orders at the till",
      summary:
        "Add each delivery app you sell on as a channel with its own prices, excluded items and commission, then enter its orders at the till. No app is linked by API.",
      keywords: [
        "delivery apps",
        "Talabat",
        "طلبات",
        "Elmenus",
        "إلمنيوز",
        "app commission",
        "margin",
        "aggregator",
        "تطبيقات التوصيل",
      ],
      reviewed: "2026-10-27",
      before: [
        "You hold the **Manage delivery apps** permission, given to the **Admin** role by default.",
      ],
      body: [
        {
          t: "p",
          text: "A delivery app in Moving POS is a sales channel you set up once: its name, its prices, the items not sold on it, and its commission. The order reaches you on the app itself; the cashier then enters it by picking the app, so it is priced at that app's menu and its commission is counted in the reports. One app is shared by every branch.",
        },
        {
          t: "callout",
          tone: "warning",
          text: "There is no API link with Talabat, Elmenus or any other app: orders don't reach the till by themselves, and the menu and prices aren't sent to the apps. Enter each order at the till, and update your menu in the app's own dashboard.",
        },
        { t: "h2", id: "add-an-app", text: "Add a delivery app" },
        {
          t: "steps",
          items: [
            {
              title: "From the sidebar, open **Business › Delivery apps**.",
              shot: {
                id: "pos-integrations-delivery-apps",
                alt: "The Delivery apps page in the back office: the list of apps with their status and commission options, the New delivery app button, and the What is left after commission panel.",
                caption: "Each app shows with its commission; its prices and exclusions open from here.",
              },
            },
            {
              title: "Click **New delivery app** and enter the **Name**.",
              body: "Use the name your team knows it by, and leave **Active** ticked.",
            },
            {
              title: "Add the first commission option, then click **Save**.",
              body: "Enter a **Label** and choose the **Mode**: **Percentage**, **Flat fee** or **Percentage + flat fee**. Then enter the **Commission (%)** from 0 to 100, the **Flat fee (EGP)**, or both.",
            },
          ],
        },
        { t: "h2", id: "prices-and-exclusions", text: "Set prices, exclusions and commission" },
        {
          t: "p",
          text: "Click **Manage** next to the app to open three tabs:",
        },
        {
          t: "table",
          head: ["Tab", "What you set"],
          rows: [
            [
              "**Prices**",
              "A price per variant under **Override price (EGP)**. Saving replaces all the prices with what is shown, and variants without an override use the standard menu price.",
            ],
            [
              "**Exclusions**",
              "Tick a product to exclude it from this app entirely, or expand it to exclude specific variants. Saving replaces the full list.",
            ],
            [
              "**Markup**",
              "The named commission options: **Add option**, edit or delete one. At least one option must remain.",
            ],
          ],
        },
        {
          t: "p",
          text: "The app's price comes before the branch price, and the branch price before the base price. Commission is for tracking only and doesn't change what the guest pays. Deleting an app that has orders deactivates it instead.",
        },
        { t: "h2", id: "at-the-till", text: "Enter the order at the till" },
        {
          t: "steps",
          items: [
            {
              title: "Pick the app under **Delivery app** before adding items.",
              body: "The menu shows at the app's prices, without its excluded items. The field shows when at least one active app exists, and it “Can only be changed while the cart is empty.”",
            },
            {
              title: "Pick a **Rate** if it appears.",
              body: "It appears when the app has more than one commission option, and the order can't be completed until one is picked. With a single option, it applies itself.",
            },
            {
              title: "Add the items and complete the order as usual.",
              body: "See [Take an order at the POS](/docs/selling/take-an-order).",
            },
          ],
        },
        { t: "h2", id: "commission-and-margins", text: "Track commission and margins" },
        {
          t: "list",
          items: [
            "The shift report has a **Delivery apps** section: **Collected for apps**, **App commission**, **Kept (net)**, and each app by payment method. **Net revenue** is gross sales less delivery-app commission.",
            "Under **What is left after commission**, choose a range (the last 30 days by default) and click **Measure margins**. Each item shows its **App price**, **Cost**, **Commission taken** and what is left **Per unit** and over **This range**, with a verdict: **Loss**, **Thin**, **No recipe**, **Not sold** or **OK**.",
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Do Talabat orders reach the till by themselves?",
              a: "No. Enter each order at the till after picking the app under **Delivery app**.",
            },
            {
              q: "Why can't I change the app on an order?",
              a: "Because the cart has items, and prices change with the app. Empty the cart, then pick the app.",
            },
            {
              q: "Is the commission added to the guest's bill?",
              a: "No. Commission is counted in the reports only; the guest pays the app's price.",
            },
          ],
        },
      ],
      related: [
        "selling/take-an-order",
        "branches/branch-prices-and-availability",
        "reports/shifts-and-z-reports",
      ],
    },
    {
      slug: "pos-api-and-webhooks",
      title: "Connect your systems with API keys and webhooks",
      summary:
        "Create API keys that read your orders, branches and menu with the permissions you pick, add webhook endpoints for signed events, and follow every delivery.",
      keywords: [
        "API",
        "API key",
        "مفتاح الوصول",
        "public API",
        "webhook",
        "الويب هوك",
        "endpoint",
        "signing secret",
        "integration",
        "تكامل",
      ],
      reviewed: "2026-10-27",
      before: [
        "The Moving team has switched on API access for your account.",
        "You hold the **Manage API keys & webhooks** permission, given to the **Admin** role by default.",
      ],
      body: [
        {
          t: "p",
          text: "The **Integrations** screen in the back office holds the API keys for outside systems, the endpoints the restaurant's events go to, and the log of deliveries. A key can never do more than the person who minted it. When the store link is switched on for your account, the same screen shows an **Online store** tab for linking your store on Moving Stores, Moving POS's sister product, to the till.",
        },
        {
          t: "callout",
          tone: "note",
          text: "API access is switched on for your account by the Moving team. If you don't see **Integrations** in the sidebar, message us.",
        },
        { t: "h2", id: "create-a-key", text: "Create an API key" },
        {
          t: "steps",
          items: [
            {
              title: "From the sidebar, open **System › Integrations**.",
              body: "The **API keys** tab opens.",
              shot: {
                id: "pos-integrations-api-keys",
                alt: "The Integrations screen in the back office on the API keys tab: the New key button and the list of keys with their key, scopes, expiry, last use and state.",
                caption: "The list shows each key's fingerprint only, never the key itself.",
              },
            },
            {
              title: "Click **New key** and enter the **Name**.",
              body: "Say who the key is for. The name shows in the list and in the audit trail.",
            },
            {
              title: "Tick the **Scopes**.",
              body: "Tick at least one. Only the permissions you hold yourself are listed.",
            },
            {
              title: "Pin the key to a branch and set its expiry, if you like.",
              body: "Pick a branch under **Pin to one branch**, or leave **Every branch the owner can see**. The key stops at the end of the **Expires** day; leave it empty for **No expiry**.",
            },
            {
              title: "Copy the key from **Copy this key now**.",
              body: "Click **Copy**, then **I have stored it**. This is the only time it is shown, and nobody, support included, can recover it.",
            },
          ],
        },
        {
          t: "p",
          text: "A key is **Live**, **Expired** or **Revoked**, with its **Last used** date. **Revoke**, with **Why (optional)**, stops the key from its very next request. The key is checked on every request against its owner's current permissions, so taking a permission away from the owner narrows the key at once.",
        },
        { t: "h2", id: "what-a-key-reads", text: "What a key reads" },
        {
          t: "table",
          head: ["Data", "Permission needed"],
          rows: [
            ["Orders and each order's details, filtered by period, branch and status", "**View reports**"],
            ["Branches", "**View reports**"],
            ["Menu and catalogue", "**Manage menu & catalog**"],
          ],
        },
        {
          t: "list",
          items: [
            "Send the key in the `Authorization: Bearer` header. The limit is 600 requests a minute per key.",
            "Creating and cancelling orders is open only to the linked Moving Stores store, so no other system can send orders to the till.",
            "There is no published API reference page. Message us for the technical details.",
          ],
        },
        { t: "h2", id: "add-a-webhook", text: "Add a webhook endpoint" },
        {
          t: "steps",
          items: [
            {
              title: "Open the **Webhooks** tab and click **New endpoint**.",
            },
            {
              title: "Enter the **Name** and **URL**, and tick the **Events**.",
              body: "The URL is where events are sent: a full address starting with `https` or `http`. Tick at least one event, leave **Active** ticked, then save.",
            },
            {
              title: "Copy the signing secret from **Copy this signing secret now**.",
              body: "It is shown once, and your receiver uses it to check that each delivery came from your restaurant.",
            },
          ],
        },
        {
          t: "table",
          head: ["Event", "When it is sent"],
          rows: [
            ["**Order created** `order.created`", "A new order from the till or the ordering site, without guest details."],
            ["**Order completed** `order.completed`", "When the order is served or delivered."],
            ["**Online order status changed** `order.status_changed`", "Online orders only, once per status."],
            ["**Cash day closed** `day.closed`", "When a business day is closed, with the closing report's totals."],
            ["**Ingredient running low** `stock.low`", "Once each time an ingredient drops below its threshold."],
          ],
        },
        {
          t: "p",
          text: "Events carry no names and no customer contact details; they are built on identifiers and quantities. Each delivery is signed with HMAC-SHA256 over the message body with the signing secret, and carries an event id that stays the same on every attempt so your receiver can ignore repeats. **New signing secret** replaces the secret, and your receiver rejects every delivery until it is given the new one. Deleting an endpoint deletes its delivery history; switch it off instead to keep the history.",
        },
        { t: "h2", id: "deliveries", text: "Follow deliveries" },
        {
          t: "list",
          items: [
            "The **Deliveries** tab shows the **Event**, **Destination**, **Attempts**, **Last result** and **Next attempt**, with the status **Waiting**, **Delivered** or **Gave up**.",
            "A failed delivery is retried by itself up to 6 attempts: after 30 seconds, then 1 minute, then 2, 4 and 8 minutes, with a 10-second timeout per attempt. It is retried on a network error, a timeout and `5xx`, `408` and `429` replies; any other `4xx` reply stops it on the first attempt.",
            "A delivery that has given up isn't retried by itself. Choose **Show only the ones that gave up**, fix the receiver, then click **Retry**.",
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I send orders to the till from my system?",
              a: "No. Keys here are for reading and events; creating orders is open only to the linked Moving Stores store.",
            },
            {
              q: "I lost the key. Can I see it again?",
              a: "No. Create a new key and revoke the old one.",
            },
            {
              q: "Are these the same keys as Moving Stores'?",
              a: "No. These keys read Moving POS data; Moving Stores has its own keys and webhooks in the store's admin.",
            },
          ],
        },
      ],
      related: [
        "setup/staff-and-permissions",
        "reports/orders-and-activity-log",
        "integrations/accounting",
      ],
    },
    {
      slug: "accounting",
      title: "Use the Accounting app with Moving POS",
      summary:
        "Double-entry books for your business in Egypt or Saudi Arabia, alone or with Moving POS. Till sales arrive once the hand-off is set up; try it free for 14 days.",
      keywords: [
        "accounting",
        "Accounting app",
        "journal",
        "ledger",
        "hand-off",
        "day close",
        "free trial",
        "المحاسبة",
        "bookkeeping",
        "ترحيل الحسابات",
      ],
      reviewed: "2026-10-27",
      before: [
        "An account in the Accounting app: the Moving team sets it up for Moving POS customers, or you start with a free trial.",
      ],
      body: [
        {
          t: "p",
          text: "The **Accounting** app is separate from the till and the back office: it has its own sign-in and users, and a system and database for your business alone. Every figure in it is an entry in the journal, and a mistake is fixed with a reversing entry, never by editing one.",
        },
        { t: "h2", id: "what-it-does", text: "What the app does" },
        {
          t: "list",
          items: [
            "**Journal**, **Chart of accounts** and **Periods**.",
            "**Receivables**, **Payables** and **Bank**.",
            "**Tax invoices** you issue from the app itself, with **E-invoicing** settings for them.",
            "**Tax reports** and the **VAT return**, at 14% in Egypt and 15% in Saudi Arabia.",
            "**Hand-off**: what has reached the books from the till's day closes.",
          ],
        },
        {
          t: "p",
          text: "The company's country in its profile decides tax and e-invoicing, not the business type.",
        },
        { t: "h2", id: "sales-to-the-books", text: "How till sales reach the books" },
        {
          t: "callout",
          tone: "note",
          text: "The hand-off from Moving POS to Accounting is set up for your account by the Moving team. Until then no sales reach the books, even if both apps are running. If your days don't show under **What the books received**, message us.",
        },
        {
          t: "p",
          text: "Once it is set up, each business day a branch closes is posted: sales and VAT, cost of sales, and cash over/short, in one balanced entry per source per day per branch, never one per order. Revenue is taken from the payments, so it lands on the day the money arrived. A late hand-off never holds up the day close.",
        },
        {
          t: "steps",
          items: [
            {
              title: "In the Accounting app, open **Hand-off**.",
              body: "The **Day-close hand-off** page shows **Ledger readiness** (**Ready** or **Not ready**), **The accounts a day close needs** and the **Fiscal period**.",
            },
            {
              title: "Check **What the books received**.",
              body: "Each day and branch shows **Posted** or **No entry**.",
            },
            {
              title: "Send a missing day again from the back office.",
              body: "On **Today › Dashboard**, the **Days and transfers that never reached the books** card shows for anyone with the **Read & replay the accounting hand-off** permission. Fix the cause, then click **Send again**.",
            },
          ],
        },
        {
          t: "callout",
          tone: "tip",
          text: "The two usual reasons a day is refused: the chart of accounts has no account `2040` (Gift card liability), or no open fiscal period covers that day. Add the account or open the period, then send the day again.",
        },
        { t: "h2", id: "free-trial", text: "Try Accounting free for 14 days" },
        {
          t: "steps",
          items: [
            {
              title: "Open the [free trial page](/accounting-trial) and fill in the form.",
              body: "Enter **Your name**, **Company name**, **Work email** and **Mobile number**, and under **Where is the business?** choose **Egypt** or **Saudi Arabia**. No card is needed.",
            },
            {
              title: "Click **Start my free trial**.",
              body: "**Your link** and the **Setup token** appear. Save the token before you leave the page: it isn't shown again or sent by email.",
            },
            {
              title: "Click **Open the setup wizard** and enter the token.",
              body: "Then go through the steps: **Language**, **Company**, **Chart of accounts**, **First period**, **Administrator**, **Opening balances** (optional) and **Review**.",
            },
          ],
        },
        {
          t: "p",
          text: "You get a system of your own, not a shared demo. The trial is free with no card, nothing is charged when it ends, and each email can have one running trial. After it ends, the trial's books are deleted after a short grace period, so export what you want to keep before then. The trial covers Accounting only; your Moving POS account is created by the Moving team.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Does every till invoice reach the books?",
              a: "No. Each branch's day close arrives as grouped entries, once the Moving team has set up the hand-off for your account.",
            },
            {
              q: "The trial page shows **Sign-ups are paused for the moment**. What do I do?",
              a: "Message us on WhatsApp and we will set up your trial by hand. If **We are setting up more trial systems** shows instead, we have your details and will contact you within one business day.",
            },
            {
              q: "Do I sign in to Accounting with my till account?",
              a: "No. The Accounting app has its own sign-in and users.",
            },
          ],
        },
      ],
      related: ["branches/business-days", "reports/back-office-dashboard", "integrations/zatca-e-invoicing"],
    },
  ];
