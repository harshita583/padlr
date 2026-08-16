"use client";

/**
 * The signed-up teacher, kept in localStorage.
 *
 * Same standing as `lib/profile.ts` — browser-only, gone if you clear site
 * data. It holds the same fields a real teacher record does, so replacing
 * these functions with API calls is the whole job.
 */

export type TeachingFormat = "one-to-one" | "group" | "class";

export interface TeacherProfile {
  firstName: string;
  lastInitial: string;
  email: string;
  neighbourhood: string;
  /** Category slug. */
  categorySlug: string;
  /** What they'd actually teach, free text, one per line in the form. */
  skills: string[];
  headline: string;
  bio: string;
  /** Whole US dollars per hour. */
  hourlyRate: number;
  /** Added to the total per extra learner. */
  groupUplift: number;
  formats: TeachingFormat[];
  /** Day names they're usually free. */
  days: string[];
  idVerified: boolean;
  createdAt: string;
}

const KEY = "padlr:teacher";

/** Fired whenever the teacher record changes, so open screens re-read it. */
export const TEACHER_EVENT = "padlr:teacher-changed";

export function readTeacher(): TeacherProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TeacherProfile) : null;
  } catch {
    return null;
  }
}

export function saveTeacher(teacher: TeacherProfile): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(teacher));
  window.dispatchEvent(new Event(TEACHER_EVENT));
}

export function clearTeacher(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event(TEACHER_EVENT));
}

/** "Rosa A." — the only name form shown publicly, same rule as learners. */
export function teacherName(teacher: TeacherProfile): string {
  return `${teacher.firstName} ${teacher.lastInitial.toUpperCase()}.`;
}

export function teacherInitials(teacher: TeacherProfile): string {
  return `${teacher.firstName[0] ?? "?"}${teacher.lastInitial[0] ?? ""}`.toUpperCase();
}
