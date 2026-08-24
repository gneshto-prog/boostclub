#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const languages = {
  ro: { dir: "", htmlLang: "ro", distributor: "Distribuitor Independent Herbalife" },
  en: { dir: "en", htmlLang: "en", distributor: "Independent Herbalife Distributor" },
  ru: { dir: "ru", htmlLang: "ru", distributor: "Независимый дистрибьютор Herbalife" },
};
const slugs = [
  "index",
  "ambasador",
  "business",
  "confidentialitate",
  "consultatie-gratuita",
  "contact",
  "cookies",
  "cum-functioneaza",
  "gabi",
  "gabriel",
  "recenzii",
  "rezultate",
  "termeni",
];
const expectedHreflang = new Set(["ro", "en", "ru", "x-default"]);
const knownOwnerAssets = new Set([
  "images/clubs/romania.jpg",
  "images/clubs/israel.jpg",
  "images/clubs/uzbekistan.jpg",
  "images/clubs/kazakhstan.jpg",
  "images/clubs/mexico.jpg",
  "images/clubs/puerto-rico.jpg",
  "images/clubs/usa.jpg",
]);

const errors = [];
const warnings = [];
const pages = [];

function fail(message) {
  errors.push(message);
}

function cleanHtml(source) {
  return source.replace(/<!--[\s\S]*?-->/g, "");
}

function routeFor(lang, slug) {
  const prefix = lang === "ro" ? "" : `/${lang}`;
  return slug === "index" ? `${prefix}/` || "/" : `${prefix}/${slug}`;
}

function sourceFor(lang, slug) {
  const dir = languages[lang].dir;
  return dir ? `${dir}/${slug}.html` : `${slug}.html`;
}

