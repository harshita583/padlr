"use client";

import { nav } from "@/content";
import { setViewMode, type ViewMode } from "@/lib/viewMode";
import { cn } from "@/lib/utils";

const copy = nav.roleSwitch;

/**
 * Teaching / Learning, as one sliding switch — a single click flips it,
 * Fiverr-style, rather than two separate buttons to choose between. Only
 * ever rendered when both profiles exist; with just one, there's nothing to
 * switch to, so a toggle would just be clutter.
 */
export function RoleSwitch({ mode, className }: { mode: ViewMode; className?: string }) {
  const isTeacher = mode === "teacher";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isTeacher}
      aria-label={copy.label}
      onClick={() => setViewMode(isTeacher ? "learner" : "teacher")}
      className={cn(
        "relative inline-flex shrink-0 rounded-full bg-ink/8 p-1 transition-colors hover:bg-ink/12",
        className,
      )}
    >
      {/* The one moving part — slides under whichever label is active. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-y-1 left-1 w-24 rounded-full bg-forest shadow-sm transition-transform duration-200 ease-[var(--ease-out-soft)]",
          !isTeacher && "translate-x-24",
        )}
      />
      <span
        className={cn(
          "relative z-10 w-24 py-1.5 text-center text-sm font-bold transition-colors",
          isTeacher ? "text-paper" : "text-ink-soft",
        )}
      >
        {copy.teaching}
      </span>
      <span
        className={cn(
          "relative z-10 w-24 py-1.5 text-center text-sm font-bold transition-colors",
          !isTeacher ? "text-paper" : "text-ink-soft",
        )}
      >
        {copy.learning}
      </span>
    </button>
  );
}
