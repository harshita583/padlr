/**
 * Profile and badge copy.
 *
 * `badges` is keyed by the ids in `lib/badges.ts`. Add a rule there, add the
 * words here. `share` is what gets posted when someone shares the badge, so
 * write it as a sentence a person would actually send.
 */

export const profile = {
  meta: {
    title: "Your profile",
    description: "Your profile, what you've learned, and the badges you've picked up.",
  },

  header: {
    eyebrow: "Your profile",
    editLabel: "Edit profile",
    signOut: "Sign out",
    verified: "ID verified",
    unverified: "Not yet verified",
    verifyCta: "Finish verifying",
    memberSince: (date: string) => `On Padlr since ${date}`,
  },

  empty: {
    title: "No profile yet",
    body: "Create one and teachers can see who they'd be meeting. It takes about two minutes.",
    cta: { label: "Create your profile", href: "/join" },
  },

  stats: {
    title: "What you've done",
    lessons: "Lessons taken",
    categories: "Crafts tried",
    groupLessons: "Lessons with friends",
  },

  badges: {
    title: "Badges",
    body: "Picked up as you go. Share any of them.",
    earnedLabel: "Earned",
    lockedLabel: "Not yet",
    shareAction: "Share",
    emptyTitle: "No badges yet",
    emptyBody: "Take your first lesson and the first one lands automatically.",
    nextUpFor: (name: string, remaining: number) =>
      `${remaining} more ${remaining === 1 ? "lesson" : "lessons"} until ${name}.`,
    showLocked: "Show what's still to come",
    hideLocked: "Hide those",
  },

  /** Keyed by badge id. `share` is the post text. */
  badgeCopy: {
    "first-lesson": {
      name: "First lesson",
      blurb: "You booked an hour with a stranger and turned up. That's the hard part.",
      share: "I took my first lesson on Padlr.",
    },
    "three-lessons": {
      name: "Three down",
      blurb: "Three lessons in. This is officially a habit rather than a whim.",
      share: "Three lessons in on Padlr. It's a habit now.",
    },
    "ten-lessons": {
      name: "Ten deep",
      blurb: "Ten hours of being taught by people who live near you.",
      share: "Ten lessons with local teachers on Padlr.",
    },
    "two-categories": {
      name: "Two strings",
      blurb: "Two completely different crafts. Nice range.",
      share: "Two different crafts learned from people near me, on Padlr.",
    },
    "four-categories": {
      name: "Wide net",
      blurb: "Four different crafts. At this point you're just curious about everything.",
      share: "Four different crafts learned from neighbours, on Padlr.",
    },
    "brought-a-friend": {
      name: "Brought someone",
      blurb: "You dragged somebody along. Lessons are better with company.",
      share: "Learned something new with a friend, on Padlr.",
    },
    "cat-textiles": {
      name: "Yarn handler",
      blurb: "You've made something out of string.",
      share: "I can make things out of yarn now, thanks to a neighbour on Padlr.",
    },
    "cat-food": {
      name: "Fed yourself",
      blurb: "Something edible, made with your own hands.",
      share: "Learned to cook something properly, taught by someone down the road on Padlr.",
    },
    "cat-fix-it": {
      name: "Fixed it",
      blurb: "You repaired a thing instead of replacing it.",
      share: "Fixed it myself instead of paying someone. Learned how on Padlr.",
    },
    "cat-music": {
      name: "Made a noise",
      blurb: "A deliberate one, which is the difference.",
      share: "I can play something now. Learned from a local teacher on Padlr.",
    },
    "cat-outdoors": {
      name: "Went outside",
      blurb: "Learned something that doesn't fit indoors.",
      share: "Learned something outdoors from someone who actually does it, on Padlr.",
    },
    "cat-making": {
      name: "Built something",
      blurb: "It exists because you made it.",
      share: "Made a thing with my hands. Taught by a neighbour on Padlr.",
    },
    "cat-language": {
      name: "Said it out loud",
      blurb: "In a language that wasn't yours a month ago.",
      share: "Learning a language by actually speaking it, with someone near me on Padlr.",
    },
    "cat-money": {
      name: "Sorted the admin",
      blurb: "The dull thing you'd been avoiding. Done.",
      share: "Finally sorted the money admin I'd been avoiding, with help from Padlr.",
    },
    "cat-image": {
      name: "Took the shot",
      blurb: "You know what the dials do now.",
      share: "I know what the dials do now. Learned from a photographer near me on Padlr.",
    },
    "cat-growing": {
      name: "Kept it alive",
      blurb: "The plant is fine. You did that.",
      share: "My plants are alive, and it's because a neighbour taught me how on Padlr.",
    },
  },

  /** The award that pops into a conversation when a lesson is confirmed. */
  award: {
    label: "Badge earned",
    shareAction: "Share it",
    viewAll: "See all your badges",
  },
} as const;
