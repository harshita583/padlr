/**
 * Every user-facing string in the app.
 *
 *   import { copy } from "@/content";
 *   copy.home.hero.body
 *
 * Rules of the road:
 *  - No component should contain a hard-coded sentence. If you find one, move
 *    it here.
 *  - Strings that change with data are functions, e.g. `spotsLeft(3)`.
 *  - Accessible names (aria-label, alt text, screen-reader-only text) live here
 *    too, under `a11y` keys, so they get translated and reviewed like anything
 *    else.
 */

import { brand, nav, footer } from "./brand";
import { common } from "./common";
import { home } from "./home";
import { discover } from "./discover";
import { expert } from "./expert";
import { events } from "./events";
import { messages } from "./messages";
import { circles } from "./circles";
import { teach } from "./teach";
import { join } from "./join";
import { profile } from "./profile";
import { waitlist } from "./waitlist";

export const copy = {
  brand,
  nav,
  footer,
  common,
  home,
  discover,
  expert,
  events,
  messages,
  circles,
  teach,
  join,
  profile,
  waitlist,
} as const;

export type Copy = typeof copy;

export {
  brand,
  nav,
  footer,
  common,
  home,
  discover,
  expert,
  events,
  messages,
  circles,
  teach,
  join,
  profile,
  waitlist,
};
