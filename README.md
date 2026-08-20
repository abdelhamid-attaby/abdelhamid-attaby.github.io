# abdelhamid-attaby.github.io

Personal site and CV, with an assistant that answers questions about the CV.

The front end is a static Next.js export served by **GitHub Pages**. The
assistant and the contact form run as serverless functions on **Vercel**, which
is the only place an API key exists. The two halves talk over CORS.

```
web/   Next.js static export  → GitHub Pages   (public, no secrets)
api/   Vercel functions       → Vercel         (OPENROUTER_API_KEY lives here)
```

---

## Why it is split this way

A static host cannot keep a secret. Anything shipped to GitHub Pages is
readable by anyone who opens devtools, so the OpenRouter key cannot live in the
front end at any price. Vercel's free tier gives us a place to hold it, and the
browser only ever learns the URL of an endpoint.

That split has one consequence worth understanding: `/api/chat` is a public URL
that spends a shared, finite daily budget. See *Rate limiting* below.

---

## Local development

```bash
# front end
cd web
npm install
echo 'NEXT_PUBLIC_API_BASE=http://localhost:3001' > .env.local
npm run dev                      # http://localhost:3000

# api (separate terminal)
cd api
npm install
npx vercel dev --listen 3001     # needs `npm i -g vercel` and a `vercel link`
```

`npm run build` in `web/` produces the static site in `web/out`.

---

## Content

Everything on the page comes from two files:

| File | What it holds |
|---|---|
| `web/content/cv_data.json` | The CV. Shared with the CV/PDF pipeline in the `my-cv` project. |
| `web/content/projects.json` | The six project entries. |

**`cv_data.json` still contains an email address and a phone number**, because
the PDF needs them. Nothing in the app is allowed to import it directly:
everything goes through `web/content/cv.ts`, which strips `meta.email` and
`meta.phone` at build time. The API does the same in `api/lib/prompt.ts` before
the CV reaches the language model.

That is deliberate. Telling a model not to reveal an email address is a request,
not a guarantee — removing the field means there is nothing to reveal.

To update the site's content, edit `cv_data.json`, commit, and push. The Action
rebuilds and redeploys. Remember to copy the same file into `api/lib/` so the
assistant and the page do not drift apart.

---

## Rate limiting

OpenRouter's free tier allows roughly **20 requests per minute and 200 per day
across the whole account**. Cost is not the constraint — that daily ceiling is,
and running past it would return errors to every visitor.

Enforced in `api/lib/rateLimit.ts`, before any upstream call:

| Limit | Default | Env var |
|---|---|---|
| Per visitor, per day | 8 | `RATE_LIMIT_PER_DAY` |
| Per visitor, per hour | 4 | `RATE_LIMIT_PER_HOUR` |
| Site-wide, per day | 180 | `DAILY_GLOBAL_CAP` |

Visitors are identified by a salted SHA-256 of their IP; the raw address is
never stored. Counters are incremented atomically, so two simultaneous requests
cannot both slip through on the last remaining slot. When the site-wide cap is
reached the assistant returns 503 and the UI says it is resting until midnight
UTC — the CV itself is static HTML and reads fine without it.

---

## Environment variables

### Vercel (`api/`) — the only place secrets live

| Name | Notes |
|---|---|
| `OPENROUTER_API_KEY` | Set the key's credit limit to **$0** in OpenRouter. A zero-credit key can only ever call `:free` models, so runaway spend is impossible by construction rather than by careful code. |
| `OPENROUTER_MODELS` | Comma-separated preference list. Default: `z-ai/glm-5.2:free,openai/gpt-oss-20b:free,google/gemma-4-31b-it:free,openrouter/free` |
| `ALLOWED_ORIGIN` | `https://abdelhamid-attaby.github.io` |
| `MONGODB_URI` | Atlas M0 connection string |
| `MONGODB_DB` | `attaby` |
| `IP_HASH_SALT` | 32 random bytes — `openssl rand -hex 32` |
| `RESEND_API_KEY` | Contact form delivery (free tier) |
| `CONTACT_TO_EMAIL` | Your private inbox |
| `RATE_LIMIT_PER_DAY`, `RATE_LIMIT_PER_HOUR`, `DAILY_GLOBAL_CAP`, `MAX_TOKENS` | Optional overrides |

### GitHub (`web/`) — public by definition

Set as a **repository variable**, not a secret (it ends up in the bundle):

| Name | Value |
|---|---|
| `API_BASE` | `https://<your-project>.vercel.app` |

---

## Deploying

**Front end.** Settings → Pages → Source: *GitHub Actions*. Push to `main`;
`.github/workflows/deploy.yml` builds `web/` and publishes it.

**Keep the repo named `abdelhamid-attaby.github.io`.** Only a repo matching
`<username>.github.io` is served from the domain root; under any other name
Pages serves it from `/<repo-name>/`.

That is not just cosmetic. `robots.txt` is only ever fetched from the origin
root — a crawler reads `https://host/robots.txt` and nothing else, so on a
project site the `robots.txt` and `llms.txt` in `web/public/` are never read
and the sitemap has to be submitted by hand. The clean URL and the absence of a
path prefix are the smaller wins.

If it does get renamed: set `BASE_PATH` (e.g. `BASE_PATH=/cv`) in the build
step. `basePath` covers routing and framework assets; the `asset()` helper in
`web/content/cv.ts` covers the hand-written `<img src>` and `<a href>` paths
that `basePath` does not rewrite. Both read the same value, so it is a one-line
change — but the SEO files stay broken regardless.

**API.** Import the repo into Vercel with **Root Directory** set to `api`. Add
the environment variables above, deploy, then check `/api/health` — it reports
which pieces of configuration are missing without revealing any of them.

---

## Before going live

- [ ] Replace `web/public/portrait.jpg` with the real face crop (4:5, ~640×800).
- [ ] Add `web/public/cv.pdf` — decide whether it is the full CV or a variant with contact details removed, since that file *is* public.
- [ ] Set the Google Scholar URL in `cv_data.json` (`meta.scholar_url` is currently the generic scholar.google.com).
- [ ] Rotate the OpenRouter key and cap it at $0.
- [ ] Submit the site to Google Search Console and Bing Webmaster Tools.

---

## Design

Swiss editorial: paper and ink, hairline rules, one accent (`#b3261e`), Archivo
for structure and Source Serif 4 for prose. Fonts are self-hosted through
Fontsource, so no request leaves the page to load them.

The constraints in `web/app/globals.css` are load-bearing, not decorative — no
shadows, no gradients, no rounded corners beyond 2px, no icon glyphs. Structure
comes from rules and the grid. Break one and it starts to look like every other
generated portfolio.
