# 04-block-library.md — Phase 4: Page Blocks (Data-First Atomic Library)

Generic. Read site specifics from `site.config.md`. Global rules live in root `CLAUDE.md`.

## PURPOSE
Define every reusable block once as a data-first container (not a generic layout
placeholder), each carrying real hyper-local data, per-block schema where relevant, and
honesty guardrails. Then map blocks to Phase 2 page types so Phase 8 build is mechanical.

## 4.1 CORE PRINCIPLE: DATA-FIRST CONTAINMENT
Blocks hold hyper-specific local data (exact price/currency ranges, ticket/entry windows,
current-year transit times, regulatory identifiers, seasonal metrics), not generic advice
(which helpful-content filters demote). Content-heavy blocks should carry at least two real
hyper-local data points.

INTEGRITY GUARDRAIL (non-negotiable, also in root):
- Every data point from a trusted source: Phase 1 research (DataForSEO), Grok live search
  (web_search + x_search), official/primary sources, the GYG/Viator listings, or Oleg's real
  input. A value a trusted tool returns counts as grounded; never invent one from nothing.
- Each data point carries a source + verified date behind the scenes (research files or an
  HTML comment) — NOT a visible "Verified [date]" / "Last updated [date]" stamp in the copy.
  Those visible date labels were removed sitewide; do not reintroduce them.

## 4.2 BLOCK LIBRARY
- Hero: headline, subheadline matching intent, optional author hook/trust signal, primary
  CTA. Variants: hub vs money. Uploaded image slot.
- Quick Answer: short direct answer-first response to the page's main question; expands below.
- Key Facts Table: duration, group size, difficulty, best-for, price range, meeting point.
  Prime spot for hyper-local data.
- Tour / Product Card: real data only (title, rating, review count, price, duration,
  highlights, honest description, affiliate link). Variants: grid/list, honest "Best
  Seller/Top Rated" tags driven by real booking volume. Primary money component.
- Comparison Table: side-by-side with honest pros/cons; must add unique value.
- Pros / Cons: specific, from real experience or real reviews.
- Pricing & Inclusions: clear current pricing, what's in/out (no visible "verified date" stamp, 4.1).
- Itinerary / Schedule: timed/step breakdown; strong carrier of fresh detail.
- CTA Banner: natural, not pushy; variants per buyer-journey stage. STANDARD affiliate
  button wording is **"Check live availability & prices"** (optionally "... on
  <Platform>") — never "Check prices" alone or a fabricated "book now / it's available"
  claim. This phrasing sets honest expectations (real-time price/date on the operator's
  listing) and is the one approved primary-CTA label sitewide.
- FAQ Accordion: Q&A pairs; carries FAQPage schema.
- Trust Strip: aggregate ratings, review counts, "X bookings" (attributed), awards, author
  credibility. Honest aggregate data only.
- Related Tours / Recommendations: contextual links supporting Phase 2 linking. This block
  SUPPLEMENTS in-text contextual links (Phase 2.3); it never replaces them, and it is not an
  excuse to dump "Related / Further reading" link lists at the end of an article.
- Author Experience Block: firsthand insight from the real named author that Oleg gives (`site.config.md`).
- Original Media / Photo Gallery: Oleg upload this by using svetlia cms - make sure all placements will be available to upload images. Add "Oleg uploads" for now under image placements
- Map Embed Block: interactive Google Maps iframe (Phase 3.5, embed-only); real
  GeoCoordinates still feed TouristAttraction schema.
- Information-Gain Block (`.infogain`): a visually flagged callout of 3-5 CURRENT data points
  competitors lack (Grok-sourced, Phase 6.5b). REQUIRED on the homepage and every substantial
  article. "Latest data" tag, bulleted facts written in the site's own voice (no visible
  citations, per 6.5b; sources kept on file under research/grok/), and a freshness note.
  Drives information gain (original quantitative evidence) for ranking + AI citation.
- Infographic Block: hand-authored SVG carrying real data, UNIQUE and CONCEPTUAL per page.
  REQUIRED on the homepage AND in every guide and substantial blog post. Make each a distinct
  visual idea a table cannot convey: a timeline, a stylized map, a journey/gradient, a
  weighted-value breakdown, an eligibility/decision flow, an anatomy diagram. Do NOT render a
  table as an image, and do NOT reuse one generic "which option" / tour-card-style graphic
  across many pages (it duplicates the product cards and reads as filler). Each page gets its
  OWN topic-specific graphic with descriptive keyword-relevant alt + a caption. Author by hand
  as SVG (craft rules in Phase 3.4b); never use AI image generators for data graphics, which
  garble text and numbers.

