import type { Metadata } from "next";
import { messages as copy } from "@/content";
import { getExpertById, getThreads } from "@/lib/data";
import { formatRelativeDay, formatTime } from "@/lib/date";
import { MessagesShell } from "@/components/messages/MessagesShell";
import type { ThreadSummary } from "@/components/messages/ThreadList";

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

/** One-line preview of whatever the last message was. */
function previewOf(kind: string, body: string | undefined): string {
  if (kind === "product") return "📎 Shared a shopping link";
  if (kind === "booking") return "📅 Lesson request";
  return body ?? "";
}

export default async function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const threads = await getThreads();

  const summaries: ThreadSummary[] = await Promise.all(
    threads.map(async (thread) => {
      const person = await getExpertById(thread.expertId);
      const last = thread.messages[thread.messages.length - 1];
      const relative = formatRelativeDay(thread.lastActivity);
      return {
        id: thread.id,
        name: person?.name ?? "Teacher",
        initials: person?.initials ?? "??",
        tone: person?.tone ?? "sage",
        skill: thread.skill,
        preview: previewOf(last.kind, last.body),
        time: relative === "Today" ? formatTime(thread.lastActivity) : relative,
        unread: thread.unread,
      };
    }),
  );

  return <MessagesShell threads={summaries}>{children}</MessagesShell>;
}
