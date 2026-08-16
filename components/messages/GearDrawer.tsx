"use client";

import { useEffect, useRef, useState } from "react";
import type { GearItem } from "@/lib/types";
import { common, messages as copy } from "@/content";
import { Motif } from "@/components/ui/Motif";
import { cn, motifFor, toneSurface } from "@/lib/utils";

const drawer = copy.gearDrawer;

/**
 * The shopping drawer above the composer.
 *
 * Three rules it has to obey:
 *  - It's there from the first message, in every conversation — a learner
 *    shouldn't have to wait for the teacher to share something before seeing
 *    what the lesson usually calls for. It only disappears if this teacher's
 *    craft genuinely has nothing relevant (`items` is empty).
 *  - One control, and it's the title line itself. No close button, no chevron.
 *  - It never steals height from the conversation: open, it floats over the
 *    message log rather than pushing it.
 *  - It stays closed once closed. Only a new link re-opens it (`openSignal`).
 */
export function GearDrawer({
  items,
  openSignal,
}: {
  items: GearItem[];
  /** Increment to pop the drawer open — e.g. when a new link arrives. */
  openSignal: number;
}) {
  const [open, setOpen] = useState(false);
  const barRef = useRef<HTMLButtonElement>(null);

  // A new link from the teacher pops the drawer open, even if it was closed.
  useEffect(() => {
    if (openSignal > 0) setOpen(true);
  }, [openSignal]);

  // Escape closes it, like any other overlay.
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        barRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div className="relative shrink-0">
      {/* The floating panel. `bottom-full` sits it directly on top of the line,
          overlaying the log instead of resizing it. */}
      {open ? (
        <div
          id="gear-drawer-panel"
          role="region"
          aria-label={drawer.label}
          className="absolute inset-x-0 bottom-full z-20 border-t border-ink/10 bg-paper px-4 pt-3 pb-2 shadow-[0_-16px_40px_-20px_rgb(20_24_12/0.35)]"
        >
          {/* Swipeable rail. Snap points make it feel right on a touchscreen,
              and it stays keyboard-reachable because each card holds a link. */}
          <ul className="-mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-1 pb-2">
            {items.map((item) => (
              <li key={item.id} className="w-40 shrink-0 snap-start">
                <ShopCard item={item} />
              </li>
            ))}
          </ul>

          <p className="text-[0.625rem] leading-relaxed text-ink-faint">
            {common.disclosure.long}
          </p>
        </div>
      ) : null}

      {/* The only control: one line, clicked to open or close. */}
      <button
        ref={barRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="gear-drawer-panel"
        className={cn(
          "flex w-full items-center gap-2 border-t border-ink/8 px-5 py-3 text-left text-[0.875rem] font-semibold transition-colors",
          open ? "bg-clay/50" : "bg-paper hover:bg-cream",
        )}
      >
        {drawer.title}
        <span className="tabular text-ink-faint">{items.length}</span>
        <span className="sr-only">
          {open ? drawer.collapseLabel : drawer.expandLabel}
        </span>
      </button>
    </div>
  );
}

function ShopCard({ item }: { item: GearItem }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-paper transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className={cn("relative h-16 overflow-hidden", toneSurface[item.tone])}>
        <Motif variant={motifFor(item.id)} />
        {item.sponsored ? (
          <span className="absolute top-1.5 left-1.5 rounded-full bg-paper/90 px-1.5 py-0.5 text-[0.5625rem] font-bold tracking-wide text-ink uppercase">
            {drawer.sponsoredBadge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-2.5">
        <p className="text-[0.5625rem] font-bold tracking-[0.12em] text-ink-faint uppercase">
          {item.vendor}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-[0.75rem] leading-snug font-bold">
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

        <div className="mt-auto flex items-center justify-between gap-1.5 pt-2">
          <span className="tabular text-[0.8125rem] font-bold">{item.price}</span>
          {item.affiliate ? (
            <span className="rounded-full bg-ink/6 px-1.5 py-0.5 text-[0.5625rem] font-bold tracking-wide text-ink-faint uppercase">
              {common.disclosure.short}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
