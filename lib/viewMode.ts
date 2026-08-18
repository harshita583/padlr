"use client";

/**
 * Which hat you're currently wearing, for the rare browser that's signed up
 * as both a teacher and a learner.
 *
 * Only meaningful when both profiles exist — with just one, there's nothing
 * to switch between, so the resolved mode is simply whichever profile you
 * have. This is what decides, e.g., whether Messages shows your teaching
 * conversations or your own.
 */

export type ViewMode = "teacher" | "learner";

const KEY = "padlr:view-mode";

/** Fired whenever the mode changes, so every reader updates without a reload. */
export const VIEW_MODE_EVENT = "padlr:view-mode-changed";

/** The raw stored preference — only meaningful once both profiles exist. */
export function readViewMode(): ViewMode | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw === "teacher" || raw === "learner" ? raw : null;
  } catch {
    return null;
  }
}

export function setViewMode(mode: ViewMode): void {
  window.localStorage.setItem(KEY, mode);
  window.dispatchEvent(new Event(VIEW_MODE_EVENT));
}

/**
 * What to actually show, given which profiles exist. A single-role browser
 * has no choice in the matter; a dual-role one defaults to teaching (matching
 * how this behaved before there was a switch) until it's told otherwise.
 */
export function resolveViewMode({
  hasTeacher,
  hasLearner,
}: {
  hasTeacher: boolean;
  hasLearner: boolean;
}): ViewMode {
  if (hasTeacher && hasLearner) return readViewMode() ?? "teacher";
  return hasTeacher ? "teacher" : "learner";
}
