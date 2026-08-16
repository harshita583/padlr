/** Teacher profile page copy. */

export const expert = {
  meta: {
    titleFor: (name: string, skill: string) => `${name} — ${skill} teacher`,
  },
  header: {
    teachesLabel: "Teaches",
    aboutLabel: "About",
    backToResults: "Back to search",
  },
  booking: {
    panelLabel: "Book a lesson",
    rateSuffix: "per hour",
    durationLabel: "How long?",
    durationOptions: [
      { value: "60", label: "1 hour" },
      { value: "90", label: "1.5 hours" },
      { value: "120", label: "2 hours" },
    ],
    peopleLabel: "How many of you?",
    peopleHint: "Bring friends — the per-person price drops as the group grows.",
    peopleOptions: [
      { value: "1", label: "Just me" },
      { value: "2", label: "2 people" },
      { value: "3", label: "3 people" },
      { value: "4", label: "4 people" },
    ],
    dateLabel: "Pick a day",
    timeLabel: "Pick a time",
    summaryLabel: "What you'll pay",
    lineItems: {
      lesson: "Lesson",
      extraLearners: "Extra learners",
      serviceFee: "Service fee",
      total: "Total",
      perPerson: "Each of you pays",
    },
    groupNote:
      "Splitting an hour is the cheapest way to learn — the teacher's time costs the same either way.",
    submit: "Request this lesson",
    submitHint: "You won't be charged until the teacher confirms.",
    messageInstead: "Have a question first? Message them",
    noSlots: "No open times in this window — message them to find one.",
  },
  sections: {
    reviews: {
      title: "What learners said",
      emptyTitle: "No reviews yet",
      emptyBody: "This teacher is new to Passalong.",
    },
    classes: {
      title: "Classes they host",
      body: "Scheduled sessions you can join without booking a private hour.",
      empty: "No scheduled classes right now.",
    },
    location: {
      title: "Where you'd meet",
      body: "Exact address is shared once a lesson is confirmed.",
    },
    similar: {
      title: "Other teachers nearby",
    },
  },
  badges: {
    verified: "ID verified",
    topRated: "Top rated",
    newHere: "New teacher",
    fastReply: "Replies fast",
  },
} as const;
