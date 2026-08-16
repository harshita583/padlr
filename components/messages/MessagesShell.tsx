"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { messages as copy } from "@/content";
import { CIRCLES_EVENT, circleInitials, readCircles } from "@/lib/circlesStore";
import { CONTACTS_EVENT, readContacts } from "@/lib/contactsStore";
import { formatRelativeDay, formatTime } from "@/lib/date";
import { ThreadList, type ThreadSummary } from "./ThreadList";
import { Container } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

/**
 * Two-pane inbox. On small screens only one pane is shown at a time — the list
 * at /messages, the conversation at /messages/[id] — which is what the mobile
 * app will do too.
 */
export function MessagesShell({
  threads,
  children,
}: {
  threads: ThreadSummary[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  const inThread = pathname !== "/messages";
  // On /messages the newest seeded thread is the one on screen, so it's the one
  // that should read as current — circles don't change that.
  const activeId = inThread ? undefined : threads[0]?.id;

  // The inbox is a fixed-height, app-like screen, so it should never open
  // part-scrolled. Arriving from somewhere further down a long page (the
  // circles list, say) otherwise leaves the card clipped under the header.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  // Circles live in localStorage, which the server can't see, so they're merged
  // in after mount. Newest first, above the seeded conversations.
  const [circleThreads, setCircleThreads] = useState<ThreadSummary[]>([]);

  useEffect(() => {
    const read = () =>
      setCircleThreads(
        readCircles().map((circle) => {
          const relative = formatRelativeDay(circle.createdAt);
          return {
            id: circle.id,
            name: circle.teacherName,
            initials: circleInitials(circle),
            tone: circle.tone,
            skill: circle.title,
            preview: copy.inbox.circlePreview[circle.status],
            time: relative === "Today" ? formatTime(circle.createdAt) : relative,
            unread: 0,
          };
        }),
      );
    read();
    window.addEventListener(CIRCLES_EVENT, read);
    return () => window.removeEventListener(CIRCLES_EVENT, read);
  }, []);

  // Conversations you've started from a teacher's profile. Same reason as
  // above: the server has no way of knowing about them.
  const [contactThreads, setContactThreads] = useState<ThreadSummary[]>([]);

  useEffect(() => {
    const read = () =>
      setContactThreads(
        readContacts().map((contact) => {
          const relative = formatRelativeDay(contact.startedAt);
          return {
            id: `with/${contact.slug}`,
            name: contact.name,
            initials: contact.initials,
            tone: contact.tone,
            skill: contact.skill,
            preview: contact.lastLine || copy.inbox.contactPreview,
            time: relative === "Today" ? formatTime(contact.startedAt) : relative,
            unread: 0,
          };
        }),
      );
    read();
    window.addEventListener(CONTACTS_EVENT, read);
    return () => window.removeEventListener(CONTACTS_EVENT, read);
  }, []);

  return (
    <Container className="py-6 sm:py-10">
      {/* A fixed height at every breakpoint, so the message log scrolls inside
          the card and the composer stays put instead of drifting down the
          page. min-h keeps it usable on short laptop screens. */}
      <div className="grid h-[calc(100dvh-7.5rem)] min-h-[32rem] overflow-hidden rounded-[var(--radius-card)] border border-ink/8 bg-paper sm:h-[calc(100dvh-9.5rem)] lg:grid-cols-[21rem_1fr]">
        <div
          className={cn(
            "flex min-h-0 min-w-0 flex-col border-ink/8 lg:border-r",
            inThread && "hidden lg:flex",
          )}
        >
          <div className="border-b border-ink/8 px-4 py-4">
            <h1 className="display text-2xl">{copy.inbox.title}</h1>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ThreadList
              threads={[...circleThreads, ...contactThreads, ...threads]}
              activeId={activeId}
            />
          </div>
        </div>

        {/* min-w-0 matters: without it the 1fr track grows to fit the widest
            child and the conversation spills past the card edge. */}
        <div className={cn("flex min-h-0 min-w-0 flex-col", !inThread && "hidden lg:flex")}>
          {children}
        </div>
      </div>
    </Container>
  );
}
