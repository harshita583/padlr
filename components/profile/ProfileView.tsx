"use client";

import { useEffect, useState } from "react";
import { profile as copy } from "@/content";
import { badgeDefs, earnedBadges, isEarned, nextLessonBadge, type BadgeDef } from "@/lib/badges";
import {
  PROFILE_EVENT,
  clearProfile,
  displayName,
  initialsOf,
  readProfile,
  type Profile,
} from "@/lib/profile";
import { Avatar } from "@/components/ui/Primitives";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ShareSheet } from "@/components/share/ShareSheet";
import { Motif } from "@/components/ui/Motif";
import { cn, motifFor, toneSurface } from "@/lib/utils";

type BadgeCopyKey = keyof typeof copy.badgeCopy;

export function ProfileView() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showLocked, setShowLocked] = useState(false);
  const [sharing, setSharing] = useState<BadgeDef | null>(null);

  useEffect(() => {
    setMounted(true);
    const read = () => setProfile(readProfile());
    read();
    window.addEventListener(PROFILE_EVENT, read);
    return () => window.removeEventListener(PROFILE_EVENT, read);
  }, []);

  // localStorage is invisible to the server, so render nothing until mount
  // rather than flashing the wrong state.
  if (!mounted) return <div className="min-h-[24rem]" />;

  if (!profile) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-ink/20 p-12 text-center">
        <h2 className="display text-3xl">{copy.empty.title}</h2>
        <p className="mx-auto mt-3 max-w-sm text-[0.9375rem] leading-relaxed text-ink-soft">
          {copy.empty.body}
        </p>
        <ButtonLink href={copy.empty.cta.href} size="lg" className="mt-6">
          {copy.empty.cta.label}
        </ButtonLink>
      </div>
    );
  }

  const earned = earnedBadges(profile.stats);
  const locked = badgeDefs.filter((d) => !isEarned(d, profile.stats));
  const next = nextLessonBadge(profile.stats);
  const sharingCopy = sharing ? copy.badgeCopy[sharing.id as BadgeCopyKey] : null;

  return (
    <div className="flex flex-col gap-4">
      {/* Identity */}
      <div className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar
            initials={initialsOf(profile)}
            name={displayName(profile)}
            tone="sage"
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <h1 className="display text-4xl">{displayName(profile)}</h1>
            <p className="mt-1 text-[0.9375rem] text-ink-soft">{profile.neighbourhood}</p>
            <p
              className={cn(
                "mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold",
                profile.idVerified ? "bg-sage-wash text-forest" : "bg-ink/8 text-ink-faint",
              )}
            >
              {profile.idVerified ? copy.header.verified : copy.header.unverified}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <ButtonLink href="/join" variant="outline" size="sm">
              {copy.header.editLabel}
            </ButtonLink>
            <Button variant="ghost" size="sm" onClick={() => clearProfile()}>
              {copy.header.signOut}
            </Button>
          </div>
        </div>

        {profile.bio ? (
          <p className="mt-6 border-t border-ink/10 pt-6 text-[1.0625rem] leading-relaxed text-ink-soft">
            {profile.bio}
          </p>
        ) : null}
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: copy.stats.lessons, value: profile.stats.lessons },
          { label: copy.stats.categories, value: profile.stats.categories.length },
          { label: copy.stats.groupLessons, value: profile.stats.groupLessons },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6"
          >
            <p className="tabular text-4xl font-bold tracking-tight">{stat.value}</p>
            <p className="mt-1 text-[0.9375rem] text-ink-soft">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Badges */}
      <section
        aria-labelledby="badges-heading"
        className="rounded-[var(--radius-card)] border border-ink/8 bg-paper p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="badges-heading" className="display text-3xl">
              {copy.badges.title}
            </h2>
            <p className="mt-1.5 text-[0.9375rem] text-ink-soft">{copy.badges.body}</p>
          </div>
          {next ? (
            <p className="text-sm font-semibold text-forest">
              {copy.badges.nextUpFor(
                copy.badgeCopy[next.def.id as BadgeCopyKey].name,
                next.remaining,
              )}
            </p>
          ) : null}
        </div>

        {earned.length > 0 ? (
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {earned.map((def) => (
              <li key={def.id}>
                <BadgeTile def={def} onShare={() => setSharing(def)} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-[var(--radius-tile)] border border-dashed border-ink/20 p-8 text-center">
            <p className="font-semibold">{copy.badges.emptyTitle}</p>
            <p className="mt-1 text-sm text-ink-soft">{copy.badges.emptyBody}</p>
          </div>
        )}

        {locked.length > 0 ? (
          <div className="mt-6 border-t border-ink/10 pt-5">
            <button
              type="button"
              onClick={() => setShowLocked((v) => !v)}
              aria-expanded={showLocked}
              className="text-sm font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4 hover:decoration-forest"
            >
              {showLocked ? copy.badges.hideLocked : copy.badges.showLocked}
            </button>
            {showLocked ? (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {locked.map((def) => (
                  <li key={def.id}>
                    <BadgeTile def={def} locked />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </section>

      {sharing && sharingCopy ? (
        <ShareSheet
          open
          onClose={() => setSharing(null)}
          title={sharingCopy.name}
          intro={sharingCopy.blurb}
          text={sharingCopy.share}
          motifSeed={sharing.id}
        />
      ) : null}
    </div>
  );
}

function BadgeTile({
  def,
  locked = false,
  onShare,
}: {
  def: BadgeDef;
  locked?: boolean;
  onShare?: () => void;
}) {
  const text = copy.badgeCopy[def.id as BadgeCopyKey];

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-[var(--radius-tile)] border p-5",
        locked ? "border-dashed border-ink/20 bg-transparent" : "border-ink/8 bg-cream",
      )}
    >
      <div
        className={cn(
          "relative grid h-16 w-16 place-items-center overflow-hidden rounded-2xl",
          locked ? "bg-ink/6" : toneSurface[def.tone],
        )}
      >
        {!locked ? <Motif variant={motifFor(def.id)} opacity={0.3} /> : null}
        <span
          aria-hidden="true"
          className={cn(
            "display relative text-2xl",
            locked && "text-ink-faint",
          )}
        >
          {text.name.slice(0, 1)}
        </span>
      </div>

      <h3 className={cn("mt-4 font-bold", locked && "text-ink-faint")}>{text.name}</h3>
      <p
        className={cn(
          "mt-1.5 text-[0.8125rem] leading-relaxed",
          locked ? "text-ink-faint" : "text-ink-soft",
        )}
      >
        {text.blurb}
      </p>

      <p className="mt-3 text-[0.625rem] font-bold tracking-[0.14em] text-ink-faint uppercase">
        {locked ? copy.badges.lockedLabel : copy.badges.earnedLabel}
      </p>

      {!locked && onShare ? (
        <button
          type="button"
          onClick={onShare}
          className="mt-3 w-full rounded-full border-2 border-forest/25 px-3 py-1.5 text-[0.8125rem] font-semibold text-forest transition-colors hover:border-forest/60"
        >
          {copy.badges.shareAction}
        </button>
      ) : null}
    </div>
  );
}
