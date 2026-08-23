import { describe, expect, test } from "bun:test";
import {
  CAMPOS_DE_SERVICO,
  colecaoEmDestaque,
  camposDeAmbientes,
  descricaoDaHome,
  destaqueDaHome,
  destaqueDaPeca,
  linhaDePixDaHome,
  linhasDeInspiracao,
  marcenariaDaHome,
  pecasEmDestaque,
} from "../lib/home/conteudo";
import { ambientes, conteudoHome, produto, todosOsProdutos } from "../lib/catalogo";

// The home's composition, asserted without a renderer — `home.md` §§1–11 fix
// what each slot resolves to and the budgets it may spend, and all of that is
// decided here rather than in the components.

describe("§1 — the hero", () => {
  const hero = destaqueDaHome()!;

  test("is the authored `destaqueHome` and links to its PDP from image and CTA", () => {
    expect(hero.href).toBe(`/produtos/${conteudoHome.destaqueHome}`);
    expect(hero.nome).toBe(produto(conteudoHome.destaqueHome)!.nome);
  });

  test("names the designer, resolved through the família — `dados.md` §6.1", () => {
    // `Produto` carries no `designer`; the correction routes the read through
    // `Familia`, and the line is the acabamento plus that name.
    expect(hero.assinatura).toContain("LINHO CRU");
    expect(hero.assinatura).toMatch(/ · POR [A-ZÁ-Ú]/);
  });

  test("states the à-vista price, the Pix badge and the parcelamento", () => {
    expect(hero.preco).toMatch(/^R\$ /);
    expect(hero.pix).toBe("10% À VISTA NO PIX");
    expect(hero.parcelamento).toMatch(/^ou R\$ .+ em \d+x de R\$ .+ sem juros$/);
  });

  test("carries the largura cota and never the vertical one — §1, §9", () => {
    const peca = produto(conteudoHome.destaqueHome)!;
    expect(hero.cota).toBe(`L ${peca.medidas.largura} CM`);
  });

  test("does not render at all when the principal declares no largura", () => {
    // §1's hard precondition, and the reason it is a `null` rather than a
    // fallback: an empty régua is prohibited (`marca.md` §2), so a piece that
    // cannot be annotated cannot open the page.
    const peca = produto(conteudoHome.destaqueHome)!;
    expect(destaqueDaPeca({ ...peca, imagens: [{ ...peca.imagens[0]!, cotas: [] }] })).toBeNull();
  });

  test("does not render an esgotado piece", () => {
    const peca = produto(conteudoHome.destaqueHome)!;
    expect(destaqueDaPeca({ ...peca, disponibilidade: "esgotado" })).toBeNull();
  });
});

describe("§2 — the ambientes", () => {
  const campos = camposDeAmbientes();

  test("are the four, in the authored order of `ambientes[]`", () => {
    expect(campos.map((c) => c.slug)).toEqual(ambientes.map((a) => a.slug));
    expect(campos).toHaveLength(4);
  });

  test("each field links to `/[ambiente]` and names three tipos", () => {
    for (const campo of campos) {
      expect(campo.href).toBe(`/${campo.slug}`);
      expect(campo.tipos.split(" · ")).toHaveLength(3);
      expect(campo.tipos).toBe(campo.tipos.toUpperCase());
      expect(campo.imagem.alt.length).toBeGreaterThan(0);
    }
  });

  test("the three tipos are the first three of the room's curated list", () => {
    // The band mirrors the navbar panel, read from the same authored table —
    // never the tipos the catalogue happens to hold.
    const sala = campos.find((c) => c.slug === "sala")!;
    expect(sala.tipos).toBe("SOFÁS · POLTRONAS · MESAS DE CENTRO");
  });
});

