import { waitlist } from "@/content";
import { Container } from "@/components/ui/Primitives";
import { WaitlistForm } from "@/components/waitlist/WaitlistForm";

/**
 * The email signup, between the hero and the category grid.
 *
 * Sits on its own thin band rather than inside either neighbour — it's
 * addressed to the minority of people the rest of the homepage doesn't apply
 * to yet (nobody near them teaching), so it shouldn't compete with the hero
 * or blend into "browse by craft" as if it were another category.
 */
export function WaitlistBanner() {
  return (
    <div className="border-b border-ink/8 bg-paper">
      <Container className="py-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="max-w-md">
            <p className="text-[0.6875rem] font-bold tracking-[0.18em] text-ink-soft uppercase">
              {waitlist.eyebrow}
            </p>
            <h2 className="display mt-2 text-2xl sm:text-3xl">{waitlist.title}</h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
              {waitlist.body}
            </p>
          </div>
          <WaitlistForm className="lg:shrink-0" />
        </div>
      </Container>
    </div>
  );
}
