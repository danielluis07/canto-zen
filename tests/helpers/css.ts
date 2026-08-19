/**
 * A small, tolerant CSS reader for asserting over authored stylesheets.
 *
 * It exists so the token tests can ask structural questions — "which rules
 * animate a property?", "is `--muted` the border of every control?" — instead
 * of matching substrings against a file. It parses what this repo authors:
 * rules, at-rules, custom properties. It is not a general CSS parser.
 */

export type Declaration = { prop: string; value: string };

export type Rule = {
  /** Selector text, e.g. `:root` or `a, button`. */
  selector: string;
  /** Enclosing at-rule preludes, outermost first. Empty at top level. */
  context: string[];
  declarations: Declaration[];
};

export function parseCss(source: string): Rule[] {
  const rules: Rule[] = [];
  readBlock(stripComments(source), [], rules);
  return rules;
}

/** Custom properties declared on `:root` at the top level of the sheet. */
export function rootTokens(rules: Rule[]): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const rule of rules) {
    if (rule.context.length > 0) continue;
    if (!selectorList(rule.selector).includes(":root")) continue;
    for (const { prop, value } of rule.declarations) {
      if (prop.startsWith("--")) tokens[prop] = value;
    }
  }
  return tokens;
}

/** Follows `var(--a)` chains until a literal value is reached. */
export function resolveToken(
  tokens: Record<string, string>,
  name: string,
  seen: Set<string> = new Set(),
): string | undefined {
  const value = tokens[name];
  if (value === undefined || seen.has(name)) return value;
  seen.add(name);
  const alias = value.match(/^var\(\s*(--[\w-]+)\s*\)$/);
  return alias ? resolveToken(tokens, alias[1], seen) : value;
}

export function selectorList(selector: string): string[] {
  return selector
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/** The properties a `transition` shorthand value animates. */
export function transitionedProperties(transition: string): string[] {
  const properties: string[] = [];
  for (const part of splitTopLevel(transition, ",")) {
    const first = part.trim().split(/\s+/)[0];
    if (first && first !== "none") properties.push(first);
  }
  return properties;
}

function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "");
}

function readBlock(source: string, context: string[], out: Rule[]): void {
  let cursor = 0;
  while (cursor < source.length) {
    const open = source.indexOf("{", cursor);
    if (open === -1) break;
    const semicolon = source.indexOf(";", cursor);
    // A statement that ends before the next block — `@import "…";`.
    if (semicolon !== -1 && semicolon < open) {
      cursor = semicolon + 1;
      continue;
    }
    const close = matchingBrace(source, open);
    const prelude = source.slice(cursor, open).trim();
    const body = source.slice(open + 1, close);
    if (prelude.startsWith("@") && body.includes("{")) {
      readBlock(body, [...context, prelude], out);
    } else {
      out.push({ selector: prelude, context, declarations: readDeclarations(body) });
    }
    cursor = close + 1;
  }
}

function matchingBrace(source: string, open: number): number {
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}" && --depth === 0) return i;
  }
  return source.length;
}

function readDeclarations(body: string): Declaration[] {
  const declarations: Declaration[] = [];
  for (const statement of splitTopLevel(body, ";")) {
    const trimmed = statement.trim();
    if (!trimmed || trimmed.includes("{")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    declarations.push({
      prop: trimmed.slice(0, colon).trim(),
      value: trimmed.slice(colon + 1).trim(),
    });
  }
  return declarations;
}

function splitTopLevel(source: string, separator: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === separator && depth === 0) {
      parts.push(source.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(source.slice(start));
  return parts;
}
