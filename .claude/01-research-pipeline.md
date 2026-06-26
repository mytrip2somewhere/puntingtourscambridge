# 01-research-pipeline.md — Phase 1: Research & Content Mapping

Generic. Read site specifics from `site.config.md`. Global rules live in root `CLAUDE.md`.

## PURPOSE
Turn a destination/experience into a prioritized, intent-mapped page list, grounded in
real search demand, real user language, and verified facts. Output feeds Phase 2.

## DISCOVERY API
DataForSEO (single vendor: keyword volume + SERP + PAA + autocomplete + related
searches), via the DataForSEO MCP server. Use the standard queue tier (batch research,
not real-time). Cost-control defaults: standard queue only, no live mode unless flagged,
no unnecessary parameter multipliers.

## 1.0 REQUIRED INPUTS (pause and ask Oleg before researching)
- Primary keyword + any secondary keywords (or confirm a seed list).
- The tour links to feature: Oleg sends GYG/Viator links (with affiliate params) from
  `site.config.md` > TOURS. These are the definitive set. Nothing added that Oleg didn't
  send; nothing invented. Pull name, price, rating, booking volume from each. Confirm the
  assembled list back to Oleg. Stats stay attributed to their real source.
- Confirm whether the compliance module is ON (see `site.config.md` > COMPLIANCE MODULE).
Once tours are in, sort by booking volume (not "Best Seller" tags, not price). That order
feeds tour pages and category/comparison rankings.

## 1.1 KEYWORD & DEMAND RESEARCH (DataForSEO)
Pull: search volume, trends over time (seasonality), PAA nodes, autocomplete, related
searches. Expand seeds into long-tail. Bucket every keyword by intent: transactional,
comparison, informational, navigational. Apply the EMD note from Phase 0.

## 1.2 REAL-USER-LANGUAGE LAYER (manual + forums)
Add human texture the API misses: manual PAA branching, and forum/community mining
(sources in `site.config.md` > REAL-USER-LANGUAGE SOURCES, e.g. relevant subreddits and
Tripadvisor). Capture exact tourist phrasing (the words they actually use) and the
genuine pain points, which become high-value AEO pages. If you can't access relevant subreddits, 
Because of scraping restrictions - ask Oleg for Grok API. Grok can access them.

## 1.3 SERP ANALYSIS (per priority keyword)
Analyze the live SERP: rewarded format (listicle/guide/comparison/video/local pack/AI
overview), depth and word count of what ranks, SERP features present and how to win them,
and confirmed commercial vs informational intent.

## 1.4 COMPETITOR CONTENT AUDIT (top 10 per primary keyword)
Audit structure/outline, depth, E-E-A-T signals, affiliate density and placement, and
gaps (unanswered questions, missed angles, outdated facts, thin sections). Goal: know
what to match and where to beat them.

## 1.5 CONTENT GAP & TOPIC CLUSTERING
Combine the above into a hub-and-spoke content map: main guide (hub), comparison pages,
single-question AEO pages (high-value only), FAQ hub (everything below threshold),
supporting guides. AEO threshold detailed in `07-aeo-llm.md`.

## 1.6 PAGE PRIORITIZATION
Score each proposed page by intent strength, commercial value, search volume/demand, and
competitive difficulty. Produce a build order (money + winnable pages first).

## 1.7 COMPLIANCE & FACTUAL RESEARCH (per-site module)
Only if `site.config.md` > COMPLIANCE MODULE is ON. Research the items listed there,
verified against current official sources, never from memory. Every fact carries a source
and a "last verified" date. Never invent or placeholder compliance facts (root rule).
If the module is OFF, skip this step entirely.

## 1.7b VERIFIED-SOURCE WHITELIST (for in-article external links)
While researching, build a reusable whitelist of authoritative external sources for
outbound linking (used by Phase 6.6). Format: theme → exact URL, each confirmed live and
genuinely supporting the claim it will back. Prefer official/primary sources (government,
police, regulators, standards bodies, the operator's own listing), then reputable press and
encyclopedic references. This list is the ONLY pool article writers (and any delegated
subagents) may pull external links from; never link a URL that is not on it. Re-verify a URL
before reusing it on a new article.

## 1.8 DELIVERABLES (handoff to Phase 2)
Intent-bucketed keyword list (volume, trends, PAA, autocomplete, related); real-user
glossary; SERP summary per keyword; competitor audit notes; prioritized hub-and-spoke
content map with build order; tour list sorted by booking volume; verified compliance
sheet with sources/dates (if module ON); verified-source whitelist for external links (1.7b).
