import { home } from "@/content";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";

const copy = home.howItWorks;

export function HowItWorks() {
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} />

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {copy.steps.map((step) => (
            <li
              key={step.n}
              className="relative flex flex-col rounded-[var(--radius-card)] border border-ink/8 bg-paper p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="grid size-14 place-items-center rounded-2xl bg-cream text-3xl"
                >
                  {step.emoji}
                </span>
                <span
                  aria-hidden="true"
                  className="tabular display text-4xl text-ink/15"
                >
                  {step.n}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold tracking-tight">{step.title}</h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
