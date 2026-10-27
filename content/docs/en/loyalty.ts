import type { DocCategory } from "../types";

/* Follows content/docs/ar/loyalty.ts article for article, block for block; the sources are listed there. */
export const loyalty: DocCategory = {
  id: "loyalty",
  group: "grow",
  icon: "loyalty",
  title: "Loyalty",
  description: "Points your guests earn on every order with their mobile number, and spend as a discount on their bill at the till.",
  articles: [
    {
      slug: "how-points-work",
      title: "How loyalty points work",
      summary:
        "Guests earn points for every pound in their order and spend them as a discount at the till only: the earn and spend rules, and the default values.",
      keywords: [
        "loyalty points",
        "نقاط الولاء",
        "rewards",
        "مكافآت",
        "points balance",
        "رصيد النقاط",
        "earn points",
        "كسب النقاط",
      ],
      reviewed: "2026-10-27",
      before: ["Loyalty points switched on for your account by the Moving team."],
      body: [
        {
          t: "p",
          text: "Loyalty points in Moving POS are tied to the guest's mobile number, not to a card or a password. A guest earns points on every order where their number is known, and spends them as a discount on their bill at the till.",
        },
        {
          t: "callout",
          tone: "note",
          text: "Loyalty points are switched on for your account by the Moving team. If you don't see the **Loyalty points** section on the till's Pay screen, message us.",
        },
        { t: "h2", id: "earning", text: "How guests earn points" },
        {
          t: "list",
          items: [
            "At the till: when staff type the guest's mobile number on the Pay screen. A new number opens an account for the guest with that same order.",
            "On your ordering site: on every order, because a phone number is required at checkout. An order paid by card earns its points once the payment is confirmed.",
            "From your Moving Stores store linked to the till: like any online order, it earns points and never spends them.",
          ],
        },
        {
          t: "p",
          text: "Points are counted on the items' value after every discount — the coupon, the promotion and any points spent on the same order — without the delivery fee, in whole pounds rounded down. So a guest never earns points on points they spent.",
        },
        { t: "h2", id: "default-values", text: "The default values" },
        {
          t: "table",
          head: ["Setting", "Default"],
          rows: [
            ["Earning", "One point for every `1` EGP"],
            ["Point value when spent", "`0.01` EGP, so `100` points are worth `1` EGP"],
            ["Smallest redemption", "`100` points"],
            ["Expiry", "Points never expire"],
          ],
        },
        {
          t: "p",
          text: "Example: an order whose items come to `245.50` EGP with a `20` EGP coupon earns `225` points, worth `2.25` EGP when spent.",
        },
        {
          t: "p",
          text: "There is no screen for these values in the back office: the Moving team sets them for your account. Message us to change the earn rate, the point value or the smallest redemption, or to give points an expiry in months. Saudi accounts count in riyals: one point per riyal, and a point is worth one halala.",
        },
        { t: "h2", id: "spending", text: "How points are spent" },
        {
          t: "list",
          items: [
            "At the till only, by a member of staff with the **Apply order discounts** permission. Your ordering site never spends points.",
            "Points are a discount on the bill, not a payment method, and VAT is worked out on the total after the discount.",
            "They are spent in whole points, never below the smallest redemption, never beyond what the items are still worth after a coupon or promotion, and never on the delivery fee.",
            "The till offers the most points that can go on the bill, to be spent in one go; you can't pick part of that amount.",
          ],
        },
        {
          t: "p",
          text: "The steps are in [use points at the till](/docs/loyalty/points-at-the-till).",
        },
        { t: "h2", id: "same-for-everyone", text: "The same values for every guest" },
        {
          t: "p",
          text: "Every guest earns and spends at the same values: what a guest earns is set by the order's value alone, and a point is worth the same to everyone when spent.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Where does a guest see their balance?",
              a: "In the **Your points** card on their order-tracking page on your ordering site: what they earned and spent on that order, and their balance with its rough value. At the till, staff read the balance when they look up the number. There is no public balance lookup by phone, points aren't printed on the receipt, and no SMS, WhatsApp or e-mail is sent about them.",
            },
            {
              q: "What happens to points when an order is cancelled or returned?",
              a: "Cancelling takes back the points the order earned and gives back any points spent on it. A return doesn't change points. If the guest already spent points from an order that is later cancelled, their balance can drop below zero until they earn again.",
            },
            {
              q: "Do points expire?",
              a: "No, unless the Moving team sets an expiry in months for your account. Then the oldest points expire first, and the guest's order page shows when their oldest points expire.",
            },
            {
              q: "Can I see a guest's points history or adjust their balance myself?",
              a: "No. The back office has no screen for a guest's points history or for adjusting a balance by hand. Message us if you need either.",
            },
          ],
        },
      ],
      related: [
        "loyalty/points-at-the-till",
        "selling/discounts-and-coupons",
        "journeys/customer-online-and-points",
        "faq/pos-faq",
      ],
    },
    {
      slug: "points-at-the-till",
      title: "Use points at the till",
      summary:
        "Look the guest up by mobile number on the Pay screen so they earn the order's points, or spend their balance as a discount on the same bill in one tap.",
      keywords: [
        "redeem points",
        "صرف النقاط",
        "Pay screen",
        "شاشة الدفع",
        "phone number",
        "رقم الموبايل",
        "points discount",
        "خصم النقاط",
        "till",
        "الكاشير",
      ],
      reviewed: "2026-10-27",
      before: [
        "Loyalty points switched on for your account by the Moving team.",
        "Signed in to the till with a shift open: [sign in and open a shift](/docs/selling/sign-in-and-open-a-shift).",
        "To spend points: the **Apply order discounts** permission, held by default by **Admin**, **Branch manager** and **Cashier**.",
      ],
      body: [
        {
          t: "p",
          text: "The **Loyalty points** section sits on the Pay screen, above the coupon. There you identify the guest by mobile number, so they earn the order's points automatically and can spend their balance if they want to.",
        },
        { t: "h2", id: "look-up-and-redeem", text: "Look up the guest and spend their points" },
        {
          t: "steps",
          items: [
            {
              title: "Add the items to the order, then tap **Pay**.",
              body: "The Pay screen opens with its **Loyalty points** section.",
              shot: {
                id: "pos-loyalty-pay-screen",
                alt: "The till's Pay screen, with the Loyalty points section — a guest mobile number field and a look-up button — above the coupon section.",
                caption: "The Loyalty points section is at the top of the Pay screen, before the coupon.",
              },
            },
            {
              title: "Type the number in **Guest mobile number** and tap **Look up**.",
              body: "The guest's balance shows in points with its value in pounds. If the number has no account, you see “No guest on that number — this order opens a new account.”",
            },
            {
              title: "To spend points, tap **Use … points**.",
              body: "The button carries the most points that can go on this bill and their value. Once tapped, the line **… paid with points** appears, with **Clear** to undo. If the balance isn't enough, you see “No points can be used on this bill.”",
            },
            {
              title: "Finish the payment as usual.",
              body: "The guest earns this order's points automatically when it is created, whether or not they spent any. See [take payment](/docs/selling/take-payment).",
            },
          ],
        },
        { t: "h2", id: "phone-numbers", text: "Mobile number format" },
        {
          t: "list",
          items: [
            "Egypt: an 11-digit number starting `010`, `011`, `012` or `015`.",
            "Saudi Arabia: a 10-digit number starting `05`. If you paste a number starting `+966`, the till turns it into the local form.",
          ],
        },
        {
          t: "p",
          text: "Saudi accounts also show the box “The guest agrees to receive offers by WhatsApp or SMS on this number (they can opt out anytime)” and the link **Privacy notice — show the guest**. The box only records consent: the system sends no marketing messages today.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why is there no button to spend points?",
              a: "Because the guest's balance is below the smallest redemption, the bill has nothing left to discount, or you don't hold the **Apply order discounts** permission.",
            },
            {
              q: "Can guests spend their points on the ordering site?",
              a: "No. They earn points on every online order, but points are spent at the till only. See [how loyalty points work](/docs/loyalty/how-points-work).",
            },
            {
              q: "Can I use points and a coupon on the same order?",
              a: "Yes. Points are spent on what the items are still worth after the coupon or promotion, down to zero.",
            },
            {
              q: "A message in English appeared when spending points. What does it mean?",
              a: "Some refusal messages come from the server in English, for example that the balance is too low, that the amount is below the smallest redemption, or that it is worth more than the order.",
            },
          ],
        },
      ],
      related: [
        "loyalty/how-points-work",
        "selling/take-payment",
        "selling/discounts-and-coupons",
      ],
    },
  ],
};
