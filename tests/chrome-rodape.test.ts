import { describe, expect, test } from "bun:test";
// The footer's reasoning below the DOM: which zones a variant carries, what the
// link columns hold, and the identification line the decree asks for. The copy
// itself is asserted against the rendered markup in `chrome-marcacao.test.tsx`.
import {
  colunasDeLinks,
  linhaDeIdentificacao,
  zonasDoRodape,
} from "../lib/chrome/rodape";
import { ambientes, loja, paginasDePolitica } from "../lib/catalogo";

// rodape.md §6
describe("the link columns", () => {
  const colunas = colunasDeLinks();

  test("are three, titled in the annotation voice", () => {
    expect(colunas.map((c) => c.titulo)).toEqual(["AMBIENTES", "A MARCA", "AJUDA"]);
  });

  test("list the four ambientes and then all the pieces", () => {
    expect(colunas[0].itens.map((i) => i.href)).toEqual([
      ...ambientes.map((a) => `/${a.slug}`),
      "/produtos",
    ]);
    expect(colunas[0].itens.at(-1)!.label).toBe("Todas as peças");
  });

  test("carry Inspirações, Sobre and Contato — what the navbar pushed down", () => {
    expect(colunas[1].itens).toEqual([
      { label: "Inspirações", href: "/inspiracoes" },
      { label: "Sobre", href: "/sobre" },
      { label: "Contato", href: "/contato" },
    ]);
  });

  test("render Ajuda from the same list that generates the policy routes", () => {
    expect(colunas[2].itens).toEqual(
      paginasDePolitica.map((p) => ({ label: p.titulo, href: `/politicas/${p.slug}` })),
    );
    expect(colunas[2].itens).toHaveLength(4);
  });

  test("leave the tipos, the coleções and the purchase destinations out", () => {
    const hrefs = colunas.flatMap((c) => c.itens.map((i) => i.href));
    for (const recusado of ["/sala/sofas", "/colecoes", "/carrinho", "/checkout"]) {
      expect(hrefs).not.toContain(recusado);
    }
  });

  test("point at entrega-e-frete, never at the retired prazos-e-entrega", () => {
    const hrefs = colunas.flatMap((c) => c.itens.map((i) => i.href));
    expect(hrefs).toContain("/politicas/entrega-e-frete");
    expect(hrefs).not.toContain("/politicas/prazos-e-entrega");
  });
});

// rodape.md §§2, 9
describe("the two variants", () => {
  test("the full footer carries every zone", () => {
    expect(zonasDoRodape("completo")).toEqual({
      linhaDeFecho: true,
      newsletter: true,
      colunas: ["AMBIENTES", "A MARCA", "AJUDA"],
      atendimento: true,
      marcas: true,
      legal: true,
    });
  });

  test("the checkout footer drops the Mincho line, the newsletter and two columns", () => {
    expect(zonasDoRodape("reduzido")).toEqual({
      linhaDeFecho: false,
      newsletter: false,
      colunas: ["AJUDA"],
      atendimento: true,
      marcas: true,
      legal: true,
    });
  });

  test("keeps the legal block in both — the identification duty does not stop at checkout", () => {
    for (const variante of ["completo", "reduzido"] as const) {
      expect(zonasDoRodape(variante).legal).toBe(true);
    }
  });
});

// rodape.md §3
describe("the identification line", () => {
  const linha = linhaDeIdentificacao();

  test("runs razão social, CNPJ, IE and the full address separated by ·", () => {
    expect(linha).toBe(
      "Canto Zen Marcenaria e Comércio de Móveis Ltda. · CNPJ 51.204.876/0001-40 · " +
        "IE 116.482.930.114 · Rua Harmonia, 742, Vila Madalena, São Paulo — SP, CEP 05435-000",
    );
  });

  test("reads the same Loja both surfaces read — nothing is retyped here", () => {
    expect(linha).toContain(loja.razaoSocial);
    expect(linha).toContain(loja.cnpj);
    expect(linha).toContain(loja.inscricaoEstadual);
    expect(linha).toContain(loja.endereco.cep);
  });

  test("is never blank — an empty legal block is the failure the spec exists to prevent", () => {
    for (const campo of [loja.razaoSocial, loja.cnpj, loja.inscricaoEstadual]) {
      expect(campo.trim().length).toBeGreaterThan(0);
    }
  });
});
