/**
 * Sign-up copy.
 *
 * The flow exists mostly for safety. Teachers meet strangers, often in their
 * own homes — so a learner with a real name, a face and a couple of lines
 * about themselves is the thing that makes accepting a booking reasonable.
 * The copy should say that plainly rather than dress it up as "personalising
 * your experience".
 */

export const join = {
  meta: {
    title: "Create your profile",
    description:
      "A short profile so teachers know who they're meeting. Takes about two minutes.",
  },

  hero: {
    eyebrow: "Join Padlr",
    title: "Teachers meet strangers. Help them out.",
    body: "Most of our teachers work from their own kitchen, garage or studio. A real name and two lines about yourself is the difference between them accepting your booking and ignoring it.",
  },

  progress: {
    label: "Sign-up progress",
    stepOf: (current: number, total: number) => `Step ${current} of ${total}`,
  },

  nav: {
    back: "Back",
    next: "Continue",
    finish: "Create my profile",
    skip: "Skip for now",
  },

  steps: [
    {
      id: "you",
      title: "Who are you?",
      body: "Your first name and last initial is what teachers see. We never show your full surname publicly.",
    },
    {
      id: "about",
      title: "A couple of lines about you",
      body: "This is the bit teachers actually read before accepting. It doesn't need to be clever — why you want to learn is plenty.",
    },
    {
      id: "safety",
      title: "Verify it's you",
      body: "The part that makes the whole thing work. Teachers see a badge, never your documents.",
    },
    {
      id: "review",
      title: "How you'll look",
      body: "This is exactly what a teacher sees when you message them.",
    },
  ],

  fields: {
    firstName: { label: "First name", placeholder: "Priya" },
    lastInitial: { label: "Last initial", placeholder: "N", hint: "Just the letter." },
    email: { label: "Email", placeholder: "you@example.com" },
    neighbourhood: {
      label: "Neighbourhood",
      placeholder: "Somerville",
      hint: "Used to find teachers near you. Never shown to the exact street.",
    },
    bio: {
      label: "About you",
      placeholder:
        "I've been trying to learn to knit off YouTube for a month and keep giving up on the first row.",
      hint: "Two or three sentences. What you want to learn, and why.",
      counter: (n: number, max: number) => `${n} of ${max} characters`,
    },
    learning: {
      label: "What do you want to learn first?",
      placeholder: "Knitting",
    },
    phone: {
      label: "Mobile number",
      placeholder: "(617) 555 0134",
      hint: "For booking reminders and to confirm you're a real person. Never shown to teachers.",
    },
    photo: {
      label: "Profile photo",
      hint: "Optional, but teachers accept bookings from people with a photo far more often.",
      action: "Choose a photo",
      chosen: "Photo added",
      remove: "Remove",
    },
    teaching: {
      label: "I'd also like to teach something",
      hint: "You'll get a couple of extra questions and an ID check.",
    },
  },

  safety: {
    title: "Why we ask",
    points: [
      "Teachers can see you're a verified person before they let you into their home.",
      "You can see the same badge on them. It runs both ways.",
      "Your documents are checked and deleted. We keep the badge, not the ID.",
      "Your phone number and surname are never shown to anyone you book.",
    ],
    idCheck: {
      title: "Photo ID check",
      body: "A driving licence or passport, checked in about a minute.",
      action: "Start ID check",
      pending: "Checking…",
      done: "Verified",
      skipNote: "You can do this later, but most teachers won't accept a first booking without it.",
    },
    guidelines: {
      label: "I've read the community guidelines",
      linkLabel: "Read them",
      href: "/",
      required: "Please confirm you've read the guidelines.",
    },
  },

  review: {
    previewLabel: "Your profile",
    badgeVerified: "ID verified",
    badgeUnverified: "Not yet verified",
    learningLabel: "Wants to learn",
    editLabel: "Change something",
  },

  done: {
    title: "You're set up",
    body: "Your profile is live. Teachers will see it the moment you message them.",
    primary: { label: "Find a teacher", href: "/discover" },
    secondary: { label: "Browse classes", href: "/events" },
  },

  errors: {
    required: "This one's needed.",
    email: "That doesn't look like an email address.",
    bioShort: "A little more — one sentence at least.",
  },
} as const;
