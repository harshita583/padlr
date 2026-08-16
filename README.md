# Padlr

A marketplace for learning a skill from someone nearby. Search a skill and a
location, find local teachers, book them by the hour, message them, join the
classes they host, or learn together with friends at a group rate.

Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind v4.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build — run this before pushing
npm start        # serve the production build
npm run lint
```

## Where things live

```
app/            One folder per route.
  page.tsx        Home
  discover/       Search results, filters, gear sidebar
  experts/[slug]/ Teacher profile + hourly booking panel
  events/         Class listings and detail pages
  messages/       Inbox and conversations
  circles/        Group learning and group pricing
  teach/          Teacher-side landing page + earnings calculator

content/        Every user-facing string in the app.  ← edit copy here
components/     UI, split by surface (home/, search/, messages/, cards/, ui/)
lib/
  types.ts        Domain types
  data/           Mock data + the async repository the UI calls
  tokens.ts       Design tokens as TS, for the future React Native app
  date.ts         Date and money formatting
app/globals.css Design tokens (colour, type, shape) as CSS variables
```

## Changing the copy

Every headline, button label, empty state and screen-reader string lives in
`content/`, one file per surface. No component contains a hard-coded sentence.

```ts
// content/home.ts
hero: {
  headlineLines: ["Someone nearby", "already knows"],
  headlineAccent: "how.",
  ...
}
```

Strings that depend on data are functions, e.g. `spotsLeft(3)` → `"3 spots left"`.
Accessible names (`aria-label`, alt text, screen-reader-only text) live under
`a11y` keys in the same files, so they get reviewed and translated like any
other copy.

To rename the product, change `brand.name` in `content/brand.ts` — it updates
the header, page titles, footer and metadata.

## Changing the look

Colours, fonts, radii and shadows are CSS custom properties in the `@theme`
block at the top of `app/globals.css`. Change a value there and it propagates
everywhere. `lib/tokens.ts` mirrors the same values in TypeScript for the
eventual mobile app — if you change one, change both.

## Data

The app currently runs on typed mock data in `lib/data/`. Every component calls
the async functions exported from `lib/data/index.ts` (`searchExperts`,
`getEvents`, `getThread`, …), never the arrays directly.

That's deliberate: to move to a real database, reimplement those functions
against your queries. The return types stay the same, so no component changes.

Not yet real — these are the pieces to build when you add a backend:

- Auth and user accounts
- Persistent bookings (`BookingPanel` acknowledges the request locally)
- Real-time messaging (the composer appends to local state)
- Payments and teacher payouts
- Geocoding for the location field (it currently reads coordinates, unresolved)

## Accessibility

Load-bearing, not decorative. When editing:

- Keep the visible `<label>` on every form control. Placeholders are hints.
- Never remove the `:focus-visible` outline in `globals.css`.
- Decorative emoji get `aria-hidden="true"`; meaningful ones get a text label.
- Headings step down one level at a time. Pick a level for structure, size with
  a class.
- Commercial links must keep their affiliate/sponsored disclosure.

## Deployment

Deploys to Vercel from the `main` branch. Pushing to `main` deploys to
production; any other branch gets a preview URL.
