import { home } from "@/content";
import { Container, Section } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

const copy = home.proof;
const testimonials = home.testimonials.items;

/**
 * The 2×2 collage: chips, a headline statistic, a timer and a quote.
 * Directly modelled on the reference art — four flush panels, no gutters,
 * each doing one job.
 */
export function ProofCollage() {
  return (
    <Section className="pt-0">
      <Container>
        <div className="grid overflow-hidden rounded-[var(--radius-slab)] shadow-[var(--shadow-lift)] sm:grid-cols-2">
          {/* 1 — the chip wall */}
          <div className="relative min-h-[20rem] overflow-hidden bg-lemon p-7 sm:p-8">
            <h2 className="display text-3xl text-ink sm:text-4xl">
              {home.testimonials.title}
            </h2>
            <p className="mt-3 max-w-xs text-[0.9375rem] leading-snug text-ink/70">
              Real notes left after real lessons, from people in your city.
            </p>

            <ul
              aria-hidden="true"
              className="mt-7 flex flex-wrap gap-2 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
            >
              {testimonials.map((t) => (
                <li
                  key={t.name}
                  className="inline-flex items-center gap-2 rounded-full bg-paper/90 py-1.5 pr-4 pl-1.5 text-[0.8125rem] font-medium text-ink"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-olive text-[0.5625rem] font-bold text-cream">
                    {t.initials}
                  </span>
                  {t.text}
                </li>
              ))}
            </ul>
          </div>

          {/* 2 — the big number */}
          <div className="relative flex min-h-[20rem] flex-col justify-end bg-forest p-7 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_75%_15%,rgba(169,193,133,0.5),transparent_70%)]"
            />
            <p className="tabular relative text-[clamp(4rem,11vw,7rem)] leading-none font-bold tracking-tighter text-paper">
              {copy.stat.value}
            </p>
            <p className="relative mt-4 max-w-[16rem] text-[0.9375rem] leading-snug text-paper/80">
              {copy.stat.label}
            </p>
          </div>

          {/* 3 — the timer */}
          <div className="flex min-h-[18rem] flex-col items-center justify-center bg-sky p-8 text-center">
            <p className="tabular rounded-3xl bg-paper/45 px-8 py-4 text-5xl font-bold tracking-tight text-olive">
              {copy.aside.timer}
            </p>
            <p className="display mt-5 text-4xl text-sky-deep">{copy.aside.timerLabel}</p>
            <p className="mt-4 max-w-[18rem] text-[0.9375rem] leading-snug text-olive/70">
              {copy.aside.caption}
            </p>
          </div>

          {/* 4 — the quote */}
          <div className="relative flex min-h-[18rem] flex-col justify-end bg-olive p-7 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_10%,rgba(239,224,76,0.16),transparent_70%)]"
            />
            <figure className="relative">
              <blockquote>
                <p
                  className={cn(
                    "display text-[clamp(1.75rem,3.2vw,2.5rem)] text-cream",
                  )}
                >
                  “{copy.quote.text}”
                </p>
              </blockquote>
              <figcaption className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-block rounded-full bg-lemon px-3 py-1 text-xs font-bold text-ink">
                  {copy.quote.badge}
                </span>
                <span className="text-sm text-cream/70">{copy.quote.attribution}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </Container>
    </Section>
  );
}
