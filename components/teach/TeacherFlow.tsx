"use client";

import { useEffect, useId, useRef, useState } from "react";
import { teach as copy } from "@/content";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Avatar, Badge } from "@/components/ui/Primitives";
import { formatPrice } from "@/lib/date";
import { teacherTakeHome } from "@/lib/pricing";
import {
  clearTeacher,
  readTeacher,
  saveTeacher,
  teacherInitials,
  teacherName,
  type TeachingFormat,
  type TeacherProfile,
} from "@/lib/teacherStore";
import { cn } from "@/lib/utils";

const apply = copy.apply;
const STEPS = apply.steps;
const BIO_MAX = 400;

export interface ApplyCategoryOption {
  slug: string;
  name: string;
}

interface Draft {
  firstName: string;
  lastInitial: string;
  email: string;
  neighbourhood: string;
  categorySlug: string;
  skills: string;
  headline: string;
  bio: string;
  hourlyRate: number;
  groupUplift: number;
  formats: TeachingFormat[];
  days: string[];
  idVerified: boolean;
  guidelines: boolean;
}

const EMPTY: Draft = {
  firstName: "",
  lastInitial: "",
  email: "",
  neighbourhood: "",
  categorySlug: "",
  skills: "",
  headline: "",
  bio: "",
  hourlyRate: 55,
  groupUplift: 15,
  formats: ["one-to-one"],
  days: [],
  idVerified: false,
  guidelines: false,
};

