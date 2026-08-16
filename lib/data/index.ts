/**
 * The data layer.
 *
 * Everything the UI needs goes through these functions. They're async and they
 * return plain objects, which means the day you point them at Postgres,
 * Supabase or a REST API, not a single component has to change.
 *
 * Nothing below reaches into the arrays directly except this file.
 */

import type { Category, Circle, Event, Expert, GearItem, Thread } from "@/lib/types";
import { categories } from "./categories";
import { experts } from "./experts";
import { events } from "./events";
import { gear, gearForCategories } from "./gear";
import { threads } from "./threads";
import { circles } from "./circles";
import { demoScripts, type ScriptedReply } from "./demoScript";

export interface SearchParams {
  /** Free-text skill query. */
  q?: string;
  /** Location string. Not geocoded in the mock layer — see the note below. */
  where?: string;
  categorySlug?: string;
  maxDistance?: number;
  maxPrice?: number;
  format?: string;
  availability?: string;
  sort?: string;
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

export async function getCategories(): Promise<Category[]> {
  return categories;
}

export async function getCategory(slug: string): Promise<Category | undefined> {
  return categories.find((c) => c.slug === slug);
}

/* -------------------------------------------------------------------------- */
/* Experts                                                                    */
/* -------------------------------------------------------------------------- */

export async function getExperts(): Promise<Expert[]> {
  return experts;
}

export async function getExpert(slug: string): Promise<Expert | undefined> {
  return experts.find((e) => e.slug === slug);
}

export async function getExpertById(id: string): Promise<Expert | undefined> {
  return experts.find((e) => e.id === id);
}

/** Lowercase, strip punctuation, drop noise words like "&" and "and". */
function tokenise(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((w) => w.length > 1 && w !== "and" && w !== "the");
}

function matchesQuery(expert: Expert, q: string): boolean {
  const words = tokenise(q);
  if (words.length === 0) return true;

  // Category *names* are in the haystack too, so searching "textiles" or
  // "yarn" finds everyone in that category, not just people who happen to
  // have typed the word into their skills.
  const categoryNames = expert.categories
    .map((slug) => categories.find((c) => c.slug === slug)?.name ?? "")
    .join(" ");

  const haystack = tokenise(
    [
      expert.name,
      expert.headline,
      expert.bio,
      expert.neighbourhood,
      categoryNames,
      ...expert.skills,
      ...expert.categories,
    ].join(" "),
  ).join(" ");

  // Every word must appear somewhere. Good enough for a mock; a real
  // implementation would use Postgres full-text search or Typesense.
  return words.every((w) => haystack.includes(w));
}

export async function searchExperts(params: SearchParams): Promise<Expert[]> {
  let results = experts.filter((e) => matchesQuery(e, params.q ?? ""));

  if (params.categorySlug) {
    results = results.filter((e) => e.categories.includes(params.categorySlug!));
  }
  if (params.maxDistance) {
    results = results.filter((e) => e.distanceMiles <= params.maxDistance!);
  }
  if (params.maxPrice) {
    results = results.filter((e) => e.hourlyRate <= params.maxPrice!);
  }
  if (params.format) {
    results = results.filter((e) =>
      e.formats.includes(params.format as Expert["formats"][number]),
    );
  }
  if (params.availability && params.availability !== "any") {
    results = results.filter((e) =>
      e.availabilityWindows.includes(
        params.availability as Expert["availabilityWindows"][number],
      ),
    );
  }

  const sorted = [...results];
  switch (params.sort) {
    case "distance":
      sorted.sort((a, b) => a.distanceMiles - b.distanceMiles);
      break;
    case "price-low":
      sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
      break;
    case "price-high":
      sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      break;
    default:
      // "Recommended" blends rating and proximity.
      sorted.sort(
        (a, b) =>
          b.rating * 10 - b.distanceMiles - (a.rating * 10 - a.distanceMiles),
      );
  }
  return sorted;
}

export async function getSimilarExperts(expert: Expert, limit = 3): Promise<Expert[]> {
  return experts
    .filter((e) => e.id !== expert.id && e.categories.some((c) => expert.categories.includes(c)))
    .slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/* Events                                                                     */
/* -------------------------------------------------------------------------- */

export async function getEvents(): Promise<Event[]> {
  return [...events].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}

export async function getEvent(slug: string): Promise<Event | undefined> {
  return events.find((e) => e.slug === slug);
}

export async function getEventsByHost(hostId: string): Promise<Event[]> {
  return events.filter((e) => e.hostId === hostId);
}

export interface EventFilters {
  when?: string;
  category?: string;
  price?: string;
}

export async function getFilteredEvents(filters: EventFilters): Promise<Event[]> {
  const all = await getEvents();
  const now = Date.now();
  const dayMs = 86_400_000;

  return all.filter((e) => {
    const starts = new Date(e.startsAt).getTime();

    if (filters.when === "week" && starts > now + 7 * dayMs) return false;
    if (filters.when === "month" && starts > now + 30 * dayMs) return false;
    if (filters.when === "weekend") {
      const day = new Date(e.startsAt).getDay();
      if (day !== 0 && day !== 6) return false;
    }

    if (filters.category && filters.category !== "all" && e.categorySlug !== filters.category) {
      return false;
    }

    if (filters.price === "free" && e.price !== 0) return false;
    if (filters.price === "under-40" && e.price >= 40) return false;
    if (filters.price === "under-80" && e.price >= 80) return false;

    return true;
  });
}

/* -------------------------------------------------------------------------- */
/* Gear                                                                       */
/* -------------------------------------------------------------------------- */

export async function getGear(): Promise<GearItem[]> {
  return gear;
}

export async function getGearById(id: string): Promise<GearItem | undefined> {
  return gear.find((g) => g.id === id);
}

export async function getGearByIds(ids: string[]): Promise<GearItem[]> {
  return ids.map((id) => gear.find((g) => g.id === id)).filter(Boolean) as GearItem[];
}

/**
 * Gear to show alongside a lesson. Every category has at least one relevant
 * item, so this never has to pad the list with something off-topic to fill it.
 */
export async function getGearForCategories(slugs: string[], limit = 8): Promise<GearItem[]> {
  return gearForCategories(slugs, limit);
}

/* -------------------------------------------------------------------------- */
/* Messages                                                                   */
/* -------------------------------------------------------------------------- */

export async function getThreads(): Promise<Thread[]> {
  return [...threads].sort(
    (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime(),
  );
}

export async function getThread(id: string): Promise<Thread | undefined> {
  return threads.find((t) => t.id === id);
}

/**
 * Scripted teacher replies for the demo. Returns an empty list for threads
 * without a script, which simply means the teacher won't answer back.
 */
export async function getDemoScript(threadId: string): Promise<ScriptedReply[]> {
  return demoScripts[threadId] ?? [];
}

/* -------------------------------------------------------------------------- */
/* Circles                                                                    */
/* -------------------------------------------------------------------------- */

export async function getCircles(): Promise<Circle[]> {
  return [...circles].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}
