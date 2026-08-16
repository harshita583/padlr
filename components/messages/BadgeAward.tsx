"use client";

import { useState } from "react";
import Link from "next/link";
import { profile as copy } from "@/content";
import { badgeDefs } from "@/lib/badges";
import { ShareSheet } from "@/components/share/ShareSheet";
import { Motif } from "@/components/ui/Motif";
import { cn, motifFor, toneSurface } from "@/lib/utils";

type BadgeCopyKey = keyof typeof copy.badgeCopy;

/**
 * The badge that drops into a conversation when a lesson is confirmed.
 *
 * Centred rather than left or right aligned, because it isn't from either
 * person — it's the app noting something happened.
 */
export function BadgeAward({ badgeId }: { badgeId: string }) {
  const [sharing, setSharing] = useState(false);
  const def = badgeDefs.find((b) => b.id === badgeId);
  const text = copy.badgeCopy[badgeId as BadgeCopyKey];
  if (!def || !text) return null;

  return (
    <div className="w-[18rem] rounded-3xl border border-ink/10 bg-paper p-5 text-center shadow-[var(--shadow-lift)]">
      <p className="text-[0.625rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
        {copy.award.label}
      </p>

      <div
        className={cn(
          "relative mx-auto mt-3 grid size-16 place-items-center overflow-hidden rounded-2xl",
          toneSurface[def.tone],
        )}
      >
        <Motif variant={motifFor(def.id)} opacity={0.3} />
        <span aria-hidden="true" className="display relative text-2xl">
          {text.name.slice(0, 1)}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-bold">{text.name}</h3>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-soft">{text.blurb}</p>

      <button
        type="button"
        onClick={() => setSharing(true)}
        className="mt-4 w-full rounded-full bg-forest px-3 py-2 text-[0.8125rem] font-semibold text-paper transition-colors hover:bg-olive"
      >
        {copy.award.shareAction}
      </button>
      <Link
        href="/profile"
        className="mt-2 inline-block text-[0.75rem] font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 hover:decoration-forest"
      >
        {copy.award.viewAll}
      </Link>

      <ShareSheet
        open={sharing}
        onClose={() => setSharing(false)}
        title={text.name}
        intro={text.blurb}
        text={text.share}
        motifSeed={def.id}
      />
    </div>
  );
}
