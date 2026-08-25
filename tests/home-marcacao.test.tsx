import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../app/(loja)/page";
import { conteudoHome } from "../lib/catalogo";
import { CAMPOS_DE_SERVICO, LINHA_ABERTURA, marcenariaDaHome } from "../lib/home/conteudo";

// The home renders on the server, so its markup is observable without a
// browser — the same seam `tests/chrome-marcacao.test.tsx` uses for the chrome.
// What is asserted here is what `home.md` §§9–11 budget and what §0 orders;
// the served document's title and status are seam 2's, in
// `tests/rotas-status.test.ts`.

const html = renderToStaticMarkup(<Home />);
const semTags = html.replace(/<[^>]+>/g, " ");

/** How many times a substring occurs — the budgets are counts, not presences. */
const vezes = (agulha: string) => html.split(agulha).length - 1;

const semTagsDe = (trecho: string) => trecho.replace(/<[^>]+>/g, " ");

/**
 * §0.5's markup alone — from the first `<section>` to the second. Slicing on a
 * copy string would be approximate in both directions: §1's régua caption sits
 * above its own eyebrow, and the Abertura's own line is prose that could recur.
 */
const abertura = html.slice(
  html.indexOf("<section"),
  html.indexOf("<section", html.indexOf("<section") + 1),
);

// home.md §0.5
describe("§0.5 — the Abertura", () => {
  test("opens the page, ahead of the piece", () => {
    expect(html.indexOf(LINHA_ABERTURA)).toBeGreaterThan(-1);
    expect(html.indexOf(LINHA_ABERTURA)).toBeLessThan(html.indexOf("PEÇA EM DESTAQUE"));
  });

  test("takes the page's only h1, and the piece became an h2", () => {
    // The heading moved with the position. One `h1` per document, and it is the
    // statement about the store rather than the name of one piece.
    expect(vezes("<h1")).toBe(1);
    expect(html).toContain(`<h1 class="t-display-xl text-ink">${LINHA_ABERTURA}</h1>`);
    expect(html).toContain('<h2 class="t-display-xl mt-rhythm-3 text-ink">');
  });

  test("is contained in the reserved 21:9 slot, never cropped", () => {
    // `imagens.md` §§2, 4. `object-cover` here would be the contain-fit rule
    // being spent to make one photograph fit, which is what §4 exists to stop.
    expect(abertura).toContain("aspect-21/9");
    expect(abertura).toContain("object-contain");
    expect(abertura).not.toContain("object-cover");
  });

  test("carries no eyebrow, no price and no régua", () => {
    // The sixth ausência autorada (CONTEXT.md). Every one of these appears
    // legitimately further down the page, so the assertion is worth only as much
    // as the slice is exact — and the section boundary is the only exact one.
    // §1's régua caption precedes its own eyebrow in the markup, so cutting on
    // `PEÇA EM DESTAQUE` would read `L 220 CM` as if it were the Abertura's.
    expect(semTagsDe(abertura)).not.toContain("R$");
    expect(semTagsDe(abertura)).not.toContain(" CM");
    expect(abertura).not.toContain("h-[13px] items-center");
    expect(abertura).not.toContain("t-annotation");
  });

  test("lays no scrim or gradient over the photograph", () => {
    // `marca.md` §6 permits no shadow and the token set has no scrim; §0.5's
    // contrast argument rests on the image's own flat region instead. A
    // gradient appearing here means that argument quietly failed.
    expect(html).not.toContain("bg-gradient");
    expect(html).not.toMatch(/bg-ink\/|bg-black\/|backdrop-/);
  });
});

describe("the eight sections, in `home.md` §0's order", () => {
  test("abertura, hero, ambientes, destaques, coleção, serviço, inspirações, marcenaria", () => {
    const ordem = [
      LINHA_ABERTURA,
      "PEÇA EM DESTAQUE",
      "AMBIENTES",
      "PEÇAS EM DESTAQUE",
      "COLEÇÃO",
      "FRETE",
      "INSPIRAÇÕES",
      marcenariaDaHome().linha,
    ].map((marca) => html.indexOf(marca));

    expect(ordem).not.toContain(-1);
    expect([...ordem].sort((a, b) => a - b)).toEqual(ordem);
  });

  test("the scroll ends on the marcenaria's assertion", () => {
    // §7: no closing CTA, no repeat of the ambientes. Repeating the ambientes at
    // the end is the standard fix for a page that failed to route earlier; if §2
    // works, it is an admission of failure.
    expect(html.lastIndexOf("SOBRE O ATELIÊ")).toBeGreaterThan(html.indexOf("INSPIRAÇÕES"));
    expect(html.indexOf('href="/sala"')).toBeLessThan(html.indexOf("SOBRE O ATELIÊ"));
    expect(html.lastIndexOf('href="/sala"')).toBeLessThan(html.indexOf("PEÇAS EM DESTAQUE"));
  });

  test("`/produtos` is offered once, at the top, and never again", () => {
    // §7 used to refuse `VER TODAS AS PEÇAS` outright. ADR 0002 withdrew half of
    // that: the string is now §0.5's CTA, above the fold. The half that survives
    // is the half worth testing — the page must not *end* by re-offering
    // navigation, so one occurrence, before §1, and nothing after §6.
    expect(vezes("VER TODAS AS PEÇAS")).toBe(1);
    expect(vezes('href="/produtos"')).toBe(1);
    expect(html.indexOf("VER TODAS AS PEÇAS")).toBeLessThan(html.indexOf("PEÇA EM DESTAQUE"));
    expect(html.lastIndexOf('href="/produtos"')).toBeLessThan(html.indexOf("SOBRE O ATELIÊ"));
  });
});

