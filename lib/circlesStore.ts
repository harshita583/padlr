"use client";

import type { Tone } from "@/lib/types";

/**
 * Circles the learner has started, kept in localStorage.
 *
 * Same shape as `lib/profile.ts`: browser-only, survives a refresh, gone if
 * you clear site data. When the database lands, swap these six functions for
 * Firestore reads and writes — nothing that consumes them changes.
 */

export type CircleStatus = "pending" | "open" | "declined";

export interface CircleMember {
  id: string;
  name: string;
  /** True for the person who started it. */
  host?: boolean;
}

export interface MyCircle {
  id: string;
  shareCode: string;
  title: string;
  /** The topic: a category slug plus the specific thing being learned. */
  categorySlug: string;
  skill: string;
  level: string;
  teacherId: string;
  teacherName: string;
  teacherSlug: string;
  neighbourhood: string;
  /** ISO date, e.g. "2026-08-22". */
  date: string;
  /** 24h local time, e.g. "18:30". */
  time: string;
  durationMinutes: number;
  /** Total seats including the host. */
  seatsTotal: number;
  baseRate: number;
  groupUplift: number;
  tone: Tone;
  /**
   * Nothing is joinable until the teacher agrees to host it — they're the one
   * who has to turn up.
   */
  status: CircleStatus;
  members: CircleMember[];
  createdAt: string;
}

const KEY = "padlr:circles";

/** Fired whenever the list changes, so open screens re-read it. */
export const CIRCLES_EVENT = "padlr:circles-changed";

function emit() {
  window.dispatchEvent(new Event(CIRCLES_EVENT));
}

export function readCircles(): MyCircle[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MyCircle[]) : [];
  } catch {
    return [];
  }
}

function writeAll(circles: MyCircle[]) {
  window.localStorage.setItem(KEY, JSON.stringify(circles));
  emit();
}

/** Short, readable, and hard enough to guess for a link you paste to friends. */
function makeShareCode(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  const values = new Uint32Array(8);
  crypto.getRandomValues(values);
  for (const value of values) out += alphabet[value % alphabet.length];
  return out;
}

export function createCircle(
  input: Omit<MyCircle, "id" | "shareCode" | "status" | "createdAt" | "members"> & {
    host: CircleMember;
  },
): MyCircle {
  const { host, ...rest } = input;
  const circle: MyCircle = {
    ...rest,
    id: `c-${makeShareCode()}`,
    shareCode: makeShareCode(),
    // Starts pending: the teacher has to agree before anyone can take a seat.
    status: "pending",
    members: [{ ...host, host: true }],
    createdAt: new Date().toISOString(),
  };
  writeAll([circle, ...readCircles()]);
  return circle;
}

export function decideCircle(id: string, status: Exclude<CircleStatus, "pending">) {
  writeAll(readCircles().map((c) => (c.id === id ? { ...c, status } : c)));
}

export function joinCircle(id: string, member: CircleMember) {
  writeAll(
    readCircles().map((c) => {
      if (c.id !== id) return c;
      if (c.status !== "open") return c;
      if (c.members.some((m) => m.id === member.id)) return c;
      // Seats are a hard cap, checked here rather than only in the UI.
      if (c.members.length >= c.seatsTotal) return c;
      return { ...c, members: [...c.members, member] };
    }),
  );
}

export function leaveCircle(id: string, memberId: string) {
  writeAll(
    readCircles().map((c) =>
      c.id === id
        ? { ...c, members: c.members.filter((m) => m.id === memberId ? m.host === true : true) }
        : c,
    ),
  );
}

export function removeCircle(id: string) {
  writeAll(readCircles().filter((c) => c.id !== id));
}
