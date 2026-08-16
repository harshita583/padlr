/** Search / browse results page copy. */

export const discover = {
  meta: {
    title: "Find a teacher near you",
    description:
      "Browse local teachers by skill, distance, price and availability.",
  },
  header: {
    eyebrow: "Teachers near you",
    /** `q` is the searched skill, `where` is the location. */
    titleFor: (q: string, where: string) =>
      q ? `${q} teachers in ${where}` : `Teachers in ${where}`,
    countFor: (n: number) =>
      `${n} ${n === 1 ? "person" : "people"} can teach you this`,
  },
  search: {
    skillLabel: "Skill",
    skillPlaceholder: "What do you want to learn?",
    locationLabel: "Location",
    locationPlaceholder: "Neighbourhood, city or ZIP",
    submit: "Update search",
  },
  filters: {
    legend: "Refine these results",
    toggleOpen: "Filters",
    toggleClose: "Hide filters",
    sort: {
      label: "Sort by",
      options: [
        { value: "recommended", label: "Recommended" },
        { value: "distance", label: "Closest first" },
        { value: "price-low", label: "Price: low to high" },
        { value: "price-high", label: "Price: high to low" },
        { value: "rating", label: "Highest rated" },
      ],
    },
    distance: {
      label: "Within",
      options: [
        { value: "2", label: "2 miles" },
        { value: "5", label: "5 miles" },
        { value: "10", label: "10 miles" },
        { value: "25", label: "25 miles" },
      ],
    },
    price: {
      label: "Max hourly rate",
      hint: "Drag to set the most you'd like to pay per hour.",
      formatFor: (v: number) => `$${v}/hr`,
    },
    format: {
      label: "Format",
      options: [
        { value: "one-to-one", label: "One to one" },
        { value: "group", label: "Small group" },
        { value: "class", label: "Scheduled class" },
      ],
    },
    availability: {
      label: "Available",
      options: [
        { value: "any", label: "Any time" },
        { value: "week", label: "This week" },
        { value: "weekend", label: "This weekend" },
        { value: "evenings", label: "Evenings" },
      ],
    },
  },
  /**
   * The results sidebar. Kept deliberately non-commercial — shopping links
   * only ever appear inside a conversation, once a teacher has shared one.
   */
  sidebar: {
    relatedTitle: "Also taught nearby",
    circlesTitle: "Bring someone with you",
    circlesBody:
      "Two of you splitting an hour costs far less each than booking it alone.",
    circlesCta: "See how that works",
    missingTitle: "Nobody teaching what you need?",
    missingBody:
      "Tell us the skill and we'll let you know the moment somebody nearby offers it.",
    missingCta: "Request a skill",
  },
  results: {
    landmarkLabel: "Search results",
    emptyTitle: "No teachers matched that",
    emptyBody:
      "Try a broader radius, a higher price ceiling, or a slightly different word for the skill.",
  },
} as const;
