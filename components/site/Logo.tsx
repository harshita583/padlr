import { cn } from "@/lib/utils";

/**
 * The Padlr mark: a canoe paddle, tilted.
 *
 * Drawn rather than set as an emoji so it takes `currentColor`, stays crisp at
 * any size, and renders identically on every platform — emoji don't.
 */
export function PaddleMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
    >
      {/* Drawn upright, then tilted — far easier to reason about than baking
          the diagonal into every coordinate. */}
      <g transform="rotate(24 12 12)">
        {/* blade: a teardrop, point where it meets the shaft */}
        <path
          d="M12 8.2c2.4 2.4 3.4 5.8 3.4 8.4 0 2.7-1.5 4.4-3.4 4.4s-3.4-1.7-3.4-4.4c0-2.6 1-6 3.4-8.4Z"
          fill="currentColor"
        />
        {/* shaft and T-grip */}
        <path
          d="M12 8.4V3.6M10.1 3.2h3.8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
