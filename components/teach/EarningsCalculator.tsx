"use client";

import { useId, useState } from "react";
import { teach as copy } from "@/content";
import { formatPrice } from "@/lib/date";

const calc = copy.earnings.calculator;
const PLATFORM_FEE = 0.15;

export function EarningsCalculator() {
  const id = useId();
  const [rate, setRate] = useState(60);
  const [hours, setHours] = useState(6);

  const gross = rate * hours;
  const fee = Math.round(gross * PLATFORM_FEE);
  const take = gross - fee;

  return (
    <div className="rounded-[var(--radius-card)] bg-olive p-7 text-cream sm:p-9">
      <fieldset>
        <legend className="text-[0.6875rem] font-bold tracking-[0.18em] text-cream/50 uppercase">
          {calc.legend}
        </legend>

        <div className="mt-7 flex flex-col gap-7">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${id}-rate`} className="text-[0.9375rem] font-semibold">
                {calc.rateLabel}
              </label>
              <output htmlFor={`${id}-rate`} className="tabular text-2xl font-bold text-lemon">
                {formatPrice(rate)}
              </output>
            </div>
            <input
              id={`${id}-rate`}
              type="range"
              min={20}
              max={150}
              step={5}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mt-3 h-2 w-full cursor-pointer accent-lemon"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between gap-4">
              <label htmlFor={`${id}-hours`} className="text-[0.9375rem] font-semibold">
                {calc.hoursLabel}
              </label>
              <output htmlFor={`${id}-hours`} className="tabular text-2xl font-bold text-lemon">
                {hours}
              </output>
            </div>
            <input
              id={`${id}-hours`}
              type="range"
              min={1}
              max={30}
              step={1}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-3 h-2 w-full cursor-pointer accent-lemon"
            />
          </div>
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-9 border-t border-cream/15 pt-7">
        <p className="text-[0.6875rem] font-bold tracking-[0.18em] text-cream/50 uppercase">
          {calc.resultLabel}
        </p>
        <p className="tabular mt-2 text-[clamp(3rem,8vw,4.5rem)] leading-none font-bold tracking-tight text-lemon">
          {formatPrice(take)}
        </p>
        <p className="mt-3 text-[0.9375rem] text-cream/75">{calc.resultSuffix}</p>
        <p className="mt-1 text-sm text-cream/50">{calc.feeNote(fee)}</p>
      </div>
    </div>
  );
}
