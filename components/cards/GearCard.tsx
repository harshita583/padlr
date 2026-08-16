import type { GearItem } from "@/lib/types";
import { common, messages as messagesCopy } from "@/content";
import { cn, toneSurface } from "@/lib/utils";

/**
 * A shopping link.
 *
 * Commercial relationships are always labelled. `affiliate` and `sponsored`
 * come straight from the data; never render this card without them.
 */
export function GearCard({
  item,
  className,
  compact = false,
}: {
  item: GearItem;
  className?: string;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-tile)] border border-ink/8 bg-paper transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      <div
        className={cn(
          "relative grid place-items-center",
          compact ? "h-24" : "h-32",
          toneSurface[item.tone],
        )}
      >
        <span aria-hidden="true" className={compact ? "text-3xl" : "text-4xl"}>
          {item.emoji}
        </span>
        {item.sponsored ? (
          <span className="absolute top-2.5 left-2.5 rounded-full bg-paper/90 px-2 py-0.5 text-[0.625rem] font-bold tracking-wide text-ink uppercase">
            {messagesCopy.gearRail.sponsoredBadge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[0.6875rem] font-bold tracking-[0.12em] text-ink-faint uppercase">
          {item.vendor}
        </p>
        <h3 className="mt-1 text-[0.9375rem] leading-snug font-bold">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer noopener sponsored"
            className="before:absolute before:inset-0"
          >
            {item.name}
            <span className="sr-only"> — {common.a11y.externalLink}</span>
          </a>
        </h3>

        {!compact ? (
          <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-snug text-ink-soft">
            {item.blurb}
          </p>
        ) : null}

        <div className="mt-3 flex items-center justify-between gap-2 pt-1">
          <span className="tabular text-base font-bold">{item.price}</span>
          {item.affiliate ? (
            <span className="rounded-full bg-ink/6 px-2 py-0.5 text-[0.625rem] font-bold tracking-wide text-ink-faint uppercase">
              {common.disclosure.short}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
