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

"Restrained dark IDE" theme (adopted 2026-08-20, replacing a "modern dev
terminal" look from earlier the same day, which itself replaced an original
light-paper/serif editorial design — see git history for both). The terminal
theme's title-bar-and-traffic-lights chrome, repeated identically on every
section, read as templated rather than as a person's site; this pass keeps
the dark canvas and mono font but drops the repetition. Constraints are
documented at the top of `app/globals.css` and are enforced by eye, not by
tooling:

- one family, monospace, everywhere: JetBrains Mono, self-hosted via
  Fontsource — no Google Fonts request at runtime
- dark canvas (`--bg`) with panel bodies one step lighter (`--panel-bg`), so
  content reads as surfaces sitting on the page without needing a shadow
- structure comes from `.panel` (a hairline border + padded `.panel-body`,
  **no header row**) and the 12-column grid — `.panel` is the *only*
  sanctioned "card-like" container; do not invent a second boxed-content
  pattern, and do not add a title bar back onto it
- the chat is the one deliberate exception: `.chat-win` keeps a header
  (`.chat-win-bar`, a label + `.status-dot`) and the pinned `.askbar` gets a
  2px accent top border — both exist specifically to make the interactive
  surface more visually prominent than the read-only content panels, per an
  explicit ask. Do not add that chrome to non-chat panels
- `border-radius` stays off everything except panels (`--panel-radius: 6px`),
  the nav avatar circle, and small controls (buttons/inputs, ≤4px) — it is
  not a general license to round corners
- no decorative prompt glyphs (`//`, `~/`, `$`, `#`, `>`) outside the chat —
  that repetition (once per nav link, once per bullet, once per section) is
  what read as templated. The chat's `$`/`>` turn markers and the hero's
  single `.caret` blink are the only glyph decoration left, deliberately
  scoped to the one interactive/typing-flavored surface
- one accent, `--accent: #58a6ff` (a neutral blue, not the old terminal
  green), used sparingly. `--online` (green) is a separate token for the
  chat's status dot only — it is not a second content accent

Colour tokens carry their contrast ratio in a comment. `--ink-4` is decorative
and fails AA for body text; do not promote it to running text.

Skills render as a **table**, not chips. The chat lives in a pinned bar at the
bottom, deliberately the most visually prominent fixed element on the page
(accent top border, bordered input, status dot); opening it expands a
`.chat-win` panel above the bar. Both were explicit calls — the CV is the
content, the assistant is the proof, and the assistant should be easy to
notice.

The portrait photo is a small circular avatar in the masthead nav (`.avatar`),
not a large hero image — deliberately downplayed versus the content. The hero
uses a plain `.panel` instead of a photo for the availability/location/links
block.

Nav links (`Masthead.tsx`, `Footer.tsx`) are anchors like `#about` that only
scroll if the current document actually has that id. `/chat/` is a separate
exported route with no `#about` on it, so every such link is built from
`asset('/')` (the home route) + the hash, computed once as `home` in each
component — never a bare `#id`, or it silently does nothing from `/chat/`.

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
