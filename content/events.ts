/** Classes & events copy — the listing page and the detail page. */

export const events = {
  meta: {
    title: "Classes & events near you",
    description:
      "Small group classes hosted by local teachers. Book a seat, or bring the whole group.",
  },
  index: {
    eyebrow: "The calendar",
    headlineLines: ["Show up,", "learn something"] as const,
    body: "Every one of these is hosted by somebody local, capped at a small number of people, and finished inside an afternoon.",
    filters: {
      legend: "Filter events",
      whenLabel: "When",
      whenOptions: [
        { value: "any", label: "Any time" },
        { value: "week", label: "This week" },
        { value: "weekend", label: "This weekend" },
        { value: "month", label: "This month" },
      ],
      categoryLabel: "Category",
      categoryAll: "All categories",
      priceLabel: "Price",
      priceOptions: [
        { value: "any", label: "Any price" },
        { value: "free", label: "Free" },
        { value: "under-40", label: "Under $40" },
        { value: "under-80", label: "Under $80" },
      ],
    },
    listLabel: "Upcoming classes and events",
    emptyTitle: "Nothing scheduled in that window",
    emptyBody: "Widen the dates, or follow a teacher to hear when they add one.",
  },
  detail: {
    hostedBy: "Hosted by",
    aboutLabel: "About this class",
    bringLabel: "What to bring",
    scheduleLabel: "How the session runs",
    locationLabel: "Where",
    locationNote: "Full address is sent to you once you've booked.",
    capacityLabel: "Group size",
    capacityFor: (taken: number, cap: number) =>
      `${taken} of ${cap} spots taken`,
    priceLabel: "Per person",
    freeLabel: "Free",
    reserve: "Reserve your spot",
    reserveHint: "Free cancellation up to 24 hours before.",
    soldOut: "This one's full",
    waitlist: "Join the waitlist",
    bringFriends: {
      title: "Coming with people?",
      body: "Book three or more seats together and everyone pays less.",
      cta: "Book seats for a group",
    },
    hostOther: "More from this teacher",
    share: "Share this class",
  },
  card: {
    spotsFor: (n: number) => `${n} ${n === 1 ? "spot" : "spots"} left`,
    fullLabel: "Full",
    freeLabel: "Free",
  },
} as const;
