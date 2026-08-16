/**
 * Lesson pricing.
 *
 * One implementation, used by both the profile booking panel and the in-chat
 * booking dialog — if these ever disagree, a learner sees one price and pays
 * another.
 */

/** Padlr's cut, added on top of what the teacher receives. */
export const SERVICE_FEE_RATE = 0.1;

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
