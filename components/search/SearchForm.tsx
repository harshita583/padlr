"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { home } from "@/content";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const copy = home.hero.search;

/**
 * The skill + location search.
 *
 * Used on the home hero (`size="hero"`) and at the top of the results page
 * (`size="inline"`). It's a real <form> with a real submit button, so it works
 * with Enter, with a screen reader, and without JavaScript for the navigation.
 */
export function SearchForm({
  defaultQuery = "",
  defaultWhere = "",
  size = "hero",
  className,
  submitLabel,
}: {
  defaultQuery?: string;
  defaultWhere?: string;
  size?: "hero" | "inline";
  className?: string;
  submitLabel?: string;
}) {
  const router = useRouter();
  const id = useId();
  const [query, setQuery] = useState(defaultQuery);
  const [where, setWhere] = useState(defaultWhere);
  const [locating, setLocating] = useState(false);

  const skillId = `${id}-skill`;
  const whereId = `${id}-where`;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (where.trim()) params.set("where", where.trim());
    router.push(`/discover${params.size ? `?${params}` : ""}`);
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // A real build reverse-geocodes here. We show the coordinates rounded
        // so the interaction is honest about what it captured.
        const { latitude, longitude } = position.coords;
        setWhere(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 },
    );
  }

  const isHero = size === "hero";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-[var(--radius-slab)] bg-paper p-2.5",
        isHero ? "shadow-[var(--shadow-lift)]" : "border border-ink/8",
        className,
      )}
    >
      <fieldset className="contents">
        <legend className="sr-only">{copy.legend}</legend>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <div className="flex-1 px-4 py-2.5 md:py-1.5">
            <label htmlFor={skillId} className="block text-[0.75rem] font-bold text-ink">
              {copy.skill.label}
            </label>
            <input
              id={skillId}
              name="q"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={copy.skill.placeholder}
              autoComplete="off"
              className="mt-0.5 w-full bg-transparent text-[1.0625rem] text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>

          <span aria-hidden="true" className="hidden h-10 w-px bg-ink/10 md:block" />

          <div className="flex-1 px-4 py-2.5 md:py-1.5">
            <label htmlFor={whereId} className="block text-[0.75rem] font-bold text-ink">
              {copy.location.label}
            </label>
            <input
              id={whereId}
              name="where"
              type="text"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder={copy.location.placeholder}
              autoComplete="postal-code"
              className="mt-0.5 w-full bg-transparent text-[1.0625rem] text-ink placeholder:text-ink-faint focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            size={isHero ? "lg" : "md"}
            className={cn("shrink-0", isHero && "md:px-9")}
          >
            {submitLabel ?? copy.submit}
          </Button>
        </div>
      </fieldset>

      <div className="px-4 pt-1 pb-1.5">
        <button
          type="button"
          onClick={useCurrentLocation}
          disabled={locating}
          className="text-[0.75rem] font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-2 hover:decoration-forest disabled:opacity-60"
        >
          {locating ? copy.location.useCurrentBusy : copy.location.useCurrent}
        </button>
      </div>
    </form>
  );
}
