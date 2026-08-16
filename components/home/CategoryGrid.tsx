import Link from "next/link";
import type { Category } from "@/lib/types";
import { home } from "@/content";
import { Container, Section, SectionHeading } from "@/components/ui/Primitives";
import { Motif } from "@/components/ui/Motif";
import { cn, motifFor, toneSurface } from "@/lib/utils";

const copy = home.categories;

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          body={copy.body}
          action={{ label: copy.viewAll, href: "/discover" }}
        />

        {/* Deliberately uneven grid — the two featured tiles span two columns,
            which is what stops this reading as a generic card wall. */}
        <ul className="mt-12 grid auto-rows-[minmax(11rem,auto)] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => (
            <li
              key={category.id}
              className={cn(
                category.featured && "col-span-2 row-span-1 lg:row-span-2",
              )}
            >
              <Link
                href={`/discover?q=${encodeURIComponent(category.name)}`}
                className={cn(
                  "group relative flex h-full flex-col justify-end overflow-hidden rounded-[var(--radius-card)] p-5 transition-transform duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 sm:p-6",
                  toneSurface[category.tone],
                )}
              >
                <Motif
                  variant={motifFor(category.slug)}
                  className="[mask-image:linear-gradient(to_bottom,black_0%,black_20%,transparent_60%)] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-110"
                />

                <span className="relative block">
                  <span
                    className={cn(
                      "display block leading-tight",
                      category.featured ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl",
                    )}
                  >
                    {category.name}
                  </span>
                  {category.featured ? (
                    <span className="mt-2 block max-w-sm text-[0.9375rem] leading-snug opacity-90">
                      {category.blurb}
                    </span>
                  ) : null}
                  <span className="mt-2 block text-[0.8125rem] font-semibold opacity-70">
                    {category.teacherCount} teachers
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
