"use client";

import type { Tone } from "@/lib/types";

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

interface EarningBase {
  id: string;
  createdAt: string;
  /** Where this happened — the conversation, from the *learner's* side. */
  threadHref: string;
  skill: string;
  /** Decorative only. The learner in this demo has no fixed identity to colour by. */
  tone: Tone;
  /**
   * Who you were talking to, from the teacher's chair: the signed-in
   * learner's display name if one exists in this browser, otherwise a
   * generic label. Never the teacher's own name — that's you.
   */
  learnerLabel: string;
}

export interface LessonEarning extends EarningBase {
  kind: "lesson";
  /** What the teacher actually keeps, after Padlr's platform fee. */
  payout: number;
  /** The lesson price the fee is a percentage of — before Padlr's cut. */
  gross: number;
  /** Padlr's cut of this lesson. */
  fee: number;
  people: number;
  /** ISO date the lesson itself falls on. */
  lessonDate: string;
  dateLabel: string;
  timeLabel: string;
}

export interface AffiliateEarning extends EarningBase {
  kind: "affiliate";
  /** Estimated: there's no way here to know a learner actually bought it. */
  estimatedPayout: number;
  itemName: string;
  /** So the teacher inbox can re-fetch the full item to show a real preview card. */
  gearId: string;
}

export type EarningEvent = LessonEarning | AffiliateEarning;

/** One thread's worth of activity, for the teacher inbox list. */
export interface ThreadActivity {
  threadHref: string;
  learnerLabel: string;
  skill: string;
  tone: Tone;
  events: EarningEvent[];
  totalPayout: number;
  lastActivityAt: string;
}

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

/** The payout figure common to both kinds, so a total doesn't need a switch. */
export function payoutOf(event: EarningEvent): number {
  return event.kind === "lesson" ? event.payout : event.estimatedPayout;
}

/**
 * Groups earnings by conversation, newest thread activity first — this is
 * the whole data behind the teacher inbox list.
 */
export function groupByThread(events: EarningEvent[]): ThreadActivity[] {
  const byThread = new Map<string, ThreadActivity>();

  for (const event of events) {
    const existing = byThread.get(event.threadHref);
    if (existing) {
      existing.events.push(event);
      existing.totalPayout += payoutOf(event);
      if (event.createdAt > existing.lastActivityAt) existing.lastActivityAt = event.createdAt;
    } else {
      byThread.set(event.threadHref, {
        threadHref: event.threadHref,
        learnerLabel: event.learnerLabel,
        skill: event.skill,
        tone: event.tone,
        events: [event],
        totalPayout: payoutOf(event),
        lastActivityAt: event.createdAt,
      });
    }
  }

  return [...byThread.values()].sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
}
