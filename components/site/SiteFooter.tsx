import Link from "next/link";
import { brand, footer } from "@/content";
import { Container } from "@/components/ui/Primitives";
import { PaddleMark } from "@/components/site/Logo";
import { WaitlistReopenLink } from "@/components/waitlist/WaitlistReopenLink";

/**
 * Warm clay rather than the near-black olive it used to be: the whole site is
 * paper, cream and lemon, and ending on something that dark read as a
 * different product. Clay is a shade further than the body background, which
 * is enough to mark the footer as its own zone without a hard cut.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-clay text-ink">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-forest text-white">
                <PaddleMark className="size-6" halo="var(--color-forest)" />
              </span>
              <span className="display text-2xl">{brand.wordmark}</span>
            </div>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
              {footer.blurb}
            </p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-5 inline-block text-[0.9375rem] font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 hover:decoration-forest"
            >
              {brand.email}
            </a>
            <WaitlistReopenLink className="mt-3 block text-[0.9375rem] font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 hover:decoration-forest" />
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footer.columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-[0.6875rem] font-bold tracking-[0.18em] text-ink-soft uppercase">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[0.9375rem] text-ink-soft transition-colors hover:text-forest"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-ink/12 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-soft">{footer.legal}</p>
          <ul aria-label={footer.socialLabel} className="flex gap-5">
            {footer.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm font-medium text-ink-soft transition-colors hover:text-forest"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
