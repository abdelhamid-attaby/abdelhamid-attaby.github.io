# CLAUDE.md

Personal CV site for Abdelhamid Attaby. Static pages on GitHub Pages, a small
serverless API on Vercel that answers questions about the CV.

The two halves deploy separately and share nothing at runtime except an HTTPS
call. Treat that boundary as real: **anything in `web/` is public.** It is
downloaded verbatim by every visitor, so it holds no secrets, no email address
and no phone number. Everything privileged lives in `api/`.

```
web/   Next.js 15 static export  →  GitHub Pages  →  abdelhamid-attaby.github.io
api/   Vercel functions          →  Vercel        →  reads OPENROUTER_API_KEY, MongoDB
```

## Commands

```bash
cd web && npm run dev                   # localhost:3000 — runs the content step first
cd web && npm run build                 # static export to web/out/ + the leak check
cd api && npx vercel dev --listen 3001  # functions on localhost:3001 (3000 is taken by web)
```

For the local chat widget to reach the local API, `web/.env.local` needs
`NEXT_PUBLIC_API_BASE=http://localhost:3001` and `api/.env.local` needs
`ALLOWED_ORIGIN=http://localhost:3000` (plus the secrets below). Both files
are gitignored.

`npm run build` runs `scripts/build-content.mjs` before and
`scripts/check-export.mjs` after. Do not bypass either.

## Hard rules

These are load-bearing. Each one exists because the obvious approach failed.

**1. No contact details in `web/`.** Client code imports
`content/cv.public.json` (generated), never `cv_data.json` (source, has email
and phone). Stripping fields at runtime does *not* work — the bundler inlines
an imported JSON module whole, so `const { email, ...rest } = raw` still ships
the address in the JS chunk. This shipped once and was caught only by grepping
`out/`.

**2. `scripts/check-export.mjs` is a gate, not a linter.** It greps the built
output for addresses, phone numbers, `sk-or-v1-…` keys and Mongo URIs, and
fails the build on a hit. If it fires, fix the leak. Never loosen a regex to
get a green build.

**3. The OpenRouter free tier is the binding constraint.** Roughly 20 req/min
and ~200 req/day *account-wide* — cost is irrelevant, the request ceiling is
everything. Any feature that adds an LLM call per page view comes out of that
budget. Check `api/lib/rateLimit.ts` before proposing one.

**4. Never hard-code a model ID.** The `:free` roster churns; a pinned model
breaks the site silently. `api/lib/openrouter.ts` resolves the chain at runtime
against `/api/v1/models` filtered to `pricing.prompt === "0"`.

**5. Design constraints are not preferences.** As of 2026-08-20 the site is a
"modern dev terminal" theme: one monospace family (JetBrains Mono) for
everything, a dark canvas, one accent colour (`--accent`, terminal green), and
`.win` (title bar + traffic lights + body) as the *only* sanctioned structural
device besides the 12-column grid and hairline rules — never a drop-shadowed
card. Border-radius is otherwise still disallowed outside window chrome, the
avatar circle, and small controls (buttons/inputs, ≤4px). Constraints are
documented at the top of `web/app/globals.css`. (This replaced an earlier
light-paper/serif editorial theme — see git history around that date if you
need the previous rule set.)

**6. Only claim what the CV evidences.** Skills and bullets come from
`cv_data.json`. Do not add a technology to the skills table because it would
look good — ask first. (Standing rule from `AGENT_MEMORY.md` in the parent CV
project.)

**7. Keep the repo named `abdelhamid-attaby.github.io`.** Only a repo matching
`<username>.github.io` is served from the domain root, and `robots.txt` is only
ever fetched from the origin root — under any other name the `robots.txt` and
`llms.txt` in `web/public/` are never read. See the README for the rename
procedure if it ever changes.

## Watch for

- `cv_data.json` is duplicated in `web/content/` and `api/lib/`. Update both or
  the page and the assistant drift apart.
- The Toptal snippet declares global single-letter classes (`.a .b .c .d .f
  .h`) and `#r`. `ToptalBadge.tsx` scopes them. Do not un-scope it.
- The Pages workflow only fires on `web/**` changes. API edits deploy through
  Vercel's own git integration.

## Open items

- `web/public/cv.pdf` is missing — decide full vs contact-stripped, since it is
  public.
- `meta.scholar_url` in `cv_data.json` points at scholar.google.com generally,
  not his profile.
- The OpenRouter key was pasted into a chat on 20 Aug 2026 and should be
  rotated, with the replacement capped at $0 credit so it can only ever reach
  `:free` models.
