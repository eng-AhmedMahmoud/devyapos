import type { DocCategory } from "../types";

/* Follows content/docs/ar/pos-selling.ts article for article, block for block; the sources are listed there. */
export const posSelling: DocCategory = {
  id: "selling",
  group: "daily",
  icon: "register",
  title: "Selling at the POS",
  description: "Open a shift, take an order, take the payment, follow the kitchen, and close the shift.",
  articles: [
    {
      slug: "sign-in-and-open-a-shift",
      title: "Sign in and open a shift",
      summary:
        "Sign in to the POS, start the branch's business day, open your shift with an opening float, and record cash going into and out of the drawer.",
      keywords: ["sign in", "log in", "open shift", "opening float", "business day", "cash drawer", "pay in", "pay out", "تسجيل الدخول", "فتح وردية"],
      reviewed: "2026-10-27",
      before: [
        "A staff account linked to a branch. The Moving team creates your business's account and hands over the access details; you add your staff in the back office — see [Staff and permissions](/docs/setup/staff-and-permissions).",
        "The **Open & close shifts** permission to start the day and open a shift, and **Record cash pay-in / pay-out** for drawer movements.",
      ],
      body: [
        {
          t: "p",
          text: "The POS runs in a browser or in the POS app on the device. Before any sale, two things must be true: the branch has an open business day, and you have an open shift in your name. A shift here is your cash drawer, from the opening float to the count at close.",
        },
        { t: "h2", id: "sign-in", text: "Sign in" },
        {
          t: "steps",
          items: [
            {
              title: "Open the sign-in page",
              body: "Type your **Email** and **Password**, then tap **Sign in**. The language button on the page switches between Arabic and English, and the device remembers your choice.",
              shot: {
                id: "pos-register-login",
                alt: "The POS sign-in screen: email and password fields, the sign-in button and the language switch.",
                caption: "Signing in asks only for an email and a password; your branch comes from your account.",
              },
            },
            {
              title: "Carry on to your screen",
              body: "The POS opens on **POS**. A **Barista** goes straight to **Kitchen**. If the waiter flow is switched on for your account, you start on **Floor**.",
            },
            {
              title: "Pick a branch if asked",
              body: "Only an **Admin** or **Super Admin** sees the **Branch** list, because they are not tied to a branch, and payment cannot be completed until a branch is picked. Everyone else works on their own branch without choosing.",
            },
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "There is no PIN sign-in and no password-recovery link. If someone forgets their password, an admin sets a new one in the back office. After several wrong attempts in a row you see **Too many sign-in attempts. Wait a minute, then try again.**",
        },
        { t: "h2", id: "start-the-day", text: "Start the business day" },
        {
          t: "p",
          text: "Open **Shift** from the navigation. If you see **No business day open right now. Start the day before opening a shift.**, tap **Start day**. Each branch has one open business day, which groups every shift at the branch and closes with one day report. Head office can also start and end the day from the back office; details in [Business days](/docs/branches/business-days).",
        },
        {
          t: "p",
          text: "Anyone with the **Open & close shifts** permission can start the day — cashiers have it by default — so nobody waits for a manager. No shift opens before the day has started; the system refuses it even if the request comes from another device.",
        },
        { t: "h2", id: "open-a-shift", text: "Open your shift" },
        {
          t: "steps",
          items: [
            {
              title: "Enter the opening float",
              body: "In **Opening float (EGP)**, type the cash already in the drawer, usually change; it is counted back at close. Type `0` if the drawer is empty: a blank field is refused with **Enter a valid amount.** Arabic and Western digits both work.",
              shot: {
                id: "pos-register-shift",
                alt: "The Shift screen: the opening float field and the Open shift button, or the open shift's details with its cash movements.",
                caption: "Once open, the screen shows when the shift opened and its opening float.",
              },
            },
            {
              title: "Open the shift",
              body: "Tap **Open shift**. **Opened at** and **Opening float** appear, and the POS is ready to sell.",
            },
          ],
        },
        {
          t: "p",
          text: "Each person has one open shift per branch, and several cashiers can each have their own shift open at the same time. Every order you ring up is booked to your own shift. If you open **POS** without a shift, a **No open shift** screen appears with an **Open shift** button. On Saudi accounts these fields show the riyal instead.",
        },
        { t: "h3", text: "What the Shift screen shows while it is open" },
        {
          t: "list",
          items: [
            "**Opened at** and **Opening float** for your shift.",
            "**Cash movements**, with every pay-in and pay-out you recorded, or **No movements recorded.** when there are none.",
            "The **Close shift** button for when you finish — see [Close the shift and print the Z-report](/docs/selling/close-the-shift).",
            "A **Receipt printer** line with the branch printer's address and a **Change** button, for anyone with the **Set the receipt printer IP from the POS** permission. The change shows in the back office under your name.",
          ],
        },
        { t: "h2", id: "cash-movements", text: "Record pay-ins and pay-outs" },
        {
          t: "steps",
          items: [
            {
              title: "Choose the movement",
              body: "Choose **Pay in** when you add cash to the drawer, and **Pay out** when you take cash out, such as paying a supplier.",
            },
            {
              title: "Enter the amount and reason",
              body: "Fill in **Amount (EGP)** and **Reason**; the reason is required.",
            },
            {
              title: "Record it",
              body: "Tap **Record movement**. The movement appears under **Cash movements** with its type, reason, amount and time, and counts towards the expected cash at close. It cannot be edited or deleted from the POS.",
            },
          ],
        },
        { t: "h2", id: "clock-in", text: "Clocking in is not a shift" },
        {
          t: "p",
          text: "Working hours are not recorded on the shift. If attendance is switched on for your account, a **Clock** screen appears: staff type their **Staff number** and **PIN**, then choose **Clock in**, **Clock out**, **Start break** or **End break**. This is the only place the POS uses a PIN, and the account signed in on the device needs the **View attendance** permission.",
        },
        {
          t: "callout",
          tone: "note",
          text: "The **Clock** screen and the waiter flow are switched on for your account by the Moving team. If you don't see them, message us.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why can't I open a shift?",
              a: "Either the business day hasn't started — tap **Start day** — or you already have an open shift at this branch, or your account lacks the **Open & close shifts** permission.",
            },
            {
              q: "Can a warehouse keeper sign in to the POS?",
              a: "No. A **Warehouse keeper** works in the back office only. An account with no branch can sign in to the POS only if it is an **Admin** or **Super Admin**.",
            },
            {
              q: "What happens to the cart when I log out?",
              a: "**Log out** drops the cart in progress; held orders stay saved on the server.",
            },
          ],
        },
      ],
      related: ["selling/close-the-shift", "selling/take-an-order", "setup/staff-and-permissions", "branches/business-days"],
    },
    {
      slug: "take-an-order",
      title: "Take an order at the POS",
      summary:
        "Pick items with their size, quantity and note, manage the cart, hold the order or set its type and delivery app, then go to payment.",
      keywords: ["take an order", "ring up", "cart", "add item", "hold order", "takeaway", "dine-in", "delivery app", "tables", "تسجيل طلب"],
      reviewed: "2026-10-27",
      before: ["An open shift in your name — see [Sign in and open a shift](/docs/selling/sign-in-and-open-a-shift)."],
      body: [
        {
          t: "p",
          text: "Open **POS**. The screen shows the menu — the search box, category buttons and item tiles — with the **Current order** cart beside it. On a phone the cart drops to a strip at the bottom; tap **View order** to open it.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-register-sale",
            alt: "The POS screen: search, menu categories and item tiles with photos and prices, beside the current-order cart and the Pay button.",
            caption: "A tile shows “from” before the price when sizes are priced differently.",
          },
        },
        { t: "h2", id: "add-items", text: "Add items" },
        {
          t: "steps",
          items: [
            {
              title: "Search or pick a category",
              body: "Type in **Search the menu** to search Arabic or English names across every category, or tap a category. A tile shows the photo, the name and the price, prefixed **from** when sizes are priced differently.",
            },
            {
              title: "Tap the item",
              body: "The item window always opens, even for an item with a single size.",
            },
            {
              title: "Choose the size",
              body: "**Size** appears only when the item has more than one size; the first is preselected, and each size shows its price.",
            },
            {
              title: "Add a note and set the quantity",
              body: "Type up to 500 characters in **Item note (optional)**, then set the **Quantity**.",
            },
            {
              title: "Add it to the order",
              body: "Tap **Add to order**. Adding the same item again with the same size and note adds to that line's quantity.",
            },
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "Add-ons (option groups) can't be chosen at the POS yet; only sizes can. There is also no note for the whole order, so write the guest's special requests in the item note.",
        },
        { t: "h2", id: "the-cart", text: "The cart" },
        {
          t: "list",
          items: [
            "Change a quantity with − and +, or swipe a line away to remove it.",
            "The last item in the cart can't be removed; a cart in progress always keeps at least one item.",
            "**Clear cart** takes two taps within 3 seconds (**Confirm clear?**). By default it keeps the first item; an admin changes this in **Settings › Empty cart guard**.",
            "If an admin set a **Clear cart password**, the POS asks for it when you clear the cart, and when you remove any item if they switched that on too.",
            "The cart shows **Subtotal** and **Total** with **Prices include VAT**; discounts are applied on the payment screen.",
            "The cart stays saved on the device for 12 hours, even if the page reloads.",
          ],
        },
        { t: "h2", id: "hold-an-order", text: "Hold an order" },
        {
          t: "p",
          text: "Tap **Hold order** to move the whole cart to the **On hold** column on the **Kitchen** screen and free the till for the next guest. A held order is not an order yet: it has no number, doesn't reach the kitchen and isn't counted in the shift. To bring it back, tap **Return to POS** on the Kitchen screen while the cart is empty, or delete it with **Discard held order** after entering the clear cart password. A branch can hold up to 20 orders.",
        },
        { t: "h2", id: "order-type", text: "Order type and delivery apps" },
        {
          t: "list",
          items: [
            "Choose **Takeaway** (the default) or **Dine-in**. Pickup and delivery orders come from [your ordering site](/docs/online-ordering/your-ordering-site) and can't be created at the POS, and the POS never adds a delivery fee.",
            "If you have delivery apps set up in the back office, choose the **Delivery app** before adding items so they are priced at its menu, then the **Rate** if the app has more than one commission rate. Both lock once the first item is added.",
            "There is no field for the guest's name or phone; the guest's number is typed on the payment screen, for loyalty points only.",
          ],
        },
        { t: "h2", id: "tables", text: "Table orders" },
        {
          t: "p",
          text: "With table service, a **Floor** screen shows tables as **Free**, **Seated**, **Food ready** and **Paid · clear**. Tap a free table to ring up its order as **Dine-in**, then choose **Open check (pay later)** at payment: the order goes to the kitchen and the check stays open until it is settled on the check screen. A manager adds tables in the back office.",
        },
        {
          t: "callout",
          tone: "note",
          text: "Table service is switched on for your account by the Moving team. If you don't see **Floor** in the navigation, message us.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I sell an item with an add-on, like extra sauce or an extra shot?",
              a: "Not at the POS yet; only the size is chosen. Write the request in the item note so the kitchen sees it — the note doesn't change the price.",
            },
            {
              q: "Why can't I remove the last item in the cart?",
              a: "So a cart in progress isn't emptied by mistake. Pay or hold the order, or ask an admin to choose **Clear cart empties everything** in Settings.",
            },
            {
              q: "Is the cart lost if the device shuts down?",
              a: "No, it stays on the same device for 12 hours. A held order is saved on the server and shows on the Kitchen screen of any device at the branch.",
            },
          ],
        },
      ],
      related: ["selling/take-payment", "selling/kitchen-display", "setup/build-your-menu", "integrations/delivery-apps"],
    },
    {
      slug: "discounts-and-coupons",
      title: "Apply discounts and coupons",
      summary:
        "A bill comes down at the POS only by a coupon code, an automatic offer or loyalty points. There is no manual discount, and a code never stacks with an offer.",
      keywords: ["discount", "coupon", "discount code", "promotion", "automatic offer", "loyalty points", "voucher", "redeem points", "خصم", "كوبون"],
      reviewed: "2026-10-27",
      before: [
        "The **Apply order discounts** permission to apply a code and spend points.",
        "An order in the cart, with the **Payment** screen open.",
      ],
      body: [
        {
          t: "p",
          text: "Every discount lives on the **Payment** screen; the cart shows the price before discounts. The POS has no percentage or amount-off button, no price override and no free-item control.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-register-pay-discounts",
            alt: "The POS payment screen: the loyalty points block, and the discount code field with the Apply and Browse offers buttons.",
            caption: "The discount code and loyalty points sit on the payment screen, above the payment methods.",
          },
        },
        { t: "h2", id: "coupon-codes", text: "Coupon codes" },
        {
          t: "steps",
          items: [
            {
              title: "Type or pick the code",
              body: "Type the code in **Enter discount code** and tap **Apply**, or tap **Browse offers** to list the branch's active coupons and pick one.",
            },
            {
              title: "Check the discount",
              body: "**Code applied** appears with the code and the amount off. To drop it, tap **Remove**.",
            },
          ],
        },
        {
          t: "table",
          head: ["Message", "What it means"],
          rows: [
            ["**That code is not valid.**", "No coupon has that code."],
            ["**This code has expired.**", "The coupon's dates have passed."],
            ["**This code has reached its usage limit.**", "The coupon has been used as many times as allowed."],
            ["**Order total is below this code's minimum.**", "Add items until the order reaches the minimum."],
            ["**This code is not valid at this branch.**", "The coupon is limited to other branches."],
          ],
        },
        {
          t: "p",
          text: "A coupon is a percentage or a fixed amount, and an **Admin** creates it in the back office under **Coupons**.",
        },
        { t: "h2", id: "automatic-offers", text: "Automatic offers" },
        {
          t: "p",
          text: "Offers apply on their own, with nothing for the cashier to choose: a percentage off a category, money off above a spend, or buy-X-get-Y, on set days, hours and branches. When the cart qualifies, **Offer applied** shows with the offer's name and amount. If you then apply a code, the offer is struck through with **A discount code replaces the running offer.** Offers are created under **Offers** in the back office.",
        },
        {
          t: "callout",
          tone: "note",
          text: "Automatic offers and loyalty points are switched on for your account by the Moving team. If you don't see them, message us.",
        },
        { t: "h2", id: "one-discount", text: "One discount, one source" },
        {
          t: "list",
          items: [
            "A typed code beats every automatic offer.",
            "Without a code, exactly one offer applies — the one worth most to the guest. Two offers never combine.",
            "Loyalty points are not a competing discount: they are spent on what is left after the code or offer.",
            "An open check keeps the offer it opened with, even if items are added after the offer ends.",
            "Orders from your ordering site take coupon codes only; automatic offers are for the POS alone.",
          ],
        },
        { t: "h2", id: "loyalty-points", text: "Loyalty points" },
        {
          t: "steps",
          items: [
            {
              title: "Enter the guest's number",
              body: "In **Loyalty points**, type the **Guest mobile number** and tap **Look up**. On Saudi accounts it takes a Saudi mobile number.",
            },
            {
              title: "Check the balance",
              body: "The guest's balance shows in points and what they are worth. If the number isn't registered yet, this order opens a new account for the guest and they start earning.",
            },
            {
              title: "Spend the points",
              body: "Tap the **Use … points** button, which shows the number of points and their value, to take off the most the programme allows in one go. To remove the number, tap **Clear**.",
            },
          ],
        },
        {
          t: "p",
          text: "The guest earns points on their number even if the cashier lacks the discount permission; spending them needs it. Details in [Points at the till](/docs/loyalty/points-at-the-till).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I give a guest a manual discount?",
              a: "No. Ask the back office to create a coupon under **Coupons**, then apply it by its code.",
            },
            {
              q: "Does a coupon code combine with a running offer?",
              a: "No. The code replaces the offer, so the order keeps one discount; loyalty points can still be spent on top.",
            },
            {
              q: "Why don't I see the discount code field?",
              a: "It shows only to people with the **Apply order discounts** permission, which **Admin**, **Branch manager** and **Cashier** have by default.",
            },
          ],
        },
      ],
      related: ["selling/take-payment", "loyalty/points-at-the-till", "loyalty/how-points-work", "reports/sales-reports"],
    },
    {
      slug: "take-payment",
      title: "Take payment for an order",
      summary:
        "On the payment screen, take cash, card on the branch terminal, Instapay, cash split with one other method, or a gift card for the whole bill, then confirm.",
      keywords: ["payment", "cash", "card terminal", "card", "Instapay", "split payment", "change due", "tender", "الدفع", "ماكينة الشبكة"],
      reviewed: "2026-10-27",
      before: ["An open shift in your name and an order in the cart — see [Take an order at the POS](/docs/selling/take-an-order)."],
      body: [
        {
          t: "p",
          text: "Tap **Pay** under the cart. The top of the screen shows the **Amount due** after discounts; the final amount is worked out by the server when you confirm.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-register-pay",
            alt: "The payment screen: the amount due at the top, the Cash, Card, Instapay and Split methods, a keypad for the amount tendered, and the Confirm payment button.",
            caption: "Confirm payment stays disabled until the amount tendered covers the amount due.",
          },
        },
        { t: "h2", id: "methods", text: "Payment methods" },
        {
          t: "table",
          head: ["Method", "What happens"],
          rows: [
            ["**Cash**", "The default. You enter the amount tendered and the POS works out the change."],
            ["**Card**", "You run the card on the branch's own terminal; the POS is not connected to it. You can type the transaction number in **Card terminal reference (optional)**."],
            ["**Instapay**", "The guest transfers the amount, and you can type the **Instapay transfer reference (optional)**."],
            ["**Split**", "A cash part, with the rest on card or Instapay."],
            ["**Gift card**", "A card whose balance covers the whole bill."],
          ],
        },
        { t: "h2", id: "cash", text: "Take cash" },
        {
          t: "steps",
          items: [
            {
              title: "Choose cash",
              body: "**Cash** is selected by default.",
            },
            {
              title: "Enter the amount tendered",
              body: "Key in **Tendered** on the keypad, or tap **Exact amount**, or the quick-amount buttons, which add to what is tendered.",
            },
            {
              title: "Check the change",
              body: "**Change due** shows in green, or **Remaining** in red while the amount is short, and **Confirm payment** stays disabled until it is enough.",
            },
            {
              title: "Confirm the payment",
              body: "Tap **Confirm payment**. The **Order created** screen shows the order number and the change; details in [Print receipts and read order numbers](/docs/selling/receipts-and-order-numbers).",
            },
          ],
        },
        { t: "h2", id: "split", text: "Split payment" },
        {
          t: "p",
          text: "Choose **Split**, key in the **Cash part** on the keypad, then pick card or Instapay under **Rest on the other method**. The cash part must be above zero and below the total. A split is always cash plus one other method: you can't split a bill across two cards, or combine a gift card with another method.",
        },
        { t: "h2", id: "gift-card", text: "Pay with a gift card" },
        {
          t: "p",
          text: "Choose **Gift card**, type the card code and tap **Check**. Its balance must cover the whole bill; if it is short, the missing amount shows and confirming stays disabled, so choose another method. A card that is expired, cancelled or empty shows **That card cannot be used.**",
        },
        {
          t: "callout",
          tone: "note",
          text: "Gift cards and table service are switched on for your account by the Moving team, and so is e-invoicing on Saudi accounts, which adds a **Tax invoice for a business** option for a buyer who needs an invoice in their company's name. If you don't see them, message us. Details in [Gift cards](/docs/selling/gift-cards) and [ZATCA e-invoicing](/docs/integrations/zatca-e-invoicing).",
        },
        { t: "h2", id: "not-at-the-till", text: "What the POS doesn't do" },
        {
          t: "list",
          items: [
            "No online card payment at the POS; [online payment](/docs/payments/online-payments) is for orders from your ordering site only.",
            "No link to the card terminal: the POS records the sale and its reference only, and you reconcile the terminal when you [close the shift](/docs/selling/close-the-shift).",
            "A table check is settled on the check screen by cash, card or Instapay only, with no split payment or gift card.",
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "What if the card is declined on the terminal?",
              a: "Don't tap **Confirm payment** before the terminal approves the transaction — the POS can't see its result. If it is declined, choose another method.",
            },
            {
              q: "Can a guest pay part with a gift card and the rest in cash?",
              a: "No. A gift card is accepted only when it covers the whole bill.",
            },
            {
              q: "I tapped Confirm payment and the connection dropped. Will the order be duplicated?",
              a: "No. Tap it again without changing the cart: the same order is re-sent and no second order is created. See [Handle an internet drop](/docs/selling/when-the-internet-drops).",
            },
          ],
        },
      ],
      related: ["selling/discounts-and-coupons", "selling/gift-cards", "selling/receipts-and-order-numbers", "selling/close-the-shift"],
    },
    {
      slug: "gift-cards",
      title: "Sell and accept gift cards",
      summary:
        "Sell a gift card for cash on the Gift cards screen, look up its balance and history, and accept it as payment when it covers the whole bill.",
      keywords: ["gift card", "sell a gift card", "card balance", "card code", "gift voucher", "stored value", "prepaid card", "بطاقة هدايا", "رصيد البطاقة"],
      reviewed: "2026-10-27",
      before: [
        "An open shift in your name to sell a card.",
        "The **Sell a gift card**, **Look a gift card up** and **Take a gift card as payment** permissions, which **Admin**, **Branch manager** and **Cashier** have by default.",
      ],
      body: [
        {
          t: "callout",
          tone: "note",
          text: "Gift cards are switched on for your account by the Moving team. If you don't see **Gift cards** in the navigation, message us.",
        },
        {
          t: "p",
          text: "A gift card is prepaid credit the guest carries as a code. Selling one is not a sale in the books: it creates no order and no VAT, but its cash goes into your shift's drawer and counts towards the expected cash at close. An order paid with the card is counted like any other order.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-register-gift-cards",
            alt: "The Gift cards screen: a form to sell a card with value and note fields, and a form to look a card up by its code.",
            caption: "Selling and looking up share one screen.",
          },
        },
        { t: "h2", id: "sell", text: "Sell a card" },
        {
          t: "steps",
          items: [
            {
              title: "Open Gift cards",
              body: "Tap **Gift cards** in the navigation and go to **Sell a card**.",
            },
            {
              title: "Enter the value",
              body: "Type a **Value** between `10` and `20,000` EGP (riyals on Saudi accounts), and add a **Note (optional)** such as the occasion or who it is for.",
            },
            {
              title: "Sell the card",
              body: "Tap **Sell the card**. **Card sold** appears with the code grouped in fours. Hand the code to the guest and take the cash.",
            },
          ],
        },
        {
          t: "list",
          items: [
            "Gift cards are sold for cash only.",
            "A card sold at the POS has no expiry date.",
            "The POS prints no card or receipt for it, so hand the code over yourself.",
          ],
        },
        { t: "h2", id: "look-up", text: "Look a card up" },
        {
          t: "p",
          text: "Under **Look a card up**, type the code and tap **Look up**. You see the **Balance**, the **Code**, the expiry date or **No expiry**, the card's state, and its **History** — **Loaded**, **Spent**, **Returned** and **Written off** — with order numbers.",
        },
        {
          t: "table",
          head: ["State", "Meaning"],
          rows: [
            ["**Active**", "It can be used to pay."],
            ["**Nothing left**", "Its whole balance has been spent."],
            ["**Expired**", "Its date has passed and it is refused."],
            ["**Cancelled**", "It was cancelled and is refused."],
          ],
        },
        { t: "h2", id: "pay-with-a-card", text: "Accept a card as payment" },
        {
          t: "p",
          text: "On the **Payment** screen choose **Gift card**, type the code and tap **Check**. The card is accepted only if its balance covers the whole bill; you can't pay part with it and part another way. If an order paid by gift card is cancelled, its amount goes back onto the card automatically.",
        },
        {
          t: "callout",
          tone: "note",
          text: "There is currently no screen to cancel a card, change its expiry date or see the total of unspent balances.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Can a gift card be sold by bank card?",
              a: "No. Gift cards are sold for cash only, because their value goes into the shift's drawer, which is counted at close.",
            },
            {
              q: "Does selling a card show in sales?",
              a: "No. Selling a card creates no order; its cash shows only in the shift's expected cash. The sale shows when an order is paid with it.",
            },
            {
              q: "The card balance is less than the bill. What now?",
              a: "Take payment another way; the POS doesn't accept a gift card that doesn't cover the whole bill.",
            },
          ],
        },
      ],
      related: ["selling/take-payment", "selling/close-the-shift", "selling/orders-cancellations-and-returns"],
    },
    {
      slug: "receipts-and-order-numbers",
      title: "Print receipts and read order numbers",
      summary:
        "After payment, the Order created screen shows the number and prints the receipt and kitchen ticket. Numbers start at #1 with every shift by default.",
      keywords: ["receipt", "print receipt", "reprint", "order number", "kitchen ticket", "80 mm paper", "thermal printer", "إيصال", "رقم الطلب", "تذكرة المطبخ"],
      reviewed: "2026-10-27",
      before: ["A receipt printer set up for the branch — see [Receipt printers](/docs/setup/receipt-printers)."],
      body: [
        {
          t: "p",
          text: "After **Confirm payment**, the **Order created** screen appears: the **Order number** in large type, the **Change due** for cash, and both parts of a split payment. Tapping outside doesn't close it; tap **New order** to clear the cart and start again.",
        },
        { t: "h2", id: "print", text: "Print the receipt and kitchen ticket" },
        {
          t: "list",
          items: [
            "Nothing prints automatically after a sale at the POS: tap **Print receipt** for the guest, and **Print kitchen ticket** if your kitchen works from paper.",
            "To reprint, open **Orders**, tap the order, then **Reprint receipt** or **Print kitchen ticket**.",
            "The POS app on the device prints straight to the branch printer. In a browser, the POS opens the print dialog with the message **This device is running in a browser, which cannot reach the branch printer — open the POS app to print receipts.**",
            "If the printer doesn't answer, the POS opens the print dialog instead and tells you why, for example **The printer did not respond — opened the print dialog instead.**",
          ],
        },
        {
          t: "shot",
          shot: {
            id: "pos-register-order-drawer",
            alt: "An order's details on the Orders screen: its status and items, with the Reprint receipt and Print kitchen ticket buttons.",
            caption: "Reprint any of today's receipts or tickets from the order's details.",
          },
        },
        { t: "h2", id: "receipt", text: "What the receipt prints" },
        {
          t: "p",
          text: "The receipt is laid out for 80 mm thermal paper; there is no 58 mm layout. From top to bottom it prints:",
        },
        {
          t: "list",
          items: [
            "The logo or business name, the branch name, the **Sales receipt** heading, the order number, the date and the order type.",
            "Each item with its quantity, price, line total and note, and **You saved** when the item has a compare-at price.",
            "**Subtotal**, **Discount** if any, **Total**, then **VAT included**.",
            "**Payment**, the amount tendered and the change for cash, the delivery app and its commission if any, then **Thank you for your visit**.",
          ],
        },
        {
          t: "p",
          text: "An Arabic receipt prints its headings in Arabic and English together; an English receipt prints English only. There is no digital receipt by email or WhatsApp.",
        },
        {
          t: "callout",
          tone: "note",
          text: "On Saudi accounts the Moving team switches on e-invoicing, and the receipt then prints as a **Simplified Tax Invoice** with the VAT number and the invoice QR code. If it isn't switched on for your account, message us. Details in [ZATCA e-invoicing](/docs/integrations/zatca-e-invoicing).",
        },
        { t: "h2", id: "kitchen-ticket", text: "The kitchen ticket" },
        {
          t: "p",
          text: "A **Kitchen ticket** carries the order number, type and channel, the guest's name if there is one, the prep time if the order was accepted with one, the items with their notes in double-height type, and **Total items** — no prices. Print it from **Order created**, from the **Kitchen** screen or from **Orders**. Automatic printing exists only for online orders, on one device on the [kitchen display](/docs/selling/kitchen-display). Tickets print on the branch's one printer; there are no separate kitchen-station printers.",
        },
        { t: "h2", id: "order-numbers", text: "Order numbers" },
        {
          t: "p",
          text: "Each branch has its own counter. The default format is `#1`, then `#2`, restarting with every shift. An **Admin** changes this in **Settings › Order numbering**: restart daily or never, and add the branch number or the date, giving a number such as `B01-001`. Changes apply to new orders only. Details in [Order numbering](/docs/branches/order-numbering).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why doesn't the receipt print automatically?",
              a: "The cashier decides whether to print after each sale. Tap **Print receipt** on **Order created**, or reprint later from **Orders**.",
            },
            {
              q: "Why did the order number go back to #1?",
              a: "Because the default numbering restarts with every shift. Ask an **Admin** to change it to daily or continuous in **Settings › Order numbering**.",
            },
            {
              q: "Can I send the receipt to the guest on WhatsApp?",
              a: "No, receipts are paper only for now.",
            },
          ],
        },
      ],
      related: ["setup/receipt-printers", "branches/order-numbering", "selling/kitchen-display", "selling/orders-cancellations-and-returns"],
    },
    {
      slug: "orders-cancellations-and-returns",
      title: "Follow orders, cancel them or record a return",
      summary:
        "The Orders screen lists today's orders. A cancellation takes an order out of sales and restores stock; a return logs the reason and waste. No cash goes out.",
      keywords: ["cancel order", "return", "refund", "void", "today's orders", "wasted ingredients", "partial refund", "إلغاء طلب", "مرتجع", "استرداد"],
      reviewed: "2026-10-27",
      before: ["The **Cancel / void orders** permission to cancel and **Manage order returns** to record a return; by default only **Admin** and **Branch manager** have them."],
      body: [
        {
          t: "p",
          text: "Open **Orders** from the navigation. It shows **Today's orders** at the branch, newest first: each order's number, time, type and status. Prices and payment methods show only if an admin switched on **Show prices and payment method on the Orders tab** in Settings.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-register-orders",
            alt: "Today's orders: the search-by-number field and the list of orders, each with its number, time, type and status.",
            caption: "Search here works by order number only.",
          },
        },
        {
          t: "list",
          items: [
            "Search by order number in **Search by order number…**; there are no status, type or date filters.",
            "The list doesn't update by itself; reopen the tab to see new orders and status changes.",
            "Tap an order to see **Order details**: its status, items and notes, with the print, cancel or return buttons.",
          ],
        },
        { t: "h2", id: "statuses", text: "Order statuses" },
        {
          t: "table",
          head: ["Status", "When you see it"],
          rows: [
            ["**Pending payment**", "An online order waiting for its online payment to complete."],
            ["**New**, then **Accepted**", "An order from your ordering site before preparation."],
            ["**Preparing**", "A POS order starts here directly, because it is already paid."],
            ["**Ready**", "Preparation is done."],
            ["**Out for delivery**, then **Delivered**", "A delivery order from your ordering site."],
            ["**Completed**", "The order was handed over and left the Kitchen screen."],
            ["**Cancelled**", "The order was cancelled."],
          ],
        },
        { t: "h2", id: "cancel", text: "Cancel an order" },
        {
          t: "p",
          text: "**Cancel order** shows while the order hasn't reached **Ready**, or while it is **Out for delivery**. Tap it, then **Confirm cancel?**. When you cancel:",
        },
        {
          t: "list",
          items: [
            "The order leaves sales and its ingredients go back into stock.",
            "Anything paid by gift card goes back onto the card automatically.",
            "Loyalty points the guest earned or spent on the order are reversed.",
            "No cash leaves the drawer by itself: a cancelled cash order stays in the shift's cash sales until you hand the money back and record it as a **Pay out** on **Shift**.",
            "An order paid online is refunded from your payment provider's own dashboard (Paymob or Moyasar), not from the POS.",
          ],
        },
        { t: "h2", id: "return", text: "Record a return" },
        {
          t: "p",
          text: "When cancelling is no longer possible — the order is **Ready** or **Completed**, or you lack the permission to cancel — **Return order** shows instead:",
        },
        {
          t: "steps",
          items: [
            {
              title: "Choose the reason",
              body: "Answer **Why is this order returned?** with **Order cancelled**, **Order mishandled**, **Wrong order**, **Customer complaint**, **Quality issue** or **Other**, add a **Description (optional)**, then tap **Next**.",
            },
            {
              title: "Record any wasted ingredients",
              body: "Answer **Any wasted materials for this order?**: choose **No** to record the return, or **Yes** to pick the wasted ingredients and quantities, then tap **Confirm return**.",
            },
          ],
        },
        {
          t: "callout",
          tone: "warning",
          text: "A return moves no money and doesn't put the sale's stock back: the sale stands, the reason is recorded, and the wasted ingredients you picked are written off as waste. The guest keeps their loyalty points. An order can be returned once, and a cancelled order can't be returned. If you hand cash back to the guest, record it as a **Pay out** on the shift.",
        },
        {
          t: "p",
          text: "There are no partial refunds and no way to cancel a single item from an order: a cancellation or a return covers the whole order.",
        },
        {
          t: "qa",
          items: [
            {
              q: "How do I give a guest part of their money back?",
              a: "The POS doesn't do partial refunds. Hand the amount back from the drawer and record it as a **Pay out** with the reason on **Shift**, so the drawer balances at close.",
            },
            {
              q: "Why don't I see the cancel button?",
              a: "It needs the **Cancel / void orders** permission, which **Admin** and **Branch manager** have by default, and it disappears once the order is **Ready**, except for delivery orders while **Out for delivery**.",
            },
            {
              q: "Does a cancelled order show on the shift report?",
              a: "Yes, the close report counts it under **Cancelled orders**.",
            },
          ],
        },
      ],
      related: ["selling/close-the-shift", "selling/receipts-and-order-numbers", "reports/orders-and-activity-log", "inventory/stock-per-branch"],
    },
    {
      slug: "close-the-shift",
      title: "Close the shift and print the Z-report",
      summary:
        "Count the drawer, add the card-terminal and Instapay totals if you wish, explain a large variance, then confirm the close and print the Z-report.",
      keywords: ["close shift", "Z report", "cash count", "variance", "shortage", "surplus", "end of day", "business day report", "إغلاق الوردية", "تقرير Z"],
      reviewed: "2026-10-27",
      before: ["The **Open & close shifts** permission, which cashiers have by default. Each person closes their own shift."],
      body: [
        {
          t: "p",
          text: "Closing a shift checks what is in the drawer against what the system expects, then saves the Z-report for that drawer. Open **Shift** and tap **Close shift**.",
        },
        { t: "h2", id: "count", text: "Count and close" },
        {
          t: "steps",
          items: [
            {
              title: "Count the cash",
              body: "Enter everything in the drawer in **Counted cash (EGP)**; this field is required.",
              shot: {
                id: "pos-register-close-shift",
                alt: "The close-shift form: counted cash, counted card terminal and counted Instapay fields, the variance reason, and the Confirm close button.",
                caption: "A blank card or Instapay box means not reconciled, not zero.",
              },
            },
            {
              title: "Enter card and Instapay if you wish",
              body: "In **Counted card terminal (EGP)**, enter what the terminal shows for this shift, and in **Counted Instapay (EGP)** the transfers received. A blank box means “not reconciled”, not zero.",
            },
            {
              title: "Give a reason for any variance",
              body: "**Reason for variance (optional)** becomes **Reason for variance (required)** when any method is off by more than the allowed limit, and it needs at least 5 characters. The back office is alerted to the variance.",
            },
            {
              title: "Confirm the close",
              body: "Tap **Confirm close**. The **Shift close report (Z)** appears.",
            },
          ],
        },
        {
          t: "p",
          text: "Online payments aren't counted in the drawer; their amount is shown for information only. On Saudi accounts these fields show the riyal instead.",
        },
        { t: "h2", id: "expected-cash", text: "Expected cash and variance" },
        {
          t: "p",
          text: "Expected cash = opening float + cash sales + cash taken for gift cards sold + pay-ins − pay-outs. The variance is counted minus expected: below zero is a **Shortage**, above zero a **Surplus**, and zero is **Balanced**. A cancelled cash order stays in cash sales until you record the refund as a **Pay out**.",
        },
        {
          t: "p",
          text: "By default the cashier counts without seeing the expected figure, so the close records what is really in the drawer. An **Admin** sets, under **Settings** in the back office:",
        },
        {
          t: "list",
          items: [
            "**Show the cashier the expected cash while counting**: off by default.",
            "**Large variance — amount (EGP)** and **Large variance — share of expected (%)**: `200` EGP by default, with the percentage off. Whichever trips first makes the cashier give a reason and raises an alert in the back office.",
          ],
        },
        { t: "h2", id: "z-report", text: "The Z-report" },
        {
          t: "p",
          text: "The report shows the range of order numbers, **Gross sales** and **Net revenue** (after delivery-app commission), the variance line, then the opening float, cash, card, Instapay and online sales, pay-ins and pay-outs, expected and counted cash, **Order count**, **Cancelled orders** and **Total discounts**, a delivery-app breakdown, and charts of sales by hour and the payment mix. **How this shift compares** sets your figures against the branch's recent closes.",
        },
        {
          t: "list",
          items: [
            "The report does not print by itself: tap **Print report** to print it on the branch printer, or from the print dialog if the branch has none, it does not answer, or the device runs in a browser.",
            "Tap **New shift** if you are starting your next shift.",
            "The Z-report has no VAT line.",
            "Print the report before you leave the screen: the POS does not reopen a closed shift's report, and past reports are in the back office.",
          ],
        },
        { t: "h2", id: "who-closes", text: "Who closes a shift, and can it be reopened?" },
        {
          t: "list",
          items: [
            "Each cashier closes only their own shift, and the **Shift** screen shows them only their own.",
            "A closed shift cannot be reopened and its counted figures cannot be edited, so check the count before **Confirm close**. To keep selling, open a **New shift**.",
            "If someone leaves without closing their shift, an **Admin** opens **Business days** in the back office, chooses **Force close** for the day and gives a reason (5 to 500 characters). That closes the day and every shift still open at the branch; those drawers are recorded as uncounted, never as zero, and the reason goes to the activity log.",
          ],
        },
        { t: "h2", id: "end-the-day", text: "End the business day" },
        {
          t: "p",
          text: "Once every shift at the branch is closed, **End day** shows to anyone without an open shift. Tap it, then **Confirm end day**, to see the **Business day report** with the day's shifts added up; print it or tap **Done**. The day can't end while any shift at the branch is still open.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why can't I see the expected cash while counting?",
              a: "Counting is blind by default, so the close records what is really in the drawer. An **Admin** can show it in **Settings**.",
            },
            {
              q: "Why doesn't the End day button show?",
              a: "It shows only when you have no open shift, and the day can't end while any shift at the branch is still open.",
            },
            {
              q: "Where do I find past shift reports?",
              a: "In the back office; see [Shifts and Z-reports](/docs/reports/shifts-and-z-reports).",
            },
          ],
        },
      ],
      related: ["selling/sign-in-and-open-a-shift", "reports/shifts-and-z-reports", "branches/business-days", "selling/orders-cancellations-and-returns"],
    },
    {
      slug: "kitchen-display",
      title: "Follow orders on the kitchen display",
      summary:
        "The kitchen display shows the branch's active orders in columns, colours tickets by waiting time and chimes for new ones. Move each order a step at a time.",
      keywords: ["kitchen display", "KDS", "kitchen screen", "accept order", "prep time", "order chime", "auto-print", "ticket timer", "شاشة المطبخ", "شاشة التحضير"],
      reviewed: "2026-10-27",
      before: ["The **Advance order status** permission, which every role that signs in to the POS has by default."],
      body: [
        {
          t: "p",
          text: "Open **Kitchen** from the navigation on the kitchen or bar device. The screen loads your branch's active orders and receives new ones as they arrive; it never shows other branches' orders. A **Barista** sees this screen only.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-register-kds",
            alt: "The Kitchen screen: On hold, New, Preparing and Ready columns, each with order tickets showing their timers, items and buttons.",
            caption: "The timer turns amber after 5 minutes and red after 10.",
          },
        },
        { t: "h2", id: "columns", text: "Columns and tickets" },
        {
          t: "table",
          head: ["Column", "What's in it"],
          rows: [
            ["**On hold**", "Carts held from the POS, not paid and not sent to the kitchen. Hidden from baristas."],
            ["**New**", "Orders from your ordering site before preparation. POS orders never pass through it."],
            ["**Preparing**", "POS orders arrive here directly, along with online orders once preparation starts."],
            ["**Ready**", "Orders that are ready, along with orders out for delivery."],
          ],
        },
        {
          t: "p",
          text: "Each column lists the oldest first. A ticket shows the order number, a minutes-and-seconds timer, the channel (**POS** or **Online**) and the order type, the items with their notes, the next-step button, and **Print kitchen ticket**. The timer stays neutral under 5 minutes, turns amber from 5:00 and red from 10:00; these limits are fixed.",
        },
        { t: "h2", id: "move-orders", text: "Move an order forward" },
        {
          t: "table",
          head: ["Status", "Button", "Moves it to"],
          rows: [
            ["**New**", "**Accept order**", "**Accepted**, with a prep time"],
            ["**Accepted**", "**Start preparing**", "**Preparing**"],
            ["**Preparing**", "**Order ready**", "**Ready**"],
            ["**Ready**", "**Complete order**", "**Completed**, and it leaves the screen"],
            ["**Ready** (delivery)", "**Out for delivery**", "**Out for delivery**"],
            ["**Out for delivery**", "**Delivered**", "**Delivered**, and it leaves the screen"],
          ],
        },
        {
          t: "p",
          text: "When you **Accept order**, choose a **Prep time (minutes)** of 10, 15, 20 or 30 (15 by default), then tap **Accept**. From the same window, **Reject order** and then **Confirm reject?** cancels the order, which needs the **Cancel / void orders** permission.",
        },
        {
          t: "callout",
          tone: "note",
          text: "A ticket can't be moved back a step and a completed order can't be brought back onto the screen. There are no order-type filters and no separate kitchen stations. Check before you tap.",
        },
        { t: "h2", id: "sound-and-printing", text: "Sound, printing and connection" },
        {
          t: "list",
          items: [
            "Every new order plays a chime. Browsers block sound until you touch the screen once after opening it, so tap it once. The **Sound on** / **Muted** button is remembered per device.",
            "**Auto-print on** makes this device print a kitchen ticket, once, for every online order that reaches its branch; POS orders never auto-print. Switch it on for one screen per branch, or tickets print twice.",
            "The **Live** or **Disconnected** badge shows the connection. When the connection comes back, the screen reloads every active order, so no order is lost.",
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Why can't I hear the new-order chime?",
              a: "Touch the screen once after opening it so the browser allows sound, and check the button reads **Sound on**.",
            },
            {
              q: "I tapped Complete order by mistake. How do I undo it?",
              a: "It can't be brought back onto the screen; statuses only move forward. The order still shows under **Orders** on the POS.",
            },
            {
              q: "Why don't POS orders show in the New column?",
              a: "They are already paid, so they start in **Preparing**. The **New** column is for orders from your ordering site waiting to be accepted.",
            },
          ],
        },
      ],
      related: ["selling/take-an-order", "selling/receipts-and-order-numbers", "online-ordering/online-orders-at-the-till", "getting-started/devices-and-apps"],
    },
    {
      slug: "when-the-internet-drops",
      title: "Handle an internet drop",
      summary:
        "No order is recorded without the server, but the cart stays on the device, a retry never duplicates an order, and the kitchen display catches up on reconnect.",
      keywords: ["internet down", "offline", "no connection", "connection lost", "duplicate order", "reconnect", "offline mode", "انقطاع الإنترنت", "بدون إنترنت"],
      reviewed: "2026-10-27",
      before: [],
      body: [
        {
          t: "p",
          text: "Every order rung up at the POS is sent to the server there and then, and there is no queue of orders on the device. So if the branch loses its connection, selling at the POS stops until the connection comes back.",
        },
        {
          t: "callout",
          tone: "warning",
          text: "Moving POS has no offline selling: orders, payments and shifts are not stored on the device to be sent later.",
        },
        { t: "h2", id: "what-survives", text: "What survives" },
        {
          t: "list",
          items: [
            "The cart: saved on the device for 12 hours, so it isn't lost if the page reloads or closes.",
            "Held orders: saved on the server, so they aren't lost if the device fails.",
            "An order being sent: the POS retries on its own three times over about 4 seconds; if that fails, an error message appears.",
            "The kitchen display: shows **Disconnected**, reconnects on its own, then reloads every active order.",
            "The POS app on iPad or Android: if the page can't load, it shows a retry screen and reloads on its own when the network returns.",
          ],
        },
        { t: "h2", id: "no-duplicates", text: "Retry without a duplicate order" },
        {
          t: "steps",
          items: [
            {
              title: "Leave the cart as it is",
              body: "Don't change the items, quantities or payment method.",
            },
            {
              title: "Tap Confirm payment again",
              body: "Once the connection is back, tap **Confirm payment**. Even after a page reload, and within 15 minutes, the POS re-sends the same order under the same key: if the server already created it, it answers with that order and doesn't create a second one.",
            },
            {
              title: "Check Orders if in doubt",
              body: "Open **Orders** and check the latest orders before ringing the order up again from scratch.",
            },
          ],
        },
        { t: "h2", id: "other-screens", text: "Other screens" },
        {
          t: "list",
          items: [
            "**Clock** needs a connection too; punches are not stored on the device.",
            "Printing runs over the branch's local network, not the internet, but it comes after the order is created. If the printer doesn't answer, the print dialog opens instead.",
            "Receiving deliveries is the one exception: marking a delivery arrived, counting it and commenting are saved on the device and sent by themselves, under your name, when the connection is back — see [Inventory transfers](/docs/inventory/inventory-transfers).",
            "On Saudi accounts: if ZATCA itself can't be reached, simplified invoices are still signed and printed, and reported when it is back. This is about the connection to ZATCA, not the POS's own connection.",
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "Inventory transfers and ZATCA e-invoicing are switched on for your account by the Moving team. If you don't see them, message us.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Does the POS work on the branch network without internet?",
              a: "No. The POS needs to reach the server to record any order.",
            },
            {
              q: "Will an order be duplicated if I tap Confirm payment twice?",
              a: "No, as long as you don't change the cart: the same order is re-sent, and the server answers with the first order if it already created it.",
            },
            {
              q: "Are kitchen display orders lost during a drop?",
              a: "No, only delayed. When the connection returns, the screen reloads every active order.",
            },
          ],
        },
      ],
      related: ["selling/take-payment", "selling/kitchen-display", "getting-started/devices-and-apps", "faq/pos-faq"],
    },
  ],
};
