import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import type { Tone } from "@/lib/types";
import { motifVariants, type MotifVariant } from "@/components/ui/Motif";

/**
 * Tone → Tailwind classes.
 *
 * Written out in full rather than interpolated, because Tailwind only ships
 * classes it can see as complete strings in the source.
 */
export const toneSurface: Record<Tone, string> = {
  lemon: "bg-lemon text-ink",
  sage: "bg-sage text-olive",
  sky: "bg-sky text-olive",
  lilac: "bg-lilac text-olive",
  coral: "bg-coral text-ink",
  olive: "bg-olive text-cream",
  cream: "bg-clay text-ink",
};

/** Softer version, for large fills behind body text. */
export const toneWash: Record<Tone, string> = {
  lemon: "bg-lemon-soft text-ink",
  sage: "bg-sage-wash text-olive",
  sky: "bg-sky/50 text-olive",
  lilac: "bg-lilac/60 text-olive",
  coral: "bg-coral/20 text-ink",
  olive: "bg-olive/10 text-olive",
  cream: "bg-clay/60 text-ink",
};

/** Whether a tone is dark enough to need light-on-dark focus rings. */
export const toneIsDark: Record<Tone, boolean> = {
  lemon: false,
  sage: false,
  sky: false,
  lilac: false,
  coral: false,
  olive: true,
  cream: false,
};

/** "Priya N." → "PN". "A learner" → "AL". Any free-text label, not just a Profile. */
export function initialsFromLabel(label: string): string {
  return label
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministic tone picker, so the same id always gets the same colour. */
export function toneFor(seed: string): Tone {
  const tones: Tone[] = ["lemon", "sage", "sky", "lilac", "coral", "olive"];
  return tones[hash(seed) % tones.length];
}

/**
 * Deterministic motif picker. Same id, same pattern, every render — so a
 * category or product keeps its visual identity across pages.
 */
export function motifFor(seed: string): MotifVariant {
  return motifVariants[hash(seed) % motifVariants.length];
}
