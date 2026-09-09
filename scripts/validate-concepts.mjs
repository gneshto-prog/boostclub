#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { concepts, finalistRound, finalistSites } from "../content/homepage-concepts.mjs";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "_site");
const conceptRoot = path.join(outputRoot, "concepts");
const errors = [];
const finalistCssHooks = {
  "finalist-organic-soft-current": ".sc-hero",
  "finalist-organic-botanical-rhythm": ".br-hero",
  "finalist-morning-sunrise-ritual": ".sr-hero",
  "finalist-morning-neighbourhood-table": ".nt-hero",
  "finalist-hybrid-gentle-momentum": ".gm-hero",
  "finalist-hybrid-living-club": ".lc-hero",
};

function fail(message) {
  errors.push(message);
}

function count(source, expression) {
  return (source.match(expression) || []).length;
}

function resolveLocal(reference, baseFile) {
  const clean = reference.split(/[?#]/)[0].trim();
  if (!clean || /^(?:https?:|data:|blob:|mailto:|tel:|sms:|\/\/|#)/i.test(clean)) return null;
  if (clean.startsWith("/")) return path.join(outputRoot, clean.replace(/^\/+/, ""));
  return path.resolve(path.dirname(baseFile), clean);
}

const supportingPages = Object.entries(finalistSites).flatMap(([theme, site]) =>
  site.pages.filter((page) => page.id !== "home").map((page) => ({ ...page, theme, site })),
);
const expectedFiles = new Set([
  "index.html",
  "finalists.html",
  "styles.css",
  "interactions.js",
  ...concepts.map(({ slug }) => `${slug}.html`),
  ...supportingPages.map(({ slug }) => `${slug}.html`),
  ...finalistRound.map(({ slug }) => `${slug}.html`),
]);
if (!fs.existsSync(conceptRoot)) {
  fail("Missing generated concepts directory");
} else {
  const actualFiles = fs.readdirSync(conceptRoot).filter((file) => !file.startsWith("."));
  for (const file of expectedFiles) {
    if (!actualFiles.includes(file)) fail(`Missing generated concept asset: concepts/${file}`);
  }
  for (const file of actualFiles) {
    if (!expectedFiles.has(file)) fail(`Unexpected generated concept asset: concepts/${file}`);
  }
}

const finalistGalleryFile = path.join(conceptRoot, "finalists.html");
if (fs.existsSync(finalistGalleryFile)) {
  const gallery = fs.readFileSync(finalistGalleryFile, "utf8");
  if (count(gallery, /class=["']round-gallery-card\s/gi) !== finalistRound.length) {
    fail(`Finalist gallery must contain exactly ${finalistRound.length} cards`);
  }
  for (const finalist of finalistRound) {
    if (!gallery.includes(`href="${finalist.slug}.html"`)) fail(`Finalist gallery is missing link to ${finalist.slug}.html`);
  }
  if (!/name=["']robots["'][^>]+noindex,nofollow/i.test(gallery)) fail("Finalist gallery must remain noindex,nofollow");
}

const galleryFile = path.join(conceptRoot, "index.html");
if (fs.existsSync(galleryFile)) {
  const gallery = fs.readFileSync(galleryFile, "utf8");
  if (count(gallery, /class=["']gallery-card\s/gi) !== concepts.length) {
    fail(`Gallery must contain exactly ${concepts.length} concept cards`);
  }
  for (const concept of concepts) {
    if (!gallery.includes(`href="${concept.slug}.html"`)) fail(`Gallery is missing link to ${concept.slug}.html`);
  }
  if (!/name=["']robots["'][^>]+noindex,nofollow/i.test(gallery)) fail("Gallery must remain noindex,nofollow");
}

for (const concept of concepts) {
  const file = path.join(conceptRoot, `${concept.slug}.html`);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");

  if (!html.includes(`<html lang="en" data-concept="${concept.slug}"`)) {
    fail(`${concept.slug}.html: missing matching English concept root`);
  }
  if (count(html, /<h1\b/gi) !== 1) fail(`${concept.slug}.html: expected exactly one H1`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${concept.slug}.html: missing title`);
  if (!/name=["']description["'][^>]+content=["'][^"']+["']/i.test(html)) fail(`${concept.slug}.html: missing description`);
  if (!/name=["']robots["'][^>]+noindex,nofollow/i.test(html)) fail(`${concept.slug}.html: must remain noindex,nofollow`);
  if (!html.includes('href="styles.css"')) fail(`${concept.slug}.html: missing concept stylesheet`);
  if (!html.includes('src="interactions.js"')) fail(`${concept.slug}.html: missing interaction script`);
  if (!html.includes('href="#concept-main"')) fail(`${concept.slug}.html: missing skip link`);
  if (!html.includes('aria-label="Concept preview controls"')) fail(`${concept.slug}.html: missing preview controls`);

  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));
  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']#([^"']+)["']/gi)) {
    if (!ids.has(match[1])) fail(`${concept.slug}.html: missing target for #${match[1]}`);
  }

  const references = [];
  for (const match of html.matchAll(/\b(?:src|poster)=["']([^"']+)["']/gi)) references.push(match[1]);
  for (const match of html.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["']/gi)) references.push(match[1]);
  for (const reference of references) {
    const target = resolveLocal(reference, file);
    if (target && !fs.existsSync(target)) fail(`${concept.slug}.html: missing asset ${reference}`);
  }
}

for (const page of supportingPages) {
  const file = path.join(conceptRoot, `${page.slug}.html`);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");

  if (!html.includes(`<html lang="en" data-concept="${page.theme}"`)) fail(`${page.slug}.html: missing matching finalist theme root`);
  if (count(html, /<h1\b/gi) !== 1) fail(`${page.slug}.html: expected exactly one H1`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${page.slug}.html: missing title`);
  if (!/name=["']description["'][^>]+content=["'][^"']+["']/i.test(html)) fail(`${page.slug}.html: missing description`);
  if (!/name=["']robots["'][^>]+noindex,nofollow/i.test(html)) fail(`${page.slug}.html: must remain noindex,nofollow`);
  if (!html.includes('href="styles.css"')) fail(`${page.slug}.html: missing concept stylesheet`);
  if (!html.includes('src="interactions.js"')) fail(`${page.slug}.html: missing interaction script`);
  if (!html.includes('aria-label="Concept preview controls"')) fail(`${page.slug}.html: missing preview controls`);
  if (!html.includes(`aria-label="${page.site.navLabel}"`)) fail(`${page.slug}.html: missing full finalist navigation`);
  if (!html.includes(`href="${page.slug}.html" aria-current="page"`)) fail(`${page.slug}.html: missing active navigation state`);
  for (const targetPage of page.site.pages) {
    if (!html.includes(`href="${targetPage.slug}.html"`)) fail(`${page.slug}.html: missing navigation link to ${targetPage.slug}.html`);
  }

  const references = [];
  for (const match of html.matchAll(/\b(?:src|poster)=["']([^"']+)["']/gi)) references.push(match[1]);
  for (const match of html.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["']/gi)) references.push(match[1]);
  for (const reference of references) {
    const target = resolveLocal(reference, file);
    if (target && !fs.existsSync(target)) fail(`${page.slug}.html: missing asset ${reference}`);
  }
}

for (const finalist of finalistRound) {
  const file = path.join(conceptRoot, `${finalist.slug}.html`);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");

  if (!html.includes(`<html lang="en" data-concept="${finalist.slug}" data-finalist="${finalist.slug}"`)) fail(`${finalist.slug}.html: missing matching finalist root`);
  if (count(html, /<h1\b/gi) !== 1) fail(`${finalist.slug}.html: expected exactly one H1`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${finalist.slug}.html: missing title`);
  if (!/name=["']description["'][^>]+content=["'][^"']+["']/i.test(html)) fail(`${finalist.slug}.html: missing description`);
  if (!/name=["']robots["'][^>]+noindex,nofollow/i.test(html)) fail(`${finalist.slug}.html: must remain noindex,nofollow`);
  if (!html.includes('href="styles.css"')) fail(`${finalist.slug}.html: missing concept stylesheet`);
  if (!html.includes('src="interactions.js"')) fail(`${finalist.slug}.html: missing interaction script`);
  if (!html.includes('aria-label="Concept preview controls"')) fail(`${finalist.slug}.html: missing preview controls`);
  if (!html.includes('aria-label="Finalist navigation"')) fail(`${finalist.slug}.html: missing finalist navigation`);

  const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]));
  for (const expectedId of ["welcome", "experience", "method", "stories", "visit"]) {
    if (!ids.has(expectedId)) fail(`${finalist.slug}.html: missing section #${expectedId}`);
  }
  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']#([^"']+)["']/gi)) {
    if (!ids.has(match[1])) fail(`${finalist.slug}.html: missing target for #${match[1]}`);
  }

  const references = [];
  for (const match of html.matchAll(/\b(?:src|poster)=["']([^"']+)["']/gi)) references.push(match[1]);
  for (const match of html.matchAll(/<link\b[^>]*\bhref=["']([^"']+)["']/gi)) references.push(match[1]);
  for (const reference of references) {
    const target = resolveLocal(reference, file);
    if (target && !fs.existsSync(target)) fail(`${finalist.slug}.html: missing asset ${reference}`);
  }
}

for (const fileName of ["index.html", "finalists.html", ...concepts.map(({ slug }) => `${slug}.html`), ...supportingPages.map(({ slug }) => `${slug}.html`), ...finalistRound.map(({ slug }) => `${slug}.html`)]) {
  const file = path.join(conceptRoot, fileName);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+\.html)(?:[?#][^"']*)?["']/gi)) {
    const target = resolveLocal(match[1], file);
    if (target && !fs.existsSync(target)) fail(`${fileName}: broken concept page link ${match[1]}`);
  }
}

const stylesFile = path.join(conceptRoot, "styles.css");
if (fs.existsSync(stylesFile)) {
  const styles = fs.readFileSync(stylesFile, "utf8");
  if (count(styles, /\{/g) !== count(styles, /\}/g)) fail("Concept stylesheet has unbalanced braces");
  for (const match of styles.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    const target = resolveLocal(match[1], stylesFile);
    if (target && !fs.existsSync(target)) fail(`styles.css: missing asset ${match[1]}`);
  }
  for (const concept of concepts) {
    if (!styles.includes(`[data-concept="${concept.slug}"]`)) fail(`styles.css: missing theme scope for ${concept.slug}`);
  }
  for (const finalist of finalistRound) {
    if (!styles.includes(finalistCssHooks[finalist.slug])) {
      fail(`styles.css: missing visual treatment for ${finalist.slug}`);
    }
  }
  for (const color of ["#0d5645", "#c9a24b", "#11705a", "#0a4537", "#08382d", "#e0be6e", "#e6e9de", "#f5f3ee", "#1a1f1c", "#5c6660"]) {
    if (!styles.toLowerCase().includes(color)) fail(`styles.css: missing Boost Club brand color ${color}`);
  }
  if (!styles.includes("prefers-reduced-motion")) fail("styles.css: missing reduced motion treatment");
}

const authoredFiles = [
  "HOMEPAGE-CONCEPT-LAB.md",
  "scripts/build-site.mjs",
  "content/homepage-concepts.mjs",
  "scripts/lib/homepage-concepts.mjs",
  "scripts/prepare-site.mjs",
  "scripts/validate-concepts.mjs",
  "concept-lab/styles.css",
  "concept-lab/interactions.js",
];
for (const relative of authoredFiles) {
  const source = fs.readFileSync(path.join(projectRoot, relative), "utf8");
  if (source.includes("\u2014")) fail(`${relative}: contains a disallowed em dash`);
}

if (errors.length) {
  console.error(`Homepage concept validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`  ERROR ${error}`));
  process.exit(1);
}

console.log(`Homepage concept validation passed: gallery, ${concepts.length} homepages, ${supportingPages.length} finalist supporting pages and ${finalistRound.length} final-round homepages.`);
