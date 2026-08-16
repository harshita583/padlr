import type { GearItem } from "@/lib/types";
import { common } from "@/content";
import { GearCard } from "@/components/cards/GearCard";
import { Eyebrow } from "@/components/ui/Primitives";

/**
 * The sponsored / affiliate equipment row.
 *
 * The disclosure underneath is not optional — it's how we stay honest about
 * paid placement, and in several jurisdictions it's the law.
 */
export function GearRail({
  items,
  eyebrow,
  title,
  body,
  label,
  compact = false,
  layout = "rail",
}: {
  items: GearItem[];
  eyebrow?: string;
  title: string;
  body?: string;
  label: string;
  compact?: boolean;
  /** "rail" scrolls horizontally; "grid" wraps — use grid inside narrow columns. */
  layout?: "rail" | "grid";
}) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="gear-rail-title">
      {eyebrow ? <Eyebrow className="mb-2">{eyebrow}</Eyebrow> : null}
      <h2 id="gear-rail-title" className="display text-2xl sm:text-3xl">
        {title}
      </h2>
      {body ? (
        <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">{body}</p>
      ) : null}

      {layout === "grid" ? (
        <ul aria-label={label} className="mt-5 grid grid-cols-2 gap-3">
          {items.map((item) => (
            <li key={item.id}>
              <GearCard item={item} compact={compact} />
            </li>
          ))}
        </ul>
      ) : (
        <div
          role="region"
          aria-label={label}
          tabIndex={0}
          className="mt-5 -mx-1 overflow-x-auto px-1 pb-3"
        >
          <ul className="flex gap-3">
            {items.map((item) => (
              <li key={item.id} className={compact ? "w-40 shrink-0" : "w-52 shrink-0"}>
                <GearCard item={item} compact={compact} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-2 text-xs leading-relaxed text-ink-faint">{common.disclosure.long}</p>
    </section>
  );
}
