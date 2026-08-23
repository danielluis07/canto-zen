import { describe, expect, test } from "bun:test";
// Seam 1 again: the CEP widget's reasoning is pulled below the DOM precisely so
// it can be asserted here, and what is left in the component is wiring.
// `build-spec.md` §Seam 2 names this the honest trade.
import { CEP_CORRIGIVEL, cotarFrete, eNaoAtendida, reais } from "../lib/catalogo";
import { consultarFrete, mascaraDeCep, NOTA_PRAZO } from "../lib/produto/cep";
import { carrinhoVazio, lembrarCep } from "../lib/carrinho/estado";
import { exigirProduto } from "./helpers/catalogo";

const lina = exigirProduto("poltrona-lina-linho-cru");
// The hero: `freteGratis: "sudeste"` and `sob-encomenda` with six weeks — the
// two branches the note lines and the `Grátis` word both hang off.
const heron = exigirProduto("sofa-heron-linho-cru");
// An envio-imediato piece: the note block is the prazo line and nothing else.
const seixo = exigirProduto("mesa-de-centro-seixo-freijo");

const PAULISTA = "01310-100";
// Prefix 01, a served region, absent from `dados.md` §4.2's fixture table.
const SERVIDO_SEM_FIXTURE = "01415-000";
const RIO_BRANCO = "69900-000";

const cotado = (entrada: string, produto = lina) => {
  const resultado = consultarFrete(entrada, produto);
  if (resultado.estado !== "cotado") {
    throw new Error(`expected a quote, got ${resultado.estado}: ${entrada}`);
  }
  return resultado;
};

// pagina-produto.md §2.7 — the field itself
describe("the CEP field", () => {
  test("masks as 00000-000 and stops at eight digits", () => {
    expect(mascaraDeCep("01310100")).toBe("01310-100");
    expect(mascaraDeCep("013101009999")).toBe("01310-100");
    expect(mascaraDeCep("0131")).toBe("0131");
    expect(mascaraDeCep("01310")).toBe("01310");
  });

  test("keeps only digits, so a pasted CEP with its hyphen survives", () => {
    expect(mascaraDeCep("01310-100")).toBe("01310-100");
    expect(mascaraDeCep("cep 01310100")).toBe("01310-100");
  });
});

// erros.md §5.2 — the two classes, which are not the same event
describe("the two error classes", () => {
  test("six digits state the fix and never the fault", () => {
    const resultado = consultarFrete("013101", lina);
    expect(resultado).toEqual({ estado: "corrigivel", mensagem: "CEP tem 8 dígitos." });
    expect(resultado.estado === "corrigivel" && resultado.mensagem).toBe(CEP_CORRIGIVEL.mensagem);
  });

  test("an empty field is corrigível too, not a quote", () => {
    expect(consultarFrete("", lina).estado).toBe("corrigivel");
  });

  test("a correctly-formed CEP the store does not serve states the limit and the way on", () => {
    const resultado = consultarFrete(RIO_BRANCO, lina);
    expect(resultado).toEqual({
      estado: "nao-atendida",
      mensagem: "Ainda não entregamos neste CEP.",
      saibaMais: "/politicas/entrega-e-frete",
    });
  });

  test("never calls a correctly-typed CEP inválido", () => {
    const resultado = consultarFrete(RIO_BRANCO, lina);
    expect(JSON.stringify(resultado)).not.toContain("inválid");
  });
});