describe("§3 — the featured strip", () => {
  const cartoes = pecasEmDestaque();

  test("is three pieces, resolved from `destaques[]` in the authored order", () => {
    expect(cartoes.map((c) => c.slug)).toEqual(conteudoHome.destaques);
  });

  test("each card states acabamento, disponibilidade, price and parcelamento", () => {
    for (const cartao of cartoes) {
      expect(cartao.acabamento).toBe(cartao.acabamento.toUpperCase());
      expect(cartao.disponibilidade).toMatch(/^(ENVIO IMEDIATO|SOB ENCOMENDA|ESGOTADO)/);
      expect(cartao.preco).toMatch(/^R\$ /);
      expect(cartao.href).toBe(`/produtos/${cartao.slug}`);
    }
  });

  test("the Pix policy is one line for the strip, with the figure from `politicas`", () => {
    // §3: three badged cards would be three índigos on one screen, and
    // `marca.md` §3 says two of them would be wrong.
    expect(linhaDePixDaHome()).toBe("10% À VISTA NO PIX EM TODAS AS PEÇAS");
  });
});

describe("§4 — the featured coleção", () => {
  const bloco = colecaoEmDestaque();

  test("is the authored coleção, linking to the only surface it has", () => {
    expect(bloco.href).toBe(`/colecoes/${conteudoHome.colecaoDestaque}`);
    expect(bloco.nome.length).toBeGreaterThan(0);
    expect(bloco.descricao.length).toBeGreaterThan(0);
  });

  test("its régua counts the coleção rather than an authored figure", () => {
    // Derived, so the label cannot diverge from the collection it annotates.
    expect(bloco.regua).toBe("6 PEÇAS");
  });
});

describe("§5 — the service band", () => {
  test("states frete, montagem, prazo and arrependimento, in that order", () => {
    expect(CAMPOS_DE_SERVICO.map((c) => c.rotulo)).toEqual([
      "FRETE",
      "MONTAGEM",
      "PRAZO",
      "ARREPENDIMENTO",
    ]);
  });

  test("three fields link and prazo does not — §5", () => {
    // Inventing a `/politicas/prazos` page to make the rail symmetrical would
    // be worse than the asymmetry.
    const porRotulo = new Map(CAMPOS_DE_SERVICO.map((c) => [c.rotulo, c.href]));
    expect(porRotulo.get("FRETE")).toBe("/politicas/entrega-e-frete");
    expect(porRotulo.get("MONTAGEM")).toBe("/politicas/entrega-e-frete");
    expect(porRotulo.get("PRAZO")).toBeNull();
    expect(porRotulo.get("ARREPENDIMENTO")).toBe("/politicas/trocas-e-devolucoes");
  });

  test("every line is the short version of a fact stated in full elsewhere", () => {
    for (const campo of CAMPOS_DE_SERVICO) expect(campo.linha.endsWith(".")).toBe(true);
  });
});

describe("§6 — Inspirações", () => {
  const linhas = linhasDeInspiracao();

  test("is three of the four articles, in the authored order", () => {
    expect(linhas.map((l) => l.slug)).toEqual(conteudoHome.inspiracoes);
  });

  test("every row carries its ambiente, title, one-line summary and thumb", () => {
    for (const linha of linhas) {
      expect(linha.ambiente).toBe(linha.ambiente.toUpperCase());
      expect(linha.titulo.length).toBeGreaterThan(0);
      expect(linha.resumo.length).toBeGreaterThan(0);
      expect(linha.thumb.alt.length).toBeGreaterThan(0);
      expect(linha.href).toBe(`/inspiracoes/${linha.slug}`);
    }
  });
});

describe("§7 — the marcenaria", () => {
  test("is the authored block, feature line and all", () => {
    const bloco = marcenariaDaHome();
    expect(bloco.linha).toBe(conteudoHome.marcenaria.linha);
    expect(bloco.texto).toBe(conteudoHome.marcenaria.texto);
    expect(bloco.imagem.alt.length).toBeGreaterThan(0);
  });
});

describe("metadata — `rotas.md` §§1–2", () => {
  test("the description is derived over the catalogue, and counts it", () => {
    expect(descricaoDaHome()).toBe(
      `Móveis assinados, feitos sob encomenda na nossa marcenaria. ${
        todosOsProdutos().length
      } peças para sala, quarto, cozinha e escritório.`,
    );
  });
});
