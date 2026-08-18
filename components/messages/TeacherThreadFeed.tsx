"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { messages as copy } from "@/content";
import {
  EARNINGS_EVENT,
  readEarnings,
  type EarningEvent,
} from "@/lib/earningsStore";
import { gear as allGear } from "@/lib/data/gear";
import { formatPrice } from "@/lib/date";
import { Avatar } from "@/components/ui/Primitives";
import { Motif } from "@/components/ui/Motif";
import { cn, initialsFromLabel, motifFor, toneSurface } from "@/lib/utils";

const view = copy.teacherView;

/**
 * The message pane, from the teacher's side of a conversation — the right
 * pane of <MessagesShell> when the browser has a teaching profile, in place
 * of the learner's <Conversation>.
 *
 * Built from the earnings ledger rather than a chat transcript: confirmed
 * lessons and shared links leave a durable record, small talk doesn't, so
 * this shows the former as cards on the right rather than pretending to
 * replay the latter.
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

  if (!mounted) return null;

  const learnerLabel = events[0]?.learnerLabel ?? view.genericLearner;
  const tone = events[0]?.tone ?? "sage";
  const skill = events[0]?.skill ?? "";

  return (
    <>
      {/* Same header shape as the learner's conversation pane, so the two
          feel like the same app rather than two different products. */}
      <div className="flex items-center gap-3 border-b border-ink/8 px-4 py-3.5">
        <Link
          href="/messages"
          className="-ml-1 rounded-full px-2 py-1 text-sm font-semibold lg:hidden"
        >
          <span aria-hidden="true">←</span>
          <span className="sr-only">{copy.thread.backToInbox}</span>
        </Link>
        <Avatar initials={initialsFromLabel(learnerLabel)} name={learnerLabel} tone={tone} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{learnerLabel}</p>
          <p className="truncate text-xs text-ink-faint">{skill}</p>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-cream/50 px-4 py-5">
        <p className="mx-auto max-w-sm rounded-2xl bg-paper px-4 py-3 text-center text-[0.8125rem] leading-relaxed text-ink-faint">
          {view.feedNote}
        </p>

        {events.map((event) => (
          <div key={event.id} className="flex justify-end">
            {event.kind === "lesson" ? (
              <LessonCard event={event} />
            ) : (
              <AffiliateCard event={event} />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function LessonCard({ event }: { event: Extract<EarningEvent, { kind: "lesson" }> }) {
  return (
    <div className="w-[18rem] rounded-3xl rounded-br-lg bg-sage-wash p-5 shadow-[0_1px_2px_rgb(20_24_12/0.06)]">
      <p className="text-[0.625rem] font-bold tracking-[0.14em] text-forest/70 uppercase">
        {view.lessonTitle}
      </p>
      <p className="mt-2 text-lg leading-snug font-bold">
        {event.dateLabel}, {event.timeLabel}
      </p>
      <dl className="mt-3 space-y-1 text-[0.8125rem] text-ink-soft">
        <div className="flex justify-between gap-3">
          <dt>{copy.bookingCard.peopleLabel}</dt>
          <dd className="tabular font-medium">{formatPrice(event.gross)}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-ink/15 pt-1.5">
          <dt className="font-semibold text-ink">{view.lessonNote(formatPrice(event.payout))}</dt>
        </div>
      </dl>
    </div>
  );
}

function AffiliateCard({ event }: { event: Extract<EarningEvent, { kind: "affiliate" }> }) {
  const item = allGear.find((g) => g.id === event.gearId);

  return (
    <div className="w-[18rem] overflow-hidden rounded-3xl rounded-br-lg bg-paper shadow-[0_1px_2px_rgb(20_24_12/0.06)]">
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
          {view.affiliateTitle}
        </p>
        <p className="mt-1.5 font-bold">{event.itemName}</p>
        <p className="mt-2 border-t border-ink/10 pt-2 text-[0.8125rem] font-semibold text-forest">
          {view.affiliateNote(formatPrice(event.estimatedPayout))}
        </p>
      </div>
    </div>
  );
}
