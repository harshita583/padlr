import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { brand, common, discover } from "@/content";
import { searchExperts } from "@/lib/data";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { SearchForm } from "@/components/search/SearchForm";
import { FilterBar } from "@/components/search/FilterBar";
import { ExpertCard } from "@/components/cards/ExpertCard";
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

  // Sibling skills the current results also teach, as a way to widen a search
  // that came back thin.
  const relatedSkills = [...new Set(experts.flatMap((e) => e.skills))]
    .filter((skill) => skill !== q.trim().toLowerCase())
    .slice(0, 10);

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

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_18rem]">
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

            {/* Deliberately non-commercial. Shopping links only ever appear in
                a conversation, after a teacher has chosen to share one. */}
            <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
              {relatedSkills.length > 0 ? (
                <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-5">
                  <h2 className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
                    {discover.sidebar.relatedTitle}
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {relatedSkills.map((skill) => (
                      <li key={skill}>
                        <Link
                          href={`/discover?q=${encodeURIComponent(skill)}`}
                          className="inline-block rounded-full bg-ink/6 px-3 py-1.5 text-[0.8125rem] font-medium capitalize transition-colors hover:bg-ink/12"
                        >
                          {skill}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-[var(--radius-card)] bg-lemon-soft p-5">
                <p aria-hidden="true" className="text-2xl">
                  👯
                </p>
                <h2 className="mt-2 font-bold">{discover.sidebar.circlesTitle}</h2>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
                  {discover.sidebar.circlesBody}
                </p>
                <ButtonLink href="/circles" variant="secondary" size="sm" className="mt-4">
                  {discover.sidebar.circlesCta}
                </ButtonLink>
              </div>

              <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-5">
                <h2 className="font-bold">{discover.sidebar.missingTitle}</h2>
                <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">
                  {discover.sidebar.missingBody}
                </p>
                <ButtonLink href="/teach" variant="outline" size="sm" className="mt-4">
                  {discover.sidebar.missingCta}
                </ButtonLink>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
