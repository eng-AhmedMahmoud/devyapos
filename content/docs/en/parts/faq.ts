import type { DocArticle } from "../../types";

export const articles: DocArticle[] = [
    {
      slug: "pos-faq",
      title: "Moving POS: common questions",
      summary:
        "Short, straight answers about the internet, devices, printing, languages, staff, the menu, online ordering, loyalty and reports, including what it can't do yet.",
      keywords: [
        "FAQ",
        "common questions",
        "Moving POS",
        "موفينج POS",
        "point of sale",
        "الكاشير",
        "limits",
        "أسئلة شائعة",
        "help",
      ],
      reviewed: "2026-10-27",
      before: [],
      body: [
        {
          t: "p",
          text: "Short answers to what restaurant and café owners ask most, including what Moving POS doesn't support yet. Where an answer runs longer, a link takes you to the full guide.",
        },
        { t: "h2", id: "internet-and-reliability", text: "Internet and reliability" },
        {
          t: "qa",
          items: [
            {
              q: "Does the POS work without internet?",
              a: "No. Every sale is a live call to the server, so if the branch loses its connection the till can't take orders until it comes back. What protects you: the till retries a sale automatically for about 4 seconds, confirming again within 15 minutes never creates a duplicate order, even after a reload, the cart stays on the device for 12 hours, and held orders are kept on the server. See [when the internet drops](/docs/selling/when-the-internet-drops).",
            },
            {
              q: "Is anything recorded offline?",
              a: "Only receiving inventory transfers, where they are switched on for your account: marking a delivery arrived, counting it and commenting are kept on the device and sent when the connection returns. Sales, payments, shifts and clock-ins all need a connection.",
            },
            {
              q: "What does the kitchen display show if the connection drops?",
              a: "It shows the connection state at the top. When the connection returns it reloads every active order, so no order is lost, only delayed. See [the kitchen display](/docs/selling/kitchen-display).",
            },
          ],
        },
        { t: "h2", id: "hardware-and-printing", text: "Hardware and printing" },
        {
          t: "qa",
          items: [
            {
              q: "Do I need special hardware?",
              a: "Not to sell: the till, the back office and the kitchen display run in a current browser. Printing receipts and kitchen tickets directly needs the POS app on an iPad (iOS 17 or later), iPhone or Android device; in a plain browser, the system print dialog opens instead. The desktop app for Windows and Mac isn't ready for real use yet. See [devices and apps](/docs/getting-started/devices-and-apps).",
            },
            {
              q: "Which receipt printers work?",
              a: "A network thermal printer that speaks Epson ePOS or ESC/POS on port `9100`, used from the POS app. The layout is for `80 mm` paper; there is no layout for `58 mm` paper. See [receipt printers](/docs/setup/receipt-printers).",
            },
            {
              q: "Can I have a separate kitchen printer?",
              a: "No. Each branch has one printer address, **Receipt printer IP**, and kitchen tickets print there too. One kitchen display device per branch can print online orders' tickets automatically.",
            },
            {
              q: "My receipts stopped printing after a power cut. Why?",
              a: "Most likely the router gave the printer a new address. Reserve its address in the router's settings (DHCP Reservation), and check that the branch in the back office holds the same address. Details in [receipt printers](/docs/setup/receipt-printers).",
            },
            {
              q: "Does the card machine connect to the POS?",
              a: "No. **Card** on the Pay screen records a payment taken on the branch's own card terminal, and the cashier can type its reference. Instapay works the same way.",
            },
          ],
        },
        { t: "h2", id: "languages-and-regions", text: "Languages and regions" },
        {
          t: "qa",
          items: [
            {
              q: "Which languages are available?",
              a: "Arabic and English in every app, laid out right to left in Arabic, and the choice is remembered on the device. The till and the ordering site open in Arabic; the back office opens in English until you change it. Some server messages and the device settings sheet in the iPad and iPhone app are in English only.",
            },
            {
              q: "Which countries and currencies are supported?",
              a: "Egypt in pounds (`EGP`) or Saudi Arabia in riyals (`SAR`). The Moving team sets your account's country and currency at setup; there is no setting for them in the app.",
            },
            {
              q: "How is VAT handled?",
              a: "Prices include VAT, at one rate for the whole business in **VAT rate (%)** in Settings: 0 to 30, with 14 by default in Egypt and 15 on Saudi accounts. There are no per-item rates and no exempt items. See [business settings and tax](/docs/setup/business-settings-and-tax).",
            },
            {
              q: "Does it send e-invoices to the Egyptian Tax Authority?",
              a: "No. Moving POS works out and shows VAT and exports sales records, but it sends nothing to the Egyptian e-invoicing system.",
            },
            {
              q: "Does it support Saudi e-invoicing (ZATCA)?",
              a: "Yes, for Saudi accounts: Phase 2 (Fatoora) with simplified invoices carrying a QR code, switched on for your account by the Moving team. See [ZATCA e-invoicing](/docs/integrations/zatca-e-invoicing).",
            },
          ],
        },
        { t: "h2", id: "accounts-and-staff", text: "Accounts and staff" },
        {
          t: "qa",
          items: [
            {
              q: "How do I get an account? Is there a free trial?",
              a: "There is no self-signup and no self-serve POS trial. The Moving team sets up your account and loads your menu from your data, then hands over your staff's sign-in details. See [get started with Moving POS](/docs/getting-started/get-started-with-pos).",
            },
            {
              q: "Can staff sign in with a PIN?",
              a: "No. The till and the back office use e-mail and password. A PIN exists only on the clock-in and clock-out screen, where attendance is switched on for your account.",
            },
            {
              q: "I forgot my password. What now?",
              a: "There is no link to reset a password yourself. Ask your account's admin to reset it in the back office. After 10 sign-in attempts in one minute, signing in is blocked; wait a minute, then try again.",
            },
            {
              q: "Which roles are there?",
              a: "**Super Admin** and **Admin** for every branch, **Branch manager** for their branch in the back office and the till, **Cashier** for the till, **Barista** for the till, opening on the kitchen display, and **Warehouse keeper** for inventory in the back office. Each role has its permissions, and each person's can be adjusted individually. See [staff and permissions](/docs/setup/staff-and-permissions).",
            },
            {
              q: "Who can give a discount?",
              a: "Anyone with the **Apply order discounts** permission: they apply a coupon or spend loyalty points. Automatic promotions apply themselves where they are switched on for your account. There is no discount amount typed by hand, and a coupon never combines with a promotion. See [discounts and coupons](/docs/selling/discounts-and-coupons).",
            },
          ],
        },
        { t: "h2", id: "menu-and-selling", text: "Menu and selling" },
        {
          t: "qa",
          items: [
            {
              q: "Can guests or cashiers choose add-ons, such as an extra shot, a sauce or less sugar?",
              a: "Not yet. You can prepare option groups in **Menu › Modifiers & Sizes › Option Groups**, but neither the till nor the ordering site lets anyone pick them. Sizes work. See [sizes and option groups](/docs/setup/sizes-and-option-groups).",
            },
            {
              q: "Can prices differ between branches?",
              a: "Yes, through **Branch Prices** on a product's size. A delivery app's price comes before the branch price, and the branch price before the base price. See [branch prices and availability](/docs/branches/branch-prices-and-availability).",
            },
            {
              q: "Can I mark an item sold out at one branch only?",
              a: "No. Hiding an item turns it off at every branch and on the ordering site too.",
            },
            {
              q: "How are orders numbered?",
              a: "By default `#1`, `#2` and so on, starting again with every shift. An admin changes this in **Order numbering** in Settings: restart every shift, every day or never, a template for the number, and how many digits it has. See [order numbering](/docs/branches/order-numbering).",
            },
            {
              q: "Can I split a bill or refund part of it?",
              a: "At the till, a payment can be split between cash and one other method. There are no partial refunds: the whole order is cancelled while it still can be, which takes it out of sales and puts its stock back, or a return is recorded, which moves no money and restores no stock. See [orders, cancellations and returns](/docs/selling/orders-cancellations-and-returns).",
            },
            {
              q: "Does the kitchen display beep? Can I recall a ticket?",
              a: "A chime plays on every new order, switched per device with **Sound on** and **Muted**. Tap the screen once after opening it so the browser allows sound. Timers turn amber at 5 minutes and red at 10. There is no ticket recall, no filter by order type and no kitchen stations.",
            },
          ],
        },
        { t: "h2", id: "online-ordering", text: "Online ordering" },
        {
          t: "qa",
          items: [
            {
              q: "Do online orders go straight to the kitchen?",
              a: "They reach the kitchen display at once, with a chime, but staff must accept each one and pick a prep time: 10, 15, 20 or 30 minutes. There is no auto-accept, and a card order appears only once the payment is confirmed. See [online orders at the till](/docs/online-ordering/online-orders-at-the-till).",
            },
            {
              q: "Can guests order for later, or only during opening hours?",
              a: "There is no ordering for a later time. And the ordering site doesn't check opening hours, so it accepts orders at any time.",
            },
            {
              q: "Is there a minimum order for delivery?",
              a: "No. A delivery zone is a name and a fee only, though a coupon can carry its own minimum. See [delivery zones](/docs/branches/delivery-zones).",
            },
            {
              q: "How does the guest follow their order?",
              a: "On their order page, which refreshes every 5 seconds. No SMS, WhatsApp or e-mail is sent about the order's status. See [your ordering site](/docs/online-ordering/your-ordering-site).",
            },
            {
              q: "Can guests order from the table by scanning a QR code?",
              a: "No. The table QR code, where it is switched on for your account, lets seated guests see and pay their open check, or one guest's share; ordering stays with the waiter or cashier. See [pay at the table](/docs/online-ordering/pay-at-the-table).",
            },
            {
              q: "Which online payment methods are there?",
              a: "Cash on pickup or delivery, always, and card through Paymob in Egypt or Moyasar in Saudi Arabia once the Moving team has set it up. There are no other payment gateways. See [online payments](/docs/payments/online-payments).",
            },
            {
              q: "Does it integrate with Talabat, Elmenus and other delivery apps?",
              a: "Not through a technical link. Each delivery app is added as a channel with its own prices, excluded items and commission, and its orders are entered at the till. See [delivery apps](/docs/integrations/delivery-apps).",
            },
          ],
        },
        { t: "h2", id: "loyalty", text: "Loyalty" },
        {
          t: "qa",
          items: [
            {
              q: "How does the loyalty programme work?",
              a: "Guests are identified by mobile number at the till, or automatically when they order online. They earn points on every order and spend them as a discount at the till only. By default: one point per `1` EGP, delivery fee excluded, a point is worth `0.01` EGP, the smallest redemption is `100` points, and points never expire. The Moving team switches it on and sets its values for your account. See [how loyalty points work](/docs/loyalty/how-points-work).",
            },
            {
              q: "Do guests get messages about their points?",
              a: "No. No SMS, WhatsApp or e-mail is sent about points, and they aren't printed on the receipt. Guests see their balance on their order-tracking page on your ordering site, and the till shows it when staff look up their number.",
            },
          ],
        },
        { t: "h2", id: "data-and-reports", text: "Data and reports" },
        {
          t: "qa",
          items: [
            {
              q: "Can I export my data?",
              a: "Every report has **Download CSV**, with English column names and amounts in piastres. Lists such as orders, products, staff and coupons export the rows shown as CSV. There is no PDF export or printing from the back office, and no customers page or customer export. A full export is requested in writing from the Moving team. See [sales reports](/docs/reports/sales-reports).",
            },
            {
              q: "Where do I print the shift report?",
              a: "From the till: the shift (Z) report and the day report print there, not from the back office. Neither carries a VAT line. See [shifts and Z reports](/docs/reports/shifts-and-z-reports).",
            },
            {
              q: "Which day does a sale after midnight count on?",
              a: "On the business day of the shift it was rung up in, so a day that runs past midnight stays whole. Online orders count on their calendar day. See [business days](/docs/branches/business-days).",
            },
            {
              q: "Is there a peak-hours report?",
              a: "No, there is no peak-hours report today.",
            },
            {
              q: "Can I ask about my figures in plain words?",
              a: "Yes, if the AI assistant is switched on for your account; it is an add-on switched on for each restaurant. You ask it in the back office, typing or by voice note, and it answers from your system's figures. See [ask the AI assistant about your figures](/docs/assistant/ask-the-assistant).",
            },
          ],
        },
      ],
      related: [
        "getting-started/get-started-with-pos",
        "selling/when-the-internet-drops",
        "loyalty/how-points-work",
        "assistant/ask-the-assistant",
      ],
    },
  ];
