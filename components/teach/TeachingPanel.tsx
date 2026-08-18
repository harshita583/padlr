"use client";

import { useEffect, useState } from "react";
import { teach as copy } from "@/content";
import { formatPrice } from "@/lib/date";
import { teacherTakeHome } from "@/lib/pricing";
import {
  TEACHER_EVENT,
  readTeacher,
  teacherInitials,
  teacherName,
  type TeacherProfile,
} from "@/lib/teacherStore";
import { ButtonLink } from "@/components/ui/Button";
import { Avatar, Eyebrow } from "@/components/ui/Primitives";

const panel = copy.apply.panel;

/**
 * Your teaching side, on your account page.
 *
 * Renders nothing at all when you haven't signed up to teach — most people
 * never will, and an empty "you could teach!" box on every visit is nagging.
 */
export function TeachingPanel() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const read = () => setTeacher(readTeacher());
    read();
    window.addEventListener(TEACHER_EVENT, read);
    return () => window.removeEventListener(TEACHER_EVENT, read);
  }, []);

  if (!mounted || !teacher) return null;

  const name = teacherName(teacher);

  return (
    <div className="mb-4 rounded-[var(--radius-card)] bg-sage-wash p-6 sm:p-8">
      <Eyebrow className="text-forest/70">{panel.eyebrow}</Eyebrow>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
        <Avatar initials={teacherInitials(teacher)} name={name} tone="olive" size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold">{name}</p>
          <p className="mt-0.5 text-[0.9375rem] text-ink-soft">{teacher.headline}</p>
          <p className="tabular mt-2 text-[0.9375rem] font-semibold text-forest">
            {panel.rateFor(
              formatPrice(teacher.hourlyRate),
              formatPrice(teacherTakeHome(teacher.hourlyRate)),
            )}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-5 border-t border-forest/15 pt-5 sm:grid-cols-3">
        <div>
          <dt className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-soft uppercase">
            {panel.teachesLabel}
          </dt>
          <dd className="mt-1.5 text-[0.9375rem]">{teacher.skills.join(", ")}</dd>
        </div>
        <div>
          <dt className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-soft uppercase">
            {panel.formatsLabel}
          </dt>
          <dd className="mt-1.5 text-[0.9375rem]">
            {teacher.formats.map((f) => panel.formatNames[f]).join(", ")}
          </dd>
        </div>
        <div>
          <dt className="text-[0.6875rem] font-bold tracking-[0.16em] text-ink-soft uppercase">
            {panel.daysLabel}
          </dt>
          <dd className="mt-1.5 text-[0.9375rem]">
            {teacher.days.length > 0 ? teacher.days.join(", ") : "—"}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <ButtonLink href={panel.dashboardCta.href}>{panel.dashboardCta.label}</ButtonLink>
        <ButtonLink href={panel.inboxCta.href} variant="outline">
          {panel.inboxCta.label}
        </ButtonLink>
        <ButtonLink href={panel.messagesCta.href} variant="outline">
          {panel.messagesCta.label}
        </ButtonLink>
        <ButtonLink href={panel.editCta.href} variant="outline">
          {panel.editCta.label}
        </ButtonLink>
      </div>
    </div>
  );
}
