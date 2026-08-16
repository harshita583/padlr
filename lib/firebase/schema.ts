import type { Timestamp } from "firebase/firestore";
import type { Tone } from "@/lib/types";

/**
 * Firestore document shapes.
 *
 * A few fields are denormalised on purpose — a thread carries the teacher's
 * name and initials, a booking carries both parties' names. Firestore has no
 * joins, and an inbox that needs a second read per row to show a name is an
 * inbox that renders in waterfalls. The cost is that a renamed account leaves
 * stale copies behind, which is the right trade for display names.
 */

export const collections = {
  users: "users",
  teachers: "teachers",
  threads: "threads",
  messages: "messages",
  bookings: "bookings",
  circles: "circles",
  events: "events",
  categories: "categories",
  gear: "gear",
} as const;

export type BookingStatus = "pending" | "confirmed" | "declined" | "cancelled";

export interface UserDoc {
  uid: string;
  /** "Priya N." — the only name form shown publicly. */
  displayName: string;
  firstName: string;
  lastInitial: string;
  email: string;
  photoURL: string | null;
  neighbourhood: string;
  bio: string;
  learning: string;
  idVerified: boolean;
  /** True once they've created a teaching profile. */
  isTeacher: boolean;
  stats: {
    lessons: number;
    categories: string[];
    groupLessons: number;
  };
  createdAt: Timestamp;
}

export interface TeacherDoc {
  uid: string;
  slug: string;
  name: string;
  initials: string;
  tone: Tone;
  headline: string;
  bio: string;
  neighbourhood: string;
  city: string;
  distanceMiles: number;
  hourlyRate: number;
  groupUplift: number;
  rating: number;
  reviewCount: number;
  lessonsTaught: number;
  responseTime: string;
  verified: boolean;
  categories: string[];
  skills: string[];
  formats: string[];
  availabilityWindows: string[];
  languages: string[];
  meetingNote: string;
  /** Day offsets are resolved to ISO dates when seeded. */
  availability: Array<{ date: string; slots: string[] }>;
  /** Hidden from search when false, without deleting the profile. */
  active: boolean;
}

export interface ThreadDoc {
  id: string;
  /** Exactly two uids. Rules key off this. */
  participantIds: string[];
  learnerId: string;
  teacherId: string;
  learnerName: string;
  teacherName: string;
  teacherSlug: string;
  teacherInitials: string;
  teacherTone: Tone;
  teacherRate: number;
  skill: string;
  categorySlug: string;
  lastActivity: Timestamp;
  lastPreview: string;
  /** uid → unread count. */
  unread: Record<string, number>;
}

export type MessageKindDoc = "text" | "product" | "booking" | "system";

export interface MessageDoc {
  id: string;
  authorId: string;
  kind: MessageKindDoc;
  body?: string;
  gearId?: string;
  bookingId?: string;
  badgeId?: string;
  sentAt: Timestamp;
}

export interface BookingDoc {
  id: string;
  learnerId: string;
  learnerName: string;
  teacherId: string;
  teacherName: string;
  teacherSlug: string;
  threadId: string;
  skill: string;
  categorySlug: string;
  /** ISO date, e.g. "2026-08-22". */
  date: string;
  /** 24h local time, e.g. "14:30". */
  time: string;
  /** The same moment as date + time, for range queries and sorting. */
  startsAt: Timestamp;
  durationMinutes: number;
  people: number;
  total: number;
  status: BookingStatus;
  createdAt: Timestamp;
  decidedAt: Timestamp | null;
}

export interface CircleDoc {
  id: string;
  hostId: string;
  hostName: string;
  teacherId: string;
  teacherName: string;
  teacherSlug: string;
  title: string;
  skill: string;
  categorySlug: string;
  level: string;
  neighbourhood: string;
  startsAt: Timestamp;
  durationMinutes: number;
  seatsTotal: number;
  /** Everyone in, host included. Length drives the price. */
  memberIds: string[];
  /** uid → display name, so the member list renders without extra reads. */
  memberNames: Record<string, string>;
  /** The teacher's hourly rate and per-extra-person uplift at time of creation. */
  baseRate: number;
  groupUplift: number;
  tone: Tone;
  visibility: "open" | "private";
  /** The bit in the share link. Unguessable enough for a private circle. */
  shareCode: string;
  createdAt: Timestamp;
}

/**
 * What a circle costs right now, given who's in it.
 *
 * Deliberately a pure function of the document: every client computes the same
 * number from the same data, so the price updates the instant a member joins
 * without anything having to write it down.
 */
export function circlePricing(circle: Pick<
  CircleDoc,
  "baseRate" | "groupUplift" | "durationMinutes" | "memberIds" | "seatsTotal"
>) {
  const hours = circle.durationMinutes / 60;
  const count = Math.max(1, circle.memberIds.length);
  const totalFor = (n: number) =>
    Math.round(circle.baseRate * hours + circle.groupUplift * (n - 1) * hours);

  const total = totalFor(count);
  const seatsOpen = Math.max(0, circle.seatsTotal - count);

  return {
    count,
    seatsOpen,
    isFull: seatsOpen === 0,
    total,
    perPerson: Math.round(total / count),
    /** What each person would pay if one more joined. */
    perPersonIfOneMore:
      seatsOpen > 0 ? Math.round(totalFor(count + 1) / (count + 1)) : null,
  };
}
