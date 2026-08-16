"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { messages as copy } from "@/content";
import { Avatar } from "@/components/ui/Primitives";
import { cn } from "@/lib/utils";

/** Pre-formatted on the server so the timestamps don't shift on hydration. */
export interface ThreadSummary {
  id: string;
  name: string;
  initials: string;
  tone: "lemon" | "sage" | "sky" | "lilac" | "coral" | "olive" | "cream";
  skill: string;
  preview: string;
  time: string;
  unread: number;
}

export function ThreadList({ threads }: { threads: ThreadSummary[] }) {
  const pathname = usePathname();

  return (
    <ul aria-label={copy.inbox.listLabel} className="flex flex-col">
      {threads.map((thread) => {
        const active = pathname === `/messages/${thread.id}`;
        return (
          <li key={thread.id}>
            <Link
              href={`/messages/${thread.id}`}
              aria-current={active ? "page" : undefined}
              aria-label={copy.inbox.openConversation(thread.name)}
              className={cn(
                "flex gap-3 border-b border-ink/8 px-4 py-4 transition-colors",
                active ? "bg-sage-wash" : "hover:bg-ink/4",
              )}
            >
              <Avatar
                initials={thread.initials}
                name={thread.name}
                tone={thread.tone}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-bold">{thread.name}</p>
                  <span className="tabular shrink-0 text-xs text-ink-faint">{thread.time}</span>
                </div>
                <p className="text-xs font-semibold text-ink-faint">{thread.skill}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-snug text-ink-soft">
                  {thread.preview}
                </p>
              </div>
              {thread.unread > 0 ? (
                <span className="mt-1 grid size-5 shrink-0 place-items-center self-start rounded-full bg-coral text-[0.625rem] font-bold text-paper">
                  <span aria-hidden="true">{thread.unread}</span>
                  <span className="sr-only">{copy.inbox.unreadLabel(thread.unread)}</span>
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
