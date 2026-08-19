import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { parseCss, resolveToken, rootTokens } from "./helpers/css";

const fontsModule = readFileSync("fonts/index.ts", "utf8");
const layout = readFileSync("app/layout.tsx", "utf8");
const tokens = rootTokens(parseCss(readFileSync("app/globals.css", "utf8")));

const files = readdirSync("fonts");

const faces: Array<[string, string, string]> = [
  ["Zen Old Mincho", "zen-old-mincho", "--font-zen-old-mincho"],
  ["Schibsted Grotesk", "schibsted-grotesk", "--font-schibsted-grotesk"],
];

// marca.md §4, build-spec.md "Styling and chrome"
describe("the two families are self-hosted from fonts/", () => {
  for (const [family, slug, variable] of faces) {
    const file = files.find((name) => name.startsWith(slug) && name.endsWith(".woff2"));

    test(`${family} ships as a woff2 in fonts/`, () => {
      expect(file).toBeDefined();
      const buffer = readFileSync(`fonts/${file}`);
      expect(buffer.length).toBeGreaterThan(0);
      expect(buffer.subarray(0, 4).toString("latin1")).toBe("wOF2");
    });

    test(`${family} is loaded from that file and exposed as ${variable}`, () => {
      expect(fontsModule).toContain(file!);
      expect(fontsModule).toContain(variable);
    });

    test(`${family} carries its OFL licence`, () => {
      expect(files.some((name) => name.startsWith("OFL") && name.includes(family.replace(/\s/g, "")))).toBe(true);
    });
  }

  test("the loader is next/font/local — nothing is fetched at build time", () => {
    expect(fontsModule).toContain("next/font/local");
    expect(fontsModule).not.toContain("next/font/google");
    expect(layout).not.toContain("next/font/google");
  });

  test("only the two families the brand allows are loaded", () => {
    const woff2 = files.filter((name) => name.endsWith(".woff2"));
    expect(woff2.length).toBe(faces.length);
  });
});

describe("the stylesheet reads the loaded faces", () => {
  test("--font-mincho and --font-grotesk resolve to the loaded families", () => {
    expect(tokens["--font-mincho"]).toContain("var(--font-zen-old-mincho)");
    expect(tokens["--font-grotesk"]).toContain("var(--font-schibsted-grotesk)");
  });

  test("each family stack ends in a real fallback", () => {
    expect(resolveToken(tokens, "--font-mincho")).toMatch(/serif\s*$/);
    expect(resolveToken(tokens, "--font-grotesk")).toMatch(/sans-serif\s*$/);
  });

  test("the document carries both font variables", () => {
    expect(layout).toContain("zenOldMincho.variable");
    expect(layout).toContain("schibstedGrotesk.variable");
  });
});

// marca.md §4, acessibilidade.md §2.9
describe("the document", () => {
  test("is pt-BR", () => {
    expect(layout).toContain('lang="pt-BR"');
  });
});
