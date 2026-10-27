import type { DocCategory } from "../types";

/* Follows content/docs/ar/reports.ts article for article, block for block; the sources are listed there. */
export const reports: DocCategory = {
  id: "reports",
  group: "grow",
  icon: "report",
  title: "Reports",
  description: "Sales, item, shift and food-cost reports, and how to export them.",
  articles: [
    {
      slug: "back-office-dashboard",
      title: "Read the dashboard",
      summary:
        "The back office's first page: the current business day's sales and orders, the alerts that need action and each branch's figures, refreshed every 30 seconds.",
      keywords: [
        "dashboard",
        "home",
        "today's sales",
        "alerts",
        "per branch",
        "demand forecast",
        "لوحة المتابعة",
        "التنبيهات",
        "مبيعات اليوم",
      ],
      reviewed: "2026-10-27",
      before: [
        "The **View reports** or **Manage menu & catalog** permission. The Admin and Branch manager roles hold the first by default.",
      ],
      body: [
        {
          t: "p",
          text: "The **Dashboard** shows the current business day only; there is no date to pick. For other days and periods, use [Sales reports](/docs/reports/sales-reports).",
        },
        { t: "h2", id: "open-the-dashboard", text: "Open the dashboard" },
        {
          t: "steps",
          items: [
            {
              title: "From the sidebar, open **Today › Dashboard**.",
              body: "The figures refresh themselves every `30` seconds while the page is on screen, and the time of the last refresh shows next to **Updated**.",
              shot: {
                id: "pos-reports-dashboard",
                alt: "The back office's dashboard: today's revenue, orders and average order, the alerts strip, sales by channel and payment method, and the per-branch table.",
                caption: "The alerts strip gathers what needs action; each item is a link.",
              },
            },
          ],
        },
        {
          t: "p",
          text: "An admin sees the total for every branch and the **Per branch** table; a branch manager sees their own branch only. Test branches are left out of the total.",
        },
        { t: "h2", id: "todays-figures", text: "Today's figures" },
        {
          t: "list",
          items: [
            "**Revenue today**, **Orders** and **Avg order**.",
            "**By channel**: **POS** or **Online**.",
            "**By payment method**, such as **Cash**, **Card terminal**, **Instapay**, **Gift card** and **Online payment**.",
            "**Per branch**, for admins: each branch's revenue, orders, average order and number of low ingredients.",
          ],
        },
        {
          t: "p",
          text: "Today here means the business day: orders from the current business day's shifts, plus online orders dated today. If the business day was opened yesterday and hasn't been closed, its orders count towards yesterday and don't show here.",
        },
        { t: "h2", id: "alerts", text: "Alerts" },
        {
          t: "p",
          text: "The **Alerts** strip gathers what needs action, and each item opens its page:",
        },
        {
          t: "list",
          items: [
            "**low-stock items**.",
            "**refunds due**: paid orders that were cancelled and whose money must still be handed back to the guest.",
            "**business day still open** for longer than the time set in Settings, `24` hours by default.",
            "**large cash variance** at a shift close in the last `24` hours, with details on the **Large variances (last 24h)** card.",
            "**transfers need you**, when transfers are switched on.",
            "**branch printers changed from a till**.",
          ],
        },
        {
          t: "p",
          text: "When nothing needs action, the strip shows **No alerts — all clear.**",
        },
        { t: "h2", id: "insights", text: "Insights" },
        {
          t: "p",
          text: "For admins and branch managers by default, the **Insights** panel shows a **Demand forecast** built from your past sales, and **Menu costing** flags for each item: **Underpriced**, **Wide margin**, **No recipe yet** or **Healthy**. The flags come from your recipes and costs, so complete those first in [Ingredients and recipes](/docs/inventory/ingredients-and-recipes).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why can't a warehouse keeper see the dashboard figures?",
              a: "The dashboard needs **View reports** or **Manage menu & catalog**, and the Warehouse keeper role holds neither by default. Grant one on the Permissions page if they need it.",
            },
            {
              q: "Why don't last night's sales show in today's figures?",
              a: "They count towards the business day the branch opened them in. End the business day when trading ends, and the next day starts with its own figures. See [Business days](/docs/branches/business-days).",
            },
            {
              q: "Can I pick another date on the dashboard?",
              a: "No. The dashboard is for today only; for any other day, use the **Daily** tab on the Reports page.",
            },
          ],
        },
      ],
      related: [
        "reports/sales-reports",
        "reports/shifts-and-z-reports",
        "getting-started/back-office-tour",
        "branches/business-days",
      ],
    },
    {
      slug: "sales-reports",
      title: "Use and export your reports",
      summary:
        "The Reports page holds daily and monthly sales, best sellers, ingredient usage, food cost, returns and profit and loss, each downloadable as a CSV file.",
      keywords: [
        "reports",
        "sales report",
        "best sellers",
        "food cost",
        "profit and loss",
        "CSV export",
        "التقارير",
        "تقرير المبيعات",
        "الأرباح والخسائر",
        "تصدير",
      ],
      reviewed: "2026-10-27",
      before: [
        "The **View reports** permission, held by the Admin and Branch manager roles by default. Someone with only **Manage menu & catalog** sees every report except **Profit & loss**.",
      ],
      body: [
        {
          t: "p",
          text: "Open **Business › Reports**. An admin picks a branch or all branches; a branch manager sees their own branch only.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-reports-daily",
            alt: "The back office's Reports page on the Daily tab: the date and branch pickers, revenue, orders, average order and cancelled, and the breakdowns by channel and payment method.",
            caption: "The tabs run along the top, and every tab has a Download CSV button.",
          },
        },
        { t: "h2", id: "tabs", text: "The tabs" },
        {
          t: "table",
          head: ["Tab", "What it shows"],
          rows: [
            [
              "**Daily**",
              "For one day: **Revenue**, **Orders**, **Avg order**, **Cancelled**, **Refund due**, **Discount**, **Delivery commission** and **Coupon uses**, then the breakdowns **By channel**, **By payment method**, **By status**, **By delivery app** and **By coupon**.",
            ],
            ["**Monthly**", "The same figures for a whole month, with a **By day** table."],
            ["**Product mix**", "Best sellers over a period: **Qty sold** and **Revenue** for each product and size."],
            [
              "**Ingredient usage**",
              "For each ingredient at a branch or warehouse: **Used**, **Purchased**, **Waste**, **Adjusted**, **Transferred in**, **Transferred out** and **Transfer losses**.",
            ],
            [
              "**Food cost**",
              "For each product: **Price**, **Ingredient cost**, **Margin** and **Margin %**. The **Check coverage** button shows whether your recipes cover what you sold in the last `30` days.",
            ],
            ["**Returns**", "Returned orders with the **Reason**, **Description**, **Waste value**, **Order total** and who recorded them."],
            [
              "**Profit & loss**",
              "An income statement for the period and branch, from **Gross sales** down to **Operating profit**, compared with the previous period, with a **Branch comparison** chart. The period can be `93` days at most.",
            ],
          ],
        },
        {
          t: "shot",
          shot: {
            id: "pos-reports-profit-loss",
            alt: "The Profit & loss tab: the period and branch pickers, tiles for net sales, gross profit and operating profit, and the statement from gross sales down to operating profit.",
            caption: "Each line shows its status: Recorded, Estimated or Not tracked here.",
          },
        },
        { t: "h2", id: "how-figures-count", text: "How the figures are counted" },
        {
          t: "list",
          items: [
            "Revenue includes VAT. The **Daily** and **Monthly** tabs don't separate it; the **VAT collected** line appears in **Profit & loss** only.",
            "A cancelled order counts under **Cancelled** and stays out of revenue. An order still waiting for online payment is in no report.",
            "An order rung on a shift counts towards the business day the shift was opened in, even after midnight. An online order counts on its calendar day.",
            "**Food cost** uses each product's main price, not branch prices, and recipes and costs are the same in every branch.",
            "In **Profit & loss**, margins are hidden rather than guessed when recipe coverage is low; follow it on the **How complete is the cost of goods** bar.",
          ],
        },
        { t: "h2", id: "download", text: "Download a report" },
        {
          t: "p",
          text: "Click **Download CSV** on any tab. The file is made for accounting software: its column headings are in English and amounts are in piastres (`1250` means `12.50` EGP), or halalas on Saudi accounts.",
        },
        {
          t: "callout",
          tone: "note",
          text: "The back office has no PDF export and no printing, no peak-hours or per-cashier sales report, and no scheduled reports. The shift report and the business day report print from the POS; see [Shifts and Z-reports](/docs/reports/shifts-and-z-reports).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Where can I see sales of each size in each branch?",
              a: "In **Catalogue › Menu**, open the **Modifiers & Sizes** tab, then **Sales Analysis**. It shows **Total Units Sold**, **Total Revenue** and **Branch Sales**, with a **Download CSV** button.",
            },
            {
              q: "Why can't I see the Profit & loss tab?",
              a: "Only people with the **View reports** permission see it.",
            },
            {
              q: "Where do I find the VAT collected?",
              a: "On the **Profit & loss** tab, and in its CSV file.",
            },
            {
              q: "Can I see why returned orders came back?",
              a: "On the **Returns** tab, tap **Group into themes** under **Why these came back**: the range's returns are grouped by what went wrong. The counts are computed and the grouping is AI-written, so if AI isn't switched on for your account you see the figures alone.",
            },
          ],
        },
      ],
      related: [
        "reports/back-office-dashboard",
        "reports/orders-and-activity-log",
        "inventory/ingredients-and-recipes",
        "inventory/inventory-analytics",
      ],
    },
    {
      slug: "shifts-and-z-reports",
      title: "Review shifts and Z-reports",
      summary:
        "The Z-report shows and prints on the POS as each shift closes; the back office's Shifts page lists every shift's expected cash, counted cash and variance.",
      keywords: [
        "Z-report",
        "Z report",
        "close shift",
        "shifts",
        "cash variance",
        "drawer shortage",
        "business day report",
        "تقرير Z",
        "إغلاق الوردية",
      ],
      reviewed: "2026-10-27",
      before: [
        "For the Shifts page: the **View shift history** permission, held by the Admin and Branch manager roles by default.",
      ],
      body: [
        {
          t: "p",
          text: "A business day runs from opening to close at a branch, and each cash drawer in it is a shift. When a shift closes, the POS produces the **Shift close report (Z)**, and the back office gathers every shift on one page so you can review the variances.",
        },
        { t: "h2", id: "z-report", text: "The Z-report on the POS" },
        {
          t: "steps",
          items: [
            {
              title: "The cashier closes their shift, enters the counted cash and taps **Confirm close**.",
              body: "The full steps are in [Close the shift](/docs/selling/close-the-shift).",
            },
            {
              title: "The report appears on screen. Tap **Print report**.",
              body: "It prints on the branch printer from the POS app, or through the browser's print dialog.",
            },
          ],
        },
        {
          t: "list",
          items: [
            "The range of order numbers, gross sales, and net revenue after delivery-app commission.",
            "The opening float, sales by payment method, pay-ins and pay-outs.",
            "Expected cash, counted cash and the variance, with the reason if one was given.",
            "The order count, cancelled orders, discounts, coupon redemptions and a breakdown by delivery app.",
          ],
        },
        {
          t: "callout",
          tone: "warning",
          text: "Print the report at the close: the back office does not show or print a past shift's Z-report. The report has no VAT line.",
        },
        { t: "h2", id: "day-report", text: "The business day report" },
        {
          t: "p",
          text: "Once every shift at the branch is closed, the business day is ended with **End day** on the POS, and the **Business day report** appears, adding up every shift of the day. It prints the same way. Details in [Business days](/docs/branches/business-days).",
        },
        { t: "h2", id: "shifts-page", text: "The Shifts page in the back office" },
        {
          t: "steps",
          items: [
            {
              title: "From the sidebar, open **Today › Shifts**.",
              shot: {
                id: "pos-reports-shifts",
                alt: "The back office's Shifts page: a table with branch, opened by, opened and closed times, orders, float, expected, counted and variance.",
                caption: "A negative variance means cash is missing from the drawer.",
              },
            },
            {
              title: "Choose the branch and the date.",
              body: "An admin picks a branch or all branches; a branch manager sees their own branch.",
            },
          ],
        },
        {
          t: "table",
          head: ["Column", "What it means"],
          rows: [
            ["**Expected**", "Float plus cash taken and pay-ins, minus pay-outs: what the drawer should hold."],
            ["**Counted**", "What the cashier counted at the close."],
            ["**Variance**", "Counted minus expected; below zero means cash is missing from the drawer."],
            ["**Card ±** and **Instapay ±**", "The card terminal and Instapay variances, or a dash when the cashier didn't enter a count for them."],
            ["**Flagged / reason**", "Shifts whose variance went over the allowed limit, and the reason the cashier gave."],
          ],
        },
        {
          t: "p",
          text: "A shift that is still open shows **OPEN** in the **Closed** column. The page is for review only: it has no export and no printing.",
        },
        {
          t: "callout",
          tone: "tip",
          text: "A large variance also shows in the [dashboard](/docs/reports/back-office-dashboard) alerts. The limit is `200` EGP by default, and an admin can change it in Settings.",
        },
        {
          t: "qa",
          items: [
            {
              q: "What is the difference between the Z-report and the business day report?",
              a: "The Z-report covers one shift's drawer; the business day report adds up every shift of the day at the branch.",
            },
            {
              q: "Can I print a Z-report from the back office?",
              a: "No. It prints from the POS when the shift closes; the back office's Shifts page is for review only.",
            },
            {
              q: "Why is there no tax line on the Z-report?",
              a: "The report doesn't separate tax. You'll find **VAT collected** on the **Profit & loss** tab in [Reports](/docs/reports/sales-reports).",
            },
          ],
        },
      ],
      related: [
        "selling/close-the-shift",
        "branches/business-days",
        "reports/back-office-dashboard",
        "reports/sales-reports",
      ],
    },
    {
      slug: "orders-and-activity-log",
      title: "Track orders and the activity log",
      summary:
        "The Orders page lists every branch's and channel's orders with details and exports them; the Activity page records who did what, from cancels to sign-ins.",
      keywords: [
        "orders",
        "order history",
        "activity",
        "audit log",
        "cancel an order",
        "export orders",
        "الطلبات",
        "سجل النشاط",
        "سجل التدقيق",
      ],
      reviewed: "2026-10-27",
      before: [
        "For the Activity page: the **View audit log** permission. To cancel an order: **Cancel / void orders**. The Admin and Branch manager roles hold both by default.",
      ],
      body: [
        { t: "h2", id: "orders", text: "The Orders page" },
        {
          t: "steps",
          items: [
            {
              title: "From the sidebar, open **Today › Orders**.",
              shot: {
                id: "pos-reports-orders",
                alt: "The back office's Orders page: status, date and branch filters, and a table with number, time, branch, channel, type, status, payment and total.",
                caption: "Click any row to open the order's details.",
              },
            },
            {
              title: "Filter the list by status, date and branch.",
              body: "To come back to a set of filters you use often, save it under a name from **Saved views** with **Save view**.",
            },
            {
              title: "Click an order to open **Order details**.",
              body: "It shows the items, notes, **Subtotal**, **Discount**, **Delivery fee**, **Total** and **VAT (included)**.",
            },
          ],
        },
        {
          t: "p",
          text: "The page shows `200` orders at a time; click **Load more** for the next. The statuses are **Pending payment**, **Placed**, **Accepted**, **Preparing**, **Ready**, **Out for delivery**, **Delivered**, **Completed** and **Cancelled**. The payment statuses are **Unpaid**, **Paid**, **Refund due** and **Refunded**.",
        },
        { t: "h2", id: "cancel-and-export", text: "Cancel an order or export the list" },
        {
          t: "list",
          items: [
            "To cancel an order that can still be cancelled, open its details and click **Cancel order**. The deducted stock goes back, and if the order was paid its payment becomes **Refund due**; handing the money back to the guest is done by hand.",
            "Click **Export CSV** to download the rows on screen now, with headings in the interface language. For more than `200` orders, click **Load more** first, or use [Reports](/docs/reports/sales-reports).",
          ],
        },
        { t: "h2", id: "activity", text: "The activity log" },
        {
          t: "steps",
          items: [
            {
              title: "From the sidebar, open **System › Activity**.",
              shot: {
                id: "pos-reports-activity",
                alt: "The back office's Activity page: branch, action, period and user ID filters, and a table with time, action, user, branch, entity and details.",
                caption: "The Details column describes each event in a plain sentence.",
              },
            },
            {
              title: "Filter by branch, **Action** and period, or type a **User ID**.",
              body: "The user filter takes the ID, not the name.",
            },
          ],
        },
        {
          t: "p",
          text: "The log shows `50` rows a page: **Time**, **Action**, **User**, branch, **Entity** and **Details**. Click **Export CSV** to download the page on screen. Among the actions it records:",
        },
        {
          t: "list",
          items: [
            "Orders: **Order cancelled** and **Order returned**.",
            "Stock: **Stock adjustment** and **Stock waste**, and inventory requests.",
            "Cash: **Cash pay-in**, **Cash pay-out**, **Large shift close variance** and **Shift force-closed**.",
            "Business days: **Business day opened**, **Business day closed** and **Business day force-closed**.",
            "Sign-ins: **Login success** and **Login failure**.",
            "Coupons, prices and devices: **Coupon applied**, **Coupon created**, **Price override changed**, **Printer changed from the POS** and more.",
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Why can't I see the Cancel order button?",
              a: "It shows for people with the **Cancel / void orders** permission, while the order can still be cancelled. An order past that point is returned from the POS; see [Orders, cancellations and returns](/docs/selling/orders-cancellations-and-returns).",
            },
            {
              q: "Can I search the log by a staff member's name?",
              a: "No. The user filter takes the **User ID** only; otherwise filter by action and period.",
            },
            {
              q: "Does the export include the whole log?",
              a: "**Export CSV** downloads the page on screen only, `50` rows. Move through the pages and export each one, or narrow the period.",
            },
          ],
        },
      ],
      related: [
        "selling/orders-cancellations-and-returns",
        "reports/sales-reports",
        "setup/staff-and-permissions",
      ],
    },
  ],
};
