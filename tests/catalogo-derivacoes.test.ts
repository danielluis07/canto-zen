import { describe, expect, test } from "bun:test";
// Seam 1 is the catálogo module's public API, so everything here comes through
// the front door — a test that reaches for a file pins a layout the build is
// free to change.
import {
  ambiente,
  colecao,
  cor,
  corDoAcabamento,
  designerDoTipo,
  embalagemDe,
  garantiaMeses,
  itensInclusosDe,
  linhaDeParcelamento,
  loja,
  material,
  materiaisDoAcabamento,
  montagemDoTipo,
  politicas,
  precoAVista,
  precoMontagem,
  rotulosMedidasExtras,
  tabelaDeParcelas,
  tipo,
  tipos,
} from "../lib/catalogo";

// produto.md — Derivations
describe("à vista", () => {
  test("is precoTabela less the Pix discount", () => {
    // produto.md's own worked figure: R$ 3.890,00 -> à vista R$ 3.501,00
    expect(precoAVista(389000)).toBe(350100);
  });
});

// produto.md — largest N <= parcelasMax such that precoTabela / N >= parcelaMinima
describe("parcelamento", () => {
  test("takes the largest N whose parcela clears the minimum", () => {
    // R$ 760,00 — the catalogue's entry price. 15000 x 5 = 75000 <= 76000.
    expect(linhaDeParcelamento(76000)).toEqual({ parcelas: 5, valorCentavos: 15200 });
  });

  test("either side of parcelaMinimaCentavos x N the count steps", () => {
    expect(linhaDeParcelamento(75000).parcelas).toBe(5);
    expect(linhaDeParcelamento(74999).parcelas).toBe(4);
  });

  test("never exceeds parcelasMax, however large the price", () => {
    expect(linhaDeParcelamento(1420000).parcelas).toBe(10);
  });

  test("offers one parcela when even 1x is under the minimum", () => {
    expect(linhaDeParcelamento(9900).parcelas).toBe(1);
  });

  test("the table runs 1..N", () => {
    const tabela = tabelaDeParcelas(76000);
    expect(tabela.map((p) => p.parcelas)).toEqual([1, 2, 3, 4, 5]);
    expect(tabela[0]).toEqual({ parcelas: 1, valorCentavos: 76000 });
  });
});

// produto.md — montagemCentavos[montagem.nivel]
describe("montagem", () => {
  test("is priced by the work the nível takes", () => {
    expect(precoMontagem("simples")).toBe(9900);
    expect(precoMontagem("media")).toBe(19900);
    expect(precoMontagem("complexa")).toBe(34900);
  });
});

// produto.md — garantiaMeses ?? garantiaPadraoMeses
describe("garantia", () => {
  test("falls back to the store default when the produto sets none", () => {
    // dados.md §8.9 — omitted on all 65, which is what proves the fallback.
    expect(garantiaMeses({})).toBe(24);
  });

  test("honours a produto that states its own", () => {
    expect(garantiaMeses({ garantiaMeses: 60 })).toBe(60);
  });
});

// dados.md §8.1 — both read off `acabamento`, which is authored as
// `{Material} {Cor}`, `{Material} e {Material}` or a bare material.
describe("cor", () => {
  test("is the colour word in the acabamento, slugged", () => {
    expect(corDoAcabamento("Linho Cru")).toBe("cru");
    expect(corDoAcabamento("Mármore Off-white")).toBe("off-white");
    expect(corDoAcabamento("Aço Carvão")).toBe("carvao");
    expect(corDoAcabamento("Couro Nogueira")).toBe("nogueira");
  });

  test("falls to the wood's own colour where the acabamento names none", () => {
    expect(corDoAcabamento("Carvalho")).toBe("areia");
    expect(corDoAcabamento("Freijó")).toBe("areia");
    expect(corDoAcabamento("Jatobá")).toBe("terracota");
    expect(corDoAcabamento("Latão")).toBe("ocre");
    expect(corDoAcabamento("Palhinha")).toBe("cru");
    expect(corDoAcabamento("Nogueira")).toBe("nogueira");
  });

  test("reads a second material as a material, not a colour", () => {
    // `carvalho` is a wood and no Cor slug, so the pair is two materials.
    expect(corDoAcabamento("Bouclé Carvalho")).toBe("areia");
    expect(corDoAcabamento("Palhinha e Freijó")).toBe("cru");
  });
});

describe("materiais", () => {
  test("adds the structural wood where the acabamento names only a surface", () => {
    expect(materiaisDoAcabamento("Linho Cru")).toEqual(["linho", "carvalho"]);
    expect(materiaisDoAcabamento("Couro Argila")).toEqual(["couro-natural", "carvalho"]);
    // dados.md §8.1's own worked example.
    expect(materiaisDoAcabamento("Mármore Cru")).toEqual(["marmore", "carvalho"]);
    expect(materiaisDoAcabamento("Palhinha")).toEqual(["palhinha", "carvalho"]);
  });

  test("adds nothing where the acabamento already names a wood", () => {
    expect(materiaisDoAcabamento("Bouclé Carvalho")).toEqual(["boucle", "carvalho"]);
    expect(materiaisDoAcabamento("Palhinha e Freijó")).toEqual(["palhinha", "freijo"]);
    expect(materiaisDoAcabamento("Carvalho")).toEqual(["carvalho"]);
  });

  test("refuses a word that names neither a Cor nor a Material", () => {
    expect(() => materiaisDoAcabamento("Alabastro Cru")).toThrow();
  });
});

