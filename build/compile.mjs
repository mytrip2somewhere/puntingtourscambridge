#!/usr/bin/env node
/* Phase 8.2 — light include/compile step. Not a framework: it stitches
   layouts/ + components/ into plain static HTML via {{ include }} tokens
   and per-page meta/schema/content slots. Outputs clean-URL folders. */

import { readFile, writeFile, mkdir, readdir, copyFile, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, relative, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src");
const PAGES = join(SRC, "pages");
const LAYOUTS = join(SRC, "layouts");
const PUBLIC = join(SRC, "public");
const DATA = join(SRC, "data");
const CONTENT = join(SRC, "content");
const DIST = join(ROOT, "dist");
const SITE = "https://puntingtourscambridge.com";

// ---- i18n (language expansion, 2026-08) ----
// URL structure: subdirectories (/fr/, /de/, ...), English stays at root (no /en/ prefix).
// Each locale folder under src/pages/<slug>/ mirrors the root page set 1:1 by filename, and
// src/content/blog/<slug>/ mirrors src/content/blog/*.md 1:1 by filename (same slugs across
// every language, only the /<locale>/ URL prefix differs). A "pageId" (the path with the
// locale prefix and extension stripped) links translations of the same page/post together
// for hreflang + the language switcher. Components (nav/footer) fall back to
// components/<locale>/<name>.html when present, else the English default is reused.
const LOCALES = [
  { slug: "fr", hreflang: "fr", htmlLang: "fr", ogLocale: "fr_FR", label: "Français" },
  { slug: "de", hreflang: "de", htmlLang: "de", ogLocale: "de_DE", label: "Deutsch" },
  { slug: "es", hreflang: "es", htmlLang: "es", ogLocale: "es_ES", label: "Español" },
  { slug: "it", hreflang: "it", htmlLang: "it", ogLocale: "it_IT", label: "Italiano" },
  { slug: "zh", hreflang: "zh-Hans", htmlLang: "zh-Hans", ogLocale: "zh_CN", label: "简体中文" },
  { slug: "nl", hreflang: "nl", htmlLang: "nl", ogLocale: "nl_NL", label: "Nederlands" },
  { slug: "pt", hreflang: "pt-PT", htmlLang: "pt-PT", ogLocale: "pt_PT", label: "Português" },
  { slug: "ja", hreflang: "ja", htmlLang: "ja", ogLocale: "ja_JP", label: "日本語" },
];
const EN_LOCALE = { slug: "en", hreflang: "en", htmlLang: "en", ogLocale: "en_GB", label: "English" };
const ALL_LOCALES = [EN_LOCALE, ...LOCALES];
const LOCALE_SLUGS = new Set(LOCALES.map((l) => l.slug));

// Small set of strings baked into compile-time-generated markup (blog CTA box, breadcrumbs,
// blog hub) that never come from a source file, so they are translated once, here, centrally
// rather than left to per-page content. {tours}/{prices} are substituted with real anchor tags.
const UI = {
  en: {
    crumbHome: "Home", crumbBlog: "Blog",
    byPrefix: "By", authorSuffix: ", Cambridge punting guide since 2021",
    ctaHeading: "Ready to book your Cambridge punt?",
    ctaDefaultBlurb: "Check live dates and prices on the operator's official listing.",
    ctaBook: "Check live availability & prices on {platform} &rarr;",
    ctaDetails: "See full tour details",
    ctaDiscPre: "Affiliate link: if you book through it we may earn a commission at no extra cost to you.",
    ctaDiscLink: "How this works",
    allPosts: "&larr; All posts",
    hubEyebrow: "Cambridge punting", hubH1: "The blog",
    hubLede: "Stories, tips and local detail on punting the River Cam in Cambridge, from the people who guide it.",
    hubEmpty: "Posts are on the way. In the meantime, see the {tours} and the {prices}.",
    hubToursLink: "punting tours", hubPricesLink: "prices guide",
    hubTitleTag: "Cambridge Punting Blog: Tips, Stories & Local Guides | Punting Tours Cambridge",
    hubMetaDesc: "Stories, tips and local detail on punting the River Cam in Cambridge, from the guides who run the tours.",
  },
  fr: {
    crumbHome: "Accueil", crumbBlog: "Blog",
    byPrefix: "Par", authorSuffix: ", guide de punting à Cambridge depuis 2021",
    ctaHeading: "Prêt à réserver votre balade en punt à Cambridge ?",
    ctaDefaultBlurb: "Consultez les dates et les prix en temps réel sur la page officielle de l'opérateur.",
    ctaBook: "Voir les disponibilités et les prix sur {platform} &rarr;",
    ctaDetails: "Voir tous les détails de la balade",
    ctaDiscPre: "Lien affilié : si vous réservez via ce lien, nous pouvons toucher une commission, sans frais supplémentaires pour vous.",
    ctaDiscLink: "Comment ça marche",
    allPosts: "&larr; Tous les articles",
    hubEyebrow: "Punting à Cambridge", hubH1: "Le blog",
    hubLede: "Récits, conseils et détails locaux sur le punting le long de la River Cam à Cambridge, par ceux qui vous guident.",
    hubEmpty: "Les articles arrivent bientôt. En attendant, consultez les {tours} et le {prices}.",
    hubToursLink: "balades en punt", hubPricesLink: "guide des prix",
    hubTitleTag: "Blog Punting Cambridge : conseils, récits et guides locaux | Punting Tours Cambridge",
    hubMetaDesc: "Récits, conseils et détails locaux sur le punting le long de la River Cam à Cambridge, par les guides qui mènent les balades.",
  },
  de: {
    crumbHome: "Startseite", crumbBlog: "Blog",
    byPrefix: "Von", authorSuffix: ", Punting-Guide in Cambridge seit 2021",
    ctaHeading: "Bereit, Ihre Punting-Tour in Cambridge zu buchen?",
    ctaDefaultBlurb: "Aktuelle Termine und Preise finden Sie auf der offiziellen Anbieterseite.",
    ctaBook: "Verfügbarkeit &amp; Preise bei {platform} ansehen &rarr;",
    ctaDetails: "Alle Details zur Tour ansehen",
    ctaDiscPre: "Affiliate-Link: Wenn Sie darüber buchen, erhalten wir eventuell eine Provision, ohne Mehrkosten für Sie.",
    ctaDiscLink: "So funktioniert das",
    allPosts: "&larr; Alle Beiträge",
    hubEyebrow: "Punting in Cambridge", hubH1: "Der Blog",
    hubLede: "Geschichten, Tipps und lokales Wissen rund ums Punting auf dem River Cam in Cambridge, von den Guides selbst.",
    hubEmpty: "Beiträge folgen in Kürze. Schauen Sie in der Zwischenzeit bei den {tours} und im {prices} vorbei.",
    hubToursLink: "Punting-Touren", hubPricesLink: "Preisguide",
    hubTitleTag: "Cambridge-Punting-Blog: Tipps, Geschichten &amp; lokale Guides | Punting Tours Cambridge",
    hubMetaDesc: "Geschichten, Tipps und lokales Wissen rund ums Punting auf dem River Cam in Cambridge, von den Guides, die die Touren leiten.",
  },
  es: {
    crumbHome: "Inicio", crumbBlog: "Blog",
    byPrefix: "Por", authorSuffix: ", guía de punting en Cambridge desde 2021",
    ctaHeading: "¿Listo para reservar tu paseo en punt por Cambridge?",
    ctaDefaultBlurb: "Consulta las fechas y precios actuales en la web oficial del operador.",
    ctaBook: "Ver disponibilidad y precios en {platform} &rarr;",
    ctaDetails: "Ver todos los detalles del tour",
    ctaDiscPre: "Enlace de afiliado: si reservas a través de él, podemos ganar una comisión sin coste adicional para ti.",
    ctaDiscLink: "Cómo funciona",
    allPosts: "&larr; Todos los artículos",
    hubEyebrow: "Punting en Cambridge", hubH1: "El blog",
    hubLede: "Historias, consejos y detalles locales sobre el punting en el río Cam en Cambridge, contados por quienes guían los paseos.",
    hubEmpty: "Los artículos llegarán pronto. Mientras tanto, consulta los {tours} y la {prices}.",
    hubToursLink: "tours de punting", hubPricesLink: "guía de precios",
    hubTitleTag: "Blog de Punting en Cambridge: consejos, historias y guías locales | Punting Tours Cambridge",
    hubMetaDesc: "Historias, consejos y detalles locales sobre el punting en el río Cam en Cambridge, contados por los guías que llevan los tours.",
  },
  it: {
    crumbHome: "Home", crumbBlog: "Blog",
    byPrefix: "Di", authorSuffix: ", guida di punting a Cambridge dal 2021",
    ctaHeading: "Pronto a prenotare il tuo giro in punt a Cambridge?",
    ctaDefaultBlurb: "Controlla date e prezzi aggiornati sull'annuncio ufficiale dell'operatore.",
    ctaBook: "Vedi disponibilità e prezzi su {platform} &rarr;",
    ctaDetails: "Vedi tutti i dettagli del tour",
    ctaDiscPre: "Link di affiliazione: se prenoti tramite questo link potremmo ricevere una commissione, senza costi aggiuntivi per te.",
    ctaDiscLink: "Come funziona",
    allPosts: "&larr; Tutti gli articoli",
    hubEyebrow: "Punting a Cambridge", hubH1: "Il blog",
    hubLede: "Storie, consigli e dettagli locali sul punting lungo il fiume Cam a Cambridge, raccontati da chi guida i tour.",
    hubEmpty: "Gli articoli arriveranno presto. Nel frattempo, dai un'occhiata ai {tours} e alla {prices}.",
    hubToursLink: "tour di punting", hubPricesLink: "guida ai prezzi",
    hubTitleTag: "Blog sul Punting a Cambridge: consigli, storie e guide locali | Punting Tours Cambridge",
    hubMetaDesc: "Storie, consigli e dettagli locali sul punting lungo il fiume Cam a Cambridge, raccontati dalle guide che conducono i tour.",
  },
  zh: {
    crumbHome: "首页", crumbBlog: "博客",
    byPrefix: "作者：", authorSuffix: "，剑桥撑篙向导，自2021年起",
    ctaHeading: "准备好预订你的剑桥撑篙之旅了吗？",
    ctaDefaultBlurb: "请在运营商的官方页面查看实时日期和价格。",
    ctaBook: "在{platform}查看实时空位和价格 &rarr;",
    ctaDetails: "查看完整行程详情",
    ctaDiscPre: "联盟链接：如果你通过此链接预订，我们可能会获得佣金，不会增加你的费用。",
    ctaDiscLink: "运作方式说明",
    allPosts: "&larr; 所有文章",
    hubEyebrow: "剑桥撑篙", hubH1: "博客",
    hubLede: "关于在剑桥康河撑篙的故事、建议与本地细节，由带你游览的向导讲述。",
    hubEmpty: "文章即将上线。在此之前，可以先看看{tours}和{prices}。",
    hubToursLink: "撑篙之旅", hubPricesLink: "价格指南",
    hubTitleTag: "剑桥撑篙博客：攻略、故事与本地指南 | Punting Tours Cambridge",
    hubMetaDesc: "关于在剑桥康河撑篙的故事、建议与本地细节，由带团向导讲述。",
  },
  nl: {
    crumbHome: "Home", crumbBlog: "Blog",
    byPrefix: "Door", authorSuffix: ", puntergids in Cambridge sinds 2021",
    ctaHeading: "Klaar om je punttocht in Cambridge te boeken?",
    ctaDefaultBlurb: "Bekijk actuele data en prijzen op de officiële pagina van de aanbieder.",
    ctaBook: "Bekijk beschikbaarheid &amp; prijzen bij {platform} &rarr;",
    ctaDetails: "Bekijk alle details van de tour",
    ctaDiscPre: "Affiliate link: als je hierover boekt, kunnen we een commissie ontvangen, zonder extra kosten voor jou.",
    ctaDiscLink: "Zo werkt dat",
    allPosts: "&larr; Alle artikelen",
    hubEyebrow: "Punteren in Cambridge", hubH1: "De blog",
    hubLede: "Verhalen, tips en lokale details over punteren op de River Cam in Cambridge, verteld door de mensen die je rondleiden.",
    hubEmpty: "Er komen binnenkort artikelen. Bekijk intussen de {tours} en de {prices}.",
    hubToursLink: "punttochten", hubPricesLink: "prijzengids",
    hubTitleTag: "Cambridge Punting Blog: tips, verhalen &amp; lokale gidsen | Punting Tours Cambridge",
    hubMetaDesc: "Verhalen, tips en lokale details over punteren op de River Cam in Cambridge, verteld door de gidsen die de tochten leiden.",
  },
  pt: {
    crumbHome: "Início", crumbBlog: "Blog",
    byPrefix: "Por", authorSuffix: ", guia de punting em Cambridge desde 2021",
    ctaHeading: "Pronto para reservar o seu passeio de punt em Cambridge?",
    ctaDefaultBlurb: "Consulte datas e preços atuais na página oficial do operador.",
    ctaBook: "Ver disponibilidade e preços na {platform} &rarr;",
    ctaDetails: "Ver todos os detalhes do passeio",
    ctaDiscPre: "Link de afiliado: se reservar através deste link, podemos receber uma comissão, sem custo adicional para si.",
    ctaDiscLink: "Como funciona",
    allPosts: "&larr; Todos os artigos",
    hubEyebrow: "Punting em Cambridge", hubH1: "O blog",
    hubLede: "Histórias, dicas e detalhes locais sobre punting no rio Cam em Cambridge, contados por quem guia os passeios.",
    hubEmpty: "Os artigos estão a chegar. Entretanto, veja os {tours} e o {prices}.",
    hubToursLink: "passeios de punt", hubPricesLink: "guia de preços",
    hubTitleTag: "Blog de Punting em Cambridge: dicas, histórias e guias locais | Punting Tours Cambridge",
    hubMetaDesc: "Histórias, dicas e detalhes locais sobre punting no rio Cam em Cambridge, contados pelos guias que conduzem os passeios.",
  },
  ja: {
    crumbHome: "ホーム", crumbBlog: "ブログ",
    byPrefix: "執筆：", authorSuffix: "、2021年からケンブリッジのパンティングガイド",
    ctaHeading: "ケンブリッジのパンティングを予約しませんか？",
    ctaDefaultBlurb: "運営会社の公式ページで最新の空き状況と料金をご確認ください。",
    ctaBook: "{platform}で空き状況と料金を見る &rarr;",
    ctaDetails: "ツアーの詳細をすべて見る",
    ctaDiscPre: "アフィリエイトリンク：このリンク経由でご予約いただくと、当サイトが手数料を受け取る場合があります。お客様の追加費用は発生しません。",
    ctaDiscLink: "仕組みについて",
    allPosts: "&larr; すべての記事",
    hubEyebrow: "ケンブリッジのパンティング", hubH1: "ブログ",
    hubLede: "ケンブリッジのケム川でのパンティングにまつわるストーリー、ヒント、現地ならではの情報を、実際に案内するガイドがお届けします。",
    hubEmpty: "記事は近日公開予定です。それまでは{tours}と{prices}をご覧ください。",
    hubToursLink: "パンティングツアー", hubPricesLink: "料金ガイド",
    hubTitleTag: "ケンブリッジ・パンティングブログ：ヒント、ストーリー、現地ガイド | Punting Tours Cambridge",
    hubMetaDesc: "ケンブリッジのケム川でのパンティングにまつわるストーリー、ヒント、現地ならではの情報を、ツアーを案内するガイドがお届けします。",
  },
};
function ui(localeSlug) { return UI[localeSlug] || UI.en; }
// prefix an internal (site-relative, starts with "/") path with the locale, e.g.
// p("fr", "/tours/") -> "/fr/tours/". English and non-internal paths pass through untouched.
function p(localeSlug, path) {
  if (localeSlug === "en" || !path.startsWith("/")) return path;
  return `/${localeSlug}${path}`;
}

// Indexing safety: default to noindex so the unfinished/placeholder site is not
// indexed. Flip on at launch with SITE_INDEXABLE=true npm run build.
const ROBOTS = process.env.SITE_INDEXABLE === "true"
  ? "index,follow,max-image-preview:large"
  : "noindex,nofollow";

// Tour affiliate links (single source of truth for blog "book now" CTAs).
// Mirrors the affiliate URLs on the tour pages / site.config.md.
const TOURS = {
  "cambridge-shared-punting-tour": { platform: "GetYourGuide", url: "https://www.getyourguide.com/cambridge-england-l439/cambridge-shared-punting-tour-t137081/?partner_id=MME1WGW&utm_medium=online_publisher" },
  "cambridge-student-guided-punting": { platform: "GetYourGuide", url: "https://www.getyourguide.com/cambridge-england-l439/cambridge-shared-guided-punting-by-university-students-t1258374/?partner_id=MME1WGW&utm_medium=online_publisher" },
  "private-cambridge-punting-tour": { platform: "Viator", url: "https://www.viator.com/tours/Cambridge/Private-Cambridge-Punting-Tour/d22327-8978P2?pid=P00062370&mcid=42383&medium=link" },
};

// Static maps (Phase 3.5). Each entry renders to /images/generated/<file> at build time
// IF a Google Static Maps key is present (env GOOGLE_MAPS_STATIC_KEY). Without a key the
// build skips them and the flagged placeholder stays. Coordinates match the JSON-LD geo.
const MAPS = {
  "cambridge-backs-map.png": { center: "35.6595,139.7004", zoom: 15, label: "The Backs, Cambridge" },
  "cambridge-millpond-map.png": { center: "35.6984,139.7731", zoom: 15, label: "Mill Pond, Cambridge" },
  "cambridge-quayside-map.png": { center: "35.6762,139.6503", zoom: 13, label: "Quayside, Cambridge" },
};

async function renderStaticMaps() {
  const key = process.env.GOOGLE_MAPS_STATIC_KEY;
  if (!key) {
    console.log("  maps: skipped (set GOOGLE_MAPS_STATIC_KEY to render real route maps)");
    return;
  }
  const dir = join(DIST, "images", "generated");
  await mkdir(dir, { recursive: true });
  for (const [file, m] of Object.entries(MAPS)) {
    const url =
      `https://maps.googleapis.com/maps/api/staticmap?center=${m.center}` +
      `&zoom=${m.zoom}&size=640x360&scale=2&maptype=roadmap` +
      `&markers=color:0xd2342b%7C${m.center}&key=${key}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(join(dir, file), buf);
      console.log(`  maps: rendered ${file} (${m.label})`);
    } catch (e) {
      console.log(`  maps: FAILED ${file} (${e.message}) — placeholder kept`);
    }
  }
}

// Image slots edited by content managers via Sveltia (src/data/images.json).
// Templates reference them as {{ img:KEY }} so an uploaded file of any name
// resolves correctly without editing code. Shared across every locale (photos
// are language-agnostic); alt text stays English until per-locale alt is built.
async function loadImages() {
  const src = {}, alt = {};
  function ingest(obj) {
    for (const [key, v] of Object.entries(obj)) {
      if (v && typeof v === "object" && (typeof v.src === "string" || typeof v.alt === "string")) {
        src[key] = v.src || ""; alt[key] = v.alt || "";
      } else if (v && typeof v === "object" && !Array.isArray(v)) {
        ingest(v);
      } else {
        src[key] = v; alt[key] = "";
      }
    }
  }
  try { ingest(JSON.parse(await readFile(join(DATA, "images.json"), "utf8"))); } catch {}
  return { src, alt };
}
function resolveImageTokens(html, images) {
  return html
    .replace(/\{\{\s*img:([a-z0-9_]+)\s*\}\}/g, (m, key) =>
      key in images.src ? images.src[key] : m)
    .replace(/\{\{\s*alt:([a-z0-9_]+)\s*\}\}/g, (m, key) =>
      key in images.alt ? String(images.alt[key]).replace(/"/g, "&quot;") : m);
}

// recursively resolve {{ include "components/x.html" }} against src/. When locale !== "en"
// and a components/<locale>/<name>.html translation exists, it is used in place of the
// English default (falls back silently to English for any component not yet translated).
async function resolveIncludes(html, locale = "en", depth = 0) {
  if (depth > 10) throw new Error("include depth exceeded (cycle?)");
  const re = /\{\{\s*include\s+"([^"]+)"\s*\}\}/g;
  let out = html, m;
  const parts = [];
  let last = 0;
  let changed = false;
  while ((m = re.exec(html))) {
    parts.push(html.slice(last, m.index));
    let incPath = join(SRC, m[1]);
    if (locale !== "en") {
      const localized = join(SRC, m[1].replace(/^components\//, `components/${locale}/`));
      if (existsSync(localized)) incPath = localized;
    }
    const inc = await readFile(incPath, "utf8");
    parts.push(inc);
    last = m.index + m[0].length;
    changed = true;
  }
  parts.push(html.slice(last));
  out = parts.join("");
  return changed ? resolveIncludes(out, locale, depth + 1) : out;
}

function parseMeta(raw) {
  const meta = {};
  const m = raw.match(/<!--meta([\s\S]*?)-->/);
  if (m) {
    for (const line of m[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > -1) {
        const k = line.slice(0, i).trim();
        const v = line.slice(i + 1).trim();
        if (k) meta[k] = v;
      }
    }
  }
  return meta;
}

function extractSchema(raw) {
  const m = raw.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/);
  return m ? m[0] : "";
}

function extractBody(raw) {
  const i = raw.indexOf("<!--content-->");
  return i > -1 ? raw.slice(i + "<!--content-->".length) : raw;
}

function fillTokens(layout, map) {
  return layout.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (full, key) =>
    key in map ? map[key] : ""
  );
}

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

async function copyDir(from, to) {
  if (!existsSync(from)) return;
  for (const e of await readdir(from, { withFileTypes: true })) {
    const s = join(from, e.name), d = join(to, e.name);
    if (e.isDirectory()) { await mkdir(d, { recursive: true }); await copyDir(s, d); }
    else { await mkdir(dirname(d), { recursive: true }); await copyFile(s, d); }
  }
}

// pageFile relative path (POSIX, under src/pages) -> { locale, pageId }
function localeInfo(rel) {
  const parts = rel.split("/");
  const first = parts[0];
  if (LOCALE_SLUGS.has(first)) {
    const loc = LOCALES.find((l) => l.slug === first);
    const rest = parts.slice(1).join("/").replace(/\.html$/, "");
    return { locale: loc, pageId: rest === "index" || rest === "" ? "index" : rest };
  }
  const rest = rel.replace(/\.html$/, "");
  return { locale: EN_LOCALE, pageId: rest === "index" || rest === "" ? "index" : rest };
}

// page path -> clean-URL output (Phase 2: /tours/<slug>/, /fr/tours/<slug>/)
function outPath(pageFile) {
  const rel = relative(PAGES, pageFile).replace(/\\/g, "/");
  if (rel === "index.html" || rel.endsWith("/index.html")) return join(DIST, rel);
  const noExt = rel.replace(/\.html$/, "");
  return join(DIST, noExt, "index.html");
}

function hreflangBlock(pagesMap, pageId) {
  const variants = pagesMap[pageId];
  if (!variants || Object.keys(variants).length < 2) return "";
  const lines = Object.entries(variants).map(([slug, url]) => {
    const loc = ALL_LOCALES.find((l) => l.slug === slug);
    return `  <link rel="alternate" hreflang="${loc.hreflang}" href="${url}">`;
  });
  if (variants.en) lines.push(`  <link rel="alternate" hreflang="x-default" href="${variants.en}">`);
  return lines.join("\n");
}

function langSwitchBlock(pagesMap, pageId, currentSlug) {
  const variants = pagesMap[pageId];
  if (!variants) return "";
  const entries = Object.entries(variants);
  if (entries.length < 2) return "";
  const current = ALL_LOCALES.find((l) => l.slug === currentSlug);
  const items = entries
    .sort(([a], [b]) => (a === "en" ? -1 : b === "en" ? 1 : a.localeCompare(b)))
    .map(([slug, url]) => {
      const loc = ALL_LOCALES.find((l) => l.slug === slug);
      const cur = slug === currentSlug;
      return `<a href="${url}"${cur ? ' class="lang-current" aria-current="true"' : ""}>${loc.label}</a>`;
    })
    .join("");
  return `<li><details class="lang-menu"><summary>${(current || EN_LOCALE).label}</summary><div class="lang-menu-list">${items}</div></details></li>`;
}

// ---- Blog (Markdown) support ----
function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1);
    if (k) data[k] = v;
  }
  return { data, body: m[2] };
}

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function buildHtml(layout, images, map, content, localeSlug = "en") {
  const loc = ALL_LOCALES.find((l) => l.slug === localeSlug) || EN_LOCALE;
  const page = fillTokens(layout, {
    title: "Punting Tours Cambridge", description: "", canonical: "", og_image: "", preload: "",
    schema: "", robots: ROBOTS, lang: loc.htmlLang, og_locale: loc.ogLocale, ...map, content,
  });
  let resolved = await resolveIncludes(page, localeSlug);
  return resolveImageTokens(resolved, images);
}

function blogPostInner(d, bodyHtml, localeSlug) {
  const t = ui(localeSlug);
  const hero = d.hero
    ? `\n  <figure class="blog-hero">
    <!-- IMAGE: uploaded by content manager via Sveltia. -->
    <img src="${esc(d.hero)}" alt="${esc(d.hero_alt || d.title)}" width="1280" height="720" fetchpriority="high">
  </figure>`
    : "";
  const cta = d.related_tour
    ? (() => {
        const tour = TOURS[d.related_tour];
        const book = tour
          ? `<a class="btn btn-primary" href="${tour.url}" rel="sponsored noopener" target="_blank">${t.ctaBook.replace("{platform}", esc(tour.platform))}</a>`
          : "";
        const details = `<a class="btn btn-ghost" href="${p(localeSlug, `/tours/${esc(d.related_tour)}/`)}">${t.ctaDetails}</a>`;
        const disc = tour
          ? `\n    <p class="small" style="margin:.7rem 0 0">${t.ctaDiscPre} <a href="${p(localeSlug, "/disclosure/")}">${t.ctaDiscLink}</a>.</p>`
          : "";
        return `\n  <aside class="blog-cta">
    <h2>${t.ctaHeading}</h2>
    <p>${esc(d.related_tour_blurb || t.ctaDefaultBlurb)}</p>
    <p class="blog-cta-btns">${book} ${details}</p>${disc}
  </aside>`;
      })()
    : "";
  return `
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="${p(localeSlug, "/")}">${t.crumbHome}</a> / <a href="${p(localeSlug, "/blog/")}">${t.crumbBlog}</a> / <span aria-current="page">${esc(d.title)}</span>
    </nav>
  </div>

  <article class="wrap-narrow blog-post" style="padding-top:var(--s5)">
    <header>
      <p class="eyebrow" style="font-family:var(--display); text-transform:uppercase; letter-spacing:.12em; color:var(--brand-deep); font-weight:700">${esc(d.date || "")}</p>
      <h1>${esc(d.title)}</h1>
      ${d.description ? `<p class="lede">${esc(d.description)}</p>` : ""}
      <div class="author-hook">
        <img src="{{ img:jordan_thumb }}" alt="Jordan Harrington, Cambridge punting guide" width="38" height="38">
        <span>${t.byPrefix} <a href="${p(localeSlug, "/about/")}"><strong>${esc(d.author || "Jordan Harrington")}</strong></a>${t.authorSuffix}</span>
      </div>
    </header>
${hero}
    <div class="prose">
${bodyHtml}
    </div>
${cta}
    <p class="small" style="margin-top:var(--s5)"><a href="${p(localeSlug, "/blog/")}">${t.allPosts}</a></p>
  </article>`;
}

function blogPostSchema(d, canonical, localeSlug) {
  const t = ui(localeSlug);
  const graph = [
    { "@type": "TravelAgency", "@id": `${SITE}/#agency`, name: "Punting Tours Cambridge", url: `${SITE}/`, areaServed: "Cambridge, England" },
    { "@type": "Person", "@id": `${SITE}/about/#jordan`, name: "Jordan Harrington", jobTitle: "Cambridge punting guide", worksFor: { "@id": `${SITE}/#agency` } },
    {
      "@type": "BlogPosting",
      headline: d.title,
      description: d.description || "",
      ...(d.hero ? { image: `${SITE}${d.hero}` } : {}),
      ...(d.date ? { datePublished: d.date, dateModified: d.date } : {}),
      author: { "@id": `${SITE}/about/#jordan` },
      publisher: { "@id": `${SITE}/#agency` },
      mainEntityOfPage: canonical,
      inLanguage: (ALL_LOCALES.find((l) => l.slug === localeSlug) || EN_LOCALE).htmlLang,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.crumbHome, item: `${SITE}${p(localeSlug, "/")}` },
        { "@type": "ListItem", position: 2, name: t.crumbBlog, item: `${SITE}${p(localeSlug, "/blog/")}` },
        { "@type": "ListItem", position: 3, name: d.title },
      ],
    },
  ];
  return `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)}\n</script>`;
}

