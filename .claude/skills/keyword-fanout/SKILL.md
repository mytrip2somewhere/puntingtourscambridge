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
   Pull ChatGPT + Google-AIO **fan-out queries**, **LLM mention volume**, and **AI keyword
   search volume** for the seed and top expansions (US/English for ChatGPT). If the tools
   are absent, the module isn't enabled — say so and proceed with steps 1-2 as the fan-out
   proxy (do NOT invent LLM data). To enable: add `AI_OPTIMIZATION` to `ENABLED_MODULES`
   in `~/.claude.json` (dataforseo env) and restart Claude.

4. **Winnability** — `dataforseo_labs_bulk_keyword_difficulty` on ~15 priority head terms.

5. **Gap map** — cross-reference every cluster against existing pages: `covered` /
   `strengthen` (exists but should own the AIO/LLM answer) / `gap` (new page).

6. **Prioritize & deliver** — score = real search volume x fan-out presence (AIO/LLM) x
   (low difficulty = winnable) x affiliate intent x gap. Output:
   - The verbatim AIO/LLM fan-out **questions to own**.
   - A tiered table: Topic | monthly volume | AIO/LLM fan-out? | KD | status | action.
   - A recommended build order (start with low-KD + fan-out-triggered gaps/strengthens).

## Notes
- Keep it honest: if the LLM module isn't connected, label the AI layer as the
  Google-AI-Overview proxy, not ChatGPT data.
- This skill only researches and prioritizes. Building the pages is Phase 4/6 work.