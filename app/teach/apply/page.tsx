import type { Metadata } from "next";
import { teach as copy } from "@/content";
import { getCategories } from "@/lib/data";
import { Container, Eyebrow, Section } from "@/components/ui/Primitives";
import { TeacherFlow } from "@/components/teach/TeacherFlow";

export const metadata: Metadata = {
  title: copy.apply.meta.title,
  description: copy.apply.meta.description,
};

export default async function TeachApplyPage() {
  const categories = await getCategories();

  return (
    <Section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Eyebrow>{copy.apply.hero.eyebrow}</Eyebrow>
          <h1 className="display mt-3 text-[clamp(2.25rem,5.5vw,3.5rem)]">
            {copy.apply.hero.title}
          </h1>
          <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-soft">
            {copy.apply.hero.body}
          </p>

          <div className="mt-10">
            <TeacherFlow
              categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