function blogHubInner(posts, localeSlug) {
  const t = ui(localeSlug);
  const cards = posts.length
    ? posts.map((post) => `      <article class="rcard">
        ${post.hero ? `<div class="rc-media"><img src="${esc(post.hero)}" alt="${esc(post.hero_alt || post.title)}" width="600" height="450" loading="lazy"></div>` : ""}
        <div class="rc-body">
          <p class="small mb-0">${esc(post.date || "")}</p>
          <h3 class="mt-0 mb-0"><a href="${p(localeSlug, `/blog/${post.slug}/`)}">${esc(post.title)}</a></h3>
          <p class="small mb-0">${esc(post.description || "")}</p>
        </div>
      </article>`).join("\n")
    : `      <p>${t.hubEmpty
        .replace("{tours}", `<a href="${p(localeSlug, "/tours/")}">${t.hubToursLink}</a>`)
        .replace("{prices}", `<a href="${p(localeSlug, "/guides/cambridge-punting-prices/")}">${t.hubPricesLink}</a>`)}</p>`;
  return `
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="${p(localeSlug, "/")}">${t.crumbHome}</a> / <span aria-current="page">${t.crumbBlog}</span>
    </nav>
  </div>

  <section class="wrap" style="padding-top:var(--s6)">
    <p class="eyebrow" style="font-family:var(--display); text-transform:uppercase; letter-spacing:.12em; color:var(--brand-deep); font-weight:700">${t.hubEyebrow}</p>
    <h1>${t.hubH1}</h1>
    <p class="lede" style="max-width:62ch">${t.hubLede}</p>
  </section>

  <section class="section wrap">
    <div class="cards-3">
${cards}
    </div>
  </section>`;
}

