import { home } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Section } from "@/components/ui/Primitives";

const copy = home.teachCta;

/**
 * The teacher-recruitment poster. Modelled on the reference product card:
 * a dark field, a lemon slab, condensed uppercase type and a hard rule stack.
 */
export function TeachPoster() {
  return (
    <Section className="bg-olive">
      <Container>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Left: the "photo" panel, standing in as a type composition. */}
          <div className="relative flex min-h-[24rem] flex-col justify-between overflow-hidden rounded-[var(--radius-card)] bg-lemon p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -bottom-16 text-[16rem] leading-none opacity-20 select-none"
            >
              🧑‍🏫
            </div>
            <p className="relative text-[0.6875rem] font-bold tracking-[0.2em] text-ink/60 uppercase">
              {copy.stampTop}
            </p>
            <div className="relative">
              <h2 className="poster text-[clamp(2.5rem,6vw,4rem)] text-ink">
                {copy.posterLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h2>
              <p className="mt-5 max-w-sm text-[1.0625rem] leading-relaxed text-ink/75">
                {copy.body}
              </p>
            </div>
          </div>

          {/* Right: the spec panel. */}
          <div className="flex flex-col justify-between rounded-[var(--radius-card)] bg-cream p-8">
            <div>
              <ul className="divide-y divide-ink/12 border-y border-ink/12">
                {copy.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="poster py-4 text-[1.0625rem] tracking-normal text-ink sm:text-xl"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href={copy.cta.href} size="lg" variant="secondary">
                {copy.cta.label}
              </ButtonLink>
              <ButtonLink href={copy.secondary.href} size="lg" variant="ghost">
                {copy.secondary.label}
              </ButtonLink>
            </div>

            <p className="poster mt-10 text-3xl text-ink sm:text-4xl">
              {copy.stampBottom}
              <span aria-hidden="true" className="align-super text-xs">
                ™
              </span>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
