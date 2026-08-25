import { describe, expect, test } from "bun:test";
import { selectorList, transitionedProperties, type Rule } from "./helpers/css";
import { rules, stylesheet as source, token, tokens } from "./helpers/sheet";

const declarationsOf = (rule: Rule, prop: string): string[] =>
  rule.declarations.filter((d) => d.prop === prop).map((d) => d.value);

const everyDeclaration = (prop: string): Array<{ rule: Rule; value: string }> =>
  rules.flatMap((rule) => declarationsOf(rule, prop).map((value) => ({ rule, value })));

const rulesReferencing = (name: string): Rule[] =>
  rules.filter((rule) => rule.declarations.some((d) => d.value.includes(`var(${name})`)));

// marca.md §3
describe("the palette", () => {
  const hexes: Array<[string, string]> = [
    ["--ink", "#1B1A18"],
    ["--plaster", "#FCFCFB"],
    ["--kozo", "#F1F0EC"],
    ["--oak", "#C6B49A"],
    ["--hairline", "#DEDDD8"],
    ["--indigo", "#223244"],
    ["--muted", "#6B675F"],
  ];

  for (const [name, hex] of hexes) {
    test(`${name} is ${hex}`, () => {
      expect(token(name).toUpperCase()).toBe(hex);
    });
  }

  test("lands once — no token is declared twice on :root", () => {
    const declared = rules
      .filter((rule) => rule.context.length === 0 && selectorList(rule.selector).includes(":root"))
      .flatMap((rule) => rule.declarations.map((d) => d.prop));
    expect(declared.length).toBe(new Set(declared).size);
  });

  test("there is no dark mode", () => {
    expect(source).not.toContain("prefers-color-scheme");
  });
});

// acessibilidade.md §5.2
describe("the resting control border", () => {
  test("--border-control is --muted", () => {
    expect(token("--border-control")).toBe(token("--muted"));
  });

  test("the focused or filled border is --ink", () => {
    expect(token("--border-control-active")).toBe(token("--ink"));
  });

  test("every control carries the control border at rest", () => {
    const controls = rules.filter((rule) =>
      selectorList(rule.selector).some((selector) => /^(input|select|textarea)$/.test(selector)),
    );
    expect(controls.length).toBeGreaterThan(0);
    for (const rule of controls) {
      const borders = [
        ...declarationsOf(rule, "border"),
        ...declarationsOf(rule, "border-color"),
      ];
      expect(borders.length).toBeGreaterThan(0);
      for (const value of borders) {
        expect(value).toContain("var(--border-control)");
      }
    }
  });

  test("--hairline never borders a control", () => {
    for (const rule of rulesReferencing("--hairline")) {
      const bordersAControl = selectorList(rule.selector).some((selector) =>
        /input|select|textarea|button|role="button"|\[type=/.test(selector),
      );
      expect(bordersAControl).toBe(false);
    }
  });
});

// marca.md §4
describe("the type scale", () => {
  const scale: Array<[string, string, string, string]> = [
    ["display-xl", "clamp(2.1rem, 3.6vw, 3.25rem)", "1.08", "0.005em"],
    ["display-l", "1.75rem", "1.2", "0.005em"],
    ["display-m", "1.35rem", "1.45", "0.005em"],
    ["price", "1.75rem", "1.1", "-0.01em"],
    ["body", "1rem", "1.55", "0"],
    ["body-s", "0.875rem", "1.5", "0"],
    ["annotation", "0.6875rem", "1.4", "0.16em"],
    ["cta", "0.75rem", "1", "0.18em"],
  ];

  for (const [role, size, leading, tracking] of scale) {
    test(`${role} is a token, not a per-page decision`, () => {
      expect(token(`--size-${role}`).replace(/\s+/g, " ")).toBe(size);
      expect(token(`--leading-${role}`)).toBe(leading);
      expect(token(`--tracking-${role}`)).toBe(tracking);
    });

    test(`.t-${role} reads the ${role} tokens`, () => {
      const rule = rules.find((r) => selectorList(r.selector).includes(`.t-${role}`));
      expect(rule).toBeDefined();
      expect(declarationsOf(rule!, "font-size")).toEqual([`var(--size-${role})`]);
      expect(declarationsOf(rule!, "line-height")).toEqual([`var(--leading-${role})`]);
      expect(declarationsOf(rule!, "letter-spacing")).toEqual([`var(--tracking-${role})`]);
    });
  }

  test("the annotation and CTA voices are uppercase at weight 500", () => {
    for (const role of ["annotation", "cta"]) {
      const rule = rules.find((r) => selectorList(r.selector).includes(`.t-${role}`))!;
      expect(declarationsOf(rule, "text-transform")).toEqual(["uppercase"]);
      expect(declarationsOf(rule, "font-weight")).toEqual(["500"]);
    }
  });
});

// marca.md §4, §8
describe("the two families", () => {
  // Piece name, collection title, editorial title and one feature line per
  // page — the four roles marca.md §4 allows, carried by three sizes.
  test("Mincho is available only to the display roles", () => {
    const selectors = rulesReferencing("--font-mincho").flatMap((rule) =>
      selectorList(rule.selector),
    );
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) {
      expect(selector).toMatch(/^\.t-display-(xl|l|m)$/);
    }
  });

  test("no utility hands Mincho to an arbitrary surface", () => {
    const themed = rules
      .filter(
        (rule) =>
          rule.selector.startsWith("@theme") || rule.context.some((c) => c.startsWith("@theme")),
      )
      .flatMap((rule) => rule.declarations);
    for (const { prop, value } of themed) {
      if (prop.startsWith("--font-")) expect(value).not.toContain("--font-mincho");
    }
  });

  test("Grotesk is the family the document reads", () => {
    const documentRules = rules.filter((rule) =>
      selectorList(rule.selector).some((selector) => selector === "body" || selector === "html"),
    );
    const families = documentRules.flatMap((rule) => declarationsOf(rule, "font-family"));
    expect(families.some((value) => value.includes("var(--font-grotesk)"))).toBe(true);
  });

  // Price, measurement, parcela, CEP and prazo — every figure in a data
  // context, which is every voice that carries one (marca.md §§4, 8).
  test("tabular figures are enabled on the data voices", () => {
    for (const role of ["price", "annotation", "body-s"]) {
      const rule = rules.find((r) => selectorList(r.selector).includes(`.t-${role}`))!;
      expect(declarationsOf(rule, "font-variant-numeric")).toEqual(["tabular-nums"]);
    }
  });
});

