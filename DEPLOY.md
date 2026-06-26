# Deploy checklist — Punting Tours Cambridge

The site is a static build. `npm run build` compiles `src/` into `dist/`, copies
`src/public/` and `admin/` to the dist root, and auto-generates `sitemap.xml`.
This file records how the site goes live and what is left to do. Most of the
infrastructure is already in place; remaining items are marked **(todo)**.

## 1. Hosting + deploy (LIVE)
Deployed to **Cloudflare Pages via GitHub Actions** (`.github/workflows/deploy.yml`,
using `cloudflare/wrangler-action`). Every push to `main` rebuilds and deploys,
including Sveltia CMS commits (image/blog edits go live without a human build).
- Required GitHub Actions secrets (already set): `CLOUDFLARE_API_TOKEN` (Pages: Edit),
  `CLOUDFLARE_ACCOUNT_ID`.
- The CI build runs `SITE_INDEXABLE=true npm run build` so production is indexable.
- Note: the Cloudflare dashboard git-connect "build command" route was tried and failed
  with a scoped-token auth error (10000); GitHub Actions is the working path. Do not
  re-enable the dashboard build.

## 2. Domain + indexing (LIVE)
- `puntingtourscambridge.com` points at the Pages project (Cloudflare DNS), HTTPS on.
- Pages emit `<meta name="robots" content="index,follow,max-image-preview:large">`.
- `robots.txt` is allow-all. Cloudflare's "AI Crawl Control" + managed-robots.txt
  injection has been DISABLED in the dashboard, so AI bots (GPTBot, ClaudeBot,
  Google-Extended, etc.) are allowed too. If AI bots ever show blocked again, re-check
  Cloudflare → Security → Bots → AI Crawl Control.

## 3. Analytics + search-engine verification (LIVE)
Placed in `src/layouts/base.html` `<head>`, values in `site.config.md`:
- Google Analytics 4 (`G-GBTTTZS0PM`), Google Search Console + Bing verification metas.
- **(todo)** In Google Search Console and Bing Webmaster Tools, click **Verify**, then
  submit `https://puntingtourscambridge.com/sitemap.xml` in both.

## 4. Sveltia CMS (`/admin`) — images + blog (LIVE)
Content managers sign in with GitHub and edit:
- **Site images**: each slot is a `{ src, alt }` object, grouped by page.
- **Blog**: markdown posts (folder collection over `src/content/blog/`).
Backed by a deployed **sveltia-cms-auth** Cloudflare Worker (GitHub OAuth App;
`GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` set as worker secrets). The worker URL +
repo are in `admin/config.yml`.

## 5. Images (todo — blocker for a polished launch)
Hero/card/author slots reference `/images/uploaded/...`. A few real photos are in;
the rest are flagged placeholders.
- **Content managers upload** all tour photography, hero, author, and editorial images
  via Sveltia (never AI-generated — root rule), each with a required alt text.
- **Claude generates** the logo, favicon, and infographics (already produced).
- Maps are keyless Google Maps **embeds**, so there is no maps API key to set.

## 6. Information-gain data refresh (optional, periodic)
The "Latest data" blocks (homepage + every post) are sourced via the **xAI Grok Agent
Tools API**. The key lives in an untracked `.env` (`XAI_API_KEY`), never committed.
Data is baked into pages at authoring time, so the build/CI never need the key. Re-run
the Grok pull periodically so figures (prices, exchange rate, stats) stay current; raw
results are kept under `research/grok/`.

## 7. Legal / honesty wording (todo)
- `/disclosure/`: confirm or replace the FTC wording with your approved text.
- `/privacy/`: fill the bracketed details (legal entity, contact email, jurisdiction)
  and have it reviewed.
- `info@puntingtourscambridge.com`: set up Cloudflare Email Routing so the contact address
  reaches your inbox (referenced on `/contact/` and in the footer).

## 8. Data freshness (ongoing)
Prices and ratings are real, attributed to the operator's GYG/Viator listings. There are
no visible "verified [date]" stamps (removed sitewide); re-confirm figures against the
live listings periodically. Provenance dates are tracked in `research/` and `site.config.md`.

## Local preview
`npm run serve` builds and serves `dist/` at http://localhost:8080
(local builds stay `noindex` unless you pass `SITE_INDEXABLE=true`).
