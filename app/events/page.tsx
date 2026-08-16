import type { Metadata } from "next";
import { Suspense } from "react";
import { events as copy } from "@/content";
import { getCategories, getExpertById, getFilteredEvents } from "@/lib/data";
import type { Expert } from "@/lib/types";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { EventFilters } from "@/components/events/EventFilters";
import { EventCard } from "@/components/cards/EventCard";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function EventsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const [categories, list] = await Promise.all([
    getCategories(),
    getFilteredEvents({
      when: one(params.when),
      category: one(params.category),
      price: one(params.price),
    }),
  ]);

  const hosts: Record<string, Expert | undefined> = {};
  for (const event of list) {
    hosts[event.hostId] = await getExpertById(event.hostId);
  }

  return (
    <>
      <div className="bg-olive text-cream">
        <Container className="py-14 sm:py-20">
          <Eyebrow className="text-cream/50">{copy.index.eyebrow}</Eyebrow>
          <h1 className="display mt-4 text-[clamp(2.75rem,8vw,5.5rem)]">
            {copy.index.headlineLines.map((line, i) => (
              <span key={line} className={i === 1 ? "block text-lemon italic" : "block"}>
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/75">
            {copy.index.body}
          </p>
        </Container>
      </div>

      <Section className="py-10 sm:py-14">
        <Container>
          <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-5">
            <Suspense fallback={<div className="h-16" />}>
              <EventFilters categories={categories} />
            </Suspense>
          </div>

          <p aria-live="polite" className="mt-6 text-sm text-ink-faint">
            {list.length} {list.length === 1 ? "class" : "classes"} coming up
          </p>

          {list.length > 0 ? (
            <ul
              aria-label={copy.index.listLabel}
              className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {list.map((event) => (
                <li key={event.id}>
                  <EventCard event={event} host={hosts[event.hostId]} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-[var(--radius-card)] border border-dashed border-ink/20 p-12 text-center">
              <p aria-hidden="true" className="text-5xl">
                🗓️
              </p>
              <h2 className="display mt-4 text-3xl">{copy.index.emptyTitle}</h2>
              <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
                {copy.index.emptyBody}
              </p>
              <ButtonLink href="/events" variant="outline" className="mt-6">
                Clear filters
              </ButtonLink>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
