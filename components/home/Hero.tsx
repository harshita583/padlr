import Link from "next/link";
import { home } from "@/content";
import { Container, Eyebrow } from "@/components/ui/Primitives";
import { SearchForm } from "@/components/search/SearchForm";

const copy = home.hero;

/** Decorative objects scattered behind the stat card, à la the reference art. */
const floaters = [
  { emoji: "🧶", className: "top-0 left-0 text-5xl -rotate-12" },
  { emoji: "🍞", className: "top-8 right-0 text-4xl rotate-6" },
  { emoji: "📷", className: "bottom-8 left-2 text-4xl rotate-12" },
  { emoji: "🎸", className: "right-2 bottom-0 text-5xl -rotate-6" },
  { emoji: "🪚", className: "bottom-28 left-0 text-3xl rotate-3" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-sage">
      {/* Soft light wash, so the flat green reads as a surface rather than a swatch. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(255,253,247,0.55),transparent_60%)]"
      />

      <Container className="relative pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Eyebrow className="text-olive/70">
              <span aria-hidden="true">📍</span> {copy.eyebrow}
            </Eyebrow>

            <h1 className="display mt-4 text-[clamp(3rem,8.5vw,5.75rem)] text-olive">
              {copy.headlineLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <span className="mt-1 inline-block -rotate-1 rounded-2xl bg-lemon px-4 pt-1 pb-2 text-ink">
                {copy.headlineAccent}
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-olive/85 sm:text-lg">
              {copy.body}
            </p>

            <SearchForm className="mt-9 max-w-3xl" />

            <div className="mt-6">
              <h2 className="text-[0.6875rem] font-bold tracking-[0.18em] text-olive/60 uppercase">
                {copy.search.skill.suggestionsLabel}
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {copy.chips.map((chip) => (
                  <li key={chip.label}>
                    <Link
                      href={chip.href}
                      className="inline-flex items-center gap-2 rounded-full border border-olive/15 bg-paper/70 px-4 py-2 text-sm font-semibold text-olive transition-colors hover:border-olive/35 hover:bg-paper"
                    >
                      <span aria-hidden="true">{chip.emoji}</span>
                      {chip.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Stat card with floating objects. Decorative — hidden from AT. */}
          <div className="relative hidden min-h-[24rem] lg:block">
            <div aria-hidden="true">
              {floaters.map((f) => (
                <span key={f.emoji} className={`absolute drop-shadow-lg ${f.className}`}>
                  {f.emoji}
                </span>
              ))}
            </div>

            <div className="relative mx-auto max-w-xs rotate-2 rounded-[var(--radius-slab)] bg-olive p-8 text-cream shadow-[var(--shadow-lift)]">
              <span
                aria-hidden="true"
                className="grid size-14 place-items-center rounded-2xl bg-lemon text-3xl"
              >
                🙌
              </span>
              <p className="tabular mt-6 text-6xl leading-none font-bold tracking-tight text-lemon">
                {copy.stat.value}
              </p>
              <p className="mt-3 text-[0.9375rem] leading-snug text-cream/80">
                {copy.stat.label}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
