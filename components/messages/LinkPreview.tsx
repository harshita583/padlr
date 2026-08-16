import type { GearItem } from "@/lib/types";
import { common, messages as copy } from "@/content";
import { cn, toneSurface } from "@/lib/utils";

/**
 * The rich preview a shared link unfurls into.
 *
 * A teacher pastes a URL; the learner sees what the thing actually is —
 * picture, shop, price and a line about why it was recommended — rather than a
 * bare link they have to trust. The affiliate disclosure sits on the card
 * itself, at the moment of the decision, not in a footnote somewhere.
 */
export function LinkPreview({
  item,
  sender,
  time,
  note,
}: {
  item: GearItem;
  sender: string;
  /** Pre-formatted timestamp. */
  time: string;
  /** The teacher's own line about why they sent it. */
  note?: string;
}) {
  const domain = hostnameOf(item.url);

  return (
    <div className="max-w-[19rem]">
      {note ? (
        <p className="mb-1.5 rounded-3xl rounded-bl-lg bg-paper px-4 py-2.5 text-[0.9375rem] leading-relaxed text-ink shadow-[0_1px_2px_rgb(20_24_12/0.06)]">
          {note}
        </p>
      ) : null}

      <figure
        aria-label={copy.productCard.a11yLabel(sender, item.name, item.vendor, item.price)}
        className="overflow-hidden rounded-3xl rounded-bl-lg bg-paper shadow-[var(--shadow-lift)]"
      >
        <div className={cn("relative grid h-32 place-items-center", toneSurface[item.tone])}>
          <span aria-hidden="true" className="text-5xl drop-shadow-sm">
            {item.emoji}
          </span>
          <span className="tabular absolute right-3 bottom-3 rounded-full bg-paper px-3 py-1 text-sm font-bold text-ink shadow-sm">
            {item.price}
          </span>
          {item.sponsored ? (
            <span className="absolute top-3 left-3 rounded-full bg-paper/90 px-2 py-0.5 text-[0.625rem] font-bold tracking-wide text-ink uppercase">
              {copy.gearDrawer.sponsoredBadge}
            </span>
          ) : null}
        </div>

        <figcaption className="p-4">
          <p className="flex items-center gap-1.5 text-[0.625rem] font-bold tracking-[0.14em] text-ink-faint uppercase">
            <span aria-hidden="true">🔗</span>
            {domain}
          </p>

          <p className="mt-2 leading-snug font-bold">{item.name}</p>
          <p className="mt-1 text-[0.8125rem] leading-snug text-ink-soft">{item.blurb}</p>

          <div className="mt-3.5 flex items-center justify-between gap-3">
            <span className="text-[0.8125rem] font-semibold text-ink-soft">{item.vendor}</span>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer noopener sponsored"
              className="rounded-full bg-forest px-4 py-1.5 text-[0.8125rem] font-semibold text-paper transition-colors hover:bg-olive"
            >
              {copy.productCard.viewItem}
              <span className="sr-only">
                {" "}
                — {item.name}, {common.a11y.externalLink}
              </span>
            </a>
          </div>

          {item.affiliate ? (
            <p className="mt-3.5 flex items-start gap-2 border-t border-ink/10 pt-3 text-[0.6875rem] leading-relaxed text-ink-faint">
              <span className="shrink-0 rounded-full bg-ink/8 px-2 py-0.5 text-[0.5625rem] font-bold tracking-wide uppercase">
                {copy.productCard.disclosure}
              </span>
              {common.disclosure.inChat}
            </p>
          ) : null}
        </figcaption>
      </figure>

      <p className="tabular mt-1 text-[0.6875rem] text-ink-faint">{time}</p>
    </div>
  );
}

/** "example.com" from a URL, falling back to the raw string if it won't parse. */
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
