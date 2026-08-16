import type { Metadata } from "next";
import { join as copy } from "@/content";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { JoinFlow } from "@/components/join/JoinFlow";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export default function JoinPage() {
  return (
    <Section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Eyebrow>{copy.hero.eyebrow}</Eyebrow>
          <h1 className="display mt-3 text-[clamp(2.25rem,5.5vw,3.5rem)]">
            {copy.hero.title}
          </h1>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft">
            {copy.hero.body}
          </p>

          <div className="mt-10">
            <JoinFlow />
          </div>
        </div>
      </Container>
    </Section>
  );
}
