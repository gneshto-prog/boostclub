function protect(source, pattern) {
  const values = [];
  const text = source.replace(pattern, (match) => {
    const marker = `__CSS_POLICY_${values.length}__`;
    values.push(match);
    return marker;
  });
  return { text, values };
}

function findInValue(property, input) {
  if (["content", "src", "unicode-range"].includes(property)) return [];
  const { text: withoutFunctions } = protect(input, /(?:url|var)\((?:[^()"']+|"[^"]*"|'[^']*')*\)/gi);
  const findings = [];
  const patterns = [
    ["color", /rgba?\([^)]*\)|hsla?\([^)]*\)|#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})\b|\b(?:white|black|transparent)\b/i],
    ["length", /(?<![\w.-])-?(?:\d+\.\d+|\d+|\.\d+)(?:px|rem|em|vw|vh|svh|dvh|vmin|vmax|ch|ex|%)\b/i],
    ["duration", /(?<![\w.-])(?:\d+\.\d+|\d+|\.\d+)(?:ms|s)\b/i],
    ["easing", /cubic-bezier\([^)]*\)/i],
  ];
  for (const [category, pattern] of patterns) {
    const match = withoutFunctions.match(pattern);
    if (match) findings.push(`${category} ${match[0]}`);
  }
  if (/shadow$/i.test(property) && input.trim() !== "none" && !/^var\(/.test(input.trim())) findings.push(`shadow ${input.trim()}`);
  if (/^line-height$/i.test(property) && /^(?:\d+\.\d+|\d+|\.\d+)$/.test(input.trim())) findings.push(`line-height ${input.trim()}`);
  if (/^(?:transition|transition-property|transition-duration|transition-delay|animation|animation-timing-function)$/i.test(property)) {
    const match = withoutFunctions.match(/\b(?:ease-in-out|ease-in|ease-out|ease|linear)\b/);
    if (match) findings.push(`easing ${match[0]}`);
  }
  if (/^(?:margin|padding|gap|row-gap|column-gap|inset|top|right|bottom|left|scroll-margin(?:-top)?|outline-offset)$/i.test(property)) {
    if (/(?<![\w.-])0(?![\w.-])/.test(withoutFunctions)) findings.push("spacing 0");
  }
  return findings;
}

export function findHardcodedDesignValues(css) {
  const comments = protect(css, /\/\*[\s\S]*?\*\//g);
  const findings = [];
  for (const match of comments.text.matchAll(/([\w-]+)\s*:\s*([^;{}]+)(?:;|(?=\}))/g)) {
    const property = match[1];
    for (const finding of findInValue(property, match[2])) findings.push({ property, finding, offset: match.index });
  }
  return findings;
}
