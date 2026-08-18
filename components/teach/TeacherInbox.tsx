"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { teach as copy } from "@/content";
import {
  EARNINGS_EVENT,
  groupByThread,
  readEarnings,
  type ThreadActivity,
} from "@/lib/earningsStore";
import { readTeacher, type TeacherProfile } from "@/lib/teacherStore";
import { formatPrice } from "@/lib/date";
import { Avatar, Eyebrow } from "@/components/ui/Primitives";
import { ButtonLink } from "@/components/ui/Button";

const inbox = copy.inbox;

/** "Priya N." → "PN". "A learner" → "AL". Same idea as every other avatar here. */
function initialsOf(label: string): string {
  return label
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * The teacher's own view of Messages: not every conversation, only the ones
 * that actually turned into money — a confirmed lesson or a shared link.
 * Built from the earnings ledger rather than the chat transcripts themselves,
 * since transcripts aren't kept anywhere durable in this demo; the ledger is.
 */
export function TeacherInbox() {
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [threads, setThreads] = useState<ThreadActivity[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTeacher(readTeacher());
    const read = () => setThreads(groupByThread(readEarnings()));
    read();
    window.addEventListener(EARNINGS_EVENT, read);
    return () => window.removeEventListener(EARNINGS_EVENT, read);
  }, []);

  if (!mounted) return <div className="min-h-[24rem]" />;

  if (!teacher) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-ink/20 p-12 text-center">
        <h2 className="display text-3xl">{copy.dashboard.notYet.title}</h2>
        <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
          {copy.dashboard.notYet.body}
        </p>
        <ButtonLink href={copy.dashboard.notYet.cta.href} size="lg" className="mt-6">
          {copy.dashboard.notYet.cta.label}
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Eyebrow>{inbox.eyebrow}</Eyebrow>
        <h1 className="display mt-3 text-[clamp(2rem,4.5vw,3rem)]">{inbox.title}</h1>
        <p className="mt-3 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-soft">
          {inbox.body}
        </p>
        <ButtonLink href={copy.apply.panel.dashboardCta.href} variant="outline" className="mt-4">
          {copy.apply.panel.dashboardCta.label}
        </ButtonLink>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-ink/20 p-12 text-center">
          <p className="font-semibold">{inbox.emptyTitle}</p>
          <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
            {inbox.emptyBody}
          </p>
          <ButtonLink href={inbox.emptyCta.href} className="mt-6">
            {inbox.emptyCta.label}
          </ButtonLink>
        </div>
      ) : (
        <ul aria-label={inbox.listLabel} className="flex flex-col gap-3">
          {threads.map((thread) => (
            <li key={thread.threadHref}>
              <Link
                href={`/teach/inbox/thread?ref=${encodeURIComponent(thread.threadHref)}`}
                className="flex items-center gap-4 rounded-[var(--radius-card)] border border-ink/8 bg-paper p-5 transition-colors hover:border-ink/20"
              >
                <Avatar
                  initials={initialsOf(thread.learnerLabel)}
                  name={thread.learnerLabel}
                  tone={thread.tone}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{thread.learnerLabel}</p>
                  <p className="text-sm text-ink-soft">
                    {thread.skill} · {thread.events.length}{" "}
                    {thread.events.length === 1 ? "update" : "updates"}
                  </p>
                </div>
                <p className="tabular shrink-0 text-lg font-bold">
                  {inbox.totalFor(formatPrice(thread.totalPayout))}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
