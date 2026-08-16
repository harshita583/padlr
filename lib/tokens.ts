/**
 * Design tokens in plain TypeScript.
 *
 * `app/globals.css` is the source of truth for the web app. This file mirrors
 * the same values so the future React Native / Expo app can import them
 * directly. If you change a colour, change it in both places.
 */

export const palette = {
  paper: "#FFFDF7",
  cream: "#F7F2E8",
  clay: "#E7DED0",

  ink: "#14180C",
  inkSoft: "#4A5140",
  inkFaint: "#7A8271",

  olive: "#232B14",
  oliveSoft: "#3A4622",
  sage: "#A9C185",
  sageDeep: "#7D9A58",
  sageWash: "#DFE8D0",
  forest: "#143A22",

  lemon: "#EFE04C",
  lemonSoft: "#F7F0A6",
  sky: "#C6D2F7",
  skyDeep: "#4A63C8",
  coral: "#E4633C",
  lilac: "#E6D8F6",
} as const;

export const radii = {
  tile: 20,
  card: 28,
  slab: 36,
  pill: 999,
} as const;

export const spacing = {
  gutter: 20,
  section: 96,
} as const;

export type PaletteKey = keyof typeof palette;
