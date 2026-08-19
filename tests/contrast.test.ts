import { describe, expect, test } from "bun:test";
import { contrastRatio, relativeLuminance } from "./helpers/contrast";
import { token as hex } from "./helpers/sheet";

describe("the contrast formula", () => {
  test("black on white is 21:1", () => {
    expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 5);
  });

  test("a colour against itself is 1:1", () => {
    expect(contrastRatio("#6B675F", "#6B675F")).toBeCloseTo(1, 5);
  });

  test("luminance is anchored at the ends of the range", () => {
    expect(relativeLuminance("#FFFFFF")).toBeCloseTo(1, 5);
    expect(relativeLuminance("#000000")).toBeCloseTo(0, 5);
  });

  test("shorthand hex is read the same as longhand", () => {
    expect(contrastRatio("#fff", "#000")).toBeCloseTo(contrastRatio("#FFFFFF", "#000000"), 5);
  });
});

// acessibilidade.md §3, recomputed against the palette that ships.
describe("measured contrast — text floor 4.5:1", () => {
  const pairs: Array<[string, string, number]> = [
    ["--ink", "--plaster", 15.8],
    ["--ink", "--kozo", 14.08],
    ["--muted", "--plaster", 5.11],
    ["--muted", "--kozo", 4.56],
    ["--indigo", "--plaster", 11.87],
    ["--indigo", "--kozo", 10.58],
    ["--plaster", "--indigo", 11.87],
    ["--plaster", "--ink", 15.8],
    ["--kozo", "--ink", 14.08],
  ];

  for (const [foreground, ground, documented] of pairs) {
    test(`${foreground} on ${ground} measures ${documented} and clears 4.5`, () => {
      const measured = contrastRatio(hex(foreground), hex(ground));
      expect(measured).toBeCloseTo(documented, 1);
      expect(measured).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe("measured contrast — boundary floor 3:1", () => {
  const grounds = ["--plaster", "--kozo"];

  for (const ground of grounds) {
    test(`the resting control border clears 3 on ${ground}`, () => {
      expect(contrastRatio(hex("--border-control"), hex(ground))).toBeGreaterThanOrEqual(3);
    });
  }

  test("the focus ring clears 3 on --plaster", () => {
    expect(contrastRatio(hex("--indigo"), hex("--plaster"))).toBeGreaterThanOrEqual(3);
  });
});

describe("the two values acessibilidade.md §5 forced", () => {
  test("--muted is the shallowest value clearing both grounds", () => {
    expect(hex("--muted").toUpperCase()).toBe("#6B675F");
    // #7A756C, the value it replaced, failed both.
    expect(contrastRatio("#7A756C", hex("--plaster"))).toBeLessThan(4.5);
    expect(contrastRatio("#7A756C", hex("--kozo"))).toBeLessThan(4.5);
  });

  test("--hairline is too light to be a control border, which is why it is not one", () => {
    expect(contrastRatio(hex("--hairline"), hex("--plaster"))).toBeLessThan(3);
    expect(hex("--border-control")).not.toBe(hex("--hairline"));
  });
});

describe("--oak carries no secondary text", () => {
  test("--ink qualifies on oak and --muted does not", () => {
    expect(contrastRatio(hex("--ink"), hex("--oak"))).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(hex("--muted"), hex("--oak"))).toBeLessThan(4.5);
  });
});
