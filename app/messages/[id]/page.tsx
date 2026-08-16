import { notFound } from "next/navigation";
import {
  getDemoScript,
  getExpertById,
  getGearById,
  getGearForCategories,
  getThread,
  getThreads,
} from "@/lib/data";
import { formatDuration, formatPrice, formatRelativeDay, formatTime } from "@/lib/date";
import { Conversation, type ChatMessage } from "@/components/messages/Conversation";

type Params = Promise<{ id: string }>;

export async function generateStaticParams() {
  const list = await getThreads();
  return list.map((t) => ({ id: t.id }));
}

export default async function ThreadPage({ params }: { params: Params }) {
  const { id } = await params;
  const thread = await getThread(id);
  if (!thread) notFound();

  const person = await getExpertById(thread.expertId);
  if (!person) notFound();

  // Resolve and format everything here so the client component stays a pure
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
            status: message.booking.status,
          }
        : undefined,
    })),
  );

  // Everything the shopping drawer can offer. It stays hidden in the UI until
  // the teacher actually shares a link — see GearDrawer.
  const [gearItems, demo] = await Promise.all([
    getGearForCategories(person.categories, 8),
    getDemoScript(thread.id),
  ]);

  return (
    <Conversation
      partner={{
        name: person.name,
        initials: person.initials,
        tone: person.tone,
        slug: person.slug,
        skill: thread.skill,
        hourlyRate: person.hourlyRate,
      }}
      initialMessages={items}
      gearItems={gearItems}
      demo={demo}
    />
  );
}
