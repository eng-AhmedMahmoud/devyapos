import type { DocArticle } from "../../types";

/* Follows content/docs/ar/parts/assistant.ts article for article, block for block; the sources are listed there. */
export const articles: DocArticle[] = [
    {
      slug: "ask-the-assistant",
      title: "Ask the AI assistant about your figures",
      summary:
        "The back office's AI assistant answers your questions about sales, stock, shifts and offers from your own figures, in Arabic or English, typed or spoken.",
      keywords: [
        "AI assistant",
        "assistant",
        "artificial intelligence",
        "ask about sales",
        "chat",
        "المساعد الذكي",
        "المساعد",
        "الذكاء الاصطناعي",
      ],
      reviewed: "2026-10-27",
      before: [
        "The AI assistant switched on for your account: it is an add-on the Moving team switches on for each restaurant.",
        "The **View AI insights** permission, held by default by **Admin** and **Branch manager**.",
      ],
      body: [
        {
          t: "p",
          text: "You ask the back office's **Assistant** in your own words; it reads the figures from your system and answers with them, adding a table or a small chart when that helps. Every number in an answer is worked out by a tool in the system, and anything its tools can't reach it says it can't see rather than guess.",
        },
        {
          t: "callout",
          tone: "note",
          text: "The assistant is an add-on switched on for each restaurant. If **Assistant** shows dimmed in the sidebar with **Not included** beside it, your plan doesn't include it; [contact us](/contact) to switch it on.",
        },
        { t: "h2", id: "ask", text: "Open the assistant and ask" },
        {
          t: "steps",
          items: [
            {
              title: "In the sidebar open **Today › Assistant**, or tap **Assistant** in the floating buttons at the bottom of the screen.",
              body: "Or press `Ctrl` + `J` from any screen, `⌘` + `J` on a Mac.",
              shot: {
                id: "pos-assistant-chat",
                alt: "The Assistant page in the back office: the chat list at the side, “What would you like to know?” in the middle with suggested questions, and the message box at the bottom.",
                caption: "The suggested questions depend on your role; tap one to start.",
              },
            },
            {
              title: "Type your question and tap **Send**.",
              body: "For example “How did sales this week compare with last week?”. `Enter` sends and `Shift` + `Enter` starts a new line. Under the box you see how many of today's questions you've used.",
            },
            {
              title: "Read the answer.",
              body: "With the answer comes a card for each thing the assistant read, named after the tool, such as **Read sales**; open it to see what it asked for and what came back. Tap **Stop** to cut a long answer short.",
            },
          ],
        },
        { t: "h2", id: "what-it-reads", text: "Where the answers come from" },
        {
          t: "p",
          text: "The assistant reads through a fixed set of tools, each tied to a back-office permission, so it sees only what your permissions and your branch let you see:",
        },
        {
          t: "list",
          items: [
            "Sales: **Read sales**, **Best and worst sellers**, **Add-on choices**, **Profit & loss** and **Delivery app sales**.",
            "Menu and stock: **Menu costing**, **Check stock**, **Stock movements** and **Purchases**.",
            "Operations: **Cash drawers**, **Labour hours** and **Business days**.",
            "Offers and guests: **Offer performance**, **Coupon performance**, **Loyalty points** and **Gift cards**.",
          ],
        },
        {
          t: "p",
          text: "An admin picks a branch or **All branches** from the **Branch** chip above the chat; a branch manager asks about their own branch only. The assistant answers in the language and dialect you wrote in.",
        },
        { t: "h2", id: "remember", text: "Teach the assistant about your restaurant" },
        {
          t: "p",
          text: "Under any answer, tap **Remember this** and write a note — the name you give a branch, or what a term means to you — then tap **Save note**. The assistant reads its notes with every question, and a note never changes a figure. This needs the **Teach the AI companion** permission.",
        },
        { t: "h2", id: "chats", text: "Chats" },
        {
          t: "p",
          text: "Your chats are kept in your system and no one else sees them. From the chat list start a **New chat** or search the old ones, and from each chat's menu: **Rename**, **Pin**, **Archive** and **Delete**.",
        },
        { t: "h2", id: "privacy", text: "What goes to the AI provider" },
        {
          t: "list",
          items: [
            "Your question and the chat before it, the figures the tools read, and the saved notes are sent to the AI provider the Moving team sets up, to write the answer: Claude by Anthropic, and Gemini by Google if the first can't answer.",
            "Guests' names, phone numbers and emails, and staff names and pay, are never sent: the tools don't return them, and the system refuses any result holding a phone number or an email before it goes out.",
            "On Saudi accounts the assistant stays off until the system's operator agrees to send questions to a provider outside the Kingdom.",
          ],
        },
        {
          t: "callout",
          tone: "tip",
          text: "The assistant reads and proposes; it changes nothing by itself. Any change it prepares waits for someone allowed to approve it; see [approve what the assistant changes](/docs/assistant/approve-its-changes).",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why isn't the assistant in the sidebar?",
              a: "Because you don't hold the **View AI insights** permission. If it shows dimmed with **Not included** beside it, the add-on isn't in your plan.",
            },
            {
              q: "“You have used today's questions” appeared. What now?",
              a: "Everyone has a daily limit of questions, and the count starts again the next day. Everything else in the back office works as usual.",
            },
            {
              q: "**Not set up yet** shows instead of the suggested questions. Why?",
              a: "The system has no AI provider set up yet, so the assistant can't answer. [Message us](/contact) to set it up.",
            },
            {
              q: "Can I rely on the assistant's figures for a big decision?",
              a: "The figures themselves are worked out by the system's tools, not by the AI; the wording of the answer is AI-written. Open the tool card to see what it read, and check the figures in [Reports](/docs/reports/sales-reports) before a big decision.",
            },
            {
              q: "Does the assistant work on the till?",
              a: "No. The assistant is in the back office only.",
            },
          ],
        },
      ],
      related: [
        "assistant/talk-to-the-assistant",
        "assistant/morning-briefing",
        "assistant/approve-its-changes",
        "reports/sales-reports",
      ],
    },
    {
      slug: "talk-to-the-assistant",
      title: "Talk to the assistant by voice note or live",
      summary:
        "Send the assistant a voice note in Egyptian or Saudi Arabic or English and hear its replies, or start a live voice chat that is saved in the conversation.",
      keywords: [
        "voice note",
        "talk to the assistant",
        "read aloud",
        "live voice",
        "رسالة صوتية",
        "المساعد الصوتي",
        "قراءة بصوت",
        "محادثة صوتية",
      ],
      reviewed: "2026-10-27",
      before: [
        "Assistant voice notes, assistant live voice, or both, switched on for your account by the Moving team.",
        "The **Talk to the assistant** permission, held by default by **Admin** and **Branch manager**.",
        "A browser that lets this site use the microphone.",
      ],
      body: [
        {
          t: "p",
          text: "The **Assistant** gives you two ways to speak instead of typing: a voice note you record and send as a question, and a live chat where the assistant answers out loud as you talk. Either way the answers come from the same figures it reads when you type.",
        },
        { t: "h2", id: "voice-note", text: "Send a voice note" },
        {
          t: "steps",
          items: [
            {
              title: "Tap **Record a voice note** beside the message box.",
              body: "Tap once to start and then send, or hold while you talk and let go to send; slide away to cancel. A note can be five minutes at most.",
            },
            {
              title: "What you said appears as text in the chat, then the answer follows.",
              body: "Beside the text is a badge with the language it heard, such as **Egyptian**, **Saudi** or **English**. If the transcript is wrong, tap **Edit transcript** and correct it, then ask again so the answer is built on the right words.",
            },
            {
              title: "Hear the answer.",
              body: "Tap **Read aloud** under any answer. To hear the reply to your voice notes automatically, switch on **Answer my voice notes with a voice note** in **Assistant settings**.",
            },
          ],
        },
        {
          t: "p",
          text: "Pick the assistant's voice from the **Voice** chip above the chat. In **Assistant settings** you also choose the **Answer language**: **Match the language I write in**, **Egyptian Arabic**, **Saudi Arabic** or **English**.",
        },
        { t: "h2", id: "live-voice", text: "Talk to the assistant live" },
        {
          t: "steps",
          items: [
            {
              title: "Tap **Talk** above the chat, then **Start talking**.",
              body: "The button shows when live voice is switched on and set up for your account.",
            },
            {
              title: "Speak naturally.",
              body: "The assistant answers out loud, **Captions** show what you both say, and **Full transcript** shows the whole exchange. To cut in while it speaks, tap the sphere in the middle of the screen.",
            },
            {
              title: "Tap **End** when you're done.",
              body: "What was said is saved in this chat. One session lasts 15 minutes at most, and you see the voice minutes you have left today.",
            },
          ],
        },
        {
          t: "list",
          items: [
            "**Mute microphone** stops it hearing you; the space bar does the same.",
            "**Push to talk** makes the assistant hear you only while you hold the button.",
            "`Esc` ends the session.",
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "Voice never carries out a change. If you ask for one out loud, the assistant prepares it and it waits for a tap in the chat; see [approve what the assistant changes](/docs/assistant/approve-its-changes).",
        },
        { t: "h2", id: "voice-privacy", text: "Voice and privacy" },
        {
          t: "p",
          text: "A voice note's recording is kept in your system and no one else can play it; it is sent to the speech-to-text provider, Gemini by Google by default, to turn it into text. Read aloud sends the answer's text to the speech provider. In a live chat your voice goes to a Google voice model for the whole session. Everyone has a daily limit of voice minutes.",
        },
        {
          t: "qa",
          items: [
            {
              q: "“The words couldn't be made out” appeared. What now?",
              a: "Record again somewhere quieter, or type your question. Your recording stays on the page to play, retry or discard.",
            },
            {
              q: "Why is there no **Talk** button?",
              a: "Live voice isn't switched on or set up for your account, or you don't hold the **Talk to the assistant** permission. Voice notes work without it.",
            },
            {
              q: "Which dialect can I speak?",
              a: "Egyptian or Saudi Arabic, or English. The assistant answers in the language you spoke, unless you chose an **Answer language** in the settings.",
            },
          ],
        },
      ],
      related: [
        "assistant/ask-the-assistant",
        "assistant/morning-briefing",
        "assistant/approve-its-changes",
      ],
    },
    {
      slug: "morning-briefing",
      title: "Read today's briefing from the assistant",
      summary:
        "Ask the assistant for today's briefing: yesterday in each branch against a normal day, what needs a look and today's outlook, to read, hear or discuss.",
      keywords: [
        "morning briefing",
        "daily briefing",
        "briefing",
        "daily summary",
        "ملخص الصباح",
        "ملخص اليوم",
        "الملخصات",
      ],
      reviewed: "2026-10-27",
      before: [
        "The assistant morning briefing switched on for your account by the Moving team.",
        "The **View AI insights** permission, held by default by **Admin** and **Branch manager**.",
      ],
      body: [
        {
          t: "p",
          text: "The briefing is a short paragraph the assistant writes from your figures with the same tools it answers with: four to six sentences in your language, without tables.",
        },
        { t: "h2", id: "generate", text: "Generate today's briefing" },
        {
          t: "steps",
          items: [
            {
              title: "In the **Assistant**, tap **Briefings** at the top.",
              shot: {
                id: "pos-assistant-briefings",
                alt: "The Assistant page in the back office with the briefings panel open: the button to generate today's briefing, and earlier briefings under it, newest first.",
                caption: "Each briefing carries its date, and an unread one has a coloured dot.",
              },
            },
            {
              title: "Tap **Generate today's briefing**.",
              body: "The assistant writes the briefing from your figures. Each person gets one briefing a day: tap again the same day and the same briefing shows.",
            },
            {
              title: "Open the briefing to read it.",
              body: "Tap **Listen** to hear it if voice notes are on for you, or **Continue in chat** to ask a follow-up question about it.",
            },
          ],
        },
        { t: "h2", id: "contents", text: "What the briefing covers" },
        {
          t: "list",
          items: [
            "Yesterday in each branch: revenue and orders, against the average of the same weekday over the previous four weeks.",
            "Yesterday's cash close, and ingredients at or below their reorder point.",
            "Any change in delivery app commission or margin, and the reasons for returns if there were any.",
            "Today's outlook, from the same weekday in previous weeks.",
          ],
        },
        {
          t: "p",
          text: "The briefing skips any point your permissions don't let you read or that has no data. It talks about patterns, not people: a cash difference is a pattern worth a look, never an accusation.",
        },
        {
          t: "callout",
          tone: "note",
          text: "The briefing doesn't arrive by itself every morning: it is written when you tap **Generate today's briefing**, and it isn't sent as a message or a notification.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why can't I find **Briefings**?",
              a: "Because the morning briefing isn't switched on for your account. [Contact us](/contact) to switch it on.",
            },
            {
              q: "Does a branch manager get every branch in the briefing?",
              a: "No. The assistant writes the briefing for what your permissions and branch let you see, so a branch manager reads their own branch's.",
            },
            {
              q: "Where are earlier briefings?",
              a: "In **Briefings** itself, newest first, each with its date.",
            },
          ],
        },
      ],
      related: [
        "assistant/ask-the-assistant",
        "assistant/talk-to-the-assistant",
        "reports/back-office-dashboard",
      ],
    },
    {
      slug: "approve-its-changes",
      title: "Approve what the assistant changes",
      summary:
        "The assistant never changes anything alone: it prepares a change for you to approve in one tap, or works on screen in “Do it with me” and asks before saving.",
      keywords: [
        "approve",
        "assistant actions",
        "do it with me",
        "live assistant",
        "change a price",
        "موافقة",
        "نفّذ معي",
        "المساعد المباشر",
      ],
      reviewed: "2026-10-27",
      before: [
        "Assistant actions with approval, or the live assistant on every screen, switched on for your account by the Moving team.",
        "To approve a change: the **Approve assistant actions** permission, held by default by **Admin**, plus the change's own permission.",
        "To use **Do it with me**: the **Use the live assistant** permission, held by default by **Admin** and **Branch manager**.",
      ],
      body: [
        {
          t: "p",
          text: "The assistant has two ways to change something in the back office, and in both a person decides, not the AI: a change it prepares in the chat that waits for your approval, or **Do it with me**, where it works on the screen in front of you under your own account.",
        },
        { t: "h2", id: "in-the-chat", text: "A change it prepares in the chat" },
        {
          t: "p",
          text: "Ask for the change in your own words, such as “Make the mango juice unavailable”. The assistant prepares only one of these changes:",
        },
        {
          t: "table",
          head: ["Change", "Permission the approver also needs"],
          rows: [
            ["Make a menu item available or unavailable", "**Manage menu & catalog**"],
            ["Change an item's price, everywhere or in one branch", "**Manage menu & catalog**"],
            ["Draft a promotion, created inactive", "**Manage promotions**"],
            ["Draft a coupon, created inactive", "**Manage coupons**"],
          ],
        },
        {
          t: "steps",
          items: [
            {
              title: "A **Needs approval** card appears in the chat with what will change.",
              body: "The card stays **Waiting for approval** for 30 minutes, then turns **Expired** and never runs.",
            },
            {
              title: "Tap **Approve** to carry out the change, or **Reject**.",
              body: "The system checks your permissions and branch again before it runs, then the card turns **Done** and the assistant writes a line saying what changed.",
            },
          ],
        },
        {
          t: "p",
          text: "Drafts are created inactive: review the promotion or coupon and switch it on yourself from its page. Every change carried out or rejected is recorded in the [activity log](/docs/reports/orders-and-activity-log). Whoever holds **Manage the assistant** chooses what the assistant may propose under **Changes the assistant may propose** in **Assistant settings**; anything not ticked there it won't propose.",
        },
        { t: "h2", id: "do-it-with-me", text: "Do it with me: the assistant works the screen" },
        {
          t: "steps",
          items: [
            {
              title: "Tap **Do it with me** in the floating buttons at the bottom of the screen, or press `Alt` + `A`.",
              body: "The **Live assistant** panel opens beside the page, or from the bottom of the screen on a phone.",
              shot: {
                id: "pos-assistant-live-panel",
                alt: "The back office on the dashboard, with the live assistant panel open beside it: the “What should I do?” box and the switch to be asked before every save.",
                caption: "The panel stays open as you move between pages.",
              },
            },
            {
              title: "Type what you want done, such as “Open last week's sales report”.",
              body: "The assistant opens pages, types into fields and presses buttons in front of you, and each step shows in a list in the panel.",
            },
            {
              title: "Confirm the sensitive steps.",
              body: "Before saving or sending, and before anything that deletes, involves money or affects many records, it asks **Go ahead?** with **Confirm** and **Skip**. Untick **Ask me before every save or submit** if you don't want to be asked before an ordinary save; it always asks about deleting and money.",
            },
          ],
        },
        {
          t: "list",
          items: [
            "**Pause** stops after the step in hand, **Stop** stops at once, and **Take over** hands the page back to you. Touching the page while it works pauses it.",
            "**Undo** puts back what it typed into fields and what it picked, and goes back to the previous page, stopping at the first save, send or button it pressed; what was saved can't be undone from here.",
            "It can do only what your permissions allow, and never sees passwords, hidden fields or card fields, or anything behind an open dialog.",
            "From **Session options**: **New session**, **Past sessions**, **Voice mode**, **Read replies aloud** and **Open the full assistant**. Sessions are kept on this device only, for 30 days.",
          ],
        },
        {
          t: "callout",
          tone: "note",
          text: "What the panel reads from the screen — the names of fields and buttons and the values showing in them — is sent to the AI provider to decide the next step. In **Voice mode** the assistant uses your browser's speech recognition, and Chrome sends the audio to Google.",
        },
        {
          t: "qa",
          items: [
            {
              q: "Why are there no **Approve** and **Reject** buttons?",
              a: "Because you don't hold the **Approve assistant actions** permission, so you see “Someone who may approve changes has to approve this one.” Someone who holds it, plus the change's own permission, approves it.",
            },
            {
              q: "Can the assistant cancel an order or refund money from the chat?",
              a: "No. From the chat it prepares only the four changes above. In **Do it with me** it works on the screen with your permissions, and asks you to **Confirm** before any cancellation or amount.",
            },
            {
              q: "Why is there no **Do it with me** button?",
              a: "The live assistant isn't switched on for your account, or you don't hold the **Use the live assistant** permission. It also doesn't show on the **Assistant** page itself.",
            },
          ],
        },
      ],
      related: [
        "assistant/ask-the-assistant",
        "setup/staff-and-permissions",
        "reports/orders-and-activity-log",
      ],
    },
  ];
