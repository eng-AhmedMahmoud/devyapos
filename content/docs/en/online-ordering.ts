import type { DocCategory } from "../types";

/* Follows content/docs/ar/online-ordering.ts article for article, block for block; the sources are listed there. */
export const onlineOrdering: DocCategory = {
  id: "online-ordering",
  group: "daily",
  icon: "globe",
  title: "Online ordering",
  description: "Your restaurant's own ordering site, how its orders reach the till and the kitchen, and paying at the table.",
  articles: [
    {
      slug: "your-ordering-site",
      title: "Take orders on your ordering site",
      summary:
        "Your ordering site is a page in your restaurant's name where customers order for pickup or delivery, pay cash or by card, and follow their order.",
      keywords: ["ordering site", "online ordering", "pickup", "delivery", "coupon code", "card payment", "order tracking", "موقع الطلبات", "الطلب أونلاين", "web ordering"],
      reviewed: "2026-10-27",
      before: [
        "The Moving team sets up your ordering site with your account, in your restaurant's name and colours.",
        "At least one active branch, and a menu with prices in the back office.",
      ],
      body: [
        {
          t: "p",
          text: "Your ordering site is a web page your customers order from without installing anything. Branches, menu and prices come from the back office, and every order lands on the kitchen display of the branch the customer picked.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-ordering-home",
            alt: "The home page of a demo restaurant's ordering site: the restaurant's name at the top, then the list of branches for the customer to pick the nearest.",
            caption: "Every order starts with a branch; the menu and offers don't show before one is picked.",
          },
        },
        { t: "h2", id: "how-customers-order", text: "How customers order" },
        {
          t: "steps",
          items: [
            {
              title: "The customer picks a branch under **Choose your nearest branch**.",
              body: "The order is prepared at that branch, for pickup or delivery. Switching branch later empties the cart once the customer confirms.",
            },
            {
              title: "They browse the **Menu** and add items to the cart.",
              body: "Each size shows as its own card, at the chosen branch's price. The customer writes **Preparation notes (optional)**, sets the **Quantity** and taps **Add to cart**. Prices include VAT.",
            },
            { title: "They open **Your cart** and tap **Continue to checkout**." },
            {
              title: "They choose under **How would you like it?**: **Pickup from branch** or **Delivery**.",
              body: "For delivery they pick a **Delivery zone** from that branch's zones, which shows its fee, then write the **Full address**.",
            },
            {
              title: "They enter their **Full name** and **Phone number** and choose a **Payment** method.",
              body: "The site remembers the name and number on the customer's device for next time. Under **Add a note or promo code** they can add an order note, or a **Coupon code** followed by **Apply**.",
            },
            {
              title: "They check the **Order summary** and tap **Place order**.",
              body: "The order's tracking page opens with its number, and the customer shows that number at the counter when collecting.",
            },
          ],
        },
        { t: "h2", id: "payment-and-discounts", text: "Payment and discounts" },
        {
          t: "list",
          items: [
            "**Cash on pickup/delivery** is always available, for pickup and delivery.",
            "**Card (pay now)** only appears once the Moving team has connected an online payment gateway to your account: Paymob in Egypt, Moyasar in Saudi Arabia. More in [Online payments](/docs/payments/online-payments).",
            "With a card, the customer goes to a secure payment page and comes back to their order page. The order does not reach the kitchen until the payment is confirmed; until then the page shows **Waiting for payment** and a **Retry payment** button.",
            "The only discount on the ordering site is a coupon code. Automatic offers don't apply online, and loyalty points are spent at the till only.",
          ],
        },
        { t: "h2", id: "tracking", text: "Following the order" },
        {
          t: "p",
          text: "The order page shows its status step by step: **Order received**, then **Order accepted** with the estimated prep time, then **Being prepared**, then **Ready for pickup** or **On its way to you**. If the order is cancelled it shows **We are sorry — your order was cancelled** with the branch's phone. The page refreshes itself about every 5 seconds, and the customer gets no notification by text message, WhatsApp or email.",
        },
        { t: "h2", id: "limits", text: "What the site does not do" },
        {
          t: "list",
          items: [
            "No add-ons or options on an item, such as extra sugar or sauces; sizes only.",
            "No minimum order. The only minimum is a coupon code's own, if it has one.",
            "No opening-hours check: the site takes orders at any hour, and the hours are shown for information only.",
            "No scheduled orders and no \"order for later\"; every order is for now.",
            "No auto-accept: branch staff accept each order themselves on the kitchen display.",
            "No rider dispatch; your team arranges the delivery itself.",
            "No ordering over WhatsApp: the **Chat on WhatsApp** button opens a chat for questions only, and shows when the branch or the restaurant has a WhatsApp number.",
          ],
        },
        {
          t: "callout",
          tone: "tip",
          text: "Because the site takes orders at any hour, keep the kitchen display open throughout opening hours. If an order arrives that you can't prepare, reject it: it is cancelled and the customer sees so on their order page.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why doesn't card payment show?",
              a: "It appears once the Moving team has connected an online payment gateway to your account. Message us to switch it on.",
            },
            {
              q: "Can I pause my ordering site for a while?",
              a: "There is no switch to pause the ordering site. Reject the orders you can't prepare from the kitchen display.",
            },
            {
              q: "Do customers see their branch's prices?",
              a: "Yes. The menu page shows the prices of the branch the customer picked, and the order is charged at them. More in [Branch prices and availability](/docs/branches/branch-prices-and-availability).",
            },
            {
              q: "How do I create a coupon code?",
              a: "From **Catalogue › Coupons** in the back office. More in [Discounts and coupon codes](/docs/selling/discounts-and-coupons).",
            },
          ],
        },
      ],
      related: [
        "online-ordering/online-orders-at-the-till",
        "branches/delivery-zones",
        "payments/online-payments",
        "selling/discounts-and-coupons",
      ],
    },
    {
      slug: "online-orders-at-the-till",
      title: "Accept online orders at the branch",
      summary:
        "An ordering-site order reaches the branch's kitchen display with a chime and waits until staff accept it and set a prep time. Accepting, rejecting and after.",
      keywords: ["online orders", "accept order", "reject order", "kitchen display", "KDS", "prep time", "auto-print", "طلبات الأونلاين", "قبول الطلب", "web orders"],
      reviewed: "2026-10-27",
      before: [
        "The kitchen display is open at the branch on a device connected to the internet.",
        "The **Advance order status** permission, which every role has by default.",
      ],
      body: [
        {
          t: "p",
          text: "Ordering-site orders don't go through the till. They land straight in the **New** column of the kitchen display at the branch the customer picked, with a chime, and carry an **Online** badge instead of **POS**. A card order does not appear until its payment is confirmed.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-online-kds",
            alt: "The kitchen display with New, Preparing and Ready columns; each card shows the order number, the time elapsed, the channel badge, the order type and the next-step button.",
            caption: "An online order starts in the New column with an Online badge, and its first button is Accept order.",
          },
        },
        { t: "h2", id: "accept-or-reject", text: "Accept or reject the order" },
        {
          t: "steps",
          items: [
            {
              title: "In the POS, open **Kitchen**.",
              body: "Keep **Sound on** so the device chimes for every new order. The browser needs one tap on the screen before it allows sound.",
            },
            { title: "Tap **Accept order** on the new order's card." },
            {
              title: "Choose the **Prep time (minutes)**: 10, 15, 20 or 30.",
              body: "The default is 15. The customer sees it on their order page. The same window also lets you **Print kitchen ticket**.",
            },
            {
              title: "Tap **Accept**.",
              body: "Or tap **Reject order**, then **Confirm reject?**, to cancel it; the customer sees that the order was cancelled, with the branch's phone.",
            },
          ],
        },
        { t: "h2", id: "prepare-and-hand-over", text: "Prepare and hand over the order" },
        {
          t: "p",
          text: "Once accepted, the order moves on with one button on its card: **Start preparing**, then **Order ready**. For pickup, tap **Complete order** when you hand it over. For delivery, tap **Out for delivery** when it leaves, then **Delivered** when it arrives. The two delivery buttons are also on the POS **Orders** screen.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-online-today-orders",
            alt: "Today's orders screen in the POS: the branch's orders, each with its number, status and total.",
            caption: "Online orders show here too, and those paid by card carry the payment method Online payment.",
          },
        },
        {
          t: "table",
          head: ["What staff see", "What the customer sees on their order page"],
          rows: [
            ["**New**", "**Order received**"],
            ["**Accepted**", "**Order accepted**"],
            ["**Preparing**", "**Being prepared**"],
            ["**Ready**", "**Ready for pickup** or **Ready to go**"],
            ["**Out for delivery**", "**On its way to you**"],
            ["**Completed** or **Delivered**", "**Picked up — enjoy!** or **Delivered — enjoy!**"],
            ["**Cancelled**", "**We are sorry — your order was cancelled**"],
          ],
        },
        { t: "h2", id: "auto-print", text: "Print online tickets automatically" },
        {
          t: "p",
          text: "Nobody stands at the till to print an online order's ticket, so the kitchen display can print it by itself the moment the order arrives. Tap **Auto-print off** at the top of the screen so it reads **Auto-print on** on this device. Turn it on for one device per branch only, or the ticket prints once on every device. Till orders are not auto-printed, because they print from the payment screen.",
        },
        {
          t: "callout",
          tone: "note",
          text: "The ticket goes to the branch printer. Printing straight to the printer needs the POS app on the device; a browser opens the print dialog instead. More in [Receipt printers](/docs/setup/receipt-printers).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Can online orders be accepted automatically?",
              a: "No. A branch staff member accepts each ordering-site order and sets its prep time.",
            },
            {
              q: "The customer paid by card, so why hasn't the order appeared?",
              a: "The order reaches the kitchen once the payment gateway confirms the payment. If the payment wasn't completed, the order stays pending payment and never reaches the kitchen.",
            },
            {
              q: "How do I cancel an online order after accepting it?",
              a: "From the POS **Orders** screen with **Cancel order**, as long as it isn't **Ready** yet. This needs the **Cancel / void orders** permission. More in [Orders, cancellations and returns](/docs/selling/orders-cancellations-and-returns).",
            },
          ],
        },
      ],
      related: [
        "online-ordering/your-ordering-site",
        "selling/kitchen-display",
        "selling/orders-cancellations-and-returns",
        "setup/receipt-printers",
      ],
    },
    {
      slug: "pay-at-the-table",
      title: "Let guests pay at the table",
      summary:
        "A guest scans the QR card on their table and pays their open check, in full or their share, by card from their phone. The code is for paying, not ordering.",
      keywords: ["pay at table", "table QR", "QR code", "table cards", "pay the check", "الدفع من الطاولة", "كود QR", "contactless payment"],
      reviewed: "2026-10-27",
      before: [
        "The Moving team switches on tables and pay at the table for your account.",
        "An online payment gateway connected to your account; without it guests see that card payment isn't available.",
        "The **Table QR codes** permission, which by default the **Admin** and **Branch manager** roles have.",
      ],
      body: [
        {
          t: "p",
          text: "Pay at the table cuts the wait for the bill: the guest orders from the waiter as usual and, when done, scans the card on their table to see their check and pay it from their phone. The code does not open a menu to order from; ordering stays with the waiter and the till.",
        },
        {
          t: "callout",
          tone: "note",
          text: "The Moving team switches this feature on for your account. If you don't see **QR codes** on the **Floor** screen, message us.",
        },
        { t: "h2", id: "table-cards", text: "Print the table cards" },
        {
          t: "steps",
          items: [
            {
              title: "In the POS, open **Floor** and tap **QR codes**.",
              shot: {
                id: "pos-table-cards",
                alt: "The table cards screen: one card per table with a QR code and the words Scan to pay, with buttons to issue the missing cards and print the sheet.",
                caption: "Print the sheet and put each card on its table.",
              },
            },
            {
              title: "Tap **Issue the missing cards**.",
              body: "This issues a card for every table that doesn't have one yet.",
            },
            {
              title: "Tap **Print the sheet** and put each card on its table.",
              body: "Each card carries a QR code and the words **Scan to pay**.",
            },
          ],
        },
        {
          t: "p",
          text: "If a card is lost or someone photographs it, tap **Reprint** on its table. Reprinting invalidates the old card and ends any guest session open on it, so print the new card and put it in place.",
        },
        { t: "h2", id: "what-guests-see", text: "What guests see" },
        {
          t: "list",
          items: [
            "**Your table** with the table number and branch, the items under **On your check**, and the amount **Still to pay**.",
            "A **Pay the check** button for the full amount. If the check was split between guests at the till, each guest pays their share with **Pay guest**.",
            "After paying, **Paid — thank you** appears.",
            "If the table's orders haven't been rung up yet, **Nothing to pay yet** appears. If more than one check is open on the table, **More than one check is open here** appears, and the waiter settles it at the till.",
            "A guest session ends after 3 hours; **This session has ended** appears and the guest scans the card again.",
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Can guests order from the code?",
              a: "No. The code opens the table's check for paying only; ordering stays with the waiter and the till.",
            },
            {
              q: "Can guests pay cash from their phone?",
              a: "No. Paying at the table is by card only, through the online payment gateway connected to your account. Cash is paid at the till as usual.",
            },
            {
              q: "A message says no storefront URL is configured. What do I do?",
              a: "The card's link needs your ordering site's address, which the Moving team sets. Message us.",
            },
          ],
        },
      ],
      related: [
        "online-ordering/your-ordering-site",
        "selling/take-payment",
        "payments/online-payments",
      ],
    },
  ],
};
