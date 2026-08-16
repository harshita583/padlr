"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { GearItem } from "@/lib/types";
import { common, messages as copy } from "@/content";
import { Avatar, Badge } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { cn, toneSurface } from "@/lib/utils";

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
  tone: "lemon" | "sage" | "sky" | "lilac" | "coral" | "olive" | "cream";
  slug: string;
  skill: string;
  hourlyRate: number;
}

export function Conversation({
  partner,
  initialMessages,
  gearRail,
}: {
  partner: ChatPartner;
  initialMessages: ChatMessage[];
  /** Server-rendered equipment row, shown above the composer. */
  gearRail?: ReactNode;
}) {
  const [items, setItems] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  // Scroll the log itself rather than calling scrollIntoView — the latter also
  // scrolls every ancestor, which drags the whole page sideways.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [items.length]);

  function send(text: string) {
    const body = text.trim();
    if (!body) return;
    setItems((prev) => [
      ...prev,
      {
        id: `local-${prev.length}`,
        kind: "text",
        mine: true,
        time: "Just now",
        body,
      },
    ]);
    setDraft("");
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
        <Avatar
          initials={partner.initials}
          name={partner.name}
          tone={partner.tone}
          size="sm"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{partner.name}</p>
          <p className="truncate text-xs text-ink-faint">
            {copy.thread.contextFor(partner.skill, partner.hourlyRate)}
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
        {items.map((message) => (
          <MessageRow key={message.id} message={message} partner={partner} />
        ))}
      </div>

      {/* Equipment row. Commercial content, clearly separated from the log. */}
      {gearRail ? (
        <div className="border-t border-ink/8 bg-paper px-4 py-4">{gearRail}</div>
      ) : null}

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

function MessageRow({ message, partner }: { message: ChatMessage; partner: ChatPartner }) {
  const align = message.mine ? "items-end" : "items-start";

  if (message.kind === "product" && message.gear) {
    return (
      <div className={cn("flex flex-col gap-1.5", align)}>
        {message.body ? <Bubble message={message} /> : null}
        <ProductMessage gear={message.gear} sender={partner.name} time={message.time} />
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

/**
 * A shopping link shared inside the conversation.
 *
 * The affiliate disclosure sits on the card itself, not in a footnote — the
 * person reading it needs to see it at the moment they decide to tap.
 */
function ProductMessage({
  gear,
  sender,
  time,
}: {
  gear: GearItem;
  sender: string;
  time: string;
}) {
  return (
    <figure className="w-[17rem] overflow-hidden rounded-3xl rounded-bl-lg bg-paper shadow-[var(--shadow-lift)]">
      <div className={cn("grid h-24 place-items-center", toneSurface[gear.tone])}>
        <span aria-hidden="true" className="text-4xl">
          {gear.emoji}
        </span>
      </div>
      <figcaption className="p-4">
        <p className="text-[0.625rem] font-bold tracking-[0.14em] text-ink-faint uppercase">
          {copy.productCard.sentByLabel(sender)}
        </p>
        <p className="mt-1.5 leading-snug font-bold">{gear.name}</p>
        <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">{gear.blurb}</p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="tabular font-bold">{gear.price}</span>
          <a
            href={gear.url}
            target="_blank"
            rel="noreferrer noopener sponsored"
            className="rounded-full bg-forest px-4 py-1.5 text-[0.8125rem] font-semibold text-paper transition-colors hover:bg-olive"
          >
            {copy.productCard.viewItem}
            <span className="sr-only"> — {common.a11y.externalLink}</span>
          </a>
        </div>

        {gear.affiliate ? (
          <p className="mt-3 flex items-start gap-1.5 border-t border-ink/10 pt-3 text-[0.6875rem] leading-relaxed text-ink-faint">
            <Badge className="shrink-0 bg-ink/8 px-2 py-0.5 text-[0.5625rem] text-ink-faint">
              {copy.productCard.disclosure}
            </Badge>
            {common.disclosure.inChat}
          </p>
        ) : null}

        <p className="tabular mt-2 text-[0.6875rem] text-ink-faint">{time}</p>
      </figcaption>
    </figure>
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
