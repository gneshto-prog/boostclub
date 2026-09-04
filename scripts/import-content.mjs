#!/usr/bin/env node

import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { domHash } from "./lib/parity.mjs";

const root = process.cwd();
const baselineCommit = "c33b72b";
const languageSlugs = [
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
const pageSpecs = [
  ...["ro", "en", "ru"].flatMap((lang) => languageSlugs.map((slug) => ({
    lang,
    slug,
    file: `${lang === "ro" ? "" : `${lang}/`}${slug}.html`,
    group: lang,
  }))),
  { lang: "ro", slug: "404", file: "404.html", group: "root" },
  { lang: "ro", slug: "program-trainee", file: "program-trainee.html", group: "root" },
];

const componentCss = new Map();
const componentJs = new Map();
const utilityDeclarations = new Map();
const cssUsage = new Map();
const rootVariables = new Map();
const primitiveTokens = new Map();
let literalOccurrences = 0;
let inlineStyleBlockOccurrences = 0;
let inlineStyleLinesBefore = 0;
let inlineStyleAttributeOccurrences = 0;
let executableInlineScriptOccurrences = 0;

function digest(value, size = 10) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, size);
}

function ensureDir(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function write(relative, value) {
  const absolute = path.join(root, relative);
  ensureDir(path.dirname(absolute));
  fs.writeFileSync(absolute, value);
}

function readBaseline(relative) {
  try {
    return execFileSync("git", ["show", `${baselineCommit}:${relative}`], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch {
    return fs.readFileSync(path.join(root, relative), "utf8");
  }
}

function addUsage(sourceId, pageFile) {
  if (!cssUsage.has(sourceId)) cssUsage.set(sourceId, new Set());
  cssUsage.get(sourceId).add(pageFile);
}

function tokenName(category, value) {
  return `--${category}-${digest(value, 8)}`;
}

function registerToken(category, value) {
  const key = `${category}:${value}`;
  if (!primitiveTokens.has(key)) primitiveTokens.set(key, { name: tokenName(category, value), value });
  literalOccurrences += 1;
  return `var(${primitiveTokens.get(key).name})`;
}

function transformValue(property, input) {
  if (["content", "src", "unicode-range"].includes(property)) return input;
  const trimmed = input.trim();
  if (/shadow$/i.test(property) && trimmed !== "none" && !/^var\(/.test(trimmed)) {
    return input.replace(trimmed, registerToken("shadow", trimmed));
  }

  const protectedParts = [];
  let value = input.replace(/(?:url|var)\((?:[^()"']+|"[^"]*"|'[^']*')*\)/gi, (match) => {
    const marker = `__CSS_PROTECTED_${protectedParts.length}__`;
    protectedParts.push(match);
    return marker;
  });

  value = value.replace(/rgba?\([^)]*\)|hsla?\([^)]*\)/gi, (match) => registerToken("color", match));
  value = value.replace(/#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b/gi, (match) => registerToken("color", match));
  value = value.replace(/\b(?:white|black|transparent)\b/gi, (match) => registerToken("color", match.toLowerCase()));
  value = value.replace(/(?<![\w.-])-?(?:\d+\.\d+|\d+|\.\d+)(?:px|rem|em|vw|vh|svh|dvh|vmin|vmax|ch|ex|%)\b/gi, (match) => registerToken("length", match));
  value = value.replace(/(?<![\w.-])(?:\d+\.\d+|\d+|\.\d+)(?:ms|s)\b/gi, (match) => registerToken("duration", match));
  value = value.replace(/cubic-bezier\([^)]*\)/gi, (match) => registerToken("easing", match));

  if (/^(?:transition|transition-property|transition-duration|transition-delay|animation|animation-timing-function)$/i.test(property)) {
    value = value.replace(/\b(?:ease-in-out|ease-in|ease-out|ease|linear)\b/g, (match) => registerToken("easing", match));
  }
  if (/^line-height$/i.test(property)) {
    value = value.replace(/(?<![\w.-])(?:\d+\.\d+|\d+|\.\d+)(?![\w.-])/g, (match) => registerToken("line-height", match));
  }
  if (/^(?:margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left|scroll-margin(?:-top)?|outline-offset)$/i.test(property)) {
    value = value.replace(/(?<![\w.-])0(?![\w.-])/g, () => registerToken("space", "0"));
  }

  return value.replace(/__CSS_PROTECTED_(\d+)__/g, (_, index) => protectedParts[Number(index)]);
}

function transformDeclarations(css) {
  const protectedComments = [];
  let output = css.replace(/\/\*[\s\S]*?\*\//g, (match) => {
    const marker = `__CSS_COMMENT_${protectedComments.length}__`;
    protectedComments.push(match);
    return marker;
  });
  output = output.replace(/([\w-]+)(\s*:\s*)([^;{}]+)(;|(?=\}))/g, (match, property, separator, value, ending) => {
    return `${property}${separator}${transformValue(property, value)}${ending}`;
  });
  return output.replace(/__CSS_COMMENT_(\d+)__/g, (_, index) => protectedComments[Number(index)]);
}

function extractRootVariables(sourceId, css) {
  return css.replace(/:root\s*\{([^{}]*)\}/gi, (_, declarations) => {
    const values = [];
    for (const match of declarations.matchAll(/(--[\w-]+)\s*:\s*([^;]+);?/g)) {
      values.push({ name: match[1], value: transformValue(match[1], match[2].trim()) });
    }
    if (values.length) rootVariables.set(sourceId, values);
    return "";
  });
}

function componentHref(file, type, name) {
  const prefix = file.includes("/") ? "../" : "";
  return `${prefix}${type}/components/${name}`;
}

function replaceStyleAttributes(html, pageFile) {
  return html.replace(/<([a-z][\w:-]*)([^>]*?)\sstyle=("([^"]*)"|'([^']*)')([^>]*)>/gi, (match, tag, before, quoted, doubleValue, singleValue, after) => {
    inlineStyleAttributeOccurrences += 1;
    const declaration = (doubleValue ?? singleValue).trim().replace(/;?$/, ";");
    const className = `u-inline-${digest(declaration, 8)}`;
    utilityDeclarations.set(className, declaration);
    addUsage("inline-utilities", pageFile);
    let attributes = `${before}${after}`;
    if (/\sclass=("[^"]*"|'[^']*')/i.test(attributes)) {
      attributes = attributes.replace(/\sclass=("([^"]*)"|'([^']*)')/i, (classMatch, classQuoted, doubleClass, singleClass) => {
        const classes = doubleClass ?? singleClass;
        const quote = classQuoted[0];
        return ` class=${quote}${classes} ${className}${quote}`;
      });
    } else {
      attributes = `${attributes} class="${className}"`;
    }
    return `<${tag}${attributes}>`;
  });
}

