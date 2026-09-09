#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { softCurrentPages } from "./lib/soft-current-site.mjs";

const root = process.cwd();
const outputRoot = path.join(root, "_site");
const siteRoot = path.join(outputRoot, "soft-current");
const errors = [];

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

const expectedFiles = new Set(["styles.css", "interactions.js", ...softCurrentPages.map((page) => page.file)]);
if (!fs.existsSync(siteRoot)) {
  fail("Missing generated Soft Current site");
} else {
  const files = fs.readdirSync(siteRoot).filter((file) => !file.startsWith("."));
  for (const file of expectedFiles) if (!files.includes(file)) fail(`Missing soft-current/${file}`);
  for (const file of files) if (!expectedFiles.has(file)) fail(`Unexpected soft-current/${file}`);
}

const allHtml = [];
for (const page of softCurrentPages) {
  const file = path.join(siteRoot, page.file);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  allHtml.push(html);

  if (!html.includes(`<html lang="en" data-theme="light" data-motion="on" data-page="${page.slug}">`)) fail(`${page.file}: incorrect page root`);
  if (count(html, /<h1\b/gi) !== 1) fail(`${page.file}: expected exactly one H1`);
  if (!/<title>[^<]+<\/title>/i.test(html)) fail(`${page.file}: missing title`);
  if (!/name="description" content="[^"]+"/i.test(html)) fail(`${page.file}: missing description`);
  if (!/name="robots" content="noindex,nofollow"/i.test(html)) fail(`${page.file}: must remain noindex,nofollow`);
  if (!html.includes('data-theme-toggle')) fail(`${page.file}: missing theme control`);
  if (!html.includes('data-motion-toggle')) fail(`${page.file}: missing motion control`);
  if (!html.includes('data-menu-toggle')) fail(`${page.file}: missing mobile menu control`);
  if (!html.includes('href="styles.css"') || !html.includes('src="interactions.js"')) fail(`${page.file}: missing site assets`);

  const active = page.slug === "home" ? 'href="index.html"' : `href="${page.file}" aria-current="page"`;
  if (!html.includes(active)) fail(`${page.file}: missing current navigation target`);

  for (const tag of ["main", "section", "article", "header", "footer", "nav", "aside", "figure", "blockquote", "div"]) {
    if (count(html, new RegExp(`<${tag}(?:\\s|>)`, "gi")) !== count(html, new RegExp(`</${tag}>`, "gi"))) fail(`${page.file}: unbalanced ${tag} elements`);
  }

  const references = [];
  for (const match of html.matchAll(/\b(?:src|poster)="([^"]+)"/gi)) references.push(match[1]);
  for (const match of html.matchAll(/<link\b[^>]*\bhref="([^"]+)"/gi)) references.push(match[1]);
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+\.html)(?:[?#][^"]*)?"/gi)) references.push(match[1]);
  for (const reference of references) {
    const target = resolveLocal(reference, file);
    if (target && !fs.existsSync(target)) fail(`${page.file}: missing local target ${reference}`);
  }
}

const home = allHtml[0] || "";
const firstHomeImage = home.match(/<img\b[^>]*src="([^"]+)"/i)?.[1];
if (firstHomeImage !== "../images/boost-club-community.jpg") fail("Homepage must open with boost-club-community.jpg as its first image");

const combined = allHtml.join("\n");
for (let index = 1; index <= 30; index += 1) {
  const slot = String(index).padStart(2, "0");
  if (!combined.includes(`PHOTO SLOT ${slot}`)) fail(`Missing photography brief slot ${slot}`);
}
if (count(combined, /class="photo-brief\s/gi) !== 30) fail("Soft Current site must contain exactly 30 future photography briefs");

const booking = allHtml.find((html) => html.includes('name="soft-current-consultation-en"')) || "";
if (!booking.includes('data-netlify="true"') || !booking.includes('name="form-name" value="soft-current-consultation-en"')) fail("Visit page is missing the Netlify booking form contract");

const stylesFile = path.join(siteRoot, "styles.css");
if (fs.existsSync(stylesFile)) {
  const styles = fs.readFileSync(stylesFile, "utf8");
  if (count(styles, /\{/g) !== count(styles, /\}/g)) fail("Soft Current stylesheet has unbalanced braces");
  for (const token of ["#0d5645", "#c9a24b", "#11705a", "#0a4537", "#08382d", "#e0be6e", "#e6e9de", "#f5f3ee", "#fff", "#1a1f1c", "#5c6660", "#25d366"]) {
    if (!styles.toLowerCase().includes(token)) fail(`Soft Current stylesheet is missing brand token ${token}`);
  }
  if (!styles.includes(':root[data-theme="light"]') || !styles.includes(':root[data-theme="dark"]')) fail("Soft Current stylesheet must include light and dark themes");
  if (!styles.includes("prefers-reduced-motion")) fail("Soft Current stylesheet must include reduced motion support");
}

for (const relative of ["SOFT-CURRENT-PHOTO-BRIEFS.md", "scripts/lib/soft-current-site.mjs", "scripts/validate-soft-current.mjs", "soft-current-site/styles.css", "soft-current-site/interactions.js"]) {
  const source = fs.readFileSync(path.join(root, relative), "utf8");
  if (source.includes("\u2014")) fail(`${relative}: contains a disallowed em dash`);
}

if (errors.length) {
  console.error(`Soft Current validation failed (${errors.length}):`);
  for (const error of errors) console.error(`  ERROR ${error}`);
  process.exit(1);
}

console.log(`Soft Current validation passed: ${softCurrentPages.length} pages, community-first hero, two themes and 30 photography briefs.`);
