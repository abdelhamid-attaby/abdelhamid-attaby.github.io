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

"Modern dev terminal" theme (adopted 2026-08-20, replacing an earlier
light-paper/serif editorial look — see git history if you need that palette).
Constraints are documented at the top of `app/globals.css` and are enforced by
eye, not by tooling:

- one family, monospace, everywhere: JetBrains Mono, self-hosted via
  Fontsource — no Google Fonts request at runtime
- dark canvas (`--bg`) with window bodies one step lighter (`--win-bg`), so
  content reads as panels floating on the page
- structure comes from `.win` (title bar with three traffic-light dots + a
  filename-style title, e.g. `about.md`, `experience.log` + padded body) and
  the 12-column grid — `.win` is the *only* sanctioned "card-like" container;
  do not invent a second boxed-content pattern
- `border-radius` stays off everything except window chrome (`--win-radius:
  8px`), the nav avatar circle, and small controls (buttons/inputs, ≤4px) —
  it is not a general license to round corners
- no icon fonts, no emoji or geometric glyphs as UI — terminal motifs
  (`$`/`>` prompt glyphs, the blinking `.caret`, `//` comment-style eyebrows)
  are done with CSS `content`, not icon assets
- one accent, `--accent: #39d98a`, used sparingly — traffic-light red/yellow/
  green in `.win-bar` are chrome, not a second content accent

Colour tokens carry their contrast ratio in a comment. `--ink-4` is decorative
and fails AA for body text; do not promote it to running text.

Skills render as a **table**, not chips. The chat lives in a pinned bar at the
bottom, deliberately quiet, styled as a terminal prompt (`$` + input); opening
it expands a `.win` panel above the bar. Both were explicit calls — the CV is
the content, the assistant is the proof.

The portrait photo is a small circular avatar in the masthead nav (`.avatar`),
not a large hero image — deliberately downplayed versus the content. The hero
uses a `.win` "whoami.sh" panel instead of a photo for the availability/
location/links block.

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
