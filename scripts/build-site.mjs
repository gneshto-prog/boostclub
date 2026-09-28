#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { documentTemplate, footer, header, renderRegisteredComponents } from "./lib/components.mjs";
import { buildHomepageConcepts } from "./lib/homepage-concepts.mjs";
import { buildSoftCurrentSite } from "./lib/soft-current-site.mjs";
import { structuredHead } from "./lib/structured-data.mjs";
import { reviewSnapshot, reviewSummary, afterVisit, processFaq } from "../content/consumer-copy.mjs";
import { responsiveImages, responsivePreloads } from './lib/responsive-images.mjs';
import { clubPhotoPreview, clubContactPhoto, clubGallery } from './lib/club-gallery.mjs';
import { transformationGallery } from './lib/transformation-gallery.mjs';

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
  if (['ro','en','ru'].includes(page.lang)) body = body
    .replaceAll('{{review-summary}}', reviewSummary(page.lang))
    .replaceAll('{{review-count}}', String(reviewSnapshot.count))
    .replaceAll('{{review-rating}}', reviewSnapshot.rating)
    .replaceAll('{{after-visit}}', afterVisit(page.lang))
    .replaceAll('{{club-photo-preview}}', clubPhotoPreview(page.lang))
    .replaceAll('{{club-contact-photo}}', clubContactPhoto(page.lang))
    .replaceAll('{{club-gallery}}', clubGallery(page.lang))
    .replaceAll('{{transformation-gallery}}', transformationGallery(page.lang))
    .replaceAll('{{transformation-preview}}', transformationGallery(page.lang, true))
    .replaceAll('{{process-faq}}', processFaq(page.lang));
  body = renderRegisteredComponents(body);
  body = responsiveImages(body);
  // Shared consent/event contract runs before the page scripts in every locale.
  body = body.replace(/<script\b/, '<script src="/js/analytics.js"></script>\n<script');
  return documentTemplate({
    doctype: page.doctype,
    htmlOpen: page.htmlOpen,
    head: responsivePreloads(structuredHead(page), body),
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