// dados.md §8.5 — montagem is a fact of the tipo, and `nivel` is also the price
describe("montagem por tipo", () => {
  test("matches produto.md's worked poltrona exactly", () => {
    expect(montagemDoTipo("poltronas")).toEqual({
      necessaria: true,
      nivel: "simples",
      pessoas: 1,
      pecas: 5,
      tempoMinutos: 20,
    });
  });

  test("the luminárias are the store's only no-assembly pieces", () => {
    expect(montagemDoTipo("luminarias-de-mesa")).toEqual({
      necessaria: false,
      nivel: "simples",
      pessoas: 1,
      pecas: 1,
      tempoMinutos: 0,
    });
  });

  test("grades the nível by the work the tipo takes", () => {
    expect(montagemDoTipo("cadeiras").nivel).toBe("simples");
    expect(montagemDoTipo("sofas").nivel).toBe("media");
    expect(montagemDoTipo("mesas-de-jantar").nivel).toBe("media");
    expect(montagemDoTipo("camas").nivel).toBe("complexa");
    expect(montagemDoTipo("guarda-roupas").nivel).toBe("complexa");
  });

  test("covers every tipo in the taxonomy", () => {
    for (const tipo of tipos) expect(montagemDoTipo(tipo.slug).pessoas).toBeGreaterThan(0);
  });
});

// dados.md §8.3 — the rows are ruled by tipo, and three tipos carry none, so the
// PDP's Medidas section has an empty case to render.
describe("medidasExtras", () => {
  test("names the rows the tipo carries", () => {
    expect(rotulosMedidasExtras("sofas")).toEqual([
      "Altura do assento",
      "Quantidade de lugares",
      "Quantidade de almofadas",
    ]);
    expect(rotulosMedidasExtras("comodas")).toEqual(["Quantidade de gavetas"]);
  });

  test("is empty for the three tipos that carry no extras on purpose", () => {
    expect(rotulosMedidasExtras("aparadores")).toEqual([]);
    expect(rotulosMedidasExtras("carrinhos-e-apoios")).toEqual([]);
    expect(rotulosMedidasExtras("cabeceiras")).toEqual([]);
  });
});

// dados.md §8.4 — derived, so the freight quote reads a box that cannot
// disagree with the piece
describe("embalagem", () => {
  test("adds the packing margin to each axis", () => {
    const caixa = embalagemDe({
      medidas: { largura: 78, profundidade: 82, altura: 74 },
      tipo: "poltronas",
      materiais: ["linho", "carvalho"],
    });
    expect(caixa.largura).toBe(86);
    expect(caixa.profundidade).toBe(90);
    expect(caixa.altura).toBe(80);
  });

  test("weighs the box at the density of what the piece is made of", () => {
    // 0,86 x 0,90 x 0,80 m at 55 kg/m3 (estofados)
    expect(
      embalagemDe({
        medidas: { largura: 78, profundidade: 82, altura: 74 },
        tipo: "poltronas",
        materiais: ["linho", "carvalho"],
      }).pesoKg,
    ).toBe(34);
    // 0,60 x 0,64 x 0,94 m at 70 kg/m3 (palhinha)
    expect(
      embalagemDe({
        medidas: { largura: 52, profundidade: 56, altura: 88 },
        tipo: "cadeiras",
        materiais: ["palhinha", "freijo"],
      }).pesoKg,
    ).toBe(25);
  });

  test("ships in one volume unless the tipo says otherwise", () => {
    const umaPoltrona = { medidas: { largura: 78, profundidade: 82, altura: 74 }, tipo: "poltronas", materiais: ["linho", "carvalho"] };
    expect(embalagemDe(umaPoltrona).volumes).toBe(1);
    expect(
      embalagemDe({ medidas: { largura: 160, profundidade: 90, altura: 76 }, tipo: "mesas-de-jantar", materiais: ["carvalho"] }).volumes,
    ).toBe(2);
    expect(
      embalagemDe({ medidas: { largura: 180, profundidade: 60, altura: 220 }, tipo: "guarda-roupas", materiais: ["carvalho"] }).volumes,
    ).toBe(3);
  });

  test("splits a sofá into two volumes only from 220 cm wide", () => {
    const sofa = (largura: number) =>
      embalagemDe({ medidas: { largura, profundidade: 96, altura: 76 }, tipo: "sofas", materiais: ["linho", "carvalho"] }).volumes;
    expect(sofa(219)).toBe(1);
    expect(sofa(220)).toBe(2);
  });
});

