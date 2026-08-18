"use client";

import { nav } from "@/content";
import { setViewMode, type ViewMode } from "@/lib/viewMode";
import { cn } from "@/lib/utils";

const copy = nav.roleSwitch;

/**
 * Teaching / Learning, as a pill toggle. Only ever rendered when both
 * profiles exist — with just one, there's nothing to switch between, so a
 * disabled or single-option switch would just be clutter.
 */
export function RoleSwitch({ mode, className }: { mode: ViewMode; className?: string }) {
  return (
    <div
      role="radiogroup"
      aria-label={copy.label}
      className={cn("inline-flex rounded-full bg-ink/6 p-1 text-sm font-semibold", className)}
    >
      {(["teacher", "learner"] as const).map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={mode === option}
          onClick={() => setViewMode(option)}
          className={cn(
            "rounded-full px-3 py-1.5 transition-colors",
            mode === option ? "bg-forest text-paper" : "text-ink-soft hover:text-ink",
          )}
        >
          {option === "teacher" ? copy.teaching : copy.learning}
        </button>
      ))}
    </div>
  );
}
