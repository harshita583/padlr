"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { BookableDay, GearItem, Tone } from "@/lib/types";
import { messages as copy } from "@/content";
import { fallbackReply, type ScriptedReply } from "@/lib/data/demoScript";
import { Avatar } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { BookingDialog, type BookingRequest } from "./BookingDialog";
import { GearDrawer } from "./GearDrawer";
import { ShareDialog } from "./ShareDialog";
import { LinkPreview } from "./LinkPreview";
import { formatDuration, formatPrice } from "@/lib/date";
import { cn } from "@/lib/utils";
import { newlyEarned } from "@/lib/badges";
import { emptyStats, readProfile, recordLesson } from "@/lib/profile";
import { BadgeAward } from "./BadgeAward";

/** Serializable view model — the server does all date and money formatting. */
export interface ChatMessage {
  id: string;
  kind: "text" | "product" | "booking" | "system";
  mine: boolean;
  time: string;
  body?: string;
  gear?: GearItem;
  /** Set when `kind === "system"` and the message announces a badge. */
  badgeId?: string;
  booking?: {
    dateLabel: string;
    timeLabel: string;
    durationLabel: string;
    peopleLabel: string;
    totalLabel: string;
    /** Kept as a number as well as a label, because badges count on it. */
    people: number;
    status: "pending" | "confirmed" | "declined";
  };
}

