# 06-content-engine.md — Phase 6: Content & Copywriting

Generic. Read site specifics from `site.config.md`. Global rules live in root `CLAUDE.md`.

## PURPOSE
Run the proven content-machine template as the permanent content engine, adapted per site,
reconciled with the affiliate model and the honesty guardrails. Template mechanics carry
over; this file records the affiliate-site adaptations.

## 6.1 ADOPT THE CONTENT TEMPLATE (mechanics unchanged)
- Step 0 confirm-before-writing: present 6–8 question-format H2s, confirm site/author/data
  from `site.config.md`, wait for Oleg's approval ("everything is good - go ahead").
- Four-phase research: hard data (official sources, flagged with source + date), social
  intelligence (fail points + success patterns), general landscape (gaps + angles),
  synthesis.
- Synthesis rules: no borrowed tips; sensory transformation; contrarian when true;
  proprietary framing.
- Writing rules (also root): varied sentence length; no em dashes ever; no stacked
  parallels; uneven paragraphs; no banned vocabulary; no templated openers; sensory first
  paragraph; no bullet-only sections.
- Atomic answer blocks: every H2 a real search question, bold 40–60 word self-contained
  answer immediately below, then expansion.
- Island Test (each 300–400 word section self-contained, inverted pyramid); scannable
  structure (TL;DR top, question subheadings, AT LEAST 3 real data tables, PLUS the
  information-gain block (6.5b) and a relevant infographic). Each table must carry real,
  useful, non-overlapping data (e.g. a comparison, a cost/time matrix, a requirements or
  eligibility grid, a by-type breakdown), never filler rows to hit a count. Do NOT print cosmetic
  "Verified [date]" / "Last updated [date]" stamps in visible copy (they date the page and
  were removed sitewide). Track the verification date behind the scenes only (research files
  or an HTML comment), and prefer wording like "current starting price" over a stamped date.
- Information gain: at least one insight not on Google's first page, from synthesized social
  research, in the site's own voice.
- Per-article schema; full quality checklist; WordPress-ready HTML fragment output (no
  html/head/body); image alt-text comments.

## 6.2 PER-SITE SETUP
From `site.config.md`: site name, URL, the real author (real photo, honest role, genuine
credentials, no invented awards), and standing data limited to real verifiable figures.

