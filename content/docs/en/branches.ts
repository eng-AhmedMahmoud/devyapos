import type { DocCategory } from "../types";

/* Follows content/docs/ar/branches.ts article for article, block for block; the sources are listed there. */
export const branches: DocCategory = {
  id: "branches",
  group: "setup",
  icon: "branches",
  title: "Branches",
  description: "Add your branches, set their hours, delivery zones and staff, and move between them.",
  articles: [
    {
      slug: "add-a-branch",
      title: "Add and edit a branch",
      summary:
        "Add a selling branch or a warehouse in the back office and edit its name, address, phone and printer. The Moving team sets opening hours, map link and WhatsApp.",
      keywords: ["new branch", "add branch", "edit branch", "warehouse", "test branch", "receipt printer", "opening hours", "فرع جديد", "إضافة فرع", "location"],
      reviewed: "2026-10-27",
      before: ["The **Manage branches** permission, which by default the **Admin** role has."],
      body: [
        {
          t: "p",
          text: "Every branch in Moving POS has its own till, shifts, business day and delivery zones, and its own prices if you want. From the branches screen you add a branch that sells, or a warehouse that holds stock and sends it to the branches but never sells.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-branches-list",
            alt: "The branch list in the back office: each branch with its English and Arabic name, address, phone, printer address, staff count, delivery zones and status.",
            caption: "A Warehouse badge marks the sites that don't sell, and the branch numbers sit in the card at the bottom of the page.",
          },
        },
        { t: "h2", id: "add", text: "Add a branch" },
        {
          t: "steps",
          items: [
            { title: "From the sidebar, open **Business › Branches** and click **New branch**." },
            {
              title: "Enter the **Name (EN)**, **Name (AR)**, **Address** and **Phone**.",
              body: "All four are required, and the phone must be a dialable number.",
            },
            {
              title: "Choose the **Kind of site**: **Branch — sells** or **Warehouse — holds stock, never sells**.",
              body: "A warehouse never appears on the till's branch list, the ordering site or a delivery zone. A branch that has sold or opened a business day can't become a warehouse; create the warehouse as a new site.",
            },
            {
              title: "Leave **Active** ticked.",
              body: "An inactive branch doesn't appear on the till or the ordering site.",
            },
            {
              title: "Enter the **Receipt printer IP** if the branch has a printer.",
              body: "It is the printer's address on the branch's local network, such as `192.168.1.50`. Tick **Printer uses HTTPS** if your printer needs it. More in [Receipt printers](/docs/setup/receipt-printers).",
            },
            { title: "Click **Save**." },
          ],
        },
        { t: "h2", id: "edit", text: "Edit or delete a branch" },
        {
          t: "list",
          items: [
            "Click **Edit** on the branch's row to change its details, then **Save**.",
            "If a staff member changes the printer address from the till, a **Changed at the till** badge appears. Saving the branch form accepts the change and clears the flag.",
            "**Test branch (development/QA only)** leaves the branch out of fleet-wide dashboards and reports, while it keeps working as a POS.",
            "**Delete** removes a branch with no records. A branch with orders or other records is deactivated instead.",
          ],
        },
        { t: "h2", id: "set-by-moving", text: "What the Moving team sets" },
        {
          t: "p",
          text: "Some branch details have no screen in the back office: opening hours, map link, the branch's WhatsApp number and its coordinates. The Moving team sets them for you; send us the new values whenever they change. Your ordering site shows them to customers, and the opening hours there are for information only: the site doesn't block orders outside them.",
        },
        {
          t: "callout",
          tone: "note",
          text: "If your restaurant is linked to Moving Stores, **Edit branch** shows **Pause web-store orders** with **Until (optional)**. It stops orders from the online store only; the till, the kitchen display and your ordering site are unaffected. Leave **Until (optional)** empty to stay paused until you switch it back, or set a time and the pause lifts by itself then. The Moving team switches this link on for your account; if you don't see it, [message us](/contact).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why doesn't my branch show on the till or the ordering site?",
              a: "Check that it is **Active** and its kind is **Branch — sells**; warehouses and inactive branches don't show on either.",
            },
            {
              q: "How do I change a branch's opening hours or WhatsApp number?",
              a: "Message the Moving team with the new values; they have no screen in the back office.",
            },
            {
              q: "Can a staff member work at more than one branch?",
              a: "Each staff member has one home branch. An **Admin** with no branch picks the branch on the till. More in [Staff and permissions](/docs/setup/staff-and-permissions).",
            },
          ],
        },
      ],
      related: [
        "branches/delivery-zones",
        "branches/order-numbering",
        "setup/staff-and-permissions",
        "setup/receipt-printers",
      ],
    },
    {
      slug: "delivery-zones",
      title: "Add delivery zones and fees",
      summary:
        "A delivery zone is a name and a flat fee for one branch. Customers pick it on your ordering site when they order delivery, and the fee is added to the order.",
      keywords: ["delivery zones", "delivery fee", "new zone", "delivery", "minimum delivery order", "free delivery", "مناطق التوصيل", "رسوم التوصيل", "zones"],
      reviewed: "2026-10-27",
      before: ["The **Manage delivery zones** permission, which by default the **Admin** and **Branch manager** roles have."],
      body: [
        {
          t: "p",
          text: "Delivery zones are what customers choose from on your ordering site when they order **Delivery**. Each branch has its own zones, and each zone has a flat fee added to the order. A branch with no active zones takes no delivery orders; the customer sees **No delivery zones are available for this branch right now.**",
        },
        {
          t: "shot",
          shot: {
            id: "pos-zones-list",
            alt: "The delivery zones screen in the back office: the branch picker at the top, then the zones table with each zone's English and Arabic name, delivery fee and status.",
            caption: "The zones belong to the branch picked at the top.",
          },
        },
        { t: "h2", id: "add-a-zone", text: "Add a zone" },
        {
          t: "steps",
          items: [
            {
              title: "From the sidebar, open **Business › Zones**.",
              body: "If you manage every branch, pick the branch from the list at the top of the page. A branch manager sees their own branch only.",
            },
            { title: "Click **New zone**." },
            {
              title: "Enter the **Name (EN)** and **Name (AR)**.",
              body: "Customers see the name in the site's language, so use a name they know, such as the neighbourhood's.",
            },
            {
              title: "Enter the **Delivery fee (EGP)**.",
              body: "For example `25`. The fee shows under the zone at checkout and is added to the order total. On Saudi accounts the fee is in riyals.",
            },
            { title: "Leave **Active** ticked and click **Save**." },
          ],
        },
        { t: "h2", id: "edit-or-remove", text: "Edit or switch off a zone" },
        {
          t: "list",
          items: [
            "Click **Edit** to change the name or the fee. A new fee applies to new orders; an order keeps the fee it was charged.",
            "Untick **Active** to hide the zone from the ordering site without deleting it.",
            "**Delete** removes the zone, unless orders use it; then it is deactivated instead.",
          ],
        },
        { t: "h2", id: "limits", text: "Limits of delivery zones" },
        {
          t: "list",
          items: [
            "No minimum order, no delivery time, and no map or boundary for the zone: customers pick their zone themselves.",
            "The fee is flat per zone; it doesn't change with distance or order value, and there is no free delivery above an amount.",
            "A zone belongs to one branch. If two branches cover the same neighbourhood, add it to each.",
          ],
        },
        {
          t: "callout",
          tone: "tip",
          text: "The ordering site doesn't check the address: the customer picks a zone and writes their address. If an order comes from outside the zone they picked, call the customer on their number or reject the order.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I set a minimum for delivery orders?",
              a: "No. A zone is a name and a fee only; the only minimum is a coupon code's own, if it has one.",
            },
            {
              q: "Can delivery be free?",
              a: "Yes, enter `0` as that zone's delivery fee.",
            },
            {
              q: "Why can't the customer choose delivery?",
              a: "Their branch has no active delivery zones. Add a zone to the branch or switch an existing one back on.",
            },
          ],
        },
      ],
      related: [
        "online-ordering/your-ordering-site",
        "online-ordering/online-orders-at-the-till",
        "branches/add-a-branch",
      ],
    },
    {
      slug: "order-numbering",
      title: "Set up order numbering",
      summary:
        "Order numbers start from 1 with every shift by default. You can have them restart every day or never, and add the branch number and the date.",
      keywords: ["order numbering", "order number", "branch numbers", "number format", "order sequence", "ترقيم الطلبات", "رقم الطلب", "receipt number"],
      reviewed: "2026-10-27",
      before: [
        "The **Manage settings** permission for order numbering, and **Manage branches** for branch numbers; by default the **Admin** role has both.",
      ],
      body: [
        {
          t: "p",
          text: "The number an order is called out by, and printed on the receipt and the kitchen ticket, is set under **Order numbering** in Settings. The default format `#{seq}` gives `#1`, then `#2`, and the count restarts with every shift. Each branch has its own counter.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-settings-order-numbering",
            alt: "The Settings page in the back office, with the Order numbering card beside the settings form: the restart options, the format field, the padding and the preview.",
            caption: "The preview shows the number exactly as the till will print it.",
          },
        },
        { t: "h2", id: "change-the-format", text: "Change the numbering" },
        {
          t: "steps",
          items: [
            { title: "From the sidebar, open **System › Settings**, then the **Order numbering** card." },
            {
              title: "Under **Restart the count**, choose when the count starts again.",
              body: "Every shift (the default): the first order of each cash drawer is number 1. Every day: the count restarts at midnight in your account's time zone, not when the business day closes. Never: one running number per branch.",
            },
            {
              title: "Enter the **Format**.",
              body: "It must contain `{seq}` and be 40 characters at most. The tokens you can use are in the table below; anything else prints as you typed it.",
            },
            {
              title: "Set **Pad the number to** a number of digits from 0 to 6.",
              body: "With 3 digits, `7` becomes `007`. Zero means no padding.",
            },
            {
              title: "Check the **Preview**, then click **Save**.",
              body: "The change applies to new orders only; numbers already issued never change.",
            },
          ],
        },
        {
          t: "table",
          head: ["Token", "What it prints"],
          rows: [
            ["`{seq}`", "The running number; required"],
            ["`{branch}`", "The branch's number from **Branch numbers**, as two digits, such as `03`"],
            ["`{date}`", "The full date, such as `2026-10-19`"],
            ["`{yyyy}` and `{yy}`", "The year: `2026` or `26`"],
            ["`{mm}` and `{dd}`", "The month and day: `10` and `19`"],
          ],
        },
        { t: "h2", id: "branch-numbers", text: "Give each branch a number" },
        {
          t: "p",
          text: "To use `{branch}`, open **Business › Branches**, enter a whole number for each branch in the **Branch numbers** card at the bottom of the page, then click **Save numbers**. A branch with no number prints its token as `00`. For example, the format `B{branch}-{seq}` with 3 digits gives order `B01-001` at branch number 1.",
        },
        {
          t: "callout",
          tone: "note",
          text: "Ordering-site orders don't go through a cash drawer, so with every-shift counting they take their numbers from a daily counter for the branch. An online order and a till order can therefore carry the same number on the same day. If you want numbers that never repeat within a day, choose every day.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why did numbering start from 1 again?",
              a: "By default the count restarts with every shift. Choose every day or never if you want otherwise.",
            },
            {
              q: "Does changing the format change old order numbers?",
              a: "No. The change applies to new orders only.",
            },
            {
              q: "Does each branch have its own sequence?",
              a: "Yes. Each branch has its own counter, so two orders at two branches can carry the same number. Add `{branch}` to the format to tell them apart.",
            },
          ],
        },
      ],
      related: [
        "branches/business-days",
        "branches/add-a-branch",
        "selling/receipts-and-order-numbers",
      ],
    },
    {
      slug: "business-days",
      title: "Open and close the business day",
      summary:
        "Open a branch's business day before its first shift, close it once every shift is closed, and get the day report, from the till or the back office.",
      keywords: ["business day", "start day", "end day", "force close", "day report", "end of day", "يوم العمل", "إنهاء اليوم", "day close"],
      reviewed: "2026-10-27",
      before: [
        "To open and close the day: the **Open & close shifts** permission, which by default the **Admin**, **Branch manager** and **Cashier** roles have.",
        "For the business days page in the back office: **View shift history**, and for its day report, **View reports**. For a forced close: **Manage business days from HQ**.",
      ],
      body: [
        {
          t: "p",
          text: "A business day groups a branch's shifts into one day. Each branch has at most one open day, no shift opens before it, and it can't close while a shift is still open. When it closes, the day report comes out with the branch's totals.",
        },
        { t: "h2", id: "at-the-till", text: "From the till" },
        {
          t: "steps",
          items: [
            {
              title: "Open **Shift** and tap **Start day**.",
              body: "Until the day is open, the screen says: **No business day open right now. Start the day before opening a shift.**",
              shot: {
                id: "pos-shift-business-day",
                alt: "The Shift screen in the POS with a shift open: when it opened, the opening float and the Close shift button.",
                caption: "Until the branch's business day is open, a Start day button shows here in place of the shift card.",
              },
            },
            {
              title: "Open your shift and sell as usual.",
              body: "More in [Sign in and open a shift](/docs/selling/sign-in-and-open-a-shift).",
            },
            {
              title: "At the end of the day, close every open shift at the branch.",
              body: "More in [Close the shift](/docs/selling/close-the-shift).",
            },
            {
              title: "Tap **End day**, then **Confirm end day**.",
              body: "The **Business day report** appears; tap **Done** to go back. Any staff member at the branch with the permission can end the day, not only the person who opened it.",
            },
          ],
        },
        { t: "h2", id: "in-the-back-office", text: "From the back office" },
        {
          t: "p",
          text: "Open **Today › Business days**. Under **Open days** there is a card for each open day, with its branch, how long it has been open, who opened it and how many shifts are open, plus **Close day** and **Force close** buttons. **Close day** stays disabled while a shift at the branch is open. Below the cards you pick a branch and click **Open day**.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-business-days",
            alt: "The business days page in the back office: cards for each branch's open day with its running timer, then the history table with date, branch, duration, who opened and closed the day, and shift count.",
            caption: "A red badge on an open day means it has run past the time set in Settings.",
          },
        },
        {
          t: "p",
          text: "Under **History** you filter days by branch, status and date, and click **Report** to see the **Day report**: orders, gross sales, net revenue, float, cash sales, cash pay-ins and pay-outs, and the expected, counted and variance figures. **Export CSV** downloads the rows shown.",
        },
        { t: "h2", id: "force-close", text: "Forced close" },
        {
          t: "p",
          text: "If a shift is left open and can't be closed at the branch, a manager closes the day from the back office with **Force close**. Write a **Reason** of 5 to 500 characters, and the day closes along with every shift still open at the branch. Those drawers are recorded as uncounted, never as zero, the reason goes to the activity log, and the day carries a **FORCED** badge in the history.",
        },
        {
          t: "callout",
          tone: "note",
          text: "A business day never closes by itself, and its date is the day it was opened, even if it runs past midnight. The **Stale business day after (hours)** setting in Settings (24 by default) only raises an alert on the dashboard; it never stops anyone opening or closing a day.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why can't I open a shift?",
              a: "No business day is open at the branch. Tap **Start day** on the **Shift** screen first.",
            },
            {
              q: "Why can't I end the day?",
              a: "A shift at the branch is still open. Close it first, or ask a manager to **Force close** from the back office.",
            },
            {
              q: "Is the business day tied to daily order numbering?",
              a: "No. Daily counting restarts at midnight, not when the business day closes. More in [Set up order numbering](/docs/branches/order-numbering).",
            },
          ],
        },
      ],
      related: [
        "selling/sign-in-and-open-a-shift",
        "selling/close-the-shift",
        "reports/shifts-and-z-reports",
        "branches/order-numbering",
      ],
    },
    {
      slug: "branch-prices-and-availability",
      title: "Set branch prices and item availability",
      summary:
        "A size can sell at a different price in each branch, but hiding an item applies to every branch and your ordering site at once; there is no per-branch hiding.",
      keywords: ["branch prices", "per-branch price", "hide item", "item unavailable", "sold out", "availability", "أسعار الفروع", "إخفاء صنف", "price override"],
      reviewed: "2026-10-27",
      before: [
        "The **Manage menu & catalog** permission, which by default the **Admin** role has.",
        "An item saved in the menu with at least one size.",
      ],
      body: [
        {
          t: "p",
          text: "Every size on the menu has a global price it sells at in every branch. If you want a different price at a branch, add a branch price for it. The till sells at its branch's price, and the menu page of your ordering site shows the price of the branch the customer picked and charges the order at it.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-menu-products",
            alt: "The Products tab of the menu in the back office: the items table with each item's category, status and an Edit button.",
            caption: "Open an item with Edit to reach its sizes and their branch prices.",
          },
        },
        { t: "h2", id: "set-branch-prices", text: "Add a branch price" },
        {
          t: "steps",
          items: [
            { title: "From the sidebar, open **Catalogue › Menu**, then the **Products** tab." },
            {
              title: "Click **Edit** on the item.",
              body: "A new item is saved first; branch prices are added after that.",
            },
            { title: "Under **Variants**, click **Branch Prices** on the size you want." },
            {
              title: "Click **Add line** for each branch, pick the **Branch** and enter the **Price (EGP)**.",
              body: "On Saudi accounts the price is in riyals.",
            },
            {
              title: "Click **Save branch prices**.",
              body: "Saving replaces all of this size's branch prices with what the editor shows. A branch not listed sells at the global price.",
            },
          ],
        },
        {
          t: "p",
          text: "Branch prices are also on the **Modifiers & Sizes** tab: click **Quick Edit** on any size, then the **Branch Prices** tab.",
        },
        { t: "h2", id: "which-price-applies", text: "Which price applies" },
        {
          t: "table",
          head: ["The order", "The price charged"],
          rows: [
            ["A delivery-app order where the app has a price for this size", "The delivery app's price, even if the branch has one"],
            ["An order at a branch with a price for this size", "The branch price"],
            ["Any other order", "The size's global price"],
          ],
        },
        {
          t: "p",
          text: "Changing the global price doesn't change branch prices; it applies to the branches without a price of their own. Delivery-app prices are covered in [Delivery apps](/docs/integrations/delivery-apps).",
        },
        { t: "h2", id: "hide-an-item", text: "Stop selling an item" },
        {
          t: "p",
          text: "Open the item with **Edit** and untick **Active** for the whole item or for one of its sizes, then click **Save**. An inactive item disappears from the till and from your ordering site at every branch. To see it in the list again, tick **Show inactive**.",
        },
        {
          t: "callout",
          tone: "warning",
          text: "There is no \"sold out at this branch\". Hiding applies to every branch and to your ordering site at once. If an item runs out at one branch only, leave it active, tell the branch's staff, and reject online orders that contain it.",
        },
        {
          t: "p",
          text: "Stock, on the other hand, is kept per branch. More in [Stock per branch](/docs/inventory/stock-per-branch).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I hide an item at one branch only?",
              a: "No. Unticking **Active** hides the item at every branch and on the ordering site.",
            },
            {
              q: "Does the branch price show on the ordering site?",
              a: "Yes. The menu page shows the price of the branch the customer picked, and the order is charged at it.",
            },
            {
              q: "What happens to branch prices if I change the global price?",
              a: "They stay as they are. The new global price applies to branches without a price of their own.",
            },
          ],
        },
      ],
      related: [
        "setup/build-your-menu",
        "integrations/delivery-apps",
        "inventory/stock-per-branch",
        "online-ordering/your-ordering-site",
      ],
    },
  ],
};
