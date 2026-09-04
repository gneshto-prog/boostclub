import crypto from "node:crypto";

function cleanClassAttribute(attributes) {
  return attributes.replace(/\sclass=("([^"]*)"|'([^']*)')/gi, (match, quoted, doubleValue, singleValue) => {
    const quote = quoted[0];
    const classes = (doubleValue ?? singleValue).split(/\s+/).filter(Boolean).filter((name) => !name.startsWith("u-inline-")).sort();
    return classes.length ? ` class=${quote}${classes.join(" ")}${quote}` : "";
  });
}

function canonicalizeTag(match, tag, rawAttributes) {
  if (tag.startsWith("/")) return `<${tag.toLowerCase()}>`;
  let attributes = cleanClassAttribute(rawAttributes).replace(/\sdata-css=("[^"]*"|'[^']*')/gi, "");
  const selfClosing = /\/\s*$/.test(attributes);
  attributes = attributes.replace(/\/\s*$/, "");
  const parsed = [];
  const pattern = /([^\s=]+)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s]+))?/g;
  for (const attribute of attributes.matchAll(pattern)) {
    parsed.push({ name: attribute[1].toLowerCase(), value: attribute[2] || "" });
  }
  parsed.sort((a, b) => a.name.localeCompare(b.name) || a.value.localeCompare(b.value));
  const suffix = parsed.map(({ name, value }) => value ? ` ${name}=${value}` : ` ${name}`).join("");
  return `<${tag.toLowerCase()}${suffix}${selfClosing ? "/" : ""}>`;
}

export function normalizeDom(html) {
  let output = html.replace(/<!--([\s\S]*?)-->/g, "");
  output = output.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  output = output.replace(/<link\b[^>]*href=["'][^"']*(?:css\/tokens\.css|css\/scaffolding\.css|css\/components\/[^"']+)["'][^>]*>/gi, "");
  output = output.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attributes) => {
    if (/application\/ld\+json/i.test(attributes)) return match;
    if (/\bsrc=["'][^"']*js\/components\//i.test(attributes)) return "";
    if (!/\bsrc\s*=/i.test(attributes)) return "";
    return match;
  });
  output = output.replace(/\sstyle=("[^"]*"|'[^']*')/gi, "");
  output = output.replace(/<\/?[a-z][^<>]*>/gi, (match) => {
    const parts = match.match(/^<([/]?[a-z][\w:-]*)([\s\S]*?)>$/i);
    return parts ? canonicalizeTag(match, parts[1], parts[2]) : match;
  });
  return output.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();
}

export function domHash(html) {
  return crypto.createHash("sha256").update(normalizeDom(html)).digest("hex");
}
