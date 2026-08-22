# CLAUDE.md — web

Next.js 15 App Router, static export (`output: 'export'`). No server at
runtime: every route is HTML on a CDN. Plain CSS, no Tailwind, no CSS-in-JS.

## Content pipeline

```
content/cv_data.json      source of truth — HAS email + phone, never imported by a component
  ↓ scripts/build-content.mjs   (prebuild, also runs on predev)
content/cv.public.json    generated, gitignored — email + phone removed
  ↓
content/cv.ts             the only module components import CV data through
```

`cv.ts` also exports `LINKS`, `SITE` and `asset()`. Import from there rather
than reaching for the JSON directly — that indirection is what keeps contact
details out of the bundle.

Editing the CV means editing `cv_data.json` and rebuilding. Never hand-edit
`cv.public.json`.

## Paths

`asset()` prefixes `NEXT_PUBLIC_BASE_PATH`. It is a no-op today because the
site is served from the domain root, and it still must be used for every
hand-written `<img src>`, `<a href>` to another page, and download link.
`basePath` covers routing and framework assets but does **not** rewrite those —
they work in dev and 404 in production, which is the single most common way
these sites ship broken. One helper means a repo rename is a one-line change.

## Design system

"Fancy tech console" theme (adopted 2026-08-22, modeled directly on a
reference site the candidate supplied — a bslthemes CV template — replacing
a "restrained dark IDE" look from two days earlier; two other themes preceded
that. See git history around 2026-08-20/22 for any of them). Unlike every
prior revision, **this one explicitly wants cards, icons and rounded
corners** — do not walk it back toward flat/minimal without being asked.
Constraints are documented at the top of `app/globals.css` and are enforced
by eye, not by tooling:

- two families: Space Grotesk (`--display`, headings) and Inter (`--sans`,
  body), both self-hosted via Fontsource — no Google Fonts request at runtime
- dark navy canvas (`--bg`) with a faint decorative circuit-pattern texture
  (`public/circuit.svg`, rendered via a fixed full-bleed `.bg-texture` div in
  `app/layout.tsx`, `pointer-events: none`, low opacity) — it is atmosphere,
  never a click target, and must never affect layout or scroll size
- structure comes from `.card` (rounded border, `--radius: 20px`, no forced
  header row) and the 12-column grid — `.card` is the one sanctioned
  container, reused directly (`Section.tsx`) or nested (each `.rec`,
  `.work-card`, `.service-card`) so panels can sit inside panels without a
  second visual language
- navigation is a fixed icon sidebar (`Sidebar.tsx`), not a top masthead —
  icon + label per section, active state gets the accent. On narrow
  viewports it becomes a horizontal top bar (`@media max-width: 900px`),
  same pattern as the old mobile nav: no hamburger, `overflow-x: auto`.
  Labels are the full section name, never abbreviated (`Recommendations`,
  not `Recs`) — `.sidebar-nav a` carries `word-break: break-word` so a long
  label wraps onto two lines inside its fixed-width column instead of
  overflowing; do not swap that for `hyphens: auto`, which silently fails
  to break the word in Chromium's headless renderer and lets it spill past
  the sidebar edge
- icons are the hand-rolled set in `components/Icons.tsx` (plain shapes —
  circles, rects, lines — not dense bezier paths) — never an icon font or a
  third-party icon package. Reuse an existing icon before adding a new one
- one accent, `--accent: #9ae635` (neon green), used sparingly for text,
  icons, active states and the one status dot. Project cover art varies its
  *background* tint across five dark gradients (`.work-cover.c1`–`.c5`,
  cycled by index) for visual rhythm — that is chrome, not a second content
  accent, and must stay dark/desaturated enough that white icon strokes and
  card text remain legible over it
