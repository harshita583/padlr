/**
 * Simulated teacher replies.
 *
 * This exists so the messaging flow can be demonstrated end to end without a
 * backend: send a message and the "teacher" types and answers, sometimes with
 * a shopping link that unfurls into a preview.
 *
 * How a reply is chosen when the learner sends something:
 *  1. the first unused reply whose `match` keywords appear in what they typed
 *  2. otherwise the first unused reply with no `match` at all
 *  3. otherwise `fallbackReply`
 *
 * Delete this file and the `demo` prop on <Conversation> when real messaging
 * lands. Nothing else depends on it.
 */

export type ScriptedMessage =
  | { kind: "text"; body: string }
  | { kind: "product"; body?: string; gearId: string };

export interface ScriptedReply {
  /** Lowercase keywords. Any one matching is enough. */
  match?: string[];
  /** How long the typing indicator shows before the reply lands. */
  typingMs: number;
  messages: ScriptedMessage[];
}

export const fallbackReply: ScriptedReply = {
  typingMs: 1800,
  messages: [
    {
      kind: "text",
      body: "Sounds good — send me a time that works and I'll hold it for you.",
    },
  ],
};

/**
 * Replies for a conversation you've just opened with somebody you've never
 * messaged. Deliberately craft-agnostic — these have to work for all of the
 * teachers, so they answer the shape of the question rather than the subject.
 */
export const firstContactReplies: ScriptedReply[] = [
  {
    match: ["hello", "hi ", "hey"],
    typingMs: 1500,
    messages: [
      {
        kind: "text",
        body: "Hello! Tell me roughly where you're at with it and what's going wrong — I'll know from that whether an hour will fix it.",
      },
    ],
  },
  {
    match: ["never", "beginner", "start", "new", "scratch"],
    typingMs: 2000,
    messages: [
      {
        kind: "text",
        body: "Complete beginners are the easiest, honestly. You've got no bad habits to undo yet.",
      },
      {
        kind: "text",
        body: "First hour I'd just get you doing it badly and then fix the two things that matter. Bring nothing.",
      },
    ],
  },
  {
    match: ["when", "free", "weekend", "time", "available", "saturday", "sunday"],
    typingMs: 1600,
    messages: [
      {
        kind: "text",
        body: "My open times are on my profile — whatever's showing there is genuinely free. Book whichever suits and I'll confirm.",
      },
    ],
  },
  {
    match: ["bring", "need", "buy", "kit", "equipment", "tools"],
    typingMs: 1800,
    messages: [
      {
        kind: "text",
        body: "Nothing for the first hour. I'd rather you used mine and found out what you actually like before spending anything.",
      },
    ],
  },
  {
    match: ["friend", "two of us", "together", "group", "partner"],
    typingMs: 1700,
    messages: [
      {
        kind: "text",
        body: "Bring them — it's a bit more per hour for me but a lot less each for you, and people learn faster with someone to be rubbish alongside.",
      },
    ],
  },
  {
    match: ["where", "address", "place", "meet", "come to"],
    typingMs: 1600,
    messages: [
      {
        kind: "text",
        body: "Usually mine, and I send the exact address once a lesson is confirmed. If you'd rather meet somewhere public first, that's completely fine — plenty of people do.",
      },
    ],
  },
  {
    match: ["cost", "price", "how much", "rate", "pay"],
    typingMs: 1500,
    messages: [
      {
        kind: "text",
        body: "The rate on my profile is the whole thing — no materials charge on top for a first lesson.",
      },
    ],
  },
];

/**
 * Replies for a conversation opened by starting a circle, where the teacher is
 * weighing up hosting a group rather than a one-to-one hour.
 */
export const circleReplies: ScriptedReply[] = [
  {
    match: ["bring", "need", "buy", "kit", "equipment"],
    typingMs: 2000,
    messages: [
      {
        kind: "text",
        body: "Nothing to buy before the first one — I keep enough spares for a group that size. If people want their own afterwards I'll tell you what's worth it.",
      },
    ],
  },
  {
    match: ["where", "address", "place", "meet"],
    typingMs: 1700,
    messages: [
      {
        kind: "text",
        body: "My place, and I'll send the exact address once everyone's confirmed. There's room for that many round the table.",
      },
    ],
  },
  {
    match: ["friend", "more", "another", "extra", "bigger"],
    typingMs: 1800,
    messages: [
      {
        kind: "text",
        body: "Bring whoever you like up to the number you've set. Past that it stops being a circle and I'd rather run it as a proper class.",
      },
    ],
  },
  {
    match: ["cheap", "price", "cost", "pay", "split"],
    typingMs: 1900,
    messages: [
      {
        kind: "text",
        body: "You each pay your own share and it drops every time somebody joins — you'll see the number move on the card above.",
      },
    ],
  },
];

