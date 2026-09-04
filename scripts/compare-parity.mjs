#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { domHash, normalizeDom } from "./lib/parity.mjs";

const root = process.cwd();
const groups = ["ro", "en", "ru", "root"];
const pages = groups.flatMap((group) => JSON.parse(fs.readFileSync(path.join(root, "content", group, "pages.json"), "utf8")));
const rows = [];
const failures = [];

for (const page of pages) {
  const generated = fs.readFileSync(path.join(root, "_site", page.output), "utf8");
  const generatedHash = domHash(generated);
  const equivalent = generatedHash === page.baselineDomHash;
  rows.push({ page: page.output, result: equivalent ? "Equivalent" : "Different", reason: equivalent ? "None" : "Normalized DOM hash differs" });
  if (!equivalent) {
    let baseline = "";
    try {
      baseline = execFileSync("git", ["show", `c33b72b:${page.output}`], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    } catch {
      const fallback = path.join(root, page.output);
      if (fs.existsSync(fallback)) baseline = fs.readFileSync(fallback, "utf8");
    }
    const expected = normalizeDom(baseline);
    const actual = normalizeDom(generated);
    let offset = 0;
    while (offset < expected.length && expected[offset] === actual[offset]) offset += 1;
    failures.push({ page: page.output, offset, expected: expected.slice(offset, offset + 180), actual: actual.slice(offset, offset + 180) });
  }
}

const header = "| Page | DOM result | Intentional difference or reason |\n|---|---|---|";
const table = [header, ...rows.map((row) => `| \`${row.page}\` | ${row.result} | ${row.reason} |`)].join("\n");
fs.mkdirSync(path.join(root, "build-metrics"), { recursive: true });
fs.writeFileSync(path.join(root, "build-metrics", "parity-table.md"), `${table}\n`);
fs.writeFileSync(path.join(root, "build-metrics", "parity-results.json"), `${JSON.stringify({
  compared: rows.length,
  equivalent: rows.filter((row) => row.result === "Equivalent").length,
  different: failures.length,
  intentionalStructuralTransformations: [
    "Inline CSS moved to external component stylesheets.",
    "Inline style attributes moved to generated utility classes.",
    "Executable inline scripts moved to external component scripts.",
    "The shared site header and common footer are rendered by components.",
  ],
  rows,
}, null, 2)}\n`);

if (failures.length) {
  console.error(`DOM parity failed for ${failures.length} pages: ${failures.map((failure) => failure.page).join(", ")}`);
  for (const failure of failures.slice(0, 5)) {
    console.error(`  ${failure.page} at ${failure.offset}`);
    console.error(`    expected: ${failure.expected}`);
    console.error(`    actual:   ${failure.actual}`);
  }
  process.exit(1);
}
console.log(`DOM parity passed for all ${rows.length} pages.`);
