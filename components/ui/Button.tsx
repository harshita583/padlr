import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "lemon" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold " +
  "transition-[transform,background-color,color,box-shadow] duration-200 ease-[var(--ease-out-soft)] " +
  "active:translate-y-px disabled:pointer-events-none disabled:opacity-50 " +
  "whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-paper hover:bg-olive shadow-[var(--shadow-lift)]",
  secondary: "bg-olive text-cream hover:bg-olive-soft",
  lemon: "bg-lemon text-ink hover:bg-lemon-soft shadow-[var(--shadow-lift)]",
  outline: "border-2 border-ink/15 bg-transparent text-ink hover:border-ink/40 hover:bg-ink/5",
  ghost: "bg-transparent text-ink hover:bg-ink/8",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-14 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<typeof Link>) {
  return (
    <Link className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </Link>
  );
}