// marca.md §6, acessibilidade.md §2.3
describe("focus", () => {
  const focusRule = rules.find(
    (rule) => rule.context.length === 0 && selectorList(rule.selector).includes(":focus-visible"),
  );

  test("the ring is applied globally", () => {
    expect(focusRule).toBeDefined();
  });

  test("the ring is 2px solid indigo at 3px offset", () => {
    expect(declarationsOf(focusRule!, "outline")).toEqual([
      "var(--focus-width) solid var(--focus-color)",
    ]);
    expect(token("--focus-width")).toBe("2px");
    expect(token("--focus-color")).toBe(token("--indigo"));
    expect(declarationsOf(focusRule!, "outline-offset")).toEqual(["var(--focus-offset)"]);
    expect(token("--focus-offset")).toBe("3px");
  });

  test("no rule removes an outline without replacing it", () => {
    for (const { value } of everyDeclaration("outline")) {
      expect(value).not.toBe("none");
      expect(value).not.toBe("0");
    }
  });
});

// marca.md §6
describe("stroke and corner", () => {
  test("the radius token is zero and nothing rounds a corner", () => {
    expect(token("--radius")).toBe("0");
    for (const { value } of everyDeclaration("border-radius")) {
      expect(["0", "var(--radius)"]).toContain(value);
    }
  });

  test("there is no UI shadow", () => {
    for (const { value } of everyDeclaration("box-shadow")) {
      expect(value).toBe("none");
    }
    expect(source).not.toContain("text-shadow");
    expect(source).not.toContain("drop-shadow");
  });

  // Unlayered, so no `rounded-*` or `shadow-*` utility can reintroduce either:
  // marca.md §6 says zero radius and no shadow anywhere, not by default.
  test("the radius and shadow floors sit outside every layer", () => {
    for (const prop of ["border-radius", "box-shadow"]) {
      const floors = everyDeclaration(prop).filter(({ rule }) =>
        selectorList(rule.selector).includes("*"),
      );
      expect(floors.length).toBe(1);
      expect(floors[0].rule.context).toEqual([]);
    }
  });

  test("a hairline is 1px", () => {
    expect(token("--hairline-width")).toBe("1px");
    const widths = [
      ...everyDeclaration("border-width"),
      ...everyDeclaration("border-top-width"),
      ...everyDeclaration("border-bottom-width"),
    ];
    for (const { value } of widths) {
      expect(["var(--hairline-width)", "1px", "0"]).toContain(value);
    }
    for (const { value } of everyDeclaration("border")) {
      // `border: 0` removes a stroke; anything that draws one draws a hairline.
      expect(["var(--hairline-width)", "0"]).toContain(value.split(/\s+/)[0]);
    }
  });
});

