import Link from "next/link";
import { common, home } from "@/content";
import type { Expert } from "@/lib/types";
import { Avatar, Container, Rating } from "@/components/ui/Primitives";
import { Motif } from "@/components/ui/Motif";
import { SearchForm } from "@/components/search/SearchForm";
import { formatPrice } from "@/lib/date";

const copy = home.hero;

export function Hero({ sample }: { sample?: Expert }) {
  return (
    <section className="relative overflow-hidden bg-sage">
      {/* Soft light wash, so the flat green reads as a surface rather than a swatch. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,253,247,0.55),transparent_60%)]"
      />

      <Container className="relative pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h1 className="display max-w-[14ch] text-[clamp(3rem,8vw,5.5rem)] text-olive">
              {copy.headline}
            </h1>

            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-olive/85 sm:text-lg">
              {copy.body}
            </p>

            <SearchForm className="mt-9 max-w-2xl" />

            <div className="mt-6">
              <h2 className="text-[0.6875rem] font-bold tracking-[0.18em] text-olive/60 uppercase">
                {copy.search.skill.suggestionsLabel}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {copy.chips.map((chip) => (
                  <li key={chip.label}>
                    <Link
                      href={chip.href}
                      className="inline-block rounded-full border border-olive/15 bg-paper/70 px-4 py-2 text-sm font-semibold text-olive transition-colors hover:border-olive/35 hover:bg-paper"
                    >
                      {chip.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* A real teacher and a real number, rather than decoration. */}
          <div className="hidden lg:block">
            <div className="relative mx-auto max-w-xs">
              <div className="relative overflow-hidden rounded-[var(--radius-slab)] bg-olive p-8 pb-16 text-cream shadow-[var(--shadow-lift)]">
                <Motif variant="arcs" opacity={0.16} />
                <p className="tabular relative text-6xl leading-none font-bold tracking-tight text-lemon">
                  {copy.stat.value}
                </p>
                <p className="relative mt-3 text-[0.9375rem] leading-snug text-cream/80">
                  {copy.stat.label}
                </p>
              </div>

              {sample ? (
                <div className="relative -mt-10 ml-6 rotate-2 rounded-[var(--radius-card)] bg-paper p-5 shadow-[var(--shadow-lift)]">
                  <p className="text-[0.625rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
                    {copy.sampleLabel}
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <Avatar
                      initials={sample.initials}
                      name={sample.name}
                      tone={sample.tone}
                      size="md"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-bold">{sample.name}</p>
                      <p className="truncate text-[0.8125rem] text-ink-soft">
                        {sample.skills[0]} · {sample.neighbourhood}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
                    <Rating
                      rating={sample.rating}
                      count={sample.reviewCount}
                      label={common.a11y.ratingOf(sample.rating, sample.reviewCount)}
                    />
                    <p className="tabular font-bold">
                      {formatPrice(sample.hourlyRate)}
                      <span className="text-xs font-normal text-ink-faint">
                        {common.labels.perHour}
                      </span>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
