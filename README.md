# Punting Tours Cambridge

Affiliate tour-content site for Tokyo street go-karting (puntingtourscambridge.com), built on a
reusable static-site pipeline. Plain static HTML assembled from partials via a light
include/compile step. No framework, no client-side rendering.

## Develop

```bash
npm install
npm run build     # compile src/ -> dist/
npm run serve     # build + preview at http://localhost:8080
```

## Layout

- `src/pages/` — page sources (HTML), compiled to clean-URL folders
- `src/content/blog/` — Markdown blog posts (frontmatter + body)
- `src/components/`, `src/layouts/` — partials and the base shell
- `src/public/` — assets, CSS, images (uploaded + generated), robots.txt, llms.txt
- `src/data/images.json` — labeled image slots edited via the CMS
- `build/compile.mjs` — the include/compile step (also renders sitemap.xml and the blog)
- `admin/` — Sveltia CMS (images + blog markdown), served at `/admin`
- `research/` — keyword research, compliance sheet, content plan

## Per-site config & docs

- `CLAUDE.md` — the reusable pipeline (generic across sites)
- `site.config.md` — the only per-site file (identity, tours, author, compliance)
- `DEPLOY.md` — what is needed to go live (hosting, domain, keys, images)

## Notes

- Images under `/images/uploaded/` are uploaded by content managers via Sveltia (never AI-generated).
- Assets under `/images/generated/` (logo, favicon, infographics) are generated. Maps are
  interactive Google Maps embeds, not images, so no maps API key is needed.

## Build env vars

- `SITE_INDEXABLE=true` — emit `index,follow` instead of the default `noindex` (set in CI for
  production; local/dev builds stay noindex). See `.claude/08-build-deploy.md` 8.6b.
- `XAI_API_KEY` (in an untracked `.env`) — only needed when refreshing the Grok-sourced
  information-gain data (`research/grok/`); the data is baked into pages at authoring time, so
  routine builds and CI do not need it.
