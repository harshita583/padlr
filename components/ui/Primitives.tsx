import Link from "next/link";
import type { ReactNode } from "react";
import { cn, toneSurface } from "@/lib/utils";
import type { Tone } from "@/lib/types";

/* -------------------------------------------------------------------------- */
/* Layout                                                                     */
/* -------------------------------------------------------------------------- */

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[78rem] px-5 sm:px-8", className)}>{children}</div>
  );
}

export function Section({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & React.ComponentProps<"section">) {
  return (
    <section className={cn("py-16 sm:py-24", className)} {...props}>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Type                                                                       */
/* -------------------------------------------------------------------------- */

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink-faint",
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Section header. `as` controls the heading level so pages keep a sensible
 * outline — never pick a level for its size.
 */
export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
  as: Tag = "h2",
  className,
  align = "left",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  action?: { label: string; href: string };
  as?: "h1" | "h2" | "h3";
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
        {eyebrow ? <Eyebrow className="mb-3">{eyebrow}</Eyebrow> : null}
        <Tag className="display text-[clamp(2rem,4.5vw,3.25rem)]">{title}</Tag>
        {body ? (
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">{body}</p>
        ) : null}
      </div>
      {action ? (
        <Link
          href={action.href}
          className="shrink-0 self-start text-[0.9375rem] font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 transition-colors hover:decoration-forest sm:self-auto"
        >
          {action.label} <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                   */
/* -------------------------------------------------------------------------- */

export function Panel({
  children,
  className,
  tone,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-card)] border border-ink/8 bg-paper",
        tone && toneSurface[tone],
        tone && "border-transparent",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Small pieces                                                               */
/* -------------------------------------------------------------------------- */

export function Badge({
  children,
  className,
  tone,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tone ? toneSurface[tone] : "bg-ink/8 text-ink",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Avatar({
  initials,
  name,
  tone = "sage",
  size = "md",
  className,
}: {
  initials: string;
  name: string;
  tone?: Tone;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    xs: "size-6 text-[0.5625rem]",
    sm: "size-9 text-xs",
    md: "size-12 text-sm",
    lg: "size-16 text-lg",
    xl: "size-24 text-2xl sm:size-32 sm:text-4xl",
  };
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-bold tracking-tight select-none",
        toneSurface[tone],
        sizes[size],
        className,
      )}
    >
      <span aria-hidden="true">{initials}</span>
    </span>
  );
}

/** Star rating. The visual stars are decorative; the label carries the meaning. */
export function Rating({
  rating,
  count,
  label,
  className,
  compact = false,
}: {
  rating: number;
  count: number;
  label: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span aria-hidden="true" className="text-[0.9375rem] leading-none text-coral">
        ★
      </span>
      <span className="tabular text-sm font-semibold" aria-hidden="true">
        {rating.toFixed(1)}
      </span>
      {!compact ? (
        <span className="tabular text-sm text-ink-faint" aria-hidden="true">
          ({count})
        </span>
      ) : null}
      <span className="sr-only">{label}</span>
    </span>
  );
}

/** A single-purpose divider that reads as a rule in the editorial layouts. */
export function Rule({ className }: { className?: string }) {
  return <hr className={cn("border-0 border-t border-ink/12", className)} />;
}