- visuals must be honest: a project cover is a real screenshot of the
  product/company site when one exists (`projects.json`'s `image` field →
  `public/work/*.jpg`, captured with Playwright and cropped to 16:10 — see
  `crop.py` in git history around 2026-08-22), and only falls back to the
  icon-over-gradient cover when there's genuinely nothing live to screenshot.
  Never invent a cover for a dead domain. The one architecture diagram
  (Flowdia's `.flow-diagram` in `Projects.tsx`) illustrates a process the CV
  already describes — if you add another diagram, ground it in real content
  the same way, not invented detail
- two more decorative layers, both frozen by the global
  `prefers-reduced-motion` rule with no extra work: `.bg-lights` (`app/layout.tsx`)
  is three blurred, slowly drifting circles — accent green plus one
  desaturated neutral, so it reads as ambient light, not a second palette —
  and `.hero-terminal` (`Hero.tsx`) is a small fake terminal window tucked
  behind the hero photo, its "typing" a looped CSS width-reveal over fixed
  text, not a live shell

Colour tokens carry their contrast ratio in a comment. `--ink-4` is decorative
and fails AA for body text; do not promote it to running text.

Favicon is `app/icon.svg` (the rounded-square "A" mark, brand colours) plus
`app/apple-icon.png` (180×180 PNG — iOS does not accept an SVG touch icon).
Next's metadata-file convention wires both into `<head>` automatically; there
is no manual `<link rel="icon">` to maintain.

Skills render as icon **service cards** (`Skills.tsx`, inside the About
section — there is no separate Skills nav item or anchor). The chat lives in
a pinned bar at the bottom, deliberately the most visually prominent fixed
element on the page (accent top border, pill-shaped input, status dot);
opening it expands a `.chat-win` card above the bar with its own header. Both
were explicit calls — the CV is the content, the assistant is the proof, and
the assistant should be easy to notice.

The portrait photo appears twice, at different scales, both deliberate: a
small circular avatar at the top of the sidebar, and a larger circular photo
inside the hero's `.hero-photo-card`. Neither is a large uncropped hero image.

Nav links (`Sidebar.tsx`, `Footer.tsx`) are anchors like `#about` that only
scroll if the current document actually has that id. `/chat/` is a separate
exported route with no `#about` on it, so every such link is built from
`asset('/')` (the home route) + the hash, computed once as `home` in each
component — never a bare `#id`, or it silently does nothing from `/chat/`.

### The min-width: 0 gotcha (hit three times in one session — read this first)

Grid and flex items default to an *automatic* minimum width based on their
own content, not `0`, no matter what their track/flex-basis says. On a
narrow viewport this means: a track marked `1fr` still won't shrink below
its content's natural size, a `<p>` full of `white-space: nowrap` spans
forces its whole row wider than the screen, and a flex child that looks
fine on desktop can silently push its sibling out from under a neighbouring
element (this cost real clicks once — the send button ended up invisibly
underneath the toggle link). Two separate, unrelated-looking bugs — a
whole-page horizontal scrollbar, and a button that visually renders but
can't be clicked — turned out to be this same mechanism.

The general grid container rule near the top of `globals.css` already sets
`min-width: 0` on every direct grid item for the containers in use today.
If you add a new CSS grid or flexbox container that holds text (especially
`white-space: nowrap` spans, like `.work-stack`/`.service-list`), add its
children to that rule or give them `min-width: 0` directly — and if a fix
doesn't visually work, check *both* the item and its own children/box before
assuming the fix is wrong; the collapse has to cascade through every level
that's flex/grid, not just the outermost one.

## Chat client

`components/useChat.ts` holds all state and talks to `lib/api.ts`. `AskBar`
(pinned) and `ChatPage` (`/chat`) are two presentations of that one hook —
put behaviour changes in the hook, not in either view.

The API base comes from `NEXT_PUBLIC_API_BASE`, injected by the Pages workflow
from the repo variable `API_BASE`. Locally it comes from `.env.local`
(gitignored). If it is unset, the chat degrades to a message rather than
throwing.

Streaming arrives as SSE deltas. Keep the `aria-live` region on the answer.

## Before committing

Run `npm run build`. The postbuild check greps `out/` for contact details and
secrets and fails on a hit — that gate is the last thing standing between an
edit and a public email address.
