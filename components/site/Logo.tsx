import { cn } from "@/lib/utils";

/**
 * The Padlr mark: a paddle.
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
      {/* blade — elongated, or it reads as a lightbulb */}
      <ellipse cx="12" cy="7.4" rx="3.9" ry="5.6" fill="currentColor" />
      {/* shaft and grip */}
      <path
        d="M12 12.6v7.8M9.6 20.4h4.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
