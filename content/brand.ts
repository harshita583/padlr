/**
 * Brand, navigation and footer copy.
 *
 * Change the product name in one place (`brand.name`) and it updates the
 * header, the page titles, the footer and the metadata.
 */

export const brand = {
  name: "Padlr",
  /** Used as the browser tab suffix and in the header lockup. */
  wordmark: "Padlr",
  tagline: "Learn it from someone down the street.",
  description:
    "Padlr connects you with local people who already know the thing you want to learn — and lets you book them by the hour, join their classes, or bring your friends along.",
  email: "hello@padlr.example",
  city: "Boston, MA",
} as const;

export const nav = {
  /** Primary navigation. Add or reorder freely. */
  primary: [
    { label: "Find a teacher", href: "/discover" },
    { label: "Classes & events", href: "/events" },
    { label: "Learn together", href: "/circles" },
    { label: "Teach a skill", href: "/teach" },
  ],
  /** The link that opens the inbox. */
  messages: { label: "Messages", href: "/messages" },
  signIn: { label: "Sign in", href: "/join" },
  cta: { label: "Get started", href: "/join" },
  /** Shown in place of the CTA once someone has a profile. */
  profile: {
    href: "/profile",
    labelFor: (name: string) => `Your profile — ${name}`,
  },
  /** Only shown to the rare person who's both signed up to teach and to learn. */
  roleSwitch: {
    label: "Switch between teaching and learning",
    teaching: "Teaching",
    learning: "Learning",
  },
  /** Accessible name for the mobile menu toggle. */
  menuOpenLabel: "Open main menu",
  menuCloseLabel: "Close main menu",
  landmarkLabel: "Main",
} as const;

export const footer = {
  blurb:
    "Every skill in the world is sitting in somebody's hands a few blocks away. We just make the introduction.",
  columns: [
    {
      title: "Learn",
      links: [
        { label: "Browse teachers", href: "/discover" },
        { label: "Upcoming classes", href: "/events" },
        { label: "Bring your friends", href: "/circles" },
        { label: "Gift a lesson", href: "/discover" },
      ],
    },
    {
      title: "Teach",
      links: [
        { label: "Start teaching", href: "/teach/apply" },
        { label: "How payouts work", href: "/teach" },
        { label: "Host a class", href: "/teach" },
        { label: "Teacher handbook", href: "/teach" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: "/" },
        { label: "Trust & safety", href: "/" },
        { label: "Accessibility", href: "/" },
        { label: "Contact", href: "/" },
      ],
    },
  ],
  legal: "© 2026 Padlr. Made for people who like learning in person.",
  socialLabel: "Follow Padlr",
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://tiktok.com" },
    { label: "Substack", href: "https://substack.com" },
  ],
} as const;
