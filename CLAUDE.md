# CLAUDE.md — Pipeline Root Manifest & Router (Reusable Across All Sites)

This is the master instruction file for a reusable affiliate tour-content build
pipeline. It is GENERIC: it never hard-codes a specific site. All site-specific
values (name, domain, tours, author, compliance scope) live in ONE file:
`site.config.md` at the repo root.

To launch a new site: clone the repo, replace `site.config.md`, done. The pipeline
(this file + `.claude/` phase files) does not change between sites.

This file defines the project model, the global rules that apply to EVERY task, and
a router telling you which phase file in `.claude/` to load for a given task. Load
only the files a task needs. Do not hold all phase files in context at once.

---

## PROJECT MODEL (generic)

- **Type:** Tour-content site with affiliate links of real tour operators who use GetYourGuide (GYG) and Viator as platforms to sell tours. We help them to sell more tours, so we book or operate tours. We send
  visitors to GetYourGuide (GYG) and Viator via affiliate links. Conversion happens
  on product cards routing to those links.
- **Primary KPI:** affiliate clicks / bookings to GYG and Viator.
- **Secondary goals:** rank on Google + other search engines, get cited by LLMs
  (ChatGPT, Perplexity, Google AI Overviews, Gemini).
- **Hosting:** Cloudflare Pages. **CMS:** Sveltia (content-manager editable: images with
  alt text, and blog posts as markdown; money-page text/prices/schema stay in code). **Stack:**
  raw static HTML assembled from partials via a light include/compile step (see Build approach).

**All identity values come from `site.config.md`.** Never hard-code a site name,
domain, author, tour set, or compliance specifics into this file or any phase file.
Read them from the config. Any place a phase file shows a Tokyo/Shibuya or other
named example, treat it as ILLUSTRATIVE ONLY and replace with the current site.

---

## HOW THIS SYSTEM WORKS

The build is split into phase files in `.claude/`. This root routes you to the right
ones. Each phase file references earlier phases rather than repeating them, and reads
site specifics from `site.config.md`. When a task spans phases, load every file the
router lists for it, in order.

---

## GLOBAL NON-NEGOTIABLE RULES (apply to every task, every site, every file)

These override anything in a phase file if a conflict ever arises.

### Writing
- **No em dashes. Ever.** Not one. Use commas, colons, periods, or restructure.
- Varied sentence length. No three same-length sentences in a row.
- Uneven paragraphs. No stacked parallel structures (max two).
- **Banned AI vocabulary:** delve, tapestry, seamlessly, it's worth noting,
  in conclusion, navigating, robust, crucial, ensure, leverage, comprehensive.
- No templated openers ("If you're planning a trip to..."). Open on something real.

### Honesty (real grounding, not paralysis)
The rule is simple and firm: every factual claim must be REAL and stand on a trusted source.
Never invent one. This holds against SEO or any other pressure. It is NOT a reason to distrust
your own research tools or to stall over data a trusted tool already gave you. The failure
mode to avoid is fabrication, not the use of live data.
- **Trusted sources (any one is sufficient grounding, no second-guessing needed):** Phase 1
  research (DataForSEO); live-search tools, above all **Grok via the xAI Agent Tools API
  (web_search + x_search)**, which reads the current web, X and Reddit and can itself
  verify and refresh figures; official / primary sources; the real GYG/Viator listings; and
  Oleg's or the operator's real input. A current value returned by one of these counts as
  verified. Do not re-derive it or refuse to use it because you personally cannot confirm it.
- **Forbidden (this is exactly what "no fabrication" means):** inventing a number, statistic,
  quote, rating, review count, or "study" from nothing; faking first-hand experience the
  named author did not have; or inventing / placeholdering compliance facts.
- **Compliance facts:** real, from verified research (official sources or Grok live search),
  never invented or placeholdered. Track the "last verified" date behind the scenes, not as a
  visible on-page stamp. (Which compliance items apply is set in `site.config.md`.)
- **Real author, real experience.** First-person experiential claims require the real named
  author (from config) to have actually done the thing; where they have not, shift to honest
  research/reporting framing.
