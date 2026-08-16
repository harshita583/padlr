"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { expert as copy } from "@/content";
import { Button } from "@/components/ui/Button";
import { PillGroup } from "@/components/ui/Field";
import { formatPrice } from "@/lib/date";
import { cn } from "@/lib/utils";

/** A day of availability, pre-formatted on the server. */
export interface BookableDay {
  date: string;
  dayShort: string;
  dayNumber: string;
  month: string;
  slots: Array<{ value: string; label: string }>;
}

const SERVICE_FEE_RATE = 0.1;

export function BookingPanel({
  expertName,
  expertSlug,
  hourlyRate,
  groupUplift,
  days,
}: {
  expertName: string;
  expertSlug: string;
  hourlyRate: number;
  groupUplift: number;
  days: BookableDay[];
}) {
  const id = useId();
  const [duration, setDuration] = useState("60");
  const [people, setPeople] = useState("1");
  const [dayIndex, setDayIndex] = useState(0);
  const [slot, setSlot] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedDay = days[dayIndex];

  const price = useMemo(() => {
    const hours = Number(duration) / 60;
    const headcount = Number(people);
    const lesson = Math.round(hourlyRate * hours);
    const extra = Math.round(groupUplift * (headcount - 1) * hours);
    const fee = Math.round((lesson + extra) * SERVICE_FEE_RATE);
    const total = lesson + extra + fee;
    return {
      lesson,
      extra,
      fee,
      total,
      perPerson: Math.round(total / headcount),
      headcount,
    };
  }, [duration, people, hourlyRate, groupUplift]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Wire this to your bookings endpoint. Until then it acknowledges the
    // request so the flow is testable end to end.
    setSubmitted(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-labelledby={`${id}-title`}
      className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6 shadow-[var(--shadow-lift)]"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={`${id}-title`} className="display text-2xl">
          {copy.booking.panelLabel}
        </h2>
        <p className="text-right">
          <span className="tabular text-2xl font-bold tracking-tight">
            {formatPrice(hourlyRate)}
          </span>
          <span className="block text-xs text-ink-faint">{copy.booking.rateSuffix}</span>
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <PillGroup
          legend={copy.booking.durationLabel}
          name={`${id}-duration`}
          options={copy.booking.durationOptions}
          value={duration}
          onChange={setDuration}
        />

        <PillGroup
          legend={copy.booking.peopleLabel}
          name={`${id}-people`}
          options={copy.booking.peopleOptions}
          value={people}
          onChange={setPeople}
          hint={copy.booking.peopleHint}
        />

        {days.length > 0 ? (
          <>
            <fieldset>
              <legend className="mb-2 text-[0.8125rem] font-semibold text-ink">
                {copy.booking.dateLabel}
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
                {copy.booking.timeLabel}
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
          <p className="text-sm text-ink-soft">{copy.booking.noSlots}</p>
        )}

        {/* Price breakdown. Recalculates live and is announced politely. */}
        <div aria-live="polite">
          <h3 className="text-[0.8125rem] font-semibold text-ink">
            {copy.booking.summaryLabel}
          </h3>
          <dl className="mt-2.5 space-y-1.5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">{copy.booking.lineItems.lesson}</dt>
              <dd className="tabular font-medium">{formatPrice(price.lesson)}</dd>
            </div>
            {price.extra > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="text-ink-soft">{copy.booking.lineItems.extraLearners}</dt>
                <dd className="tabular font-medium">{formatPrice(price.extra)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-ink-soft">{copy.booking.lineItems.serviceFee}</dt>
              <dd className="tabular font-medium">{formatPrice(price.fee)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-ink/12 pt-2 text-base font-bold">
              <dt>{copy.booking.lineItems.total}</dt>
              <dd className="tabular">{formatPrice(price.total)}</dd>
            </div>
            {price.headcount > 1 ? (
              <div className="flex justify-between gap-4 rounded-2xl bg-sage-wash px-3 py-2 text-forest">
                <dt className="font-semibold">{copy.booking.lineItems.perPerson}</dt>
                <dd className="tabular font-bold">{formatPrice(price.perPerson)}</dd>
              </div>
            ) : null}
          </dl>
          {price.headcount > 1 ? (
            <p className="mt-2 text-xs leading-relaxed text-ink-faint">
              {copy.booking.groupNote}
            </p>
          ) : null}
        </div>

        {submitted ? (
          <p
            role="status"
            className="rounded-2xl bg-sage-wash px-4 py-3 text-sm font-medium text-forest"
          >
            <span aria-hidden="true">✓ </span>
            Request sent to {expertName}. You&apos;ll hear back{" "}
            {slot ? "shortly" : "once you pick a time"} — nothing has been charged yet.
          </p>
        ) : (
          <>
            <Button type="submit" size="lg" disabled={days.length > 0 && !slot}>
              {copy.booking.submit}
            </Button>
            <p className="-mt-3 text-center text-xs text-ink-faint">
              {copy.booking.submitHint}
            </p>
          </>
        )}

        <Link
          href={`/messages?to=${expertSlug}`}
          className="text-center text-sm font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 hover:decoration-forest"
        >
          {copy.booking.messageInstead}
        </Link>
      </div>
    </form>
  );
}
