/**
 * Shared UI strings.
 *
 * Anything a screen reader announces, or that appears on more than one page,
 * lives here so the vocabulary stays consistent.
 */

export const common = {
  actions: {
    book: "Book a lesson",
    message: "Send a message",
    viewProfile: "View profile",
    viewAll: "See all",
    save: "Save",
    saved: "Saved",
    share: "Share",
    reserve: "Reserve a spot",
    joinWaitlist: "Join the waitlist",
    back: "Back",
    clearFilters: "Clear filters",
    apply: "Apply",
    loadMore: "Load more",
  },
  labels: {
    perHour: "/hr",
    from: "From",
    spotsLeft: (n: number) => `${n} ${n === 1 ? "spot" : "spots"} left`,
    reviewCount: (n: number) => `${n} ${n === 1 ? "review" : "reviews"}`,
    lessonCount: (n: number) => `${n} lessons taught`,
    milesAway: (n: number) => `${n} mi away`,
    respondsIn: (t: string) => `Usually replies in ${t}`,
    verified: "ID verified",
    firstLessonFree: "First 30 min free",
  },
  a11y: {
    skipToContent: "Skip to main content",
    ratingOf: (rating: number, count: number) =>
      `Rated ${rating} out of 5 from ${count} reviews`,
    priceOf: (price: number) => `${price} US dollars per hour`,
    decorative: "",
    externalLink: "opens in a new tab",
    breadcrumb: "Breadcrumb",
    pagination: "Pagination",
    loading: "Loading",
  },
  empty: {
    title: "Nothing here yet",
    body: "Try widening your search radius, or clearing a filter or two.",
    action: "Clear filters",
  },
  /** Chrome for any share overlay — lessons, badges, whatever comes next. */
  share: {
    previewLabel: "What gets posted",
    closeLabel: "Close sharing",
    close: "Close",
    copy: "Copy text",
    copied: "Copied",
    nativeShare: "Share…",
    targetsLabel: "Share to",
    targets: {
      x: "X",
      whatsapp: "WhatsApp",
      facebook: "Facebook",
    },
  },
  /** Shown wherever we surface a paid partnership. Required, do not remove. */
  disclosure: {
    short: "Affiliate",
    long: "Padlr may earn a small commission on purchases made through these links. It never changes what you pay, and teachers are never paid to recommend a specific brand.",
    inChat:
      "This is a shared shopping link. Padlr may earn a commission if you buy through it.",
  },
} as const;
