# 08-build-deploy.md — Phase 8: Build & Infrastructure

Generic. Read site specifics from `site.config.md`. Global rules live in root `CLAUDE.md`.

## PURPOSE
Scaffold the deployable repo: single-source-of-truth partials, Sveltia CMS (images + blog) with
Cloudflare OAuth, dual-source image optimization, Cloudflare Pages auto-deploy. Consistent
with decisions in Phases 2–7.

## 8.1 REPOSITORY TOPOLOGY
```text
├── .github/workflows/
│   └── deploy.yml                 # CI build + deploy
├── src/
│   ├── components/                # Phase 4 atomic block partials
│   │   ├── hero.html
│   │   ├── quick-answer.html
│   │   ├── product-card.html
│   │   ├── comparison-table.html
│   │   ├── faq-accordion.html
│   │   ├── map-embed.html           # interactive Google Maps iframe (Phase 3.5, embed-only)
│   │   ├── author-bio.html
│   │   ├── footer.html            # incl. social icons (site.config.md > SOCIAL LINKS)
│   │   └── ... (full Phase 4 library)
│   ├── layouts/
│   │   ├── base.html              # global shell: header, footer, GA + GSC/Bing verify, CSS tokens, schema slot
│   │   └── aeo-landing.html       # lean layout for single-question AEO pages
│   ├── pages/                     # page source files (call partials via includes)
│   ├── content/
│   │   └── blog/                  # markdown blog posts (Sveltia-editable, 8.3)
│   ├── data/
│   │   └── images.json           # {src,alt} per image slot (Sveltia-editable, 8.3)
│   └── public/
│       ├── assets/                # compiled CSS, system fonts, icons
│       └── images/
│           ├── uploaded/          # Sveltia media library (Oleg's photos)
│           └── generated/         # logo, favicon, infographics (Claude's SVGs)
├── admin/
│   ├── index.html                 # Sveltia CMS
│   └── config.yml                 # images + blog collections (8.3)
├── functions/                     # Cloudflare edge functions (if needed)
├── llms.txt
├── robots.txt
├── sitemap.xml
├── wrangler.toml                  # Cloudflare + OAuth worker config
├── CLAUDE.md                      # root router
├── site.config.md                 # per-site config
└── .claude/                       # phase files (00–08)
```
Tour/money-page data lives in page partials authored by Claude Code (NOT CMS-editable —
prices, ratings, affiliate links and schema stay under code control). Blog posts are the
one exception: they live as markdown in `/src/content/blog/` and ARE content-manager
editable via Sveltia (8.3), because editorial blog copy carries no schema/pricing risk.

## 8.2 SINGLE-SOURCE-OF-TRUTH PARTIAL COMPILATION
A light compile step stitches pages from `layouts/` + `components/` via single-line include
tokens (e.g. `{{ include "components/product-card.html" }}`). No component HTML copy-pasted
across files. `base.html` owns global elements: semantic header, footer (incl. social +
disclosure), the GA4 gtag.js snippet (site.config.md > ANALYTICS), the Google Search Console
+ Bing verification `<meta>` tags (site.config.md > VERIFICATION; identical on every page),
CSS tokens, the schema injection slot (Phase 5). Ask Oleg for all three values before launch
(Phase 5.4); the GA ID is per-site, the two verification metas are static per-site. Output is plain static HTML (preserves the Phase 5 zero-heavy-dependency
posture). This is a compiler, not a framework or CMS-rendered site.

## 8.3 SVELTIA CMS, IMAGES + BLOG (no money-page text)
Sveltia at `/admin`. Two collection groups for content managers:
- **Site images**: a `{ src, alt }` object per image slot, GROUPED BY PAGE (homepage, tours,
  guides, author) so a manager can find "which image is where"; both the photo AND a
  required keyword-relevant alt are editable (backed by `src/data/images.json`).
- **Blog**: a folder collection over `/src/content/blog/` — markdown body + frontmatter
  (title, description, hero image + hero alt, related_tour). New posts auto-appear in the
  blog hub + sitemap on build.
Still OFF-LIMITS in the CMS: price/rating/affiliate/schema/date text on money pages (those
stay in code; changing that reopens the raw-HTML choice, not a silent config tweak).
Cloudflare OAuth worker deployed for the GitHub authorization-code login (not PATs), so
managers "sign in with GitHub."

