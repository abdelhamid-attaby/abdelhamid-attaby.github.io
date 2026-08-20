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

Constraints are documented at the top of `app/globals.css` and are enforced by
eye, not by tooling:

- no `box-shadow`, no `linear-gradient`, no `border-radius` above 2px
- no icon fonts, no emoji or geometric glyphs as UI
- structure comes from hairline rules and the 12-column grid, never from cards
- two families only: Archivo (structure) and Source Serif 4 (prose), both
  self-hosted via Fontsource — no Google Fonts request at runtime
- one accent, `--accent: #b3261e`, used sparingly

Colour tokens carry their contrast ratio in a comment. `--ink-4` is decorative
and fails AA for body text; do not promote it to running text.

Skills render as a **table**, not chips. The chat lives in a pinned bar at the
bottom, deliberately quiet. Both were explicit calls — the CV is the content,
the assistant is the proof.

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