// marca.md §9
describe("the motion vocabulary", () => {
  const allowlist = [
    "color",
    "background-color",
    "border-color",
    "text-decoration-color",
    "outline-color",
    "opacity",
  ];

  test("the tokens are one duration and one easing", () => {
    expect(token("--motion-duration")).toBe("120ms");
    expect(token("--motion-ease")).toBe("linear");
    expect(Object.keys(tokens).filter((name) => name.startsWith("--motion-duration"))).toEqual([
      "--motion-duration",
    ]);
    expect(Object.keys(tokens).filter((name) => name.startsWith("--motion-ease"))).toEqual([
      "--motion-ease",
    ]);
  });

  test("the closed list has exactly two entries", () => {
    const declared = Object.keys(tokens)
      .filter((name) => name.startsWith("--transition-"))
      .sort();
    expect(declared).toEqual(["--transition-color", "--transition-opacity"]);
  });

  test("every transition in the sheet is one of the two entries", () => {
    for (const { rule, value } of everyDeclaration("transition")) {
      if (rule.context.length === 0 && selectorList(rule.selector).includes(":root")) continue;
      expect(["var(--transition-color)", "var(--transition-opacity)"]).toContain(value);
    }
  });

  test("only allowlisted properties are animated", () => {
    for (const entry of ["--transition-color", "--transition-opacity"]) {
      const animated = transitionedProperties(token(entry));
      expect(animated.length).toBeGreaterThan(0);
      for (const property of animated) expect(allowlist).toContain(property);
      expect(token(entry)).toContain("var(--motion-duration)");
      expect(token(entry)).toContain("var(--motion-ease)");
    }
  });

  test("transform is refused by name", () => {
    // `text-transform` is a typographic case change, not a displacement.
    for (const rule of rules) {
      for (const { prop, value } of rule.declarations) {
        if (prop.includes("transform")) expect(prop).toBe("text-transform");
        expect(value).not.toContain("transform");
      }
    }
    expect(source).not.toContain("translate");
    expect(source).not.toContain("scale(");
    expect(source).not.toContain("rotate");
  });

  test("entry 1 carries colour and entry 2 carries opacity, and neither carries the other", () => {
    expect(token("--transition-color")).not.toContain("opacity");
    expect(token("--transition-opacity")).not.toContain("color");
  });

  test("conteúdo velho dims to 0.45 after a delay that is not motion", () => {
    expect(token("--conteudo-velho-opacity")).toBe("0.45");
    expect(token("--conteudo-velho-delay")).toBe("120ms");
    const velho = rules.find((rule) =>
      selectorList(rule.selector).some((selector) => selector.includes(".conteudo-velho")),
    );
    expect(velho).toBeDefined();
    expect(declarationsOf(velho!, "transition")).toEqual(["var(--transition-opacity)"]);
  });

  // The region that dims is the region that announces itself: `aria-busy` is
  // both the state and the hook (erros.md §4.2).
  test("the dim is carried by aria-busy", () => {
    const dimmed = rules.filter((rule) =>
      rule.declarations.some((d) => d.prop === "opacity"),
    );
    expect(dimmed.length).toBe(1);
    expect(dimmed[0].selector).toContain('[aria-busy="true"]');
    expect(declarationsOf(dimmed[0], "opacity")).toEqual(["var(--conteudo-velho-opacity)"]);
  });

  // `[role="button"]` and `.motion-state` match :focus-visible's specificity,
  // so source order is what decides whether focus actually cuts.
  test("the focus cut is authored after the pointer transition", () => {
    const ramp = rules.findIndex((rule) =>
      declarationsOf(rule, "transition").includes("var(--transition-color)"),
    );
    const cut = rules.findIndex((rule) => selectorList(rule.selector).includes(":focus-visible"));
    expect(ramp).toBeGreaterThanOrEqual(0);
    expect(cut).toBeGreaterThan(ramp);
  });

  test("focus and :active are cuts", () => {
    const cuts = rules.filter((rule) =>
      rule.declarations.some(
        (d) => d.prop === "transition-duration" && (d.value === "0s" || d.value === "0ms"),
      ),
    );
    const cutSelectors = cuts.flatMap((rule) => selectorList(rule.selector)).join(" ");
    expect(cutSelectors).toContain(":active");
    expect(cutSelectors).toContain(":focus-visible");
  });
});

// marca.md §9.6
describe("prefers-reduced-motion", () => {
  const reduced = rules.filter((rule) =>
    rule.context.some((at) => at.includes("prefers-reduced-motion")),
  );

  test("is one global rule", () => {
    expect(reduced.length).toBe(1);
    expect(selectorList(reduced[0].selector)).toEqual([":root"]);
  });

  test("drops the interpolation and keeps every end state", () => {
    expect(reduced[0].declarations).toEqual([{ prop: "--motion-duration", value: "0s" }]);
  });
});

// marca.md §5
describe("space and density", () => {
  test("the container measure and gutter are tokens", () => {
    expect(token("--measure-max")).toBe("1360px");
    expect(token("--gutter").replace(/\s+/g, " ")).toBe("clamp(1.5rem, 4vw, 4.5rem)");
  });

  test("running text keeps its measure and a side column never exceeds 34ch", () => {
    const reading = Number(token("--measure-reading").replace("ch", ""));
    expect(reading).toBeGreaterThanOrEqual(60);
    expect(reading).toBeLessThanOrEqual(70);
    expect(token("--measure-aside")).toBe("34ch");
  });

  test("the vertical rhythm is the seven authored steps", () => {
    const rhythm = Object.keys(tokens)
      .filter((name) => /^--rhythm-\d$/.test(name))
      .sort()
      .map((name) => token(name));
    expect(rhythm).toEqual(["0.5rem", "0.75rem", "1rem", "1.5rem", "2.75rem", "4rem", "7rem"]);
  });
});
