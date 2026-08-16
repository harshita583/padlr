"use client";

import { useEffect, useRef, useState } from "react";
import type { GearItem } from "@/lib/types";
import { common, messages as copy } from "@/content";
import { cn, toneSurface } from "@/lib/utils";

const drawer = copy.gearDrawer;

/**
 * The shopping drawer above the composer.
 *
 * Three rules it has to obey:
 *  - Nothing commercial exists here until the teacher has shared a link
 *    (`available`). Before that the whole component renders nothing.
 *  - It never steals height from the conversation. Collapsed it is a single
 *    bar; open it floats *over* the message log rather than pushing it up.
 *  - It stays closed once closed. The only thing that re-opens it is a new
 *    link arriving (`openSignal`).
 */
export function GearDrawer({
  items,
  available,
  openSignal,
}: {
  items: GearItem[];
  /** True once the teacher has shared something in this conversation. */
  available: boolean;
  /** Increment to pop the drawer open — e.g. when a new link arrives. */
  openSignal: number;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLButtonElement>(null);

  // A new link from the teacher pops the drawer open, even if it was closed.
  useEffect(() => {
    if (openSignal > 0) setOpen(true);
  }, [openSignal]);

  // Escape closes it and returns focus to the bar, like any other overlay.
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

  if (!available || items.length === 0) return null;

  return (
    <div className="relative shrink-0">
      {/* The floating panel. `bottom-full` sits it directly on top of the bar,
          overlaying the log instead of resizing it. */}
      {open ? (
        <div
          ref={panelRef}
          id="gear-drawer-panel"
          aria-labelledby="gear-drawer-title"
          role="region"
          className="absolute inset-x-0 bottom-full z-20 border-t border-ink/10 bg-paper px-4 pt-4 pb-3 shadow-[0_-16px_40px_-20px_rgb(20_24_12/0.35)]"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h2
                id="gear-drawer-title"
                className="flex items-center gap-2 text-[0.9375rem] font-bold"
              >
                <span aria-hidden="true">🛍️</span>
                {drawer.title}
              </h2>
              <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-faint">
                {drawer.body}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                barRef.current?.focus();
              }}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-ink/8 px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors hover:bg-ink/15"
            >
              <span aria-hidden="true">✕</span>
              {drawer.hideAction}
              <span className="sr-only"> — {drawer.dismissLabel}</span>
            </button>
          </div>

          {/* Swipeable rail. Snap points make it feel right on a touchscreen,
              and it stays keyboard-reachable because each card holds a link. */}
          <ul
            aria-label={drawer.label}
            className="mt-3 -mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-1 pb-2"
          >
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

      {/* The bar. Always present once available, so closing never loses it. */}
      <div className="border-t border-ink/8 bg-paper px-4 py-2">
        <button
          ref={barRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="gear-drawer-panel"
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-full px-4 py-2 text-left text-[0.875rem] font-semibold transition-colors",
            open ? "bg-clay/60" : "bg-cream hover:bg-clay/50",
          )}
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true">🛍️</span>
            {drawer.openLabel}
            <span className="tabular rounded-full bg-ink/10 px-2 py-0.5 text-[0.6875rem]">
              {items.length}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "text-xs text-ink-faint transition-transform duration-200",
              open && "rotate-180",
            )}
          >
            ▲
          </span>
          <span className="sr-only">
            {open ? drawer.collapseLabel : drawer.expandLabel}
          </span>
        </button>
      </div>
    </div>
  );
}

function ShopCard({ item }: { item: GearItem }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-paper transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className={cn("relative grid h-16 place-items-center", toneSurface[item.tone])}>
        <span aria-hidden="true" className="text-2xl">
          {item.emoji}
        </span>
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
