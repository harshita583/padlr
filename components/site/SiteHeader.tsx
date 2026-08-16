"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand, nav } from "@/content";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Primitives";
import { PaddleMark } from "@/components/site/Logo";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  // Lock scroll behind the open menu.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-cream/85 backdrop-blur-md">
      <Container>
        <div className="flex h-18 items-center justify-between gap-6 py-3">
          <Link
            href="/"
            className="group flex items-center gap-2.5"
            aria-label={`${brand.name} — home`}
          >
            <span className="grid size-9 place-items-center rounded-xl bg-forest text-white transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:-rotate-6">
              <PaddleMark />
            </span>
            <span className="display text-2xl tracking-tight">{brand.wordmark}</span>
          </Link>

          <nav aria-label={nav.landmarkLabel} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.primary.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-full px-4 py-2 text-[0.9375rem] font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-ink/8 font-semibold text-ink"
                        : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={nav.messages.href}
              className="hidden rounded-full px-4 py-2 text-[0.9375rem] font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink sm:block"
            >
              {nav.messages.label}
            </Link>
            <ButtonLink href={nav.cta.href} size="sm" className="hidden sm:inline-flex">
              {nav.cta.label}
            </ButtonLink>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-full border-2 border-ink/12 lg:hidden"
            >
              <span className="sr-only">
                {open ? nav.menuCloseLabel : nav.menuOpenLabel}
              </span>
              <span aria-hidden="true" className="flex flex-col gap-[5px]">
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-ink transition-transform duration-200",
                    open && "translate-y-[7px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-ink transition-opacity duration-200",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "block h-0.5 w-5 bg-ink transition-transform duration-200",
                    open && "-translate-y-[7px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div id="mobile-menu" className="border-t border-ink/8 bg-cream lg:hidden">
          <Container>
            <nav aria-label={nav.landmarkLabel} className="py-4">
              <ul className="flex flex-col gap-1">
                {[...nav.primary, nav.messages].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-lg font-medium",
                        isActive(item.href) ? "bg-ink/8 font-semibold" : "text-ink-soft",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ButtonLink href={nav.cta.href} size="lg" className="mt-4 w-full">
                {nav.cta.label}
              </ButtonLink>
            </nav>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
