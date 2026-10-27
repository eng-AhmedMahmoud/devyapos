import type { DocArticle } from "../../types";

/* Follows content/docs/ar/parts/getting-started.ts block for block; the sources are listed there. */
export const articles: DocArticle[] = [
    {
      slug: "get-started-with-pos",
      title: "Get started with Moving POS",
      summary:
        "The Moving team creates your Moving POS account and hands over the sign-in details. Learn its four apps, where each runs, how to sign in, and its languages.",
      keywords: ["Moving POS", "موفينج POS", "POS account", "sign in", "login", "access details", "point of sale", "language", "تسجيل الدخول", "الكاشير"],
      reviewed: "2026-10-27",
      before: [],
      body: [
        {
          t: "p",
          text: "Moving POS runs your restaurant from one account: the POS your team sells from, the back office where you manage the menu, branches and staff, the kitchen display, and the ordering site your customers order from. They all share the same data, so what you change in the back office reaches the POS and the ordering site.",
        },
        { t: "h2", id: "get-an-account", text: "How to get an account" },
        {
          t: "p",
          text: "There is no self-signup for Moving POS. The Moving team creates your account and loads it with your menu, branches and staff, then hands you an access sheet in Arabic listing your app addresses and one line per staff member with their email, password, role and branch.",
        },
        {
          t: "steps",
          items: [
            {
              title: "Contact us",
              body: "Fill in the form on the [contact page](/contact), giving your number of branches, then press **Send my details**, or send your details on WhatsApp.",
            },
            {
              title: "Send your restaurant's details",
              body: "Send your menu with its items, sizes and prices, your branches, and your staff with their roles. The team loads them into your account before handover.",
            },
            {
              title: "Receive the access sheet",
              body: "It lists the address of each app and every staff member's sign-in details. Keep it somewhere safe.",
            },
            {
              title: "Change the provisional passwords",
              body: "The passwords on the sheet are provisional. Sign in to the back office as an Admin and set a new password for each person under **Staff**, as in [Add staff and set permissions](/docs/setup/staff-and-permissions).",
            },
          ],
        },
        { t: "h2", id: "the-apps", text: "The apps and where each runs" },
        {
          t: "table",
          head: ["App", "Who uses it", "Where it runs"],
          rows: [
            [
              "The POS",
              "Cashiers and branch managers",
              "In a current browser on a tablet, computer or touchscreen, or in the POS app on iPad, iPhone or Android for silent printing.",
            ],
            [
              "The back office",
              "Owners, admins and branch managers",
              "In a browser on a computer or phone, and in the back-office app on iPhone.",
            ],
            [
              "The kitchen display",
              "The kitchen team and baristas",
              "Part of the POS: open it from the **Kitchen** tab on any screen in the kitchen.",
            ],
            [
              "Your ordering site",
              "Your customers",
              "In the customer's phone browser, with nothing to install, for pickup or delivery.",
            ],
          ],
        },
        {
          t: "p",
          text: "Details in [Choose devices and apps](/docs/getting-started/devices-and-apps) and [Your ordering site](/docs/online-ordering/your-ordering-site).",
        },
        { t: "h2", id: "sign-in", text: "Sign in" },
        {
          t: "steps",
          items: [
            {
              title: "Open the app's address",
              body: "Use the address on your access sheet, or open the POS app on your device.",
            },
            {
              title: "Enter your details",
              body: "Type your **Email** and **Password**, then press **Sign in**.",
            },
            {
              title: "Start from your screen",
              body: "The back office opens on the **Dashboard**, or on **Inventory** for a warehouse keeper. The POS opens on the sale screen, or on the **Floor** if table service is switched on for your account, and on the kitchen display for a barista account.",
            },
          ],
        },
        {
          t: "list",
          items: [
            "Cashiers and baristas cannot open the back office, and can open the POS only once a branch is set on their account.",
            "After 10 wrong attempts in a minute you see \"Too many sign-in attempts. Wait a minute, then try again.\"",
            "There is no PIN sign-in and no \"forgot password\" link. An admin sets a new password under **Staff**.",
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "Some sections, such as the **Floor** and **Offers**, are switched on for your account by the Moving team. If you need one and don't see it, message us on WhatsApp from the help button at the bottom of this page.",
        },
        { t: "h2", id: "languages", text: "Languages and currency" },
        {
          t: "p",
          text: "Every app works in Arabic and English, with a right-to-left layout in Arabic. The POS and the ordering site open in Arabic, and the back office opens in English the first time. Switch with the language button: on an English screen it reads **العربية** in the POS and **عربي** in the back office, and each device remembers your choice.",
        },
        {
          t: "p",
          text: "A few texts stay in English, such as the device settings sheet in the iPad and iPhone app and some error messages from the server. The currency is set by the Moving team when your account is created: Egyptian pounds (EGP), or Saudi riyals for Saudi accounts.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Is there a free trial I can sign up for myself?",
              a: "There is no self-signup for Moving POS. Contact us from the [contact page](/contact) and we set the account up for you.",
            },
            {
              q: "I forgot my password. What now?",
              a: "Ask an admin at your restaurant to set a new password for you under **Staff**. There is no email reset.",
            },
            {
              q: "Does the POS work without internet?",
              a: "No. Every sale talks to the server, so if the connection drops, selling stops until it comes back. Details in [When the internet drops](/docs/selling/when-the-internet-drops).",
            },
          ],
        },
      ],
      related: [
        "getting-started/back-office-tour",
        "setup/staff-and-permissions",
        "getting-started/devices-and-apps",
        "selling/sign-in-and-open-a-shift",
      ],
    },
    {
      slug: "back-office-tour",
      title: "Tour the back office",
      summary:
        "The back office is where you run the menu, branches, staff, reports and settings. Learn the sidebar, the dashboard, and what each account sees.",
      keywords: ["back office", "admin", "sidebar", "dashboard", "navigation", "search", "لوحة الإدارة", "لوحة المتابعة", "الشريط الجانبي"],
      reviewed: "2026-10-27",
      before: ["An account that can open the back office: **Super Admin**, **Admin**, **Branch manager** or **Warehouse keeper**."],
      body: [
        {
          t: "p",
          text: "The back office is your office behind the counter: you build the menu there, add branches and staff, follow orders and shifts, and set the rules. After you sign in it opens on the **Dashboard**.",
        },
        { t: "h2", id: "sidebar", text: "The sidebar" },
        {
          t: "p",
          text: "The sidebar groups the sections in four. You only see what your permissions allow, and a group disappears when none of its sections is open to you.",
        },
        {
          t: "table",
          head: ["Group", "Its sections"],
          rows: [
            ["**Today**: What is happening on the floor right now", "**Dashboard**, **Orders**, **Shifts**, **Business days**"],
            ["**Catalogue**: What you sell, and what it costs", "**Menu**, **Inventory**, **Coupons**"],
            ["**Business**: Branches, people and performance", "**Branches**, **Zones**, **Delivery apps**, **Staff**, **Reports**, **Feedback**"],
            ["**System**: Access, devices and configuration", "**Activity**, **Permissions**, **Settings**"],
          ],
        },
        {
          t: "list",
          items: [
            "**Menu**, **Staff**, **Permissions**, **Settings** and **Branches** belong to Admins by default. An Admin can grant them to others from [role permissions](/docs/setup/staff-and-permissions).",
            "A warehouse keeper sees the **Dashboard** and **Inventory**, and lands straight on Inventory.",
            "A section drawn dimmed with a **Not included** badge is part of the platform but not included in your plan; ask us about it.",
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "Some sections are switched on for your account by the Moving team, such as **Offers** and **Integrations**, and **ZATCA e-invoicing** for Saudi accounts. Features are switched on and off on our side, so if you need a section you don't see, message us.",
        },
        { t: "h2", id: "dashboard", text: "The dashboard" },
        {
          t: "p",
          text: "It shows **Revenue today**, **Orders** and **Avg order**, then splits them **By channel** (the POS or online), **By payment method** and **Per branch**, with your **Menu highlights**.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-setup-tour-dashboard",
            alt: "The back-office dashboard: cards for revenue today, orders and average order, then the split by channel, payment method and branch, and the alerts panel.",
            caption: "Alerts gather whatever needs you, across every branch.",
          },
        },
        {
          t: "p",
          text: "The **Alerts** panel flags what needs your attention, such as low-stock items, a business day still open, a large cash variance, or branch printers changed from a till. When nothing is wrong it reads \"No alerts — all clear.\" Details in [The back-office dashboard](/docs/reports/back-office-dashboard).",
        },
        { t: "h2", id: "header", text: "The top bar" },
        {
          t: "list",
          items: [
            "The search box looks through products, orders, staff, branches and coupons.",
            "The language button switches between Arabic and English. The back office opens in English the first time, with the button reading **عربي**; after that the device remembers your choice.",
            "**Switch app** opens your account's other apps that the Moving team has set up.",
            "The bar also holds **Send feedback** and **Log out**.",
          ],
        },
        { t: "h2", id: "on-your-phone", text: "On your phone" },
        {
          t: "p",
          text: "On a phone screen the sidebar gives way to a bottom bar with **Home**, **Orders**, **Inventory**, **Reports** and **More**. The **More** page lists every screen your account can open and a **Language** choice, and the language and log-out controls sit behind the **More** button in the top bar.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-setup-tour-more",
            alt: "The More page on a phone: every back-office screen, grouped as in the sidebar, a language choice, and the bottom bar.",
            caption: "Everything in the sidebar is here on a phone.",
          },
        },
        {
          t: "qa",
          items: [
            {
              q: "Why can't I see Menu or Settings?",
              a: "Your account doesn't hold that permission. Ask an Admin to grant it to your role, or to you alone, from [Staff and permissions](/docs/setup/staff-and-permissions).",
            },
            {
              q: "Can a cashier use the back office?",
              a: "No. Cashiers and baristas work on the POS only.",
            },
            {
              q: "How do I open a section marked Not included?",
              a: "That section isn't included in your plan. Message us and we'll tell you what it takes to switch it on.",
            },
          ],
        },
      ],
      related: ["getting-started/get-started-with-pos", "setup/staff-and-permissions", "reports/back-office-dashboard"],
    },
    {
      slug: "devices-and-apps",
      title: "Choose devices and apps",
      summary:
        "The POS, the kitchen display and the back office run in any current browser. Silent printing to the branch printer needs the POS app on iPad, iPhone or Android.",
      keywords: ["devices", "iPad", "Android", "iPhone", "POS app", "browser", "hardware", "Windows", "tablet", "الأجهزة"],
      reviewed: "2026-10-27",
      before: ["An internet connection at the branch: the POS talks to the server with every sale."],
      body: [
        {
          t: "p",
          text: "You don't need special hardware to sell: the POS, the kitchen display and the back office are web pages that run on a tablet, computer or touchscreen. What decides your choice is printing.",
        },
        { t: "h2", id: "browser", text: "In a browser" },
        {
          t: "list",
          items: [
            "Open the POS in a current browser at the address on your access sheet, and sign in.",
            "The kitchen display runs on any screen in the kitchen, from the POS's **Kitchen** tab.",
            "Your ordering site runs in the customer's phone browser, with nothing to install.",
            "A browser can't reach the branch printer. When you print, the device's print dialog opens and you see \"This device is running in a browser, which cannot reach the branch printer — open the POS app to print receipts.\"",
          ],
        },
        { t: "h2", id: "native-apps", text: "The POS apps" },
        {
          t: "p",
          text: "The apps show the same POS or back office and add access to the branch printer. Because they load their pages from the server, updates reach them on the next load.",
        },
        {
          t: "table",
          head: ["App", "Device", "What it adds"],
          rows: [
            ["The POS on iPad", "An iPad on iOS 17 or later at the counter", "Silent printing to the branch printer, a screen that never sleeps, and a session that survives restarts."],
            ["The POS on iPhone", "A waiter's phone for taking orders", "The same POS with the same printing."],
            ["The POS on Android", "An Android tablet, Android POS terminal or phone", "Silent printing, kiosk mode with screen pinning, and reopening by itself after the device restarts."],
            ["The back office on iPhone", "The owner's or manager's phone", "The back office in its phone layout."],
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "The Moving team prepares the apps for your account and guides you through installing them on your devices. Message us before you buy a device so we can check with you that it suits.",
        },
        { t: "h2", id: "computers", text: "Computers" },
        {
          t: "p",
          text: "There is no POS app for Windows or Mac available yet. On a computer, use the POS in a browser; receipts print through the system's print dialog.",
        },
        { t: "h2", id: "terminal-settings", text: "Device settings in the app" },
        {
          t: "p",
          text: "In the iPad or iPhone app, press and hold the bottom-right corner of the screen for about a second and a half to open **Terminal settings**. This sheet is in English only, and holds:",
        },
        {
          t: "list",
          items: [
            "**Reload** to reload the POS.",
            "**Printer diagnostics** to test whether the branch printer can be reached, as in [Connect a receipt printer](/docs/setup/receipt-printers).",
            "**Sign out & clear website data** to hand the device to another branch or cashier.",
            "The Android app has a similar sheet in the device's language, which also covers screen orientation, keeping the screen on, and kiosk mode.",
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Do I need to buy new hardware?",
              a: "Not to sell: a tablet or computer with a current browser is enough. For silent printing you need an iPad, iPhone or Android device with the app, and a network printer.",
            },
            {
              q: "Does the POS work without internet?",
              a: "No. Details in [When the internet drops](/docs/selling/when-the-internet-drops).",
            },
            {
              q: "The iPad app says Can't reach the POS app. What now?",
              a: "The device can't reach the server. Check its internet connection and press **Retry**; the app also reloads by itself when the network comes back.",
            },
          ],
        },
      ],
      related: ["setup/receipt-printers", "selling/when-the-internet-drops", "selling/kitchen-display"],
    },
  ];
