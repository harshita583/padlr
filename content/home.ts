/**
 * Home page copy.
 *
 * Each exported object maps 1:1 to a section component in `components/home/`.
 * Rewrite any string here and the page updates — no component edits needed.
 */

export const home = {
  meta: {
    title: "Learn anything from someone nearby",
    description:
      "Find local teachers for the skill you want to learn, book them by the hour, join their classes, or learn alongside your friends.",
  },

  hero: {
    headline: "Someone nearby already knows how.",
    body: "Sourdough, sewing, standing on a surfboard, filing your own taxes. Search a skill, pick your neighbourhood, and book an hour with a real person who can show you.",
    search: {
      legend: "Find a teacher near you",
      skill: {
        label: "What do you want to learn?",
        placeholder: "Try “knitting”",
        /** Suggestions shown under the input as quick-fill chips. */
        suggestionsLabel: "Popular right now",
      },
      location: {
        label: "Where are you?",
        placeholder: "Neighbourhood, city or ZIP",
        useCurrent: "Use my current location",
        useCurrentBusy: "Finding you…",
      },
      submit: "Search",
      submitA11y: "Search for teachers",
    },
    chips: [
      { label: "Knitting", href: "/discover?q=knitting" },
      { label: "Sourdough", href: "/discover?q=sourdough" },
      { label: "Film photography", href: "/discover?q=film%20photography" },
      { label: "Bike repair", href: "/discover?q=bike%20repair" },
      { label: "Conversational Spanish", href: "/discover?q=spanish" },
    ],
    stat: {
      value: "1,840",
      label: "teachers within 10 miles of you",
    },
    /** Caption above the sample teacher card in the hero. */
    sampleLabel: "Free on Thursday",
  },

  categories: {
    eyebrow: "Browse by craft",
    title: "Pick a lane",
    body: "Every category is full of people teaching out of their kitchen, garage, studio or the park down the road.",
    viewAll: "Browse everything",
  },

  events: {
    eyebrow: "Happening near you",
    title: "Classes with a date on them",
    body: "Teachers host small group sessions all week. Grab a seat on your own, or bring people.",
    viewAll: "See the full calendar",
    railLabel: "Upcoming classes near you",
  },

  proof: {
    /** The big number panel, styled after the reference “84%” card. */
    stat: {
      value: "92%",
      label: "of first lessons end with a second one booked",
    },
    /** The quote panel next to it. */
    quote: {
      badge: "Learner story",
      text: "I'd watched maybe forty knitting videos. One hour with Rosa in her living room and I finally got it.",
      attribution: "Priya, learning to knit in Somerville",
    },
    /** The soft blue “timer” panel. */
    aside: {
      timer: "01:00",
      timerLabel: "One hour",
      caption: "That's usually all it takes to stop being a beginner.",
    },
  },

  together: {
    /** Styled after the reference “Together, we can” collage. */
    displayLines: ["Together,", "we can"] as const,
    body: "Split the cost with friends, or join a circle of people learning the same thing. The more of you there are, the less each hour costs.",
    cta: { label: "Start a learning circle", href: "/circles" },
    /** Collage chips. `tone` maps to a colour in the component. */
    chips: [
      { label: "Learn with a friend", tone: "lilac" },
      { label: "Set a goal together", tone: "sky" },
      { label: "Split the hourly rate", tone: "sage" },
      { label: "Join an open circle", tone: "lemon" },
      { label: "Just try something", tone: "coral" },
    ],
  },

  howItWorks: {
    eyebrow: "How it works",
    title: "Three steps, one afternoon",
    steps: [
      {
        n: "01",
        title: "Search your skill",
        body: "Type what you want to learn and where you are. We'll show you who's close, what they charge, and when they're free.",
      },
      {
        n: "02",
        title: "Message and agree a plan",
        body: "Chat directly with the teacher. They'll tell you what to bring — and can send links for anything you need to buy.",
      },
      {
        n: "03",
        title: "Meet up and learn",
        body: "Meet at their studio, your kitchen, or a park bench. You're charged by the hour, only for the time you booked.",
      },
    ],
  },

  testimonials: {
    title: "What people say after an hour",
    /** Scrolling chips, styled after the reference testimonial rail. */
    railLabel: "Recent reviews from learners",
    items: [
      { name: "Marcus", initials: "MO", text: "Very easy to follow", tone: "lemon" },
      { name: "Aisha", initials: "AK", text: "Feeling positive", tone: "sage" },
      { name: "Tom", initials: "TR", text: "Eye opening", tone: "lemon" },
      { name: "Dana", initials: "DL", text: "So far, so good", tone: "sky" },
      { name: "Chen", initials: "CW", text: "It was useful", tone: "lemon" },
      { name: "Rosa", initials: "RG", text: "Great info", tone: "lilac" },
      { name: "Ben", initials: "BS", text: "Already surprised", tone: "sage" },
      { name: "Kit", initials: "KA", text: "I'm feeling hopeful", tone: "lemon" },
      { name: "Nour", initials: "NH", text: "Very instructive", tone: "coral" },
      { name: "Sam", initials: "SP", text: "Loved how easy this was", tone: "lemon" },
    ],
  },

  /**
   * The teacher recruitment band. Deliberately the shortest section on the
   * page — one statement, one line, one link. Resist adding to it.
   */
  teachCta: {
    posterLines: ["You already", "know something"] as const,
    body: "Set your rate, set your hours, get paid for the time you teach.",
    cta: { label: "Start teaching", href: "/teach" },
  },
} as const;