export const demoScripts: Record<string, ScriptedReply[]> = {
  /* Rosa — knitting. Already has a shared link in the history. */
  t1: [
    {
      match: ["bring", "need", "buy", "yarn", "needle"],
      typingMs: 2200,
      messages: [
        {
          kind: "text",
          body: "Just the needles and one ball of yarn. Don't buy a pattern yet — you won't need one for the first hour.",
        },
        {
          kind: "product",
          gearId: "g2",
          body: "This is the yarn I'd get. One ball is plenty.",
        },
      ],
    },
    {
      match: ["thursday", "saturday", "when", "time", "free", "weekend"],
      typingMs: 1600,
      messages: [
        {
          kind: "text",
          body: "Thursday at 6:30 works well — the light's better in my front room in the evening, oddly enough. Shall I hold it?",
        },
      ],
    },
    {
      match: ["friend", "someone", "two of us", "together"],
      typingMs: 1900,
      messages: [
        {
          kind: "text",
          body: "Please do. Two is easier than one honestly — you can watch each other's hands. It's $59 for the pair rather than $45 each.",
        },
      ],
    },
    {
      match: ["where", "meet", "address", "come to"],
      typingMs: 1500,
      messages: [
        {
          kind: "text",
          body: "My place, five minutes from Davis. I'll send the exact address once we've settled on a time.",
        },
      ],
    },
    {
      typingMs: 1700,
      messages: [
        {
          kind: "text",
          body: "No rush — have a think and message me whenever. I've got space most of next week too.",
        },
      ],
    },
  ],

  /* Marcus — sourdough. Booking already confirmed. */
  t2: [
    {
      match: ["bring", "need", "buy", "flour", "equipment", "kit"],
      typingMs: 2400,
      messages: [
        {
          kind: "text",
          body: "I bring flour and a starter, so nothing essential. The one thing genuinely worth owning is a scale — cups are why most first loaves fail.",
        },
        { kind: "product", gearId: "g4" },
      ],
    },
    {
      match: ["banneton", "basket", "proof", "shape"],
      typingMs: 2000,
      messages: [
        {
          kind: "text",
          body: "Not for the first session — a colander and a tea towel does the same job. If you keep going, get one of these.",
        },
        { kind: "product", gearId: "g3" },
      ],
    },
    {
      match: ["starter", "feed", "night before"],
      typingMs: 1600,
      messages: [
        {
          kind: "text",
          body: "Feed it about 9pm the night before and then leave it alone. Poking it is the most common mistake and it's a hard habit to break.",
        },
      ],
    },
    {
      typingMs: 1800,
      messages: [
        {
          kind: "text",
          body: "See you Wednesday at 8. Clear a bit of counter space and we'll be fine.",
        },
      ],
    },
  ],

  /* Dana — bike repair. Starts with no shared links, so the drawer only
     appears once she sends one. This is the thread to demo from. */
  t3: [
    {
      match: ["bring", "need", "buy", "tool", "kit"],
      typingMs: 2300,
      messages: [
        {
          kind: "text",
          body: "Nothing — I've got every tool here. Though most people leave wanting their own set, so I'll show you the two that actually matter.",
        },
        { kind: "product", gearId: "g5", body: "This lives in a jersey pocket and covers every bolt on a normal bike." },
        { kind: "product", gearId: "g6", body: "And these. Eight dollars, basically unbreakable, saves you an hour by the roadside." },
      ],
    },
    {
      match: ["puncture", "flat", "tyre", "tire"],
      typingMs: 1700,
      messages: [
        {
          kind: "text",
          body: "That's the first thing we do. Once you've done it with your own hands twice it stops being frightening.",
        },
      ],
    },
    {
      match: ["sunday", "when", "time", "10", "free", "weekend"],
      typingMs: 1400,
      messages: [
        {
          kind: "text",
          body: "Sunday 10am, come whenever suits inside that. There'll be about a dozen of us and the stands are first come.",
        },
      ],
    },
    {
      typingMs: 1600,
      messages: [
        {
          kind: "text",
          body: "Bring it however bad it is. Genuinely — the worse it is, the more you learn.",
        },
      ],
    },
  ],

  /* Ellie — pottery. Also starts clean. */
  t4: [
    {
      match: ["bring", "need", "buy", "clay", "apron"],
      typingMs: 2100,
      messages: [
        {
          kind: "text",
          body: "Clay and aprons are included, so just short nails and clothes you don't mind ruining.",
        },
        {
          kind: "product",
          gearId: "g12",
          body: "If you want to practise at home between sessions, this is the stuff I use.",
        },
      ],
    },
    {
      match: ["saturday", "weekend", "when", "time"],
      typingMs: 1800,
      messages: [
        {
          kind: "text",
          body: "I can do Saturday the week after next. Get two or three people together and I'll open the studio for it.",
        },
      ],
    },
    {
      typingMs: 1600,
      messages: [
        {
          kind: "text",
          body: "Let me know either way — the wheels get booked up about a fortnight ahead.",
        },
      ],
    },
  ],
};
