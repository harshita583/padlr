"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { messages as copy } from "@/content";
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
            <ThreadList threads={threads} />
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
