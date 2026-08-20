import { describe, expect, test } from "bun:test";
// The navbar's reasoning, pulled below the DOM and tested at seam 1 — which is
// where `build-spec.md` puts every piece of interaction logic that can leave the
// browser. The panel's opening and closing needs a browser and is not tested;
// what a panel *contains*, and which item a route marks, do not.
import {
  itemAtivo,
  itensDeNavegacao,
  painelDoAmbiente,
  rotuloDaContagem,
} from "../lib/chrome/navegacao";
import { ambiente, ambientes, tipo } from "../lib/catalogo";

// navbar.md §5
describe("the navigation items", () => {
  test("are five — the four ambientes then Inspirações", () => {
    expect(itensDeNavegacao.map((item) => item.slug)).toEqual([
      "sala",
      "quarto",
      "cozinha",
      "escritorio",
      "inspiracoes",
    ]);
  });

  test("carry the labels with their accents and the ASCII-folded paths", () => {
    expect(itensDeNavegacao.map((item) => [item.label, item.href])).toEqual([
      ["Sala", "/sala"],
      ["Quarto", "/quarto"],
      ["Cozinha", "/cozinha"],
      ["Escritório", "/escritorio"],
      ["Inspirações", "/inspiracoes"],
    ]);
  });

  test("open a panel for every ambiente and for nothing else", () => {
    expect(itensDeNavegacao.filter((item) => item.abrePainel).map((i) => i.slug)).toEqual(
      ambientes.map((a) => a.slug),
    );
  });

  test("hold nothing the bar refused — no produtos, sobre, contato or coleções", () => {
    const hrefs = itensDeNavegacao.map((item) => item.href);
    for (const recusado of ["/produtos", "/sobre", "/contato", "/colecoes"]) {
      expect(hrefs).not.toContain(recusado);
    }
  });
});

// navbar.md §6
describe("the ambiente panel", () => {
  test("lists that ambiente's curated tipos, in the authored order", () => {
    for (const a of ambientes) {
      expect(painelDoAmbiente(a.slug).tipos.map((t) => t.slug)).toEqual(a.tipos);
    }
  });

  test("labels each tipo as the taxonomy does and points at the pair route", () => {
    const painel = painelDoAmbiente("sala");
    expect(painel.tipos[0]).toEqual({
      slug: "sofas",
      label: tipo("sofas")!.label,
      href: "/sala/sofas",
    });
  });

  test("closes on Ver tudo em {Ambiente}, pointing at the ambiente landing", () => {
    expect(painelDoAmbiente("escritorio").verTudo).toEqual({
      label: "Ver tudo em Escritório",
      href: "/escritorio",
    });
  });

  test("is labelled by the ambiente that opened it", () => {
    expect(painelDoAmbiente("quarto").rotulo).toBe(ambiente("quarto")!.label);
  });

  test("refuses an ambiente the taxonomy does not carry", () => {
    expect(() => painelDoAmbiente("varanda")).toThrow();
  });
});

// navbar.md §9
describe("the active item", () => {
  const marcados: Array<[string, string | null]> = [
    ["/sala", "sala"],
    ["/sala/sofas", "sala"],
    ["/quarto/camas", "quarto"],
    ["/cozinha", "cozinha"],
    ["/escritorio/luminarias-de-mesa", "escritorio"],
    ["/inspiracoes", "inspiracoes"],
    ["/inspiracoes/uma-sala-para-ficar", "inspiracoes"],
    // The breadcrumb already states the primary ambiente, so the bar says nothing.
    ["/produtos/poltrona-lina-linho-cru", null],
    ["/produtos", null],
    ["/carrinho", null],
    ["/checkout", null],
    ["/pedido-confirmado", null],
    ["/sobre", null],
    ["/contato", null],
    ["/politicas/privacidade", null],
    ["/colecoes/permanencia", null],
    ["/", null],
  ];

  for (const [pathname, marcado] of marcados) {
    test(`${pathname} marks ${marcado ?? "nothing"}`, () => {
      expect(itemAtivo(pathname)).toBe(marcado);
    });
  }

  test("a trailing slash does not unmark a room", () => {
    expect(itemAtivo("/sala/")).toBe("sala");
  });

  test("never marks a room whose slug is only a prefix of the path segment", () => {
    expect(itemAtivo("/salamandra")).toBeNull();
  });
});

// navbar.md §7
describe("the cart count", () => {
  test("vanishes entirely at zero — never (0)", () => {
    expect(rotuloDaContagem(0)).toBeNull();
  });

  test("is parenthesised when there is anything to count", () => {
    expect(rotuloDaContagem(1)).toBe("(1)");
    expect(rotuloDaContagem(12)).toBe("(12)");
  });
});
