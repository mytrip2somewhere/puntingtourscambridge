# site.config.md — Per-Site Configuration

This is the ONLY file you edit to launch a new site. The pipeline (CLAUDE.md +
`.claude/` phase files) reads every site-specific value from here and otherwise
stays generic.

---

## IDENTITY
- Site name: Punting Tours Cambridge
- Domain: puntingtourscambridge.com
- Exact-match domain (EMD): yes
- Primary keyword (the head term the domain owns): Cambridge punting tours
- Location / destination focus: Cambridge, England, UK; the River Cam and the College Backs

## MODEL
- Affiliate (GetYourGuide / Viator) sending bookings to real Cambridge punting tours.
- Operator official business name: not named on-page (the author guides under several agencies;
  schema/attribution uses the site brand + the named author, not a single operator entity).
- Named author / expert byline: Jordan Harrington (see AUTHOR).
- Primary KPI: affiliate clicks / bookings to GetYourGuide and Viator.

## AUTHOR (must be a real person)
- Name: Jordan Harrington
- Role (honest): Cambridge-based punting tour guide, guiding on the River Cam since 2021,
  specialising in the College Backs. Operates under several agencies (no single operator named).
- Real credentials / firsthand experience:
  - Cambridge local with extensive knowledge of the River Cam and the College Backs.
  - Professional guided punting tours since 2021; has served 1,000+ international visitors.
  - Specialises in informative, safe, relaxing tours for individuals, couples, families, and
    small groups, with a focus on historical accuracy, storytelling, and guest comfort.
- Bio (clean, rules-compliant): Jordan Harrington is a Cambridge-based punting guide with deep
  roots in the city. Since 2021 he has led guided punting tours along the River Cam,
  specialising in the world-famous College Backs. Born and raised in Cambridge, he pairs expert
  local knowledge with a passion for the city's history, navigating traditional punts while
  giving engaging, well-researched commentary on the University's historic colleges, famous
  bridges, and centuries of academic tradition. His tours offer a peaceful, authentic view of
  Cambridge from the water, for individuals, couples, families, and small groups.
- Photo path: <!-- NOTE FOR OLEG: replace placeholder data before publishing -->

## TOURS
Oleg-supplied GYG / Viator affiliate links (with affiliate parameters). These are the
definitive set. The pipeline pulls name, price, rating, and booking volume from each in
Phase 1, confirms the list back to Oleg, and sorts by booking volume. Stats are attributed
to their real source (GYG / Viator listing), never claimed as the site's own.

1. Cambridge Shared Punting Tour (GYG t137081) — MOST BOOKED, flagship. Slug:
   `cambridge-shared-punting-tour`.
   https://www.getyourguide.com/cambridge-england-l439/cambridge-shared-punting-tour-t137081/?partner_id=MME1WGW&utm_medium=online_publisher

2. Cambridge Shared Guided Punting by University Students (GYG t1258374) — CHEAPEST. Slug:
   `cambridge-student-guided-punting`.
   https://www.getyourguide.com/cambridge-england-l439/cambridge-shared-guided-punting-by-university-students-t1258374/?partner_id=MME1WGW&utm_medium=online_publisher

3. Private Cambridge Punting Tour (Viator d22327-8978P2) — PRIVATE. Slug:
   `private-cambridge-punting-tour`.
   https://www.viator.com/tours/Cambridge/Private-Cambridge-Punting-Tour/d22327-8978P2?pid=P00062370&mcid=42383&medium=link

(Real ratings / review counts / prices / booking volumes to be pulled and confirmed in Phase 1.)

## COMPLIANCE MODULE
- Status: OFF
- (Punting needs no licence/permit module. If a few real safety/eligibility facts are worth a
  short callout later — life jackets, kids/under-age, self-punt vs chauffeured, season — they
  can be added as normal researched content, not as a compliance module.)

## REAL-USER-LANGUAGE SOURCES (for Phase 1.2 forum mining)
- Subreddits: r/Cambridge
- Forums: Tripadvisor Cambridge (punting tours)
- (Grok x_search for current X / Reddit chatter; replace/expand per research.)

## SOCIAL LINKS (footer icons: Instagram, TikTok, Facebook, YouTube)
- Using platform-search fallbacks for now (swap for real account URLs when available):
- Instagram: https://www.instagram.com/explore/tags/puntingtourscambridge/
- TikTok: https://www.tiktok.com/search?q=Punting%20Tours%20Cambridge
- Facebook: https://www.facebook.com/search/top?q=Punting%20Tours%20Cambridge
- YouTube: https://www.youtube.com/results?search_query=Punting+Tours+Cambridge

## FTC DISCLOSURE
- Placement: footer, sitewide.
- Disclosure text: (your approved wording; default plain-language affiliate disclosure for GYG/Viator)

## ANALYTICS
- Google Analytics 4 measurement ID (unique per site): <!-- NOTE FOR OLEG: set after creating the GA4 property (G-XXXXXXXXXX) -->

## VERIFICATION (search-engine ownership; same on every page, placed in base layout <head>)
- Google Search Console (google-site-verification): <!-- NOTE FOR OLEG: set after adding the GSC property -->
- Bing Webmaster Tools (msvalidate.01): <!-- NOTE FOR OLEG: set after adding the Bing property -->

## SITE-SPECIFIC NOTES
- Punting context: chauffeured and shared/private tours on the River Cam past the College Backs
  (King's, Trinity, St John's, the Bridge of Sighs, the Mathematical Bridge). Lighter, heritage,
  relaxing tone, not adrenaline. Best season roughly spring to autumn.