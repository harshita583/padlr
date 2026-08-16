import { notFound } from "next/navigation";
import {
  getDemoScript,
  getExpertById,
  getGearById,
  getGearForCategories,
  getThread,
} from "@/lib/data";
import {
  formatDayNumber,
  formatDayShort,
  formatDuration,
  formatMonthShort,
  formatPrice,
  formatRelativeDay,
  formatTime,
} from "@/lib/date";
import type { BookableDay } from "@/lib/types";
import { Conversation, type ChatMessage } from "@/components/messages/Conversation";

/**
 * One conversation, fully resolved on the server.
 *
 * Used by both /messages (which opens the most recent thread) and
 * /messages/[id] — one implementation, so they can't drift apart.
 */
export async function ThreadView({ id }: { id: string }) {
  const thread = await getThread(id);
  if (!thread) notFound();

  const person = await getExpertById(thread.expertId);
  if (!person) notFound();

  // Everything is formatted here so the client component stays a pure
  // renderer — no dates, no currency maths, no hydration drift.
  const items: ChatMessage[] = await Promise.all(
    thread.messages.map(async (message) => ({
      id: message.id,
      kind: message.kind,
      mine: message.authorId === "me",
      time: `${formatRelativeDay(message.sentAt)}, ${formatTime(message.sentAt)}`,
      body: message.body,
      gear: message.gearId ? await getGearById(message.gearId) : undefined,
      booking: message.booking
        ? {
            dateLabel: formatRelativeDay(message.booking.date),
            timeLabel: formatTime(message.booking.time),
            durationLabel: formatDuration(message.booking.durationMinutes),
            peopleLabel:
              message.booking.people === 1 ? "Just you" : `${message.booking.people} people`,
            totalLabel: formatPrice(message.booking.total),
            people: message.booking.people,
            status: message.booking.status,
          }
        : undefined,
    })),
  );

  const [gearItems, demo] = await Promise.all([
    getGearForCategories(person.categories, 8),
    getDemoScript(thread.id),
  ]);

  const days: BookableDay[] = person.availability.map((day) => ({
    date: day.date,
    dayShort: formatDayShort(day.date),
    dayNumber: formatDayNumber(day.date),
    month: formatMonthShort(day.date),
    slots: day.slots.map((s) => ({ value: s, label: formatTime(s) })),
  }));

  return (
    <Conversation
      partner={{
        name: person.name,
        initials: person.initials,
        tone: person.tone,
        slug: person.slug,
        skill: thread.skill,
        hourlyRate: person.hourlyRate,
        groupUplift: person.groupUplift,
        categorySlug: person.categories[0] ?? "",
      }}
      initialMessages={items}
      gearItems={gearItems}
      demo={demo}
      days={days}
    />
  );
}
