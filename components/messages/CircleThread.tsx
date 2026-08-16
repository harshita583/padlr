"use client";

import { useEffect, useState } from "react";
import { messages as copy } from "@/content";
import {
  CIRCLES_EVENT,
  circleInitials,
  readCircle,
  type MyCircle,
} from "@/lib/circlesStore";
import { circleReplies } from "@/lib/data/demoScript";
import { formatRelativeDay, formatTime } from "@/lib/date";
import { ButtonLink } from "@/components/ui/Button";
import { Conversation, type ChatMessage } from "./Conversation";

/**
 * A conversation opened by starting a circle.
 *
 * Circles live in localStorage, so the server can't resolve one — this looks it
 * up on the client and hands the result to the same <Conversation> the seeded
 * threads use, so the two behave identically.
 */
export function CircleThread({ id }: { id: string }) {
  // undefined until localStorage has been read; null once we know it isn't there.
  const [circle, setCircle] = useState<MyCircle | null | undefined>(undefined);

  useEffect(() => {
    const read = () => setCircle(readCircle(id));
    read();
    window.addEventListener(CIRCLES_EVENT, read);
    return () => window.removeEventListener(CIRCLES_EVENT, read);
  }, [id]);

  if (circle === undefined) return <div className="flex-1 bg-cream/50" />;

  if (circle === null) {
    return (
      <div className="grid flex-1 place-items-center bg-cream/50 p-10 text-center">
        <div className="max-w-sm">
          <h2 className="display text-3xl">{copy.circleThread.missingTitle}</h2>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
            {copy.circleThread.missingBody}
          </p>
          <ButtonLink href={copy.circleThread.missingCta.href} className="mt-6">
            {copy.circleThread.missingCta.label}
          </ButtonLink>
        </div>
      </div>
    );
  }

  const sentAt = `${formatRelativeDay(circle.createdAt)}, ${formatTime(circle.createdAt)}`;
  const when = `${formatRelativeDay(circle.date)} at ${formatTime(circle.time)}`;

  const initialMessages: ChatMessage[] = [
    {
      id: `${circle.id}-intro`,
      kind: "text",
      mine: true,
      time: sentAt,
      body: copy.circleThread.openingFor(
        circle.skill.toLowerCase(),
        when.toLowerCase(),
        circle.seatsTotal,
      ),
    },
    {
      id: `${circle.id}-card`,
      kind: "circle",
      mine: true,
      time: sentAt,
      circleId: circle.id,
    },
  ];

  return (
    <Conversation
      // A different circle is a different conversation, not new props on the
      // same one — remount so the message log doesn't carry over.
      key={circle.id}
      partner={{
        name: circle.teacherName,
        initials: circleInitials(circle),
        tone: circle.tone,
        slug: circle.teacherSlug,
        skill: circle.skill,
        contextLine: copy.circleThread.contextFor(circle.skill),
        hourlyRate: circle.baseRate,
        groupUplift: circle.groupUplift,
        categorySlug: circle.categorySlug,
      }}
      initialMessages={initialMessages}
      gearItems={[]}
      demo={circleReplies}
      days={[]}
    />
  );
}
