"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { brand, common } from "@/content";
import { Button } from "@/components/ui/Button";
import { Motif } from "@/components/ui/Motif";
import { motifFor } from "@/lib/utils";

const share = common.share;

/**
 * The share overlay, used for lessons and for badges.
 *
 * It only ever receives the finished sentence. Callers decide what's safe to
 * put in it — see ShareDialog, which deliberately never passes an address.
 */
export function ShareSheet({
  open,
  onClose,
  title,
  intro,
  text,
  motifSeed,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  intro: string;
  /** The exact text that gets posted. Shown in the preview verbatim. */
  text: string;
  /** Picks the background pattern on the preview card. */
  motifSeed: string;
  /** Optional extras between the preview and the share targets. */
  children?: ReactNode;
}) {
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [origin, setOrigin] = useState("");

  // Both read the browser, so they wait for mount — checking during render
  // would make the server and client markup disagree.
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

  const url = origin;
  const full = url ? `${text} ${url}` : text;

  async function copyText() {
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
    } catch {
      // Clipboard can be blocked by permissions. The text is on screen and
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
      <div className="flex max-h-[85dvh] flex-col overflow-hidden rounded-[var(--radius-card)] bg-paper text-left shadow-[var(--shadow-lift)]">
        <div className="flex items-start justify-between gap-4 p-6 pb-0 sm:p-8 sm:pb-0">
          <div>
            <h2 id={`${id}-title`} className="display text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-soft">{intro}</p>
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

        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-6 sm:px-8">
          <figure>
            <figcaption className="mb-2 text-[0.6875rem] font-bold tracking-[0.16em] text-ink-faint uppercase">
              {share.previewLabel}
            </figcaption>
            <div className="relative overflow-hidden rounded-[var(--radius-tile)] bg-forest p-7 text-paper">
              <Motif variant={motifFor(motifSeed)} opacity={0.1} />
              <p className="display relative text-[1.75rem] leading-tight">{text}</p>
              <p className="relative mt-4 text-[0.8125rem] font-semibold text-lemon">
                {brand.name}
              </p>
            </div>
          </figure>

          {children}

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
