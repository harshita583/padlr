"use client";

import { useEffect, useState } from "react";
import { WaitlistDialog } from "./WaitlistDialog";

const SEEN_KEY = "padlr:waitlist-popup-seen";
/** Long enough that it doesn't feel like an ad interrupting the page load. */
const DELAY_MS = 1600;

/** Anything can call this to reopen the dialog — see the footer link. */
export const OPEN_WAITLIST_EVENT = "padlr:open-waitlist";

/**
 * Shows the waitlist dialog once per browser, a beat after whatever page
 * they land on first finishes loading — not instantly, so it doesn't read as
 * a page takeover before anyone's seen what the site even is. Mounted once in
 * the root layout rather than only on the homepage, so it still fires for
 * someone whose first visit is a shared link straight to an expert or event.
 *
 * "Once" means once ever, not once per visit: closing it (or joining) marks
 * it seen, and it won't auto-open again. The footer keeps a small link that
 * reopens the same dialog on purpose, for anyone who changes their mind.
 */
export function WaitlistPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "true";
    } catch {
      // Storage can be blocked; treat it as unseen rather than crash.
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    if (!seen) {
      timer = setTimeout(() => {
        setOpen(true);
        try {
          window.localStorage.setItem(SEEN_KEY, "true");
        } catch {
          // Nothing to fall back to — worst case it can show again next visit.
        }
      }, DELAY_MS);
    }

    const openManually = () => setOpen(true);
    window.addEventListener(OPEN_WAITLIST_EVENT, openManually);

    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(OPEN_WAITLIST_EVENT, openManually);
    };
  }, []);

  return <WaitlistDialog open={open} onClose={() => setOpen(false)} />;
}
