/**
 * Date helpers.
 *
 * The mock data stores day *offsets* rather than fixed dates so the demo never
 * goes stale. All of it resolves on the server, and components receive strings
 * that are already formatted — that keeps server and client markup identical.
 */

const DAY_MS = 86_400_000;

/** Midnight today, in the server's timezone. */
export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** An ISO date (`2026-08-19`) `offset` days from today. */
export function isoDaysFromNow(offset: number): string {
  return new Date(today().getTime() + offset * DAY_MS).toISOString().slice(0, 10);
}

/** An ISO datetime `offset` days from today at `hhmm` (e.g. "18:30"). */
export function isoAt(offset: number, hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(today().getTime() + offset * DAY_MS);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const dayLongFmt = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });
const dateFullFmt = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

export function formatDayShort(iso: string): string {
  return dayFmt.format(new Date(iso));
}

export function formatDayLong(iso: string): string {
  return dayLongFmt.format(new Date(iso));
}

export function formatDayNumber(iso: string): string {
  return String(new Date(iso).getDate());
}

export function formatMonthShort(iso: string): string {
  return monthFmt.format(new Date(iso));
}

export function formatDateFull(iso: string): string {
  return dateFullFmt.format(new Date(iso));
}

/** "2:30 PM" from either an ISO datetime or a bare "14:30". */
export function formatTime(value: string): string {
  const d = value.includes("T") ? new Date(value) : new Date(`2000-01-01T${value}:00`);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

/** "Today", "Tomorrow", "Sat 22 Aug". */
export function formatRelativeDay(iso: string): string {
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today().getTime()) / DAY_MS);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `${formatDayShort(iso)} ${formatDayNumber(iso)} ${formatMonthShort(iso)}`;
}

/** "1 hr", "1 hr 30 min", "45 min". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h} hr ${m} min`;
  if (h) return `${h} hr`;
  return `${m} min`;
}

/** "$70" — whole dollars, which is all this product ever needs. */
export function formatPrice(dollars: number): string {
  return `$${dollars.toLocaleString("en-US")}`;
}
