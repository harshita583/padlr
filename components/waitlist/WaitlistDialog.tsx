"use client";

import { useEffect, useId, useRef } from "react";
import { waitlist as copy } from "@/content";
import { Motif } from "@/components/ui/Motif";
import { WaitlistForm } from "./WaitlistForm";

/**
 * The waitlist ask, in a native <dialog> — same overlay chrome (backdrop,
 * focus trap, Escape-to-close) as every other dialog in the app, just with a
 * colour band up top instead of the usual plain header, since this one's
 * meant to catch the eye rather than complete a task.
 */
export function WaitlistDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="overflow-hidden rounded-[var(--radius-card)] bg-paper text-left shadow-[var(--shadow-lift)]">
        <div className="relative overflow-hidden bg-coral px-6 pt-6 pb-8 sm:px-8 sm:pt-8">
          <Motif variant="waves" className="text-ink" opacity={0.14} />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 grid size-9 place-items-center rounded-full bg-paper/70 text-sm transition-colors hover:bg-paper"
          >
            <span aria-hidden="true">✕</span>
            <span className="sr-only">{copy.closeLabel}</span>
          </button>

          <p className="relative text-[0.6875rem] font-bold tracking-[0.18em] text-ink/60 uppercase">
            {copy.eyebrow}
          </p>
          <h2 id={`${id}-title`} className="display relative mt-2 text-3xl text-ink">
            {copy.title}
          </h2>
          <p className="relative mt-2 max-w-[26rem] text-[0.9375rem] leading-relaxed text-ink/75">
            {copy.body}
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <WaitlistForm />
        </div>
      </div>
    </dialog>
  );
}
