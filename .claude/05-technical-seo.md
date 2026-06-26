# 05-technical-seo.md — Phase 5: Technical SEO

Generic. Read site specifics from `site.config.md`. Global rules live in root `CLAUDE.md`.

## PURPOSE
Make pages maximally legible/rewardable to search engines and AI crawlers: reverse-
engineered titles, a connected schema entity graph, interaction-optimized structure, a
strict validated technical baseline. Ties to the Phase 2 schema-placement map and Phase 4
per-block schema.

## 5.1 COMPETITOR TITLE & META REVERSE-ENGINEERING
1. Top-20 extraction: pause before writing headers/meta; ask Oleg to input the exact title
   tags of the top 20 competing URLs on the current SERP.
2. Pattern synthesis: isolate the lexical hooks Google rewards for that intent cluster
   (modifier placement, bracketed tags, price-forward strings, numbers/year).
3. Template compilation: build type-specific titles/meta matching the winning pattern while
   keeping natural human cadence. No uniform repetitive AI meta across pages.

## 5.2 CONNECTED SCHEMA GRAPH (single interconnected JSON-LD in header)
1. Identity anchor (TravelAgency) on homepage: unique `#agency` id, `logo`, `description`,
   and `sameAs` to official TripAdvisor/social handles. Add `PostalAddress` + `telephone`
   ONLY when the operator's real ones are known; never fabricate an address or phone to fill
   the schema (honesty rule). Every other page references this node by `@id`.
2. Booking object (`["Product","TouristTrip"]`) on tour pages, multi-typed:
   - `provider` → root `#agency` node
   - `offers` → Offer with currency strings, direct booking link, date availabilities
   - `aggregateRating` → REAL review data only, attributed to its real source (GYG/Viator
     listing), not presented as first-party. Ratings only where legitimate (Phase 4). No
     self-serving/mismatched review snippets.
3. Structural loops: BreadcrumbList (every page below home); FAQPage (accordions);
   TouristAttraction nested in itinerary items, each landmark its own node with exact
   GeoCoordinates (stays in sync with the Phase 3 map embed).

## 5.3 INTERACTION-OPTIMIZED STRUCTURE (informed by DOJ/leak material)
Framing: tactics below are firm build rules because they are good UX on their own. The
internal-mechanism language (named Google systems, exact signal names, time windows) is
informed rationale, not confirmed fact. If the community reading is wrong, the rules stand.
1. Answer-first above the fold: high-contrast, information-dense answer container delivering
   core intent within ~150 words.
2. Resolve the journey on-site: strong horizontal internal links (Phase 2 sibling bridges)
   so users don't bounce back to search.
3. Contextual anchor flanking: cluster-link anchors match naturally or sit beside related
   destination entities.

## 5.4 BASELINE TECHNICAL ARCHITECTURE & VALIDATION
- Heading cascade: exactly one H1 mapping to the core entity; H2→H3 without skipping.
- Image SEO: descriptive lowercase hyphenated filenames; explicit alt text (no stuffing);
  fixed width/height (no layout shift). Applies to uploaded and generated assets.
- Social graph: full Open Graph (og:type/title/description/image) + Twitter Cards.
- Canonical/robots/sitemap: absolute self-referencing canonicals; lean robots.txt; clean
  valid sitemap.xml.
- Analytics + search-engine verification (ASK OLEG, do not skip): before launch, request
  three values and place them in the base-layout `<head>` so they appear site-wide:
  1. Google Analytics 4 measurement ID, rendered as the gtag.js snippet (UNIQUE per site).
  2. Google Search Console ownership: `<meta name="google-site-verification" content="...">`.
  3. Bing Webmaster Tools: `<meta name="msvalidate.01" content="...">`.
  The two verification metas are static per site and identical on every page; the GA ID
  differs per site. All three live in `site.config.md` (ANALYTICS + VERIFICATION). The
  `/admin` CMS page is exempt (it does not use the base layout). This is the head-completeness
  step that is easy to forget, so treat it as a required pre-launch ask, not optional.
- Core Web Vitals (corrected):
  - PASS/FAIL gate at Google's "good" thresholds: LCP < 2.5s, CLS < 0.1, INP < 200ms (at
    the 75th percentile, all three together).
  - WARNING tier at 80% of limits: LCP > 2.0s, INP > 160ms, CLS > 0.08.
  - STRETCH goals (not rejection gates): LCP < 1.2s, near-zero CLS, INP well under 200ms,
    via zero heavy dependencies, system fonts, preloading, explicit space scales.
  - WATCH (verify before encoding): "Core Web Vitals 2.0" / Visual Stability Index reported
    for 2026 but not yet confirmed in Google docs. Confirm before adding any VSI rule.
- Validation: build rejects unclosed HTML or invalid/malformed JSON-LD. CWV failures at the
  gate flag for fix; the 80% tier warns but does not reject.

## 5.5 DELIVERABLES (handoff to Phase 8 and 10)
Top-20 title/meta procedure with human-cadence guard; connected JSON-LD graph spec with the
rating-honesty constraint; interaction-structure rules (mechanism = informed rationale);
heading/image/social/canonical/robots/sitemap baseline; analytics + GSC/Bing verification
tags (5.4); noindex-until-launch indexing gate (Phase 8.6b); corrected CWV system (gate +
80% warning + stretch + VSI watch); build-time validation rules.
