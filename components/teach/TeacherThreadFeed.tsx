"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { teach as copy } from "@/content";
import {
  EARNINGS_EVENT,
  readEarnings,
  type EarningEvent,
} from "@/lib/earningsStore";
import { gear as allGear } from "@/lib/data/gear";
import { formatPrice } from "@/lib/date";
import { Avatar } from "@/components/ui/Primitives";
import { Motif } from "@/components/ui/Motif";
import { cn, motifFor, toneSurface } from "@/lib/utils";

const thread = copy.inbox.thread;

/** Same rule as the inbox list: initials from whatever label this thread has. */
function initialsOf(label: string): string {
  return label
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * One conversation, from the teacher's side, as an activity feed rather than
 * a transcript — see the copy in content/teach.ts for why. Everything here
 * is "mine": every card sits on the right, because everything shown is
 * something the teacher confirmed or shared.
 */
export function TeacherThreadFeed({ threadHref }: { threadHref: string }) {
  const [events, setEvents] = useState<EarningEvent[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const read = () =>
      setEvents(
        readEarnings()
          .filter((e) => e.threadHref === threadHref)
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
      );
    read();
    window.addEventListener(EARNINGS_EVENT, read);
    return () => window.removeEventListener(EARNINGS_EVENT, read);
  }, [threadHref]);

  if (!mounted) return <div className="min-h-[24rem]" />;

  const learnerLabel = events[0]?.learnerLabel ?? copy.inbox.genericLearner;
  const tone = events[0]?.tone ?? "sage";
  const skill = events[0]?.skill ?? "";

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/teach/inbox"
        className="inline-flex items-center gap-1.5 self-start text-sm font-semibold underline decoration-ink/30 decoration-2 underline-offset-4 hover:decoration-ink"
      >
        <span aria-hidden="true">←</span> {thread.backToInbox}
      </Link>

      <div className="flex items-center gap-4">
        <Avatar initials={initialsOf(learnerLabel)} name={learnerLabel} tone={tone} size="lg" />
        <div>
          <p className="text-lg font-bold">{learnerLabel}</p>
          <p className="text-sm text-ink-soft">{skill}</p>
        </div>
      </div>

      <p className="rounded-2xl bg-cream px-4 py-3 text-sm leading-relaxed text-ink-faint">
        {thread.feedNote}
      </p>

      <ul className="flex flex-col gap-3">
        {events.map((event) => (
          <li key={event.id} className="flex justify-end">
            {event.kind === "lesson" ? (
              <LessonCard event={event} />
            ) : (
              <AffiliateCard event={event} />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function LessonCard({ event }: { event: Extract<EarningEvent, { kind: "lesson" }> }) {
  return (
    <div className="w-[18rem] rounded-3xl rounded-br-lg bg-sage-wash p-5 shadow-[var(--shadow-lift)]">
      <p className="text-[0.625rem] font-bold tracking-[0.14em] text-forest/70 uppercase">
        {thread.lessonTitle}
      </p>
      <p className="mt-2 text-lg leading-snug font-bold">
        {event.dateLabel}, {event.timeLabel}
      </p>
      <dl className="mt-3 space-y-1 text-[0.8125rem] text-ink-soft">
        <div className="flex justify-between gap-3">
          <dt>{copy.dashboard.schedule.peopleFor(event.people)}</dt>
          <dd className="tabular font-medium">{formatPrice(event.gross)}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-ink/15 pt-1.5">
          <dt className="font-semibold text-ink">{thread.lessonNote(formatPrice(event.payout))}</dt>
        </div>
      </dl>
    </div>
  );
}

function AffiliateCard({ event }: { event: Extract<EarningEvent, { kind: "affiliate" }> }) {
  const item = allGear.find((g) => g.id === event.gearId);

  return (
    <div className="w-[18rem] overflow-hidden rounded-3xl rounded-br-lg bg-paper shadow-[var(--shadow-lift)]">
      {item ? (
        <div className={cn("relative h-24 overflow-hidden", toneSurface[item.tone])}>
          <Motif variant={motifFor(item.id)} />
          <span className="tabular absolute right-3 bottom-3 rounded-full bg-paper px-3 py-1 text-sm font-bold text-ink shadow-sm">
            {item.price}
          </span>
        </div>
      ) : null}
      <div className="p-4">
        <p className="text-[0.625rem] font-bold tracking-[0.14em] text-ink-faint uppercase">
          {thread.affiliateTitle}
        </p>
        <p className="mt-1.5 font-bold">{event.itemName}</p>
        <p className="mt-2 border-t border-ink/10 pt-2 text-[0.8125rem] font-semibold text-forest">
          {thread.affiliateNote(formatPrice(event.estimatedPayout))}
        </p>
      </div>
    </div>
  );
}
