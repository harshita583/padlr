"use client";

import { useEffect, useState } from "react";
import { messages as copy } from "@/content";
import { ShareSheet } from "@/components/share/ShareSheet";

const share = copy.shareDialog;

/**
 * Sharing a confirmed lesson.
 *
 * The safety rule is enforced by the props, not the wording: this component is
 * only ever handed a skill and an optional `when`. It has no access to the
 * address or the teacher's surname, so neither can reach a public post even by
 * accident. Date and time are opt-in and off by default, because "I'm learning
 * sourdough" and "I'll be at this address on Saturday at nine" are different
 * posts, and the second one is somebody else's safety.
 */
export function ShareDialog({
  open,
  onClose,
  skill,
  when,
}: {
  open: boolean;
  onClose: () => void;
  /** e.g. "sourdough". Lowercased into the sentence. */
  skill: string;
  /** e.g. "on Sat 22 Aug at 9:00 AM". Only used if the learner opts in. */
  when: string;
}) {
  const [includeWhen, setIncludeWhen] = useState(false);

  // Opting in is a per-share decision, not a preference — reset every time.
  useEffect(() => {
    if (open) setIncludeWhen(false);
  }, [open]);

  return (
    <ShareSheet
      open={open}
      onClose={onClose}
      title={share.title}
      intro={share.intro}
      text={share.textFor(skill.toLowerCase(), includeWhen ? when : "")}
      motifSeed={skill}
    >
      <div className="rounded-2xl bg-cream p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={includeWhen}
            onChange={(e) => setIncludeWhen(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-forest"
          />
          <span>
            <span className="block text-[0.9375rem] font-semibold">{share.includeWhen}</span>
            <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ink-soft">
              {share.includeWhenHint}
            </span>
          </span>
        </label>
        <p className="mt-3 border-t border-ink/10 pt-3 text-[0.75rem] text-ink-faint">
          {share.neverShared}
        </p>
      </div>
    </ShareSheet>
  );
}
