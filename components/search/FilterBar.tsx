"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { common, discover } from "@/content";
import { Field, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const copy = discover.filters;

/**
 * Filters write to the URL rather than to local state, so a filtered search is
 * shareable, bookmarkable and survives a refresh.
 */
export function FilterBar({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const id = useId();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const maxPrice = Number(params.get("maxPrice") ?? 100);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "any" || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() => router.push(`/discover?${next}`, { scroll: false }));
  }

  function clearAll() {
    const next = new URLSearchParams();
    const q = params.get("q");
    const where = params.get("where");
    if (q) next.set("q", q);
    if (where) next.set("where", where);
    startTransition(() => router.push(`/discover?${next}`, { scroll: false }));
  }

  const hasFilters = ["sort", "distance", "maxPrice", "format", "availability"].some((k) =>
    params.has(k),
  );

  return (
    <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper">
      <div className="flex items-center justify-between gap-4 p-4 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold"
        >
          {open ? copy.toggleClose : copy.toggleOpen}
        </button>
        <span aria-live="polite" className="text-sm text-ink-faint">
          {discover.header.countFor(resultCount)}
        </span>
      </div>

      <div
        id={`${id}-panel`}
        className={cn("p-4 pt-0 lg:block lg:pt-4", open ? "block" : "hidden")}
      >
        <fieldset className={cn(isPending && "opacity-70 transition-opacity")}>
          <legend className="sr-only">{copy.legend}</legend>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field label={copy.sort.label} htmlFor={`${id}-sort`}>
              <Select
                id={`${id}-sort`}
                value={params.get("sort") ?? "recommended"}
                onChange={(e) => update("sort", e.target.value)}
              >
                {copy.sort.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={copy.distance.label} htmlFor={`${id}-distance`}>
              <Select
                id={`${id}-distance`}
                value={params.get("distance") ?? "25"}
                onChange={(e) => update("distance", e.target.value)}
              >
                {copy.distance.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={copy.format.label} htmlFor={`${id}-format`}>
              <Select
                id={`${id}-format`}
                value={params.get("format") ?? "any"}
                onChange={(e) => update("format", e.target.value)}
              >
                <option value="any">Any format</option>
                {copy.format.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label={copy.availability.label} htmlFor={`${id}-availability`}>
              <Select
                id={`${id}-availability`}
                value={params.get("availability") ?? "any"}
                onChange={(e) => update("availability", e.target.value)}
              >
                {copy.availability.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label={
                <span className="flex items-baseline justify-between gap-2">
                  {copy.price.label}
                  <span className="tabular font-bold">{copy.price.formatFor(maxPrice)}</span>
                </span>
              }
              htmlFor={`${id}-price`}
              hint={copy.price.hint}
            >
              <input
                id={`${id}-price`}
                type="range"
                min={20}
                max={100}
                step={5}
                defaultValue={maxPrice}
                onChange={(e) => update("maxPrice", e.target.value)}
                className="h-12 w-full cursor-pointer accent-forest"
              />
            </Field>
          </div>

          {hasFilters ? (
            <div className="mt-4 flex justify-end">
              <Button type="button" variant="ghost" size="sm" onClick={clearAll}>
                {common.actions.clearFilters}
              </Button>
            </div>
          ) : null}
        </fieldset>
      </div>
    </div>
  );
}
