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
// resolves correctly without editing code.
async function loadImages() {
  // images.json is grouped by page; each slot is { src, alt } (managers edit both in
  // the CMS). Flatten to src + alt maps so {{ img:KEY }} -> src and {{ alt:KEY }} -> alt.
  // Older shapes (plain path string, or flat slots) are still accepted.
  const src = {}, alt = {};
  function ingest(obj) {
    for (const [key, v] of Object.entries(obj)) {
      if (v && typeof v === "object" && (typeof v.src === "string" || typeof v.alt === "string")) {
        src[key] = v.src || ""; alt[key] = v.alt || "";
      } else if (v && typeof v === "object" && !Array.isArray(v)) {
        ingest(v); // a page group
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

// recursively resolve {{ include "components/x.html" }} against src/
async function resolveIncludes(html, depth = 0) {
  if (depth > 10) throw new Error("include depth exceeded (cycle?)");
  const re = /\{\{\s*include\s+"([^"]+)"\s*\}\}/g;
  let out = html, m, changed = false;
  const parts = [];
  let last = 0;
  while ((m = re.exec(html))) {
    parts.push(html.slice(last, m.index));
    const inc = await readFile(join(SRC, m[1]), "utf8");
    parts.push(inc);
    last = m.index + m[0].length;
    changed = true;
  }
  parts.push(html.slice(last));
  out = parts.join("");
  return changed ? resolveIncludes(out, depth + 1) : out;
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

// page path -> clean-URL output (Phase 2: /tours/<slug>/)
function outPath(pageFile) {
  const rel = relative(PAGES, pageFile).replace(/\\/g, "/");
  // An index.html (root or nested) maps straight to its folder's index.html,
  // never to <folder>/index/index.html.
  if (rel === "index.html" || rel.endsWith("/index.html")) return join(DIST, rel);
  const noExt = rel.replace(/\.html$/, "");
  return join(DIST, noExt, "index.html");
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

async function buildHtml(layout, images, map, content) {
  const page = fillTokens(layout, { title: "Punting Tours Cambridge", description: "", canonical: "", og_image: "", preload: "", schema: "", robots: ROBOTS, ...map, content });
  let resolved = await resolveIncludes(page);
  return resolveImageTokens(resolved, images);
}

function blogPostInner(d, bodyHtml) {
  const hero = d.hero
    ? `\n  <figure class="blog-hero">
    <!-- IMAGE: uploaded by content manager via Sveltia. -->
    <img src="${esc(d.hero)}" alt="${esc(d.hero_alt || d.title)}" width="1280" height="720" fetchpriority="high">
  </figure>`
    : "";
  const cta = d.related_tour
    ? (() => {
        const t = TOURS[d.related_tour];
        const book = t
          ? `<a class="btn btn-primary" href="${t.url}" rel="sponsored noopener" target="_blank">Check live availability &amp; prices on ${t.platform} &rarr;</a>`
          : "";
        const details = `<a class="btn btn-ghost" href="/tours/${esc(d.related_tour)}/">See full tour details</a>`;
        const disc = t
          ? `\n    <p class="small" style="margin:.7rem 0 0">Affiliate link: if you book through it we may earn a commission at no extra cost to you. <a href="/disclosure/">How this works</a>.</p>`
          : "";
        return `\n  <aside class="blog-cta">
    <h2>Ready to book your Cambridge punt?</h2>
    <p>${esc(d.related_tour_blurb || "Check live dates and prices on the operator's official listing.")}</p>
    <p class="blog-cta-btns">${book} ${details}</p>${disc}
  </aside>`;
      })()
    : "";
  return `
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> / <a href="/blog/">Blog</a> / <span aria-current="page">${esc(d.title)}</span>
    </nav>
  </div>

  <article class="wrap-narrow blog-post" style="padding-top:var(--s5)">
    <header>
      <p class="eyebrow" style="font-family:var(--display); text-transform:uppercase; letter-spacing:.12em; color:var(--brand-deep); font-weight:700">${esc(d.date || "")}</p>
      <h1>${esc(d.title)}</h1>
      ${d.description ? `<p class="lede">${esc(d.description)}</p>` : ""}
      <div class="author-hook">
        <img src="{{ img:jordan_thumb }}" alt="Jordan Harrington, Cambridge punting guide" width="38" height="38">
        <span>By <a href="/about/"><strong>${esc(d.author || "Jordan Harrington")}</strong></a>, Cambridge punting guide since 2021</span>
      </div>
    </header>
${hero}
    <div class="prose">
${bodyHtml}
    </div>
${cta}
    <p class="small" style="margin-top:var(--s5)"><a href="/blog/">&larr; All posts</a></p>
  </article>`;
}

function blogPostSchema(d, canonical) {
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
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog/` },
        { "@type": "ListItem", position: 3, name: d.title },
      ],
    },
  ];
  return `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2)}\n</script>`;
}

function blogHubInner(posts) {
  const cards = posts.length
    ? posts.map((p) => `      <article class="rcard">
        ${p.hero ? `<div class="rc-media"><img src="${esc(p.hero)}" alt="${esc(p.hero_alt || p.title)}" width="600" height="450" loading="lazy"></div>` : ""}
        <div class="rc-body">
          <p class="small mb-0">${esc(p.date || "")}</p>
          <h3 class="mt-0 mb-0"><a href="/blog/${p.slug}/">${esc(p.title)}</a></h3>
          <p class="small mb-0">${esc(p.description || "")}</p>
        </div>
      </article>`).join("\n")
    : `      <p>Posts are on the way. In the meantime, see the <a href="/tours/">punting tours</a> and the <a href="/guides/cambridge-punting-prices/">prices guide</a>.</p>`;
  return `
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> / <span aria-current="page">Blog</span>
    </nav>
  </div>

  <section class="wrap" style="padding-top:var(--s6)">
    <p class="eyebrow" style="font-family:var(--display); text-transform:uppercase; letter-spacing:.12em; color:var(--brand-deep); font-weight:700">Cambridge punting</p>
    <h1>The blog</h1>
    <p class="lede" style="max-width:62ch">Stories, tips and local detail on punting the River Cam in Cambridge, from the people who guide it.</p>
  </section>

  <section class="section wrap">
    <div class="cards-3">
${cards}
    </div>
  </section>`;
}

function blogHubSchema(posts) {
  const graph = [
    { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/`, name: "Punting Tours Cambridge" },
    {
      "@type": "Blog",
      "@id": `${SITE}/blog/#blog`,
      name: "Punting Tours Cambridge blog",
      url: `${SITE}/blog/`,
      isPartOf: { "@id": `${SITE}/#website` },
      blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE}/blog/${p.slug}/`, ...(p.date ? { datePublished: p.date } : {}) })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog" },
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
  for (const pf of pageFiles) {
    const raw = await readFile(pf, "utf8");
    const meta = parseMeta(raw);
    const schema = extractSchema(raw);
    const body = await resolveIncludes(extractBody(raw));
    const page = fillTokens(layout, {
      title: meta.title || "Punting Tours Cambridge",
      description: meta.description || "",
      canonical: meta.canonical || "",
      og_image: meta.og_image || "",
      preload: meta.preload || "",
      robots: ROBOTS,
      schema,
      content: body,
    });
    let resolved = await resolveIncludes(page); // resolve includes inside the layout too
    resolved = resolveImageTokens(resolved, images); // bind manager-uploaded image slots
    const out = outPath(pf);
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, resolved, "utf8");
    if (meta.canonical) canonicals.push(meta.canonical);
    built++;
    console.log("  built", relative(ROOT, out));
  }

  // ---- Blog: render Markdown posts + auto-build the /blog/ hub ----
  const blogDir = join(CONTENT, "blog");
  const posts = [];
  if (existsSync(blogDir)) {
    const mdFiles = (await readdir(blogDir)).filter((f) => f.endsWith(".md")).sort();
    for (const file of mdFiles) {
      const raw = await readFile(join(blogDir, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      if (String(data.draft).toLowerCase() === "true") { console.log("  skipped (draft)", "blog/" + file); continue; }
      const slug = data.slug || basename(file, ".md");
      const canonical = `${SITE}/blog/${slug}/`;
      const bodyHtml = marked.parse(body);
      const content = blogPostInner(data, bodyHtml);
      const html = await buildHtml(layout, images, {
        title: data.title ? `${data.title} | Punting Tours Cambridge` : "Punting Tours Cambridge",
        description: data.description || "",
        canonical,
        og_image: data.hero ? `${SITE}${data.hero}` : "",
        preload: data.hero ? `<link rel="preload" as="image" href="${data.hero}">` : "",
        schema: blogPostSchema(data, canonical),
      }, content);
      const out = join(DIST, "blog", slug, "index.html");
      await mkdir(dirname(out), { recursive: true });
      await writeFile(out, html, "utf8");
      canonicals.push(canonical);
      posts.push({ slug, title: data.title || slug, description: data.description || "", date: data.date || "", hero: data.hero || "", hero_alt: data.hero_alt || "" });
      built++;
      console.log("  built", relative(ROOT, out));
    }
  }
  // newest first by date string (ISO sorts correctly)
  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  {
    const canonical = `${SITE}/blog/`;
    const html = await buildHtml(layout, images, {
      title: "Cambridge Punting Blog: Tips, Stories & Local Guides | Punting Tours Cambridge",
      description: "Stories, tips and local detail on punting the River Cam in Cambridge, from the guides who run the tours.",
      canonical,
      og_image: `${SITE}{{ img:home_hero }}`,
      schema: blogHubSchema(posts),
    }, blogHubInner(posts));
    const out = join(DIST, "blog", "index.html");
    await mkdir(dirname(out), { recursive: true });
    await writeFile(out, html, "utf8");
    canonicals.push(canonical);
    built++;
    console.log("  built", relative(ROOT, out), `(${posts.length} posts)`);
  }

  // copy everything under src/public/ to dist root (assets, images, robots.txt, llms.txt, ...)
  await copyDir(PUBLIC, DIST);

  // copy the Sveltia CMS admin (repo-root /admin) to dist/admin so it is served at /admin
  await copyDir(join(ROOT, "admin"), join(DIST, "admin"));

  // render real static route maps if a key is configured (else keep placeholders)
  await renderStaticMaps();

  // auto-generate sitemap.xml from page canonicals (Phase 2.8)
  const urls = [...new Set(canonicals)].sort();
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n") +
    `\n</urlset>\n`;
  await writeFile(join(DIST, "sitemap.xml"), sitemap, "utf8");
  console.log(`  built dist/sitemap.xml (${urls.length} urls)`);

  console.log(`\n✓ compiled ${built} page(s) to dist/`);
}

main().catch((e) => { console.error("✗ build failed:", e.message); process.exit(1); });