export interface ChatPartner {
  name: string;
  initials: string;
  tone: Tone;
  slug: string;
  skill: string;
  hourlyRate: number;
  groupUplift: number;
  /** Which craft this thread counts towards for badges. */
  categorySlug: string;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function Conversation({
  partner,
  initialMessages,
  gearItems,
  demo,
  days,
}: {
  partner: ChatPartner;
  initialMessages: ChatMessage[];
  /** Availability for the in-chat booking overlay, formatted on the server. */
  days: BookableDay[];
  /** Everything the shopping drawer can offer for this lesson. */
  gearItems: GearItem[];
  /** Scripted replies. Empty means the teacher stays quiet. */
  demo: ScriptedReply[];
}) {
  const [items, setItems] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [openSignal, setOpenSignal] = useState(0);
  const [bookingOpen, setBookingOpen] = useState(false);
  const usedReplies = useRef(new Set<number>());
  const cancelled = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  const localId = useRef(0);

  const gearById = useMemo(
    () => new Map(gearItems.map((item) => [item.id, item])),
    [gearItems],
  );

  /** The drawer only exists once the teacher has actually shared something. */
  const teacherHasShared = items.some((m) => m.kind === "product" && !m.mine);

  // Stop any in-flight scripted reply if the component goes away.
  useEffect(() => {
    cancelled.current = false;
    return () => {
      cancelled.current = true;
    };
  }, []);

  // Scroll the log itself rather than calling scrollIntoView — the latter also
  // scrolls every ancestor, which drags the whole page sideways.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [items.length, typing]);

  function append(message: Omit<ChatMessage, "id" | "time">) {
    localId.current += 1;
    const id = `local-${localId.current}`;
    setItems((prev) => [...prev, { ...message, id, time: "Just now" }]);
    return id;
  }

  /** Turn the overlay's answers into an appointment card in the thread. */
  function handleBookingConfirm(request: BookingRequest) {
    const day = days[request.dayIndex];
    const slotLabel =
      day?.slots.find((s) => s.value === request.slot)?.label ?? request.slot;

    append({
      kind: "booking",
      mine: true,
      booking: {
        dateLabel: day ? `${day.dayShort} ${day.dayNumber} ${day.month}` : "",
        timeLabel: slotLabel,
        durationLabel: formatDuration(request.durationMinutes),
        peopleLabel:
          request.people === 1 ? "Just you" : `${request.people} people`,
        totalLabel: formatPrice(request.total),
        people: request.people,
        status: "pending",
      },
    });
    setBookingOpen(false);
  }

  /** The teacher's decision, played back into the thread. */
  function decideBooking(messageId: string, status: "confirmed" | "declined") {
    const booked = items.find((m) => m.id === messageId)?.booking;

    setItems((prev) =>
      prev.map((m) =>
        m.id === messageId && m.booking
          ? { ...m, booking: { ...m.booking, status } }
          : m,
      ),
    );

    // A confirmed lesson is the thing that counts towards badges. Nothing
    // happens for people without a profile — badges belong to an account.
    if (status === "confirmed" && booked) {
      const before = readProfile()?.stats ?? emptyStats;
      const updated = recordLesson({
        categorySlug: partner.categorySlug,
        people: booked.people,
      });
      if (updated) {
        for (const def of newlyEarned(before, updated.stats)) {
          append({ kind: "system", mine: false, badgeId: def.id });
        }
      }
    }
    void (async () => {
      setTyping(true);
      await wait(1400);
      if (cancelled.current) return;
      setTyping(false);
      append({
        kind: "text",
        mine: false,
        body:
          status === "confirmed"
            ? copy.bookingCard.approveReply
            : copy.bookingCard.declineReply,
      });
    })();
  }

  /** Keyword match first, then the next unused reply, then the fallback. */
  function pickReply(text: string): ScriptedReply {
    const said = text.toLowerCase();

    const matched = demo.findIndex(
      (reply, i) =>
        !usedReplies.current.has(i) &&
        reply.match?.some((keyword) => said.includes(keyword)),
    );
    if (matched !== -1) {
      usedReplies.current.add(matched);
      return demo[matched];
    }

    const next = demo.findIndex((reply, i) => !usedReplies.current.has(i) && !reply.match);
    if (next !== -1) {
      usedReplies.current.add(next);
      return demo[next];
    }

    return fallbackReply;
  }

  async function playReply(reply: ScriptedReply) {
    const perMessage = Math.max(900, reply.typingMs / reply.messages.length);

    for (const scripted of reply.messages) {
      setTyping(true);
      await wait(perMessage);
      if (cancelled.current) return;
      setTyping(false);

      if (scripted.kind === "product") {
        const gear = gearById.get(scripted.gearId);
        if (gear) {
          append({ kind: "product", mine: false, body: scripted.body, gear });
          setOpenSignal((n) => n + 1);
        }
      } else {
        append({ kind: "text", mine: false, body: scripted.body });
      }

      await wait(350);
      if (cancelled.current) return;
    }
  }

  function send(text: string) {
    const body = text.trim();
    if (!body) return;
    append({ kind: "text", mine: true, body });
    setDraft("");
    if (demo.length > 0) void playReply(pickReply(body));
  }

  return (
    <>
      {/* Conversation header */}
      <div className="flex items-center gap-3 border-b border-ink/8 px-4 py-3.5">
        <Link
          href="/messages"
          className="-ml-1 rounded-full px-2 py-1 text-sm font-semibold lg:hidden"
        >
          <span aria-hidden="true">←</span>
          <span className="sr-only">{copy.thread.backToInbox}</span>
        </Link>
        <Avatar initials={partner.initials} name={partner.name} tone={partner.tone} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{partner.name}</p>
          <p className="truncate text-xs text-ink-faint">
            {typing
              ? copy.thread.typingLabel(partner.name)
              : copy.thread.contextFor(partner.skill, partner.hourlyRate)}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setBookingOpen(true)}
        >
          {copy.bookingDialog.open}
        </Button>
      </div>

      <BookingDialog
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onConfirm={handleBookingConfirm}
        partnerName={partner.name}
        hourlyRate={partner.hourlyRate}
        groupUplift={partner.groupUplift}
        days={days}
      />

      {/* Message log */}
      <div
        ref={logRef}
        role="log"
        aria-label={copy.thread.historyLabel}
        aria-live="polite"
        className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-cream/50 px-4 py-5"
      >
        {demo.length > 0 ? (
          <p className="mx-auto w-fit rounded-full bg-ink/6 px-3.5 py-1.5 text-center text-[0.6875rem] font-medium text-ink-faint">
            {copy.thread.demoBanner}
          </p>
        ) : null}

        {items.map((message) => (
          <MessageRow
            key={message.id}
            message={message}
            partner={partner}
            onDecide={decideBooking}
          />
        ))}

        {typing ? <TypingIndicator name={partner.name} /> : null}
      </div>

      {/* Shopping drawer — hidden until the teacher shares a link */}
      <GearDrawer
        items={gearItems}
        available={teacherHasShared}
        openSignal={openSignal}
      />

      {/* Composer */}
      <div className="border-t border-ink/8 px-4 py-3">
        <ul className="mb-2.5 flex gap-2 overflow-x-auto pb-1">
          <li className="sr-only">{copy.composer.quickReplies.label}</li>
          {copy.composer.quickReplies.items.map((reply) => (
            <li key={reply}>
              <button
                type="button"
                onClick={() => send(reply)}
                className="rounded-full border border-ink/12 bg-paper px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors hover:border-ink/30"
              >
                {reply}
              </button>
            </li>
          ))}
        </ul>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(draft);
          }}
          className="flex items-end gap-2"
        >
          <div className="flex-1">
            <label htmlFor="composer" className="sr-only">
              {copy.composer.label}
            </label>
            <textarea
              id="composer"
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(draft);
                }
              }}
              placeholder={copy.composer.placeholder}
              aria-describedby="composer-hint"
              className="max-h-32 w-full resize-none rounded-3xl border-2 border-ink/12 bg-paper px-5 py-3 text-[0.9375rem] placeholder:text-ink-faint focus:border-forest focus:outline-none"
            />
            <p id="composer-hint" className="sr-only">
              {copy.composer.hint}
            </p>
          </div>
          <button
            type="submit"
            disabled={!draft.trim()}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-forest text-paper transition-colors hover:bg-olive disabled:opacity-40"
          >
            <span aria-hidden="true">↑</span>
            <span className="sr-only">{copy.composer.sendA11y}</span>
          </button>
        </form>
      </div>
    </>
  );
}

function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-start">
      <p className="flex items-center gap-1.5 rounded-3xl rounded-bl-lg bg-paper px-4 py-3.5 shadow-[0_1px_2px_rgb(20_24_12/0.06)]">
        <span className="sr-only">{copy.thread.typingLabel(name)}</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden="true"
            className="size-1.5 animate-bounce rounded-full bg-ink-faint"
            style={{ animationDelay: `${i * 140}ms`, animationDuration: "1s" }}
          />
        ))}
      </p>
    </div>
  );
}

