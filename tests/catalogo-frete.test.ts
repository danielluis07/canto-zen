import { describe, expect, test } from "bun:test";
// Seam 1 is the catálogo module's public API, so everything here comes through
// the front door — a test that reaches for a file pins a layout the build is
// free to change.
import {
  ADICIONAL_AGENDADA_CENTAVOS,
  CEP_CORRIGIVEL,
  PREFIXO_NAO_ATENDIDO,
  cepTemOitoDigitos,
  cotarFrete,
  eNaoAtendida,
  pesoDeFrete,
  produto,
  regiaoDoPrefixo,
  resolverCep,
  tarifas,
} from "../lib/catalogo";
import type { Embalagem, OpcaoFrete, RegiaoFrete } from "../lib/catalogo";

// A box whose cubed weight dominates: 100 x 60 x 40 / 6000 = 40 kg against 20
// real. The round figures keep the arithmetic assertions readable.
const CAIXA_CUBADA: Embalagem = {
  volumes: 1,
  largura: 100,
  profundidade: 60,
  altura: 40,
  pesoKg: 20,
};

// And one where the real weight wins: 50 x 40 x 30 / 6000 = 10 kg against 90.
const CAIXA_PESADA: Embalagem = {
  volumes: 1,
  largura: 50,
  profundidade: 40,
  altura: 30,
  pesoKg: 90,
};

const opcoes = (...args: Parameters<typeof cotarFrete>): OpcaoFrete[] => {
  const resultado = cotarFrete(...args);
  if (eNaoAtendida(resultado)) throw new Error(`expected options, got a refusal: ${args[0]}`);
  return resultado;
};

const padrao = (...args: Parameters<typeof cotarFrete>): OpcaoFrete => {
  const encontrada = opcoes(...args).find((o) => o.modalidade === "padrao");
  if (!encontrada) throw new Error("no padrão option");
  return encontrada;
};

const agendada = (...args: Parameters<typeof cotarFrete>): OpcaoFrete => {
  const encontrada = opcoes(...args).find((o) => o.modalidade === "agendada");
  if (!encontrada) throw new Error("no agendada option");
  return encontrada;
};

const centavosDe = (opcao: OpcaoFrete): number => {
  if (opcao.gratis) throw new Error("asked a grátis option for a figure");
  return opcao.centavos;
};

// ---------------------------------------------------------------------------
// dados.md §4.1 — the corrected region table
// ---------------------------------------------------------------------------

describe("the region table is dados.md §4.1's corrected one", () => {
  test("69 is unserved — the carve-out that makes the Fato state reachable", () => {
    expect(PREFIXO_NAO_ATENDIDO).toBe(69);
    expect(regiaoDoPrefixo(69)).toBeUndefined();
  });

  test("77 is Norte and 78–79 are Centro-Oeste — the overlap resolved", () => {
    expect(regiaoDoPrefixo(77)).toBe("norte");
    expect(regiaoDoPrefixo(78)).toBe("centro-oeste");
    expect(regiaoDoPrefixo(79)).toBe("centro-oeste");
  });

  test("76 stays Centro-Oeste and 66–68 stay Norte", () => {
    expect(regiaoDoPrefixo(76)).toBe("centro-oeste");
    expect(regiaoDoPrefixo(66)).toBe("norte");
    expect(regiaoDoPrefixo(68)).toBe("norte");
  });

  test("every row's boundaries land where §4.1 puts them", () => {
    expect(regiaoDoPrefixo(1)).toBe("sudeste-capitais");
    expect(regiaoDoPrefixo(9)).toBe("sudeste-capitais");
    expect(regiaoDoPrefixo(10)).toBe("sudeste-interior");
    expect(regiaoDoPrefixo(19)).toBe("sudeste-interior");
    expect(regiaoDoPrefixo(20)).toBe("sudeste-capitais");
    expect(regiaoDoPrefixo(23)).toBe("sudeste-capitais");
    expect(regiaoDoPrefixo(24)).toBe("sudeste-interior");
    expect(regiaoDoPrefixo(29)).toBe("sudeste-interior");
    expect(regiaoDoPrefixo(30)).toBe("sudeste-capitais");
    expect(regiaoDoPrefixo(31)).toBe("sudeste-capitais");
    expect(regiaoDoPrefixo(32)).toBe("sudeste-interior");
    expect(regiaoDoPrefixo(39)).toBe("sudeste-interior");
    expect(regiaoDoPrefixo(40)).toBe("nordeste");
    expect(regiaoDoPrefixo(65)).toBe("nordeste");
    expect(regiaoDoPrefixo(70)).toBe("centro-oeste");
    expect(regiaoDoPrefixo(80)).toBe("sul");
    expect(regiaoDoPrefixo(99)).toBe("sul");
  });

  test("the six regions plus the 69 carve-out partition 01–99", () => {
    const prefixos = Array.from({ length: 99 }, (_, i) => i + 1);

    const reivindicacoes = prefixos.map(
      (prefixo) =>
        tarifas.filter((t) => t.prefixos.some(([de, ate]) => prefixo >= de && prefixo <= ate)).length,
    );

    // No overlap: carrinho.md §8's table gave 76, 77 and 78 two regions each,
    // so `custo` returned two answers. Nothing may claim a prefix twice.
    expect(prefixos.filter((_, i) => reivindicacoes[i] > 1)).toEqual([]);

    // And no silent hole: every prefix is either served exactly once or is the
    // stated carve-out. Which is the point of the correction — *região não
    // atendida* has to be reachable, because erros.md §5.2 builds its whole
    // Fato copy class on it.
    const naoAtendidos = prefixos.filter((_, i) => reivindicacoes[i] === 0);
    expect(naoAtendidos).toEqual([PREFIXO_NAO_ATENDIDO]);
    expect(naoAtendidos.length).toBeGreaterThanOrEqual(1);
  });

  test("six regions, no more", () => {
    expect(tarifas).toHaveLength(6);
    expect(new Set(tarifas.map((t) => t.regiao)).size).toBe(6);
  });
});

