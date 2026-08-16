"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useId, useTransition } from "react";
import type { Category } from "@/lib/types";
import { events as copy } from "@/content";
import { Field, Select } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const filters = copy.index.filters;

export function EventFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const id = useId();
  const [isPending, startTransition] = useTransition();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value || value === "any" || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() => router.push(`/events?${next}`, { scroll: false }));
  }

  return (
    <fieldset className={cn("min-w-0", isPending && "opacity-70 transition-opacity")}>
      <legend className="sr-only">{filters.legend}</legend>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label={filters.whenLabel} htmlFor={`${id}-when`}>
          <Select
            id={`${id}-when`}
            value={params.get("when") ?? "any"}
            onChange={(e) => update("when", e.target.value)}
          >
            {filters.whenOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label={filters.categoryLabel} htmlFor={`${id}-category`}>
          <Select
            id={`${id}-category`}
            value={params.get("category") ?? "all"}
            onChange={(e) => update("category", e.target.value)}
          >
            <option value="all">{filters.categoryAll}</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label={filters.priceLabel} htmlFor={`${id}-price`}>
          <Select
            id={`${id}-price`}
            value={params.get("price") ?? "any"}
            onChange={(e) => update("price", e.target.value)}
          >
            {filters.priceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </fieldset>
  );
}
