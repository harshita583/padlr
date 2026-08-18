/**
 * Lesson pricing.
 *
 * One implementation, used by both the profile booking panel and the in-chat
 * booking dialog — if these ever disagree, a learner sees one price and pays
 * another.
 */

/** Padlr's cut, added on top of what the teacher receives. */
export const SERVICE_FEE_RATE = 0.1;

/** Padlr's cut of the teacher's rate, deducted from what they're paid. */
export const PLATFORM_FEE_RATE = 0.05;

/** What a teacher keeps from an hour at `rate`. */
export function teacherTakeHome(rate: number): number {
  return Math.round(rate * (1 - PLATFORM_FEE_RATE));
}

/** Padlr's cut of a given amount — the mirror of `teacherTakeHome`. */
export function platformFeeOn(amount: number): number {
  return amount - teacherTakeHome(amount);
}

/**
 * Assumed conversion rate for a shared shopping link, since nothing in this
 * demo can actually know whether a learner went on to buy the thing. Any
 * figure built from this is an estimate and should say so on screen — it's
 * for showing what the feature would look like, not a real ledger.
 */
export const AFFILIATE_COMMISSION_RATE = 0.1;

/** "$14" → 14. Gear prices are authored as display strings, not numbers. */
export function parseGearPrice(price: string): number {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

export interface Quote {
  /** The teacher's base rate for the booked time. */
  lesson: number;
  /** Uplift for everyone beyond the first learner. */
  extra: number;
  fee: number;
  total: number;
  perPerson: number;
  people: number;
  durationMinutes: number;
}

export function quoteLesson({
  hourlyRate,
  groupUplift,
  durationMinutes,
  people,
}: {
  hourlyRate: number;
  groupUplift: number;
  durationMinutes: number;
  people: number;
}): Quote {
  const hours = durationMinutes / 60;
  const lesson = Math.round(hourlyRate * hours);
  const extra = Math.round(groupUplift * (people - 1) * hours);
  const fee = Math.round((lesson + extra) * SERVICE_FEE_RATE);
  const total = lesson + extra + fee;

  return {
    lesson,
    extra,
    fee,
    total,
    perPerson: Math.round(total / people),
    people,
    durationMinutes,
  };
}

/**
 * What a circle costs right now, given how many people are in it.
 *
 * Deliberately a pure function of the circle's membership: every screen
 * derives the same number from the same list, so the price moves the instant
 * somebody joins without anyone having to write a new figure down.
 */
export function quoteCircle({
  baseRate,
  groupUplift,
  durationMinutes,
  members,
  seatsTotal,
}: {
  baseRate: number;
  groupUplift: number;
  durationMinutes: number;
  /** How many people are currently in, host included. */
  members: number;
  seatsTotal: number;
}) {
  const hours = durationMinutes / 60;
  const count = Math.max(1, members);
  const totalFor = (n: number) =>
    Math.round(baseRate * hours + groupUplift * (n - 1) * hours);

  const total = totalFor(count);
  const seatsOpen = Math.max(0, seatsTotal - count);

  return {
    count,
    seatsOpen,
    isFull: seatsOpen === 0,
    total,
    perPerson: Math.round(total / count),
    /** What everyone would pay if one more person joined. */
    perPersonIfOneMore: seatsOpen > 0 ? Math.round(totalFor(count + 1) / (count + 1)) : null,
    /** What one person alone would pay, for the "you save" line. */
    soloPrice: totalFor(1),
  };
}
