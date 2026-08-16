import { cn } from "@/lib/utils";

/**
 * Abstract background motifs.
 *
 * These stand in for photography on category tiles, event headers and product
 * cards. They're drawn in `currentColor` at low opacity, so they take the
 * colour of whatever surface they sit on and never fight the type.
 *
 * When you have real photography, drop an <Image> in the same slot — every
 * caller sizes this with `absolute inset-0`, so nothing else has to change.
 */
export type MotifVariant = "arcs" | "stripes" | "grid" | "waves" | "rays" | "blocks";

export const motifVariants: MotifVariant[] = [
  "arcs",
  "stripes",
  "grid",
  "waves",
  "rays",
  "blocks",
];

export function Motif({
  variant,
  className,
  opacity = 0.16,
}: {
  variant: MotifVariant;
  className?: string;
  opacity?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
    >
      {shapes[variant]}
    </svg>
  );
}

/* Explicit shapes rather than <pattern> defs — no ids means no collisions when
   a dozen of these render on one page. */
const shapes: Record<MotifVariant, React.ReactNode> = {
  arcs: (
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      {[30, 55, 80, 105, 130, 155, 180, 205].map((r) => (
        <circle key={r} cx="200" cy="200" r={r} />
      ))}
    </g>
  ),

  stripes: (
    <g stroke="currentColor" strokeWidth="4">
      {Array.from({ length: 22 }, (_, i) => (
        <line key={i} x1={-100 + i * 18} y1="220" x2={20 + i * 18} y2="-20" />
      ))}
    </g>
  ),

  grid: (
    <g fill="currentColor">
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => (
          <circle key={`${row}-${col}`} cx={12 + col * 25} cy={12 + row * 25} r="2.5" />
        )),
      )}
    </g>
  ),

  waves: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      {[10, 40, 70, 100, 130, 160, 190].map((y) => (
        <path key={y} d={`M-10 ${y} q 25 -22 50 0 t 50 0 t 50 0 t 50 0 t 50 0`} />
      ))}
    </g>
  ),

  rays: (
    <g stroke="currentColor" strokeWidth="2">
      {Array.from({ length: 19 }, (_, i) => (
        <line key={i} x1="0" y1="200" x2={i * 15} y2={200 - (19 - i) * 15} />
      ))}
    </g>
  ),

  blocks: (
    <g fill="currentColor">
      {Array.from({ length: 5 }, (_, row) =>
        Array.from({ length: 5 }, (_, col) =>
          (row + col) % 2 === 0 ? (
            <rect key={`${row}-${col}`} x={col * 40} y={row * 40} width="18" height="18" rx="3" />
          ) : null,
        ),
      )}
    </g>
  ),
};
