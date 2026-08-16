import { notFound, redirect } from "next/navigation";
import {
  getExpert,
  getExperts,
  getGearForCategories,
  getThreads,
} from "@/lib/data";
import {
  formatDayNumber,
  formatDayShort,
  formatMonthShort,
  formatTime,
} from "@/lib/date";
import type { BookableDay } from "@/lib/types";
import { DirectThread } from "@/components/messages/DirectThread";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const experts = await getExperts();
  return experts.map((e) => ({ slug: e.slug }));
}

/**
 * Message any teacher, whether or not there's already a conversation.
 *
 * Resolved on the server from the teacher's own record, so the rate, the open
 * times and the kit in the drawer are the real ones rather than a copy that
 * can drift.
 */
export default async function MessageTeacherPage({ params }: { params: Params }) {
  const { slug } = await params;
  const person = await getExpert(slug);
  if (!person) notFound();

  // If a conversation with them already exists, that's the conversation —
  // opening a second one from their profile would split the history.
  const threads = await getThreads();
  const existing = threads.find((t) => t.expertId === person.id);
  if (existing) redirect(`/messages/${existing.id}`);

  const gearItems = await getGearForCategories(person.categories, 8);

  const days: BookableDay[] = person.availability.map((day) => ({
    date: day.date,
    dayShort: formatDayShort(day.date),
    dayNumber: formatDayNumber(day.date),
    month: formatMonthShort(day.date),
    slots: day.slots.map((s) => ({ value: s, label: formatTime(s) })),
  }));

  return (
    <DirectThread
      partner={{
        name: person.name,
        initials: person.initials,
        tone: person.tone,
        slug: person.slug,
        skill: person.skills[0] ?? "",
        hourlyRate: person.hourlyRate,
        groupUplift: person.groupUplift,
        categorySlug: person.categories[0] ?? "",
      }}
      gearItems={gearItems}
      days={days}
    />
  );
}
