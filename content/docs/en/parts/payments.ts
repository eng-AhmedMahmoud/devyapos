import type { DocArticle } from "../../types";

/* Follows content/docs/ar/parts/payments.ts article for article, block for block; the sources are listed there. */
export const articles: DocArticle[] = [
    {
      slug: "payment-methods",
      title: "Payment methods: what the till accepts",
      summary:
        "The Moving POS till takes cash, card, Instapay, split payments and gift cards. What each one does, and where it shows on receipts, the shift close and reports.",
      keywords: [
        "payment methods",
        "tenders",
        "cash",
        "card",
        "Instapay",
        "split payment",
        "gift card",
        "طرق الدفع",
        "وسائل الدفع",
        "إنستاباي",
        "دفع مُقسَّم",
        "بطاقة هدايا",
      ],
      reviewed: "2026-10-27",
      before: [
        "A shift open at the till to take payment for any order — [Sign in and open a shift](/docs/selling/sign-in-and-open-a-shift).",
      ],
      body: [
        {
          t: "p",
          text: "Every order at the till is paid in the **Payment** dialog. It holds four fixed buttons — **Cash**, **Card**, **Instapay** and **Split** — and a fifth, **Gift card**, when gift cards are on for your account. Card payment on the ordering site is a different thing that goes through a payment gateway, explained in [Accept online card payments](/docs/payments/online-payments).",
        },
        { t: "h2", id: "methods", text: "What the till accepts" },
        {
          t: "table",
          head: ["Method", "What it is", "At shift close"],
          rows: [
            [
              "**Cash**",
              "The cashier enters the **Tendered** amount and sees the **Change due**.",
              "Goes into the drawer, and is counted under **Counted cash (EGP)**.",
            ],
            [
              "**Card**",
              "The card terminal at your branch; the till does not connect to it. The **Card terminal reference (optional)** can be typed in.",
              "Never in the drawer. The terminal's total goes under **Counted card terminal (EGP)**.",
            ],
            [
              "**Instapay**",
              "A transfer the guest sends by Instapay; the till records it and does not connect to Instapay. The **Instapay transfer reference (optional)** can be typed in.",
              "Never in the drawer. The transfers received go under **Counted Instapay (EGP)**.",
            ],
            [
              "**Split**",
              "A cash part, with the rest on **Card** or **Instapay**.",
              "Each part counts with its own method: the cash in the drawer, the rest with card or Instapay.",
            ],
            [
              "**Gift card**",
              "A prepaid card your restaurant sold, covering the whole bill. It shows when gift cards are on for your account.",
              "Never in the drawer, and not counted at close.",
            ],
          ],
        },
        { t: "h2", id: "switching", text: "Switching methods on and off" },
        {
          t: "p",
          text: "**Cash**, **Card**, **Instapay** and **Split** need no switching on: they show on every till at every branch, and there is no setting in the back office that hides one. If you don't use one, your team simply doesn't pick it.",
        },
        {
          t: "list",
          items: [
            "**Gift card** is a module the Moving team switches on for your account; until then its button is not in the Payment dialog. Selling and taking them is in [Sell and accept gift cards](/docs/selling/gift-cards).",
            "Card payment on the ordering site is set up by the Moving team: Paymob on Egyptian-pound accounts and Moyasar on Saudi-riyal accounts.",
            "What you set is the **Large variance — amount (EGP)** and **Large variance — share of expected (%)** limits in **Settings**: a cash, card or Instapay variance above them makes the cashier write a reason at close. The walkthrough is [Set business settings and VAT](/docs/setup/business-settings-and-tax).",
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "Want gift cards, or online payment on the ordering site? [Message us](/contact) and the Moving team will switch them on for your account.",
        },
        { t: "h2", id: "at-the-till", text: "How the cashier picks a method" },
        {
          t: "steps",
          items: [
            {
              title: "Tap **Pay**",
              body: "With the items in the order, tap **Pay**; the **Payment** dialog opens showing the **Amount due**.",
            },
            {
              title: "Pick the method",
              body: "Tap **Cash**, **Card**, **Instapay**, **Split** or **Gift card**. The chosen button lights up.",
              shot: {
                id: "pos-register-pay",
                alt: "The Payment dialog at the till: the amount due, the Cash, Card, Instapay, Split and Gift card buttons, the number pad and the Confirm payment button.",
                caption: "The method buttons are the same on every till; Gift card shows once it is on for your account.",
              },
            },
            {
              title: "Finish for that method",
              body: "**Cash**: key in the **Tendered** amount or tap **Exact amount**; less than the amount due is not accepted. **Card** or **Instapay**: complete the payment on the terminal or check the transfer arrived, and type the reference if you like. **Split**: key in the **Cash part** on the pad and pick **Card** or **Instapay** for the **Rest on the other method**; the cash part must be above zero and below the total. **Gift card**: type the code and tap **Check**; if its balance does not cover the whole bill, the shortfall shows, so take the payment another way.",
            },
            {
              title: "Tap **Confirm payment**",
              body: "The order is recorded with its method, and you print its receipt with **Print receipt**. The full steps, with discounts, are in [Take payment for an order](/docs/selling/take-payment).",
            },
          ],
        },
        { t: "h2", id: "where-it-shows", text: "Where each method shows" },
        {
          t: "table",
          head: ["Where", "What you see"],
          rows: [
            [
              "The receipt",
              "A **Payment** line naming the method. A split prints each part on its own line with its amount, and cash prints **Tendered** and **Change**.",
            ],
            [
              "Closing the shift at the till",
              "**Counted cash (EGP)** is required; **Counted card terminal (EGP)** and **Counted Instapay (EGP)** are **optional**. Online payments are not counted here, since they are collected online.",
            ],
            [
              "The Z-report",
              "The **Payments** section: **Cash sales**, **Card sales**, **Instapay sales** and **Online sales**, and, with what you counted, **Card variance** and **Instapay variance**.",
            ],
            [
              "The back office",
              "**By payment method** on the **Dashboard** and on the **Daily** and **Monthly** tabs of **Reports**, each part of a split counted with its own method. **Orders** shows each order's method and a split's parts with their amounts, and **Shifts** shows **Card ±**, **Instapay ±** and the method that crossed the large-variance limit.",
            ],
          ],
        },
        {
          t: "shot",
          shot: {
            id: "pos-register-close-shift",
            alt: "The close form at the till: counted cash, the optional card-terminal and Instapay totals, and the online sales that are not counted here.",
            caption: "A box you leave empty means you did not reconcile that method, not that its total was zero.",
          },
        },
        {
          t: "shot",
          shot: {
            id: "pos-payments-by-method",
            alt: "The Daily tab of Reports: the By payment method table with the cash, card, Instapay and online payment totals.",
            caption: "A split has no line of its own here: each part sits on its method's line.",
          },
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I hide Instapay, or any method we don't use?",
              a: "No. The four methods are fixed on every till and no setting hides them; agree with your team on what you accept.",
            },
            {
              q: "Why don't card sales count toward expected cash?",
              a: "Because they never went into the drawer. Expected cash is the opening float plus cash sales and pay-ins, minus pay-outs; card and Instapay are each checked against their own total. The walkthrough is [Close the shift and print the Z-report](/docs/selling/close-the-shift).",
            },
            {
              q: "Can a guest pay at the end of the meal?",
              a: "Yes, if table service is on for your account: a **Dine-in** order at a table is rung up with **Open check (pay later)** and paid at the end of the meal by cash, card or Instapay.",
            },
          ],
        },
      ],
      related: [
        "selling/take-payment",
        "payments/online-payments",
        "selling/close-the-shift",
        "selling/gift-cards",
      ],
    },
    {
      slug: "online-payments",
      title: "Accept online card payments",
      summary:
        "Your ordering site takes cards through Paymob (Egyptian pounds) or Moyasar (Saudi riyals), set up by the Moving team. At the till, Card is your own machine.",
      keywords: [
        "online payment",
        "payment gateway",
        "Paymob",
        "باي موب",
        "Moyasar",
        "ميسر",
        "mada",
        "Apple Pay",
        "الدفع الإلكتروني",
        "card payment",
      ],
      reviewed: "2026-10-27",
      before: [
        "A merchant account with Paymob if your Moving POS account is in Egyptian pounds, or with Moyasar if it is in Saudi riyals.",
        "Your ordering site is running. See [Take orders on your ordering site](/docs/online-ordering/your-ordering-site).",
      ],
      body: [
        {
          t: "p",
          text: "Online payment in Moving POS is for orders on your ordering site and for paying at the table. The guest pays on a secure payment page at the provider itself, then returns to their order page, and the order reaches the branch once the payment is confirmed.",
        },
        { t: "h2", id: "providers", text: "The two providers" },
        {
          t: "table",
          head: ["Provider", "Accounts", "What the guest pays with"],
          rows: [
            [
              "Paymob",
              "In Egyptian pounds (Egypt)",
              "A card on Paymob's secure page, plus other Paymob methods such as mobile wallets if the Moving team adds them from your Paymob account.",
            ],
            [
              "Moyasar",
              "In Saudi riyals (Saudi Arabia)",
              "mada, Visa, Mastercard and Apple Pay on Moyasar's secure page. The smallest amount paid online is `1.00` riyal; anything less is paid at the branch.",
            ],
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "The Moving team sets up the payment gateway for your account with your provider account's details; there is no setting for it in the back office. Each account has one gateway, matching its currency. If card payment doesn't show on your ordering site, message us.",
        },
        { t: "h2", id: "how-guests-pay", text: "How the guest pays" },
        {
          t: "steps",
          items: [
            {
              title: "The guest picks **Card (pay now)** under **Payment** at checkout.",
              body: "This option shows only when the gateway is set up for your account; otherwise **Cash on pickup/delivery** is the only one.",
            },
            {
              title: "They go to the secure payment page.",
              body: "**Taking you to the secure payment page…** appears, then they enter their card details on Paymob's or Moyasar's page, not on your site.",
            },
            {
              title: "They return to their order page.",
              body: "Until the provider confirms the payment, the page shows **Waiting for payment** and a **Retry payment** button. The order doesn't reach the kitchen before confirmation.",
            },
            {
              title: "The payment is confirmed and the order reaches the branch.",
              body: "The order is marked paid and shows at the till and in the back office with the payment method **Online payment**. If the payment is declined nothing changes, and the guest can try again.",
            },
          ],
        },
        { t: "h2", id: "refunds", text: "Refunds" },
        {
          t: "p",
          text: "Refunds are made by hand in the provider's dashboard. When an order paid online is cancelled, its payment status shows **Refund due**; refund the guest from your Paymob or Moyasar dashboard. Word of the refund doesn't come back from the provider to Moving POS by itself.",
        },
        { t: "h2", id: "card-at-the-till", text: "Card at the till" },
        {
          t: "p",
          text: "**Card** in the till's **Payment** dialog means your branch's card machine, and the till doesn't connect to it. Staff run the card on the machine, then record the sale and, if they like, type the **Card terminal reference (optional)**. The machine's totals are checked at shift close under **Counted card terminal (EGP)**. Details in [Take payment for an order](/docs/selling/take-payment), and every method the till takes in [Payment methods: what the till accepts](/docs/payments/payment-methods).",
        },
        {
          t: "callout",
          tone: "tip",
          text: "If your online orders come from a Moving Stores store linked to the till, online payment is set up in [Moving Stores]({stores}), not here. Its paid orders reach the till with the payment method **Paid online — web store**.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I use Fawry, Kashier, Geidea or PayTabs?",
              a: "No. The two gateways are Paymob for accounts in Egyptian pounds and Moyasar for accounts in Saudi riyals; there is no link with other gateways.",
            },
            {
              q: "Can a guest pay by card from the table?",
              a: "Yes, if the Moving team has turned on paying at the table for your account: the guest scans the table's code and pays the whole check or their share through the same gateway. Details in [Let guests pay at the table](/docs/online-ordering/pay-at-the-table).",
            },
            {
              q: "Why is the order still **Waiting for payment**?",
              a: "Because the provider hasn't confirmed the payment yet. The page updates within moments of paying, and the guest can press **Retry payment**.",
            },
          ],
        },
      ],
      related: [
        "online-ordering/your-ordering-site",
        "online-ordering/pay-at-the-table",
        "selling/take-payment",
        "payments/payment-methods",
      ],
    },
  ];
