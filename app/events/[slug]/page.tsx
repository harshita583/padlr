import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { common, events as copy } from "@/content";
import { getEvent, getEvents, getEventsByHost, getExpertById } from "@/lib/data";
import {
  formatDateFull,
  formatDuration,
  formatPrice,
  formatTime,
} from "@/lib/date";
import { Avatar, Badge, Container, Rating, Section } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";
import { EventCard } from "@/components/cards/EventCard";
import { cn, toneSurface } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const list = await getEvents();
  return list.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return {};
  return { title: event.title, description: event.summary };
}

export default async function EventPage({ params }: { params: Params }) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  const host = await getExpertById(event.hostId);
  const otherEvents = host
    ? (await getEventsByHost(host.id)).filter((e) => e.id !== event.id)
    : [];

  const spotsLeft = event.capacity - event.booked;
  const isFull = spotsLeft <= 0;

  return (
    <>
      {/* Poster header */}
      <div className={cn("relative overflow-hidden", toneSurface[event.tone])}>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 -bottom-16 text-[18rem] leading-none opacity-15 select-none"
        >
          {event.emoji}
        </span>
        <Container className="relative py-12 sm:py-16">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-current/30 decoration-2 underline-offset-4 hover:decoration-current"
          >
            <span aria-hidden="true">←</span> {copy.index.eyebrow}
          </Link>

          <div className="mt-6 flex flex-wrap gap-2">
            <Badge className="bg-paper/80 text-ink">{event.level}</Badge>
            <Badge className="bg-paper/80 text-ink">
              {isFull ? copy.card.fullLabel : copy.card.spotsFor(spotsLeft)}
            </Badge>
          </div>

          <h1 className="display mt-5 max-w-3xl text-[clamp(2.5rem,7vw,5rem)]">{event.title}</h1>
          <p className="mt-4 max-w-2xl text-lg opacity-80">{event.summary}</p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
            <div>
              <dt className="text-[0.6875rem] font-bold tracking-[0.16em] uppercase opacity-60">
                When
              </dt>
              <dd className="mt-1 text-[1.0625rem] font-semibold">
                <time dateTime={event.startsAt}>
                  {formatDateFull(event.startsAt)}, {formatTime(event.startsAt)}
                </time>
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] font-bold tracking-[0.16em] uppercase opacity-60">
                How long
              </dt>
              <dd className="mt-1 text-[1.0625rem] font-semibold">
                {formatDuration(event.durationMinutes)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] font-bold tracking-[0.16em] uppercase opacity-60">
                {copy.detail.capacityLabel}
              </dt>
              <dd className="mt-1 text-[1.0625rem] font-semibold">
                {copy.detail.capacityFor(event.booked, event.capacity)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] font-bold tracking-[0.16em] uppercase opacity-60">
                {copy.detail.priceLabel}
              </dt>
              <dd className="tabular mt-1 text-[1.0625rem] font-semibold">
                {event.price === 0 ? copy.detail.freeLabel : formatPrice(event.price)}
              </dd>
            </div>
          </dl>
        </Container>
      </div>

      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_22rem]">
            <div className="min-w-0">
              <section aria-labelledby="about-heading">
                <h2 id="about-heading" className="display text-3xl">
                  {copy.detail.aboutLabel}
                </h2>
                <div className="mt-4 flex max-w-2xl flex-col gap-4 text-[1.0625rem] leading-relaxed text-ink-soft">
                  {event.about.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <section aria-labelledby="schedule-heading" className="mt-12">
                <h2 id="schedule-heading" className="display text-3xl">
                  {copy.detail.scheduleLabel}
                </h2>
                <ol className="mt-5 border-t border-ink/12">
                  {event.schedule.map((row) => (
                    <li
                      key={row.time}
                      className="flex gap-5 border-b border-ink/12 py-4 sm:gap-8"
                    >
                      <span className="tabular w-16 shrink-0 font-bold">
                        {formatTime(row.time)}
                      </span>
                      <span className="text-[1.0625rem] text-ink-soft">{row.label}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="bring-heading" className="mt-12">
                <h2 id="bring-heading" className="display text-3xl">
                  {copy.detail.bringLabel}
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {event.bring.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-paper px-4 py-2 text-[0.9375rem] font-medium"
                    >
                      <span aria-hidden="true">✓ </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {host ? (
                <section aria-labelledby="host-heading" className="mt-12">
                  <h2 id="host-heading" className="display text-3xl">
                    {copy.detail.hostedBy}
                  </h2>
                  <div className="mt-5 flex flex-col gap-5 rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6 sm:flex-row sm:items-center">
                    <Avatar
                      initials={host.initials}
                      name={host.name}
                      tone={host.tone}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-bold">{host.name}</p>
                      <p className="text-[0.9375rem] text-ink-soft">{host.headline}</p>
                      <div className="mt-2">
                        <Rating
                          rating={host.rating}
                          count={host.reviewCount}
                          label={common.a11y.ratingOf(host.rating, host.reviewCount)}
                        />
                      </div>
                    </div>
                    <ButtonLink href={`/experts/${host.slug}`} variant="outline" size="sm">
                      {common.actions.viewProfile}
                    </ButtonLink>
                  </div>
                </section>
              ) : null}
            </div>

            {/* Booking rail */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6 shadow-[var(--shadow-lift)]">
                <p className="tabular text-3xl font-bold tracking-tight">
                  {event.price === 0 ? copy.detail.freeLabel : formatPrice(event.price)}
                  <span className="ml-1.5 text-sm font-normal text-ink-faint">
                    {copy.detail.priceLabel.toLowerCase()}
                  </span>
                </p>

                <div className="mt-5" aria-hidden="true">
                  <div className="flex gap-1">
                    {Array.from({ length: event.capacity }, (_, i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-2 flex-1 rounded-full",
                          i < event.booked ? "bg-forest" : "bg-ink/12",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-ink-faint">
                  {copy.detail.capacityFor(event.booked, event.capacity)}
                </p>

                <ButtonLink
                  href={`/messages`}
                  size="lg"
                  variant={isFull ? "outline" : "primary"}
                  className="mt-5 w-full"
                >
                  {isFull ? copy.detail.waitlist : copy.detail.reserve}
                </ButtonLink>
                <p className="mt-2 text-center text-xs text-ink-faint">
                  {copy.detail.reserveHint}
                </p>

                <div className="mt-6 border-t border-ink/12 pt-5">
                  <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
                    {copy.detail.locationLabel}
                  </p>
                  <p className="mt-1.5 font-semibold">{event.venue}</p>
                  <p className="text-sm text-ink-soft">
                    {event.neighbourhood} · {common.labels.milesAway(event.distanceMiles)}
                  </p>
                  <p className="mt-2 text-xs text-ink-faint">{copy.detail.locationNote}</p>
                </div>

                <div className="mt-6 rounded-2xl bg-lemon-soft p-5">
                  <p className="font-bold">{copy.detail.bringFriends.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    {copy.detail.bringFriends.body}
                  </p>
                  <ButtonLink
                    href="/circles"
                    variant="secondary"
                    size="sm"
                    className="mt-4 w-full"
                  >
                    {copy.detail.bringFriends.cta}
                  </ButtonLink>
                </div>
              </div>
            </aside>
          </div>

          {otherEvents.length > 0 ? (
            <section aria-labelledby="more-heading" className="mt-20">
              <h2 id="more-heading" className="display text-3xl">
                {copy.detail.hostOther}
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {otherEvents.map((other) => (
                  <li key={other.id}>
                    <EventCard event={other} host={host} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </Container>
      </Section>
    </>
  );
}
