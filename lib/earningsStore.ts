"use client";

/**
 * What the signed-up teacher has earned, kept in localStorage.
 *
 * Same standing as the other browser-local stores: this is the demo's stand-in
 * for a real ledger. It only ever grows from things that actually happen in
 * this browser — a lesson confirmed in Messages, a shared link sent in
 * chat — never from seeded history, for the same reason badges aren't
 * pre-seeded: a dashboard that's full before you've done anything would be
 * lying about what the feature does.
 *
 * Scope: direct lesson bookings only for now. Circles aren't counted here yet
 * — their price changes as people join, which wants a different (update, not
 * append) shape than this ledger.
 */

export interface LessonEarning {
  id: string;
  kind: "lesson";
  /** What the teacher actually keeps, after Padlr's platform fee. */
  payout: number;
  /** The lesson price the fee is a percentage of — before Padlr's cut. */
  gross: number;
  /** Padlr's cut of this lesson. */
  fee: number;
  skill: string;
  people: number;
  /** ISO date the lesson itself falls on. */
  lessonDate: string;
  dateLabel: string;
  timeLabel: string;
  createdAt: string;
}

export interface AffiliateEarning {
  id: string;
  kind: "affiliate";
  /** Estimated: there's no way here to know a learner actually bought it. */
  estimatedPayout: number;
  itemName: string;
  skill: string;
  createdAt: string;
}

export type EarningEvent = LessonEarning | AffiliateEarning;

const KEY = "padlr:earnings";

/** Fired whenever an earning is recorded, so the dashboard re-reads it live. */
export const EARNINGS_EVENT = "padlr:earnings-changed";

function makeId(): string {
  return `earn-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function readEarnings(): EarningEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as EarningEvent[]) : [];
  } catch {
    return [];
  }
}

function writeAll(events: EarningEvent[]) {
  window.localStorage.setItem(KEY, JSON.stringify(events));
  window.dispatchEvent(new Event(EARNINGS_EVENT));
}

export function recordLessonEarning(input: Omit<LessonEarning, "id" | "kind" | "createdAt">) {
  const event: LessonEarning = {
    ...input,
    id: makeId(),
    kind: "lesson",
    createdAt: new Date().toISOString(),
  };
  writeAll([event, ...readEarnings()]);
}

export function recordAffiliateEarning(
  input: Omit<AffiliateEarning, "id" | "kind" | "createdAt">,
) {
  const event: AffiliateEarning = {
    ...input,
    id: makeId(),
    kind: "affiliate",
    createdAt: new Date().toISOString(),
  };
  writeAll([event, ...readEarnings()]);
}
