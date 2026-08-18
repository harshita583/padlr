"use client";

import { useEffect, useState } from "react";
import { teach as copy } from "@/content";
import {
  EARNINGS_EVENT,
  readEarnings,
  type EarningEvent,
  type LessonEarning,
} from "@/lib/earningsStore";
import { readTeacher, type TeacherProfile } from "@/lib/teacherStore";
import { formatPrice, today } from "@/lib/date";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Primitives";

const dash = copy.dashboard;

export function EarningsDashboard() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [earnings, setEarnings] = useState<EarningEvent[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTeacher(readTeacher());
    const read = () => setEarnings(readEarnings());
    read();
    window.addEventListener(EARNINGS_EVENT, read);
    return () => window.removeEventListener(EARNINGS_EVENT, read);
  }, []);

  // localStorage is invisible to the server, so hold the shape until mount
  // rather than flashing an empty state that's about to be wrong.
  if (!mounted) return <div className="min-h-[24rem]" />;

  if (!teacher) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-ink/20 p-12 text-center">
        <h2 className="display text-3xl">{dash.notYet.title}</h2>
        <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
          {dash.notYet.body}
        </p>
        <ButtonLink href={dash.notYet.cta.href} size="lg" className="mt-6">
          {dash.notYet.cta.label}
        </ButtonLink>
      </div>
    );
  }

  const lessons = earnings.filter((e): e is LessonEarning => e.kind === "lesson");
  const affiliate = earnings.filter((e) => e.kind === "affiliate");

  const totalPayout = lessons.reduce((sum, e) => sum + e.payout, 0);
  const totalFee = lessons.reduce((sum, e) => sum + e.fee, 0);
  const totalAffiliate = affiliate.reduce((sum, e) => sum + e.estimatedPayout, 0);

  const todayIso = today().toISOString().slice(0, 10);
  const upcoming = lessons
    .filter((l) => l.lessonDate >= todayIso)
    .sort((a, b) => a.lessonDate.localeCompare(b.lessonDate));
  const past = lessons
    .filter((l) => l.lessonDate < todayIso)
    .sort((a, b) => b.lessonDate.localeCompare(a.lessonDate));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Eyebrow>{dash.eyebrow}</Eyebrow>
        <h1 className="display mt-3 text-[clamp(2rem,4.5vw,3rem)]">{dash.title}</h1>
        <p className="mt-3 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
          {dash.body}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={dash.stats.payout} value={formatPrice(totalPayout)} tone="bg-forest text-paper" />
        <StatCard label={dash.stats.fee} value={formatPrice(totalFee)} tone="bg-cream text-ink" />
        <StatCard
          label={dash.stats.affiliate}
          value={formatPrice(totalAffiliate)}
          tone="bg-lemon-soft text-ink"
          note={dash.affiliateNote}
        />
        <StatCard
          label={dash.stats.lessons}
          value={String(lessons.length)}
          tone="bg-cream text-ink"
        />
      </div>

      {/* Schedule */}
      <div>
        <h2 className="display text-2xl">{dash.schedule.title}</h2>

        {lessons.length === 0 ? (
          <div className="mt-4 rounded-[var(--radius-card)] border border-dashed border-ink/20 p-10 text-center">
            <p className="font-semibold">{dash.schedule.emptyTitle}</p>
            <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
              {dash.schedule.emptyBody}
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-6">
            {upcoming.length > 0 ? (
              <ScheduleGroup label={dash.schedule.upcomingLabel} lessons={upcoming} />
            ) : null}
            {past.length > 0 ? (
              <ScheduleGroup label={dash.schedule.pastLabel} lessons={past} />
            ) : null}
          </div>
        )}
      </div>

      <ButtonLink href={dash.backCta.href} variant="outline" className="self-start">
        {dash.backCta.label}
      </ButtonLink>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
  note,
}: {
  label: string;
  value: string;
  tone: string;
  note?: string;
}) {
  return (
    <div className={`rounded-[var(--radius-card)] p-5 ${tone}`}>
      <p className="text-[0.6875rem] font-bold tracking-[0.14em] uppercase opacity-70">{label}</p>
      <p className="tabular mt-2 text-3xl font-bold tracking-tight">{value}</p>
      {note ? <p className="mt-2 text-xs leading-relaxed opacity-70">{note}</p> : null}
    </div>
  );
}

function ScheduleGroup({ label, lessons }: { label: string; lessons: LessonEarning[] }) {
  return (
    <div>
      <p className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
        {label}
      </p>
      <ul className="mt-2 flex flex-col gap-2">
        {lessons.map((lesson) => (
          <li
            key={lesson.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/8 bg-paper px-5 py-4"
          >
            <div>
              <p className="font-bold">
                {lesson.dateLabel}, {lesson.timeLabel}
              </p>
              <p className="text-sm text-ink-soft">
                {lesson.skill} · {dash.schedule.peopleFor(lesson.people)}
              </p>
            </div>
            <p className="text-right">
              <span className="tabular block text-lg font-bold">
                {formatPrice(lesson.payout)}
              </span>
              <span className="block text-xs text-ink-faint">{dash.schedule.payoutLabel}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