## 4.3 PER-BLOCK SCHEMA INJECTION
Schema lives in the relevant block, not one generic point:
- Breadcrumb → BreadcrumbList
- FAQ Accordion → FAQPage
- Tour/Product Card + tour page → Product + Offer + AggregateRating (legit ratings only)
- Map block → TouristAttraction with GeoCoordinates
- Hero/About → Organization / TravelAgency entity

## 4.4 FRESH-DATA SUPPORT
Author Experience, Itinerary, Pros/Cons, Tour Cards especially hold original up-to-date
observations; keep the verification date behind the scenes (4.1), not as a visible stamp.

## 4.5 BLOCK-TO-PAGE-TYPE MAPPING
- Homepage (hub) — these sections are MANDATORY on every site's main page (do not skip):
  Hero (hub), Quick Answer, Trust Strip, top Tour Cards (grid), author hook,
  **"A Typical Tour Day in <place>"** (narrative + timeline of the experience),
  a key compliance/booking callout, **Embedded interactive Location map** (a real
  Google Maps embed/iframe centred on the destination, NOT the static map — this is the
  explicit interactive-embed exception to Phase 3.5; accept the small CWV cost),
  **"Popular videos about <topic>"** (3 embedded YouTube videos, privacy-enhanced
  youtube-nocookie, lazy-loaded; flag the IDs for the operator to swap),
  **"Guarantee your spot"** (booking-reassurance CTA to the affiliate listings),
  a **unique proprietary data table** (Phase 6.5: real, attributed, hard-to-copy data such
  as a time-of-day comparison; the one searchable piece of info only this site has),
  an **information-gain block** (Phase 6.5b: 3-5 current Grok-sourced data points in the
  site's voice, beside the data table),
  an **availability widget** (date picker that routes to the official affiliate listing to
  check the real price/availability for the chosen date; NEVER a fabricated "it's available"
  claim, per the honesty rule and Phase 3.7),
  featured guides/blog grid (internal linking), **FAQ (mandatory, not optional)**,
  Why-trust/author block, CTA banner, breadcrumb/schema.
  - The homepage holds the CANONICAL FAQ. The standalone `/faq/` page keeps its content
    but sets `canonical` to the homepage to avoid duplication (its visible FAQ may be a
    superset/grouped view). Keep the homepage FAQPage JSON-LD in sync with the visible Q&A.
- Tour Category (sub-hub): Hero (hub), Quick Answer, Tour Cards (sorted by booking volume),
  Comparison Table, Key Facts, FAQ, CTA, Related, multi-point Map, schema.
- Individual Tour (money): Hero (money), Quick Answer, Key Facts, Product Card/booking CTA,
  Pricing & Inclusions, Itinerary, Pros/Cons, Author Experience, Original Media, Map embed
  (route + landmarks, Phase 3.5), Trust Strip, FAQ, Related, CTA. Schema: Product+Offer+AggregateRating,
  TouristAttraction, BreadcrumbList.
- Comparison: Hero, Quick Answer (verdict up top), Comparison Table (core), Pros/Cons per
  option, Key Facts, relevant Tour Cards, CTA, Related, FAQ, schema.
- Single-question AEO: Quick Answer (prominent), supporting detail, Key Facts/Infographic,
  author/research note, one CTA, cluster links, FAQPage/relevant schema. Lean.
- FAQ hub: light Hero, FAQ Accordion (grouped), links to AEO pages and tours, CTA. FAQPage.
- Informational guide / blog article: Hero (hub), Quick Answer, body with Infographics/Maps/
  Key Facts, an information-gain block (6.5b) and a unique data table, Author Experience,
  Pros/Cons where relevant, in-text contextual links (2.3) + Related, CTA, schema.
- About/author: Hero, expanded Author Experience (real credentials/photo), Trust Strip,
  Original Media, links. Organization/Person schema.
- /ai-learn-about-us: structured machine-readable summary, Key Facts, entity definitions,
  links to HTML sitemap + cluster hubs (Phase 7 spec). Minimal styling.

## 4.6 DELIVERABLES (handoff to Phase 5 and 8)
Full data-first block library with integrity guardrail; per-block schema assignments;
honesty constraints; fresh-data support; block-to-page-type mapping; image-source tag per
block (uploaded vs generated).
