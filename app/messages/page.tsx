import { messages as copy } from "@/content";
import { getThreads } from "@/lib/data";
import { ButtonLink } from "@/components/ui/Button";
import { ThreadView } from "@/components/messages/ThreadView";

/**
 * The inbox landing page.
 *
 * On a wide screen it opens the most recent conversation rather than showing
 * an empty pane — there's no reason to make someone click again when there's
 * an obvious thing to show. On a narrow screen the shell hides this and shows
 * the thread list instead. The empty state only appears when there genuinely
 * are no conversations.
 */
export default async function MessagesIndexPage() {
  const threads = await getThreads();
  const newest = threads[0];

  if (newest) return <ThreadView id={newest.id} />;

  return (
    <div className="grid flex-1 place-items-center bg-cream/50 p-10 text-center">
      <div className="max-w-sm">
        <h2 className="display text-3xl">{copy.inbox.emptyTitle}</h2>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
          {copy.inbox.emptyBody}
        </p>
        <ButtonLink href={copy.inbox.emptyCta.href} className="mt-6">
          {copy.inbox.emptyCta.label}
        </ButtonLink>
      </div>
    </div>
  );
}
