import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseCss, resolveToken, rootTokens, type Rule } from "./css";

/** The stylesheet that ships, read once and shared by every token assertion. */
export const stylesheet: string = readFileSync(
  fileURLToPath(new URL("../../app/globals.css", import.meta.url)),
  "utf8",
);

export const rules: Rule[] = parseCss(stylesheet);

export const tokens: Record<string, string> = rootTokens(rules);

/** A token's literal value, following `var()` aliases. Throws if undeclared. */
export function token(name: string): string {
  const value = resolveToken(tokens, name);
  if (value === undefined) throw new Error(`${name} is not declared on :root`);
  return value;
}
