/**
 * FAQ built on <details>/<summary>.
 *
 * Native disclosure gets keyboard support, screen-reader support and
 * find-in-page for free. Don't replace it with a div and an onClick.
 */
export function Faq({
  title,
  items,
  className,
}: {
  title: string;
  items: ReadonlyArray<{ q: string; a: string }>;
  className?: string;
}) {
  return (
    <section aria-labelledby="faq-heading" className={className}>
      <h2 id="faq-heading" className="display text-[clamp(2rem,4.5vw,3.25rem)]">
        {title}
      </h2>
      <div className="mt-8 border-t border-ink/12">
        {items.map((item) => (
          <details key={item.q} className="group border-b border-ink/12">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-semibold marker:content-none [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full bg-ink/6 text-lg transition-transform duration-300 ease-[var(--ease-out-soft)] group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="max-w-2xl pb-6 text-[1.0625rem] leading-relaxed text-ink-soft">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
