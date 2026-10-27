import type { DocCategory } from "../types";

/* Follows content/docs/ar/setup.ts article for article, block for block; the sources are listed there. */
export const posSetup: DocCategory = {
  id: "setup",
  group: "setup",
  icon: "layers",
  title: "POS setup",
  description: "Set up Moving POS: business details and VAT, the menu, staff and permissions, and the receipt printer.",
  articles: [
    {
      slug: "business-settings-and-tax",
      title: "Set business settings and VAT",
      summary:
        "Set the VAT rate, receipt footer, cart rules and shift-close rules in the back office's **Settings**. Prices include VAT, at one rate for the whole business.",
      keywords: ["VAT", "tax", "settings", "receipt footer", "clear cart password", "shift variance", "VAT rate", "VAT inclusive", "ضريبة القيمة المضافة", "الإعدادات"],
      reviewed: "2026-10-27",
      before: ["The **Manage settings** permission, which only Admins hold by default."],
      body: [
        {
          t: "p",
          text: "The **Settings** page gathers the rules that apply to all your branches: the VAT rate, the text at the foot of the receipt, what a cashier may remove from a cart, and when a shift's difference counts as large. The card's **Save** button saves all its fields together.",
        },
        { t: "h2", id: "vat", text: "VAT" },
        {
          t: "p",
          text: "Your menu prices include VAT, so what the customer pays does not change when you change the rate. VAT is extracted from the order total after discounts: an item at 114 EGP at 14% carries 14 EGP of VAT, and its price stays 114 EGP.",
        },
        {
          t: "steps",
          items: [
            {
              title: "Open Settings",
              body: "From the sidebar, open **Settings**.",
              shot: {
                id: "pos-setup-settings",
                alt: "The Settings page: the general settings card with the VAT rate, receipt footers, cart guard and shift variance fields, and the order numbering card beside it.",
                caption: "Every field on the card saves with one Save button.",
              },
            },
            {
              title: "Type the rate",
              body: "In **VAT rate (%)**, type a number from 0 to 30. If it was never set, 14 is used.",
            },
            {
              title: "Save",
              body: "Press **Save** on the card.",
            },
          ],
        },
        {
          t: "list",
          items: [
            "The POS cart shows \"Prices include VAT\".",
            "The receipt shows a **VAT included** line with the VAT amount after the total.",
            "An order's details in the back office show a **VAT (included)** line.",
            "The shift-close report and the day report do not show a VAT line.",
          ],
        },
        {
          t: "callout",
          tone: "warning",
          text: "There is one rate for the whole business: no rate per item, category or branch, and no exempt items. Moving POS does not submit e-invoices to the Egyptian Tax Authority.",
        },
        {
          t: "callout",
          tone: "note",
          text: "For Saudi accounts the Moving team sets the rate to 15% during setup and switches on ZATCA e-invoicing for your account. Details in [ZATCA e-invoicing](/docs/integrations/zatca-e-invoicing). If you don't see it, [message us](/contact).",
        },
        { t: "h2", id: "receipt-and-cart", text: "Receipt and cart" },
        {
          t: "table",
          head: ["Setting", "What it does"],
          rows: [
            ["**Receipt footer (AR)** and **Receipt footer (EN)**", "Text printed at the foot of every receipt, such as a thank-you or a contact number."],
            ["**Empty cart guard**", "A cashier can never remove the last item of a cart in progress. Choose what Clear cart does about it: keep the first item (the default), hide when one item is left, or empty everything."],
            ["**Clear cart password**", "Once set, cashiers must enter it to clear a cart. Press **Remove lock** to drop it."],
            ["**Also require the password to remove a single item**", "Asks for the clear cart password on every item removal. Works once that password is set."],
            ["**Show prices and payment method on the Orders tab**", "Off by default, so the POS Orders tab shows status, items and customer info only."],
          ],
        },
        { t: "h2", id: "shift-and-day", text: "Closing shifts and business days" },
        {
          t: "table",
          head: ["Setting", "What it does"],
          rows: [
            ["**Large variance — amount (EGP)** and **Large variance — share of expected (%)**", "When a shift closes off by more than either on cash, card or Instapay, the cashier must type a reason and an alert shows on the dashboard. The defaults are `200.00` and `0`, and they cannot both be 0."],
            ["**Show the cashier the expected cash while counting**", "Off by default, so the cashier counts the drawer without seeing the expected amount."],
            ["**Stale business day after (hours)**", "From 1 to 168 hours, 24 by default. An alert only; it never stops anyone opening or closing a day."],
          ],
        },
        {
          t: "p",
          text: "The same page holds the **Order numbering** card with its own save button, explained in [Order numbering](/docs/branches/order-numbering). Saudi accounts also see a **Privacy notice** card for the privacy text shown to customers.",
        },
        { t: "h2", id: "set-by-moving", text: "What the Moving team sets" },
        {
          t: "p",
          text: "The currency (Egyptian pounds or Saudi riyals), the country, the time zone, and your business name, logo and colours are not in **Settings**; the Moving team sets them when your account is created, so [message us](/contact) to change them. There is no fixed cut-off for the day either: you open and close each business day yourself, as in [Business days](/docs/branches/business-days).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I set a different VAT rate for one item?",
              a: "No. One rate applies to every item and branch.",
            },
            {
              q: "How do I change the currency?",
              a: "The Moving team sets the currency for your account; there is no setting for it in the back office. [Message us](/contact).",
            },
            {
              q: "Why doesn't the shift report show VAT?",
              a: "The shift-close and day reports have no VAT line. You find it on every receipt and in every order's details.",
            },
          ],
        },
      ],
      related: ["branches/order-numbering", "integrations/zatca-e-invoicing", "setup/receipt-printers"],
    },
    {
      slug: "build-your-menu",
      title: "Build your menu",
      summary:
        "Add categories, products, sizes and prices under **Menu** in the back office; they show on the POS and the ordering site. Each product needs a priced size.",
      keywords: ["menu", "product", "category", "new product", "prices", "hide item", "items", "قائمة الطعام", "المنيو", "منتج جديد"],
      reviewed: "2026-10-27",
      before: ["The **Manage menu & catalog** permission, which only Admins hold by default."],
      body: [
        {
          t: "p",
          text: "The **Menu** page has four tabs: **Categories**, **Products**, **Ingredients** and **Modifiers & Sizes**. What you save here appears on the POS and the ordering site at every branch. Start with categories, then products, because every product needs a category. If the Moving team loaded your menu during setup, you'll find it here ready to edit.",
        },
        { t: "h2", id: "categories", text: "Add a category" },
        {
          t: "steps",
          items: [
            {
              title: "Open the Categories tab",
              body: "From the sidebar, open **Menu**, then the **Categories** tab.",
              shot: {
                id: "pos-setup-menu-categories",
                alt: "The Categories tab of the menu: a table with photo, name, sort, product count and status columns, and a New category button.",
                caption: "The sort column sets the order of categories.",
              },
            },
            {
              title: "Create the category",
              body: "Press **New category** and type **Name (AR)** and **Name (EN)**; both are required.",
            },
            {
              title: "Finish the details and save",
              body: "Set the **Sort**, add a **Photo** with **Upload image** or an **Image URL**, keep **Active** ticked, then save.",
            },
          ],
        },
        { t: "h2", id: "products", text: "Add a product with its sizes and prices" },
        {
          t: "steps",
          items: [
            {
              title: "Create the product",
              body: "Open the **Products** tab and press **New product**.",
              shot: {
                id: "pos-setup-menu-products",
                alt: "The Products tab: the product list with photos, categories and status, under a category filter, a Show inactive option and a New product button.",
                caption: "Select several products to hide or show them together.",
              },
            },
            {
              title: "Fill in its details",
              body: "Type **Name (AR)** and **Name (EN)** and choose the **Category**; all are required. Add a **Photo** and a **Sort** if you like.",
            },
            {
              title: "Add the sizes",
              body: "Under **Variants**, fill in for each size: **Label**, **Price (EGP)**, **Was price (EGP)** if you want to show an earlier price, and **SKU**. Add a row with **Add variant**. A product with one price needs just one row, such as \"Regular\".",
            },
            {
              title: "Save, then add the recipe and branch prices",
              body: "After saving, reopen the product: each size now shows **Recipe** and **Branch Prices** buttons.",
            },
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "A product won't save without a size that has a label and a price; you see \"A product needs at least one variant with label and price\". On Saudi accounts prices show in riyals instead of EGP.",
        },
        { t: "h2", id: "recipes-and-branch-prices", text: "Recipes and branch prices" },
        {
          t: "list",
          items: [
            "**Recipe** links each size to its ingredients and quantities, so stock is deducted with every order and the item's cost shows. See [Ingredients and recipes](/docs/inventory/ingredients-and-recipes).",
            "**Branch Prices** give a size a different price at a given branch; a branch you leave blank uses the main price. See [Branch prices and availability](/docs/branches/branch-prices-and-availability).",
          ],
        },
        { t: "h2", id: "hide-or-delete", text: "Hide or delete a product" },
        {
          t: "list",
          items: [
            "Select one or more products and press **Hide from POS**, or **Show on POS** to bring them back. To see hidden ones, turn on **Show inactive**.",
            "Deleting a product that has been sold doesn't erase it: it and its sizes are deactivated instead, with a message saying so.",
            "You can also switch off a whole category or a single size by clearing **Active**.",
          ],
        },
        {
          t: "callout",
          tone: "warning",
          text: "Hiding applies to every branch and to the ordering site at once. There is no hiding at one branch only, and no \"sold out\" button on the POS.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I add a product description?",
              a: "No. A product has a name in Arabic and English, a category, a photo and sizes; there is no description field.",
            },
            {
              q: "How does a product show on the POS?",
              a: "As one tile per product. If it has more than one size, the cashier picks the **Size** when adding it.",
            },
            {
              q: "Can customers choose add-ons such as a sauce or how sweet it is?",
              a: "Not yet. Details in [Sizes and option groups](/docs/setup/sizes-and-option-groups).",
            },
          ],
        },
      ],
      related: ["setup/sizes-and-option-groups", "inventory/ingredients-and-recipes", "branches/branch-prices-and-availability"],
    },
    {
      slug: "sizes-and-option-groups",
      title: "Sizes and option groups",
      summary:
        "Sizes work on the POS and the ordering site, each with its own price and recipe. Option groups can be set up in the back office but are not offered yet.",
      keywords: ["sizes", "variants", "add-ons", "modifiers", "option groups", "extras", "toppings", "الأحجام", "الإضافات", "مجموعات الإضافات"],
      reviewed: "2026-10-27",
      before: ["The **Manage menu & catalog** permission, which only Admins hold by default."],
      body: [
        {
          t: "p",
          text: "A size is a row inside a product with its own label, price, code, recipe and branch prices, such as small, medium and large. An option group is a separate list of choices, apart from sizes, such as how much sugar, or a sauce.",
        },
        { t: "h2", id: "sizes", text: "Sizes" },
        {
          t: "list",
          items: [
            "You add sizes in the product window under **Variants**, as in [Build your menu](/docs/setup/build-your-menu).",
            "A size's label is a single text shown as you typed it in both languages, so pick one your team and customers understand.",
            "The POS shows a **Size** choice when a product has more than one size.",
            "Each size has its own recipe, so stock is deducted for the size sold.",
          ],
        },
        { t: "h2", id: "modifiers-tab", text: "The Modifiers & Sizes tab" },
        {
          t: "p",
          text: "Open **Menu**, then the **Modifiers & Sizes** tab. It has three views you switch between at the top:",
        },
        {
          t: "table",
          head: ["View", "What's in it"],
          rows: [
            ["**Sales Analysis**", "Units and revenue per size, with **Modifier / Size**, **Category**, **Branches** and period filters, and a **Download CSV** button."],
            ["**Modifier Catalog**", "Every size on the menu in one place, with **Quick Edit** for the label, price, was price, SKU and status."],
            ["**Option Groups**", "Setting up option groups and attaching them to products."],
          ],
        },
        {
          t: "shot",
          shot: {
            id: "pos-setup-menu-sizes",
            alt: "The Modifiers & Sizes tab on the Sales Analysis view: cards for total units and revenue, and a sales table per product and size, under the filters.",
            caption: "Switch between the three views with the buttons at the top of the tab.",
          },
        },
        { t: "h2", id: "option-groups", text: "Option groups" },
        {
          t: "callout",
          tone: "warning",
          text: "Nobody can choose option groups when ordering yet: they don't appear on the POS or the ordering site, don't change the order's price and don't deduct stock. Don't attach an active group whose **Must choose at least** is above 0 to a product either: the POS and the ordering site send no choices, so every order with that product is refused. If you need a paid extra today, add it as a separate product.",
        },
        {
          t: "steps",
          items: [
            {
              title: "Open Option Groups",
              body: "In the **Modifiers & Sizes** tab, press **Option Groups**, then **New group**.",
              shot: {
                id: "pos-setup-menu-option-groups",
                alt: "The Option Groups view before any group exists: a line explaining they are separate from sizes, a message that there are no groups yet, and a New group button.",
                caption: "Once saved, the rule column shows whether a group is required or optional.",
              },
            },
            {
              title: "Name the group and set its rule",
              body: "Type the name in Arabic and English, then **Must choose at least** and **May choose at most**. A minimum of 0 makes it optional, a blank maximum means unlimited, and 1 makes it a single choice.",
            },
            {
              title: "Add the options",
              body: "Press **Add option** for each one and type its name and the price change added to the item's price; a negative change is allowed. A group needs at least one active option.",
            },
            {
              title: "Save and attach it to products",
              body: "Save the group, then open its **Products** and tick the products it belongs to. Ticks are saved immediately.",
            },
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Can a cashier pick how much sugar, or extra cheese?",
              a: "No. The cashier picks the product, its size, the quantity and a note only. Write the customer's special requests in the note.",
            },
            {
              q: "Do add-ons deduct stock?",
              a: "No. Recipes are linked to sizes only, and add-ons have no recipe.",
            },
            {
              q: "Can each size have a different price at each branch?",
              a: "Yes, from the **Branch Prices** button next to the size in the product window.",
            },
          ],
        },
      ],
      related: ["setup/build-your-menu", "inventory/ingredients-and-recipes", "selling/take-an-order"],
    },
    {
      slug: "staff-and-permissions",
      title: "Add staff and set permissions",
      summary:
        "Give each staff member an account under **Staff**, with a role and branch, and set what a role or one person may do. Sign-in is email and password, no PIN.",
      keywords: ["staff", "permissions", "roles", "cashier", "branch manager", "password", "PIN", "users", "الموظفون", "الصلاحيات"],
      reviewed: "2026-10-27",
      before: ["The **Manage staff & permissions** permission, which only Admins hold by default."],
      body: [
        {
          t: "p",
          text: "Each staff member has their own account with an email and password. The role decides which apps they can open and their default permissions; the branch decides where they sell.",
        },
        { t: "h2", id: "roles", text: "Roles" },
        {
          t: "table",
          head: ["Role", "Back office", "POS"],
          rows: [
            ["**Super Admin** and **Admin**", "Yes, for every branch", "Yes"],
            ["**Branch manager**", "Yes", "Yes, once their branch is set"],
            ["**Cashier**", "No", "Yes, once their branch is set"],
            ["**Barista**", "No", "Yes, once their branch is set, opening on the kitchen display"],
            ["**Warehouse keeper**", "Inventory only", "No"],
          ],
        },
        {
          t: "list",
          items: [
            "You manage and create only roles below your own; a Super Admin manages everyone.",
            "A branch is required for every role except Super Admin, Admin and Warehouse keeper.",
          ],
        },
        { t: "h2", id: "add-staff", text: "Add a staff member" },
        {
          t: "steps",
          items: [
            {
              title: "Open Staff",
              body: "From the sidebar, open **Staff** and press **New user**.",
              shot: {
                id: "pos-setup-staff",
                alt: "The Staff page: a table of accounts with name, email, role and branch, the All roles and All branches filters, and a New user button.",
                caption: "Filter by role or branch to find someone quickly.",
              },
            },
            {
              title: "Fill in their details",
              body: "Type the **Name** and **Email**, choose the **Role** and **Branch**, and type a **Password** of at least 8 characters. Add a photo with **Upload photo** if you like.",
            },
            {
              title: "Review their permissions",
              body: "The **Permissions** section shows the role's defaults already ticked. Tick or untick what you want for this person; each change is marked **Changed from role default**. To undo, press **Reset to role defaults**.",
            },
            {
              title: "Save and hand over their details",
              body: "Save the account, then give the staff member their email and password to sign in.",
            },
          ],
        },
        { t: "h2", id: "role-permissions", text: "Role permissions" },
        {
          t: "steps",
          items: [
            {
              title: "Open Permissions",
              body: "From the sidebar, open **Permissions**. You get a table of roles against permissions grouped by area, such as orders, shifts and cash, and inventory.",
              shot: {
                id: "pos-setup-permissions",
                alt: "The Role permissions page: a grid of roles against permissions grouped by area, with Save permissions and Discard changes buttons.",
                caption: "The Super Admin row can't be edited: it always holds every permission.",
              },
            },
            {
              title: "Change and save",
              body: "Tick or clear boxes, then press **Save permissions**, or **Discard changes** to undo.",
            },
          ],
        },
        {
          t: "list",
          items: [
            "What you save here applies to everyone holding the role, except what you set for one person from their account under **Staff**.",
            "An Admin edits Branch manager and below; only a Super Admin edits the Admin row.",
            "**Manage menu & catalog**, **Manage staff & permissions**, **Manage settings** and **Manage branches** belong to Admins alone by default.",
            "**Cancel / void orders** belongs to Admins and Branch managers by default, and **Set the receipt printer IP from the POS** to them and to Cashiers.",
          ],
        },
        { t: "h2", id: "passwords", text: "Passwords and accounts" },
        {
          t: "list",
          items: [
            "To change someone's password, open their account and type a **New password**; leave it empty to keep the current one. There is no \"forgot password\" link, and staff can't change their own.",
            "Deleting an account with shift or order history deactivates it instead.",
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "There is no PIN sign-in to the POS or the back office. The only PIN is on the POS's **Clock in / out** screen (the **Clock** button), part of the attendance feature the Moving team switches on for your account. If you don't see it, [message us](/contact).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Can a branch manager edit the menu?",
              a: "Not by default. Grant **Manage menu & catalog** in role permissions, or to that person alone from their account.",
            },
            {
              q: "A staff member forgot their password. What now?",
              a: "Open their account under **Staff**, type a **New password**, save, and tell them.",
            },
            {
              q: "Why do I see \"Non-admin roles need a branch\"?",
              a: "Branch managers, cashiers and baristas need a branch to work in. Choose the **Branch**, then save.",
            },
          ],
        },
      ],
      related: ["getting-started/get-started-with-pos", "getting-started/back-office-tour", "selling/sign-in-and-open-a-shift"],
    },
    {
      slug: "receipt-printers",
      title: "Connect a receipt printer",
      summary:
        "One printer per branch network prints receipts and kitchen tickets. Type its address in the back office; the POS app on iPad, iPhone or Android prints to it.",
      keywords: ["printer", "receipt printer", "ESC/POS", "Epson", "thermal printer", "80 mm", "IP address", "kitchen ticket", "الطابعة", "طابعة الإيصالات"],
      reviewed: "2026-10-27",
      before: [
        "A thermal printer for 80 mm paper on the branch network that speaks Epson ePOS-Print or ESC/POS on port `9100`.",
        "The POS app on the device that will print.",
        "The **Manage branches** permission to set the address in the back office.",
      ],
      body: [
        {
          t: "p",
          text: "The POS app sends the receipt straight to the branch printer, with no print dialog. You type the printer's address on the branch once, and keep the device on the same branch network.",
        },
        { t: "h2", id: "what-works", text: "Printers that work" },
        {
          t: "list",
          items: [
            "A network thermal printer that speaks Epson ePOS-Print or ESC/POS on port `9100`. The app tries the first, then the second, and remembers what worked.",
            "The receipt is laid out for 80 mm paper. There is no 58 mm layout.",
            "One printer per branch, and kitchen tickets print on it too. There is no separate kitchen printer.",
            "USB printers are not supported, and printing from a browser opens the device's print dialog.",
          ],
        },
        { t: "h2", id: "set-up", text: "Connect the printer" },
        {
          t: "steps",
          items: [
            {
              title: "Find the printer's address",
              body: "Connect the printer to the branch network with a cable and print its network status sheet. On Epson TM printers: switch it off, then hold **Feed** while you switch it on. Read the address, such as `192.168.1.50`.",
            },
            {
              title: "Fix the address on the router",
              body: "Reserve that address for the printer on your router (DHCP Reservation), so it doesn't change after a power cut and stop printing.",
            },
            {
              title: "Type the address on the branch",
              body: "In the back office, open **Branches**, press **Edit** on the branch, and type the address in **Receipt printer IP**. Leave **Printer uses HTTPS** unticked unless the Moving team tells you otherwise, then save.",
              shot: {
                id: "pos-setup-branches",
                alt: "The Branches page in the back office: a table of branches with address, phone, receipt printer IP, user count and zones, and an Edit button for each branch.",
                caption: "The table shows each branch's printer address; you type it in the branch's edit window.",
              },
            },
            {
              title: "Put the device on the branch network",
              body: "Connect the device to the branch's own network, not the guest network. On iPad and iPhone, allow the app Local Network access in Settings.",
            },
            {
              title: "Test printing",
              body: "Press and hold the bottom-right corner of the screen for about a second and a half to open the app's settings. On iPad and iPhone it is called **Terminal settings**: choose **Printer diagnostics**, then **Test raw ESC/POS (port 9100)**. On Android it is **Terminal settings** too: press **Test raw ESC/POS (port 9100)**. Or print the next receipt with **Print receipt**.",
            },
          ],
        },
        { t: "h2", id: "change-from-till", text: "Change the address from the till" },
        {
          t: "p",
          text: "Anyone allowed to set the printer IP from the POS, by default Admins, Branch managers and Cashiers, can change it with the **Change IP** button in the POS, or from the **Shift** screen: the **Receipt printer** card, then **Change**, then type the **Printer IP address** and press **Save**. The back office then shows a **Changed at the till** badge on the branch and an alert on the dashboard; saving the branch form accepts the change and clears the flag.",
        },
        {
          t: "shot",
          shot: {
            id: "pos-setup-shift-printer",
            alt: "The Shift screen in the POS, with the Receipt printer card showing the branch's printer address, or \"No printer set\" when there is none, and a Change button.",
            caption: "The change shows in the back office under the name of whoever made it.",
          },
        },
        { t: "h2", id: "kitchen-tickets", text: "Kitchen tickets" },
        {
          t: "p",
          text: "A kitchen ticket carries no prices. Print one from the kitchen display with **Print kitchen ticket**, or press the auto-print button on one device per branch until it reads **Auto-print on**, to print a ticket for every online order as it arrives; counter orders print at payment.",
        },
        { t: "h2", id: "troubleshooting", text: "If it doesn't print" },
        {
          t: "table",
          head: ["Message", "What to do"],
          rows: [
            ["No printer address set for this branch", "Type the address in **Receipt printer IP** on the branch."],
            ["The iPad is on a different network from the printer", "Connect the device to the branch network, not the guest network."],
            ["The printer is not answering", "Check it is switched on, has paper, and its network cable is connected."],
            ["Nothing is answering at the printer address", "Print the network sheet from the printer and match its address with the one on the branch."],
            ["iOS is blocking the app from the local network", "Turn on Local Network for the app in the iPad's or iPhone's Settings."],
            ["This device is running in a browser, which cannot reach the branch printer", "Open the POS app instead of the browser to print silently."],
          ],
        },
        {
          t: "qa",
          items: [
            {
              q: "Can I use 58 mm paper?",
              a: "No. The receipt is laid out for 80 mm paper only.",
            },
            {
              q: "Printing stopped after a power cut. Why?",
              a: "Most likely the router gave the printer a new address. Reserve its address on the router, and check the address on the branch matches.",
            },
            {
              q: "Can I add a second printer for the kitchen?",
              a: "No. Each branch has one printer for receipts and kitchen tickets.",
            },
          ],
        },
      ],
      related: ["getting-started/devices-and-apps", "branches/add-a-branch", "selling/receipts-and-order-numbers"],
    },
  ],
};
