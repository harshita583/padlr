"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { circles as copy } from "@/content";
import {
  CIRCLES_EVENT,
  joinCircle,
  readCircles,
  removeCircle,
  type MyCircle,
} from "@/lib/circlesStore";
import { PROFILE_EVENT, displayName, readProfile } from "@/lib/profile";
import { quoteCircle } from "@/lib/pricing";
import { formatPrice, formatRelativeDay, formatTime } from "@/lib/date";
import { Badge, Eyebrow } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { ShareSheet } from "@/components/share/ShareSheet";
import { CreateCircleDialog, type CircleCategoryOption, type CircleTeacherOption } from "./CreateCircleDialog";
import { cn, toneSurface } from "@/lib/utils";

const mine = copy.mine;

/** Neighbours the demo join button can add, so the price visibly moves. */
const DEMO_NEIGHBOURS = ["Sam P.", "Dana L.", "Tom R.", "Aisha K.", "Ben S.", "Nour H."];

export function MyCircles({
  categories,
  teachers,
}: {
  categories: CircleCategoryOption[];
  teachers: CircleTeacherOption[];
}) {
  const [circles, setCircles] = useState<MyCircle[]>([]);
  const [mounted, setMounted] = useState(false);
  const [creating, setCreating] = useState(false);
  const [hostName, setHostName] = useState("You");

  useEffect(() => {
    setMounted(true);
    const read = () => setCircles(readCircles());
    const readHost = () => {
      const profile = readProfile();
      setHostName(profile ? displayName(profile) : "You");
    };
    read();
    readHost();
    window.addEventListener(CIRCLES_EVENT, read);
    window.addEventListener(PROFILE_EVENT, readHost);
    return () => {
      window.removeEventListener(CIRCLES_EVENT, read);
      window.removeEventListener(PROFILE_EVENT, readHost);
    };
  }, []);

  // localStorage is invisible to the server, so hold the shape until mount
  // rather than flashing an empty state that's about to be wrong.
  if (!mounted) return <div className="min-h-[16rem]" />;

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Eyebrow className="mb-3">{mine.title}</Eyebrow>
          <h2 className="display text-[clamp(2rem,4.5vw,3.25rem)]">{copy.hero.cta.label}</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">{mine.body}</p>
        </div>
        <Button size="lg" onClick={() => setCreating(true)}>
          {copy.create.trigger}
        </Button>
      </div>

      {circles.length > 0 ? (
        <ul className="mt-10 grid gap-4 lg:grid-cols-2">
          {circles.map((circle) => (
            <li key={circle.id}>
              <MyCircleCard circle={circle} hostName={hostName} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-[var(--radius-card)] border border-dashed border-ink/20 p-12 text-center">
          <h3 className="display text-3xl">{mine.emptyTitle}</h3>
          <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
            {mine.emptyBody}
          </p>
          <Button className="mt-6" onClick={() => setCreating(true)}>
            {copy.create.trigger}
          </Button>
        </div>
      )}

      <CreateCircleDialog
        open={creating}
        onClose={() => setCreating(false)}
        categories={categories}
        teachers={teachers}
        host={{ id: "me", name: hostName }}
      />
    </>
  );
}

function MyCircleCard({ circle, hostName }: { circle: MyCircle; hostName: string }) {
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);

  const quote = quoteCircle({
    baseRate: circle.baseRate,
    groupUplift: circle.groupUplift,
    durationMinutes: circle.durationMinutes,
    members: circle.members.length,
    seatsTotal: circle.seatsTotal,
  });

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/circles?join=${circle.shareCode}`
      : "";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      // Clipboard can be blocked; the share sheet still works.
    }
  }

  /** Adds the next unused neighbour so the price visibly recalculates. */
  function simulateJoin() {
    const taken = new Set(circle.members.map((m) => m.name));
    const next = DEMO_NEIGHBOURS.find((n) => !taken.has(n));
    if (!next) return;
    joinCircle(circle.id, { id: `demo-${next}`, name: next });
  }

  return (
    <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-lg leading-snug font-bold tracking-tight">{circle.title}</h3>
          <p className="mt-1 text-sm text-ink-soft">
            {circle.skill} · {circle.level}
          </p>
        </div>
        {circle.status === "pending" ? (
          <Badge className="bg-lemon-soft text-ink">
            {mine.statusPending(circle.teacherName)}
          </Badge>
        ) : circle.status === "open" ? (
          <Badge className="bg-sage-wash text-forest">{mine.statusOpen}</Badge>
        ) : (
          <Badge className="bg-ink/10 text-ink-soft">{mine.statusDeclined}</Badge>
        )}
      </div>

      <dl className="mt-4 space-y-1.5 text-sm text-ink-faint">
        <div className="flex gap-1.5">
          <dt className="sr-only">Teacher</dt>
          <dd>Taught by {circle.teacherName}</dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="sr-only">When</dt>
          <dd>
            {formatRelativeDay(circle.date)}, {formatTime(circle.time)}
          </dd>
        </div>
        <div className="flex gap-1.5">
          <dt className="sr-only">Where</dt>
          <dd>{circle.neighbourhood}</dd>
        </div>
      </dl>

      {/* Seat pips — the mechanic at a glance */}
      <div className="mt-5 flex items-center gap-1.5" aria-hidden="true">
        {Array.from({ length: circle.seatsTotal }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full",
              i < circle.members.length
                ? circle.status === "open"
                  ? "bg-forest"
                  : "bg-ink/30"
                : "bg-ink/12",
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-ink-faint">
        {mine.seatsFor(quote.seatsOpen, circle.seatsTotal)}
      </p>

      {circle.status === "open" ? (
        <>
          <div className="mt-4">
            <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-ink-faint uppercase">
              {mine.membersLabel}
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {circle.members.map((member) => (
                <li
                  key={member.id}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    member.host ? toneSurface[circle.tone] : "bg-ink/6 text-ink-soft",
                  )}
                >
                  {member.host ? mine.hostTag : member.name}
                </li>
              ))}
            </ul>
          </div>

          <div aria-live="polite" className="mt-5 border-t border-ink/10 pt-4">
            <p className="tabular text-3xl font-bold tracking-tight">
              {formatPrice(quote.perPerson)}
              <span className="ml-1.5 text-sm font-normal text-ink-faint">
                {mine.priceEach}
              </span>
            </p>
            <p className="mt-1 text-xs text-ink-faint">
              {quote.perPersonIfOneMore
                ? mine.priceDropNote(formatPrice(quote.perPersonIfOneMore))
                : mine.fullNote}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setSharing(true)}>
              {mine.shareAction}
            </Button>
            <Button size="sm" variant="outline" onClick={copyLink}>
              {copied ? mine.copied : mine.copyLink}
            </Button>
          </div>

          {!quote.isFull ? (
            <div className="mt-4 border-t border-dashed border-ink/25 pt-3">
              <p className="text-[0.625rem] font-bold tracking-[0.12em] text-ink/45 uppercase">
                {mine.simulateHint}
              </p>
              <button
                type="button"
                onClick={simulateJoin}
                className="mt-2 w-full rounded-full border-2 border-ink/20 px-3 py-2 text-[0.8125rem] font-semibold transition-colors hover:border-ink/40"
              >
                {mine.simulateJoin}
              </button>
            </div>
          ) : null}

          <ShareSheet
            open={sharing}
            onClose={() => setSharing(false)}
            title={circle.title}
            intro={mine.body}
            text={`I'm putting together a small group to learn ${circle.skill.toLowerCase()} with ${circle.teacherName}. ${quote.seatsOpen} ${quote.seatsOpen === 1 ? "seat" : "seats"} left — it's ${formatPrice(quote.perPerson)} each and drops as more of us join.`}
            motifSeed={circle.id}
          />
        </>
      ) : null}

      {/* The teacher has to agree before anyone can take a seat, and that
          conversation is where they answer. */}
      {circle.status === "pending" ? (
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-soft">
          {mine.pendingNote}
        </p>
      ) : null}

      {circle.status === "declined" ? (
        <>
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-soft">
            {mine.declinedNote}
          </p>
          <button
            type="button"
            onClick={() => removeCircle(circle.id)}
            className="mt-4 text-left text-[0.8125rem] font-semibold text-ink-faint underline decoration-ink/25 decoration-2 underline-offset-4 hover:text-ink"
          >
            {mine.remove}
          </button>
        </>
      ) : null}

      <Link
        href={`/messages/${circle.id}`}
        className="mt-6 block rounded-full border-2 border-forest/25 px-4 py-2.5 text-center text-[0.8125rem] font-semibold text-forest transition-colors hover:border-forest/60"
      >
        {mine.openThread(circle.teacherName)}
      </Link>

      <span className="sr-only">{hostName}</span>
    </article>
  );
}
