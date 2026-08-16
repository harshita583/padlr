import type { Metadata } from "next";
import { teach as copy } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/Primitives";
import { EarningsCalculator } from "@/components/teach/EarningsCalculator";
import { Faq } from "@/components/ui/Faq";
import { Motif } from "@/components/ui/Motif";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export default function TeachPage() {
  return (
    <>
      {/* Poster hero */}
      <div className="relative overflow-hidden bg-lemon">
        <Motif variant="rays" className="text-ink" opacity={0.08} />
        <Container className="relative py-16 sm:py-24">
          <div className="max-w-3xl">
            <Eyebrow className="text-ink/55">{copy.hero.eyebrow}</Eyebrow>
            <h1 className="poster mt-5 text-[clamp(2.75rem,8.5vw,6rem)] text-ink">
              {copy.hero.posterLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75">
              {copy.hero.body}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={copy.hero.cta.href} size="lg" variant="secondary">
                {copy.hero.cta.label}
              </ButtonLink>
              <ButtonLink href={copy.hero.secondary.href} size="lg" variant="outline">
                {copy.hero.secondary.label}
              </ButtonLink>
            </div>

            <dl className="mt-14 grid max-w-2xl grid-cols-1 gap-8 border-t border-ink/20 pt-8 sm:grid-cols-3">
              {copy.hero.stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="tabular block text-4xl font-bold tracking-tight text-ink">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-[0.9375rem] text-ink/65">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </div>

      {/* Earnings */}
      <Section>
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>{copy.earnings.eyebrow}</Eyebrow>
              <h2 className="display mt-3 text-[clamp(2rem,4.5vw,3.25rem)]">
                {copy.earnings.title}
              </h2>
              <p className="mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-soft">
                {copy.earnings.body}
              </p>
            </div>
            <EarningsCalculator />
          </div>
        </Container>
      </Section>

      {/* Two ways to teach */}
      <Section className="bg-paper">
        <Container>
          <SectionHeading eyebrow={copy.ways.eyebrow} title={copy.ways.title} />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {copy.ways.items.map((item) => (
              <li
                key={item.title}
                className="flex flex-col rounded-[var(--radius-card)] bg-cream p-8"
              >
                <h3 className="display text-3xl">{item.title}</h3>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">
                  {item.body}
                </p>
                <ul className="mt-6 flex flex-col gap-2 border-t border-ink/12 pt-5">
                  {item.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-[0.9375rem] font-medium">
                      <span aria-hidden="true" className="text-forest">
                        ✓
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Steps */}
      <Section>
        <Container>
          <SectionHeading eyebrow={copy.steps.eyebrow} title={copy.steps.title} />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {copy.steps.items.map((step) => (
              <li
                key={step.n}
                className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6"
              >
                <span
                  aria-hidden="true"
                  className="tabular display block text-4xl text-ink/20"
                >
                  {step.n}
                </span>
                <h3 className="mt-4 text-lg font-bold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-paper">
        <Container>
          <Faq title={copy.faq.title} items={copy.faq.items} />
        </Container>
      </Section>

      {/* Closing */}
      <Section className="bg-forest text-paper">
        <Container className="text-center">
          <h2 className="display text-[clamp(2.5rem,7vw,5rem)]">
            {copy.finalCta.displayLines.map((line, i) => (
              <span key={line} className={i === 1 ? "block text-lemon" : "block"}>
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 text-lg text-paper/70">{copy.finalCta.body}</p>
          <ButtonLink href={copy.finalCta.cta.href} size="lg" variant="lemon" className="mt-9">
            {copy.finalCta.cta.label}
          </ButtonLink>
        </Container>
      </Section>
    </>
  );
}