describe("§2 — the ambientes are the first navigational offer", () => {
  test("four fields, each the whole link to its room", () => {
    for (const rota of ["/sala", "/quarto", "/cozinha", "/escritorio"]) {
      expect(vezes(`href="${rota}"`)).toBe(1);
    }
  });

  test("the three tipos are annotation, not links of their own", () => {
    expect(semTags).toContain("SOFÁS · POLTRONAS · MESAS DE CENTRO");
    expect(html).not.toContain('href="/sala/sofas"');
  });
});

describe("§9 — the régua budget: exactly two on the entire page", () => {
  test("the hero's largura and the coleção's count, and nothing else", () => {
    // The régua's own container — `components/marca/regua.tsx`. Counting the
    // component is the only way to assert a budget stated per page.
    expect(vezes("h-[13px] items-center")).toBe(2);
    expect(vezes('class="relative flex w-[13px] justify-center self-stretch"')).toBe(0);
    expect(semTags).toContain("6 PEÇAS");
  });
});

describe("§10 — the índigo budget", () => {
  test("two badges, and never on the same screen", () => {
    // The hero's Pix badge and the strip's single policy line — resting state
    // only. §5 grants índigo to link hover, which is why the count excludes it.
    expect(html.match(/(?<!hover:)text-indigo/g) ?? []).toHaveLength(2);
    expect(semTags).toContain("10% À VISTA NO PIX");
    expect(semTags).toContain("10% À VISTA NO PIX EM TODAS AS PEÇAS");
  });
});

describe("§11 — the Mincho budget", () => {
  test("piece names, the coleção, the article titles and one feature line", () => {
    expect(vezes("t-display-xl")).toBe(2); // §0.5's line and §1's piece
    expect(vezes("t-display-l")).toBe(2); // §4's coleção, §7's feature line
    expect(vezes("t-display-m")).toBe(6); // §3's three cards, §6's three titles
  });

  test("section eyebrows are annotation, never Mincho", () => {
    // Mincho section titles would spend the family five times and §7's line
    // would stop being a feature. Where a section has a name of its own — §1's
    // piece, §4's coleção — the eyebrow sits above it and the name is the
    // heading; elsewhere the eyebrow *is* the heading.
    for (const eyebrow of ["AMBIENTES", "PEÇAS EM DESTAQUE", "INSPIRAÇÕES"]) {
      expect(html).toContain(`<h2 class="t-annotation text-muted">${eyebrow}</h2>`);
    }
    for (const eyebrow of ["PEÇA EM DESTAQUE", "COLEÇÃO"]) {
      expect(html).toContain(`<p class="t-annotation text-muted">${eyebrow}</p>`);
    }
  });
});

describe("§5 — the service band", () => {
  test("states montagem, frete and prazo before a piece is being decided on", () => {
    for (const campo of CAMPOS_DE_SERVICO) {
      expect(semTags).toContain(campo.rotulo);
      expect(semTags).toContain(campo.linha);
    }
  });

  test("is the only section that fills through to column 12, in --kozo", () => {
    expect(html).toContain("bg-kozo");
    expect(vezes('href="/politicas/entrega-e-frete"')).toBe(2);
    expect(vezes('href="/politicas/trocas-e-devolucoes"')).toBe(1);
  });
});

describe("§4 — the coleção is surfaced in context", () => {
  test("links to the coleção, and never to an index that does not exist", () => {
    expect(html).toContain(`href="/colecoes/${conteudoHome.colecaoDestaque}"`);
    expect(html).not.toContain('href="/colecoes"');
  });

  test("carries no price — the block sells the sequence, not a piece", () => {
    const bloco = html.slice(html.indexOf("COLEÇÃO"), html.indexOf("FRETE"));
    expect(bloco).not.toContain("R$");
  });
});

describe("§6 — the editorial lane has an entrance", () => {
  test("three rows and the way to the fourth article", () => {
    for (const slug of conteudoHome.inspiracoes) {
      expect(vezes(`href="/inspiracoes/${slug}"`)).toBe(1);
    }
    expect(html).toContain('href="/inspiracoes"');
  });
});

describe("what the home refuses", () => {
  test("no hover effect on any photograph", () => {
    // `marca.md` §9 grants two motions and neither of them touches an image;
    // the photograph is the object, and it does not respond to a pointer.
    expect(html).not.toContain("group-hover");
    expect(html).not.toMatch(/hover:(opacity|scale|brightness|grayscale)/);
  });

  test("no skeleton, no fade, no scroll reveal", () => {
    expect(html).not.toContain("animate-");
    expect(html).not.toContain("transition-transform");
    expect(html).not.toContain("blur");
  });
});
