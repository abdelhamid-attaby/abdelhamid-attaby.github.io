# CLAUDE.md — api

Vercel serverless functions. The only place secrets exist. Three endpoints:
`chat` (streams an answer about the CV), `contact` (form → email), `health`.

## Environment

Set in the Vercel dashboard, never in a file. `.env.local` is gitignored.

| Variable | Notes |
|---|---|
| `OPENROUTER_API_KEY` | Cap the key at $0 credit so it can only reach `:free` models |
| `OPENROUTER_MODELS` | Optional comma-separated preference order; falls back to the resolved free list |
| `MAX_TOKENS` | Per-answer ceiling |
| `MONGODB_URI`, `MONGODB_DB` | Atlas free tier |
| `IP_HASH_SALT` | Long random string. Rotating it resets everyone's quota |
| `RATE_LIMIT_PER_DAY` / `PER_HOUR` | Per visitor, default 8 / 4 |
| `DAILY_GLOBAL_CAP` | Site-wide, default 180 |
| `ALLOWED_ORIGIN` | The Pages origin. `cors.ts` rejects everything else |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Contact form |

## The constraint everything else follows from

The OpenRouter free tier allows roughly **200 requests per day across the whole
account** — not per user. Cost is not the limit; the request ceiling is. The
defaults above (8/visitor/day, 180 site-wide) exist to keep one visitor, or one
scraper, from spending the day's budget in a minute.

`rateLimit.ts` accordingly:

- hashes IPs with a salt — the raw address is never stored
- uses a single atomic `findOneAndUpdate`, because check-then-write races under
  concurrent requests and silently overshoots the cap
- **refunds** the quota when the upstream call fails, so an OpenRouter outage
  does not burn the visitor's allowance
- **fails closed** if Mongo is unreachable. An unmetered assistant is worse
  than an unavailable one

## Model selection

`openrouter.ts` fetches `/api/v1/models`, keeps only entries with
`pricing.prompt === "0"`, and caches the list for an hour. Never pin a model
ID: the free roster changes without notice and a pinned ID fails as a 404 at
request time, which reads to a visitor as the site being broken.

## Grounding

`prompt.ts` builds the system prompt from the CV and **strips email and phone
before the text reaches the model.** Instructing a model not to reveal
something is a request, not a guarantee — remove the data instead.

The whole CV is injected, roughly 3,000 tokens. No RAG, no vector store, no
chunking: retrieval only starts paying for itself past ~50 KB of source, and
below that it adds failure modes and latency in exchange for nothing.

The prompt tells the model to answer only from the CV and to say plainly when
something is not in it. Keep that instruction — a CV assistant that invents an
employer is worse than one that declines.

## Notes

- `lib/cv_data.json` is a copy of `web/content/cv_data.json`. Update both
  together or the assistant and the page disagree.
- `cors.ts` echoes a single allowed origin, not `*`. A wildcard would let any
  site spend this account's daily request budget.
