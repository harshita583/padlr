"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { circles as copy } from "@/content";
import type { BookableDay, Tone } from "@/lib/types";
import { quoteCircle } from "@/lib/pricing";
import { formatPrice } from "@/lib/date";
import { createCircle, type CircleMember } from "@/lib/circlesStore";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const create = copy.create;

/** The subset of a teacher this dialog needs. Serialised from the server. */
export interface CircleTeacherOption {
  id: string;
  name: string;
  slug: string;
  neighbourhood: string;
  hourlyRate: number;
  groupUplift: number;
  tone: Tone;
  categories: string[];
  days: BookableDay[];
}

export interface CircleCategoryOption {
  slug: string;
  name: string;
}

const DURATIONS = [
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
];

/**
 * Start a circle: a topic, a teacher, a time and a seat count.
 *
 * The teacher list is filtered by the chosen craft rather than free text —
 * a circle is only real if somebody has actually agreed to teach it, so the
 * flow never lets you invent a host.
 */
export function CreateCircleDialog({
  open,
  onClose,
  categories,
  teachers,
  host,
}: {
  open: boolean;
  onClose: () => void;
  categories: CircleCategoryOption[];
  teachers: CircleTeacherOption[];
  /** Whoever is signed in. Falls back to a placeholder when nobody is. */
  host: CircleMember;
}) {
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);

  const [categorySlug, setCategorySlug] = useState("");
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState<string>(create.steps.topic.levelOptions[0].value);
  const [teacherId, setTeacherId] = useState("");
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [seats, setSeats] = useState(4);
  const [duration, setDuration] = useState("60");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // A fresh form each time, so a second circle doesn't inherit the first.
  useEffect(() => {
    if (!open) return;
    setCategorySlug("");
    setSkill("");
    setLevel(create.steps.topic.levelOptions[0].value);
    setTeacherId("");
    setDayIndex(0);
    setSlot(null);
    setSeats(4);
    setDuration("60");
    setTitle("");
    setError(null);
  }, [open]);

  const eligible = useMemo(
    () => (categorySlug ? teachers.filter((t) => t.categories.includes(categorySlug)) : []),
    [categorySlug, teachers],
  );

  const teacher = eligible.find((t) => t.id === teacherId) ?? null;
  const days = teacher?.days ?? [];
  const selectedDay = days[dayIndex];

  const quote = quoteCircle({
    baseRate: teacher?.hourlyRate ?? 0,
    groupUplift: teacher?.groupUplift ?? 0,
    durationMinutes: Number(duration),
    members: 1,
    seatsTotal: seats,
  });

  const fullQuote = quoteCircle({
    baseRate: teacher?.hourlyRate ?? 0,
    groupUplift: teacher?.groupUplift ?? 0,
    durationMinutes: Number(duration),
    members: seats,
    seatsTotal: seats,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!categorySlug) return setError(create.errors.category);
    if (!skill.trim()) return setError(create.errors.skill);
    if (!teacher) return setError(create.errors.teacher);
    if (!slot || !selectedDay) return setError(create.errors.slot);
    if (!title.trim()) return setError(create.errors.title);

    createCircle({
      title: title.trim(),
      categorySlug,
      skill: skill.trim(),
      level,
      teacherId: teacher.id,
      teacherName: teacher.name,
      teacherSlug: teacher.slug,
      neighbourhood: teacher.neighbourhood,
      date: selectedDay.date,
      time: slot,
      durationMinutes: Number(duration),
      seatsTotal: seats,
      baseRate: teacher.hourlyRate,
      groupUplift: teacher.groupUplift,
      tone: teacher.tone,
      host,
    });
    onClose();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="flex max-h-[85dvh] flex-col overflow-hidden rounded-[var(--radius-card)] bg-paper text-left shadow-[var(--shadow-lift)]"
      >
        <div className="flex items-start justify-between gap-4 p-6 pb-0 sm:p-8 sm:pb-0">
          <div>
            <h2 id={`${id}-title`} className="display text-3xl">
              {create.title}
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
              {create.intro}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/8 text-sm transition-colors hover:bg-ink/15"
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">{create.closeLabel}</span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 sm:px-8">
          {/* Topic */}
          <fieldset>
            <legend className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
              {create.steps.topic.legend}
            </legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label={create.steps.topic.categoryLabel} htmlFor={`${id}-cat`}>
                <Select
                  id={`${id}-cat`}
                  value={categorySlug}
                  onChange={(e) => {
                    setCategorySlug(e.target.value);
                    setTeacherId("");
                    setSlot(null);
                    setDayIndex(0);
                  }}
                >
                  <option value="">{create.steps.topic.categoryPlaceholder}</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label={create.steps.topic.levelLabel} htmlFor={`${id}-level`}>
                <Select
                  id={`${id}-level`}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  {create.steps.topic.levelOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label={create.steps.topic.skillLabel}
                hint={create.steps.topic.skillHint}
                htmlFor={`${id}-skill`}
                className="sm:col-span-2"
              >
                <Input
                  id={`${id}-skill`}
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder={create.steps.topic.skillPlaceholder}
                />
              </Field>
            </div>
          </fieldset>

          {/* Teacher */}
          {categorySlug ? (
            <fieldset>
              <legend className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
                {create.steps.teacher.legend}
              </legend>
              <p className="mt-1 text-[0.8125rem] text-ink-faint">
                {create.steps.teacher.hint}
              </p>

              {eligible.length === 0 ? (
                <p className="mt-3 text-sm text-ink-soft">
                  {create.steps.teacher.emptyLabel}
                </p>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  {eligible.map((t) => (
                    <div key={t.id} className="relative">
                      <input
                        type="radio"
                        id={`${id}-t-${t.id}`}
                        name={`${id}-teacher`}
                        checked={teacherId === t.id}
                        onChange={() => {
                          setTeacherId(t.id);
                          setDayIndex(0);
                          setSlot(null);
                        }}
                        className="peer absolute inset-0 size-full cursor-pointer opacity-0"
                      />
                      <label
                        htmlFor={`${id}-t-${t.id}`}
                        className={cn(
                          "flex cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 transition-colors",
                          "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-forest",
                          teacherId === t.id
                            ? "border-forest bg-sage-wash"
                            : "border-ink/12 hover:border-ink/30",
                        )}
                      >
                        <span>
                          <span className="block font-bold">{t.name}</span>
                          <span className="block text-[0.8125rem] text-ink-soft">
                            {t.neighbourhood}
                          </span>
                        </span>
                        <span className="tabular shrink-0 text-sm font-semibold">
                          {create.steps.teacher.rateFor(t.hourlyRate)}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </fieldset>
          ) : null}

          {/* When and how many */}
          {teacher ? (
            <fieldset>
              <legend className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
                {create.steps.details.legend}
              </legend>

              {days.length === 0 ? (
                <p className="mt-3 text-sm text-ink-soft">{create.steps.details.noSlots}</p>
              ) : (
                <>
                  <p className="mt-3 mb-2 text-[0.8125rem] font-semibold">
                    {create.steps.details.dateLabel}
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {days.map((day, i) => (
                      <div key={day.date} className="relative shrink-0">
                        <input
                          type="radio"
                          id={`${id}-d-${day.date}`}
                          name={`${id}-day`}
                          checked={dayIndex === i}
                          onChange={() => {
                            setDayIndex(i);
                            setSlot(null);
                          }}
                          className="peer absolute inset-0 size-full cursor-pointer opacity-0"
                        />
                        <label
                          htmlFor={`${id}-d-${day.date}`}
                          className={cn(
                            "flex w-16 cursor-pointer flex-col items-center rounded-2xl border-2 py-2.5 transition-colors",
                            "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-forest",
                            dayIndex === i
                              ? "border-forest bg-forest text-paper"
                              : "border-ink/12 hover:border-ink/30",
                          )}
                        >
                          <span className="text-[0.625rem] font-bold tracking-wide uppercase opacity-70">
                            {day.dayShort}
                          </span>
                          <span className="tabular text-xl font-bold">{day.dayNumber}</span>
                          <span className="text-[0.625rem] font-semibold uppercase opacity-70">
                            {day.month}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 mb-2 text-[0.8125rem] font-semibold">
                    {create.steps.details.timeLabel}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDay?.slots.map((s) => (
                      <div key={s.value} className="relative">
                        <input
                          type="radio"
                          id={`${id}-s-${s.value}`}
                          name={`${id}-slot`}
                          checked={slot === s.value}
                          onChange={() => setSlot(s.value)}
                          className="peer absolute inset-0 size-full cursor-pointer opacity-0"
                        />
                        <label
                          htmlFor={`${id}-s-${s.value}`}
                          className={cn(
                            "tabular block cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition-colors",
                            "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-forest",
                            slot === s.value
                              ? "border-forest bg-forest text-paper"
                              : "border-ink/12 hover:border-ink/30",
                          )}
                        >
                          {s.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label={create.steps.details.durationLabel} htmlFor={`${id}-dur`}>
                  <Select
                    id={`${id}-dur`}
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    {DURATIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field
                  label={
                    <span className="flex items-baseline justify-between gap-2">
                      {create.steps.details.seatsLabel}
                      <span className="tabular font-bold">{seats}</span>
                    </span>
                  }
                  hint={create.steps.details.seatsHint}
                  htmlFor={`${id}-seats`}
                >
                  <input
                    id={`${id}-seats`}
                    type="range"
                    min={2}
                    max={8}
                    step={1}
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="h-12 w-full cursor-pointer accent-forest"
                  />
                </Field>

                <Field
                  label={create.steps.details.titleLabel}
                  htmlFor={`${id}-title-field`}
                  className="sm:col-span-2"
                >
                  <Input
                    id={`${id}-title-field`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={create.steps.details.titlePlaceholder}
                  />
                </Field>
              </div>

              {/* What it costs, before and after it fills */}
              <div aria-live="polite" className="mt-5 rounded-2xl bg-cream p-4">
                <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
                  {create.summary.label}
                </p>
                <p className="mt-2 text-[0.9375rem]">
                  {create.summary.soloFor(formatPrice(quote.perPerson))}
                </p>
                <p className="text-[0.9375rem] font-bold text-forest">
                  {create.summary.fullFor(formatPrice(fullQuote.perPerson), seats)}
                </p>
                <p className="mt-2 text-[0.75rem] leading-relaxed text-ink-faint">
                  {create.summary.note}
                </p>
              </div>
            </fieldset>
          ) : null}

          {error ? (
            <p role="alert" className="text-sm font-medium text-coral">
              {error}
            </p>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-ink/10 p-6 sm:px-8">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" size="lg" onClick={onClose}>
              {create.close}
            </Button>
            <Button type="submit" size="lg" disabled={!teacher || !slot}>
              {create.submit}
            </Button>
          </div>
        </div>
      </form>
    </dialog>
  );
}
