"use client";

import type { Tone } from "@/lib/types";

/**
 * Teachers you've opened a conversation with, kept in localStorage.
 *
 * The conversation itself is rendered from server data — this only records
 * *that* you have one, so it can appear in the inbox alongside the seeded
 * threads. Swap these three functions for API calls when threads are real.
 */

export interface Contact {
  slug: string;
  name: string;
  initials: string;
  tone: Tone;
  skill: string;
  /** The last thing said, for the inbox preview. */
  lastLine: string;
  startedAt: string;
}

const KEY = "padlr:contacts";

export const CONTACTS_EVENT = "padlr:contacts-changed";

export function readContacts(): Contact[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Contact[]) : [];
  } catch {
    return [];
  }
}

function writeAll(contacts: Contact[]) {
  window.localStorage.setItem(KEY, JSON.stringify(contacts));
  window.dispatchEvent(new Event(CONTACTS_EVENT));
}

/**
 * Record that a conversation exists, without disturbing one that already does
 * — opening a teacher's chat twice shouldn't reset what it says in the inbox.
 */
export function startContact(contact: Omit<Contact, "startedAt" | "lastLine">) {
  const existing = readContacts();
  if (existing.some((c) => c.slug === contact.slug)) return;
  writeAll([
    { ...contact, lastLine: "", startedAt: new Date().toISOString() },
    ...existing,
  ]);
}

export function recordLine(slug: string, lastLine: string) {
  writeAll(
    readContacts().map((c) => (c.slug === slug ? { ...c, lastLine } : c)),
  );
}
