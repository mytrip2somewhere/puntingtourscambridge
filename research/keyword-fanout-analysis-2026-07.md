# Punting Cambridge — Keyword + Fan-out Analysis (DataForSEO, 2026-07)

Location: United Kingdom · Language: en. All figures are real DataForSEO pulls.
Method: keyword_suggestions + related_keywords (expansion) → SERP live advanced
(AI Overview / PAA fan-out) → bulk_keyword_difficulty. Files under tool-results/.

UPDATE 2026-07-14: `AI_OPTIMIZATION` module enabled — the true LLM layer below is now
real data (ai_optimization_keyword_data_search_volume + ai_opt_llm_ment_search,
platform chat_gpt, US/English). The Google AI Overview PAA trigger data
(`asynchronous_ai_overview: true`) remains valid as the AIO layer.

## LLM LAYER — real AI search volume (ChatGPT, US/en, monthly)
punting cambridge 114 (summer peak 270) · how to punt cambridge 32 · is punting worth it
in cambridge 27 · how much is punting in cambridge 26 · what is punting in cambridge 17 ·
how long is punting 6 · cambridge punting companies 5 · punting tours cambridge 3 ·
do you need to book 1.
ZERO AI volume (despite big Google volume): punting cambridge prices (3,600 on Google!),
cheap punting, self-hire, winter, for 2, tickets, oxford vs cambridge, with kids,
best time to go punting, punting stations.
=> KEY DIVERGENCE: people ask LLMs conceptual "what/how/worth-it/where" questions;
they do NOT ask LLMs for prices. Google demand != AI demand. Optimize each separately.

## LLM LAYER — COMPLETE ChatGPT universe (15 unique Qs, AI vol; 4 target sets swept)
- 64 · what is the best time of year to visit cambridge?   [GAP]
- 53 · what are the best cambridge hotels with a river view?  [adjacent; low fit]
- 37 + 31 · what is cambridge, uk best known for? (2 phrasings)  [GAP]
- 26 · which is prettier, cambridge or oxford?  [have punting-vs only]
- 22 + 12 · is punting worth it in cambridge? (2 phrasings)  [COVERED]
- 19 · what is cambridge, england famous for?  [GAP]
- 15 · is cambridge, england worth visiting?  [GAP]
- 15 · what is within a 2 hour train ride from london?  [discovery GAP]
- 14 · where is the best place to punt in cambridge?  [GAP]
- 14 · where is the best place to go punting in cambridge?  fan-out: "best punting companies cambridge uk"  [GAP]
-  9 · where is the best punting route in cambridge?  [COVERED: college-backs]
-  4 · what is the best way to tour cambridge?  [GAP]
-  2 · what to do in cambridge for adults?  [partial]
=> CLUSTER A "where to punt / best place / which company / route" = ~37 AI vol.
=> CLUSTER B "what is Cambridge known for / famous for / worth visiting / best way to
   tour / best time to visit" = ~106 AI vol. BIGGER than all punting-specific queries
   combined, and it is where LLMs recommend punting. Total content gap today.

## LLM LAYER — Google AI Overview universe (49 queries; punting-relevant)
punt boat / punt boats / punts boat 1,900 EACH (definitional!) · cambridge uk attractions
1,000 · river cam 390 · what is punting in england 210 · river cam punting 210 · punting
on the river cam cambridge 210 · uk punt 170 · activities cambridge 170 · punting on the
river cam 140 · cambridge punting companies 140 · what is cambridge known for 110 ·
river punting / punting tours / punting river 110 · oxford or cambridge to visit 110 ·
easy day trips from london 110 · cambridge day tour 110 · punting company 90 ·
what is punting in cambridge 70 · what does punting mean in england 30.
=> "cambridge punting companies" is the THIRD independent signal for the same missing
   page (Google search 3,600 + ChatGPT 28 + AIO 140).
=> Definitional "what is a punt boat / what is punting" is far bigger than expected.

## METHOD NOTE — why the first pass missed all of Cluster B (do not repeat)
`ai_opt_llm_ment_search` is a SUBSTRING MATCH over question+answer text, NOT a topic
search. Targeting only `keyword: "punting cambridge"` returned 7 questions and made every
question lacking that literal phrase ("what is cambridge known for?") structurally
invisible. Fixes now mandatory: sweep a TARGET MATRIX (exact term / generic term / place /
landmarks / adjacency), run BOTH platforms (chat_gpt AND google — different universes:
66k vs 424k chars), and loop until a sweep adds no new questions.
VOLUME-SORT TRAP: sorting by ai_search_volume desc + limit on a broad target ("cambridge")
returned 500 items with ZERO punting/tourism queries — all buried under Cambridge
Dictionary / Cambridge MA / the Boat Race. Filter by relevance; never trust top-N.
SATURATION: the punting ChatGPT sample is genuinely small (~15 Qs) — that is the whole
dataset, not a shortfall of the sweep.

## LLM LAYER — domains ChatGPT cites (frequency)
scholarspuntingcambridge.co.uk 6 · visitcambridge.org 5 · traditionalpuntingcompany.com 5 ·
scudamores.com 5 · cambridgepuntcompany.co.uk 4 · cambridge.gov.uk 4 · wanderlog 3 ·
tripadvisor 3 · wikipedia 3 · reddit 2 · cambridgepunting.net/.co 2.
Brand entities named: Cambridge Punt Company, Scudamore's, Let's Go Punting, Granta
Moorings; places: River Cam, The Backs, Mathematical Bridge, King's College Chapel.
puntingtourscambridge.com: 0 mentions (expected — launched + indexable only 2026-06-27).
=> To get cited, be the best "where/which company/route" resource; operator + official
(.gov.uk) + visitcambridge sites currently own the citations.

## AI Overview fan-out questions (from live SERP PAA, all AIO-answered)
- How much does punting cost in Cambridge?
- Is punting worth it in Cambridge?
- What is the best punting tour in Cambridge?
- What is punting in Cambridge?
- Can you just turn up for punting in Cambridge?
- How much is punting in Cambridge for 2?

## People-also-search / related-search fan-out (real SERP)
Cheapest punting tour · Cambridge punting discount code · Scholars discount code ·
Cambridge punting tickets · Self-hire punting prices · Do you need to book ·
Punting cambridge location · directions · student discount · opening times.

## Head-term volumes (monthly, UK)
- punting (in) cambridge — 12,100
- let's go punting cambridge (competitor brand) — 8,100
- punting tour(s) cambridge — 4,400
- punting company / companies cambridge — 3,600
- prices/cost cluster (punting cambridge prices/cost) — 3,600
- cambridge punt company — 2,900 ; scudamore's — 2,900 ; rutherford's — 1,900
- river punting cambridge — 590 ; booking — 480 ; trinity — 480 ; scholars — 390
- how much is punting — 260 ; what is punting — 170 ; cheap punting — 110 ;
  best punting tour/company — 110 ; winter punting — 70 ; oxford vs cambridge — 70 ;
  how long — 30 ; is punting difficult — 20 ; family punting — 10

## Keyword difficulty (0-100)
how much is punting 1 · punting cambridge prices 4 · what is punting 7 · cheap punting 8 ·
punting cambridge for 2 25 · cambridge punting tickets 28 · punting cambridge 31 ·
best punting tour 32 · cambridge punting companies 33. (book/turn-up, how-to-punt,
self-hire, winter, stations, afternoon-tea: too little data = low competition.)
