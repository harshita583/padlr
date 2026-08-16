"use client";

import { useEffect, useState } from "react";
import type { GearItem } from "@/lib/types";
import { common, messages as copy } from "@/content";
import { cn, toneSurface } from "@/lib/utils";

const drawer = copy.gearDrawer;

/**
 * The shopping drawer that sits above the composer.
 *
 * Deliberately not visible by default: nothing commercial appears in a
 * conversation until the teacher has shared at least one link (`available`).
 * After that it can be collapsed to a single bar and re-opened — closing it
 * never loses it, and it never re-opens itself except when a new link lands.
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
  const [open, setOpen] = useState(available);

  // A new link from the teacher re-opens the drawer, even if it was collapsed.
  useEffect(() => {
    if (openSignal > 0) setOpen(true);
  }, [openSignal]);

  if (!available || items.length === 0) return null;

  if (!open) {
    return (
      <div className="border-t border-ink/8 bg-paper px-4 py-2.5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          aria-controls="gear-drawer"
          className="flex w-full items-center justify-between gap-3 rounded-full bg-cream px-4 py-2.5 text-left text-[0.875rem] font-semibold transition-colors hover:bg-clay/60"
        >
          <span className="flex items-center gap-2">
            <span aria-hidden="true">🛍️</span>
            {drawer.openLabel}
          </span>
          <span aria-hidden="true" className="text-xs text-ink-faint">
            ▲
          </span>
          <span className="sr-only">{drawer.expandLabel}</span>
        </button>
      </div>
    );
  }

  return (
    <section
      id="gear-drawer"
      aria-labelledby="gear-drawer-title"
      className="border-t border-ink/8 bg-paper px-4 py-4"
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
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-faint">{drawer.body}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-expanded
          aria-controls="gear-drawer"
          className="grid size-8 shrink-0 place-items-center rounded-full bg-ink/6 text-sm transition-colors hover:bg-ink/12"
        >
          <span aria-hidden="true">✕</span>
          <span className="sr-only">{drawer.dismissLabel}</span>
        </button>
      </div>

      {/* Swipeable rail. Snap points make it feel right on a touchscreen and
          it stays reachable by keyboard because each card holds a link. */}
      <ul
        aria-label={drawer.label}
        className="mt-3.5 -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-1 pb-2"
      >
        {items.map((item) => (
          <li key={item.id} className="w-44 shrink-0 snap-start">
            <ShopCard item={item} />
          </li>
        ))}
      </ul>

      <p className="text-[0.6875rem] leading-relaxed text-ink-faint">
        {common.disclosure.long}
      </p>
    </section>
  );
}

function ShopCard({ item }: { item: GearItem }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/8 bg-paper transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <div className={cn("relative grid h-20 place-items-center", toneSurface[item.tone])}>
        <span aria-hidden="true" className="text-3xl">
          {item.emoji}
        </span>
        {item.sponsored ? (
          <span className="absolute top-2 left-2 rounded-full bg-paper/90 px-1.5 py-0.5 text-[0.5625rem] font-bold tracking-wide text-ink uppercase">
            {drawer.sponsoredBadge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="text-[0.625rem] font-bold tracking-[0.12em] text-ink-faint uppercase">
          {item.vendor}
        </p>
        <h3 className="mt-1 text-[0.8125rem] leading-snug font-bold">
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

        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
          <span className="tabular text-sm font-bold">{item.price}</span>
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
