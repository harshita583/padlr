import { messages as copy } from "@/content";
import { ButtonLink } from "@/components/ui/Button";

/**
 * The empty pane shown beside the inbox on large screens. On small screens the
 * shell hides this and shows the thread list instead.
 */
export default function MessagesIndexPage() {
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
