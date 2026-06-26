# 07-aeo-llm.md — Phase 7: AEO / LLM Optimization

Generic. Read site specifics from `site.config.md`. Global rules live in root `CLAUDE.md`.

## PURPOSE
Maximize odds of being ingested and cited by AI engines (ChatGPT, Perplexity, Google AI
Overviews, Gemini) via clean answerable structure, a machine-readable entity summary, and a
concrete rule for when a question earns its own page. Builds on Phase 4 answer-first blocks,
Phase 5 schema graph, Phase 2 clusters.

## 7.1 TWO-TIER THRESHOLD RULE (anti-sprawl logic gate)
Every candidate question runs through this gate.

Standalone-page filter: a question earns its own long-tail URL only if it meets at least
one of:
1. It requires detailed multi-step treatment (e.g. a compliance matrix with official
   documentation links) that cannot be resolved in a short accordion answer.
2. It maps to a Phase 1 DataForSEO query with clear search volume, or to documented LLM
   demand.

Documented LLM demand, defined concretely (so condition 2 isn't subjective): evidenced by
at least one of:
- Appears in PAA / autocomplete / related-searches from the Phase 1 pull
- Recurs as a real question across Phase 2 social mining (not a one-off)
- Surfaces as an AI Overview or featured-snippet target on the live SERP
If none evidence it and it has no search volume, it does not qualify as a standalone page.

Accordion-hub filter: if the answer is a straightforward factual confirmation fully
resolvable in under 150 words without a comparison table, it stays as an accordion block in
the global FAQ hub.

## 7.2 SINGLE-QUESTION AEO PAGES
For questions passing the standalone filter: lean and focused (Phase 4 AEO mapping):
prominent answer-first atomic block, supporting detail, relevant Key Facts/Infographic,
author/research note, one contextual CTA, internal links back into the cluster. The atomic
answer fully resolves the question, plain language, quotable. Compliance-type pages carry
verified facts with source + date (Phase 1), never invented.

## 7.3 /ai-learn-about-us PAGE (machine-readable entity map)
Clean, distraction-free, machine-readable summary for AI crawlers (Perplexity, OpenAI user
agents, Google-Extended), bypassing visual UI. Contents:
- One clear entity-defining statement (site name, what it covers, who it serves)
- Who runs it + real author/credentials (entity clarity for Person/Organization graph)
- Core factual summary: the experience, key rules (from compliance research if ON) stated
  plainly with their real source (the verification date is tracked behind the scenes, not
  printed as a cosmetic stamp — see 04/06), locations with coordinates
- The tour set, attributed honestly (real ratings/booking data)
- Clear quotable factual statements an LLM can lift cleanly
- Links to the HTML sitemap and cluster hubs (Phase 2) for agent traversal
- Minimal markup, clean semantic structure, no heavy styling

## 7.4 llms.txt AT ROOT
Output a standard `llms.txt` at root as a machine-readable index pointing to high-density
summary files and primary entity guides (/ai-learn-about-us, HTML sitemap, key cluster hubs).
Honest framing: low-cost and worth doing, but adoption is uneven and not universally honored
like robots.txt, so it's a supporting signal. /ai-learn-about-us and on-page schema remain
the primary AEO mechanisms.

## 7.5 SITEWIDE AEO REINFORCEMENT (ties to earlier phases)
Answer-first atomic blocks everywhere (Phase 4); quotable self-contained statements (Island
Test, Phase 6); comparison tables (AI engines cite heavily); strong connected schema graph
(Phase 5); off-site mentions/citations (Reddit, forums, Oleg's channels); entity clarity
throughout (consistent naming, `#agency` anchor, clear author identity).
- INFORMATION GAIN: original, freshly-sourced quantitative data is both the strongest ranking
  correlate and the most liftable content for AI answer engines. The Grok-sourced
  information-gain block (Phase 6.5b) on the homepage and every article is a primary AEO
  lever, not a nice-to-have: it gives engines specific, current figures they can lift and
  cite (presented in the site's voice; the source record is kept on file, per 6.5b).

## 7.6 DELIVERABLES
The concrete two-tier gate with documented-LLM-demand defined by evidence sources; single-
question AEO page spec; /ai-learn-about-us content spec; llms.txt requirement with honest
weighting; sitewide AEO reinforcement checklist tied to Phases 2, 4, 5, 6.
