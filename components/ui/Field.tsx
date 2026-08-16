import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Form controls.
 *
 * Every control here is label-first: the visible label *is* the accessible
 * name. Placeholders are hints, never labels.
 */

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
  labelHidden = false,
}: {
  label: ReactNode;
  hint?: ReactNode;
  htmlFor: string;
  children: ReactNode;
  className?: string;
  labelHidden?: boolean;
}) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "text-[0.8125rem] font-semibold text-ink",
          labelHidden && "sr-only",
        )}
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="text-xs text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const controlBase =
  "w-full rounded-full border-2 border-ink/12 bg-paper px-5 text-[0.9375rem] text-ink " +
  "placeholder:text-ink-faint transition-colors hover:border-ink/25 " +
  "focus:border-forest focus:outline-none";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(controlBase, "h-12", className)} {...props} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cn(
          controlBase,
          "h-12 cursor-pointer appearance-none pr-11 font-medium",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-ink-soft"
      >
        ▼
      </span>
    </div>
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        controlBase,
        "min-h-24 resize-none rounded-[var(--radius-tile)] py-3 leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

/** A pill-shaped radio group rendered as real radio inputs. */
export function PillGroup({
  legend,
  name,
  options,
  value,
  onChange,
  hint,
  className,
}: {
  legend: string;
  name: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <fieldset className={cn("min-w-0", className)}>
      <legend className="mb-2 text-[0.8125rem] font-semibold text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const selected = value === option.value;
          return (
            <div key={option.value} className="relative">
              <input
                type="radio"
                id={id}
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="peer absolute inset-0 size-full cursor-pointer opacity-0"
              />
              <label
                htmlFor={id}
                className={cn(
                  "block cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                  "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-forest",
                  selected
                    ? "border-forest bg-forest text-paper"
                    : "border-ink/12 bg-paper text-ink hover:border-ink/30",
                )}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      {hint ? <p className="mt-2 text-xs text-ink-faint">{hint}</p> : null}
    </fieldset>
  );
}
