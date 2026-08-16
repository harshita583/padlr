"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { messages as copy } from "@/content";
import { CIRCLES_EVENT, readCircle, type MyCircle } from "@/lib/circlesStore";
import { quoteCircle } from "@/lib/pricing";
import { formatDuration, formatPrice, formatRelativeDay, formatTime } from "@/lib/date";
import { cn } from "@/lib/utils";

const card = copy.circleCard;

/**
 * A circle request, sitting in the teacher's conversation.
 *
 * Reads the circle straight from the store rather than taking it as a prop, so
 * the status here and the status on /circles are the same fact — approve it in
 * either place and both update.
 */
export function CircleRequestMessage({
  circleId,
  time,
  partnerName,
  onDecide,
}: {
  circleId: string;
  time: string;
  partnerName: string;
  onDecide: (status: "open" | "declined", seats: number) => void;
}) {
  const [circle, setCircle] = useState<MyCircle | null>(null);

  useEffect(() => {
    const read = () => setCircle(readCircle(circleId));
    read();
    window.addEventListener(CIRCLES_EVENT, read);
    return () => window.removeEventListener(CIRCLES_EVENT, read);
  }, [circleId]);

  // Deleted from /circles while the thread was open.
  if (!circle) return null;

  const quote = quoteCircle({
    baseRate: circle.baseRate,
    groupUplift: circle.groupUplift,
    durationMinutes: circle.durationMinutes,
    members: circle.members.length,
    seatsTotal: circle.seatsTotal,
  });

  const { status } = circle;

  const surface =
    status === "open" ? "bg-sage-wash" : status === "declined" ? "bg-ink/8" : "bg-lemon-soft";

  const title =
    status === "open"
      ? card.openTitle
      : status === "declined"
        ? card.declinedTitle
        : card.pendingTitle(partnerName);

  const note =
    status === "open"
      ? card.openNote
      : status === "declined"
        ? card.declinedNote
        : card.pendingNote;

  return (
    <div className={cn("w-[18rem] rounded-3xl p-5 shadow-[var(--shadow-lift)]", surface)}>
      <p className="text-[0.625rem] font-bold tracking-[0.14em] text-ink/60 uppercase">
        {title}
      </p>
      <p
        className={cn(
          "mt-2 text-lg leading-snug font-bold",
          status === "declined" && "text-ink/60 line-through",
        )}
      >
        {circle.title}
      </p>
      <p className="mt-1 text-[0.8125rem] text-ink-soft">
        {formatRelativeDay(circle.date)}, {formatTime(circle.time)}
      </p>

      <dl className="mt-3 space-y-1 text-[0.8125rem] text-ink-soft">
        <div className="flex justify-between gap-3">
          <dt>{card.lengthLabel}</dt>
          <dd className="tabular font-medium">{formatDuration(circle.durationMinutes)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{card.levelLabel}</dt>
          <dd className="font-medium">{circle.level}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{card.seatsLabel}</dt>
          <dd className="tabular font-medium">
            {card.seatsFor(quote.seatsOpen, circle.seatsTotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-ink/15 pt-1.5">
          <dt className="font-semibold text-ink">{card.eachLabel}</dt>
          <dd className="tabular font-bold text-ink">{formatPrice(quote.perPerson)}</dd>
        </div>
      </dl>

      <p className="mt-3 text-[0.6875rem] leading-relaxed text-ink/60">{note}</p>

      {/* The other side of the handshake, same as the booking card. Delete this
          block when real teacher accounts exist. */}
      {status === "pending" ? (
        <div className="mt-4 border-t border-dashed border-ink/25 pt-3">
          <p className="text-[0.625rem] font-bold tracking-[0.12em] text-ink/45 uppercase">
            {card.teacherControlsLabel}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => onDecide("open", circle.seatsTotal)}
              className="flex-1 rounded-full bg-forest px-3 py-2 text-[0.8125rem] font-semibold text-paper transition-colors hover:bg-olive"
            >
              {card.approve}
            </button>
            <button
              type="button"
              onClick={() => onDecide("declined", circle.seatsTotal)}
              className="flex-1 rounded-full border-2 border-ink/20 px-3 py-2 text-[0.8125rem] font-semibold transition-colors hover:border-ink/40"
            >
              {card.decline}
            </button>
          </div>
        </div>
      ) : null}

      {/* Sharing and seats live on /circles — one place that owns the circle. */}
      {status === "open" ? (
        <Link
          href="/circles#your-circles"
          className="mt-4 block rounded-full border-2 border-forest/25 px-3 py-2 text-center text-[0.8125rem] font-semibold text-forest transition-colors hover:border-forest/60"
        >
          {card.manage}
        </Link>
      ) : null}

      <p className="tabular mt-3 text-[0.6875rem] text-ink/50">{time}</p>
    </div>
  );
}