function MessageRow({
  message,
  partner,
  onDecide,
}: {
  message: ChatMessage;
  partner: ChatPartner;
  onDecide: (id: string, status: "confirmed" | "declined") => void;
}) {
  const align = message.mine ? "items-end" : "items-start";

  if (message.kind === "product" && message.gear) {
    return (
      <div className={cn("flex flex-col gap-1.5", align)}>
        <LinkPreview
          item={message.gear}
          sender={partner.name}
          time={message.time}
          note={message.body}
        />
      </div>
    );
  }

  if (message.kind === "system" && message.badgeId) {
    return (
      <div className="flex flex-col items-center">
        <BadgeAward badgeId={message.badgeId} />
      </div>
    );
  }

  if (message.kind === "booking" && message.booking) {
    return (
      <div className={cn("flex flex-col gap-1.5", align)}>
        <BookingMessage
          booking={message.booking}
          time={message.time}
          partnerName={partner.name}
          skill={partner.skill}
          onDecide={(status) => onDecide(message.id, status)}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", align)}>
      <Bubble message={message} />
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  return (
    <div className="max-w-[85%] sm:max-w-[70%]">
      <p
        className={cn(
          "rounded-3xl px-4 py-2.5 text-[0.9375rem] leading-relaxed",
          message.mine
            ? "rounded-br-lg bg-forest text-paper"
            : "rounded-bl-lg bg-paper text-ink shadow-[0_1px_2px_rgb(20_24_12/0.06)]",
        )}
      >
        {message.body}
      </p>
      <p
        className={cn(
          "tabular mt-1 text-[0.6875rem] text-ink-faint",
          message.mine && "text-right",
        )}
      >
        {message.time}
      </p>
    </div>
  );
}

function BookingMessage({
  booking,
  time,
  partnerName,
  skill,
  onDecide,
}: {
  booking: NonNullable<ChatMessage["booking"]>;
  time: string;
  partnerName: string;
  skill: string;
  onDecide: (status: "confirmed" | "declined") => void;
}) {
  const card = copy.bookingCard;
  const { status } = booking;
  const [shareOpen, setShareOpen] = useState(false);

  const surface =
    status === "confirmed"
      ? "bg-sage-wash"
      : status === "declined"
        ? "bg-ink/8"
        : "bg-lemon-soft";

  const title =
    status === "confirmed"
      ? card.confirmedTitle
      : status === "declined"
        ? card.declinedTitle
        : card.pendingTitle(partnerName);

  const note =
    status === "confirmed"
      ? card.confirmedNote
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
        {booking.dateLabel}, {booking.timeLabel}
      </p>

      <dl className="mt-3 space-y-1 text-[0.8125rem] text-ink-soft">
        <div className="flex justify-between gap-3">
          <dt>{card.lengthLabel}</dt>
          <dd className="tabular font-medium">{booking.durationLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>{card.peopleLabel}</dt>
          <dd className="font-medium">{booking.peopleLabel}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-ink/15 pt-1.5">
          <dt className="font-semibold text-ink">{card.totalLabel}</dt>
          <dd className="tabular font-bold text-ink">{booking.totalLabel}</dd>
        </div>
      </dl>

      <p className="mt-3 text-[0.6875rem] leading-relaxed text-ink/60">{note}</p>

      {/* The other side of the handshake. Only rendered while a request is
          outstanding, and labelled so nobody mistakes it for the learner's
          own controls. Delete this block when real teacher accounts exist. */}
      {status === "pending" ? (
        <div className="mt-4 border-t border-dashed border-ink/25 pt-3">
          <p className="text-[0.625rem] font-bold tracking-[0.12em] text-ink/45 uppercase">
            {card.teacherControlsLabel}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => onDecide("confirmed")}
              className="flex-1 rounded-full bg-forest px-3 py-2 text-[0.8125rem] font-semibold text-paper transition-colors hover:bg-olive"
            >
              {card.approve}
            </button>
            <button
              type="button"
              onClick={() => onDecide("declined")}
              className="flex-1 rounded-full border-2 border-ink/20 px-3 py-2 text-[0.8125rem] font-semibold transition-colors hover:border-ink/40"
            >
              {card.decline}
            </button>
          </div>
        </div>
      ) : null}

      {/* Sharing is only offered once a lesson is actually confirmed — there's
          nothing to announce before that, and a declined one shouldn't invite
          a post. */}
      {status === "confirmed" ? (
        <>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="mt-4 w-full rounded-full border-2 border-forest/25 px-3 py-2 text-[0.8125rem] font-semibold text-forest transition-colors hover:border-forest/60"
          >
            {card.share}
          </button>
          <ShareDialog
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            skill={skill}
            when={`on ${booking.dateLabel} at ${booking.timeLabel}`}
          />
        </>
      ) : null}

      <p className="tabular mt-3 text-[0.6875rem] text-ink/50">{time}</p>
    </div>
  );
}
