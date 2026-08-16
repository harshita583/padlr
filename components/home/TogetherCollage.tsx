import { home } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Primitives";
import { cn, toneSurface } from "@/lib/utils";
import type { Tone } from "@/lib/types";

const copy = home.together;

/** Where each chip sits once there's room for a collage. */
const positions = [
  "lg:absolute lg:top-[6%] lg:left-[4%] lg:-rotate-3",
  "lg:absolute lg:top-[22%] lg:right-[6%] lg:rotate-2",
  "lg:absolute lg:bottom-[30%] lg:left-[0%] lg:rotate-1",
  "lg:absolute lg:bottom-[8%] lg:left-[24%] lg:-rotate-2",
  "lg:absolute lg:right-[12%] lg:bottom-[12%] lg:rotate-3",
];

export function TogetherCollage() {
  return (
    <Section className="bg-paper">
      <Container>
        <div className="relative flex min-h-[34rem] flex-col items-center justify-center py-8 lg:py-20">
          <ul className="order-2 mt-10 flex flex-wrap justify-center gap-2.5 lg:order-1 lg:mt-0 lg:contents">
            {copy.chips.map((chip, i) => (
              <li key={chip.label} className={cn(positions[i])}>
                <span
                  className={cn(
                    "inline-block rounded-full px-4 py-2.5 text-sm font-semibold shadow-[var(--shadow-lift)] lg:px-5 lg:py-3 lg:text-base",
                    toneSurface[chip.tone as Tone],
                  )}
                >
                  {chip.label}
                </span>
              </li>
            ))}
          </ul>

          <div className="order-1 max-w-lg text-center lg:order-2">
            <h2 className="display text-[clamp(3rem,8vw,5.5rem)] text-forest">
              {copy.displayLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mx-auto mt-6 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
              {copy.body}
            </p>
            <ButtonLink href={copy.cta.href} size="lg" className="mt-8">
              {copy.cta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
