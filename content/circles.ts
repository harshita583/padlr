/** "Learn together" — the social / group-pricing page. */

export const circles = {
  meta: {
    title: "Learn together",
    description:
      "Bring friends, split the hourly rate, or join an open circle of people learning the same thing.",
  },
  hero: {
    eyebrow: "Learn together",
    displayLines: ["Cheaper with", "company"] as const,
    body: "A teacher's hour costs the same whether one person shows up or five. Split it, and everyone pays less — so bring people.",
    cta: { label: "Start a circle", href: "/circles" },
    secondary: { label: "Browse open circles", href: "#open-circles" },
  },
  pricing: {
    eyebrow: "How the maths works",
    title: "The more of you, the less each",
    body: "Every teacher sets a group rate. Here's what a typical $70 hour looks like as the group grows.",
    tableCaption: "Per-person price by group size for a $70 hourly rate",
    columns: { size: "Group size", total: "Total", each: "Each person", save: "You save" },
    rows: [
      { size: "Just you", total: "$70", each: "$70", save: "—" },
      { size: "2 people", total: "$84", each: "$42", save: "40%" },
      { size: "3 people", total: "$96", each: "$32", save: "54%" },
      { size: "4 people", total: "$104", each: "$26", save: "63%" },
      { size: "5 people", total: "$110", each: "$22", save: "69%" },
    ],
    footnote:
      "Teachers add a small uplift per extra person, so they're paid fairly for a bigger room. You always see the exact split before you pay.",
  },
  steps: {
    title: "Three ways to do it",
    items: [
      {
        title: "Invite your own people",
        body: "Book a lesson, send a link, and everyone pays their own share at checkout. Nobody has to front the money.",
      },
      {
        title: "Open your booking up",
        body: "Booked an hour and have room? List the spare seats and let neighbours fill them. Your share drops as they join.",
      },
      {
        title: "Join an open circle",
        body: "Somebody near you already started one. Take an empty seat and pay only the per-person rate.",
      },
    ],
  },
  openCircles: {
    id: "open-circles",
    eyebrow: "Open right now",
    title: "Circles with room in them",
    body: "Started by people nearby. Take a seat and the price drops for everybody already in.",
    listLabel: "Open learning circles near you",
    joinCta: "Take a seat",
    fullLabel: "Full",
    seatsFor: (n: number) => `${n} ${n === 1 ? "seat" : "seats"} open`,
    priceNowFor: (each: string) => `${each} each right now`,
    priceDropNote: "Price drops again if one more person joins.",
    emptyTitle: "No open circles nearby",
    emptyBody: "Be the first — book a lesson and open your spare seats.",
  },
  faq: {
    title: "The awkward questions",
    items: [
      {
        q: "What if somebody drops out?",
        a: "The per-person price recalculates and everyone still in is only charged the new amount. Nobody gets stuck covering a no-show.",
      },
      {
        q: "Do we all have to pay at once?",
        a: "No. Each person checks out separately with their own card. The lesson confirms once everyone has paid or the teacher waives the rest.",
      },
      {
        q: "Can a circle be all beginners?",
        a: "That's most of them. Teachers set a level on each circle so you can tell before you join.",
      },
      {
        q: "Is there a maximum group size?",
        a: "The teacher sets it, usually between four and eight. Anything bigger is worth listing as a proper class.",
      },
    ],
  },
} as const;