function replaceStyleBlocks(html, pageFile) {
  return html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_, css) => {
    inlineStyleBlockOccurrences += 1;
    inlineStyleLinesBefore += css.split(/\r?\n/).length;
    const hash = digest(css);
    const sourceId = `component-${hash}`;
    if (!componentCss.has(sourceId)) componentCss.set(sourceId, { css, pageFile });
    addUsage(sourceId, pageFile);
    return `<link rel="stylesheet" href="${componentHref(pageFile, "css", `${hash}.css`)}">`;
  });
}

function rewriteComponentUrls(css, pageFile) {
  return css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/gi, (match, quote, reference) => {
    const clean = reference.trim();
    if (/^(?:data:|https?:|\/\/|#)/i.test(clean)) return match;
    const suffixMatch = clean.match(/([?#].*)$/);
    const suffix = suffixMatch?.[1] || "";
    const pathPart = suffix ? clean.slice(0, -suffix.length) : clean;
    const target = path.normalize(path.join(path.dirname(pageFile), pathPart));
    const rewritten = path.relative("css/components", target).split(path.sep).join("/");
    return `url(${quote}${rewritten}${suffix}${quote})`;
  });
}

function replaceInlineScripts(html, pageFile) {
  return html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attributes, source) => {
    if (/\bsrc\s*=/i.test(attributes) || /application\/ld\+json/i.test(attributes) || !source.trim()) return match;
    executableInlineScriptOccurrences += 1;
    const hash = digest(source);
    componentJs.set(hash, source.trimStart());
    return `<script src="${componentHref(pageFile, "js", `${hash}.js`)}"></script>`;
  });
}

function sourceIdsFor(html, pageFile) {
  const ids = [];
  for (const match of html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)) {
    const clean = match[1].split(/[?#]/)[0];
    let id = null;
    if (clean.endsWith("/style.css") || clean === "css/style.css") id = "style";
    if (clean.endsWith("/business-phase2.css") || clean === "css/business-phase2.css") id = "business-phase2";
    const component = clean.match(/css\/components\/([a-f0-9]+)\.css$/);
    if (component) id = `component-${component[1]}`;
    if (clean.endsWith("css/components/inline-utilities.css")) id = "inline-utilities";
    if (id && !ids.includes(id)) ids.push(id);
  }
  for (const id of ids) addUsage(id, pageFile);
  return ids;
}

function injectSystemStyles(html, pageFile, usesUtilities) {
  const prefix = pageFile.includes("/") ? "../" : "";
  const links = [
    `<link rel="stylesheet" href="${prefix}css/tokens.css">`,
    `<link rel="stylesheet" href="${prefix}css/scaffolding.css">`,
    usesUtilities ? `<link rel="stylesheet" href="${prefix}css/components/inline-utilities.css">` : "",
  ].filter(Boolean).join("\n  ");
  const firstStylesheet = /<link\b[^>]*rel=["']stylesheet["'][^>]*>/i;
  if (firstStylesheet.test(html)) return html.replace(firstStylesheet, `${links}\n  $&`);
  return html.replace(/<\/head>/i, `  ${links}\n</head>`);
}

function parseDocument(html, file) {
  html = html.replace(/<\/head>\s*((?:<link\b[^>]*rel=["']stylesheet["'][^>]*>\s*)+)<body/gi, "$1\n</head>\n<body");
  const match = html.match(/^\s*(<!doctype[^>]*>)\s*(<html[^>]*>)\s*<head>([\s\S]*?)<\/head>\s*(<body[^>]*>)([\s\S]*?)<\/body>\s*<\/html>\s*$/i);
  if (!match) throw new Error(`Could not parse document shell: ${file}`);
  return { doctype: match[1], htmlOpen: match[2], head: match[3], bodyOpen: match[4], body: match[5] };
}

function replaceSharedComponents(document, page, sharedFooters) {
  if (/<header class="site-header">/i.test(document.body)) {
    document.body = document.body.replace(/<header class="site-header">[\s\S]*?<\/header>/i, "{{shared-header}}");
  }
  const footerMatch = document.body.match(/<footer class="site-footer">[\s\S]*?<\/footer>/i);
  if (footerMatch && footerMatch[0] === sharedFooters.get(page.lang)) {
    document.body = document.body.replace(footerMatch[0], "{{shared-footer}}");
  }
  document.componentCounts = {
    hero: (document.body.match(/<(?:section|header)\b[^>]*class="[^"]*\bhero\b/gi) || []).length,
    cta: (document.body.match(/<(?:div|section)\b[^>]*class="[^"]*\b(?:hero-ctas|cta-row)\b/gi) || []).length,
    reviewCard: (document.body.match(/<blockquote\b[^>]*class="[^"]*\bquote\b/gi) || []).length,
    faq: (document.body.match(/<(?:div|section)\b[^>]*class="[^"]*\bfaq(?:-item|-list)?\b/gi) || []).length,
    form: (document.body.match(/<form\b/gi) || []).length,
  };
  document.lang = page.lang;
  document.slug = page.slug;
  document.output = page.file;
  return document;
}

function addDataCss(document, ids) {
  if (!ids.length) return;
  document.htmlOpen = document.htmlOpen.replace(/>$/, ` data-css="${ids.join(" ")}">`);
}

function tokenizedRootBlock(sourceId, declarations) {
  const selector = `html[data-css~="${sourceId}"]`;
  const body = declarations.map(({ name, value }) => `  ${name}: ${value};`).join("\n");
  return `${selector} {\n${body}\n}`;
}

const sharedFooters = new Map(["ro", "en", "ru"].map((lang) => {
  const file = `${lang === "ro" ? "" : `${lang}/`}index.html`;
  const html = readBaseline(file);
  return [lang, html.match(/<footer class="site-footer">[\s\S]*?<\/footer>/i)?.[0] || ""];
}));

const pagesByGroup = new Map();
for (const page of pageSpecs) {
  const source = readBaseline(page.file);
  let html = replaceStyleAttributes(source, page.file);
  html = replaceStyleBlocks(html, page.file);
  html = replaceInlineScripts(html, page.file);
  const usesUtilities = cssUsage.get("inline-utilities")?.has(page.file) || false;
  html = injectSystemStyles(html, page.file, usesUtilities);
  const ids = sourceIdsFor(html, page.file);
  const document = parseDocument(html, page.file);
  addDataCss(document, ids);
  const record = replaceSharedComponents(document, page, sharedFooters);
  record.baselineDomHash = domHash(source);
  if (!pagesByGroup.has(page.group)) pagesByGroup.set(page.group, []);
  pagesByGroup.get(page.group).push(record);
}

const cssSources = new Map([
  ["style", readBaseline("css/style.css")],
  ...[...componentCss.entries()].map(([sourceId, record]) => [sourceId, rewriteComponentUrls(record.css, record.pageFile)]),
  ["inline-utilities", [...utilityDeclarations.entries()].map(([className, declaration]) => `.${className} { ${declaration} }`).join("\n")],
  ["business-phase2", readBaseline("css/business-phase2.css")],
  ["scaffolding", fs.readFileSync(path.join(root, "css/scaffolding.css"), "utf8")],
]);

for (const [sourceId, originalCss] of cssSources) {
  const withoutRoots = extractRootVariables(sourceId, originalCss);
  const transformed = transformDeclarations(withoutRoots);
  if (sourceId === "style") write("css/style.css", transformed);
  else if (sourceId === "business-phase2") write("css/business-phase2.css", transformed);
  else if (sourceId === "scaffolding") write("css/scaffolding.css", transformed);
  else if (sourceId === "inline-utilities") write("css/components/inline-utilities.css", transformed);
  else write(`css/components/${sourceId.replace("component-", "")}.css`, transformed);
}

for (const [hash, source] of componentJs) write(`js/components/${hash}.js`, `${source.trimEnd()}\n`);
for (const [group, pages] of pagesByGroup) write(`content/${group}/pages.json`, `${JSON.stringify(pages, null, 2)}\n`);

const hardcodedOccurrencesBefore = literalOccurrences;
const scaffoldValues = [
  ["--type-fluid-sm", "clamp(0.875rem, 0.82rem + 0.25vw, 1rem)"],
  ["--type-fluid-body", "clamp(1rem, 0.94rem + 0.3vw, 1.125rem)"],
  ["--type-fluid-display", "clamp(2.25rem, 1.5rem + 3.5vw, 4.5rem)"],
  ["--layout-grid-columns", "12"],
  ["--layout-grid-gap", registerToken("length", "24px")],
  ["--motion-reveal-distance", registerToken("length", "24px")],
  ["--motion-page-duration", registerToken("duration", "240ms")],
];

const tokenLines = [...primitiveTokens.values()].sort((a, b) => a.name.localeCompare(b.name)).map(({ name, value }) => `  ${name}: ${value};`);
const scaffoldLines = scaffoldValues.map(([name, value]) => `  ${name}: ${value};`);
const scopedRoots = [...rootVariables.entries()].map(([sourceId, declarations]) => tokenizedRootBlock(sourceId, declarations));
const tokensCss = `:root {\n${tokenLines.join("\n")}\n${scaffoldLines.join("\n")}\n}\n\n${scopedRoots.join("\n\n")}\n`;
write("css/tokens.css", tokensCss);

write("build-metrics/token-inventory.json", `${JSON.stringify({
  hardcodedOccurrencesBefore,
  primitiveTokensAfter: primitiveTokens.size,
  semanticAliases: [...rootVariables.values()].reduce((sum, values) => sum + values.length, 0),
  inlineStyleBlocksBefore: inlineStyleBlockOccurrences,
  inlineStyleLinesBefore,
  uniqueInlineStyleBlocksAfter: componentCss.size,
  inlineStyleAttributesBefore: inlineStyleAttributeOccurrences,
  uniqueInlineStyleUtilitiesAfter: utilityDeclarations.size,
  executableInlineScriptsBefore: executableInlineScriptOccurrences,
  uniqueInlineScriptsAfter: componentJs.size,
  pageCount: pageSpecs.length,
}, null, 2)}\n`);

console.log(`Imported ${pageSpecs.length} pages.`);
console.log(`Extracted ${componentCss.size} unique inline style blocks and ${componentJs.size} unique inline scripts.`);
console.log(`Collapsed ${literalOccurrences} hardcoded design-value occurrences to ${primitiveTokens.size} primitive tokens.`);
