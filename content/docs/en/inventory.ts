import type { DocCategory } from "../types";

/* Follows content/docs/ar/pos-inventory.ts article for article, block for block; the sources are listed there. */
export const posInventory: DocCategory = {
  id: "inventory",
  group: "daily",
  icon: "utensils",
  title: "Inventory and recipes",
  description: "Ingredients and costed recipes, stock deducted with every order, transfers and low-stock alerts.",
  articles: [
    {
      slug: "ingredients-and-recipes",
      title: "Add ingredients and link them to recipes",
      summary:
        "Set up each ingredient's unit, cost and low-stock threshold, then a recipe per product size, so orders deduct stock and food cost shows in reports.",
      keywords: [
        "ingredients",
        "recipe",
        "recipes",
        "food cost",
        "low-stock threshold",
        "unit of measure",
        "المكوّنات",
        "الوصفة",
        "تكلفة الطعام",
      ],
      reviewed: "2026-10-27",
      before: [
        "The **Manage menu & catalog** permission, held by the Admin role by default.",
        "Saved products with their sizes. See [Build your menu](/docs/setup/build-your-menu).",
      ],
      body: [
        {
          t: "p",
          text: "An ingredient is something you buy and store: coffee, milk, cups. A recipe says how much of each ingredient one size of a product uses. From these two, Moving POS deducts stock with every order and works out food cost and margin in your reports.",
        },
        { t: "h2", id: "add-an-ingredient", text: "Add an ingredient" },
        {
          t: "steps",
          items: [
            {
              title: "From the sidebar, open **Catalogue › Menu**, then the **Ingredients** tab.",
              body: "The **New ingredient** button is also on the **Inventory** page and opens the same window.",
              shot: {
                id: "pos-inventory-ingredients",
                alt: "The Ingredients tab of the back office's Menu page: a table with name, unit, cost per unit and low-stock threshold, and a New ingredient button.",
                caption: "Each ingredient has one unit, a cost per unit and a low-stock threshold.",
              },
            },
            { title: "Click **New ingredient** and enter **Name (EN)** and **Name (AR)**." },
            {
              title: "Choose the **Unit**: **Grams (g)**, **Milliliters (ml)** or **Pieces**.",
              body: "These are the only three units. Record every quantity in them: a kilo is `1000` grams, a litre `1000` millilitres.",
            },
            {
              title: "Enter the **Cost per unit (EGP)**.",
              body: "It is the cost of one gram, one millilitre or one piece, and it takes fractions: coffee at `600` EGP a kilo is `0.6` EGP a gram. Saudi accounts show the amount in riyals.",
            },
            {
              title: "Enter the **Low-stock threshold**, then click **Save**.",
              body: "At or below this quantity the ingredient shows as low in every branch. Zero means it never shows as low.",
            },
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "Only people with the **Manage purchases** permission see the cost field. Anyone else can save the ingredient without changing its cost.",
        },
        { t: "h2", id: "write-a-recipe", text: "Write a recipe for each size" },
        {
          t: "p",
          text: "A recipe belongs to a size, not to the whole product: a small latte has one recipe and a large latte another.",
        },
        {
          t: "steps",
          items: [
            { title: "In **Catalogue › Menu**, open the **Products** tab and click **Edit** next to the product." },
            {
              title: "In the **Variants** section, click **Recipe** next to the size.",
              body: "The button appears on saved sizes only. If the product is new, save it first, then open it again.",
            },
            {
              title: "Pick the **Ingredient**, type the **Qty** in its unit, and click **Add line** for the next ingredient.",
              body: "For a medium latte, for example: coffee `18` grams, milk `220` millilitres, cup `1` piece.",
            },
            {
              title: "Click **Save recipe**.",
              body: "Saving replaces the whole recipe with what is on the screen, so check the lines before you save.",
            },
          ],
        },
        {
          t: "p",
          text: "You can reach the same recipe from the **Modifiers & Sizes** tab too: click **Quick Edit** on the size, then **Recipe**.",
        },
        { t: "h2", id: "what-recipes-do", text: "What a recipe does" },
        {
          t: "list",
          items: [
            "Every order deducts the recipe, times the quantity ordered, from the branch's stock. Details in [Track stock in each branch](/docs/inventory/stock-per-branch).",
            "The **Food cost** tab in Reports works out each product's ingredient cost and margin, and shows **No recipe** against a product without one.",
            "A product without a recipe deducts nothing from stock and sells as normal.",
            "Recipes and costs are the same in every branch.",
          ],
        },
        {
          t: "callout",
          tone: "warning",
          text: "Option groups have no recipes and deduct no stock. Link quantities to sizes.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why is there no Recipe button next to the size?",
              a: "It appears on saved sizes only. Save the product first, then open it with **Edit** and add the recipe.",
            },
            {
              q: "Does receiving a purchase change an ingredient's cost?",
              a: "No. The cost changes when you save it in the ingredient window, or when you click **Use as cost** on a supplier price in the **Prices** window on the Inventory page.",
            },
            {
              q: "I buy by the kilo and the litre. How do I record quantities?",
              a: "Convert them to the base unit: a kilo is `1000` grams and a litre `1000` millilitres. There are no purchase units other than grams, millilitres and pieces.",
            },
          ],
        },
      ],
      related: [
        "inventory/stock-per-branch",
        "setup/build-your-menu",
        "setup/sizes-and-option-groups",
        "reports/sales-reports",
      ],
    },
    {
      slug: "stock-per-branch",
      title: "Track stock in each branch",
      summary:
        "Each branch holds its own stock, deducted when an order is placed and restored on a cancel. Record purchases, adjustments and waste, and watch what runs low.",
      keywords: [
        "stock",
        "branch stock",
        "waste",
        "stock adjustment",
        "receive purchase",
        "low stock",
        "stock count",
        "inventory",
        "المخزون",
        "الهدر",
      ],
      reviewed: "2026-10-27",
      before: [
        "The **Adjust stock** permission for adjustments and waste, and **Manage purchases** for purchases and costs. The Admin, Branch manager and Warehouse keeper roles hold both by default.",
        "Ingredients and recipes set up. See [Add ingredients and link them to recipes](/docs/inventory/ingredients-and-recipes).",
      ],
      body: [
        {
          t: "p",
          text: "The back office's **Inventory** page shows each ingredient's balance in a branch and what it is worth. It is also where you record, by hand, anything that comes into or leaves the branch other than through sales.",
        },
        { t: "h2", id: "open-a-branch", text: "Open a branch's stock" },
        {
          t: "steps",
          items: [
            {
              title: "From the sidebar, open **Catalogue › Inventory**.",
              shot: {
                id: "pos-inventory-stock",
                alt: "The back office's Inventory page: the branch name, the Analytics, New ingredient, Adjust / waste and Receive purchase buttons, and the stock table with on hand, threshold and value.",
                caption: "A LOW badge next to the quantity means the ingredient has reached its threshold.",
              },
            },
            {
              title: "Choose the branch.",
              body: "An admin can pick any branch, or a warehouse, which shows **Warehouse** next to its name. Anyone with a home branch, such as a branch manager, sees that branch only.",
            },
          ],
        },
        {
          t: "p",
          text: "The **Stock** table shows each ingredient's **On hand**, **Threshold**, **Cost per unit (EGP)** and **Stock value**, with the **Total stock value** above it. A **LOW** badge appears when an ingredient reaches its threshold, and the quantity turns red below zero. Under the table are the **Low stock** list and the **Purchase history**. Costs and values are shown only to people with the **Manage purchases** permission.",
        },
        { t: "h2", id: "automatic-deduction", text: "When stock is deducted" },
        {
          t: "list",
          items: [
            "An order at the POS: the moment it is placed, not when it is completed.",
            "An order from your ordering site: the moment it arrives, or the moment the online card payment succeeds if the guest paid by card.",
            "An open dine-in table: as each item is added to it.",
          ],
        },
        {
          t: "table",
          head: ["What happened", "Effect on stock"],
          rows: [
            ["The order is cancelled", "What was deducted goes back to the branch's stock."],
            ["The order is returned", "Nothing goes back. During the return you can book the ingredients that were actually thrown away as extra waste."],
            ["An item has no recipe", "Nothing is deducted."],
            ["An ingredient runs out", "Selling does not stop; the balance goes negative."],
          ],
        },
        { t: "h2", id: "record-movements", text: "Record purchases, adjustments and waste" },
        {
          t: "steps",
          items: [
            {
              title: "To receive goods, click **Receive purchase**.",
              body: "Enter the **Supplier** if you like, then for each line the **Ingredient**, the **Qty** and the **Cost (EGP)**, which is the line total, not the unit price. The quantities are added to the branch's stock; the ingredient's cost stays as it is.",
            },
            {
              title: "To correct a balance or record spoiled goods, click **Adjust / waste**.",
              body: "Pick the ingredient, enter the **Delta (+ receive / − remove)** and choose the **Reason**: **Adjustment** or **Waste**. Waste is always a negative amount, and the **Note** is required.",
            },
          ],
        },
        {
          t: "callout",
          tone: "tip",
          text: "There is no separate stock-count screen. After a count, record the difference with **Adjust / waste**. For opening stock, record the first delivery with **Receive purchase** or a positive adjustment.",
        },
        { t: "h2", id: "low-stock", text: "Thresholds and inventory requests" },
        {
          t: "p",
          text: "Each ingredient has one threshold that applies to every branch. The **Reorder points for this branch** section suggests one from the branch's use over the last `30` days: click **Check reorder points**, then **Use suggested** for the ingredient you want, and remember the new threshold changes for every branch.",
        },
        {
          t: "p",
          text: "A branch manager asks head office for stock with **Request more inventory** in the **Inventory requests** section. An admin or warehouse keeper approves or rejects it, then clicks **Fulfill**, which records the quantities as a purchase at the requesting branch. Once [transfers](/docs/inventory/inventory-transfers) are switched on and a warehouse exists, new requests go through them.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why is an ingredient's balance negative?",
              a: "Selling does not stop when an ingredient runs out. Record any purchases that were missed, or correct the balance with **Adjust / waste**.",
            },
            {
              q: "A guest returned an order. Why didn't the stock come back?",
              a: "Only a cancellation restores stock; a return does not. Details in [Orders, cancellations and returns](/docs/selling/orders-cancellations-and-returns).",
            },
            {
              q: "Can I set a different threshold for each branch?",
              a: "No. Each ingredient has one threshold for every branch.",
            },
          ],
        },
      ],
      related: [
        "inventory/ingredients-and-recipes",
        "inventory/inventory-transfers",
        "inventory/inventory-analytics",
        "selling/orders-cancellations-and-returns",
      ],
    },
    {
      slug: "inventory-transfers",
      title: "Move stock between the warehouse and branches",
      summary:
        "Transfers move ingredients between the warehouse and branches, on a branch's request or a planned delivery, from approval to count. No branch-to-branch moves.",
      keywords: [
        "transfers",
        "stock transfer",
        "warehouse",
        "deliveries",
        "returns",
        "pick list",
        "delivery count",
        "التحويلات",
        "المخزن",
        "التوريدات",
      ],
      reviewed: "2026-10-27",
      before: [
        "Transfers switched on for your account by the Moving team.",
        "A site of the kind **Warehouse — holds stock, never sells** under **Business › Branches**. See [Add a branch](/docs/branches/add-a-branch).",
      ],
      body: [
        {
          t: "p",
          text: "A transfer moves ingredients between the warehouse and a branch, and records who asked, who approved, who picked and who received. Stock leaves the source at dispatch and joins the destination's balance at the count; in between it is on the road, on no site's shelf.",
        },
        {
          t: "callout",
          tone: "note",
          text: "Transfers are switched on for your account by the Moving team. If you don't see them on the Inventory page, message us.",
        },
        { t: "h2", id: "kinds", text: "Kinds of transfer" },
        {
          t: "table",
          head: ["Kind", "Direction", "Who starts it"],
          rows: [
            ["**Request**", "Warehouse to branch", "The branch asks for what it needs."],
            ["**Planned delivery**", "Warehouse to branch", "The warehouse sends without a request."],
            ["**Return to the warehouse**", "Branch to warehouse", "The branch sends back what it doesn't need."],
            ["**Return asked by the warehouse**", "Branch to warehouse", "The warehouse asks for it back."],
          ],
        },
        {
          t: "p",
          text: "Moving stock straight from one branch to another isn't available at the moment.",
        },
        { t: "h2", id: "start-a-transfer", text: "Start a transfer" },
        {
          t: "steps",
          items: [
            {
              title: "In **Catalogue › Inventory**, click **Open transfers** on the **Transfers** card.",
              body: "Transfers are shown in columns: **To approve**, **Approved & picking**, **In transit**, **Needs attention** and **Done today**.",
              shot: {
                id: "pos-inventory-transfers",
                alt: "The back office's transfers board: filters, the Schedule & settings and New transfer buttons, and transfer cards arranged in columns by stage.",
                caption: "Each column is a stage; a card moves along with its transfer until Done today.",
              },
            },
            {
              title: "Click **New transfer**, choose the kind and the two sites, and add the ingredients and quantities.",
              body: "You see the kinds your permissions allow: **Ask for a transfer** for requests and returns, **Answer transfer requests** for planned deliveries.",
            },
          ],
        },
        {
          t: "p",
          text: "At the POS, a branch asks from the **Deliveries** button: the **Our requests** tab, then **New request**. The **Incoming** and **Returns** tabs show what is on its way to the branch and what it has sent back.",
        },
        { t: "h2", id: "lifecycle", text: "From approval to count" },
        {
          t: "steps",
          items: [
            { title: "**Approve** or **Reject**: a request can be approved in full or in part." },
            {
              title: "**Start picking**, then **Dispatch**.",
              body: "The warehouse picks the lines from the **Pick list**, which can be printed. On dispatch the quantities leave the warehouse's balance and the transfer is **On the road**.",
            },
            {
              title: "**Mark arrived**: the branch records that the goods have arrived.",
              body: "At the POS, with **Arrived** on the **Incoming** tab. The transfer is now **Arrived, not counted**.",
            },
            {
              title: "**Count**: the branch counts what actually arrived and picks a reason for any difference, such as short, damaged or expired.",
              body: "Only at the count do the quantities join the branch's balance.",
            },
            {
              title: "**Accept the count** or **Dispute**: if there is a difference, someone else reviews it.",
              body: "An admin settles a dispute with **Settle**.",
            },
          ],
        },
        {
          t: "callout",
          tone: "tip",
          text: "Whoever dispatched a transfer cannot count it, and whoever counted it cannot accept the count. To stop people approving their own requests, turn on **Refuse self-approval** in **Schedule & settings**.",
        },
        { t: "h2", id: "schedule-and-permissions", text: "Schedule and permissions" },
        {
          t: "p",
          text: "In **Schedule & settings** you set the working times, such as the **Order cut-off** (`14:00` by default, with next-day delivery) and the **Weighing tolerance**. Permissions are given to roles on the Permissions page:",
        },
        {
          t: "table",
          head: ["Permission", "Roles by default"],
          rows: [
            [
              "**See transfers**, **Mark a delivery arrived** and **Count deliveries**",
              "Admin, Branch manager, Cashier, Barista, Warehouse keeper",
            ],
            [
              "**Ask for a transfer**, **Answer transfer requests** and **Pick and dispatch transfers**",
              "Admin, Branch manager, Warehouse keeper",
            ],
            ["**Settle transfer disputes**", "Admin"],
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "How do I move stock from one branch to another?",
              a: "Moving it directly isn't available. Send the goods back with **Return to the warehouse**, then the warehouse sends them to the other branch.",
            },
            {
              q: "The branch lost its internet connection while receiving. Is the count lost?",
              a: "No. At the POS, arrivals and counts are kept on the device and sent when the connection is back.",
            },
            {
              q: "What happens if transfers are switched off?",
              a: "No new transfer can start, and anything already on the road is arrived, counted and settled as usual.",
            },
          ],
        },
      ],
      related: [
        "inventory/stock-per-branch",
        "branches/add-a-branch",
        "setup/staff-and-permissions",
        "inventory/inventory-analytics",
      ],
    },
    {
      slug: "inventory-analytics",
      title: "Read your inventory analytics",
      summary:
        "Inventory analytics shows stock value over time, what moved and what sat, what is low or out at each site, and transfer volume, for a period you choose.",
      keywords: [
        "inventory analytics",
        "stock value",
        "slow moving",
        "top moving",
        "dead stock",
        "تحليلات المخزون",
        "قيمة المخزون",
        "بطيء الحركة",
      ],
      reviewed: "2026-10-27",
      before: ["The **Manage purchases** permission, held by the Admin, Branch manager and Warehouse keeper roles by default."],
      body: [
        {
          t: "p",
          text: "The page answers the money questions about your stock: what the shelves are worth, what is used fast, and what ties up money without moving. Every value is at cost.",
        },
        { t: "h2", id: "open-analytics", text: "Open the analytics" },
        {
          t: "steps",
          items: [
            {
              title: "In **Catalogue › Inventory**, click **Analytics**.",
              shot: {
                id: "pos-inventory-analytics",
                alt: "The inventory analytics page: the range and site pickers, tiles for stock value, in, out and low · out, and a chart of stock value over time.",
                caption: "The figures sit at the top, with the charts for the range you picked below.",
              },
            },
            {
              title: "Choose the **Range**: `7`, `30` or `90` days, or set **From** and **To**.",
              body: "The range can be a year at most.",
            },
            {
              title: "Choose the site: a branch, a warehouse, or **All sites**.",
              body: "Anyone with a home branch sees that branch only.",
            },
          ],
        },
        { t: "h2", id: "figures", text: "The figures" },
        {
          t: "table",
          head: ["Figure", "What it means"],
          rows: [
            ["**Stock value**", "What is on the shelves now, at cost."],
            ["**In** and **Out**", "The value that came in and went out in the range, at cost."],
            ["**Low · out**", "How many ingredients are at or under their threshold, and how many are empty. An ingredient with a zero threshold isn't counted."],
            ["**Transfers**", "How many transfers were dispatched in the range, and their value, when transfers are switched on."],
          ],
        },
        { t: "h2", id: "charts", text: "Charts and tables" },
        {
          t: "list",
          items: [
            "**Stock value over time**: at today's cost, at the end of each day or week.",
            "**Stock in and out**: the value received and used each day or week.",
            "**Top moving** and **Slow moving**: the second shows what stays on the shelf and ties up money.",
            "**Low and out of stock by site**.",
            "**Warehouse to branch** and the **Transfers in this range** table, when transfers are switched on.",
            "The **Items** table, with the views **All**, **Moving**, **Slow**, **Low** and **Out**, showing each ingredient's **On hand**, **Value**, **Cover** (how many days the balance lasts) and **Last moved**.",
          ],
        },
        {
          t: "p",
          text: "Each chart has a **Show the numbers** button that turns it into a table. For usage and waste details, click **Usage and waste per ingredient**, which opens the **Ingredient usage** tab in Reports.",
        },
        {
          t: "callout",
          tone: "note",
          text: "This page has no CSV export. To download ingredient figures, use the **Ingredient usage** tab in [Sales reports](/docs/reports/sales-reports).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why can't I see the Analytics button?",
              a: "Only people with the **Manage purchases** permission see it, because the page shows costs.",
            },
            {
              q: "An ingredient is running low. Why doesn't it show as low?",
              a: "Its threshold is zero, and an ingredient without a threshold never counts as low. Give it a threshold in the ingredient window.",
            },
            {
              q: "Is past stock value worked out at the cost of the time?",
              a: "No. The chart values past quantities at today's cost.",
            },
          ],
        },
      ],
      related: [
        "inventory/stock-per-branch",
        "inventory/inventory-transfers",
        "reports/sales-reports",
      ],
    },
  ],
};