// dados.md §2.5 — an atelier has a roster, not one designer per piece, and the
// mapping is by tipo, so it is derived rather than authored
describe("designer", () => {
  test("comes from the tipo", () => {
    expect(designerDoTipo("sofas")).toBe("Marina Aoki");
    expect(designerDoTipo("poltronas")).toBe("Marina Aoki");
    expect(designerDoTipo("cadeiras")).toBe("Yuki Nakamura");
    expect(designerDoTipo("luminarias-de-mesa")).toBe("Beatriz Amaral");
  });

  test("is total over the taxonomy — every tipo appears exactly once", () => {
    for (const tipo of tipos) expect(designerDoTipo(tipo.slug)).not.toBe("");
  });
});

// dados.md §8.7 — the piece, its manual where montagem is needed, its tooling
describe("itensInclusos", () => {
  test("matches produto.md's worked poltrona exactly", () => {
    expect(itensInclusosDe({ tipo: "poltronas", medidasExtras: [] })).toEqual([
      "1 poltrona",
      "manual de montagem",
      "chave allen",
    ]);
  });

  test("counts an upholstered piece's loose cushions as a row", () => {
    expect(
      itensInclusosDe({
        tipo: "sofas",
        medidasExtras: [{ rotulo: "Quantidade de almofadas", valor: 5, unidade: "un" }],
      }),
    ).toEqual([
      "1 sofá",
      "5 almofadas soltas",
      "manual de montagem",
      "chave allen e gabarito de furação",
    ]);
  });

  test("lists no manual and no tooling for a piece that needs no assembly", () => {
    // The one negative row in the set, and it belongs here because a shopper
    // checks the list.
    expect(itensInclusosDe({ tipo: "luminarias-de-mesa", medidasExtras: [] })).toEqual([
      "1 luminária de mesa",
      "lâmpada não inclusa",
    ]);
  });

  test("upgrades the tooling with the nível", () => {
    expect(itensInclusosDe({ tipo: "camas", medidasExtras: [] })).toContain(
      "chave allen e gabarito de furação",
    );
  });
});

// produto.md — Commercial policies. Stated once, so a surface cannot restate it.
describe("politicas", () => {
  test("carries the store's figures", () => {
    expect(politicas).toEqual({
      descontoPixPercent: 10,
      parcelasMax: 10,
      parcelaMinimaCentavos: 15000,
      garantiaPadraoMeses: 24,
      montagemCentavos: { simples: 9900, media: 19900, complexa: 34900 },
    });
  });
});

// rodape.md §3 and institucional.md §12 — the footer and /contato read one
// object, which is the whole reason it is one object.
describe("loja", () => {
  test("carries the identification facts the decree requires", () => {
    expect(loja.razaoSocial).toBe("Canto Zen Marcenaria e Comércio de Móveis Ltda.");
    expect(loja.cnpj).toBe("51.204.876/0001-40");
    expect(loja.inscricaoEstadual).toBe("116.482.930.114");
    expect(loja.endereco).toEqual({
      logradouro: "Rua Harmonia",
      numero: "742",
      bairro: "Vila Madalena",
      cidade: "São Paulo",
      uf: "SP",
      cep: "05435-000",
    });
    expect(loja.atendimento.email).toBe("oi@cantozen.com.br");
    expect(loja.fundacao).toBe(2014);
  });

  test("keeps showroom hours apart from atendimento hours", () => {
    expect(loja.atendimento.horario).toBe("Seg a sex, 9h às 18h");
    expect(loja.showroom.horario).toEqual(["Seg a sex, 10h às 19h", "Sáb, 10h às 14h"]);
  });

  test("leaves no field blank — an empty legal block is the failure to prevent", () => {
    const vazio = (valor: unknown): boolean =>
      typeof valor === "string"
        ? valor.trim().length === 0
        : typeof valor === "object" && valor !== null
          ? Object.values(valor).some(vazio)
          : false;
    expect(vazio(loja)).toBe(false);
  });
});

// The taxonomy is entities keyed by slug — rotas.md's curated pairs are the
// source of truth for which routes exist, not whatever produtos happen to be in.
describe("taxonomia", () => {
  test("resolves each facet by its slug", () => {
    expect(ambiente("escritorio")?.label).toBe("Escritório");
    expect(tipo("cadeiras-de-trabalho")?.labelSingular).toBe("Cadeira de trabalho");
    expect(cor("verde-musgo")?.amostra).toBe("#6B7359");
    expect(material("boucle")?.cuidados).toContain("Escove no sentido da trama");
    expect(colecao("reboco")?.produtos).toHaveLength(6);
  });

  test("returns nothing for a slug the taxonomy does not carry", () => {
    expect(ambiente("varanda")).toBeUndefined();
    expect(tipo("tapetes")).toBeUndefined();
  });

  test("curates room x tipo pairs rather than inferring them", () => {
    // rotas.md: /cozinha/sofas is a 404, not an empty grid.
    expect(ambiente("cozinha")?.tipos).not.toContain("sofas");
    expect(ambiente("sala")?.tipos).toEqual([
      "sofas",
      "poltronas",
      "mesas-de-centro",
      "mesas-de-jantar",
      "racks-e-estantes",
      "aparadores",
    ]);
  });
});
