"use client";

import { waitlist as copy } from "@/content";
import { OPEN_WAITLIST_EVENT } from "./WaitlistPopup";

/**
 * The way back in for anyone who closed the popup without joining. It talks
 * to <WaitlistPopup> (mounted once, in the root layout) purely through a
 * window event — same cross-component pattern as the profile and circles
 * stores use — so this link works from every page, not just wherever the
 * dialog happens to live.
 */
export function WaitlistReopenLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_WAITLIST_EVENT))}
      className={className}
    >
      {copy.footerCta}
    </button>
  );
}
