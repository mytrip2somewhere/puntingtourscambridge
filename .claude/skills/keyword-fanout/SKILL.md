---
name: keyword-fanout
description: >-
  Research a seed keyword with DataForSEO and produce a prioritized content-topic
  list driven by AI-search fan-out. Runs keyword expansion, live-SERP Google
  AI-Overview + PAA fan-out, DataForSEO AI Optimization (LLM Mentions / AI keyword
  search volume / ChatGPT fan-out when enabled), and keyword difficulty, then
  cross-references existing site content to output gap-prioritized topics. Use when
  Oleg asks to research keywords, find content topics, analyze fan-out / LLM / AI
  Overview queries, or plan what to write for a tour site.
---

# Keyword + AI Fan-out Research

Goal: hand back a **prioritized content-topic list** grounded only in **real DataForSEO
data** (never fabricate volumes, questions, or mentions). Blend Google demand with the
AI-search fan-out layer (Google AI Overview + ChatGPT), then rank by gap vs. what the
site already covers.

## Inputs
- Seed keyword (e.g. "punting cambridge"). Ask if not given.
- Target market: default `location_name: United Kingdom`, `language_code: en` for UK tour
  sites (use the site's market). NOTE: DataForSEO ChatGPT fan-out data is **US/English only**,
  so for the true-LLM step also run a `United States` / `en` pass.
- The site's existing content (list `src/pages/**`, `src/content/blog/*`, guides, tours) to
  mark each topic covered / strengthen / gap.

## Hard rules
- Real data only. Every volume, question, and mention comes from a DataForSEO response.
- **Payloads are huge** — Labs/SERP results overflow the tool result and auto-save to a file.
  Process with `jq` on disk; pull only compact `volume<TAB>keyword` rows into context. Never
  read the raw dump.
- Save the source record to `research/keyword-fanout-analysis-<YYYY-MM>.md`.

## Pipeline (run in order)

1. **Expansion** — `dataforseo_labs_google_keyword_suggestions` (long-tails containing the
   seed) and `dataforseo_labs_google_related_keywords` (depth 2; also returns Google's own
   "related searches" = fan-out). Filter `search_volume > 0`, order by volume, limit 100-150.
   jq each saved file to `volume<TAB>keyword`, dedupe to max-volume-per-keyword, and pull the
   nested `related_keywords[]` strings.

2. **Google AI Overview fan-out (any plan)** — `serp_organic_live_advanced` on the seed with
   `people_also_ask_click_depth: 2`. From the result extract:
   - `people_also_ask` items where `expanded_element[].asynchronous_ai_overview == true` →
     these are the questions Google answers with an **AI Overview**. Own each verbatim.
   - `people_also_search` and `related_searches` item lists.
   - Note SERP shape (commercial_units / local_pack / organic) to judge competitiveness.

3. **True LLM layer (needs `AI_OPTIMIZATION` module)** — find the tools with
   `ToolSearch("dataforseo ai optimization llm mentions keyword search volume fan-out")`.
   If absent, the module isn't enabled: say so, use steps 1-2 as the proxy, do NOT invent
   LLM data. (Enable: add `AI_OPTIMIZATION` to `ENABLED_MODULES` in `~/.claude.json`
   dataforseo env, then restart Claude.)

   **READ THIS FIRST — `ai_opt_llm_ment_search` is a SUBSTRING MATCH over the
   question+answer text, NOT a topic search.** A question that does not literally contain
   your target string is *structurally invisible* — not low-ranked, unreachable. Targeting
   only the seed is the single biggest failure mode of this skill (on the Cambridge run it
   returned 7 questions and hid the largest cluster in the dataset).

   Mandatory method — **do not skip a row or a platform**:
   - **Sweep a TARGET MATRIX**, one call per row, never just the seed:
     | row | example (seed "punting cambridge") |
     |---|---|
     | exact term | `punting cambridge` |
     | generic term(s) | `punting`, `punt` (word_match) |
     | place / entity | `river cam`, `cambridge` |
     | landmarks / features | `college backs`, `mathematical bridge` |
     | adjacency (the broader conversation the product is an *answer* to) | `visit cambridge`, `things to do cambridge` |
   - **Run BOTH platforms** for each row: `platform: "chat_gpt"` AND `platform: "google"`.
     They return different universes (Cambridge: 66k vs 424k chars). ChatGPT data is
     US/English only; Google AIO also worth a UK pass.
   - **Loop until dry**: log the question count per sweep; keep adding target rows until a
     sweep yields no new questions. Only then is the universe covered.
   - **VOLUME-SORT TRAP**: `order_by ai_search_volume desc` + `limit` on a broad target
     buries the niche under homonyms (a `cambridge` sweep returned 500 items with ZERO
     punting queries — all Cambridge Dictionary / Cambridge MA / the Boat Race). Filter by
     relevance with grep; never trust top-N.
   - Extract per item: `question`, `ai_search_volume`, `fan_out_queries`, `sources` +
     `search_results` (which domains the LLM cites), `brand_entities`. Merge and dedupe
     across all sweeps by lowercased question, keeping max volume.
   - Also run `ai_optimization_keyword_data_search_volume` on the priority keyword set for
     true **AI search volume**, and compare it against Google volume — large divergence is
     the finding, not an error (Cambridge: "punting cambridge prices" = 3,600 Google / 0 AI).
   - Check whether the site's own domain appears in `sources`; list the domains that do
     (those are the AI-citation competitors).

4. **Winnability** — `dataforseo_labs_bulk_keyword_difficulty` on ~15 priority head terms.

5. **Gap map** — cross-reference every cluster against existing pages: `covered` /
   `strengthen` (exists but should own the AIO/LLM answer) / `gap` (new page).

6. **Prioritize & deliver** — score = real search volume x fan-out presence (AIO/LLM) x
   (low difficulty = winnable) x affiliate intent x gap. Output:
   - The verbatim AIO/LLM fan-out **questions to own**.
   - A tiered table: Topic | monthly volume | AIO/LLM fan-out? | KD | status | action.
   - A recommended build order (start with low-KD + fan-out-triggered gaps/strengthens).

## Completeness gate — answer these IN THE OUTPUT before delivering
A coherent result is not a complete result. State explicitly:
1. Which **target-matrix rows** were swept, and the question count each returned.
2. Both platforms run for each row? If not, say which are missing and why.
3. Did the last sweep add **zero** new questions (dry)? If not, keep sweeping.
4. Is the site's own domain in `sources` yet, and which domains own the citations?
5. Any cluster where **Google volume and AI volume disagree sharply** (report it — it
   changes strategy: high-Google/zero-AI pages will never earn AI citations).
If you cannot answer 1-3, you have not finished the research — do not present a topic list.

## Notes
- Keep it honest: if the LLM module isn't connected, label the AI layer as the
  Google-AI-Overview proxy, not ChatGPT data. If a dataset is genuinely small (the
  Cambridge ChatGPT sample is ~15 questions), say so — that is the ceiling of the data,
  not a shortfall of the sweep, and the user should know which it is.
- Expect the biggest AI cluster to be **adjacent, not exact**: LLM users ask about the
  destination ("what is X known for", "is X worth visiting", "best way to tour X") and the
  product is the *answer*. Those questions never contain the product keyword — only the
  target matrix finds them.
- This skill only researches and prioritizes. Building the pages is Phase 4/6 work.