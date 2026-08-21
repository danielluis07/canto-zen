import { describe, expect, test } from "bun:test";
import { ambientes, proporcaoDoPrincipal, reais, tipos } from "../lib/catalogo";
import { ambientesEnumerados, paresEnumerados, parEnumerado } from "../lib/listagem/rotas";
import {
  bandaDeTipos,
  cabecalhoDoAmbiente,
  cabecalhoDoTipo,
  disponibilidadeEmTexto,
  emOrdemDeCuradoria,
  linhaDoCartao,
  linhaDePolitica,
  parcelamentoEmTexto,
  precoAnteriorDoCartao,
  precoDoCartao,
  produtosDoAmbiente,
  produtosDoTipo,
  rotuloDaContagem,
} from "../lib/listagem/conteudo";
import { exigirProduto } from "./helpers/catalogo";

// rotas.md §6 — enumerated, not generated
describe("the enumerated route space", () => {
  test("is the four rooms, in the authored order", () => {
    expect(ambientesEnumerados()).toEqual(["sala", "quarto", "cozinha", "escritorio"]);
  });

  test("is every room's curated tipos and nothing else", () => {
    expect(paresEnumerados()).toEqual(
      ambientes.flatMap((a) => a.tipos.map((tipo) => ({ ambiente: a.slug, tipo }))),
    );
  });

  test("declares /sala/sofas and refuses /cozinha/sofas", () => {
    expect(parEnumerado("sala", "sofas")).toBe(true);
    expect(parEnumerado("cozinha", "sofas")).toBe(false);
  });

  // The pair is nowhere even though both halves are real — which is the whole
  // reason the pairs are declared rather than crossed.
  test("refuses an unknown room and an unknown tipo alike", () => {
    expect(parEnumerado("varanda", "sofas")).toBe(false);
    expect(parEnumerado("sala", "redes")).toBe(false);
  });

  test("names only tipos the taxonomy carries", () => {
    const conhecidos = new Set(tipos.map((t) => t.slug));
    for (const par of paresEnumerados()) expect(conhecidos.has(par.tipo)).toBe(true);
  });
});

// catalogo.md §3, §10
describe("the selection", () => {
  test("is curadoria order — produto.ordem ascending", () => {
    const disponiveis = produtosDoAmbiente("sala").filter((p) => p.disponibilidade !== "esgotado");
    const ordens = disponiveis.map((p) => p.ordem);
    expect(ordens).toEqual([...ordens].sort((a, b) => a - b));
  });

  test("puts esgotado last within the active order, and never hides it", () => {
    const esgotados = ambientes
      .flatMap((a) => produtosDoAmbiente(a.slug))
      .filter((p) => p.disponibilidade === "esgotado");
    expect(esgotados.length).toBeGreaterThan(0);

    for (const ambiente of ambientes) {
      const lista = produtosDoAmbiente(ambiente.slug);
      const primeiro = lista.findIndex((p) => p.disponibilidade === "esgotado");
      if (primeiro === -1) continue;
      expect(lista.slice(primeiro).every((p) => p.disponibilidade === "esgotado")).toBe(true);
    }
  });

  test("sorts a hand-made set the same way", () => {
    const ordenado = emOrdemDeCuradoria([
      { ordem: 2, disponibilidade: "sob-encomenda" },
      { ordem: 1, disponibilidade: "esgotado" },
      { ordem: 3, disponibilidade: "envio-imediato" },
    ] as never);
    expect(ordenado.map((p) => p.ordem)).toEqual([2, 3, 1]);
  });

  test("reads the full ambientes set, not ambientePrincipal", () => {
    const multiplos = ambientes
      .flatMap((a) => produtosDoAmbiente(a.slug))
      .find((p) => p.ambientes.length > 1);
    if (!multiplos) throw new Error("no piece lists under more than one ambiente");

    for (const slug of multiplos.ambientes) {
      expect(produtosDoAmbiente(slug).map((p) => p.slug)).toContain(multiplos.slug);
    }
  });

  test("scopes a tipo listing to that room's slice of one tipo", () => {
    const sofas = produtosDoTipo("sala", "sofas");
    expect(sofas.length).toBeGreaterThan(0);
    for (const p of sofas) {
      expect(p.tipo).toBe("sofas");
      expect(p.ambientes).toContain("sala");
    }
  });

  // dados.md §1's three-column floor, restated where the listing consumes it.
  test("gives every enumerated pair at least three pieces", () => {
    for (const par of paresEnumerados()) {
      expect(produtosDoTipo(par.ambiente, par.tipo).length).toBeGreaterThanOrEqual(3);
    }
  });
});

// catalogo.md §4
describe("the opening régua", () => {
  test("states the count, in the singular at one", () => {
    expect(rotuloDaContagem(12)).toBe("12 PEÇAS");
    expect(rotuloDaContagem(1)).toBe("1 PEÇA");
  });

  test("does not render at zero — marca.md §2 prohibits an empty régua", () => {
    expect(rotuloDaContagem(0)).toBeNull();
  });
});