## 8.4 IMAGE OPTIMIZATION PIPELINE (both sources)
Both sources run through optimization: uploaded photography AND generated assets (logo,
favicon, infographics; maps are interactive embeds, not images). Target WebP/AVIF with fixed
dimension specs (feeds Phase 3 aspect-ratio wrappers and CLS protection), delivered over
Cloudflare's edge CDN. In the current build this conversion is handled at Cloudflare's edge
(Polish / Image Resizing) rather than a compile step; add a build-time optimizer only if a
site needs it.
`loading="lazy"` on below-the-fold media ONLY. The hero / LCP image is eager-loaded and
preloaded, never lazy-loaded (protects LCP).

## 8.5 MODULAR CLAUDE.md SYSTEM
Root `CLAUDE.md` router + `.claude/` files (00–08) + `site.config.md`, with the router's
task-trigger table so Claude Code loads only what each task needs. This is the modular
answer to keeping any single file from getting too big.

## 8.6 CLOUDFLARE PAGES DEPLOY
Deploy via **GitHub Actions** (`.github/workflows/deploy.yml` using
`cloudflare/wrangler-action`) on push to main, NOT the Cloudflare git-connect build flow.
Rationale (learned on this site): the dashboard git-connect path created a Worker that ran
wrangler with a scoped token and failed auth (error 10000); a GitHub Actions workflow with
`CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` secrets is the reliable path. The workflow
runs the compile (8.2) and `wrangler pages deploy dist`. Sveltia commits (images or blog)
trigger the same workflow, so content changes go live without a human build. The PAT used to
push the workflow file itself needs the `workflow` scope. Custom domain + HTTPS.

FIRST-DEPLOY GOTCHA (learned launching Cambridge): `wrangler pages deploy` does NOT
auto-create the Pages project in CI. A first run against a non-existent project fails with
`Project not found [code: 8000007]`. Fix baked into the template: an idempotent step BEFORE
the deploy that runs `npx wrangler@3 pages project create <project> --production-branch=main
|| true` (needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` env). It no-ops once the
project exists. Alternative one-off: create the project via the API
(`POST /accounts/{id}/pages/projects` with `{"name","production_branch":"main"}`) or in the
dashboard. The `--project-name` must match across the create step and the deploy command.

PRE-LAUNCH INDEXING: ship `npm run build` (defaults to `noindex,nofollow`) while images are
placeholders and the domain/GA/verification are not wired. At launch, flip the workflow to
`SITE_INDEXABLE=true npm run build`. The `.pages.dev` preview URL stays noindex regardless,
which is what you want before the custom domain is live.

NOTE on AI-bot access: Cloudflare can inject a managed "AI Crawl Control" block ABOVE the
repo `robots.txt` (Disallow GPTBot/ClaudeBot/Google-Extended + Content-Signal ai-train=no).
If the goal is AI-search visibility, the repo robots.txt alone is NOT enough — turn that
feature OFF in the dashboard (Security > Bots > AI Crawl Control). It cannot be removed from
the repo.
Long-cache headers for static design files (fonts, icons, CSS). Performance target is the
Phase 5 CWV gate (LCP < 2.5s, CLS < 0.1, INP < 200ms), not a separate response-time figure.

## 8.6b INDEXING GATE (noindex until launch)
Pages default to `noindex,nofollow` so an unfinished/placeholder site never gets indexed.
The compiler flips to `index,follow,max-image-preview:large` only when `SITE_INDEXABLE=true`
is set at build time. AT LAUNCH, set that env in the CI build step (e.g.
`- run: SITE_INDEXABLE=true npm run build` in the deploy workflow), NOT in the compiler
default, so local/dev builds stay safely noindex. After the first indexable deploy: confirm
the live `<meta name="robots">` reads `index,follow`, then verify ownership in Google Search
Console + Bing and submit the sitemap (Phase 5.4 verification tags must already be in place).

## 8.7 DELIVERABLES (handoff to Phase 9 QA)
Repo scaffolded to topology; working include-compile build with the full Phase 4 block
library as partials; Sveltia CMS (images + blog) at /admin + deployed Cloudflare OAuth worker
(wrangler.toml, config.yml); dual-source image optimization with correct hero/lazy rule;
analytics + GSC/Bing verification in the head (5.4) and the noindex-until-launch gate (8.6b);
modular CLAUDE.md router + sub-files; Cloudflare Pages auto-deploy verified, domain live.

## NOTE ON LATER PHASES
Phase 9 (pre-launch QA), Phase 10/11 (launch + indexing: flip the indexing gate on (8.6b),
verify ownership in Google Search Console + Bing and submit the sitemap; GA + verification
tags are already in the head from Phase 5.4), and Phase 12 (post-launch growth) were left
as-is in planning. Add them as separate files when you reach them, following the same generic
+ config-driven pattern.