## 6.3 BUSINESS-MODEL RECONCILIATION (affiliate for a real operator selling via GetYourGuide + Viator)
- CTAs route to affiliate links ("here's where to book it," "check live
  availability and prices on GetYourGuide"), varied language; never an interruption.
- Author voice matches the real relationship. And first-person experiential writing
- IN-TEXT affiliate placement: besides the standard end CTA block, weave at least one
  affiliate link INTO the body of every article at a natural "if you book / here's the one
  to book" moment, sitting right beside an internal link to the matching money/tour page
  (e.g. "book a licensed one like the [Tour Name](/tours/slug/) and
  <a ... >check live availability and prices</a> on the operator's official listing").
  Affiliate/sponsored outbound links MUST carry `rel="sponsored noopener" target="_blank"`.
  Use the approved CTA wording (Phase 4) for the affiliate anchor. One in-text affiliate
  link per article is enough; do not stuff.

## 6.4 FTC AFFILIATE DISCLOSURE
Present sitewide in the footer (placement/text from `site.config.md` > FTC DISCLOSURE).
Plain language identifying the affiliate relationship.

## 6.5 PROPRIETARY DATA TABLE (mandatory on the homepage)
Every site's main page MUST include at least one unique, searchable data table that only
this site presents, the kind of comparison an AI engine or searcher can lift and cite:
e.g. a time-of-day comparison (price / crowds / light / best-for), a what-to-pack matrix, a
month-by-month seasonality table, or attributed volume stats ("rated 4.8 across 3,200+ GYG
reviews"). Rules: every figure is real and attributed to its source (the verification date is tracked
behind the scenes, not printed as a visible stamp — see 6.1);
qualitative columns are credited to the real named author's firsthand judgment, not invented
stats. Aim for the FRESHEST possible data; if live/seasonal data is needed, Oleg can connect
the Grok API (it can pull current information on the topic) to refresh the table. Placeholders
only when visually flagged with `<!-- NOTE FOR OLEG: replace placeholder data before publishing -->`.

## 6.5b INFORMATION-GAIN BLOCK (Grok-sourced fresh data; homepage + every article)
Mandatory on the homepage AND every substantial article: a visually distinct block of 3-5
CURRENT, specifically-sourced data points that competitor pages do not carry. Rationale:
the On-Page.ai information-gain study found original quantitative evidence is the single
strongest correlate of top-3 rankings (pages with 15+ unique data points scored 62/100 vs
40/100), and such figures are the most liftable, citeable content for AI answer engines.
Consensus facts are "cost of entry"; original/fresh numbers are the differentiator.
- SOURCE via the xAI Grok Agent Tools API (it reads live web + X/Reddit that other models
  cannot): endpoint `https://api.x.ai/v1/responses`, model per `site.config.md`, with
  `tools:[{type:"web_search"},{type:"x_search"}]` (the old `search_parameters` live-search
  is deprecated). Ask for STRICT JSON per point: `{fact, source_name, url, date}`, 3-5
  points, 2024-onward preferred, topic-specific. Run one query per page (homepage + each
  article); re-query weak topics with a broader prompt before giving up.
- HONESTY: per Oleg's standing decision, Grok output is TRUSTED directly (it can see live
  sources we cannot independently verify). Oleg's display preference: present each point in
  the site's OWN confident first-person voice WITHOUT a visible "source, date" citation, so
  the block reads as the site's native current knowledge. Keep the raw Grok results (with
  their source URLs + dates) on file under `research/grok/` for internal traceability, but do
  not render them on the page. Hard limits that still hold: never invent or alter a number,
  and never claim the site ran a survey/study/poll it did not ("our research found" / "our
  data shows" are banned). Stating a real public figure in the site voice is fine;
  fabricating one or faking proprietary authorship is not. Drop a topic that returns nothing
  rather than pad.
- FORMAT: the `.infogain` callout (Phase 3 / Phase 4 block) with a "Latest data" tag, a
  bulleted list of the facts in the site's own voice (no visible citations, per the honesty
  note above), and a short freshness note (e.g. "A current snapshot, kept refreshed. These
  numbers move, so treat them as recent rather than fixed."). Place it mid-article near other
  visual data (e.g. right after the first infographic); on the homepage, beside the
  proprietary data table (6.5).
- KEY HANDLING: `XAI_API_KEY` lives in an untracked `.env` (gitignored), never committed.
  Data is baked into the page at authoring time, so the build and the CMS never need the key.
- MAINTENANCE: numbers age. Re-run the Grok refresh periodically; the block's own note says
  it is live-refreshed, so keep it honest by actually refreshing.


## 6.6 EXTERNAL AUTHORITATIVE LINKS (every article)
Every article links out to AT LEAST TWO authoritative external sources, each woven in-text
on the specific factual claim it supports (official bodies and primary sources first:
government, police, regulators, the standards body, the operator's own listing; then
reputable press and encyclopedic references). This builds trust, helps E-E-A-T, and gives
AI engines corroboration to cite. Place them on the claim, never in an end-of-article list
(same no-dumps rule as Phase 2.3).

HONESTY (ties to root CLAUDE.md honesty principle):
- Link a URL that comes from a TRUSTED source (Grok live search returning the source, an
  official site, the operator's listing) or that you have confirmed resolves. The one thing
  not to do is invent, guess, or pattern-match a URL from memory, which is how broken or wrong
  links happen. A Grok-returned source URL is trusted; you do not need to re-verify it by hand.
- If no trusted source backs a claim, OMIT the link rather than guess one. One solid link
  beats two guessed ones.
- Build a per-site VERIFIED-SOURCE WHITELIST during Phase 1 research (theme → exact URL,
  confirmed live). Link external sources only from that whitelist; re-verify before reuse on
  a new article. If a previously used source (e.g. a generic travel-guide page) is not on the
  whitelist, drop it rather than re-add it.
- Editorial external links are plain (followed); affiliate/sponsored links carry
  `rel="sponsored noopener"` (Phase 6.3). Keep the two kinds distinct.
- When delegating article writing to subagents, pass them the whitelist and this rule
  explicitly, then audit every external URL in the output against the whitelist before ship.

## 6.7 SCHEMA RECONCILIATION (ties to Phase 5)
Per-article schema (Article, FAQPage, Person, Organization, BreadcrumbList) reconciles with
the Phase 5 connected graph: Organization links to the TravelAgency `#agency` node; tour
pages add multi-typed `["Product","TouristTrip"]` with honest attributed aggregateRating;
TouristAttraction nests in itineraries; Person reflects the real author. No conflicting
graphs on a page.

## 6.8 DELIVERABLES
Adopted template configured per site with real author + real data; affiliate
reconciliations incl. in-text affiliate placement (rel=sponsored); external authoritative
linking rule with the verified-URL honesty guardrail + per-site source whitelist; no
end-of-article link dumps (links woven in-text, Phase 2.3); footer disclosure spec;
proprietary-table honest-sourcing + flagged-placeholder rule; information-gain block
(Grok-sourced fresh data on homepage + every article, 6.5b); honesty guardrails; schema
reconciliation with Phase 5.