// catalogo.md §6
describe("the card's lines", () => {
  const heron = exigirProduto("sofa-heron-linho-cru");

  test("state acabamento, width and disponibilidade on one line, in that order", () => {
    expect(linhaDoCartao(heron)).toBe("LINHO CRU · L 220 CM · SOB ENCOMENDA · 6 SEMANAS");
  });

  test("read the width from medidas, never from the name", () => {
    expect(linhaDoCartao(heron)).toContain(`L ${heron.medidas.largura} CM`);
    expect(heron.nome).not.toContain(String(heron.medidas.largura));
  });

  test("spell the three disponibilidade states as §6's table does", () => {
    expect(disponibilidadeEmTexto({ disponibilidade: "envio-imediato" } as never)).toBe(
      "ENVIO IMEDIATO",
    );
    expect(disponibilidadeEmTexto({ disponibilidade: "esgotado" } as never)).toBe("ESGOTADO");
    expect(
      disponibilidadeEmTexto({
        disponibilidade: "sob-encomenda",
        prazoProducaoSemanas: 4,
      } as never),
    ).toBe("SOB ENCOMENDA · 4 SEMANAS");
  });

  test("set the à-vista price, derived from precoTabela", () => {
    expect(precoDoCartao(heron)).toBe("R$ 8.820,00");
  });

  test("carry precoDe only where the piece has one", () => {
    expect(precoAnteriorDoCartao(heron)).toBeNull();
  });
});

describe("reais", () => {
  test("groups thousands with a dot and cents with a comma", () => {
    expect(reais(980000)).toBe("R$ 9.800,00");
    expect(reais(1234567)).toBe("R$ 12.345,67");
    expect(reais(9900)).toBe("R$ 99,00");
    expect(reais(5)).toBe("R$ 0,05");
    expect(reais(100000000)).toBe("R$ 1.000.000,00");
  });
});

// catalogo.md §7 — both figures from `politicas`, never hand-written
describe("the policy line", () => {
  test("states the Pix discount and the parcelamento ceiling once", () => {
    expect(linhaDePolitica()).toBe("10% À VISTA NO PIX · ATÉ 10X SEM JUROS");
  });

  test("resolves the ceiling per piece", () => {
    expect(parcelamentoEmTexto(exigirProduto("sofa-heron-linho-cru"))).toBe(
      "10x de R$ 980,00 sem juros",
    );
  });
});

// catalogo.md §1
describe("the header", () => {
  test("opens a room on AMBIENTE, its label in Mincho and its authored sentence", () => {
    expect(cabecalhoDoAmbiente("escritorio")).toEqual({
      sobretitulo: "AMBIENTE",
      titulo: "Escritório",
      mincho: true,
      prosa: "Concentração exige poucas coisas, e todas certas.",
    });
  });

  test("opens a tipo listing on the room's eyebrow and carries no prose of its own", () => {
    expect(cabecalhoDoTipo("escritorio", "cadeiras-de-trabalho")).toEqual({
      sobretitulo: "ESCRITÓRIO",
      titulo: "Cadeiras de trabalho",
      mincho: true,
      prosa: null,
    });
  });
});

// catalogo.md §2
describe("the tipo band", () => {
  test("opens on TODAS and follows with the room's curated order", () => {
    expect(bandaDeTipos("cozinha").map((i) => i.label)).toEqual([
      "TODAS",
      "MESAS",
      "CADEIRAS",
      "BANQUETAS",
      "ARMÁRIOS",
      "CARRINHOS E APOIOS",
    ]);
  });

  test("points every item at a landable path", () => {
    expect(bandaDeTipos("cozinha").map((i) => i.href)).toEqual([
      "/cozinha",
      "/cozinha/mesas",
      "/cozinha/cadeiras",
      "/cozinha/banquetas",
      "/cozinha/armarios",
      "/cozinha/carrinhos-e-apoios",
    ]);
  });

  test("marks TODAS on the room landing and the tipo on its listing", () => {
    expect(
      bandaDeTipos("cozinha")
        .filter((i) => i.ativo)
        .map((i) => i.label),
    ).toEqual(["TODAS"]);
    expect(
      bandaDeTipos("cozinha", "banquetas")
        .filter((i) => i.ativo)
        .map((i) => i.label),
    ).toEqual(["BANQUETAS"]);
  });
});

// imagens.md §3 — the frame follows the piece, by arithmetic
describe("the derived ratio", () => {
  test("takes the three enumerated values from medidas", () => {
    expect(proporcaoDoPrincipal({ largura: 220, profundidade: 95, altura: 82 })).toBe("3:2");
    expect(proporcaoDoPrincipal({ largura: 45, profundidade: 45, altura: 180 })).toBe("4:5");
    expect(proporcaoDoPrincipal({ largura: 90, profundidade: 90, altura: 90 })).toBe("1:1");
  });

  test("cuts at 1.15 and 0.87 exactly", () => {
    expect(proporcaoDoPrincipal({ largura: 115, profundidade: 1, altura: 100 })).toBe("1:1");
    expect(proporcaoDoPrincipal({ largura: 116, profundidade: 1, altura: 100 })).toBe("3:2");
    expect(proporcaoDoPrincipal({ largura: 87, profundidade: 1, altura: 100 })).toBe("1:1");
    expect(proporcaoDoPrincipal({ largura: 86, profundidade: 1, altura: 100 })).toBe("4:5");
  });
});