// ---------------------------------------------------------------------------
// dados.md §4.2 — CEP resolution has three outcomes, distinct in the type
// ---------------------------------------------------------------------------

describe("CEP resolution", () => {
  test("a fixture CEP resolves a region and autofills", () => {
    expect(resolverCep("01310-100")).toEqual({
      situacao: "fixture",
      cep: "01310100",
      regiao: "sudeste-capitais",
      endereco: {
        logradouro: "Avenida Paulista",
        bairro: "Bela Vista",
        cidade: "São Paulo",
        uf: "SP",
      },
    });
  });

  test("all seven fixture CEPs land on the region §4.2 gives them", () => {
    const esperado: [string, RegiaoFrete][] = [
      ["01310-100", "sudeste-capitais"],
      ["13010-000", "sudeste-interior"],
      ["90010-000", "sul"],
      ["70040-010", "centro-oeste"],
      ["40010-000", "nordeste"],
      ["66010-000", "norte"],
    ];

    for (const [cep, regiao] of esperado) {
      const resolvido = resolverCep(cep);
      expect(resolvido.situacao).toBe("fixture");
      if (eNaoAtendida(resolvido)) throw new Error(`${cep} refused`);
      expect(resolvido.regiao).toBe(regiao);
    }

    // The seventh, Rio Branco, is the one §4.2 marks *não atendida*.
    expect(resolverCep("69900-000").situacao).toBe("nao-atendida");
  });

  test("the six served fixtures each carry a bairro, a cidade and a UF", () => {
    const servidos = ["01310-100", "13010-000", "90010-000", "70040-010", "40010-000", "66010-000"];
    for (const cep of servidos) {
      const resolvido = resolverCep(cep);
      if (resolvido.situacao !== "fixture") throw new Error(`${cep} is not a fixture`);
      expect(resolvido.endereco.bairro.length).toBeGreaterThan(0);
      expect(resolvido.endereco.cidade.length).toBeGreaterThan(0);
      expect(resolvido.endereco.uf).toHaveLength(2);
    }
  });

  test("a served non-fixture CEP resolves its region and autofills nothing", () => {
    // Vila Mariana, São Paulo — a real CEP §4.2 does not list.
    expect(resolverCep("04101-300")).toEqual({
      situacao: "servido",
      cep: "04101300",
      regiao: "sudeste-capitais",
    });

    // The street is not computable from the prefix, so the fields open empty.
    expect(resolverCep("04101-300")).not.toHaveProperty("endereco");
  });

  test("a served non-fixture CEP in another region resolves there too", () => {
    const resolvido = resolverCep("13560-000"); // São Carlos, SP
    expect(resolvido.situacao).toBe("servido");
    if (eNaoAtendida(resolvido)) throw new Error("refused");
    expect(resolvido.regiao).toBe("sudeste-interior");
  });

  test("an unserved prefix states the limit and offers the way on", () => {
    expect(resolverCep("69000-000")).toEqual({
      situacao: "nao-atendida",
      classe: "fato",
      cep: "69000000",
      mensagem: "Ainda não entregamos neste CEP.",
      saibaMais: "/politicas/entrega-e-frete",
    });
  });

  test("the three outcomes are distinct in the type, not three shapes of one", () => {
    expect(resolverCep("01310-100").situacao).toBe("fixture");
    expect(resolverCep("04101-300").situacao).toBe("servido");
    expect(resolverCep("69900-000").situacao).toBe("nao-atendida");
  });

  test("the mask is accepted, and so is the bare figure", () => {
    expect(resolverCep("01310100")).toEqual(resolverCep("01310-100"));
  });
});

