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
  },
} as const;
