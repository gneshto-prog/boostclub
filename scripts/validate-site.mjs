#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { findHardcodedDesignValues } from "./lib/css-policy.mjs";

const projectRoot = process.cwd();
const root = path.join(projectRoot, "_site");
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
  "multumim",
  "recenzii",
  "rezultate",
  "termeni",
];
const expectedHreflang = new Set(["ro", "en", "ru", "x-default"]);
const errors = [];
const pages = [];

function fail(message) {
  errors.push(message);
}

function cleanHtml(source) {
  return source.replace(/<!--[\s\S]*?-->/g, "");
}

function filesUnder(directory, extension) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return filesUnder(absolute, extension);
    return !extension || entry.name.endsWith(extension) ? [absolute] : [];
  });
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
    if (slug === "multumim" && !/<meta\s+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) {
      fail(`${file}: confirmation page must remain noindex`);
    }
  }
}

const liveRoutes = new Set(pages.map((page) => page.route));
liveRoutes.add("/program-trainee");
liveRoutes.add("/boostfit/"); // standalone Boost Fit page, hand-built in boostfit/

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
    const localAsset = path.join(root, normalized.replace(/^\/+/, ''));
    const isImage = /\.(?:webp|png|jpe?g|avif)$/i.test(normalized) && fs.existsSync(localAsset) && fs.statSync(localAsset).isFile();
    if (!liveRoutes.has(normalized) && !isImage) fail(`${page.file}: internal link has no live route or image: ${href}`);
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

const assetFiles = [
  ...filesUnder(path.join(root, "css"), ".css").map((file) => path.relative(root, file)),
  ...filesUnder(path.join(root, "js"), ".js").map((file) => path.relative(root, file)),
  ...pages.map((page) => page.file),
  "404.html",
  "program-trainee.html",
];
for (const file of assetFiles) {
  const raw = cleanHtml(fs.readFileSync(path.join(root, file), "utf8"));
  const references = [];
  if (file.endsWith(".html")) {
    for (const match of raw.matchAll(/\b(?:src|poster|data-img|data-video)=["']([^"']+)["']/gi)) references.push(match[1]);
    for (const match of raw.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["']/gi)) references.push(match[1]);
    for (const match of raw.matchAll(/\b(?:srcset|imagesrcset)="([^"]+)"/g)) {
      for (const candidate of match[1].split(',')) references.push(candidate.trim().split(/\s+/)[0]);
    }
  }
  if (file.endsWith(".css")) {
    for (const match of raw.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) references.push(match[1]);
  }

  for (const reference of references) {
    const resolved = resolveLocal(reference, file);
    if (!resolved || fs.existsSync(resolved.absolute)) continue;
    fail(`${file}: missing referenced asset ${reference} (${resolved.relative})`);
  }
}

for (const lang of Object.keys(languages)) {
  const business = pages.find((page) => page.lang === lang && page.slug === "business");
  if (!business?.html.includes("https://hrbl.me/STE_WW")) fail(`${lang}/business: missing required hrbl.me/STE_WW link`);
  if (!/(?:not guaranteed|nu sunt garantate|не гарантированы)/i.test(business?.html || "")) {
    fail(`${lang}/business: missing earnings-results disclaimer`);
  }
  const emptyClubCards = (business?.html.match(/class=["'][^"']*\bclubcard\b[^"']*\bnoimg\b[^"']*["']/gi) || []).length;
  if (emptyClubCards !== 7) fail(`${lang}/business: expected seven defined club-photo empty states, found ${emptyClubCards}`);
}

for (const file of [...pages.map((page) => page.file), "404.html", "program-trainee.html"]) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  if (/<style\b/i.test(html)) fail(`${file}: inline style block remains`);
  if (/\sstyle=(?:"[^"]*"|'[^']*')/i.test(html)) fail(`${file}: inline style attribute remains`);
  if (!/css\/tokens\.css/i.test(html)) fail(`${file}: token stylesheet is not linked`);
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (!/\bsrc\s*=/i.test(match[1]) && !/application\/ld\+json/i.test(match[1]) && match[2].trim()) {
      fail(`${file}: executable inline script remains`);
    }
  }
}

for (const cssFile of filesUnder(path.join(root, "css"), ".css")) {
  if (path.basename(cssFile) === "tokens.css") continue;
  const findings = findHardcodedDesignValues(fs.readFileSync(cssFile, "utf8"));
  for (const finding of findings.slice(0, 10)) {
    fail(`${path.relative(root, cssFile)}: hardcoded ${finding.finding} in ${finding.property}`);
  }
  if (findings.length > 10) fail(`${path.relative(root, cssFile)}: ${findings.length - 10} additional hardcoded design values`);
}

for (const lang of Object.keys(languages)) {
  const booking = pages.find((page) => page.lang === lang && page.slug === "consultatie-gratuita");
  if (!/name=["']form-name["']/i.test(booking?.html || "")) fail(`${lang}/consultatie-gratuita: Netlify form-name input is missing`);
  if (!/name=["']bot-field["']/i.test(booking?.html || "")) fail(`${lang}/consultatie-gratuita: bot-field honeypot is missing`);
}

// Scraped production HTML has Netlify's form attributes stripped; an
// unregistered form silently loses every submission.
for (const page of pages) {
  for (const tag of (page.html || "").match(/<form\b[^>]*>/gi) || []) {
    if (/\bname=/i.test(tag) && !/data-netlify=/i.test(tag)) fail(`${page.lang}/${page.slug}: form is not registered with Netlify Forms (data-netlify missing)`);
  }
}

const componentScripts = filesUnder(path.join(root, "js", "components"), ".js").map((file) => fs.readFileSync(file, "utf8")).join("\n");
if (!componentScripts.includes("preventDefault()")) fail("Externalized form handlers no longer contain preventDefault()");

const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const indexablePages = pages.filter((page) => page.slug !== "multumim");
const sitemapRoutes = [...sitemap.matchAll(/<loc>https:\/\/boostclub\.ro([^<]*)<\/loc>/g)].map((match) => match[1] || "/");
const uniqueSitemapRoutes = new Set(sitemapRoutes);
if (sitemapRoutes.length !== indexablePages.length || uniqueSitemapRoutes.size !== indexablePages.length) {
  fail(`sitemap.xml: expected ${indexablePages.length} unique indexable URLs, found ${sitemapRoutes.length} entries / ${uniqueSitemapRoutes.size} unique`);
}
for (const route of indexablePages.map((page) => page.route)) {
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

if (errors.length) {
  console.error(`Site validation failed (${errors.length}):`);
  for (const error of errors) console.error(`  ERROR ${error}`);
  process.exit(1);
}

console.log(`Site validation passed: 44 generated pages, ${liveRoutes.size - 1} localized routes, token policy, SEO, forms and compliance checks.`);
