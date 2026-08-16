import Link from "next/link";
import type { Event, Expert } from "@/lib/types";
import { events as eventsCopy } from "@/content";
import { Badge } from "@/components/ui/Primitives";
import {
  formatDayNumber,
  formatDayShort,
  formatDuration,
  formatMonthShort,
  formatPrice,
  formatTime,
} from "@/lib/date";
import { Motif } from "@/components/ui/Motif";
import { cn, motifFor, toneSurface } from "@/lib/utils";

export function EventCard({
  event,
  host,
  className,
}: {
  event: Event;
  host?: Expert;
  className?: string;
}) {
  const spotsLeft = event.capacity - event.booked;
  const isFull = spotsLeft <= 0;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-ink/8 bg-paper transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
        className,
      )}
    >
      {/* Colour block standing in for a photo. Swap for <Image> when you have
          real event photography — the layout doesn't change. */}
      <div
        className={cn(
          "relative h-44 overflow-hidden",
          toneSurface[event.tone],
        )}
      >
        <Motif
          variant={motifFor(event.slug)}
          className="[mask-image:linear-gradient(to_bottom,black_0%,black_25%,transparent_70%)] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-110"
        />

        <time
          dateTime={event.startsAt}
          className="absolute top-4 left-4 flex w-14 flex-col items-center rounded-2xl bg-paper py-2 text-ink shadow-[var(--shadow-lift)]"
        >
          <span className="text-[0.625rem] font-bold tracking-[0.1em] text-ink-faint uppercase">
            {formatDayShort(event.startsAt)}
          </span>
          <span className="tabular text-xl leading-tight font-bold">
            {formatDayNumber(event.startsAt)}
          </span>
          <span className="text-[0.625rem] font-semibold text-ink-faint uppercase">
            {formatMonthShort(event.startsAt)}
          </span>
        </time>

        <div className="absolute top-4 right-4">
          {isFull ? (
            <Badge className="bg-ink text-cream">{eventsCopy.card.fullLabel}</Badge>
          ) : (
            <Badge className="bg-paper text-ink">{eventsCopy.card.spotsFor(spotsLeft)}</Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug font-bold tracking-tight">
          <Link href={`/events/${event.slug}`} className="before:absolute before:inset-0">
            {event.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-snug text-ink-soft">
          {event.summary}
        </p>

        <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-faint">
          <div className="flex gap-1.5">
            <dt className="sr-only">Time</dt>
            <dd>
              {formatTime(event.startsAt)} · {formatDuration(event.durationMinutes)}
            </dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="sr-only">Location</dt>
            <dd>{event.neighbourhood}</dd>
          </div>
        </dl>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-ink/8 pt-4">
          <p className="text-sm text-ink-faint">
            {host ? (
              <>
                {eventsCopy.detail.hostedBy}{" "}
                <span className="font-semibold text-ink">{host.name}</span>
              </>
            ) : (
              event.level
            )}
          </p>
          <p className="tabular text-xl font-bold tracking-tight">
            {event.price === 0 ? eventsCopy.card.freeLabel : formatPrice(event.price)}
          </p>
        </div>
      </div>
    </article>
  );
}
