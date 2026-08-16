/** Inbox and conversation copy. */

export const messages = {
  meta: {
    title: "Messages",
    description: "Talk to your teacher, agree a time and place, and share kit links.",
  },
  inbox: {
    title: "Messages",
    listLabel: "Conversations",
    searchLabel: "Search conversations",
    searchPlaceholder: "Search by name or skill",
    emptyTitle: "No messages yet",
    emptyBody: "Once you message a teacher, the conversation shows up here.",
    emptyCta: { label: "Find a teacher", href: "/discover" },
    unreadLabel: (n: number) => `${n} unread`,
    openConversation: (name: string) => `Open conversation with ${name}`,
    /** A conversation opened from a profile, before anything has been said. */
    contactPreview: "You haven't said anything yet",
    /** One-line previews for a circle request sitting in the inbox. */
    circlePreview: {
      pending: "Circle request — waiting on them",
      open: "Circle confirmed — share the link",
      declined: "Couldn't host this one",
    },
  },
  thread: {
    landmarkLabel: "Conversation",
    backToInbox: "All messages",
    /** Sub-header under the teacher's name. */
    contextFor: (skill: string, rate: number) => `${skill} · $${rate}/hr`,
    viewProfile: "View profile",
    bookCta: "Book an hour",
    historyLabel: "Message history",
    dayDividerToday: "Today",
    dayDividerYesterday: "Yesterday",
    /** Announced to screen readers when a new message arrives. */
    newMessageAnnouncement: (name: string) => `New message from ${name}`,
    /** Shown while the simulated teacher is composing a reply. */
    typingLabel: (name: string) => `${name} is typing…`,
    /** Banner marking the conversation as a demo, not a real teacher. */
    demoBanner: "Demo conversation — replies are simulated so you can walk through the flow.",
    /** Shown in a conversation you've opened but not yet said anything in. */
    newConversationFor: (name: string) =>
      `This is the start of your conversation with ${name}. Tell them what you're trying to learn and where you're stuck — that's what they need to know.`,
  },
  composer: {
    label: "Write a message",
    placeholder: "Say hello, or ask what you should bring…",
    send: "Send",
    sendA11y: "Send message",
    attach: "Attach a photo",
    hint: "Press Enter to send, Shift + Enter for a new line.",
    quickReplies: {
      label: "Quick replies",
      items: [
        "What should I bring?",
        "Are you free this weekend?",
        "Can I bring a friend?",
        "Where would we meet?",
      ],
    },
  },
  /** The rich preview a teacher's shared link unfurls into. */
  productCard: {
    sentByLabel: (name: string) => `${name} shared a link`,
    viewItem: "View item",
    disclosure: "Affiliate link",
    savedLabel: "Saved to your list",
    save: "Save for later",
    /** Screen-reader description of the whole preview card. */
    a11yLabel: (sender: string, name: string, vendor: string, price: string) =>
      `Link shared by ${sender}: ${name} from ${vendor}, ${price}`,
  },
  /**
   * The shopping drawer above the composer.
   *
   * It stays hidden until the teacher has shared at least one link, and the
   * learner can close it at any point.
   */
  gearDrawer: {
    /** The one line that opens and closes the whole thing. */
    title: "Things you might need",
    label: "Things you might need for this lesson",
    /** Screen-reader-only, since the visible line is the only control. */
    expandLabel: "Show things you might need",
    collapseLabel: "Hide things you might need",
    sponsoredBadge: "Sponsored",
    affiliateBadge: "Affiliate",
  },
  /** The pinned booking summary at the top of a thread. */
  bookingBanner: {
    upcomingLabel: "Upcoming lesson",
    pendingLabel: "Waiting on the teacher",
    manage: "Manage booking",
    addToCalendar: "Add to calendar",
  },

  /** The booking overlay opened from the conversation header. */
  bookingDialog: {
    open: "Book an hour",
    titleFor: (name: string) => `Book an hour with ${name}`,
    intro: "Pick a time and send the request. Nothing is charged until they confirm it.",
    close: "Close",
    closeLabel: "Close booking",
    submit: "Send request",
    submitting: "Sending…",
    noSlots: "No open times this week — send them a message instead.",
    /** Announced when the dialog opens. */
    openedAnnouncement: "Booking form opened",
  },

  /** The appointment card that lands in the conversation after booking. */
  bookingCard: {
    pendingTitle: (name: string) => `Waiting on ${name}`,
    confirmedTitle: "Lesson confirmed",
    declinedTitle: "Not this time",
    lengthLabel: "Length",
    peopleLabel: "Who's coming",
    totalLabel: "Total",
    pendingNote: "You haven't been charged. If they can't make it, nothing happens.",
    confirmedNote: "Added to your lessons. Free cancellation up to 24 hours before.",
    declinedNote: "No charge. Try another time, or find someone else nearby.",
    /**
     * The teacher's controls, shown on the learner's screen only because this
     * is a demo — it lets you show both sides of the handshake in one window.
     */
    teacherControlsLabel: "Teacher's side — demo only",
    approve: "Approve",
    decline: "Can't make it",
    /** What the teacher says once they've decided. */
    approveReply: "That works — see you then. I'll message you the exact address the day before.",
    declineReply:
      "Sorry, I'm booked that afternoon. I've got Thursday evening or Saturday morning free if either suits?",
    /** Only offered once a lesson is confirmed. */
    share: "Share this",
  },

  /**
   * A circle request, sent to the teacher as soon as it's created.
   *
   * Same handshake as a booking: it sits in the conversation until the teacher
   * agrees, and nobody can take a seat before then.
   */
  circleCard: {
    pendingTitle: (name: string) => `Waiting on ${name}`,
    openTitle: "Circle confirmed",
    declinedTitle: "Not this time",
    lengthLabel: "Length",
    seatsLabel: "Seats",
    levelLabel: "Level",
    eachLabel: "Each right now",
    seatsFor: (open: number, total: number) => `${open} of ${total} open`,
    pendingNote:
      "Nobody can take a seat until they agree to host it, and you haven't been charged.",
    openNote: "Share the link — the price drops for everyone each time somebody joins.",
    declinedNote: "No charge. Try another time, or another teacher.",
    /** Mirrors the booking card: both sides of the handshake in one window. */
    teacherControlsLabel: "Teacher's side — demo only",
    approve: "Agree to host",
    decline: "Can't make it",
    approveReply: (seats: number) =>
      `Happy to host that. Send the link round — I can take ${seats} of you, and the price comes down as they join.`,
    declineReply:
      "Sorry, I can't do a group that morning. If you can move it a week I'd be glad to — otherwise no hard feelings.",
    manage: "Manage this circle",
  },

  /** A conversation opened by starting a circle rather than by messaging. */
  circleThread: {
    contextFor: (skill: string) => `Circle · ${skill}`,
    /** The message sent on the learner's behalf when the circle is created. */
    openingFor: (skill: string, when: string, seats: number) =>
      `Hi — I'd like to get a small group together for ${skill}, ${when}. Up to ${seats} of us including me. Would you be up for hosting it?`,
    missingTitle: "That circle isn't on this browser",
    missingBody:
      "Circles are saved to the device that made them, so a link from another browser won't open here yet.",
    missingCta: { label: "See your circles", href: "/circles" },
  },

  /**
   * Sharing a confirmed lesson.
   *
   * The exact address and the teacher's surname are never shareable — a public
   * post saying where somebody teaches, and when they'll be alone with a
   * stranger, is a safety problem. The date and time are opt-in for the same
   * reason.
   */
  shareDialog: {
    title: "Share your lesson",
    intro:
      "Tell people what you're learning. We leave out anything that says where your teacher lives.",
    /** The safety toggle. Off by default, deliberately. */
    includeWhen: "Include the date and time",
    includeWhenHint:
      "Off by default. Posting when and where you'll be is worth a second thought — for you and for your teacher.",
    neverShared: "Never included: the address, and your teacher's full name.",
    /** `skill` is the lesson subject; `when` is empty unless opted in. */
    textFor: (skill: string, when: string) =>
      when
        ? `I'm learning ${skill} ${when} with a teacher near me, booked on Padlr.`
        : `I'm learning ${skill} with a teacher near me, booked on Padlr.`,
  },
} as const;