// ---------------------------------------------------------------------------
// erros.md §5.2 — malformed input is a Corrigível upstream, not a Fato here
// ---------------------------------------------------------------------------

describe("malformed input never reaches the rule", () => {
  test("digit count is the field's own validation", () => {
    expect(cepTemOitoDigitos("01310-100")).toBe(true);
    expect(cepTemOitoDigitos("01310100")).toBe(true);
    expect(cepTemOitoDigitos("0131010")).toBe(false);
    expect(cepTemOitoDigitos("")).toBe(false);
  });

  test("its message states the fix, never the fault", () => {
    expect(CEP_CORRIGIVEL.classe).toBe("corrigivel");
    expect(CEP_CORRIGIVEL.mensagem).toBe("CEP tem 8 dígitos.");
    expect(CEP_CORRIGIVEL.mensagem).not.toContain("inválido");
  });

  test("the rule throws rather than guess, because the caller broke the contract", () => {
    expect(() => resolverCep("0131010")).toThrow();
    expect(() => cotarFrete("123", CAIXA_CUBADA)).toThrow();
  });

  test("all three CEP outcomes are Fato, so none of them is called inválido", () => {
    const recusa = resolverCep("69900-000");
    if (!eNaoAtendida(recusa)) throw new Error("expected a refusal");
    expect(recusa.classe).toBe("fato");
    expect(recusa.mensagem).not.toContain("inválido");
  });
});

// ---------------------------------------------------------------------------
// carrinho.md §8 — cubed weight
// ---------------------------------------------------------------------------

describe("cubed weight", () => {
  test("is the greater of real and cubed", () => {
    expect(pesoDeFrete(CAIXA_CUBADA)).toBe(40);
    expect(pesoDeFrete(CAIXA_PESADA)).toBe(90);
  });

  test("reads the embalagem as the whole shipment, not one volume", () => {
    // carrinho.md §8's formula multiplies by `volumes`; embalagemDe does not
    // divide the box across them, so applying it would triple-count. The
    // conflict and which side wins are argued at `pesoDeFrete`.
    expect(pesoDeFrete({ ...CAIXA_CUBADA, volumes: 3 })).toBe(40);
  });
});

// ---------------------------------------------------------------------------
// carrinho.md §8 — custo = base + perKg x pesoFrete, rounded to the nearest R$
// ---------------------------------------------------------------------------

describe("the quote", () => {
  test("is base plus per-kg against the cubed weight", () => {
    // Sudeste capitais: R$ 90 + R$ 5,50 x 40 = R$ 310,00
    expect(centavosDe(padrao("01310-100", CAIXA_CUBADA))).toBe(31000);
    // Norte: R$ 240 + R$ 12,00 x 40 = R$ 720,00
    expect(centavosDe(padrao("66010-000", CAIXA_CUBADA))).toBe(72000);
  });

  test("rounds to the nearest R$ 1,00", () => {
    // 101 x 60 x 40 / 6000 = 40,4 kg. Nordeste: 190 + 9,50 x 40,4 = R$ 573,80,
    // which has to land on R$ 574,00 and not carry centavos into the surface.
    const opcao = padrao("40010-000", { ...CAIXA_CUBADA, largura: 101 });
    expect(centavosDe(opcao)).toBe(57400);
  });

  test("offers exactly two modalidades, padrão first", () => {
    expect(opcoes("01310-100", CAIXA_CUBADA).map((o) => o.modalidade)).toEqual([
      "padrao",
      "agendada",
    ]);
  });

  test("agendada is padrão plus R$ 100,00, at the same prazo", () => {
    expect(ADICIONAL_AGENDADA_CENTAVOS).toBe(10000);
    const p = padrao("01310-100", CAIXA_CUBADA);
    const a = agendada("01310-100", CAIXA_CUBADA);
    expect(centavosDe(a)).toBe(centavosDe(p) + 10000);
    expect(a.prazoDiasUteis).toBe(p.prazoDiasUteis);
  });

  test("carries each region's padrão prazo in dias úteis", () => {
    const prazo = (cep: string) => padrao(cep, CAIXA_CUBADA).prazoDiasUteis;
    expect(prazo("01310-100")).toBe(6);
    expect(prazo("13010-000")).toBe(9);
    expect(prazo("90010-000")).toBe(11);
    expect(prazo("70040-010")).toBe(13);
    expect(prazo("40010-000")).toBe(15);
    expect(prazo("66010-000")).toBe(20);
  });

  test("refuses an unserved prefix instead of falling back", () => {
    const resultado = cotarFrete("69900-000", CAIXA_CUBADA);
    if (!eNaoAtendida(resultado)) throw new Error("expected a refusal");
    expect(resultado.mensagem).toBe("Ainda não entregamos neste CEP.");
    expect(resultado.saibaMais).toBe("/politicas/entrega-e-frete");
  });

  test("quotes a served non-fixture CEP exactly as it quotes the fixture", () => {
    expect(opcoes("04101-300", CAIXA_CUBADA)).toEqual(opcoes("01310-100", CAIXA_CUBADA));
  });
});

