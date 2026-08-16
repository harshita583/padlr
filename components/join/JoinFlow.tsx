"use client";

import { useEffect, useId, useRef, useState } from "react";
import { join as copy } from "@/content";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

const BIO_MAX = 280;
const STEPS = copy.steps;

interface Draft {
  firstName: string;
  lastInitial: string;
  email: string;
  neighbourhood: string;
  bio: string;
  learning: string;
  phone: string;
  idVerified: boolean;
  guidelines: boolean;
}

const EMPTY: Draft = {
  firstName: "",
  lastInitial: "",
  email: "",
  neighbourhood: "",
  bio: "",
  learning: "",
  phone: "",
  idVerified: false,
  guidelines: false,
};

/**
 * Sign-up.
 *
 * Four steps, validated per step so nobody fills in three screens and then
 * gets told about a mistake on the first. Everything lives in local state —
 * wire `onComplete` to your accounts endpoint when there is one.
 */
export function JoinFlow() {
  const id = useId();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [checking, setChecking] = useState(false);
  const [done, setDone] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the new step's heading so a screen reader announces where it
  // has landed, and a keyboard user doesn't get dumped back at the top.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step, done]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(index: number): boolean {
    const next: Partial<Record<keyof Draft, string>> = {};

    if (index === 0) {
      if (!draft.firstName.trim()) next.firstName = copy.errors.required;
      if (!draft.lastInitial.trim()) next.lastInitial = copy.errors.required;
      if (!draft.email.trim()) next.email = copy.errors.required;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) next.email = copy.errors.email;
      if (!draft.neighbourhood.trim()) next.neighbourhood = copy.errors.required;
    }

    if (index === 1) {
      if (!draft.bio.trim()) next.bio = copy.errors.required;
      else if (draft.bio.trim().length < 20) next.bio = copy.errors.bioShort;
    }

    if (index === 2 && !draft.guidelines) {
      next.guidelines = copy.safety.guidelines.required;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validate(step)) return;
    if (step === STEPS.length - 1) setDone(true);
    else setStep((s) => s + 1);
  }

  async function runIdCheck() {
    setChecking(true);
    // Stands in for the identity provider's callback.
    await new Promise((r) => setTimeout(r, 1600));
    setChecking(false);
    set("idVerified", true);
  }

  const initials =
    `${draft.firstName.trim()[0] ?? "?"}${draft.lastInitial.trim()[0] ?? ""}`.toUpperCase();
  const displayName = draft.firstName.trim()
    ? `${draft.firstName.trim()} ${draft.lastInitial.trim().toUpperCase()}.`
    : "Your name";

  if (done) {
    return (
      <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-8 text-center sm:p-12">
        <h2 tabIndex={-1} ref={headingRef} className="display text-4xl outline-none">
          {copy.done.title}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[1.0625rem] leading-relaxed text-ink-soft">
          {copy.done.body}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href={copy.done.primary.href} size="lg">
            {copy.done.primary.label}
          </ButtonLink>
          <ButtonLink href={copy.done.secondary.href} size="lg" variant="outline">
            {copy.done.secondary.label}
          </ButtonLink>
        </div>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6 sm:p-10">
      {/* Progress */}
      <div>
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
            {copy.progress.stepOf(step + 1, STEPS.length)}
          </p>
        </div>
        <ol
          aria-label={copy.progress.label}
          className="mt-3 flex gap-1.5"
        >
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex-1">
              <span
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "block h-1.5 rounded-full transition-colors",
                  i <= step ? "bg-forest" : "bg-ink/12",
                )}
              />
              <span className="sr-only">{s.title}</span>
            </li>
          ))}
        </ol>
      </div>

      <h2
        tabIndex={-1}
        ref={headingRef}
        className="display mt-8 text-[clamp(1.75rem,4vw,2.5rem)] outline-none"
      >
        {current.title}
      </h2>
      <p className="mt-2 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
        {current.body}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          goNext();
        }}
        className="mt-8"
      >
        {step === 0 ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <FieldWithError
              id={`${id}-first`}
              label={copy.fields.firstName.label}
              error={errors.firstName}
            >
              <Input
                id={`${id}-first`}
                value={draft.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder={copy.fields.firstName.placeholder}
                autoComplete="given-name"
              />
            </FieldWithError>

            <FieldWithError
              id={`${id}-last`}
              label={copy.fields.lastInitial.label}
              hint={copy.fields.lastInitial.hint}
              error={errors.lastInitial}
            >
              <Input
                id={`${id}-last`}
                value={draft.lastInitial}
                onChange={(e) => set("lastInitial", e.target.value.slice(0, 1))}
                placeholder={copy.fields.lastInitial.placeholder}
                maxLength={1}
              />
            </FieldWithError>

            <FieldWithError
              id={`${id}-email`}
              label={copy.fields.email.label}
              error={errors.email}
              className="sm:col-span-2"
            >
              <Input
                id={`${id}-email`}
                type="email"
                value={draft.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder={copy.fields.email.placeholder}
                autoComplete="email"
              />
            </FieldWithError>

            <FieldWithError
              id={`${id}-hood`}
              label={copy.fields.neighbourhood.label}
              hint={copy.fields.neighbourhood.hint}
              error={errors.neighbourhood}
              className="sm:col-span-2"
            >
              <Input
                id={`${id}-hood`}
                value={draft.neighbourhood}
                onChange={(e) => set("neighbourhood", e.target.value)}
                placeholder={copy.fields.neighbourhood.placeholder}
                autoComplete="address-level2"
              />
            </FieldWithError>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-5">
            <FieldWithError
              id={`${id}-bio`}
              label={copy.fields.bio.label}
              hint={copy.fields.bio.hint}
              error={errors.bio}
            >
              <Textarea
                id={`${id}-bio`}
                value={draft.bio}
                onChange={(e) => set("bio", e.target.value.slice(0, BIO_MAX))}
                placeholder={copy.fields.bio.placeholder}
                rows={5}
                className="min-h-32"
              />
              <p aria-live="polite" className="mt-1 text-right text-xs text-ink-faint">
                {copy.fields.bio.counter(draft.bio.length, BIO_MAX)}
              </p>
            </FieldWithError>

            <FieldWithError id={`${id}-learning`} label={copy.fields.learning.label}>
              <Input
                id={`${id}-learning`}
                value={draft.learning}
                onChange={(e) => set("learning", e.target.value)}
                placeholder={copy.fields.learning.placeholder}
              />
            </FieldWithError>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-6">
            <div className="rounded-[var(--radius-tile)] bg-cream p-5">
              <h3 className="font-bold">{copy.safety.title}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {copy.safety.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-2.5 text-[0.9375rem] leading-relaxed text-ink-soft"
                  >
                    <span aria-hidden="true" className="text-forest">
                      ✓
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <FieldWithError
              id={`${id}-phone`}
              label={copy.fields.phone.label}
              hint={copy.fields.phone.hint}
            >
              <Input
                id={`${id}-phone`}
                type="tel"
                value={draft.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder={copy.fields.phone.placeholder}
                autoComplete="tel"
              />
            </FieldWithError>

            <div className="rounded-[var(--radius-tile)] border-2 border-ink/12 p-5">
              <h3 className="font-bold">{copy.safety.idCheck.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                {copy.safety.idCheck.body}
              </p>
              <div className="mt-4" aria-live="polite">
                {draft.idVerified ? (
                  <p className="inline-flex items-center gap-2 rounded-full bg-sage-wash px-4 py-2 text-sm font-bold text-forest">
                    <span aria-hidden="true">✓</span>
                    {copy.safety.idCheck.done}
                  </p>
                ) : (
                  <Button type="button" onClick={runIdCheck} disabled={checking}>
                    {checking ? copy.safety.idCheck.pending : copy.safety.idCheck.action}
                  </Button>
                )}
              </div>
              {!draft.idVerified ? (
                <p className="mt-3 text-xs leading-relaxed text-ink-faint">
                  {copy.safety.idCheck.skipNote}
                </p>
              ) : null}
            </div>

            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={draft.guidelines}
                  onChange={(e) => set("guidelines", e.target.checked)}
                  aria-describedby={errors.guidelines ? `${id}-guidelines-error` : undefined}
                  className="mt-0.5 size-4 shrink-0 accent-forest"
                />
                <span className="text-[0.9375rem]">
                  {copy.safety.guidelines.label}{" "}
                  <a
                    href={copy.safety.guidelines.href}
                    className="font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 hover:decoration-forest"
                  >
                    {copy.safety.guidelines.linkLabel}
                  </a>
                </span>
              </label>
              {errors.guidelines ? (
                <p id={`${id}-guidelines-error`} className="mt-2 text-sm font-medium text-coral">
                  {errors.guidelines}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
              {copy.review.previewLabel}
            </p>
            <div className="mt-3 rounded-[var(--radius-card)] border border-ink/8 bg-cream p-6">
              <div className="flex items-center gap-4">
                <Avatar initials={initials} name={displayName} tone="sage" size="lg" />
                <div className="min-w-0">
                  <p className="text-lg font-bold">{displayName}</p>
                  <p className="text-[0.9375rem] text-ink-soft">
                    {draft.neighbourhood || "—"}
                  </p>
                  <p
                    className={cn(
                      "mt-1.5 inline-block rounded-full px-3 py-1 text-xs font-bold",
                      draft.idVerified
                        ? "bg-sage-wash text-forest"
                        : "bg-ink/8 text-ink-faint",
                    )}
                  >
                    {draft.idVerified
                      ? copy.review.badgeVerified
                      : copy.review.badgeUnverified}
                  </p>
                </div>
              </div>

              {draft.bio ? (
                <p className="mt-5 border-t border-ink/10 pt-5 text-[0.9375rem] leading-relaxed text-ink-soft">
                  {draft.bio}
                </p>
              ) : null}

              {draft.learning ? (
                <p className="mt-4 text-sm">
                  <span className="font-semibold">{copy.review.learningLabel}: </span>
                  <span className="text-ink-soft">{draft.learning}</span>
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink/10 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={cn(step === 0 && "invisible")}
          >
            {copy.nav.back}
          </Button>
          <Button type="submit" size="lg">
            {step === STEPS.length - 1 ? copy.nav.finish : copy.nav.next}
          </Button>
        </div>
      </form>
    </div>
  );
}

/** A Field that renders its error and wires aria-describedby / aria-invalid. */
function FieldWithError({
  id,
  label,
  hint,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Field label={label} htmlFor={id} hint={error ? undefined : hint}>
        {children}
      </Field>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-coral">
          {error}
        </p>
      ) : null}
    </div>
  );
}
