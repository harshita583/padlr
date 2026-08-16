import { home } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Primitives";
import { Motif } from "@/components/ui/Motif";

const copy = home.teachCta;

/**
 * The teacher-recruitment band.
 *
 * Deliberately the shortest section on the page: one statement, one line, one
 * link. The teach page does the selling — this only has to make somebody
 * realise the offer exists.
 */
export function TeachPoster() {
  return (
    <Section className="relative overflow-hidden bg-lemon py-20 sm:py-28">
      <Motif variant="stripes" className="text-ink" opacity={0.07} />
      <Container className="relative">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <h2 className="poster max-w-2xl text-[clamp(2.5rem,7vw,4.75rem)] text-ink">
            {copy.posterLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>

          <div className="lg:pb-2 lg:text-right">
            <p className="max-w-sm text-[1.0625rem] leading-relaxed text-ink/75 lg:ml-auto">
              {copy.body}
            </p>
            <ButtonLink href={copy.cta.href} size="lg" variant="secondary" className="mt-6">
              {copy.cta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
