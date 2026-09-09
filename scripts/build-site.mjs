#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { documentTemplate, footer, header, renderRegisteredComponents } from "./lib/components.mjs";
import { buildHomepageConcepts } from "./lib/homepage-concepts.mjs";
import { buildSoftCurrentSite } from "./lib/soft-current-site.mjs";

const root = process.cwd();
const outputRoot = path.join(root, "_site");
const contentGroups = ["ro", "en", "ru", "root"];
const assetDirectories = ["css", "js", "images", "fonts", "videos", "vendor"];
const rootAssets = ["_redirects", "robots.txt", "sitemap.xml", "favicon.ico", "apple-touch-icon.png"];

function readPages(group) {
  const file = path.join(root, "content", group, "pages.json");
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function renderPage(page) {
  let body = page.body
    .replace("{{shared-header}}", header({ lang: page.lang, slug: page.slug }))
    .replace("{{shared-footer}}", footer({ lang: page.lang }));
  body = renderRegisteredComponents(body);
  return documentTemplate({
    doctype: page.doctype,
    htmlOpen: page.htmlOpen,
    head: page.head,
    bodyOpen: page.bodyOpen,
    body,
  });
}

function copyIfPresent(relative) {
  const source = path.join(root, relative);
  if (!fs.existsSync(source)) return;
  fs.cpSync(source, path.join(outputRoot, relative), { recursive: true });
}

export function buildSite() {
  fs.rmSync(outputRoot, { recursive: true, force: true });
  fs.mkdirSync(outputRoot, { recursive: true });

  const pages = contentGroups.flatMap(readPages);
  for (const page of pages) {
    const destination = path.join(outputRoot, page.output);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.writeFileSync(destination, renderPage(page));
  }
  for (const directory of assetDirectories) copyIfPresent(directory);
  for (const file of rootAssets) copyIfPresent(file);
  const concepts = buildHomepageConcepts(root, outputRoot);
  const softCurrentPages = buildSoftCurrentSite(root, outputRoot);

  console.log(`Built ${pages.length} site pages, ${concepts.length} homepage concepts and ${softCurrentPages.length} Soft Current pages in _site.`);
  return pages;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) buildSite();
