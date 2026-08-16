import type { Metadata } from "next";
import { circles as copy } from "@/content";
import { getCircles } from "@/lib/data";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, Section, SectionHeading } from "@/components/ui/Primitives";
import { CircleCard } from "@/components/cards/CircleCard";
import { Faq } from "@/components/ui/Faq";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export default async function CirclesPage() {
  const list = await getCircles();

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden bg-lilac">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_80%_0%,rgba(255,253,247,0.6),transparent_65%)]"
        />
        <Container className="relative py-16 sm:py-24">
          <div className="max-w-2xl">
            <Eyebrow className="text-olive/60">{copy.hero.eyebrow}</Eyebrow>
            <h1 className="display mt-4 text-[clamp(3rem,8vw,5.75rem)] text-forest">
              {copy.hero.displayLines.map((line, i) => (
                <span key={line} className={i === 1 ? "block italic" : "block"}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-olive/80">{copy.hero.body}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={copy.hero.cta.href} size="lg">
                {copy.hero.cta.label}
              </ButtonLink>
              <ButtonLink href={copy.hero.secondary.href} size="lg" variant="outline">
                {copy.hero.secondary.label}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </div>

      {/* Pricing table */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow={copy.pricing.eyebrow}
            title={copy.pricing.title}
            body={copy.pricing.body}
          />

          <div className="mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-ink/8 bg-paper">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">{copy.pricing.tableCaption}</caption>
              <thead>
                <tr className="border-b border-ink/12">
                  <th scope="col" className="px-6 py-4 text-[0.8125rem] font-bold tracking-wide text-ink-faint uppercase">
                    {copy.pricing.columns.size}
                  </th>
                  <th scope="col" className="px-6 py-4 text-[0.8125rem] font-bold tracking-wide text-ink-faint uppercase">
                    {copy.pricing.columns.total}
                  </th>
                  <th scope="col" className="px-6 py-4 text-[0.8125rem] font-bold tracking-wide text-ink-faint uppercase">
                    {copy.pricing.columns.each}
                  </th>
                  <th scope="col" className="px-6 py-4 text-[0.8125rem] font-bold tracking-wide text-ink-faint uppercase">
                    {copy.pricing.columns.save}
                  </th>
                </tr>
              </thead>
              <tbody>
                {copy.pricing.rows.map((row) => (
                  <tr key={row.size} className="border-b border-ink/8 last:border-0">
                    <th scope="row" className="px-6 py-4 font-semibold">
                      {row.size}
                    </th>
                    <td className="tabular px-6 py-4 text-ink-soft">{row.total}</td>
                    <td className="tabular px-6 py-4 text-lg font-bold">{row.each}</td>
                    <td className="px-6 py-4">
                      {row.save === "—" ? (
                        <span className="text-ink-faint">{row.save}</span>
                      ) : (
                        <span className="rounded-full bg-sage-wash px-3 py-1 text-sm font-bold text-forest">
                          {row.save}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-faint">
            {copy.pricing.footnote}
          </p>
        </Container>
      </Section>

      {/* Three ways */}
      <Section className="bg-paper">
        <Container>
          <SectionHeading title={copy.steps.title} />
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {copy.steps.items.map((step, i) => (
              <li
                key={step.title}
                className="rounded-[var(--radius-card)] bg-cream p-7"
              >
                <span aria-hidden="true" className="tabular display block text-4xl text-ink/25">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Open circles */}
      <Section id={copy.openCircles.id} className="scroll-mt-24">
        <Container>
          <SectionHeading
            eyebrow={copy.openCircles.eyebrow}
            title={copy.openCircles.title}
            body={copy.openCircles.body}
          />

          {list.length > 0 ? (
            <ul
              aria-label={copy.openCircles.listLabel}
              className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {list.map((circle) => (
                <li key={circle.id}>
                  <CircleCard circle={circle} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 rounded-[var(--radius-card)] border border-dashed border-ink/20 p-12 text-center">
              <h3 className="display text-3xl">{copy.openCircles.emptyTitle}</h3>
              <p className="mt-3 text-ink-soft">{copy.openCircles.emptyBody}</p>
            </div>
          )}
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="bg-paper">
        <Container>
          <Faq title={copy.faq.title} items={copy.faq.items} />
        </Container>
      </Section>
    </>
  );
}
