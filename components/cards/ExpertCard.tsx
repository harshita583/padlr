import Link from "next/link";
import type { Expert } from "@/lib/types";
import { common, expert as expertCopy } from "@/content";
import { Avatar, Badge, Rating } from "@/components/ui/Primitives";
import { formatPrice } from "@/lib/date";
import { cn } from "@/lib/utils";

export function ExpertCard({ expert, className }: { expert: Expert; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-5 rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6 transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] sm:flex-row sm:gap-6",
        className,
      )}
    >
      <Avatar
        initials={expert.initials}
        name={expert.name}
        tone={expert.tone}
        size="lg"
        className="sm:size-20"
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-bold tracking-tight">
            {/* Stretched link: the whole card is the target, but only the name
                is announced as the link text. */}
            <Link href={`/experts/${expert.slug}`} className="before:absolute before:inset-0">
              {expert.name}
            </Link>
          </h3>
          {expert.verified ? (
            <Badge className="bg-sage-wash text-forest">
              {expertCopy.badges.verified}
            </Badge>
          ) : null}
        </div>

        <p className="mt-1.5 text-[0.9375rem] leading-snug text-ink-soft">{expert.headline}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-faint">
          <Rating
            rating={expert.rating}
            count={expert.reviewCount}
            label={common.a11y.ratingOf(expert.rating, expert.reviewCount)}
          />
          <span>
            {expert.neighbourhood}, {common.labels.milesAway(expert.distanceMiles)}
          </span>
          <span>{common.labels.respondsIn(expert.responseTime)}</span>
        </div>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {expert.skills.slice(0, 4).map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-ink/6 px-2.5 py-1 text-xs font-medium text-ink-soft capitalize"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex shrink-0 items-center gap-3 border-t border-ink/8 pt-4 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
        <p className="flex items-baseline gap-0.5">
          <span className="tabular text-2xl font-bold tracking-tight">
            {formatPrice(expert.hourlyRate)}
          </span>
          <span className="text-sm text-ink-faint">{common.labels.perHour}</span>
          <span className="sr-only">{common.a11y.priceOf(expert.hourlyRate)}</span>
        </p>
        <span className="text-sm font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 transition-colors group-hover:decoration-forest">
          {common.actions.viewProfile} <span aria-hidden="true">→</span>
        </span>
      </div>
    </article>
  );
}
