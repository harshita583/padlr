import type { LearnerStats } from "@/lib/profile";
import type { Tone } from "@/lib/types";

/**
 * Badge rules.
 *
 * The rules live here; the words live in `content/profile.ts`, keyed by id.
 * Add a badge by adding a definition here and a matching entry there — the
 * profile page and the chat award both pick it up.
 */
export interface BadgeDef {
  id: string;
  tone: Tone;
  /**
   * - `lessons`    — total lessons taken reaches `threshold`
   * - `category`   — at least one lesson in `categorySlug`
   * - `categories` — lessons in `threshold` different categories
   * - `group`      — `threshold` lessons booked for more than one person
   */
  kind: "lessons" | "category" | "categories" | "group";
  threshold?: number;
  categorySlug?: string;
}

export const badgeDefs: BadgeDef[] = [
  { id: "first-lesson", tone: "lemon", kind: "lessons", threshold: 1 },
  { id: "three-lessons", tone: "sage", kind: "lessons", threshold: 3 },
  { id: "ten-lessons", tone: "coral", kind: "lessons", threshold: 10 },

  { id: "two-categories", tone: "sky", kind: "categories", threshold: 2 },
  { id: "four-categories", tone: "lilac", kind: "categories", threshold: 4 },

  { id: "brought-a-friend", tone: "olive", kind: "group", threshold: 1 },

  { id: "cat-textiles", tone: "lemon", kind: "category", categorySlug: "textiles" },
  { id: "cat-food", tone: "sage", kind: "category", categorySlug: "food" },
  { id: "cat-fix-it", tone: "sky", kind: "category", categorySlug: "fix-it" },
  { id: "cat-music", tone: "coral", kind: "category", categorySlug: "music" },
  { id: "cat-outdoors", tone: "olive", kind: "category", categorySlug: "outdoors" },
  { id: "cat-making", tone: "lilac", kind: "category", categorySlug: "making" },
  { id: "cat-language", tone: "sky", kind: "category", categorySlug: "language" },
  { id: "cat-money", tone: "lemon", kind: "category", categorySlug: "money" },
  { id: "cat-image", tone: "lilac", kind: "category", categorySlug: "image" },
  { id: "cat-growing", tone: "sage", kind: "category", categorySlug: "growing" },
];

export function isEarned(def: BadgeDef, stats: LearnerStats): boolean {
  switch (def.kind) {
    case "lessons":
      return stats.lessons >= (def.threshold ?? 1);
    case "categories":
      return stats.categories.length >= (def.threshold ?? 1);
    case "group":
      return stats.groupLessons >= (def.threshold ?? 1);
    case "category":
      return !!def.categorySlug && stats.categories.includes(def.categorySlug);
  }
}

export function earnedBadges(stats: LearnerStats): BadgeDef[] {
  return badgeDefs.filter((def) => isEarned(def, stats));
}

/** Badges earned by `after` that weren't earned by `before`. */
export function newlyEarned(before: LearnerStats, after: LearnerStats): BadgeDef[] {
  const had = new Set(earnedBadges(before).map((b) => b.id));
  return earnedBadges(after).filter((b) => !had.has(b.id));
}

/**
 * How close the learner is to the next lesson-count badge. Used for the
 * "two more to go" line on the profile.
 */
export function nextLessonBadge(
  stats: LearnerStats,
): { def: BadgeDef; remaining: number } | null {
  const next = badgeDefs
    .filter((d) => d.kind === "lessons" && !isEarned(d, stats))
    .sort((a, b) => (a.threshold ?? 0) - (b.threshold ?? 0))[0];
  if (!next) return null;
  return { def: next, remaining: (next.threshold ?? 0) - stats.lessons };
}
