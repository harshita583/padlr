"use client";

import { useEffect, useId, useRef, useState } from "react";
import { brand, messages as copy } from "@/content";
import { Button } from "@/components/ui/Button";
import { Motif } from "@/components/ui/Motif";
import { motifFor } from "@/lib/utils";

const share = copy.shareDialog;

/**
 * Sharing a confirmed lesson.
 *
 * The safety rule is in the data, not just the copy: this component is only
 * ever handed a skill and an optional when. It has no access to the address or
 * the teacher's surname, so neither can leak into a public post even by
 * accident. Date and time are opt-in and off by default, because a post saying
 * where you'll be and when is a different thing from a post saying what you're
 * learning.
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
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [includeWhen, setIncludeWhen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [origin, setOrigin] = useState("");

  // Both of these read the browser, so they wait for mount — checking them
  // during render would make the server and client markup disagree.
  useEffect(() => {
    setCanNativeShare(typeof navigator !== "undefined" && "share" in navigator);
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    if (open) setCopied(false);
  }, [open]);

  const text = share.textFor(skill.toLowerCase(), includeWhen ? when : "");
  const url = origin || "";
  const full = url ? `${text} ${url}` : text;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
    } catch {
      // Clipboard can be blocked by permissions; the text is on screen and
      // selectable either way, so this fails quietly rather than alarming.
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title: brand.name, text, url: url || undefined });
    } catch {
      // The user dismissed the sheet. Not an error.
    }
  }

  const targets = [
    {
      key: "x",
      label: share.targets.x,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}${
        url ? `&url=${encodeURIComponent(url)}` : ""
      }`,
    },
    {
      key: "whatsapp",
      label: share.targets.whatsapp,
      href: `https://wa.me/?text=${encodeURIComponent(full)}`,
    },
    {
      key: "facebook",
      label: share.targets.facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="flex max-h-[85dvh] flex-col overflow-hidden rounded-[var(--radius-card)] bg-paper shadow-[var(--shadow-lift)]">
        <div className="flex items-start justify-between gap-4 p-6 pb-0 sm:p-8 sm:pb-0">
          <div>
            <h2 id={`${id}-title`} className="display text-3xl">
              {share.title}
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">
              {share.intro}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/8 text-sm transition-colors hover:bg-ink/15"
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">{share.closeLabel}</span>
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6 pt-6 sm:px-8">
          {/* The card people will actually see. */}
          <figure>
            <figcaption className="mb-2 text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
              {share.previewLabel}
            </figcaption>
            <div className="relative overflow-hidden rounded-[var(--radius-tile)] bg-forest p-7 text-paper">
              <Motif variant={motifFor(skill)} opacity={0.1} />
              <p className="display relative text-[1.75rem] leading-tight">{text}</p>
              <p className="relative mt-4 text-[0.8125rem] font-semibold text-lemon">
                {brand.name}
              </p>
            </div>
          </figure>

          <div className="rounded-2xl bg-cream p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={includeWhen}
                onChange={(e) => setIncludeWhen(e.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-forest"
              />
              <span>
                <span className="block text-[0.9375rem] font-semibold">
                  {share.includeWhen}
                </span>
                <span className="mt-1 block text-[0.8125rem] leading-relaxed text-ink-soft">
                  {share.includeWhenHint}
                </span>
              </span>
            </label>
            <p className="mt-3 border-t border-ink/10 pt-3 text-[0.75rem] text-ink-faint">
              {share.neverShared}
            </p>
          </div>

          <div>
            <h3 className="text-[0.8125rem] font-semibold">{share.targetsLabel}</h3>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {canNativeShare ? (
                <Button type="button" size="sm" onClick={nativeShare}>
                  {share.nativeShare}
                </Button>
              ) : null}
              {targets.map((target) => (
                <a
                  key={target.key}
                  href={target.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border-2 border-ink/12 px-4 py-2 text-sm font-semibold transition-colors hover:border-ink/35"
                >
                  {target.label}
                </a>
              ))}
              <button
                type="button"
                onClick={copyText}
                className="rounded-full border-2 border-ink/12 px-4 py-2 text-sm font-semibold transition-colors hover:border-ink/35"
              >
                {copied ? share.copied : share.copy}
              </button>
            </div>
            <p aria-live="polite" className="sr-only">
              {copied ? share.copied : ""}
            </p>
          </div>
        </div>

        <div className="shrink-0 border-t border-ink/10 p-6 sm:px-8">
          <div className="flex justify-end">
            <Button type="button" variant="ghost" size="lg" onClick={onClose}>
              {share.close}
            </Button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
