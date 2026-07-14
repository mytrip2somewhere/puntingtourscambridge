# Source record: /guides/what-is-punting/

Verified 2026-07-14. Behind-the-scenes record only, not for on-page display.

## Method

- Grok live search via xAI Agent Tools API (`grok-4.3`, `web_search`) for a first pass.
- Then direct fetch of the primary reference (Wikipedia, Punt (boat)) to quote exactly,
  because Grok's first answer on the Cambridge-vs-Oxford end was imprecise and needed
  checking against source wording.
- Etymology cross-checked on etymonline and Wiktionary.

## Claims made on the page, and what each stands on

| Claim on page | Source | Status |
|---|---|---|
| A punt is flat-bottomed, square-cut at both ends, has no keel | Wikipedia, Punt (boat) | Verified, quoted |
| Draft is only a few inches even when fully laden; suits shallow water | Wikipedia, Punt (boat): "a punt has no keel, the draw of the boat is only a few inches even when fully laden, which makes the boat very manoeuvrable and suitable for shallow waters." | Verified, quoted |
| A traditional punt is about 24 ft (7.3 m) long and 3 ft (0.91 m) wide, sides about 18 in (0.46 m) deep | Wikipedia, Punt (boat), verbatim | Verified, quoted |
| Both ends have a long shallow "swim" (underside slopes gently at front and back) | Wikipedia, Punt (boat) | Verified, quoted |
| The till (also "counter") is a short strengthening deck extending about six feet (1.8 m) from one end; terms borrowed from cabinet making | Wikipedia, Punt (boat), verbatim | Verified, quoted |
| A pole is about 12 to 16 ft (3.7 to 4.9 m) long and weighs about 10 lb (5 kg) | Wikipedia, Punt (boat), verbatim | Verified, quoted |
| Pleasure punt poles are normally spruce wood or aluminium alloy tube | Wikipedia, Punt (boat), verbatim | Verified, quoted |
| Propelled by pushing a pole against the river bed, not rowed or paddled | Wikipedia, Punt (boat) | Verified |
| Cambridge: punters stand on the till (the flat end) and punt with the open end forward. Oxford: they stand inside the boat and punt with the till forward | Wikipedia, Punt (boat), verbatim: "in Cambridge most punters stand on the till (the flat end) and punt with the open end forward, while in Oxford they stand inside the boat and punt with the till forward." | Verified, quoted. This is the fact Grok got fuzzy on; corrected against source. |
| The till end is often called the "Cambridge End", the other the "Oxford End" | Wikipedia, Punt (boat), verbatim | Verified, quoted |
| Steering: beginners let the pole float up and trail it like a rudder; more experienced punters steer during the stroke rather than using the pole as a rudder | Wikipedia, Punt (boat): "At the end of the stroke, relax and allow the pole to float up like a rudder behind you"; "more experienced punters steer during the stroke instead of using the pole as a rudder" | Verified, quoted. Note the nuance: the rudder trail is the beginner method, not the only method. Page states it that way. |
| Recovery is pulling the pole hand over hand until you can throw it down again | Wikipedia, Punt (boat) | Verified |
| Traditional Thames pleasure punts were not introduced to Cambridge until about 1902 to 1904 | Wikipedia, Punt (boat), verbatim | Verified. Consistent with the existing site post /blog/history-of-punting-cambridge/. Page links out rather than restating the full timeline. |
| Pleasure punting on the Cam began around the start of the 20th century | Wikipedia + puntcambridge.co.uk history page (via Grok) | Verified as approximate; page says "around 1900" and "roughly 1902 to 1904", matching the existing blog post |
| "Punt" (the boat) is attested c. 1500, probably from British Latin *ponto* "flat-bottomed boat", from Latin *pons* / *pontem* "bridge" | etymonline, punt (n.2), verbatim: "flat-bottomed, square-ended, mastless river boat," c. 1500 | Verified, quoted |
| The unrelated British sense of "to punt" meaning to bet or gamble | Wiktionary, punt: verb sense "To stake against the bank, to back a horse, to gamble or take a chance more generally", marked Australian, Ireland, New Zealand, UK | Verified. Page presents it as a separate, unrelated sense, which is what the dictionary marking supports. |

## Established site facts reused (already verified elsewhere in the repo)

- A chauffeured College Backs punt runs about 45 to 50 minutes.
- The Backs pass King's, Clare, Trinity, St John's, the Bridge of Sighs and the Mathematical Bridge.
- The Conservators of the River Cam license six punting stations.
- Punting runs year-round except Christmas Day.

## Considered and deliberately LEFT OUT (not verified well enough)

- **Passenger capacity of a Cambridge punt.** Grok returned "typically up to 12" citing two
  operator sites (Scholars Punting, Cambridge Punt Company). That is an operator-specific
  configuration, not a property of the boat, and it varies by company and by shared vs private.
  Not stated as a fact on the page. The page says capacity varies by operator and points to
  the live listing instead.
- **Any price figure.** Prices are dynamic. The page gives no numbers and routes to
  /guides/cambridge-punting-prices/ and the live official listings.
- **A specific date for the "first" pleasure punt on the Cam.** Sources give a range, not a
  year. Page keeps the range.
- **Why the Cambridge and Oxford styles diverged.** No trustworthy source found for the origin
  story of the difference. The page states the difference (verified) and does not explain it.
- **Punt pole "quant" terminology.** Grok mentioned "quant" as a synonym for the pole. Not
  confirmed against a primary source for the Cam specifically, so it is not used on the page.
- **Weight of a punt / build timber species.** Not verified, not stated.

## Sources

- https://en.wikipedia.org/wiki/Punt_(boat) (primary reference for boat design, dimensions, till, pole, stroke, steering, Cambridge/Oxford ends, 1902 to 1904 Cambridge introduction)
- https://www.etymonline.com/word/punt (etymology, c. 1500, British Latin *ponto*)
- https://en.wiktionary.org/wiki/punt (verb senses, including the UK betting sense)
- https://www.cambridge.gov.uk/punting (licensed stations, reused site fact)
- https://puntcambridge.co.uk/a-brief-history-of-punting-part-i/ (via Grok, corroborating c. 1900 pleasure punting on the Cam)
