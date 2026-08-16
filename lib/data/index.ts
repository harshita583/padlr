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
import { gear } from "./gear";
import { threads } from "./threads";
import { circles } from "./circles";

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

function matchesQuery(expert: Expert, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const words = needle.split(/\s+/);
  const haystack = [
    expert.name,
    expert.headline,
    expert.bio,
    expert.neighbourhood,
    ...expert.skills,
    ...expert.categories,
  ]
    .join(" ")
    .toLowerCase();
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
 * Gear to show alongside a search. Falls back to a general selection so the
 * rail is never empty.
 */
export async function getGearForCategories(slugs: string[], limit = 6): Promise<GearItem[]> {
  const matched = gear.filter((g) => g.categorySlugs.some((s) => slugs.includes(s)));
  const rest = gear.filter((g) => !matched.includes(g));
  return [...matched, ...rest].slice(0, limit);
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

/* -------------------------------------------------------------------------- */
/* Circles                                                                    */
/* -------------------------------------------------------------------------- */

export async function getCircles(): Promise<Circle[]> {
  return [...circles].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
}
