import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "../app/(loja)/page";
import { conteudoHome } from "../lib/catalogo";
import { CAMPOS_DE_SERVICO, marcenariaDaHome } from "../lib/home/conteudo";

// The home renders on the server, so its markup is observable without a
// browser — the same seam `tests/chrome-marcacao.test.tsx` uses for the chrome.
// What is asserted here is what `home.md` §§9–11 budget and what §0 orders;
// the served document's title and status are seam 2's, in
// `tests/rotas-status.test.ts`.

const html = renderToStaticMarkup(<Home />);
const semTags = html.replace(/<[^>]+>/g, " ");

/** How many times a substring occurs — the budgets are counts, not presences. */
const vezes = (agulha: string) => html.split(agulha).length - 1;

describe("the seven sections, in `home.md` §0's order", () => {
  test("hero, ambientes, destaques, coleção, serviço, inspirações, marcenaria", () => {
    const ordem = [
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
    // §7: no closing CTA, no repeat of the ambientes, no "ver todas as peças".
    // Repeating the ambientes at the end is the standard fix for a page that
    // failed to route earlier; if §2 works, it is an admission of failure.
    expect(html.lastIndexOf("SOBRE O ATELIÊ")).toBeGreaterThan(html.indexOf("INSPIRAÇÕES"));
    expect(semTags).not.toContain("VER TODAS AS PEÇAS");
    expect(html.indexOf('href="/sala"')).toBeLessThan(html.indexOf("SOBRE O ATELIÊ"));
    expect(html.lastIndexOf('href="/sala"')).toBeLessThan(html.indexOf("PEÇAS EM DESTAQUE"));
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
    expect(vezes("t-display-xl")).toBe(1); // §1, the hero's piece
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
