# 02-architecture.md — Phase 2: Information Architecture

Generic. Read site specifics from `site.config.md`. Global rules live in root `CLAUDE.md`.

## PURPOSE
Turn the Phase 1 content map into a crawlable, semantically clear structure: page types,
URLs, navigation, internal linking, schema placement, special pages. Built so both
Google interaction signals and AI crawlers can map the site's authority.

## 2.1 PAGE TYPES & SEMANTIC CLUSTERS
Every page is one type and belongs to a named topic cluster (not a flat pile):
homepage (hub), tour category pages (sub-hubs), individual tour pages (money pages),
comparison pages, single-question AEO pages, FAQ hub, informational guides, trust pages
(About/author, contact, disclosure, privacy), /ai-learn-about-us, HTML sitemap.
Each cluster has a clear hub, spokes, and defined relationships.

## 2.2 URL STRUCTURE
Flat-ish, keyword-rich, readable, lowercase, hyphenated. No dates, no IDs. Shallow
folders; cluster relationships live in links + breadcrumbs. Target specific long-tail in
slugs, not the exact-match phrase repeated (EMD note). Examples: `/tours/`,
`/tours/<tour-slug>/`, `/compare/<a-vs-b>/`, `/guides/<topic>/`, `/faq/`,
`/ai-learn-about-us/`.

## 2.3 INTERNAL LINKING (three layers)
- Vertical: homepage → category hubs → tours, and back up. Equity flows down to money pages.
- Horizontal sibling bridges: related spokes link directly to each other on real user
  intent patterns from Phase 1, with contextual anchors. Keeps users cross-shopping inside
  the cluster (the engagement layer).
- Contextual in-content links: natural links inside body copy to the most relevant page.
  Highest weight, most natural. WEAVE EVERY LINK INTO THE PROSE at the phrase that names
  the destination (e.g. "kids cannot drive these" → the kids article; "the tours I guide"
  → the tours hub). NEVER append a "Related" / "Further reading" / "See also" list at the
  end of an article: end-dumps read as filler, are easy for users to ignore, and carry less
  weight than a contextual anchor. Counts: 2-4 in-text links on a short page; 5-9 on a
  substantial article (the relevant hub, the most relevant money/tour page, the comparison
  page, the key guide, AND 2-3 sibling articles in the same cluster). Never link a page to
  itself; vary the anchor (Phase 2.4).
- Blog/article cross-linking: every article must link 2-3 sibling articles in its cluster
  in-text, so posts are not orphaned with only the hub linking in. Run an orphan/inbound
  check after writing (Phase 2.13) and shore up any article sitting on a single inbound link.
- Related-tours block (Phase 4) reinforces the horizontal layer, but it SUPPLEMENTS the
  in-text contextual links above, it does not replace them.

## 2.4 ANCHOR TEXT RULES
- Primary anti-cannibalization lever is targeting: one primary keyword per page, no two
  pages competing for the same term. (This, not anchor avoidance, prevents cannibalization.)
- Vary anchors: exact-match used sparingly and only to the homepage; plus partial-match,
  navigational ("our booking hub," "compare all tours," "back to all <X> tours"), brand.
- Never repeat the identical exact-match phrase across many internal links.
- EMD reality: brand ≈ keyword, so lean on navigational/partial-match for variety.
- Contextual anchors describe the destination page accurately; no stuffing.

## 2.5 NAVIGATION (mobile-first)
Lean header: main clusters only (e.g. Tours, Guides, Compare, FAQ, About). Thumb-reachable,
no hover-dependent dropdowns, proper tap targets. Top commercial paths reachable in one tap.
Consistent across all pages.

## 2.6 FOOTER
Secondary nav + trust: About/author, contact, affiliate disclosure, privacy, HTML sitemap,
/ai-learn-about-us. A compact set of key cluster links. Affiliate disclosure present
sitewide. Footer MUST show a contact email (mailto:) and a "Contact us" link to a `/contact/`
page. DEFAULT contact page is email-only (no form): a small-business message ("for any
question, email us at info@<domain>, we reply as fast as we can") with a mailto button and
a link to the comparison page. This is the approved pattern — do not add a third-party form
(Web3Forms/Formspree) unless the site owner explicitly asks for one. ContactPage schema +
breadcrumb still required. Social icons (Instagram, TikTok, Facebook, YouTube) using `site.config.md` >
SOCIAL LINKS (real URLs or platform-search fallback).

## 2.7 BREADCRUMBS
On every page below the homepage, reflecting cluster hierarchy. Feeds BreadcrumbList schema
(Phase 5). Keeps perceived depth shallow.

## 2.8 SITEMAPS
- XML sitemap: auto-generated, all indexable pages, submitted in Phase 11. Excludes noindex.
- HTML sitemap (AI navigation beacon): human-readable, grouped by cluster, clean semantic
  wrappers. Linked from footer and from /ai-learn-about-us so LLM agents can traverse.

## 2.9 SCHEMA PLACEMENT MAP (feeds Phase 5)
- BreadcrumbList: every page below homepage
- Organization / TravelAgency: homepage + About (sitewide via the org entity); the homepage
  org node carries logo + description so it can anchor a knowledge panel
- ItemList (of the featured tours, each a Product/TouristTrip with Offer + AggregateRating):
  the tour category hub AND the homepage tour grid
- Product + Offer + AggregateRating: individual tour pages (ratings only where legitimate)
- TouristAttraction nested in Itinerary (with GeoCoordinates): tour pages passing landmarks
- FAQPage: FAQ hub and any genuine Q&A block
- /ai-learn-about-us reinforces entity definitions sitewide

## 2.10 CANONICAL & DUPLICATE RULES
Self-referencing canonical on all indexable pages. Near-duplicate tour pages each need
distinct primary content and a self-canonical (never canonical to each other unless truly
duplicate). No parameter/session URLs indexed. Comparison pages must add unique value, not
restate two tour pages.

## 2.11 ACCESSIBILITY (nav/footer; ties to Phase 3)
Semantic `<nav>`/`<header>`/`<footer>`, keyboard navigable, visible focus, logical tab
order, AA contrast, descriptive link text, accessible mobile menu with ARIA on the toggle.

## 2.12 SPECIAL PAGES
- /ai-learn-about-us: footer + HTML-sitemap linked; links back to HTML sitemap and cluster
  hubs. Canonical machine-readable summary. (Spec in Phase 7.)
- About/author: real E-E-A-T persona (named author, firsthand experience, photo, bio),
  linked from footer and bylines.

## 2.13 CRAWL HYGIENE
3-click depth (every page reachable from homepage within 3 clicks). Orphan check (no
indexable page without an internal link in). Stable global nav/footer.

## 2.14 DELIVERABLES (handoff to Phase 3 and 5)
Typed page list in clusters; URL/slug map; internal-linking plan (vertical map, sibling
pairs, contextual rules, anchor rules); header + footer specs; breadcrumb scheme;
XML+HTML sitemap plan; schema-placement map; canonical ruleset; nav/footer accessibility
requirements; placement plan for /ai-learn-about-us and About/author.
