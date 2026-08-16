import type { Metadata } from "next";
import { Suspense } from "react";
import { brand, common, discover } from "@/content";
import { getGearForCategories, searchExperts } from "@/lib/data";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { SearchForm } from "@/components/search/SearchForm";
import { FilterBar } from "@/components/search/FilterBar";
import { ExpertCard } from "@/components/cards/ExpertCard";
import { GearRail } from "@/components/gear/GearRail";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: discover.meta.title,
  description: discover.meta.description,
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function one(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const q = one(params.q) ?? "";
  const where = one(params.where) ?? brand.city;
  const sort = one(params.sort);
  const format = one(params.format);
  const availability = one(params.availability);
  const distance = one(params.distance);
  const maxPrice = one(params.maxPrice);

  const experts = await searchExperts({
    q,
    where,
    sort,
    format: format === "any" ? undefined : format,
    availability,
    maxDistance: distance ? Number(distance) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  // The gear rail follows whatever categories the results are actually in.
  const categorySlugs = [...new Set(experts.flatMap((e) => e.categories))];
  const gearItems = await getGearForCategories(categorySlugs);

  return (
    <>
      <div className="border-b border-ink/8 bg-paper">
        <Container className="py-8 sm:py-10">
          <SearchForm
            defaultQuery={q}
            defaultWhere={where}
            size="inline"
            submitLabel={discover.search.submit}
          />
        </Container>
      </div>

      <Section className="py-10 sm:py-14">
        <Container>
          <div className="flex flex-col gap-2">
            <Eyebrow>{discover.header.eyebrow}</Eyebrow>
            <h1 className="display text-[clamp(2rem,5vw,3.5rem)]">
              {discover.header.titleFor(q, where)}
            </h1>
            <p aria-live="polite" className="text-[1.0625rem] text-ink-soft">
              {discover.header.countFor(experts.length)}
            </p>
          </div>

          <div className="mt-8">
            {/* useSearchParams needs a Suspense boundary during prerender. */}
            <Suspense
              fallback={
                <div className="h-24 rounded-[var(--radius-card)] border border-ink/8 bg-paper" />
              }
            >
              <FilterBar resultCount={experts.length} />
            </Suspense>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
            <section aria-label={discover.results.landmarkLabel}>
              {experts.length > 0 ? (
                <ul className="flex flex-col gap-4">
                  {experts.map((expert) => (
                    <li key={expert.id}>
                      <ExpertCard expert={expert} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-[var(--radius-card)] border border-dashed border-ink/20 p-12 text-center">
                  <p aria-hidden="true" className="text-5xl">
                    🫙
                  </p>
                  <h2 className="display mt-4 text-3xl">{discover.results.emptyTitle}</h2>
                  <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
                    {discover.results.emptyBody}
                  </p>
                  <ButtonLink href="/discover" variant="outline" className="mt-6">
                    {common.actions.clearFilters}
                  </ButtonLink>
                </div>
              )}
            </section>

            {/* Sponsored / affiliate equipment. Always labelled — see GearRail. */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-5">
                <GearRail
                  items={gearItems}
                  eyebrow={discover.gear.eyebrow}
                  title={discover.gear.title}
                  body={discover.gear.body}
                  label={discover.gear.railLabel}
                  layout="grid"
                  compact
                />
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
