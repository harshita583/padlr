import { cn } from "@/lib/utils";

/**
 * The Padlr mark: two crossed paddles, drawn as line art.
 *
 * Drawn rather than shipped as a bitmap so it takes `currentColor`, stays
 * crisp at any size, and renders identically on every platform.
 *
 * One paddle outline, used twice and rotated. Baking the diagonal into forty
 * coordinates would be miserable to edit and would let the two halves drift
 * apart; this way they can't.
 */
const PADDLE =
  // grip
  "M10.5 2.7A1.5 1.5 0 0 1 13.5 2.7" +
  // right side: neck, shaft, then the shoulder flaring into the blade
  "L13.5 3.6C13.5 4.2 12.95 4.3 12.95 5L12.95 14.5C12.95 15.8 14.6 16.2 14.6 17.8" +
  // blade, clockwise round the bottom
  "L14.6 21A1.8 1.8 0 0 1 12.8 22.8L11.2 22.8A1.8 1.8 0 0 1 9.4 21L9.4 17.8" +
  // back up the left shoulder and shaft to the grip
  "C9.4 16.2 11.05 15.8 11.05 14.5L11.05 5C11.05 4.3 10.5 4.2 10.5 3.6Z";

/** Splay. Wide enough that the blades clear each other at the bottom. */
const TILT = 40;

export function PaddleMark({
  className,
  halo,
}: {
  className?: string;
  /**
   * The colour behind the mark. When set, the front paddle is under-drawn in
   * it so it breaks the one behind at the crossing, the way the two overlap in
   * the logo. Leave unset on a background you can't name.
   */
  halo?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={1.15}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={PADDLE} transform={`rotate(${-TILT} 12 12)`} />
        {halo ? (
          <path
            d={PADDLE}
            transform={`rotate(${TILT} 12 12)`}
            stroke={halo}
            strokeWidth={2.2}
          />
        ) : null}
        <path d={PADDLE} transform={`rotate(${TILT} 12 12)`} />
      </g>
    </svg>
  );
}
