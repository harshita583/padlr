"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { BookableDay } from "@/lib/types";
import { expert as expertCopy, messages as copy } from "@/content";
import { quoteLesson } from "@/lib/pricing";
import { formatPrice } from "@/lib/date";
import { Button } from "@/components/ui/Button";
import { PillGroup } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

const dialogCopy = copy.bookingDialog;
const booking = expertCopy.booking;

export interface BookingRequest {
  dayIndex: number;
  slot: string;
  durationMinutes: number;
  people: number;
  total: number;
  /** The lesson price before Padlr's learner-side fee — what the teacher's cut is a percentage of. */
  grossAmount: number;
}

/**
 * The in-chat booking overlay.
 *
 * Built on native <dialog> and opened with `showModal()`, which gives a focus
 * trap, Escape-to-close and an inert background without a line of our own
 * code. The dimmed backdrop is styled via `dialog::backdrop` in globals.css.
 */
export function BookingDialog({
  open,
  onClose,
  onConfirm,
  partnerName,
  hourlyRate,
  groupUplift,
  days,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (request: BookingRequest) => void;
  partnerName: string;
  hourlyRate: number;
  groupUplift: number;
  days: BookableDay[];
}) {
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [duration, setDuration] = useState("60");
  const [people, setPeople] = useState("1");
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  // Reset to a clean form each time it opens, so a second booking doesn't
  // inherit the first one's answers.
  useEffect(() => {
    if (!open) return;
    setDuration("60");
    setPeople("1");
    setDayIndex(0);
    setSlot(null);
  }, [open]);

  const selectedDay = days[dayIndex];

  const quote = useMemo(
    () =>
      quoteLesson({
        hourlyRate,
        groupUplift,
        durationMinutes: Number(duration),
        people: Number(people),
      }),
    [hourlyRate, groupUplift, duration, people],
  );

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!slot) return;
    onConfirm({
      dayIndex,
      slot,
      durationMinutes: Number(duration),
      people: Number(people),
      total: quote.total,
      grossAmount: quote.lesson + quote.extra,
    });
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      // Fires on Escape and on the browser's own close paths, so state stays
      // in sync however the dialog is dismissed.
      onClose={onClose}
      // Clicking the backdrop (the dialog element itself, outside the panel)
      // closes it, matching what people expect from an overlay.
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <form
        onSubmit={submit}
        className="flex max-h-[85dvh] flex-col overflow-hidden rounded-[var(--radius-card)] bg-paper shadow-[var(--shadow-lift)]"
      >
        <div className="flex items-start justify-between gap-4 p-6 pb-0 sm:p-8 sm:pb-0">
          <div>
            <h2 id={`${id}-title`} className="display text-3xl">
              {dialogCopy.titleFor(partnerName)}
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
              {dialogCopy.intro}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/8 text-sm transition-colors hover:bg-ink/15"
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">{dialogCopy.closeLabel}</span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-6 pt-7 sm:px-8">
          <PillGroup
            legend={booking.durationLabel}
            name={`${id}-duration`}
            options={booking.durationOptions}
            value={duration}
            onChange={setDuration}
          />

          <PillGroup
            legend={booking.peopleLabel}
            name={`${id}-people`}
            options={booking.peopleOptions}
            value={people}
            onChange={setPeople}
            hint={booking.peopleHint}
          />

          {days.length > 0 ? (
            <>
              <fieldset>
                <legend className="mb-2 text-[0.8125rem] font-semibold text-ink">
                  {booking.dateLabel}
                </legend>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {days.map((day, i) => (
                    <div key={day.date} className="relative shrink-0">
                      <input
                        type="radio"
                        id={`${id}-day-${day.date}`}
                        name={`${id}-day`}
                        checked={dayIndex === i}
                        onChange={() => {
                          setDayIndex(i);
                          setSlot(null);
                        }}
                        className="peer absolute inset-0 size-full cursor-pointer opacity-0"
                      />
                      <label
                        htmlFor={`${id}-day-${day.date}`}
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
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-[0.8125rem] font-semibold text-ink">
                  {booking.timeLabel}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {selectedDay.slots.map((s) => (
                    <div key={s.value} className="relative">
                      <input
                        type="radio"
                        id={`${id}-slot-${s.value}`}
                        name={`${id}-slot`}
                        checked={slot === s.value}
                        onChange={() => setSlot(s.value)}
                        className="peer absolute inset-0 size-full cursor-pointer opacity-0"
                      />
                      <label
                        htmlFor={`${id}-slot-${s.value}`}
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
              </fieldset>
            </>
          ) : (
            <p className="text-sm text-ink-soft">{dialogCopy.noSlots}</p>
          )}

          <div aria-live="polite" className="rounded-2xl bg-cream p-4">
            <h3 className="text-[0.8125rem] font-semibold">{booking.summaryLabel}</h3>
            <dl className="mt-2.5 space-y-1.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">{booking.lineItems.lesson}</dt>
                <dd className="tabular font-medium">{formatPrice(quote.lesson)}</dd>
              </div>
              {quote.extra > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-soft">{booking.lineItems.extraLearners}</dt>
                  <dd className="tabular font-medium">{formatPrice(quote.extra)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">{booking.lineItems.serviceFee}</dt>
                <dd className="tabular font-medium">{formatPrice(quote.fee)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-ink/12 pt-2 text-base font-bold">
                <dt>{booking.lineItems.total}</dt>
                <dd className="tabular">{formatPrice(quote.total)}</dd>
              </div>
              {quote.people > 1 ? (
                <div className="flex justify-between gap-4 text-forest">
                  <dt className="font-semibold">{booking.lineItems.perPerson}</dt>
                  <dd className="tabular font-bold">{formatPrice(quote.perPerson)}</dd>
                </div>
              ) : null}
            </dl>
          </div>

        </div>

        <div className="shrink-0 border-t border-ink/10 bg-paper p-6 sm:px-8">
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" size="lg" onClick={onClose}>
              {dialogCopy.close}
            </Button>
            <Button type="submit" size="lg" disabled={days.length > 0 && !slot}>
              {dialogCopy.submit}
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-ink-faint sm:text-right">
            {booking.submitHint}
          </p>
        </div>
      </form>
    </dialog>
  );
}
