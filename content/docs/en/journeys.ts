import type { DocCategory } from "../types";

/* Follows content/docs/ar/journeys.ts article for article, block for block; the sources are listed there. */
export const posJourneys: DocCategory = {
  id: "journeys",
  group: "setup",
  icon: "route",
  title: "Role journeys",
  description:
    "Each role's path from start to finish — the restaurant owner, the cashier, the kitchen, the branch manager, the customer and the accountant — step by step, with screenshots.",
  articles: [
    {
      slug: "owner-setup",
      title: "The restaurant owner: set your account up from scratch",
      summary:
        "From handover to the first shift: settings and VAT, branches, menu categories and products, staff and roles, payment methods and the receipt printer.",
      keywords: [
        "restaurant owner",
        "account setup",
        "onboarding",
        "build the menu",
        "branches",
        "staff",
        "payment methods",
        "printer",
        "first shift",
        "صاحب المطعم",
        "إعداد الحساب",
        "بناء القائمة",
      ],
      reviewed: "2026-10-27",
      before: [
        "Your restaurant's name, its branches and your menu with prices, even on paper: you will enter them in the steps that follow.",
        "Once the account is handed over: signing in as **Admin**, the role that holds **Manage settings**, **Manage branches**, **Manage menu & catalog** and **Manage staff & permissions** by default.",
      ],
      body: [
        {
          t: "p",
          text: "The Moving team sets your Moving POS account up in your restaurant's name and hands you the sign-in details; after that the whole setup is yours, from the back office. This journey walks it in the order each step needs the one before: settings, then branches, then the menu, then the team, then payment and printing, then the first shift.",
        },
        { t: "h2", id: "account", text: "Get your account and sign in" },
        {
          t: "steps",
          items: [
            {
              title: "Contact the team",
              body: "Fill in the form on the [contact page](/contact) and press **Send my details**, or message us on WhatsApp. There is no self-signup: the team creates the account and hands you an access sheet with your app addresses and your first accounts. The details are in [Get started with Moving POS](/docs/getting-started/get-started-with-pos).",
            },
            {
              title: "Sign in to the back office and change the passwords",
              body: "Sign in with the **Admin** account: **Email** and **Password**, then **Sign in**. The passwords on the sheet are provisional, so set a new one for each account under **Staff**. The back office opens on the **Dashboard**, and the sidebar has four groups: **Today**, **Catalogue**, **Business** and **System**. The full tour is [Tour the back office](/docs/getting-started/back-office-tour).",
              shot: {
                id: "pos-setup-tour-dashboard",
                alt: "The dashboard in the back office: the sidebar with its groups and the revenue-today, orders and alerts cards.",
                caption: "What you see in the sidebar follows your permissions; an item marked **Not included** is a feature the Moving team has not switched on for your account.",
              },
            },
            {
              title: "Choose your devices",
              body: "The POS, the kitchen display and the back office run in a current browser on any tablet or computer. Silent printing to an 80 mm thermal printer on the branch network needs the POS app on iPad, iPhone or Android. The details are in [Choose devices and apps](/docs/getting-started/devices-and-apps) and on our [hardware page](/hardware).",
            },
          ],
        },
        { t: "h2", id: "settings", text: "Set the settings and VAT" },
        {
          t: "steps",
          items: [
            {
              title: "Enter the VAT rate and the receipt footer",
              body: "Under **System › Settings** enter the **VAT rate (%)** — every price is **VAT included** — and the **Receipt footer (AR)** and **Receipt footer (EN)**, then **Save**. The same page holds **Order numbering** and the two large-variance limits a shift's count is checked against at close. The currency, language and country are set by the Moving team when the account is created. The walkthrough is [Set business settings and VAT](/docs/setup/business-settings-and-tax).",
              shot: {
                id: "pos-setup-settings",
                alt: "The Settings page in the back office: the VAT rate, the receipt footer and order numbering.",
                caption: "The rate you enter here is printed on every receipt and enters every report.",
              },
            },
          ],
        },
        { t: "h2", id: "branches", text: "Add your branches" },
        {
          t: "steps",
          items: [
            {
              title: "Add each branch",
              body: "From **Business › Branches** click **New branch**: **Name (EN)**, **Name (AR)**, **Address** and **Phone**, and the **Kind of site**: **Branch — sells** or **Warehouse — holds stock, never sells**, and leave **Active** on. The walkthrough is [Add and edit a branch](/docs/branches/add-a-branch).",
              shot: {
                id: "pos-setup-branches",
                alt: "The Branches page in the back office: the demo restaurant's branches with their addresses, status and each one's printer address.",
                caption: "Each branch has its own business day, stock and printer.",
              },
            },
            {
              title: "Add delivery zones if you deliver",
              body: "From **Business › Zones** add, for each branch, the areas it delivers to and each area's fee. The walkthrough is [Add delivery zones](/docs/branches/delivery-zones).",
            },
          ],
        },
        { t: "h2", id: "menu", text: "Build the menu: categories and products" },
        {
          t: "steps",
          items: [
            {
              title: "Add the categories",
              body: "From **Catalogue › Menu** open the **Categories** tab and click **New category**: **Name (AR)**, **Name (EN)**, **Sort** and **Photo**. Categories are the section buttons the cashier taps.",
              shot: {
                id: "pos-setup-menu-categories",
                alt: "The Categories tab of the menu: the demo restaurant's categories with their order and photos and the New category button.",
                caption: "The order here is the order of the buttons on the POS screen.",
              },
            },
            {
              title: "Add the products with their sizes",
              body: "On the **Products** tab click **New product**: the name in Arabic and English, the **Category**, the photo, then under **Variants** enter each size's **Label** and **Price (EGP)** and click **Add variant** for the next. A single-size product has one variant. The walkthrough is [Build your menu](/docs/setup/build-your-menu), and per-branch prices are in [Set branch prices and availability](/docs/branches/branch-prices-and-availability).",
              shot: {
                id: "pos-setup-menu-products",
                alt: "The Products tab of the menu: the demo restaurant's products with their categories, sizes and prices.",
                caption: "Each size line is what the cashier picks after tapping the product.",
              },
            },
          ],
        },
        { t: "h2", id: "staff", text: "Add the staff and their roles" },
        {
          t: "steps",
          items: [
            {
              title: "Add the staff",
              body: "From **Staff** click **New user**: **Name**, **Email**, the **Role** — **Branch manager**, **Cashier**, **Barista** or **Warehouse keeper** — the **Branch** and a **Password**, save and hand over their details. The walkthrough is [Add staff and set permissions](/docs/setup/staff-and-permissions).",
              shot: {
                id: "pos-setup-staff",
                alt: "The Staff page: the demo restaurant's staff with their roles and branches and the New user button.",
                caption: "A cashier and a barista sign in to the till only; a branch manager also enters the back office.",
              },
            },
            {
              title: "Review the role permissions",
              body: "Under **System › Permissions** you see each role's permissions and change them, then **Save permissions**. On any staff member's page you can change theirs alone; it then shows **Changed from role default**.",
              shot: {
                id: "pos-setup-permissions",
                alt: "The Permissions page: a table with the roles in columns and the permissions in rows, with checkboxes.",
                caption: "Change the role once instead of every staff member.",
              },
            },
          ],
        },
        { t: "h2", id: "payments", text: "Review the payment methods" },
        {
          t: "steps",
          items: [
            {
              title: "Know what the till takes",
              body: "The till's **Payment** dialog offers **Cash**, **Card** (the card terminal at your branch), **Instapay** and **Split**, and **Gift card** when gift cards are on for your account. None needs switching on, and no setting hides one. The walkthrough is [Payment methods: what the till accepts](/docs/payments/payment-methods).",
              shot: {
                id: "pos-register-pay",
                alt: "The Payment dialog at the till: the amount due, the payment-method buttons and the Confirm payment button.",
                caption: "Each method has its own line on the receipt, the shift report and the reports.",
              },
            },
            {
              title: "Ask for online payment on the ordering site if you want it",
              body: "Card payment on the ordering site goes through Paymob on Egyptian-pound accounts or Moyasar on Saudi-riyal accounts, and the Moving team sets it up with your account at the provider. The details are in [Accept online card payments](/docs/payments/online-payments).",
            },
          ],
        },
        { t: "h2", id: "printer", text: "Connect the receipt printer" },
        {
          t: "steps",
          items: [
            {
              title: "Connect the printer and test it",
              body: "Find the printer's IP address and fix it on the router, then enter it under **Receipt printer IP** on the branch's page. At the till, from **Shift › Receipt printer** you can **Change** the address, and from **Terminal settings › Printer diagnostics** in the iPad or iPhone app you test printing. The walkthrough is [Connect a receipt printer](/docs/setup/receipt-printers).",
              shot: {
                id: "pos-setup-shift-printer",
                alt: "The Shift screen at the till with the Receipt printer card: the branch's printer address, or \"No printer set\" when there is none, and the Change button.",
                caption: "An address changed at the till shows in the back office marked **Changed at the till**.",
              },
            },
          ],
        },
        { t: "h2", id: "first-shift", text: "Open the first shift" },
        {
          t: "steps",
          items: [
            {
              title: "Start the day and open the shift",
              body: "Sign in to the till with a cashier account at the branch and open **Shift**. If no business day is open, tap **Start day**, then enter the **Opening float (EGP)** — the change in the drawer — and tap **Open shift**. The walkthrough is [Sign in and open a shift](/docs/selling/sign-in-and-open-a-shift).",
              shot: {
                id: "pos-register-shift",
                alt: "The Shift screen at the till: the open shift with its float and the cash movements.",
                caption: "The business day opens once per branch; the shift is per staff member.",
              },
            },
            {
              title: "Sell and close with your team",
              body: "Ring up the first orders with the cashier: the order, the payment and the receipt, then closing the shift by counting the cash and printing the Z-report. Whatever the menu or the printer is missing shows in the first hour of selling. Every step is in [The cashier: a shift from opening to closing](/docs/journeys/cashier-shift).",
            },
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I create the account myself?",
              a: "No. The Moving team creates it after you get in touch, and hands you an access sheet with your first accounts — see [Get started with Moving POS](/docs/getting-started/get-started-with-pos).",
            },
            {
              q: "Who sets the currency, language and country?",
              a: "The Moving team, when the account is created; they are not in **Settings**. What the team sets is listed in [Set business settings and VAT](/docs/setup/business-settings-and-tax).",
            },
            {
              q: "Do I need to enter stock from day one?",
              a: "No. Selling works with the menu alone. When you want ingredients deducted automatically and a food cost, add [ingredients and recipes](/docs/inventory/ingredients-and-recipes).",
            },
          ],
        },
      ],
      related: [
        "getting-started/get-started-with-pos",
        "setup/build-your-menu",
        "payments/payment-methods",
        "journeys/cashier-shift",
      ],
    },
    {
      slug: "cashier-shift",
      title: "The cashier: a shift from opening to closing",
      summary:
        "The cashier's day in order: open the shift, take the order, apply a discount or points, take payment, then count the cash and close the shift with a Z-report.",
      keywords: [
        "cashier",
        "till",
        "shift",
        "open shift",
        "close shift",
        "take an order",
        "take payment",
        "Z-report",
        "cash drawer",
        "أمين الصندوق",
        "الوردية",
        "الدفع",
      ],
      reviewed: "2026-10-27",
      before: [
        "An account with the **Cashier** role (or any role that enters the till) linked to your branch, with its details from the restaurant's manager.",
        "The **Open & close shifts** permission; and for coupons and points, **Apply order discounts**. Both are the cashier's by default.",
      ],
      body: [
        {
          t: "p",
          text: "The shift is your drawer: it starts with a float and ends with a count. Everything in between — the orders, the discounts and the movements — is counted against it and shows in the Z-report at its end.",
        },
        { t: "h2", id: "open", text: "Open" },
        {
          t: "steps",
          items: [
            {
              title: "Sign in",
              body: "Type your **Email** and **Password** and tap **Sign in**. The till opens on **POS**; an admin picks the **Branch** first. There is no PIN sign-in, and whoever forgets their password asks the restaurant's manager for a new one.",
              shot: {
                id: "pos-register-login",
                alt: "The POS sign-in screen: the email and password fields, the sign-in button and the language button.",
                caption: "The language button switches the whole till and the device remembers your choice.",
              },
            },
            {
              title: "Start the day and open your shift",
              body: "Open **Shift**. If it says there is no open business day, tap **Start day**. Then enter the **Opening float (EGP)** — the change in the drawer — and tap **Open shift**. The walkthrough is [Sign in and open a shift](/docs/selling/sign-in-and-open-a-shift).",
              shot: {
                id: "pos-register-shift",
                alt: "The Shift screen at the till: the open shift with its float, the cash movements and the Close shift button.",
                caption: "Each staff member has one open shift at the branch, and several cashiers can work at the same time.",
              },
            },
          ],
        },
        { t: "h2", id: "sell", text: "Sell" },
        {
          t: "steps",
          items: [
            {
              title: "Take the order",
              body: "In **POS** search or pick a category, tap the item, choose the **Size**, the **Quantity** and an **Item note (optional)**, then **Add to order**. Set **Dine-in**, **Takeaway** or a **Delivery app**, or **Hold order** to come back to it. The walkthrough is [Take an order at the POS](/docs/selling/take-an-order).",
              shot: {
                id: "pos-register-sale",
                alt: "The POS screen: search, the menu categories and the item cards, with the current order and the Pay button beside them.",
                caption: "On a phone the cart drops to a bar at the bottom that opens with **View order**.",
              },
            },
            {
              title: "Apply a discount or points",
              body: "Tap **Pay**. Under **Enter discount code** type the code and tap **Apply**, or **Browse offers**. For loyalty points type the **Guest mobile number**, tap **Look up**, then **Use … points**. One discount from one source per order. The walkthroughs are [Apply discounts and coupons](/docs/selling/discounts-and-coupons) and [Use points at the till](/docs/loyalty/points-at-the-till).",
              shot: {
                id: "pos-register-pay-discounts",
                alt: "The Pay screen scrolled to the discount-code section: the code field, the Apply button and the loyalty points section.",
                caption: "A discount code replaces the running offer; they do not combine.",
              },
            },
            {
              title: "Take the payment",
              body: "Choose **Cash** and enter the **Tendered** amount (or **Exact amount**) to see the **Change due**; or **Card** or **Instapay** with an optional reference, or **Split**, or **Gift card**. Then **Confirm payment**. The walkthrough is [Take payment for an order](/docs/selling/take-payment), and where each method shows in [Payment methods: what the till accepts](/docs/payments/payment-methods).",
              shot: {
                id: "pos-register-pay",
                alt: "The Pay dialog: the amount due, the Cash, Card, Instapay, Split and Gift card buttons and the Confirm payment button.",
                caption: "The till records the card; it does not charge it. The card terminal is separate.",
              },
            },
            {
              title: "Print the receipt and follow the order",
              body: "After **Order created** you see the **Order number** and the **Change due**, and the **Print receipt** and **Print kitchen ticket** buttons. To print again later open **Orders**, pick the order and tap **Reprint receipt**. The walkthrough is [Print receipts and read order numbers](/docs/selling/receipts-and-order-numbers).",
              shot: {
                id: "pos-register-order-drawer",
                alt: "The Orders page at the till with an order's details open: the items, the amounts, the payment method and the Reprint receipt button.",
                caption: "The order number is what the kitchen calls out and what the guest asks about.",
              },
            },
            {
              title: "Record what goes into and out of the drawer",
              body: "From **Shift** choose **Pay in** or **Pay out**, enter the **Amount (EGP)** and the **Reason**, then **Record movement**. The movement counts towards the expected cash at close and cannot be edited from the till.",
            },
            {
              title: "Handle cancellations",
              body: "From **Orders** open the order. **Cancel order** needs the **Cancel / void orders** permission — the admin's and the branch manager's by default — so ask your manager. A return goes through **Return order** with a reason and any wasted ingredients. The walkthrough is [Follow orders, cancel them or record a return](/docs/selling/orders-cancellations-and-returns).",
              shot: {
                id: "pos-register-orders",
                alt: "The Today's orders page at the till: the orders with their numbers, status and amounts, and the search-by-order-number box.",
                caption: "Today's orders only; earlier days are in the back office.",
              },
            },
          ],
        },
        { t: "h2", id: "close", text: "Close" },
        {
          t: "steps",
          items: [
            {
              title: "Count the cash and close the shift",
              body: "From **Shift** tap **Close shift**. Enter the **Counted cash (EGP)**, the **Counted card terminal (EGP)** and **Counted Instapay (EGP)** if you wish, and a **Reason for variance** if there is one, then **Confirm close**. The **Shift close report (Z)** appears: **Shortage**, **Surplus** or **Balanced**; tap **Print report**. The walkthrough is [Close the shift and print the Z-report](/docs/selling/close-the-shift).",
              shot: {
                id: "pos-register-close-shift",
                alt: "The close-shift form: the counted cash, card terminal and Instapay fields, the reason for variance and the Confirm close button.",
                caption: "Count before you type; a large variance needs a written reason.",
              },
            },
            {
              title: "End the day if you are the last to close",
              body: "Once every shift at the branch is closed, **End day** appears, then **Confirm end day** and the **Business day report**. The details are in [Open and close the business day](/docs/branches/business-days).",
            },
          ],
        },
        {
          t: "callout",
          tone: "warning",
          text: "If the internet drops during **Confirm payment**, leave the cart as it is and tap the button again when it is back; the order will not be duplicated. What survives and what is lost is in [Handle an internet drop](/docs/selling/when-the-internet-drops).",
        },
        {
          t: "qa",
          items: [
            {
              q: "I forgot my password. What do I do?",
              a: "There is no reset link on the sign-in screen; an admin sets you a new one from **Staff** in the back office.",
            },
            {
              q: "Can I open a shift while a colleague has one open?",
              a: "Yes. Each staff member has their own shift at the same branch, and every order counts against whoever recorded it.",
            },
            {
              q: "The guest asked for a tax invoice in their company's name.",
              a: "In the Pay dialog choose **Tax invoice for a business** and enter its details — available on Saudi accounts; see [Take payment for an order](/docs/selling/take-payment).",
            },
          ],
        },
      ],
      related: [
        "selling/sign-in-and-open-a-shift",
        "selling/take-an-order",
        "selling/close-the-shift",
        "journeys/kitchen-display",
      ],
    },
    {
      slug: "kitchen-display",
      title: "The kitchen: the display from order to ready",
      summary:
        "The kitchen's day on the display: accept online orders with a prep time, move each ticket to ready, print tickets, and keep an eye on sound and the connection.",
      keywords: [
        "kitchen",
        "KDS",
        "kitchen display",
        "barista",
        "kitchen ticket",
        "online orders",
        "prep time",
        "kitchen screen",
        "المطبخ",
        "شاشة التحضير",
        "بارِيستا",
      ],
      reviewed: "2026-10-27",
      before: [
        "An account with the **Barista** role — it opens straight on **Kitchen** — or any role that enters the till with the **Advance order status** permission (granted to everyone by default).",
        "A device in the kitchen with an internet connection, and the printer on the branch network if you print tickets.",
      ],
      body: [
        {
          t: "p",
          text: "The kitchen display is a board of columns: every order is a ticket that moves from one column to the next with a tap. What comes from the till and what comes from the ordering site stand in the same queue, and every move is seen by the cashier and the customer.",
        },
        { t: "h2", id: "the-board", text: "The board" },
        {
          t: "steps",
          items: [
            {
              title: "Open the kitchen display",
              body: "From the till open **Kitchen**. The columns are **On hold**, **New**, **Preparing** and **Ready**, and each ticket carries the order number, its items and its source: **POS** from the till or **Online** from the ordering site. The walkthrough is [Follow orders on the kitchen display](/docs/selling/kitchen-display).",
              shot: {
                id: "pos-register-kds",
                alt: "The kitchen display: the On hold, New, Preparing and Ready columns, each with its order tickets and their items.",
                caption: "The ticket shows the note the cashier wrote on an item under its name.",
              },
            },
            {
              title: "Accept online orders",
              body: "A new **Online** order waits for your acceptance: choose the **Prep time (minutes)** — 10, 15, 20 or 30 — and tap **Accept**, and the customer sees **Order accepted**. To refuse it tap **Reject order**, then **Confirm reject?**, and they see **We are sorry — your order was cancelled**. The walkthrough is [Accept online orders at the branch](/docs/online-ordering/online-orders-at-the-till).",
              shot: {
                id: "pos-online-kds",
                alt: "The kitchen display with a new online order: the prep-time buttons in minutes and the accept and reject buttons.",
                caption: "The prep time you choose is what the customer is shown on the ordering site.",
              },
            },
          ],
        },
        { t: "h2", id: "move", text: "Move the tickets" },
        {
          t: "steps",
          items: [
            {
              title: "Move an order forward",
              body: "Tap **Start preparing** and the ticket moves to **Preparing**, then **Order ready** to **Ready**, then **Complete order** when the guest or the cashier takes it. A delivery order has **Out for delivery** then **Delivered**. A customer who ordered online sees **Being prepared**, then **Ready for pickup** or **On its way to you**.",
            },
            {
              title: "Print the tickets",
              body: "Every ticket has a **Print kitchen ticket** button. To print every new ticket on its own, turn **Auto-print on** on this device. What the ticket prints and connecting the printer are in [Connect a receipt printer](/docs/setup/receipt-printers).",
            },
            {
              title: "Watch the sound and the connection",
              body: "At the top of the screen a **Sound on** or **Muted** indicator for the new-order sound, and a **Live** or **Disconnected** indicator. When the connection drops the screen keeps showing what arrived and refreshes when it is back.",
            },
          ],
        },
        { t: "h2", id: "review", text: "Review the day" },
        {
          t: "steps",
          items: [
            {
              title: "Open today's orders",
              body: "Under **Orders** you see all of **Today's orders** with their status and search by order number. An order that needs cancelling after preparation is cancelled by the branch manager from here or from the back office — [Follow orders and cancel them](/docs/selling/orders-cancellations-and-returns).",
              shot: {
                id: "pos-online-today-orders",
                alt: "The Orders page at the till: today's orders with their numbers, status and source.",
                caption: "The status here is the same one the customer sees on the ordering site.",
              },
            },
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "What does the customer see when I tap Order ready?",
              a: "On the ordering site their status changes to **Ready for pickup** for a pickup order, or stays **Being prepared** until **Out for delivery** for a delivery order.",
            },
            {
              q: "Why can't I hear new orders?",
              a: "The indicator is on **Muted**; tap it to go back to **Sound on**. The setting is per device.",
            },
            {
              q: "Does the kitchen need an open shift?",
              a: "No. A shift is a cash drawer; the kitchen display works with a sign-in alone.",
            },
          ],
        },
      ],
      related: [
        "selling/kitchen-display",
        "online-ordering/online-orders-at-the-till",
        "setup/receipt-printers",
        "journeys/cashier-shift",
      ],
    },
    {
      slug: "branch-manager-day",
      title: "The branch manager: stock and the day's numbers",
      summary:
        "A branch manager's day: the dashboard and its alerts, the business day, stock and transfers, branch prices, then shifts, the daily report and the activity log.",
      keywords: [
        "branch manager",
        "dashboard",
        "stock",
        "transfers",
        "shifts",
        "daily report",
        "activity log",
        "business day",
        "مدير الفرع",
        "المخزون",
        "الورديات",
        "تقرير اليوم",
      ],
      reviewed: "2026-10-27",
      before: [
        "The **Branch manager** role: it enters the back office and the till, and holds **Open & close shifts**, **Adjust stock**, **Manage purchases**, **View reports**, **View shift history** and **Cancel / void orders** by default.",
        "Stock transfers need a warehouse added as **Warehouse — holds stock, never sells** and transfers switched on by the Moving team.",
      ],
      body: [
        {
          t: "p",
          text: "The branch manager stands between the till and the back office: opens and closes the day, guards the stock, and reviews the shifts by their numbers. This journey is that whole day.",
        },
        { t: "h2", id: "morning", text: "Morning" },
        {
          t: "steps",
          items: [
            {
              title: "Read the dashboard",
              body: "Under **Today › Dashboard** read **Revenue today**, **Orders** and **Avg order**, **By channel** and **By payment method**, and your branch's figures under **Per branch**. The part that matters most is **Alerts**: **low-stock items**, a **business day still open**, a **large cash variance** and **transfers need you**. The walkthrough is [Read the dashboard](/docs/reports/back-office-dashboard).",
              shot: {
                id: "pos-reports-dashboard",
                alt: "The dashboard: the revenue-today, orders and average-order cards, the Alerts section, and the split by channel, payment method and branch.",
                caption: "**No alerts — all clear.** is the line you want to see every morning.",
              },
            },
            {
              title: "Make sure the business day is open",
              body: "Under **Today › Business days** you see the **Open days** per branch. The day is usually opened at the till with **Start day** by the first shift; yesterday's day left open is closed with **Close day** or **Force close** with a reason. The walkthrough is [Open and close the business day](/docs/branches/business-days).",
              shot: {
                id: "pos-business-days",
                alt: "The Business days page in the back office: the open days with their branches and the history with each day's report.",
                caption: "One open day per branch; a forced close is marked **FORCED** in the history.",
              },
            },
          ],
        },
        { t: "h2", id: "stock", text: "Stock" },
        {
          t: "steps",
          items: [
            {
              title: "Review the branch's stock",
              body: "Under **Catalogue › Inventory** pick your branch: for each ingredient the **On hand**, the **Threshold** and a **LOW** flag. What arrived from the supplier goes in with **Receive purchase** (the **Supplier**, **Qty** and **Cost (EGP)**), and what spoiled or differed in the count with **Adjust / waste** and a **Reason**. The walkthrough is [Track stock in each branch](/docs/inventory/stock-per-branch).",
              shot: {
                id: "pos-inventory-stock",
                alt: "The Inventory page for a branch: the ingredients with on hand, threshold, cost and stock value, and the Receive purchase and Adjust / waste buttons.",
                caption: "Stock is deducted on its own with every order by the recipe; you record what comes in and what is wasted.",
              },
            },
            {
              title: "Ask the warehouse for a transfer",
              body: "From the **Transfers** card click **Open transfers**, then **New transfer** of the kind **Request**, and choose the ingredients and quantities. When it arrives: **Mark arrived**, then **Count** what actually arrived with a reason for any difference, then **Accept the count**. The walkthrough is [Move stock between the warehouse and branches](/docs/inventory/inventory-transfers).",
              shot: {
                id: "pos-inventory-transfers",
                alt: "The Transfers page: the To approve, In transit and Needs attention cards and the list of transfers with their status.",
                caption: "The count on arrival is what protects the branch from a difference it did not cause.",
              },
            },
            {
              title: "Set your branch's prices and what it sells",
              body: "Under **Catalogue › Menu › Products** click **Edit** on the item, and under **Branch Prices** click **Add line**, pick the **Branch** and the **Price (EGP)**, then **Save branch prices**. An item you are not selling today: **Hide from POS**. It needs the **Manage menu & catalog** permission. The walkthrough is [Set branch prices and item availability](/docs/branches/branch-prices-and-availability).",
              shot: {
                id: "pos-menu-products",
                alt: "The Products tab of the menu with an item open on its branch prices: one line per branch with its price.",
                caption: "A branch price overrides the general price on that branch's till.",
              },
            },
          ],
        },
        { t: "h2", id: "evening", text: "Evening" },
        {
          t: "steps",
          items: [
            {
              title: "Review the day's shifts",
              body: "Under **Today › Shifts** pick your branch and the date: for each shift the **Expected**, the **Counted** and the **Variance**, the **Card ±** and **Instapay ±**, and a **Flagged / reason** column with what the cashier wrote. A shift still **OPEN** after hours means someone forgot to close. The walkthrough is [Review shifts and Z-reports](/docs/reports/shifts-and-z-reports).",
              shot: {
                id: "pos-reports-shifts",
                alt: "The Shifts page in the back office: the day's shifts with expected, counted, variance and reason.",
                caption: "A large variance is flagged on its own by the amount and share thresholds under **Settings**.",
              },
            },
            {
              title: "Read the day's report",
              body: "Under **Business › Reports** the **Daily** tab: **Revenue**, **Orders**, **Cancelled**, **Discount** and **Delivery commission**, and **By channel**, **By payment method** and **By delivery app**, with a CSV download. The walkthrough is [Use and export your reports](/docs/reports/sales-reports).",
              shot: {
                id: "pos-reports-daily",
                alt: "The Reports page on the Daily tab: the day's figures and the tables by channel and payment method.",
                caption: "Cancelled and refund due are separate figures, so nothing is quietly deducted from revenue.",
              },
            },
            {
              title: "Review the activity log",
              body: "Under **System › Activity** filter by your branch and the **Action**: **Order cancelled**, **Order returned**, **Stock adjustment**, **Stock waste** and **Cash pay-out**, with the **User** and the **Time**. It needs the **View audit log** permission. The walkthrough is [Track orders and the activity log](/docs/reports/orders-and-activity-log).",
              shot: {
                id: "pos-reports-activity",
                alt: "The Activity page: the log of actions with time, user, entity and details, and the branch and action filters.",
                caption: "Every cancellation, waste entry and cash pay-out has a name and a time.",
              },
            },
            {
              title: "End the business day",
              body: "Once every shift at the branch is closed, from the till **End day**, then **Confirm end day**, and the **Business day report** appears. From the back office, **Close day** under **Today › Business days**.",
              shot: {
                id: "pos-shift-business-day",
                alt: "The Shift screen at the till: the branch's open business day and the running shift.",
                caption: "**End day** appears here once every shift at the branch is closed, and gathers them into one report.",
              },
            },
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "A shift shows a large variance. What do I do?",
              a: "Open the shift under **Today › Shifts** and read **Flagged / reason**; the cashier must give a reason when the variance passes **Large variance — amount** or **Large variance — share of expected** under **Settings**. Then match the **Cash movements** and the cancelled orders under **Activity**.",
            },
            {
              q: "Can I close the business day from the back office?",
              a: "Yes: **Close day** under **Today › Business days** once the shifts are closed, and **Force close** with a reason when a shift stays open — it needs the **Manage business days from HQ** permission.",
            },
            {
              q: "Why can't I see the Profit & loss tab?",
              a: "It needs the **View reports** permission; someone with **Manage menu & catalog** alone sees the other tabs without it.",
            },
          ],
        },
      ],
      related: [
        "reports/back-office-dashboard",
        "inventory/stock-per-branch",
        "reports/shifts-and-z-reports",
        "journeys/cashier-shift",
      ],
    },
    {
      slug: "customer-online-and-points",
      title: "The customer: orders online and earns points",
      summary:
        "Your customer's journey: ordering on your ordering site and following it, earning and spending points at the till, and paying at the table where that is on.",
      keywords: [
        "customer",
        "ordering site",
        "online order",
        "loyalty points",
        "pay at table",
        "customer journey",
        "العميل",
        "موقع الطلبات",
        "الطلب أونلاين",
        "نقاط الولاء",
      ],
      reviewed: "2026-10-27",
      before: [
        "An ordering site the Moving team set up with your account, an active branch and a priced menu — [Take orders on your ordering site](/docs/online-ordering/your-ordering-site).",
        "For loyalty points and paying at the table: each switched on separately by the Moving team.",
      ],
      body: [
        {
          t: "p",
          text: "This journey is from the customer's side: what they see on your ordering site and at the till. Know it to train your team on what customers ask about.",
        },
        { t: "h2", id: "order-online", text: "They order on your site" },
        {
          t: "steps",
          items: [
            {
              title: "They pick a branch and browse the menu",
              body: "They open the ordering site and pick under **Choose your nearest branch**, then browse the **Menu** with the same categories as the till and tap **Add to cart** with a **Quantity** and **Preparation notes (optional)**. The prices are that branch's.",
              shot: {
                id: "pos-ordering-home",
                alt: "The home page of the demo ordering site: the branch picker and the menu categories with their items, photos and prices.",
                caption: "The site reads the menu from the back office; what you hide from the POS does not show here.",
              },
            },
            {
              title: "They check out",
              body: "In **Your cart** they tap **Continue to checkout**: **How would you like it?** — **Pickup from branch** or **Delivery** with a **Delivery zone** and **Full address** — then **Full name** and **Phone number**, and **Payment**: **Cash on pickup/delivery** or **Card (pay now)** if you connected a payment gateway, a **Coupon code** if they have one, then **Place order**. No account is needed.",
            },
            {
              title: "Their order reaches the kitchen",
              body: "The order shows on the branch's **Kitchen** display marked **Online**, and the kitchen accepts it with a **Prep time (minutes)**. The walkthrough is [Accept online orders at the branch](/docs/online-ordering/online-orders-at-the-till).",
              shot: {
                id: "pos-online-kds",
                alt: "The kitchen display with a new online order waiting for acceptance with a prep time.",
                caption: "From tapping Place order to showing here is a matter of seconds.",
              },
            },
            {
              title: "They follow its status",
              body: "On their order page they see **Order received**, then **Order accepted**, then **Being prepared**, then **Ready for pickup** or **On its way to you**, with a **Chat on WhatsApp** button to your restaurant's number. A card payment that did not finish shows **Waiting for payment** and **Retry payment** — [Accept online card payments](/docs/payments/online-payments).",
            },
          ],
        },
        { t: "h2", id: "earn-and-spend", text: "They earn points and spend them" },
        {
          t: "steps",
          items: [
            {
              title: "They give their number at the till",
              body: "At payment the cashier types the **Guest mobile number** and taps **Look up**: a new number opens an account with that very order, and the guest earns the order's points. Once the balance is enough the cashier spends it with **Use … points** as a discount on the order. Points are earned with an order and spent as a discount on one. The walkthroughs are [Use points at the till](/docs/loyalty/points-at-the-till) and [How loyalty points work](/docs/loyalty/how-points-work).",
              shot: {
                id: "pos-loyalty-pay-screen",
                alt: "The loyalty points section of the Pay screen: the guest mobile number field, the Look up button, the points balance and the use-points button.",
                caption: "One number for the guest across every branch and the ordering site.",
              },
            },
            {
              title: "They pay at the table",
              body: "If paying at the table is on: they scan the **Scan to pay** card on their table and see **Your table**, **On your check** and **Still to pay**, and tap **Pay the check** or **Pay guest**. It needs a connected payment gateway. The walkthrough is [Let guests pay at the table](/docs/online-ordering/pay-at-the-table).",
              shot: {
                id: "pos-table-cards",
                alt: "The table QR codes page at the till: a card per table with its code and the Issue the missing cards and Print the sheet buttons.",
                caption: "One card per table, printed once and kept.",
              },
            },
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Does the customer need an account on the ordering site?",
              a: "No. They enter their **Full name** and **Phone number** with every order and follow the order from its page.",
            },
            {
              q: "Is there more to loyalty than points?",
              a: "No. Loyalty in Moving POS is points earned with an order and spent as a discount, nothing more — [How loyalty points work](/docs/loyalty/how-points-work).",
            },
            {
              q: "How does the customer pay by card on the site?",
              a: "Through a payment gateway connected to your account: Paymob for Egyptian accounts and Moyasar for Saudi ones — [Accept online card payments](/docs/payments/online-payments). Without one they see **Cash on pickup/delivery** only.",
            },
          ],
        },
      ],
      related: [
        "online-ordering/your-ordering-site",
        "loyalty/how-points-work",
        "loyalty/points-at-the-till",
        "journeys/kitchen-display",
      ],
    },
    {
      slug: "accountant-books",
      title: "The accountant: VAT, invoices and the books",
      summary:
        "What the accountant needs from Moving POS: VAT, ZATCA for Saudi accounts, reviewing shifts, profit and loss, exports, and linking the books.",
      keywords: [
        "accountant",
        "VAT",
        "ZATCA",
        "e-invoice",
        "profit and loss",
        "export",
        "bookkeeping",
        "tax invoice",
        "accounting app",
        "المحاسب",
        "ضريبة القيمة المضافة",
        "زاتكا",
        "الأرباح والخسائر",
      ],
      reviewed: "2026-10-27",
      before: [
        "A back-office account with the **View reports** permission; **Manage settings** to set VAT, and **Manage ZATCA e-invoicing** for e-invoicing — all the admin's by default.",
        "Food cost and margins need recipes written for the items — [Add ingredients and link them to recipes](/docs/inventory/ingredients-and-recipes).",
      ],
      body: [
        {
          t: "p",
          text: "The till settles with the guests; the back office settles with you. This journey covers what the accountant sets once, what they review every day, and how the numbers get out to the books.",
        },
        { t: "h2", id: "set-up", text: "Set once" },
        {
          t: "steps",
          items: [
            {
              title: "Set VAT",
              body: "Under **System › Settings** enter the **VAT rate (%)** and save. Prices in Moving POS are always **VAT included**, and the receipt prints **VAT (included)** with its value. The walkthrough is [Set business settings and VAT](/docs/setup/business-settings-and-tax).",
              shot: {
                id: "pos-setup-settings",
                alt: "The Settings page: the VAT rate field and the rest of the receipt and shift settings.",
                caption: "One rate for the whole account; changing it applies to the orders that follow.",
              },
            },
            {
              title: "Issue e-invoices with ZATCA",
              body: "For Saudi accounts once the Moving team switched it on: under **System › ZATCA e-invoicing** fill in the **Seller profile** (the **Seller legal name**, **VAT registration number** and **National address**) and click **Save profile**, then onboard each branch from the **Branches** tab with a code from the Fatoora portal. Every receipt after that is a **Simplified Tax Invoice** with a signature and a QR code, and you follow rejected **Documents**. The walkthrough is [Issue e-invoices with ZATCA](/docs/integrations/zatca-e-invoicing).",
              shot: {
                id: "pos-integrations-zatca",
                alt: "The ZATCA e-invoicing page: the Seller profile, Branches and Documents tabs, and each branch's onboarding status.",
                caption: "**Active** on a branch means every receipt there is reported to the authority.",
              },
            },
          ],
        },
        { t: "h2", id: "review", text: "Review every day" },
        {
          t: "steps",
          items: [
            {
              title: "Reconcile the shifts and business days",
              body: "Under **Today › Shifts** each shift has its **Expected**, **Counted** and **Variance**, and **Card ±** and **Instapay ±**; under **Today › Business days** the **Day report** gathers the branch's shifts. The walkthrough is [Review shifts and Z-reports](/docs/reports/shifts-and-z-reports).",
              shot: {
                id: "pos-reports-shifts",
                alt: "The Shifts page: the shifts with expected, counted, variance and the card and Instapay variances for each.",
                caption: "The Z-report the cashier printed is the same line here.",
              },
            },
            {
              title: "Read the profit and loss",
              body: "Under **Business › Reports** the **Profit & loss** tab: **Revenue**, **Food cost**, **Margin** and **Margin %** per item and for the period, and **Ingredient usage** (**Used**, **Purchased**, **Waste** and **Adjusted**). An item with **No recipe** has an empty cost. The walkthrough is [Use and export your reports](/docs/reports/sales-reports).",
              shot: {
                id: "pos-reports-profit-loss",
                alt: "The Profit & loss tab in Reports: revenue, food cost and margin per item.",
                caption: "The margin is computed from the recipe and the ingredient's latest cost.",
              },
            },
            {
              title: "Export what the books need",
              body: "Under **Today › Orders** filter by period and branch and click **Export CSV**: every order with its **Subtotal**, **Discount**, **Delivery fee**, **Total**, **VAT (included)** and payment status. Every tab under **Reports** downloads as CSV too. The walkthrough is [Track orders and the activity log](/docs/reports/orders-and-activity-log).",
              shot: {
                id: "pos-reports-orders",
                alt: "The Orders page in the back office: the orders with their status, amounts and payment status, the period and branch filters and the Export CSV button.",
                caption: "**Saved views** keep your monthly filters one click away.",
              },
            },
          ],
        },
        { t: "h2", id: "books", text: "Get the numbers into the books" },
        {
          t: "steps",
          items: [
            {
              title: "Connect the Accounting app",
              body: "Moving's Accounting app receives the **Day-close hand-off** automatically: a journal and an entry for every business day, and you check **What the books received** and send a missing day again. Start from the [free trial page](/accounting-trial) on our site with **Start my free trial**, for 14 days. The walkthrough is [Use the Accounting app with Moving POS](/docs/integrations/accounting).",
            },
            {
              title: "Or connect your own system through the API",
              body: "If your books live in another system and the Moving team switched the API on: under **System › Integrations** create a **New key** with the **View reports** scope, and a **New endpoint** that receives the **Cash day closed** event. The walkthrough is [Connect your systems to Moving POS](/docs/integrations/pos-api-and-webhooks).",
              shot: {
                id: "pos-integrations-api-keys",
                alt: "The Integrations page: the API keys and Webhooks tabs, with a key and its scopes and an endpoint and its events.",
                caption: "A read-only key is all accounting needs.",
              },
            },
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Are prices VAT-inclusive or is VAT added at payment?",
              a: "Always inclusive; the receipt breaks out the included VAT at the rate under **Settings**.",
            },
            {
              q: "Why is the food cost empty for some items?",
              a: "Because they have **No recipe**. Write a recipe for each size from [Add ingredients and link them to recipes](/docs/inventory/ingredients-and-recipes) and their cost and margin are computed.",
            },
            {
              q: "What about e-invoicing in Egypt?",
              a: "ZATCA is for Saudi accounts. The situation for Egyptian accounts is explained in the **In Egypt** section of [Issue e-invoices with ZATCA](/docs/integrations/zatca-e-invoicing).",
            },
          ],
        },
      ],
      related: [
        "reports/sales-reports",
        "integrations/zatca-e-invoicing",
        "integrations/accounting",
        "journeys/branch-manager-day",
      ],
    },
  ],
};
