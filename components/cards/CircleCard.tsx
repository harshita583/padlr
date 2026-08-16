import type { Circle } from "@/lib/types";
import { circles as circlesCopy } from "@/content";
import { Badge } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { formatPrice, formatRelativeDay, formatTime } from "@/lib/date";
import { Motif } from "@/components/ui/Motif";
import { cn, motifFor, toneSurface } from "@/lib/utils";

export function CircleCard({ circle, className }: { circle: Circle; className?: string }) {
  const seatsOpen = circle.seatsTotal - circle.seatsTaken;
  const isFull = seatsOpen <= 0;

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden="true"
          className={cn(
            "relative size-14 shrink-0 overflow-hidden rounded-2xl",
            toneSurface[circle.tone],
          )}
        >
          <Motif variant={motifFor(circle.id)} opacity={0.35} />
        </span>
        {isFull ? (
          <Badge className="bg-ink/10 text-ink-soft">{circlesCopy.openCircles.fullLabel}</Badge>
        ) : (
          <Badge className="bg-sage-wash text-forest">
            {circlesCopy.openCircles.seatsFor(seatsOpen)}
          </Badge>
        )}
      </div>

      <h3 className="mt-4 text-lg leading-snug font-bold tracking-tight">{circle.title}</h3>

      <p className="mt-1.5 text-sm text-ink-soft">
        {circle.skill} · {circle.level}
      </p>

      <dl className="mt-4 space-y-1.5 text-sm text-ink-faint">
        <div className="flex gap-1.5">
          <dt className="sr-only">Started by</dt>
          <dd>Started by {circle.hostName}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="sr-only">When</dt>
          <dd>
            {formatRelativeDay(circle.startsAt)}, {formatTime(circle.startsAt)}
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="sr-only">Where</dt>
          <dd>{circle.neighbourhood}</dd>
        </div>
      </dl>

      {/* Seat pips make the "one more person" mechanic legible at a glance. */}
      <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: circle.seatsTotal }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full",
              i < circle.seatsTaken ? "bg-forest" : "bg-ink/12",
            )}
          />
        ))}
      </div>
      <p className="sr-only">
        {circle.seatsTaken} of {circle.seatsTotal} seats taken
      </p>

      <div className="mt-auto flex items-end justify-between gap-4 pt-5">
        <div>
          <p className="tabular text-2xl font-bold tracking-tight">
            {formatPrice(circle.pricePerPerson)}
          </p>
          <p className="text-xs text-ink-faint">
            {isFull
              ? "each"
              : `each · drops to ${formatPrice(circle.priceIfOneMore)} with one more`}
          </p>
        </div>
        <ButtonLink
          href="/circles"
          variant={isFull ? "outline" : "primary"}
          size="sm"
          aria-disabled={isFull}
        >
          {isFull ? circlesCopy.openCircles.fullLabel : circlesCopy.openCircles.joinCta}
        </ButtonLink>
      </div>
    </article>
  );
}
