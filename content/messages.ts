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
} as const;
