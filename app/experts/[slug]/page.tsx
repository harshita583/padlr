import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { common, expert as copy } from "@/content";
import { getEventsByHost, getExpert, getExperts, getSimilarExperts } from "@/lib/data";
import {
  formatDayNumber,
  formatDayShort,
  formatMonthShort,
  formatTime,
} from "@/lib/date";
import { Avatar, Badge, Container, Rating, Rule, Section } from "@/components/ui/Primitives";
import { BookingPanel, type BookableDay } from "@/components/expert/BookingPanel";
import { EventCard } from "@/components/cards/EventCard";
import { ExpertCard } from "@/components/cards/ExpertCard";
import { toneSurface } from "@/lib/utils";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const experts = await getExperts();
  return experts.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const person = await getExpert(slug);
  if (!person) return {};
  return {
    title: copy.meta.titleFor(person.name, person.skills[0] ?? ""),
    description: person.headline,
  };
}

export default async function ExpertPage({ params }: { params: Params }) {
  const { slug } = await params;
  const person = await getExpert(slug);
  if (!person) notFound();

  const [hostedEvents, similar] = await Promise.all([
    getEventsByHost(person.id),
    getSimilarExperts(person),
  ]);

  // Format dates on the server so the client panel stays timezone-stable.
  const days: BookableDay[] = person.availability.map((day) => ({
    date: day.date,
    dayShort: formatDayShort(day.date),
    dayNumber: formatDayNumber(day.date),
    month: formatMonthShort(day.date),
    slots: day.slots.map((s) => ({ value: s, label: formatTime(s) })),
  }));

  return (
    <>
      {/* Profile header */}
      <div className={`${toneSurface[person.tone]} border-b border-ink/8`}>
        <Container className="py-8 sm:py-12">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-sm font-semibold underline decoration-current/30 decoration-2 underline-offset-4 hover:decoration-current"
          >
            <span aria-hidden="true">←</span> {copy.header.backToResults}
          </Link>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end">
            <Avatar
              initials={person.initials}
              name={person.name}
              tone="olive"
              size="xl"
              className="ring-4 ring-paper/60"
            />
            <div className="min-w-0 flex-1">
              <h1 className="display text-[clamp(2.25rem,5.5vw,4rem)]">{person.name}</h1>
              <p className="mt-1 max-w-2xl text-lg opacity-80">{person.headline}</p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.9375rem]">
                <Rating
                  rating={person.rating}
                  count={person.reviewCount}
                  label={common.a11y.ratingOf(person.rating, person.reviewCount)}
                />
                <span>
                  {person.neighbourhood} · {common.labels.milesAway(person.distanceMiles)}
                </span>
                <span>{common.labels.lessonCount(person.lessonsTaught)}</span>
              </div>

              <ul className="mt-4 flex flex-wrap gap-2">
                {person.verified ? (
                  <li>
                    <Badge className="bg-paper/80 text-ink">{copy.badges.verified}</Badge>
                  </li>
                ) : null}
                {person.rating >= 4.9 ? (
                  <li>
                    <Badge className="bg-paper/80 text-ink">{copy.badges.topRated}</Badge>
                  </li>
                ) : null}
                <li>
                  <Badge className="bg-paper/80 text-ink">
                    {common.labels.respondsIn(person.responseTime)}
                  </Badge>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      <Section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_23rem]">
            <div className="min-w-0">
              {/* About */}
              <section aria-labelledby="about-heading">
                <h2 id="about-heading" className="display text-3xl">
                  {copy.header.aboutLabel}
                </h2>
                <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
                  {person.bio}
                </p>

                <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
                      {copy.header.teachesLabel}
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {person.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-ink/6 px-3 py-1 text-sm font-medium capitalize"
                        >
                          {skill}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
                      Speaks
                    </dt>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {person.languages.map((language) => (
                        <span
                          key={language}
                          className="rounded-full bg-ink/6 px-3 py-1 text-sm font-medium"
                        >
                          {language}
                        </span>
                      ))}
                    </dd>
                  </div>
                </dl>
              </section>

              <Rule className="my-12" />

              {/* Where you'd meet */}
              <section aria-labelledby="location-heading">
                <h2 id="location-heading" className="display text-3xl">
                  {copy.sections.location.title}
                </h2>
                <div className="mt-4 rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6">
                  <p className="text-[1.0625rem] font-medium">{person.meetingNote}</p>
                  <p className="mt-2 text-sm text-ink-faint">{copy.sections.location.body}</p>
                </div>
              </section>

              {/* Classes */}
              {hostedEvents.length > 0 ? (
                <>
                  <Rule className="my-12" />
                  <section aria-labelledby="classes-heading">
                    <h2 id="classes-heading" className="display text-3xl">
                      {copy.sections.classes.title}
                    </h2>
                    <p className="mt-2 text-[0.9375rem] text-ink-soft">
                      {copy.sections.classes.body}
                    </p>
                    <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                      {hostedEvents.map((event) => (
                        <li key={event.id}>
                          <EventCard event={event} />
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              ) : null}

              {/* Reviews */}
              <Rule className="my-12" />
              <section aria-labelledby="reviews-heading">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 id="reviews-heading" className="display text-3xl">
                    {copy.sections.reviews.title}
                  </h2>
                  <Rating
                    rating={person.rating}
                    count={person.reviewCount}
                    label={common.a11y.ratingOf(person.rating, person.reviewCount)}
                  />
                </div>

                {person.reviews.length > 0 ? (
                  <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                    {person.reviews.map((review) => (
                      <li
                        key={review.id}
                        className="flex flex-col rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            initials={review.initials}
                            name={review.author}
                            tone="cream"
                            size="sm"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold">{review.author}</p>
                            <p className="text-xs text-ink-faint">
                              {review.skill} · {review.date}
                            </p>
                          </div>
                          <span className="ml-auto" aria-hidden="true">
                            <span className="text-coral">{"★".repeat(review.rating)}</span>
                            <span className="text-ink/20">{"★".repeat(5 - review.rating)}</span>
                          </span>
                          <span className="sr-only">
                            {common.a11y.ratingOf(review.rating, 1)}
                          </span>
                        </div>
                        <blockquote className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">
                          {review.body}
                        </blockquote>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-ink/20 p-8 text-center">
                    <p className="font-semibold">{copy.sections.reviews.emptyTitle}</p>
                    <p className="mt-1 text-sm text-ink-soft">
                      {copy.sections.reviews.emptyBody}
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Booking */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <BookingPanel
                expertName={person.name}
                expertSlug={person.slug}
                hourlyRate={person.hourlyRate}
                groupUplift={person.groupUplift}
                days={days}
              />
            </aside>
          </div>

          {similar.length > 0 ? (
            <section aria-labelledby="similar-heading" className="mt-20">
              <h2 id="similar-heading" className="display text-3xl">
                {copy.sections.similar.title}
              </h2>
              <ul className="mt-6 flex flex-col gap-4">
                {similar.map((other) => (
                  <li key={other.id}>
                    <ExpertCard expert={other} />
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