// ---------------------------------------------------------------------------
// carrinho.md §8 — the widget's whole argument
// ---------------------------------------------------------------------------

describe("São Paulo and Belém give visibly different answers", () => {
  const heron = produto("sofa-heron-linho-cru");

  test("Belém costs multiples of São Paulo for the same box", () => {
    const sp = centavosDe(padrao("01310-100", CAIXA_CUBADA));
    const belem = centavosDe(padrao("66010-000", CAIXA_CUBADA));
    expect(belem).toBeGreaterThan(sp * 2);
  });

  test("the hero's box cubes far above its real weight", () => {
    if (!heron) throw new Error("sofa-heron-linho-cru is missing");
    // dados.md §4.3 records the large figures as intentional, not to be softened.
    expect(pesoDeFrete(heron.embalagem)).toBeGreaterThan(heron.embalagem.pesoKg);
    expect(pesoDeFrete(heron.embalagem)).toBeGreaterThan(300);
  });

  test("the hero quotes into the thousands, and the figure is not softened", () => {
    if (!heron) throw new Error("sofa-heron-linho-cru is missing");
    // Its freteGratis is `sudeste`, so Belém is the region that pays.
    const belem = centavosDe(padrao("66010-000", heron.embalagem, heron.freteGratis));
    expect(belem).toBeGreaterThan(400000);
  });
});

// ---------------------------------------------------------------------------
// produto.md / carrinho.md §8 — Grátis, the word, never R$ 0,00
// ---------------------------------------------------------------------------

describe("freteGratis", () => {
  const servidos = ["01310-100", "13010-000", "90010-000", "70040-010", "40010-000", "66010-000"];

  test("yields Grátis on the padrão option, with no figure at all", () => {
    const opcao = padrao("01310-100", CAIXA_CUBADA, "nacional");
    expect(opcao.gratis).toBe(true);
    expect(opcao).not.toHaveProperty("centavos");
  });

  test("never produces a zero figure a surface could render as R$ 0,00", () => {
    for (const escopo of ["nacional", "sudeste", "sp-capital"] as const) {
      for (const cep of servidos) {
        for (const opcao of opcoes(cep, CAIXA_CUBADA, escopo)) {
          if (!opcao.gratis) expect(opcao.centavos).toBeGreaterThan(0);
        }
      }
    }
  });

  test("agendada still charges its R$ 100 difference above the now-zero base", () => {
    const a = agendada("01310-100", CAIXA_CUBADA, "nacional");
    expect(a.gratis).toBe(false);
    expect(centavosDe(a)).toBe(10000);
  });

  test("`nacional` covers every served region", () => {
    for (const cep of servidos) {
      expect(padrao(cep, CAIXA_CUBADA, "nacional").gratis).toBe(true);
    }
  });

  test("`sudeste` covers both Sudeste rows and nothing else", () => {
    expect(padrao("01310-100", CAIXA_CUBADA, "sudeste").gratis).toBe(true);
    expect(padrao("13010-000", CAIXA_CUBADA, "sudeste").gratis).toBe(true);
    expect(padrao("90010-000", CAIXA_CUBADA, "sudeste").gratis).toBe(false);
    expect(padrao("66010-000", CAIXA_CUBADA, "sudeste").gratis).toBe(false);
  });

  test("`sp-capital` covers the capital's prefixes, not the whole region", () => {
    expect(padrao("01310-100", CAIXA_CUBADA, "sp-capital").gratis).toBe(true);
    expect(padrao("04101-300", CAIXA_CUBADA, "sp-capital").gratis).toBe(true);
    // Rio is Sudeste capitais too, and pays.
    expect(padrao("20010-000", CAIXA_CUBADA, "sp-capital").gratis).toBe(false);
    expect(padrao("13010-000", CAIXA_CUBADA, "sp-capital").gratis).toBe(false);
  });

  test("an uncovered region still quotes the full figure", () => {
    expect(centavosDe(padrao("66010-000", CAIXA_CUBADA, "sudeste"))).toBe(72000);
  });

  test("does not make an unserved CEP servable", () => {
    expect(eNaoAtendida(cotarFrete("69900-000", CAIXA_CUBADA, "nacional"))).toBe(true);
  });
});
