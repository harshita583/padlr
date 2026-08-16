"use client";

/**
 * The signed-in learner, kept in localStorage.
 *
 * This stands in for accounts. It's browser-only and vanishes if you clear
 * site data — which is fine for a demo and obviously not fine for real users.
 * Replace the four functions below with API calls and nothing that consumes
 * them has to change.
 */

export interface LearnerStats {
  /** Lessons actually taken (a booking the teacher confirmed). */
  lessons: number;
  /** Category slugs the learner has taken at least one lesson in. */
  categories: string[];
  /** Lessons booked for more than one person. */
  groupLessons: number;
}

export interface Profile {
  firstName: string;
  lastInitial: string;
  email: string;
  neighbourhood: string;
  bio: string;
  learning: string;
  idVerified: boolean;
  createdAt: string;
  stats: LearnerStats;
}

const KEY = "padlr:profile";

/** Fired whenever the profile changes, so the header can re-read it. */
export const PROFILE_EVENT = "padlr:profile-changed";

export const emptyStats: LearnerStats = { lessons: 0, categories: [], groupLessons: 0 };

export function readProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Profile;
    // Tolerate profiles saved before stats existed.
    return { ...parsed, stats: { ...emptyStats, ...parsed.stats } };
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(PROFILE_EVENT));
}

export function clearProfile(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(PROFILE_EVENT));
}

/**
 * Bank a completed lesson. Returns the updated profile, or null if nobody is
 * signed in — badges are only earned by people with an account.
 */
export function recordLesson({
  categorySlug,
  people,
}: {
  categorySlug: string;
  people: number;
}): Profile | null {
  const profile = readProfile();
  if (!profile) return null;

  const next: Profile = {
    ...profile,
    stats: {
      lessons: profile.stats.lessons + 1,
      categories: profile.stats.categories.includes(categorySlug)
        ? profile.stats.categories
        : [...profile.stats.categories, categorySlug],
      groupLessons: profile.stats.groupLessons + (people > 1 ? 1 : 0),
    },
  };
  saveProfile(next);
  return next;
}

/** "Priya N." — the only name form ever shown publicly. */
export function displayName(profile: Profile): string {
  return `${profile.firstName} ${profile.lastInitial.toUpperCase()}.`;
}

export function initialsOf(profile: Profile): string {
  return `${profile.firstName[0] ?? "?"}${profile.lastInitial[0] ?? ""}`.toUpperCase();
}
