"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GearItem, Tone } from "@/lib/types";
import { messages as copy } from "@/content";
import { fallbackReply, type ScriptedReply } from "@/lib/data/demoScript";
import { Avatar } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { GearDrawer } from "./GearDrawer";
import { LinkPreview } from "./LinkPreview";
import { cn } from "@/lib/utils";

/** Serializable view model — the server does all date and money formatting. */
export interface ChatMessage {
  id: string;
  kind: "text" | "product" | "booking" | "system";
  mine: boolean;
  time: string;
  body?: string;
  gear?: GearItem;
  booking?: {
    dateLabel: string;
    timeLabel: string;
    durationLabel: string;
    peopleLabel: string;
    totalLabel: string;
    status: "pending" | "confirmed";
  };
}

export interface ChatPartner {
  name: string;
  initials: string;
  tone: Tone;
  slug: string;
  skill: string;
  hourlyRate: number;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function Conversation({
  partner,
  initialMessages,
  gearItems,
  demo,
}: {
  partner: ChatPartner;
  initialMessages: ChatMessage[];
  /** Everything the shopping drawer can offer for this lesson. */
  gearItems: GearItem[];
  /** Scripted replies. Empty means the teacher stays quiet. */
  demo: ScriptedReply[];
}) {
  const [items, setItems] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [openSignal, setOpenSignal] = useState(0);
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
    setItems((prev) => [
      ...prev,
      { ...message, id: `local-${localId.current}`, time: "Just now" },
    ]);
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
        <ButtonLink href={`/experts/${partner.slug}`} variant="outline" size="sm">
          {copy.thread.bookCta}
        </ButtonLink>
      </div>

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
          <MessageRow key={message.id} message={message} partner={partner} />
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

function MessageRow({ message, partner }: { message: ChatMessage; partner: ChatPartner }) {
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

  if (message.kind === "booking" && message.booking) {
    return (
      <div className={cn("flex flex-col gap-1.5", align)}>
        <BookingMessage booking={message.booking} time={message.time} />
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
}: {
  booking: NonNullable<ChatMessage["booking"]>;
  time: string;
}) {
  const confirmed = booking.status === "confirmed";
  return (
    <div className="w-[17rem] rounded-3xl bg-lemon-soft p-5 shadow-[var(--shadow-lift)]">
      <p className="text-[0.625rem] font-bold tracking-[0.14em] text-ink/60 uppercase">
        {confirmed ? copy.bookingBanner.upcomingLabel : copy.bookingBanner.pendingLabel}
      </p>
      <p className="mt-2 text-lg leading-snug font-bold">
        {booking.dateLabel}, {booking.timeLabel}
      </p>
      <dl className="mt-3 space-y-1 text-[0.8125rem] text-ink-soft">
        <div className="flex justify-between gap-3">
          <dt>Length</dt>
          <dd className="tabular font-medium">{booking.durationLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Who&apos;s coming</dt>
          <dd className="font-medium">{booking.peopleLabel}</dd>
        </div>
        <div className="flex justify-between gap-3 border-t border-ink/15 pt-1.5">
          <dt className="font-semibold text-ink">Total</dt>
          <dd className="tabular font-bold text-ink">{booking.totalLabel}</dd>
        </div>
      </dl>
      <p className="tabular mt-3 text-[0.6875rem] text-ink/50">{time}</p>
    </div>
  );
}
