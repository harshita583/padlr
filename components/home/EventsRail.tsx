import type { Event, Expert } from "@/lib/types";
import { home } from "@/content";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { EventCard } from "@/components/cards/EventCard";

const copy = home.events;

/**
 * Horizontally scrolling on small screens, a grid on large ones. The scroller
 * is focusable and labelled so keyboard users can reach it.
 */
export function EventsRail({
  events,
  hosts,
}: {
  events: Event[];
  hosts: Record<string, Expert | undefined>;
}) {
  return (
    <Section className="bg-paper">
      <Container>
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          body={copy.body}
          action={{ label: copy.viewAll, href: "/events" }}
        />
      </Container>

      <div
        role="region"
        aria-label={copy.railLabel}
        tabIndex={0}
        className="mt-12 overflow-x-auto pb-4 lg:overflow-visible"
      >
        <Container>
          <ul className="flex w-max gap-4 lg:grid lg:w-full lg:grid-cols-4">
            {events.map((event) => (
              <li key={event.id} className="w-[19rem] lg:w-auto">
                <EventCard event={event} host={hosts[event.hostId]} />
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </Section>
  );
}
