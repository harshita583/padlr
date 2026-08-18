/** "Teach a skill" — the teacher acquisition page. */

export const teach = {
  meta: {
    title: "Teach a skill",
    description:
      "Set your rate, set your hours, and get paid for teaching the thing you already know.",
  },
  hero: {
    eyebrow: "For teachers",
    posterLines: ["Get paid", "for what you", "already know"] as const,
    body: "You don't need a certificate. You need one skill and one free hour. Somebody within three miles is trying to learn it right now.",
    cta: { label: "Create a teacher profile", href: "/teach/apply" },
    secondary: { label: "See what people are asking for", href: "/discover" },
    stats: [
      { value: "$62", label: "median hourly rate" },
      { value: "95%", label: "of the fee is yours" },
      { value: "Weekly", label: "payouts, every Friday" },
    ],
  },
  earnings: {
    eyebrow: "The money",
    title: "Set a rate, keep nearly all of it",
    body: "You choose your hourly rate. Padlr takes 5% to cover payments, insurance and support. Payouts land every Friday.",
    calculator: {
      legend: "Estimate what you'd earn",
      rateLabel: "Your hourly rate",
      hoursLabel: "Hours you'd teach per week",
      resultLabel: "You'd take home",
      resultSuffix: "per week, after fees",
      feeNote: (fee: number) => `After the 5% platform fee ($${fee}).`,
    },
  },
  ways: {
    eyebrow: "Two ways to teach",
    title: "Private hours, or a room full",
    items: [
      {
        title: "One to one",
        body: "Somebody books an hour with you. You agree a place, you show them the thing, you get paid for the time.",
        points: ["You set the rate", "You approve every request", "Cancel free up to 24h before"],
      },
      {
        title: "Host a class",
        body: "Put a date on the calendar, cap the group size, and let people book seats. Good for anything that works better with a room.",
        points: ["Set your own group cap", "Charge per seat", "We handle the sign-ups"],
      },
    ],
  },
  steps: {
    eyebrow: "Getting started",
    title: "Live by the weekend",
    items: [
      { n: "01", title: "Tell us what you teach", body: "One skill is enough to start. Add more later." },
      { n: "02", title: "Verify who you are", body: "A quick ID check. Learners see the badge on your profile." },
      { n: "03", title: "Set your rate and hours", body: "Change either of them any time, from anywhere." },
      { n: "04", title: "Take your first booking", body: "We'll notify you the moment somebody nearby searches for your skill." },
    ],
  },
  /**
   * Signing up to teach.
   *
   * Longer than the learner flow on purpose: a teacher is asking strangers to
   * come to their home and pay them, so what they publish has to be enough for
   * somebody to decide on.
   */
  apply: {
    meta: {
      title: "Start teaching",
      description:
        "Set up a teacher profile: what you teach, what you charge, and when you're free.",
    },
    hero: {
      eyebrow: "Start teaching",
      title: "Set up your teaching profile",
      body: "Four short steps. Nothing is public until you've seen exactly how it looks, and you can change any of it later.",
    },
    progress: {
      label: "Sign-up progress",
      stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    },
    steps: [
      {
        id: "you",
        title: "Who you are",
        body: "Learners see your first name and last initial — never your full name, and never your address until a lesson is confirmed.",
      },
      {
        id: "craft",
        title: "What you teach",
        body: "Be specific. \"Sourdough shaping and scoring\" gets far more enquiries than \"baking\".",
      },
      {
        id: "terms",
        title: "Your rate and your hours",
        body: "You set both. Padlr takes 5% of what you charge and handles the payment.",
      },
      {
        id: "safety",
        title: "Safety, then a look at your profile",
        body: "The same checks we ask of learners, plus a preview of exactly what they'll see.",
      },
    ],
    fields: {
      firstName: { label: "First name", placeholder: "Rosa" },
      lastInitial: { label: "Last initial", placeholder: "A", hint: "Just the letter." },
      email: { label: "Email", placeholder: "you@example.com" },
      neighbourhood: {
        label: "Neighbourhood",
        placeholder: "Somerville",
        hint: "Roughly where you'd teach. Learners see the area, not the address.",
      },
      category: { label: "Craft", placeholder: "Pick one" },
      skills: {
        label: "What you'd teach",
        placeholder: "Casting on\nFixing dropped stitches\nReading a pattern",
        hint: "One per line. These are what people search for.",
      },
      headline: {
        label: "One line about you",
        placeholder: "Twenty years of knitting and a lot of patience for beginners",
        hint: "The first thing anyone reads. Keep it human.",
      },
      bio: {
        label: "A bit more",
        placeholder:
          "How you learned it, who you're good at teaching, and what a first hour with you is like.",
        counter: (n: number, max: number) => `${n} / ${max}`,
      },
      rate: { label: "Your hourly rate", hint: "You can change this whenever you like." },
      uplift: {
        label: "Extra per additional learner",
        hint: "What you add for each person beyond the first, so a group is worth your while.",
      },
      formats: {
        legend: "How you'd like to teach",
        options: [
          { value: "one-to-one", label: "One to one" },
          { value: "group", label: "Small groups" },
          { value: "class", label: "Bigger classes" },
        ],
      },
      days: {
        legend: "Days you're usually free",
        hint: "A rough guide. You confirm each lesson individually.",
        options: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
    },
    earnings: {
      label: "What you'd keep",
      perHour: (take: string, gross: string) => `${take} of every ${gross} hour`,
      note: "Padlr's 5% covers payments, the messaging, and cover if something goes wrong.",
      groupExample: (each: string, total: string, n: number) =>
        `A group of ${n} pays ${each} each — ${total} to you for the same hour.`,
    },
    safety: {
      title: "Because people are coming to your home",
      points: [
        "Learners have to have a profile before they can book you.",
        "You approve every lesson. Nothing lands in your calendar without you.",
        "Your address is only shared once you've confirmed a lesson.",
        "Either side can cancel free up to 24 hours before.",
      ],
      idCheck: {
        title: "Verify your identity",
        body: "A verified badge roughly doubles how many people message a new teacher. It takes a minute.",
        action: "Verify with photo ID",
        pending: "Checking…",
        done: "Identity verified",
        skipNote: "You can skip this and do it later, but you'll get fewer enquiries.",
      },
      guidelines: {
        label: "I've read and I'll follow the",
        linkLabel: "teaching guidelines",
        href: "/teach",
        required: "Please confirm you'll follow the guidelines.",
      },
    },
    review: {
      previewLabel: "How you'll appear in search",
      badgeVerified: "ID verified",
      badgeUnverified: "Not yet verified",
      newTeacher: "New teacher",
      teachesLabel: "Teaches",
      rateFor: (rate: string) => `${rate}/hr`,
    },
    errors: {
      required: "This one's needed.",
      email: "That doesn't look like an email address.",
      headlineShort: "A few more words — this is the first thing people read.",
      bioShort: "Say a little more. Around a sentence or two is plenty.",
      skills: "List at least one thing you'd teach.",
      rate: "Pick an hourly rate.",
      formats: "Pick at least one way you'd teach.",
    },
    nav: { back: "Back", next: "Continue", finish: "Publish my profile" },
    done: {
      title: "You're set up to teach",
      body: "Your profile is live. Enquiries arrive in Messages, and you approve every lesson before it's booked.",
      nextLabel: "What happens now",
      next: [
        "People searching your craft near you will see your profile.",
        "When somebody messages you it lands in Messages, same as anywhere else.",
        "You approve or decline each lesson, and get paid after it happens.",
      ],
      primary: { label: "Go to Messages", href: "/messages" },
      secondary: { label: "See how learners search", href: "/discover" },
      edit: "Start over",
    },
    /** The teaching panel on your account page. */
    panel: {
      eyebrow: "You teach on Padlr",
      rateFor: (rate: string, take: string) => `${rate}/hr — ${take} of it yours`,
      teachesLabel: "You teach",
      daysLabel: "Usually free",
      formatsLabel: "Lesson types",
      formatNames: {
        "one-to-one": "One to one",
        group: "Small groups",
        class: "Bigger classes",
      },
      messagesCta: { label: "Enquiries", href: "/messages" },
      dashboardCta: { label: "Earnings & schedule", href: "/teach/dashboard" },
      editCta: { label: "Change your details", href: "/teach/apply" },
    },
    /** Shown at the top of the form if a profile already exists. */
    existing: {
      title: (name: string) => `You already teach as ${name}`,
      body: "Filling this in again replaces what's there.",
      action: "Delete my teacher profile",
    },
  },

  /** /teach/dashboard — earnings, Padlr's cut, affiliate income, and the schedule. */
  dashboard: {
    meta: {
      title: "Earnings & schedule",
      description: "What you've made teaching, what Padlr took, and what's coming up.",
    },
    eyebrow: "Your teaching",
    title: "Earnings & schedule",
    body: "Fills in as lessons get confirmed and links get shared in Messages — nothing here is backdated or estimated from your rate.",
    stats: {
      payout: "You've earned",
      fee: "Padlr's cut",
      affiliate: "Affiliate income",
      lessons: "Lessons confirmed",
    },
    /** The honesty note under the affiliate figure — it's a projection, not a receipt. */
    affiliateNote:
      "Estimated: assumes a learner buys once you share a link. There's no way to confirm an actual purchase in this demo.",
    schedule: {
      title: "Your schedule",
      upcomingLabel: "Upcoming",
      pastLabel: "Already happened",
      peopleFor: (n: number) => (n === 1 ? "Just them" : `${n} people`),
      payoutLabel: "You keep",
      emptyTitle: "Nothing confirmed yet",
      emptyBody:
        "When you approve a lesson request in a conversation, it lands here with what you'll be paid.",
    },
    /** Shown if you land here without a teaching profile yet. */
    notYet: {
      title: "You're not set up to teach yet",
      body: "Earnings and your schedule show up here once you've published a teaching profile.",
      cta: { label: "Set up your profile", href: "/teach/apply" },
    },
    backCta: { label: "Back to your profile", href: "/profile" },
  },

  faq: {
    title: "Before you ask",
    items: [
      {
        q: "Do I need a qualification?",
        a: "No. Most teachers on Padlr are hobbyists who are simply further along than the person booking them. Learners can see your reviews and decide for themselves.",
      },
      {
        q: "Where am I supposed to teach?",
        a: "Wherever suits — your kitchen, their garage, a park, a community centre. You set the meeting point when you confirm the booking.",
      },
      {
        q: "What if somebody doesn't show up?",
        a: "You're paid in full for no-shows and for anything cancelled inside 24 hours.",
      },
      {
        q: "Can I recommend equipment to learners?",
        a: "Yes — share a link in chat, and if it's the kind that pays a commission, that commission is yours, not Padlr's. The learner sees a label on it either way, so there's no surprise.",
      },
      {
        q: "How do taxes work?",
        a: "You're an independent contractor. We send you a summary of your earnings each January and you file it yourself.",
      },
    ],
  },
  finalCta: {
    displayLines: ["Somebody is", "waiting to learn"] as const,
    body: "It takes about ten minutes to set up a profile.",
    cta: { label: "Start teaching", href: "/teach/apply" },
  },
} as const;
