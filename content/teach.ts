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
    cta: { label: "Create a teacher profile", href: "/teach" },
    secondary: { label: "See what people are asking for", href: "/discover" },
    stats: [
      { value: "$62", label: "median hourly rate" },
      { value: "85%", label: "of the fee is yours" },
      { value: "Weekly", label: "payouts, every Friday" },
    ],
  },
  earnings: {
    eyebrow: "The money",
    title: "Set a rate, keep most of it",
    body: "You choose your hourly rate. Passalong takes 15% to cover payments, insurance and support. Payouts land every Friday.",
    calculator: {
      legend: "Estimate what you'd earn",
      rateLabel: "Your hourly rate",
      hoursLabel: "Hours you'd teach per week",
      resultLabel: "You'd take home",
      resultSuffix: "per week, after fees",
      feeNote: (fee: number) => `After the 15% platform fee ($${fee}).`,
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
  faq: {
    title: "Before you ask",
    items: [
      {
        q: "Do I need a qualification?",
        a: "No. Most teachers on Passalong are hobbyists who are simply further along than the person booking them. Learners can see your reviews and decide for themselves.",
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
        a: "Yes, and you can share shopping links in chat. If a link earns a commission, both you and the learner see a label on it. You're never paid to push a specific brand.",
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
    cta: { label: "Start teaching", href: "/teach" },
  },
} as const;