- **Stats must be real.** Attribution can be visible (e.g. "4.9 across 1,766 GYG reviews")
  OR kept on file when the site presents data in its own voice (the information-gain block,
  Phase 6.5b, shows fresh figures without inline citations but keeps the source record under
  `research/grok/`). Either way the figure is real, never invented, and the site never claims
  a proprietary study it did not run.
- **No cosmetic "Verified [date]" / "Last updated [date]" stamps** in visible copy (they date
  the page); keep verification dates behind the scenes.
- **Placeholders** are allowed ONLY when visually flagged and paired with:
  `<!-- NOTE FOR OLEG: replace placeholder data before publishing -->`
- **FTC affiliate disclosure** present sitewide in the footer.

### Images (two sources, never crossed)
- **Uploaded by Oleg / content managers (never generated):** tour card images, hero
  images, below-section content images, all tour photography and editorial imagery.
- **Generated by Claude:** the logo, infographics,
  map assets.

### Build approach
- Pages are assembled from partials via a light include/compile step
  (e.g. `{{ include "components/product-card.html" }}`). Output is plain static HTML.
  No heavy framework, no client-side rendering. No component HTML is copy-pasted
  across files. (Full topology in `.claude/08-build-deploy.md`.)

---

## TASK ROUTER

Find the task, load the listed files (in `.claude/`), then proceed. Always also have
`site.config.md` available for identity/tour/author/compliance values.

| Task | Load these files |
|---|---|
| Understand goals / positioning | `00-project-overview.md` |
| New topic / keyword / research pass | `01-research-pipeline.md`, then `07-aeo-llm.md` |
| Intake tour links, along with tour persona-provide (name, experience, EEAT credentials) from Oleg | `01-research-pipeline.md` |
| Plan structure / URLs / internal linking / new section | `02-architecture.md` |
| Design or style a component / visual work / maps | `03-design-system.md`, `04-block-library.md` |
| Build or edit a page block / define a partial | `04-block-library.md`, `03-design-system.md` |
| Build an individual tour (money) page | `04-block-library.md`, `05-technical-seo.md`, `01-research-pipeline.md` |
| Write titles / meta / schema / technical SEO | `05-technical-seo.md` |
| Write an article / any content or copy | `06-content-engine.md`, `04-block-library.md` |
| AEO: single-question page, /ai-learn-about-us, llms.txt | `07-aeo-llm.md` |
| Repo scaffolding / Sveltia / Cloudflare / deploy | `08-build-deploy.md` |

When unsure which files apply, load `00-project-overview.md` and `site.config.md`
first, then reason from the task.

---

## STEP 0 — ALWAYS CONFIRM BEFORE WRITING

For any content or page-build task: present a 6–8 item outline (H2s as questions
where applicable), confirm the values in `site.config.md` are correct for this site,
and wait for Oleg's approval ("everything is good - go ahead") before running
research or writing.

---

## FILE INDEX

Root:
- `CLAUDE.md` — this file (generic pipeline router)
- `site.config.md` — the ONLY per-site file; edit this to launch a new site

`.claude/` phase files (generic):
- `00-project-overview.md` — goals, KPI, EMD positioning, personas (Phase 0)
- `01-research-pipeline.md` — DataForSEO, research phases, tour-link intake (Phase 1)
- `02-architecture.md` — page types, URLs, internal linking, anchor rules (Phase 2)
- `03-design-system.md` — anti-template rules, blueprints, image split, maps (Phase 3)
- `04-block-library.md` — data-first blocks, per-block schema, page mapping (Phase 4)
- `05-technical-seo.md` — titles, schema graph, CWV gates, validation (Phase 5)
- `06-content-engine.md` — content template + affiliate/honesty reconciliations (Phase 6)
- `07-aeo-llm.md` — threshold gate, /ai-learn-about-us, llms.txt (Phase 7)
- `08-build-deploy.md` — repo topology, partials, Sveltia, Cloudflare (Phase 8)