/** One per line, blanks dropped — how the skills field is authored and stored. */
function parseSkills(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Teacher sign-up.
 *
 * Four steps, validated per step so nobody fills in three screens and is then
 * told about a mistake on the first. It writes a real teacher record — swap
 * `saveTeacher` for your accounts endpoint and nothing else here changes.
 */
export function TeacherFlow({ categories }: { categories: ApplyCategoryOption[] }) {
  const id = useId();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});
  const [checking, setChecking] = useState(false);
  const [saved, setSaved] = useState<TeacherProfile | null>(null);
  const [existing, setExisting] = useState<TeacherProfile | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    setExisting(readTeacher());
  }, []);

  // Move focus to the new step's heading, so a screen reader announces where it
  // has landed and a keyboard user isn't dumped back at the top of the page.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step, saved]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggle<K extends "formats" | "days">(key: K, value: string) {
    setDraft((d) => {
      const list = d[key] as string[];
      const next = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      return { ...d, [key]: next } as Draft;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate(index: number): boolean {
    const next: Partial<Record<keyof Draft, string>> = {};

    if (index === 0) {
      if (!draft.firstName.trim()) next.firstName = apply.errors.required;
      if (!draft.lastInitial.trim()) next.lastInitial = apply.errors.required;
      if (!draft.email.trim()) next.email = apply.errors.required;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email))
        next.email = apply.errors.email;
      if (!draft.neighbourhood.trim()) next.neighbourhood = apply.errors.required;
    }

    if (index === 1) {
      if (!draft.categorySlug) next.categorySlug = apply.errors.required;
      if (parseSkills(draft.skills).length === 0) next.skills = apply.errors.skills;
      if (!draft.headline.trim()) next.headline = apply.errors.required;
      else if (draft.headline.trim().length < 12)
        next.headline = apply.errors.headlineShort;
      if (!draft.bio.trim()) next.bio = apply.errors.required;
      else if (draft.bio.trim().length < 40) next.bio = apply.errors.bioShort;
    }

    if (index === 2) {
      if (!draft.hourlyRate) next.hourlyRate = apply.errors.rate;
      if (draft.formats.length === 0) next.formats = apply.errors.formats;
    }

    if (index === 3 && !draft.guidelines) {
      next.guidelines = apply.safety.guidelines.required;
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validate(step)) return;
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    const profile: TeacherProfile = {
      firstName: draft.firstName.trim(),
      lastInitial: draft.lastInitial.trim(),
      email: draft.email.trim(),
      neighbourhood: draft.neighbourhood.trim(),
      categorySlug: draft.categorySlug,
      skills: parseSkills(draft.skills),
      headline: draft.headline.trim(),
      bio: draft.bio.trim(),
      hourlyRate: draft.hourlyRate,
      groupUplift: draft.groupUplift,
      formats: draft.formats,
      days: draft.days,
      idVerified: draft.idVerified,
      createdAt: new Date().toISOString(),
    };
    saveTeacher(profile);
    setSaved(profile);
  }

  async function runIdCheck() {
    setChecking(true);
    // Stands in for the identity provider's callback.
    await new Promise((r) => setTimeout(r, 1600));
    setChecking(false);
    set("idVerified", true);
  }

  const categoryName =
    categories.find((c) => c.slug === draft.categorySlug)?.name ?? "";

  const preview: TeacherProfile = {
    ...draft,
    firstName: draft.firstName.trim() || "Your name",
    skills: parseSkills(draft.skills),
    createdAt: "",
  };

  if (saved) {
    return (
      <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6 sm:p-10">
        <h2 tabIndex={-1} ref={headingRef} className="display text-4xl outline-none">
          {apply.done.title}
        </h2>
        <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-ink-soft">
          {apply.done.body}
        </p>

        <div className="mt-8">
          <TeacherPreview teacher={saved} categoryName={categoryName} />
        </div>

        <h3 className="mt-10 text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
          {apply.done.nextLabel}
        </h3>
        <ol className="mt-3 flex flex-col gap-2">
          {apply.done.next.map((line, i) => (
            <li key={line} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-soft">
              <span aria-hidden="true" className="tabular font-bold text-forest">
                {i + 1}.
              </span>
              {line}
            </li>
          ))}
        </ol>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={apply.done.primary.href} size="lg">
            {apply.done.primary.label}
          </ButtonLink>
          <ButtonLink href={apply.done.secondary.href} size="lg" variant="outline">
            {apply.done.secondary.label}
          </ButtonLink>
        </div>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6 sm:p-10">
      {/* Somebody who already signed up on this browser, so they know what
          finishing this form will do. */}
      {existing && step === 0 ? (
        <div className="mb-8 rounded-[var(--radius-tile)] bg-lemon-soft p-5">
          <p className="font-bold">{apply.existing.title(teacherName(existing))}</p>
          <p className="mt-1 text-[0.9375rem] text-ink-soft">{apply.existing.body}</p>
          <button
            type="button"
            onClick={() => {
              clearTeacher();
              setExisting(null);
            }}
            className="mt-3 text-[0.8125rem] font-semibold underline decoration-ink/25 decoration-2 underline-offset-4 hover:decoration-ink"
          >
            {apply.existing.action}
          </button>
        </div>
      ) : null}

      {/* Progress */}
      <div>
        <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
          {apply.progress.stepOf(step + 1, STEPS.length)}
        </p>
        <ol aria-label={apply.progress.label} className="mt-3 flex gap-1.5">
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
            <WithError id={`${id}-first`} label={apply.fields.firstName.label} error={errors.firstName}>
              <Input
                id={`${id}-first`}
                value={draft.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder={apply.fields.firstName.placeholder}
                autoComplete="given-name"
              />
            </WithError>

            <WithError
              id={`${id}-last`}
              label={apply.fields.lastInitial.label}
              hint={apply.fields.lastInitial.hint}
              error={errors.lastInitial}
            >
              <Input
                id={`${id}-last`}
                value={draft.lastInitial}
                onChange={(e) => set("lastInitial", e.target.value.slice(0, 1))}
                placeholder={apply.fields.lastInitial.placeholder}
                maxLength={1}
              />
            </WithError>

            <WithError
              id={`${id}-email`}
              label={apply.fields.email.label}
              error={errors.email}
              className="sm:col-span-2"
            >
              <Input
                id={`${id}-email`}
                type="email"
                value={draft.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder={apply.fields.email.placeholder}
                autoComplete="email"
              />
            </WithError>

            <WithError
              id={`${id}-hood`}
              label={apply.fields.neighbourhood.label}
              hint={apply.fields.neighbourhood.hint}
              error={errors.neighbourhood}
              className="sm:col-span-2"
            >
              <Input
                id={`${id}-hood`}
                value={draft.neighbourhood}
                onChange={(e) => set("neighbourhood", e.target.value)}
                placeholder={apply.fields.neighbourhood.placeholder}
                autoComplete="address-level2"
              />
            </WithError>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-5">
            <WithError
              id={`${id}-cat`}
              label={apply.fields.category.label}
              error={errors.categorySlug}
            >
              <Select
                id={`${id}-cat`}
                value={draft.categorySlug}
                onChange={(e) => set("categorySlug", e.target.value)}
              >
                <option value="">{apply.fields.category.placeholder}</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </WithError>

            <WithError
              id={`${id}-skills`}
              label={apply.fields.skills.label}
              hint={apply.fields.skills.hint}
              error={errors.skills}
            >
              <Textarea
                id={`${id}-skills`}
                value={draft.skills}
                onChange={(e) => set("skills", e.target.value)}
                placeholder={apply.fields.skills.placeholder}
                rows={4}
              />
            </WithError>

            <WithError
              id={`${id}-headline`}
              label={apply.fields.headline.label}
              hint={apply.fields.headline.hint}
              error={errors.headline}
            >
              <Input
                id={`${id}-headline`}
                value={draft.headline}
                onChange={(e) => set("headline", e.target.value)}
                placeholder={apply.fields.headline.placeholder}
              />
            </WithError>

            <WithError id={`${id}-bio`} label={apply.fields.bio.label} error={errors.bio}>
              <Textarea
                id={`${id}-bio`}
                value={draft.bio}
                onChange={(e) => set("bio", e.target.value.slice(0, BIO_MAX))}
                placeholder={apply.fields.bio.placeholder}
                rows={5}
                className="min-h-32"
              />
              <p aria-live="polite" className="mt-1 text-right text-xs text-ink-faint">
                {apply.fields.bio.counter(draft.bio.length, BIO_MAX)}
              </p>
            </WithError>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-7">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={`${id}-rate`} className="text-[0.8125rem] font-semibold">
                  {apply.fields.rate.label}
                </label>
                <output htmlFor={`${id}-rate`} className="tabular text-2xl font-bold">
                  {formatPrice(draft.hourlyRate)}
                </output>
              </div>
              <input
                id={`${id}-rate`}
                type="range"
                min={20}
                max={150}
                step={5}
                value={draft.hourlyRate}
                onChange={(e) => set("hourlyRate", Number(e.target.value))}
                className="mt-2 h-10 w-full cursor-pointer accent-forest"
              />
              <p className="text-xs text-ink-faint">{apply.fields.rate.hint}</p>
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={`${id}-uplift`} className="text-[0.8125rem] font-semibold">
                  {apply.fields.uplift.label}
                </label>
                <output htmlFor={`${id}-uplift`} className="tabular text-2xl font-bold">
                  {formatPrice(draft.groupUplift)}
                </output>
              </div>
              <input
                id={`${id}-uplift`}
                type="range"
                min={0}
                max={40}
                step={1}
                value={draft.groupUplift}
                onChange={(e) => set("groupUplift", Number(e.target.value))}
                className="mt-2 h-10 w-full cursor-pointer accent-forest"
              />
              <p className="text-xs text-ink-faint">{apply.fields.uplift.hint}</p>
            </div>

            {/* What the numbers above actually mean for them, live. */}
            <div aria-live="polite" className="rounded-[var(--radius-tile)] bg-cream p-5">
              <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
                {apply.earnings.label}
              </p>
              <p className="mt-2 text-lg font-bold">
                {apply.earnings.perHour(
                  formatPrice(teacherTakeHome(draft.hourlyRate)),
                  formatPrice(draft.hourlyRate),
                )}
              </p>
              <p className="mt-1 text-[0.9375rem] text-ink-soft">
                {apply.earnings.groupExample(
                  formatPrice(
                    Math.round((draft.hourlyRate + draft.groupUplift * 2) / 3),
                  ),
                  formatPrice(
                    teacherTakeHome(draft.hourlyRate + draft.groupUplift * 2),
                  ),
                  3,
                )}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-ink-faint">
                {apply.earnings.note}
              </p>
            </div>

            <fieldset>
              <legend className="text-[0.8125rem] font-semibold">
                {apply.fields.formats.legend}
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {apply.fields.formats.options.map((option) => (
                  <CheckPill
                    key={option.value}
                    id={`${id}-fmt-${option.value}`}
                    label={option.label}
                    checked={draft.formats.includes(option.value as TeachingFormat)}
                    onChange={() => toggle("formats", option.value)}
                  />
                ))}
              </div>
              {errors.formats ? (
                <p role="alert" className="mt-2 text-sm font-medium text-coral">
                  {errors.formats}
                </p>
              ) : null}
            </fieldset>

            <fieldset>
              <legend className="text-[0.8125rem] font-semibold">
                {apply.fields.days.legend}
              </legend>
              <p className="mt-1 text-xs text-ink-faint">{apply.fields.days.hint}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {apply.fields.days.options.map((day) => (
                  <CheckPill
                    key={day}
                    id={`${id}-day-${day}`}
                    label={day}
                    checked={draft.days.includes(day)}
                    onChange={() => toggle("days", day)}
                  />
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="grid gap-6">
            <div className="rounded-[var(--radius-tile)] bg-cream p-5">
              <h3 className="font-bold">{apply.safety.title}</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {apply.safety.points.map((point) => (
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

            <div className="rounded-[var(--radius-tile)] border-2 border-ink/12 p-5">
              <h3 className="font-bold">{apply.safety.idCheck.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-soft">
                {apply.safety.idCheck.body}
              </p>
              <div className="mt-4" aria-live="polite">
                {draft.idVerified ? (
                  <p className="inline-flex items-center gap-2 rounded-full bg-sage-wash px-4 py-2 text-sm font-bold text-forest">
                    <span aria-hidden="true">✓</span>
                    {apply.safety.idCheck.done}
                  </p>
                ) : (
                  <Button type="button" onClick={runIdCheck} disabled={checking}>
                    {checking ? apply.safety.idCheck.pending : apply.safety.idCheck.action}
                  </Button>
                )}
              </div>
              {!draft.idVerified ? (
                <p className="mt-3 text-xs leading-relaxed text-ink-faint">
                  {apply.safety.idCheck.skipNote}
                </p>
              ) : null}
            </div>

            <div>
              <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
                {apply.review.previewLabel}
              </p>
              <div className="mt-3">
                <TeacherPreview teacher={preview} categoryName={categoryName} />
              </div>
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
                  {apply.safety.guidelines.label}{" "}
                  <a
                    href={apply.safety.guidelines.href}
                    className="font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 hover:decoration-forest"
                  >
                    {apply.safety.guidelines.linkLabel}
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

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink/10 pt-6">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={cn(step === 0 && "invisible")}
          >
            {apply.nav.back}
          </Button>
          <Button type="submit" size="lg">
            {step === STEPS.length - 1 ? apply.nav.finish : apply.nav.next}
          </Button>
        </div>
      </form>
    </div>
  );
}

/** The teacher exactly as a learner sees them in search results. */
function TeacherPreview({
  teacher,
  categoryName,
}: {
  teacher: TeacherProfile;
  categoryName: string;
}) {
  const name = teacherName(teacher);
  return (
    <div className="rounded-[var(--radius-card)] border border-ink/8 bg-cream p-6">
      <div className="flex flex-wrap items-start gap-4">
        <Avatar initials={teacherInitials(teacher)} name={name} tone="sage" size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">{name}</p>
          <p className="text-[0.9375rem] text-ink-soft">
            {teacher.neighbourhood || "—"}
            {categoryName ? ` · ${categoryName}` : ""}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            <li>
              <Badge
                className={
                  teacher.idVerified ? "bg-sage-wash text-forest" : "bg-ink/8 text-ink-soft"
                }
              >
                {teacher.idVerified
                  ? apply.review.badgeVerified
                  : apply.review.badgeUnverified}
              </Badge>
            </li>
            <li>
              <Badge className="bg-ink/8 text-ink-soft">{apply.review.newTeacher}</Badge>
            </li>
          </ul>
        </div>
        <p className="text-right">
          <span className="tabular text-2xl font-bold tracking-tight">
            {apply.review.rateFor(formatPrice(teacher.hourlyRate))}
          </span>
          <span className="block text-xs text-ink-faint">
            {formatPrice(teacherTakeHome(teacher.hourlyRate))} to you
          </span>
        </p>
      </div>

      {teacher.headline ? (
        <p className="mt-5 border-t border-ink/10 pt-5 text-[1.0625rem] font-medium">
          {teacher.headline}
        </p>
      ) : null}
      {teacher.bio ? (
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{teacher.bio}</p>
      ) : null}

      {teacher.skills.length > 0 ? (
        <div className="mt-5">
          <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
            {apply.review.teachesLabel}
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {teacher.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full bg-ink/6 px-3 py-1 text-sm font-medium"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {teacher.days.length > 0 ? (
        <p className="mt-4 text-sm text-ink-soft">
          <span className="font-semibold">Usually free: </span>
          {teacher.days.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

/** A checkbox that looks like the pills used everywhere else. */
function CheckPill({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="peer absolute inset-0 size-full cursor-pointer opacity-0"
      />
      <label
        htmlFor={id}
        className={cn(
          "block cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
          "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-forest",
          checked ? "border-forest bg-forest text-paper" : "border-ink/12 hover:border-ink/30",
        )}
      >
        {label}
      </label>
    </div>
  );
}

/** A Field that renders its error and wires aria-describedby. */
function WithError({
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