for (const [lang, config] of Object.entries(languages)) {
  const actual = fs
    .readdirSync(path.join(root, config.dir || "."), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".html"))
    .map((entry) => entry.name.replace(/\.html$/, ""))
    .filter((slug) => slug !== "404" && slug !== "program-trainee")
    .sort();
  const expected = [...slugs].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    fail(`${lang.toUpperCase()} page set differs: expected ${expected.join(", ")}; found ${actual.join(", ")}`);
  }

  for (const slug of slugs) {
    const file = sourceFor(lang, slug);
    const absolute = path.join(root, file);
    if (!fs.existsSync(absolute)) {
      fail(`Missing language page: ${file}`);
      continue;
    }
    const html = cleanHtml(fs.readFileSync(absolute, "utf8"));
    const route = routeFor(lang, slug);
    pages.push({ lang, slug, file, route, html });

    const langMatch = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i);
    if (!langMatch || langMatch[1].toLowerCase() !== config.htmlLang) {
      fail(`${file}: expected <html lang="${config.htmlLang}">`);
    }

    const h1Count = (html.match(/<h1\b/gi) || []).length;
    if (h1Count !== 1) fail(`${file}: expected exactly one H1, found ${h1Count}`);

    if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${file}: missing non-empty title`);
    if (!/<meta\s+name=["']description["'][^>]+content=["'][^"']+["']/i.test(html)) {
      fail(`${file}: missing non-empty meta description`);
    }

    const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
    const expectedCanonical = `https://boostclub.ro${route}`;
    if (canonical !== expectedCanonical) {
      fail(`${file}: canonical is ${canonical || "missing"}; expected ${expectedCanonical}`);
    }

    const hreflangs = new Set(
      [...html.matchAll(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["']/gi)].map((match) => match[1])
    );
    for (const code of expectedHreflang) {
      if (!hreflangs.has(code)) fail(`${file}: missing ${code} hreflang link`);
    }

    if (!html.includes(config.distributor)) {
      fail(`${file}: missing required Independent Herbalife Distributor disclosure`);
    }
  }
}

const liveRoutes = new Set(pages.map((page) => page.route));
liveRoutes.add("/program-trainee");

for (const page of pages) {
  for (const match of page.html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    const href = match[1].trim();
    if (!href || href.startsWith("#") || /^(?:mailto:|tel:|sms:|javascript:)/i.test(href)) continue;
    let url;
    try {
      url = new URL(href, `https://boostclub.ro${page.route}`);
    } catch {
      fail(`${page.file}: invalid link URL ${href}`);
      continue;
    }
    if (url.hostname !== "boostclub.ro" && url.hostname !== "www.boostclub.ro") continue;
    const pathname = url.pathname.replace(/\.html$/, "").replace(/\/{2,}/g, "/");
    const normalized = pathname === "" ? "/" : pathname;
    if (!liveRoutes.has(normalized)) fail(`${page.file}: internal link has no live route: ${href}`);
  }
}

function resolveLocal(reference, baseFile) {
  const clean = reference.split(/[?#]/)[0].trim();
  if (!clean || /^(?:https?:|data:|blob:|\/\/|#)/i.test(clean)) return null;
  const absolute = clean.startsWith("/")
    ? path.join(root, clean.replace(/^\/+/, ""))
    : path.resolve(path.dirname(path.join(root, baseFile)), clean);
  return { absolute, relative: path.relative(root, absolute).split(path.sep).join("/") };
}

const assetFiles = ["css/style.css", "css/business-phase2.css", "js/main.js", ...pages.map((page) => page.file)];
for (const file of assetFiles) {
  const raw = cleanHtml(fs.readFileSync(path.join(root, file), "utf8"));
  const references = [];
  for (const match of raw.matchAll(/\b(?:src|poster|data-img|data-video)=["']([^"']+)["']/gi)) references.push(match[1]);
  for (const match of raw.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["']/gi)) references.push(match[1]);
  for (const match of raw.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) references.push(match[1]);

  for (const reference of references) {
    const resolved = resolveLocal(reference, file);
    if (!resolved || fs.existsSync(resolved.absolute)) continue;
    if (knownOwnerAssets.has(resolved.relative)) {
      warnings.push(`awaiting owner photo ${resolved.relative}`);
    } else {
      fail(`${file}: missing referenced asset ${reference} (${resolved.relative})`);
    }
  }
}

for (const lang of Object.keys(languages)) {
  const business = pages.find((page) => page.lang === lang && page.slug === "business");
  if (!business?.html.includes("https://hrbl.me/STE_WW")) fail(`${lang}/business: missing required hrbl.me/STE_WW link`);
  if (!/(?:not guaranteed|nu sunt garantate|не гарантированы)/i.test(business?.html || "")) {
    fail(`${lang}/business: missing earnings-results disclaimer`);
  }
}

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const sitemapRoutes = [...sitemap.matchAll(/<loc>https:\/\/boostclub\.ro([^<]*)<\/loc>/g)].map((match) => match[1] || "/");
const uniqueSitemapRoutes = new Set(sitemapRoutes);
if (sitemapRoutes.length !== pages.length || uniqueSitemapRoutes.size !== pages.length) {
  fail(`sitemap.xml: expected ${pages.length} unique live URLs, found ${sitemapRoutes.length} entries / ${uniqueSitemapRoutes.size} unique`);
}
for (const route of pages.map((page) => page.route)) {
  if (!uniqueSitemapRoutes.has(route)) fail(`sitemap.xml: missing ${route}`);
}

const redirects = fs.readFileSync(path.join(root, "_redirects"), "utf8");
for (const page of pages) {
  if (page.slug === "index") continue;
  const oldRoute = `${page.route}.html`;
  const escaped = oldRoute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!new RegExp(`^${escaped}\\s+${page.route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+301(?:!|\\s|$)`, "m").test(redirects)) {
    fail(`_redirects: missing 301 from ${oldRoute} to ${page.route}`);
  }
}

const uniqueWarnings = [...new Set(warnings)];
if (uniqueWarnings.length) {
  console.warn(`Site validation warnings (${uniqueWarnings.length}):`);
  for (const warning of uniqueWarnings) console.warn(`  WARN ${warning}`);
}

if (errors.length) {
  console.error(`Site validation failed (${errors.length}):`);
  for (const error of errors) console.error(`  ERROR ${error}`);
  process.exit(1);
}

console.log(`Site validation passed: ${pages.length} pages, ${liveRoutes.size - 1} live routes, 3-language parity, SEO and compliance checks.`);