function blogHubSchema(posts, localeSlug) {
  const t = ui(localeSlug);
  const graph = [
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Punting Tours Cambridge" },
    {
      "@type": "Blog",
      "@id": `${SITE}${p(localeSlug, "/blog/")}#blog`,
      name: "Punting Tours Cambridge blog",
      url: `${SITE}${p(localeSlug, "/blog/")}`,
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: (ALL_LOCALES.find((l) => l.slug === localeSlug) || EN_LOCALE).htmlLang,
      blogPost: posts.map((post) => ({ "@type": "BlogPosting", headline: post.title, url: `${SITE}${p(localeSlug, `/blog/${post.slug}/`)}`, ...(post.date ? { datePublished: post.date } : {}) })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.crumbHome, item: `${SITE}${p(localeSlug, "/")}` },
        { "@type": "ListItem", position: 2, name: t.crumbBlog },
      ],
    },
  ];
  return `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)}\n</script>`;
}

async function main() {
  const layout = await readFile(join(LAYOUTS, "base.html"), "utf8");
  const images = await loadImages();
  const pageFiles = (await walk(PAGES)).filter((f) => extname(f) === ".html");

  let built = 0;
  const canonicals = [];
  const pagesMap = {}; // pageId -> { localeSlug: canonicalUrl }
  const rendered = []; // { out, html, locale, pageId }

  // ---- Pass 1a: static pages (English + every locale variant found under src/pages/<locale>/) ----
  for (const pf of pageFiles) {
    const rel = relative(PAGES, pf).replace(/\\/g, "/");
    const { locale, pageId } = localeInfo(rel);
    const raw = await readFile(pf, "utf8");
    const meta = parseMeta(raw);
    const schema = extractSchema(raw);
    const body = await resolveIncludes(extractBody(raw), locale.slug);
    const page = fillTokens(layout, {
      title: meta.title || "Punting Tours Cambridge",
      description: meta.description || "",
      canonical: meta.canonical || "",
      og_image: meta.og_image || "",
      preload: meta.preload || "",
      robots: ROBOTS,
      schema,
      lang: locale.htmlLang,
      og_locale: locale.ogLocale,
      content: body,
    });
    let resolved = await resolveIncludes(page, locale.slug);
    resolved = resolveImageTokens(resolved, images);
    const out = outPath(pf);
    if (meta.canonical) {
      canonicals.push(meta.canonical);
      (pagesMap[pageId] = pagesMap[pageId] || {})[locale.slug] = meta.canonical;
    }
    rendered.push({ out, html: resolved, locale: locale.slug, pageId });
  }

  // ---- Pass 1b: blog posts, every locale (English at src/content/blog/*.md, translations at
  // src/content/blog/<locale>/*.md, same filename/slug so posts link across languages) ----
  const blogDir = join(CONTENT, "blog");
  const postsByLocale = {};
  if (existsSync(blogDir)) {
    for (const loc of ALL_LOCALES) {
      const dir = loc.slug === "en" ? blogDir : join(blogDir, loc.slug);
      if (!existsSync(dir)) continue;
      const mdFiles = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort();
      const posts = [];
      for (const file of mdFiles) {
        const raw = await readFile(join(dir, file), "utf8");
        const { data, body } = parseFrontmatter(raw);
        if (String(data.draft).toLowerCase() === "true") { console.log(`  skipped (draft) blog/${loc.slug}/${file}`); continue; }
        const slug = data.slug || basename(file, ".md");
        const canonical = `${SITE}${p(loc.slug, `/blog/${slug}/`)}`;
        const bodyHtml = marked.parse(body);
        const content = blogPostInner(data, bodyHtml, loc.slug);
        const html = await buildHtml(layout, images, {
          title: data.title ? `${data.title} | Punting Tours Cambridge` : "Punting Tours Cambridge",
          description: data.description || "",
          canonical,
          og_image: data.hero ? `${SITE}${data.hero}` : "",
          preload: data.hero ? `<link rel="preload" as="image" href="${data.hero}">` : "",
          schema: blogPostSchema(data, canonical, loc.slug),
        }, content, loc.slug);
        const out = join(DIST, ...(loc.slug === "en" ? [] : [loc.slug]), "blog", slug, "index.html");
        const pageId = `blog/${slug}`;
        canonicals.push(canonical);
        (pagesMap[pageId] = pagesMap[pageId] || {})[loc.slug] = canonical;
        rendered.push({ out, html, locale: loc.slug, pageId });
        posts.push({ slug, title: data.title || slug, description: data.description || "", date: data.date || "", hero: data.hero || "", hero_alt: data.hero_alt || "" });
        built++;
        console.log("  built", relative(ROOT, out));
      }
      posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
      postsByLocale[loc.slug] = posts;
    }
  }

  // ---- Pass 1c: blog hub, one per locale that has at least one post rendered above ----
  for (const [localeSlug, posts] of Object.entries(postsByLocale)) {
    const t = ui(localeSlug);
    const canonical = `${SITE}${p(localeSlug, "/blog/")}`;
    const html = await buildHtml(layout, images, {
      title: t.hubTitleTag,
      description: t.hubMetaDesc,
      canonical,
      og_image: `${SITE}{{ img:home_hero }}`,
      schema: blogHubSchema(posts, localeSlug),
    }, blogHubInner(posts, localeSlug), localeSlug);
    const out = join(DIST, ...(localeSlug === "en" ? [] : [localeSlug]), "blog", "index.html");
    const pageId = "blog/index";
    canonicals.push(canonical);
    (pagesMap[pageId] = pagesMap[pageId] || {})[localeSlug] = canonical;
    rendered.push({ out, html, locale: localeSlug, pageId });
    built++;
    console.log("  built", relative(ROOT, out), `(${posts.length} posts)`);
  }

  // ---- Pass 2: now that pagesMap is complete, inject reciprocal hreflang + the language
  // switcher into every rendered page (static + blog + hub) and write to disk ----
  for (const item of rendered) {
    const html = item.html
      .replace("<!--HREFLANG-->", hreflangBlock(pagesMap, item.pageId))
      .replace("<!--LANG_SWITCH-->", langSwitchBlock(pagesMap, item.pageId, item.locale));
    await mkdir(dirname(item.out), { recursive: true });
    await writeFile(item.out, html, "utf8");
  }
  built += pageFiles.length;

  // copy everything under src/public/ to dist root (assets, images, robots.txt, llms.txt, ...)
  await copyDir(PUBLIC, DIST);

  // copy the Sveltia CMS admin (repo-root /admin) to dist/admin so it is served at /admin
  await copyDir(join(ROOT, "admin"), join(DIST, "admin"));

  // render real static route maps if a key is configured (else keep placeholders)
  await renderStaticMaps();

  // auto-generate sitemap.xml from page canonicals, with xhtml:link hreflang alternates
  // per URL (reciprocal language signal alongside the per-page <link> tags)
  const urls = [...new Set(canonicals)].sort();
  const urlToPageId = {};
  for (const [pid, variants] of Object.entries(pagesMap)) {
    for (const u of Object.values(variants)) urlToPageId[u] = pid;
  }
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    urls.map((u) => {
      const pid = urlToPageId[u];
      const variants = pid ? pagesMap[pid] : null;
      const alts = variants && Object.keys(variants).length > 1
        ? Object.entries(variants).map(([slug, alt]) => {
            const loc = ALL_LOCALES.find((l) => l.slug === slug);
            return `\n    <xhtml:link rel="alternate" hreflang="${loc.hreflang}" href="${alt}"/>`;
          }).join("") + (variants.en ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${variants.en}"/>` : "")
        : "";
      return `  <url>\n    <loc>${u}</loc>${alts}\n  </url>`;
    }).join("\n") +
    `\n</urlset>\n`;
  await writeFile(join(DIST, "sitemap.xml"), sitemap, "utf8");
  console.log(`  built dist/sitemap.xml (${urls.length} urls)`);

  console.log(`\n✓ compiled ${built} page(s) to dist/`);
}

main().catch((e) => { console.error("✗ build failed:", e.message); process.exit(1); });