// pagina-produto.md §2.7 — a table of options, never a single figure
describe("the options table", () => {
  test("answers with both modalidades, in the spec's order", () => {
    expect(cotado(PAULISTA).opcoes.map((o) => o.rotulo)).toEqual([
      "Entrega padrão",
      "Entrega agendada",
    ]);
  });

  test("takes every figure from the freight function, computing none of its own", () => {
    const opcoes = cotarFrete(PAULISTA, lina.embalagem, lina.freteGratis);
    if (eNaoAtendida(opcoes)) throw new Error("expected options");

    expect(cotado(PAULISTA).opcoes.map((o) => o.valor)).toEqual(
      opcoes.map((o) => (o.gratis ? "Grátis" : reais(o.centavos))),
    );
  });

  test("gives padrão its prazo in dias úteis and agendada its chosen date", () => {
    const [padrao, agendada] = cotado(PAULISTA).opcoes;
    // Sudeste capitais — dados.md §4.1.
    expect(padrao!.detalhe).toBe("até 6 dias úteis");
    expect(agendada!.detalhe).toBe("data à sua escolha");
  });

  test("a Belém CEP and a São Paulo CEP give visibly different answers", () => {
    expect(cotado("66010-000").opcoes[0]!.valor).not.toBe(cotado(PAULISTA).opcoes[0]!.valor);
    expect(cotado("66010-000").opcoes[0]!.detalhe).toBe("até 20 dias úteis");
  });

  test("writes Grátis, the word, and never R$ 0,00", () => {
    const resultado = cotado(PAULISTA, heron);
    expect(resultado.opcoes[0]!.valor).toBe("Grátis");
    expect(JSON.stringify(resultado)).not.toContain("R$ 0,00");
  });

  test("still charges agendada its difference above a zeroed base", () => {
    expect(cotado(PAULISTA, heron).opcoes[1]!.valor).toBe(reais(10000));
  });

  test("a freteGratis piece outside the covered region pays a real figure", () => {
    // `sudeste` does not reach Porto Alegre.
    expect(cotado("90010-000", heron).opcoes[0]!.valor).not.toBe("Grátis");
  });
});

// dados.md §4.2 — the mock is honest about what it knows
describe("what a CEP resolves to", () => {
  test("a fixture CEP autofills a real address", () => {
    expect(cotado(PAULISTA).endereco).toBe("Avenida Paulista, Bela Vista, São Paulo — SP");
  });

  test("a fixture named by bairro carries no logradouro", () => {
    expect(cotado("13010-000").endereco).toBe("Centro, Campinas — SP");
  });

  test("a served non-fixture CEP resolves its region and autofills nothing", () => {
    const resultado = cotado(SERVIDO_SEM_FIXTURE);
    expect(resultado.endereco).toBe(null);
    expect(resultado.regiao).toBe("sudeste-capitais");
    expect(resultado.opcoes).toHaveLength(2);
  });

  test("hands back the eight bare digits, whatever was typed", () => {
    expect(cotado("01310100").cep).toBe("01310100");
    expect(cotado(PAULISTA).cep).toBe("01310100");
  });
});

// pagina-produto.md §2.7 — the note lines below the table
describe("the notes below the table", () => {
  test("states the prazo convention once, always", () => {
    expect(cotado(PAULISTA, seixo).notas).toEqual([NOTA_PRAZO]);
    expect(NOTA_PRAZO).toBe("PRAZO EM DIAS ÚTEIS, CONTADO APÓS A CONFIRMAÇÃO DO PAGAMENTO.");
  });

  test("adds what a sob-encomenda piece actually takes before dispatch", () => {
    expect(cotado(PAULISTA, heron).notas).toEqual([
      NOTA_PRAZO,
      "PRODUÇÃO DE 6 SEMANAS ANTES DO ENVIO.",
    ]);
  });
});

// build-spec.md §State — the session CEP is one value, not three
describe("the remembered CEP", () => {
  test("is stored as the bare digits, so cart and checkout read one shape", () => {
    expect(lembrarCep(carrinhoVazio, "01310-100").cep).toBe("01310100");
  });

  test("leaves the items alone", () => {
    const carrinho = { itens: [{ slug: "poltrona-lina-linho-cru", quantidade: 2, montagem: true }] };
    expect(lembrarCep(carrinho, "01310100").itens).toEqual(carrinho.itens);
  });

  test("refuses a malformed CEP rather than remembering a typo", () => {
    expect(lembrarCep(carrinhoVazio, "013101").cep).toBeUndefined();
  });
});
