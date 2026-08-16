import Link from "next/link";
import { brand, footer } from "@/content";
import { Container } from "@/components/ui/Primitives";

export function SiteFooter() {
  return (
    <footer className="on-dark bg-olive text-cream">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid size-9 place-items-center rounded-xl bg-lemon font-display text-lg text-olive"
              >
                {brand.monogram}
              </span>
              <span className="display text-2xl">{brand.wordmark}</span>
            </div>
            <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-cream/70">
              {footer.blurb}
            </p>
            <a
              href={`mailto:${brand.email}`}
              className="mt-5 inline-block text-[0.9375rem] font-semibold text-lemon underline decoration-lemon/40 decoration-2 underline-offset-4 hover:decoration-lemon"
            >
              {brand.email}
            </a>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            {footer.columns.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h2 className="text-[0.6875rem] font-bold tracking-[0.18em] text-cream/50 uppercase">
                  {column.title}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[0.9375rem] text-cream/80 transition-colors hover:text-lemon"
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

        <div className="mt-14 flex flex-col gap-5 border-t border-cream/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cream/50">{footer.legal}</p>
          <ul aria-label={footer.socialLabel} className="flex gap-5">
            {footer.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm font-medium text-cream/70 transition-colors hover:text-lemon"
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
