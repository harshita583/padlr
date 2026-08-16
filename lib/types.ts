/**
 * Domain types.
 *
 * These are written the way a real database would return them, so the mock
 * layer in `lib/data/` can be swapped for Postgres queries without any
 * component changing.
 */

/** Colour keys the UI can paint a card with. Maps to tokens in globals.css. */
export type Tone = "lemon" | "sage" | "sky" | "lilac" | "coral" | "olive" | "cream";

export interface Category {
  id: string;
  slug: string;
  name: string;
  tone: Tone;
  /** Short line shown on the tile. */
  blurb: string;
  teacherCount: number;
  /** Marks the two oversized tiles in the collage grid. */
  featured?: boolean;
}

export interface Review {
  id: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  skill: string;
  body: string;
}

export interface Availability {
  /** ISO date, e.g. "2026-08-19". */
  date: string;
  /** 24h times, e.g. ["09:00", "14:30"]. */
  slots: string[];
}

export interface Expert {
  id: string;
  slug: string;
  name: string;
  initials: string;
  tone: Tone;
  /** Optional real photo. Falls back to the initials block when absent. */
  photo?: string;
  headline: string;
  bio: string;
  neighbourhood: string;
  city: string;
  distanceMiles: number;
  /** Base rate in whole US dollars, per hour. */
  hourlyRate: number;
  /** Extra dollars added to the total for each additional learner. */
  groupUplift: number;
  rating: number;
  reviewCount: number;
  lessonsTaught: number;
  responseTime: string;
  verified: boolean;
  /** Category slugs this person teaches. */
  categories: string[];
  /** Free-text skills, used for search matching. */
  skills: string[];
  formats: Array<"one-to-one" | "group" | "class">;
  availabilityWindows: Array<"week" | "weekend" | "evenings">;
  languages: string[];
  meetingNote: string;
  /** Gear ids this teacher recommends. */
  gear: string[];
  availability: Availability[];
  reviews: Review[];
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  tone: Tone;
  hostId: string;
  categorySlug: string;
  /** ISO datetime. */
  startsAt: string;
  durationMinutes: number;
  /** Price per seat in whole US dollars. 0 means free. */
  price: number;
  capacity: number;
  booked: number;
  venue: string;
  neighbourhood: string;
  distanceMiles: number;
  level: "Absolute beginner" | "Beginner" | "Some experience" | "All levels";
  summary: string;
  about: string[];
  bring: string[];
  schedule: Array<{ time: string; label: string }>;
}

/** A product a teacher can share in chat, or that appears in the gear rail. */
export interface GearItem {
  id: string;
  name: string;
  vendor: string;
  tone: Tone;
  price: string;
  blurb: string;
  url: string;
  /** True when Passalong earns a commission — surfaces the disclosure label. */
  affiliate: boolean;
  /** True when the vendor paid for placement — surfaces "Sponsored". */
  sponsored?: boolean;
  categorySlugs: string[];
}

export type MessageKind = "text" | "product" | "booking" | "system";

export interface Message {
  id: string;
  kind: MessageKind;
  /** "me" is the signed-in learner; anything else is the other party's id. */
  authorId: string;
  sentAt: string;
  body?: string;
  /** Set when `kind === "product"`. */
  gearId?: string;
  /** Set when `kind === "booking"`. */
  booking?: {
    date: string;
    time: string;
    durationMinutes: number;
    people: number;
    total: number;
    status: "pending" | "confirmed";
  };
}

export interface Thread {
  id: string;
  expertId: string;
  skill: string;
  lastActivity: string;
  unread: number;
  messages: Message[];
}

export interface Circle {
  id: string;
  title: string;
  tone: Tone;
  hostName: string;
  expertId: string;
  skill: string;
  neighbourhood: string;
  startsAt: string;
  seatsTotal: number;
  seatsTaken: number;
  /** Current per-person price given how many have joined. */
  pricePerPerson: number;
  /** What it drops to if one more person joins. */
  priceIfOneMore: number;
  level: string;
}
