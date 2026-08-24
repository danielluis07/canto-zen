import { describe, expect, test } from "bun:test";
import { politicas, precoAVista, reais, tabelaDeParcelas } from "../lib/catalogo";
import { catalogoDoCarrinho } from "../lib/carrinho/catalogo";
import { adicionarAoCarrinho, carrinhoVazio, esvaziarCarrinho, type Carrinho } from "../lib/carrinho/estado";
import {
  cartaoPassaLuhn,
  celularTemForma,
  cpfEValido,
  emailTemForma,
  mascaraDeCartao,
  mascaraDeCelular,
  mascaraDeCpf,
  mascaraDeUf,
  mascaraDeValidade,
  validadeEValida,
} from "../lib/checkout/campos";
import {
  ajustarParcelas,
  freteDoCheckout,
  opcoesDeParcela,
  resumoDaEntrega,
  resumoDaIdentificacao,
  resumoDoCheckout,
} from "../lib/checkout/conteudo";
import {
  autopreencher,
  bloqueioDoCheckout,
  checkoutDe,
  rascunhoInicial,
  secaoCompleta,
  validarEntrega,
  validarIdentificacao,
  validarPagamento,
  type Rascunho,
} from "../lib/checkout/estado";
import { pedidoDe } from "../lib/checkout/pedido";

// Seam 1 — `build-spec.md`, Testing Decisions. Pure functions and plain data, no
// DOM and no server: the checkout's reasoning lives below the components on
// purpose (`checkout.md` §12, §Seam 2's deal), and this is where it is asserted.
//
// What a browser would be needed for — the accordion opening, the field
// focusing, the beat elapsing — is not here. What can be pulled below the DOM is
// pulled there and tested here, which is where the reasoning worth testing is.

const catalogo = catalogoDoCarrinho();

const LINHA_CRU = "poltrona-lina-linho-cru";
const SEIXO = "mesa-de-centro-seixo-freijo";
const ESGOTADA = "sofa-taipa-couro-argila";
const GRATIS_NACIONAL = "guarda-roupa-cais-carvalho";

/** Real check digits — the spec's illustrative `143.882.907-05` does not pass. */
const CPF_VALIDO = "143.882.907-85";
/** Luhn-valid, and nothing else is claimed about it — §7.2 refuses brand lookup. */
const CARTAO_VALIDO = "4111 1111 1111 1111";
/** `dados.md` §4.2's Avenida Paulista fixture — Sudeste capitais. */
const CEP_FIXTURE = "01310100";
/** Served, and not a fixture: the region resolves and no street is guessed. */
const CEP_SERVIDO = "01415000";
/** `frete.ts`'s single unserved prefix — Acre, Roraima, the Amazonas interior. */
const CEP_NAO_ATENDIDO = "69900000";

const carrinhoCom = (...slugs: string[]): Carrinho =>
  slugs.reduce(
    (carrinho, slug) => adicionarAoCarrinho(carrinho, { slug, montagem: false }),
    carrinhoVazio,
  );

const preenchido = (mudanca: Partial<Rascunho> = {}): Rascunho => ({
  ...rascunhoInicial(CEP_FIXTURE),
  email: "ana.ribeiro@email.com",
  cpf: CPF_VALIDO,
  nome: "Ana Ribeiro",
  celular: "(11) 98812-4470",
  logradouro: "Rua Augusta",
  numero: "1412",
  complemento: "apto 92",
  bairro: "Consolação",
  cidade: "São Paulo",
  uf: "SP",
  ...mudanca,
});

// ---------------------------------------------------------------------------
// checkout.md §5 — CPF validates its check digits, for real
// ---------------------------------------------------------------------------

describe("the CPF check digits", () => {
  test("accept a number whose two verifiers are right", () => {
    expect(cpfEValido(CPF_VALIDO)).toBe(true);
    expect(cpfEValido("14388290785")).toBe(true);
  });

  test("reject the number the spec prints as an illustration", () => {
    // §5's example is copy, not a fixture — and an invalid CPF sailing through
    // is the cheapest tell that would break the illusion the page maintains.
    expect(cpfEValido("143.882.907-05")).toBe(false);
  });

  test("reject a repdigit, which satisfies the arithmetic and fools nobody", () => {
    expect(cpfEValido("111.111.111-11")).toBe(false);
    expect(cpfEValido("00000000000")).toBe(false);
  });

  test("reject anything that is not eleven digits", () => {
    expect(cpfEValido("1438829078")).toBe(false);
    expect(cpfEValido("")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// checkout.md §7.2 — Luhn, and nothing more
// ---------------------------------------------------------------------------

describe("the card number", () => {
  test("passes Luhn or it does not", () => {
    expect(cartaoPassaLuhn(CARTAO_VALIDO)).toBe(true);
    expect(cartaoPassaLuhn("4111 1111 1111 1112")).toBe(false);
  });

  test("is refused at any length but sixteen — no brand, so no brand's length", () => {
    expect(cartaoPassaLuhn("411111111111")).toBe(false);
    expect(cartaoPassaLuhn("41111111111111111")).toBe(false);
  });

  test("validade is shape and month only, and asks no clock", () => {
    expect(validadeEValida("12/29")).toBe(true);
    expect(validadeEValida("01/00")).toBe(true);
    expect(validadeEValida("13/29")).toBe(false);
    expect(validadeEValida("00/29")).toBe(false);
    expect(validadeEValida("1/29")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// The masks — §§5, 6.1, 7.2
// ---------------------------------------------------------------------------

describe("the masks", () => {
  test("place the separators as the reader types", () => {
    expect(mascaraDeCpf("14388290785")).toBe("143.882.907-85");
    expect(mascaraDeCpf("143")).toBe("143");
    expect(mascaraDeCartao("4111111111111111")).toBe("4111 1111 1111 1111");
    expect(mascaraDeValidade("1229")).toBe("12/29");
  });

  test("carry the DDD inside the celular field, at ten digits and eleven", () => {
    expect(mascaraDeCelular("11988124470")).toBe("(11) 98812-4470");
    expect(mascaraDeCelular("1138124470")).toBe("(11) 3812-4470");
  });

  test("decline a keystroke past the end rather than reporting it", () => {
    // A ninth digit is a slip the field simply refuses; too *few* is a fact
    // about the CEP the reader believes they have, which a message answers.
    expect(mascaraDeCpf("143882907855")).toBe("143.882.907-85");
    expect(mascaraDeCartao("41111111111111119")).toBe("4111 1111 1111 1111");
  });

  test("upper-case the UF and keep it to two letters", () => {
    expect(mascaraDeUf("sp")).toBe("SP");
    expect(mascaraDeUf("s1p2")).toBe("SP");
  });

  test("read e-mail and celular for shape only", () => {
    expect(emailTemForma("ana.ribeiro@email.com")).toBe(true);
    expect(emailTemForma("ana.ribeiro@email")).toBe(false);
    expect(emailTemForma("ana ribeiro")).toBe(false);
    expect(celularTemForma("(11) 98812-4470")).toBe(true);
    expect(celularTemForma("(11) 9881-447")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// erros.md §5.2 — two classes, and the copy rule differs
// ---------------------------------------------------------------------------

describe("the two error classes", () => {
  test("a short CEP is Corrigível and states the fix, never the fault", () => {
    const erro = validarEntrega(preenchido({ cep: "0131010" })).cep;
    expect(erro?.classe).toBe("corrigivel");
    expect(erro?.texto).toBe("CEP tem 8 dígitos.");
    expect(erro?.texto).not.toContain("inválido");
  });

  test("a correctly-typed unserved CEP is a Fato, and carries the way on", () => {
    const erro = validarEntrega(preenchido({ cep: CEP_NAO_ATENDIDO })).cep;
    expect(erro?.classe).toBe("fato");
    expect(erro?.texto).toBe("Ainda não entregamos neste CEP.");
    expect(erro && "saibaMais" in erro && erro.saibaMais).toBe("/politicas/entrega-e-frete");
  });

  test("every Corrigível in the flow states a fix and names no fault", () => {
    const vazio = rascunhoInicial();
    const mensagens = [
      ...Object.values(validarIdentificacao(vazio)),
      ...Object.values(validarEntrega(vazio)),
      ...Object.values(validarPagamento({ ...vazio, metodo: "cartao" })),
    ];

    expect(mensagens.length).toBeGreaterThan(0);
    for (const mensagem of mensagens) {
      expect(mensagem.texto).not.toMatch(/inválid|incorret|erro/i);
      // Corpo S is a sentence voice, not the annotation voice — `erros.md` §5.3.
      expect(mensagem.texto).not.toBe(mensagem.texto.toUpperCase());
    }
  });

  test("a wrong CPF says to check the numbers, and a short one says how many", () => {
    expect(validarIdentificacao(preenchido({ cpf: "143.882.907-05" })).cpf?.texto).toBe(
      "Confira os números do CPF.",
    );
    expect(validarIdentificacao(preenchido({ cpf: "143" })).cpf?.texto).toBe("CPF tem 11 dígitos.");
  });
});

// ---------------------------------------------------------------------------
// §6.1 — the autofill reads a fixture table, not a service
// ---------------------------------------------------------------------------

describe("the CEP autofill", () => {
  test("fills the four fields from a fixture", () => {
    const preenchidoPeloCep = autopreencher(rascunhoInicial(), CEP_FIXTURE);
    expect(preenchidoPeloCep.logradouro).toBe("Avenida Paulista");
    expect(preenchidoPeloCep.bairro).toBe("Bela Vista");
    expect(preenchidoPeloCep.cidade).toBe("São Paulo");
    expect(preenchidoPeloCep.uf).toBe("SP");
  });

  test("guesses nothing for a served CEP the table does not name", () => {
    const servido = autopreencher(rascunhoInicial(), CEP_SERVIDO);
    expect(servido.cep).toBe(CEP_SERVIDO);
    expect(servido.logradouro).toBe("");
    expect(servido.cidade).toBe("");
  });

  test("fills nothing for an unserved prefix", () => {
    const recusado = autopreencher(rascunhoInicial(), CEP_NAO_ATENDIDO);
    expect(recusado.logradouro).toBe("");
    expect(recusado.bairro).toBe("");
  });

  test("opens already answered where the cart handed a CEP over", () => {
    // `carrinho.md` §11 — asking for the same CEP a third time is the defect the
    // session CEP exists to prevent.
    expect(rascunhoInicial("01310100").cep).toBe("01310100");
    expect(rascunhoInicial().cep).toBe("");
  });
});

// ---------------------------------------------------------------------------
// §6.2 — the freight modality, and the number that moves
// ---------------------------------------------------------------------------

describe("the freight modality", () => {
  const carrinho = { ...carrinhoCom(LINHA_CRU, SEIXO), cep: CEP_FIXTURE };

  test("quotes padrão and agendada, in that order, with one prazo", () => {
    const frete = freteDoCheckout(CEP_FIXTURE, carrinho, catalogo);
    expect(frete.estado).toBe("cotado");
    if (frete.estado !== "cotado") return;

    expect(frete.opcoes.map((opcao) => opcao.modalidade)).toEqual(["padrao", "agendada"]);
    expect(frete.opcoes[0]!.rotulo).toBe("ENTREGA PADRÃO");
    expect(frete.opcoes[1]!.rotulo).toBe("ENTREGA AGENDADA");
    expect(frete.opcoes[0]!.detalhe).toContain("após a confirmação do pagamento");
    expect(frete.opcoes[1]!.detalhe).toContain("data à sua escolha");
  });

  test("charges agendada above padrão, and never below it", () => {
    const frete = freteDoCheckout(CEP_FIXTURE, carrinho, catalogo);
    if (frete.estado !== "cotado") throw new Error("the fixture CEP must quote");
    expect(frete.opcoes[1]!.centavos).toBeGreaterThan(frete.opcoes[0]!.centavos);
  });

  test("writes `Grátis`, the word, and never `R$ 0,00`", () => {
    const gratis = { ...carrinhoCom(GRATIS_NACIONAL), cep: CEP_FIXTURE };
    const frete = freteDoCheckout(CEP_FIXTURE, gratis, catalogo);
    if (frete.estado !== "cotado") throw new Error("the fixture CEP must quote");

    expect(frete.opcoes[0]!.valor).toBe("Grátis");
    expect(frete.opcoes[0]!.centavos).toBe(0);
    // §6.2 — agendada still charges its difference above the now-zero base.
    expect(frete.opcoes[1]!.valor).not.toBe("Grátis");
    expect(frete.opcoes[1]!.valor).not.toBe("R$ 0,00");
  });

  test("refuses an unserved prefix rather than quoting a fallback", () => {
    const frete = freteDoCheckout(CEP_NAO_ATENDIDO, carrinho, catalogo);
    expect(frete.estado).toBe("nao-atendida");
  });

  test("has no quote at all before a CEP has eight digits", () => {
    expect(freteDoCheckout("", carrinho, catalogo).estado).toBe("sem-cep");
    expect(freteDoCheckout("0131", carrinho, catalogo).estado).toBe("sem-cep");
  });
});

// ---------------------------------------------------------------------------
// §6.2, §7.1 — the resumo, and freight inside the total
// ---------------------------------------------------------------------------

describe("the resumo", () => {
  const carrinho = { ...carrinhoCom(LINHA_CRU, SEIXO), cep: CEP_FIXTURE };

  test("folds freight into the total — the promise the cart deliberately kept out", () => {
    const rascunho = preenchido();
    const resumo = resumoDoCheckout(rascunho, carrinho, catalogo);
    if (resumo.frete.estado !== "cotado") throw new Error("the fixture CEP must quote");

    const subtotal = carrinho.itens.reduce(
      (soma, item) => soma + catalogo[item.slug]!.precoTabela * item.quantidade,
      0,
    );
    expect(resumo.subtotal).toBe(reais(subtotal));
    expect(resumo.totalCentavos).toBe(subtotal + resumo.frete.escolhida.centavos);
  });

  test("moves the total when the reader moves the modality, and says so out loud", () => {
    const padrao = resumoDoCheckout(preenchido({ modalidade: "padrao" }), carrinho, catalogo);
    const agendada = resumoDoCheckout(preenchido({ modalidade: "agendada" }), carrinho, catalogo);

    expect(agendada.totalCentavos).toBeGreaterThan(padrao.totalCentavos);
    expect(agendada.anuncioDoTotal).toBe(`Total atualizado: ${agendada.total}`);
  });

  test("states `A calcular` rather than a figure while no CEP has resolved", () => {
    const semCep = resumoDoCheckout(preenchido({ cep: "" }), carrinhoCom(LINHA_CRU), catalogo);
    expect(semCep.freteValor).toBe("A calcular");
    expect(semCep.freteValor).not.toContain("R$");
  });

  test("derives the à-vista tier from the total, freight included", () => {
    const resumo = resumoDoCheckout(preenchido(), carrinho, catalogo);
    expect(resumo.aVistaValor).toBe(reais(precoAVista(resumo.totalCentavos)));
    expect(resumo.pix).toBe(`${politicas.descontoPixPercent}% À VISTA NO PIX`);
  });

  test("counts an esgotado line's price in, and marks the cart as blocked", () => {
    const comEsgotada = { ...carrinhoCom(LINHA_CRU, ESGOTADA), cep: CEP_FIXTURE };
    expect(resumoDoCheckout(preenchido(), comEsgotada, catalogo).esgotadas).toBe(true);
    expect(resumoDoCheckout(preenchido(), carrinho, catalogo).esgotadas).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// §7.2 — the parcelas dropdown, derived by produto.md's rule
// ---------------------------------------------------------------------------

describe("the parcela selection", () => {
  test("offers every count from 1x up to the policy's own derivation", () => {
    const total = 856800;
    const opcoes = opcoesDeParcela(total);

    expect(opcoes.map((opcao) => opcao.parcelas)).toEqual(
      tabelaDeParcelas(total).map((parcela) => parcela.parcelas),
    );
    expect(opcoes.length).toBeLessThanOrEqual(politicas.parcelasMax);
    expect(opcoes[0]!.rotulo).toBe(`1x de ${reais(total)} à vista`);
    expect(opcoes[opcoes.length - 1]!.rotulo).toContain("sem juros");
  });

  test("never lists a parcela below the policy minimum", () => {
    for (const total of [15000, 29999, 30000, 149900, 856800, 2000000]) {
      for (const { parcelas } of opcoesDeParcela(total)) {
        if (parcelas === 1) continue;
        expect(Math.round(total / parcelas)).toBeGreaterThanOrEqual(
          politicas.parcelaMinimaCentavos,
        );
      }
    }
  });

  test("offers one instalment where the total affords no second", () => {
    const opcoes = opcoesDeParcela(politicas.parcelaMinimaCentavos - 1);
    expect(opcoes).toHaveLength(1);
    expect(opcoes[0]!.rotulo).toContain("à vista");
  });

  test("clamps a chosen count when the total moves beneath it", () => {
    // The one number in the flow that moves is freight, and it moves under a
    // dropdown the reader has already answered.
    expect(ajustarParcelas(10, 856800)).toBe(10);
    expect(ajustarParcelas(10, 30000)).toBe(2);
    expect(ajustarParcelas(10, 10000)).toBe(1);
    expect(ajustarParcelas(0, 856800)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// §§4, 9, 12 — sections, the soft lock, and the typed record
// ---------------------------------------------------------------------------

describe("the sections", () => {
  test("collapse to a summary row naming what was entered", () => {
    const rascunho = preenchido();
    expect(resumoDaIdentificacao(rascunho)).toBe(
      "Ana Ribeiro · ana.ribeiro@email.com · 143.882.907-85 · (11) 98812-4470",
    );

    const resumo = resumoDoCheckout(rascunho, { ...carrinhoCom(LINHA_CRU), cep: CEP_FIXTURE }, catalogo);
    const [endereco, modalidade] = resumoDaEntrega(rascunho, resumo.frete);
    expect(endereco).toBe("Rua Augusta, 1412 · apto 92 · Consolação · São Paulo/SP · 01310-100");
    expect(modalidade).toContain("ENTREGA PADRÃO");
    expect(modalidade).toContain("dias úteis");
  });

  test("are complete or not, and nothing is tracked beside the answer", () => {
    expect(secaoCompleta(preenchido(), 1)).toBe(true);
    expect(secaoCompleta(preenchido({ email: "ana" }), 1)).toBe(false);
    expect(secaoCompleta(preenchido(), 2)).toBe(true);
    expect(secaoCompleta(preenchido({ numero: "" }), 2)).toBe(false);
    // Pix asks for nothing, so choosing it completes the section.
    expect(secaoCompleta(preenchido(), 3)).toBe(true);
    expect(secaoCompleta(preenchido({ metodo: "cartao" }), 3)).toBe(false);
  });

  test("name the section the CTA is waiting on, esgotado first", () => {
    expect(bloqueioDoCheckout(preenchido(), false)).toBeNull();
    expect(bloqueioDoCheckout(preenchido({ email: "" }), false)).toEqual({
      secao: 1,
      mensagem: "COMPLETE A IDENTIFICAÇÃO PARA CONTINUAR.",
    });
    expect(bloqueioDoCheckout(preenchido({ numero: "" }), false)?.secao).toBe(2);
    expect(bloqueioDoCheckout(preenchido({ metodo: "cartao" }), false)?.secao).toBe(3);
    expect(bloqueioDoCheckout(preenchido({ email: "" }), true)).toEqual({
      secao: null,
      mensagem: "REMOVA AS PEÇAS ESGOTADAS PARA CONTINUAR.",
    });
  });
});

// checkout.md §12 — the typed record, and what it deliberately does not carry
describe("the Checkout record", () => {
  test("exists only where all three sections validate", () => {
    expect(checkoutDe(preenchido())).not.toBeNull();
    expect(checkoutDe(preenchido({ cpf: "143" }))).toBeNull();
    expect(checkoutDe(preenchido({ cep: CEP_NAO_ATENDIDO }))).toBeNull();
    expect(checkoutDe(preenchido({ metodo: "cartao" }))).toBeNull();
  });

  test("is §12's shape exactly, with the CEP and CPF as bare digits", () => {
    const checkout = checkoutDe(preenchido())!;
    expect(checkout.identificacao).toEqual({
      email: "ana.ribeiro@email.com",
      cpf: "14388290785",
      nome: "Ana Ribeiro",
      celular: "11988124470",
    });
    expect(checkout.entrega).toEqual({
      cep: "01310100",
      logradouro: "Rua Augusta",
      numero: "1412",
      complemento: "apto 92",
      bairro: "Consolação",
      cidade: "São Paulo",
      uf: "SP",
      modalidade: "padrao",
    });
    expect(checkout.pagamento).toEqual({ metodo: "pix" });
  });

  test("omits complemento rather than storing an empty string", () => {
    const checkout = checkoutDe(preenchido({ complemento: "  " }))!;
    expect("complemento" in checkout.entrega).toBe(false);
  });

  test("carries a parcela count under cartão, and no card digits at all", () => {
    const comCartao = preenchido({
      metodo: "cartao",
      parcelas: 6,
      cartao: {
        numero: CARTAO_VALIDO,
        nome: "ANA RIBEIRO",
        validade: "12/29",
        cvv: "123",
        cpf: CPF_VALIDO,
      },
    });

    const checkout = checkoutDe(comCartao)!;
    expect(checkout.pagamento).toEqual({ metodo: "cartao", parcelas: 6 });
    // §12 types `pagamento` for cartão as a parcela count and nothing else, so
    // the number, the CVV and the validade never become part of the flow's state.
    expect(JSON.stringify(checkout)).not.toContain("4111");
    expect(JSON.stringify(checkout)).not.toContain("123");
  });
});

// ---------------------------------------------------------------------------
// §10 — the order record, and §11's clearing
// ---------------------------------------------------------------------------

describe("the confirmed order", () => {
  const carrinho = { ...carrinhoCom(LINHA_CRU, SEIXO), cep: CEP_FIXTURE };

  test("carries the constant order number, never a randomised one", () => {
    const pedido = pedidoDe(checkoutDe(preenchido())!, carrinho, catalogo);
    expect(pedido.numero).toBe("0000");
  });

  test("is a complete record of what was chosen", () => {
    const pedido = pedidoDe(checkoutDe(preenchido())!, carrinho, catalogo);

    expect(pedido.linhas.map((linha) => linha.slug)).toEqual([LINHA_CRU, SEIXO]);
    expect(pedido.entrega.nome).toBe("Ana Ribeiro");
    expect(pedido.entrega.endereco).toBe(
      "Rua Augusta, 1412 · apto 92 · Consolação · São Paulo/SP · 01310-100",
    );
    expect(pedido.entrega.modalidade).toContain("ENTREGA PADRÃO");
    expect(pedido.entrega.modalidade).toContain("DIAS ÚTEIS APÓS A CONFIRMAÇÃO DO PAGAMENTO");
  });

  test("states the total as paid — Pix discounted, and what it was before", () => {
    const pedido = pedidoDe(checkoutDe(preenchido())!, carrinho, catalogo);
    const resumo = resumoDoCheckout(preenchido(), carrinho, catalogo);

    expect(pedido.pagamento.total).toBe(reais(precoAVista(resumo.totalCentavos)));
    expect(pedido.pagamento.tier).toBe("à vista no Pix");
    expect(pedido.pagamento.badge).toBe("10% À VISTA NO PIX");
    expect(pedido.pagamento.de).toBe(`de ${reais(resumo.totalCentavos)}`);
    expect(pedido.pagamento.nota).toBe("O CÓDIGO PIX NÃO SERÁ GERADO");
  });

  test("pays the table total across its parcelas under cartão, and says none was charged", () => {
    const comCartao = preenchido({
      metodo: "cartao",
      parcelas: 4,
      cartao: {
        numero: CARTAO_VALIDO,
        nome: "ANA RIBEIRO",
        validade: "12/29",
        cvv: "123",
        cpf: CPF_VALIDO,
      },
    });
    const pedido = pedidoDe(checkoutDe(comCartao)!, carrinho, catalogo);
    const resumo = resumoDoCheckout(comCartao, carrinho, catalogo);

    expect(pedido.pagamento.total).toBe(reais(resumo.totalCentavos));
    expect(pedido.pagamento.tier).toContain("4x de ");
    expect(pedido.pagamento.badge).toBeNull();
    expect(pedido.pagamento.nota).toBe("NENHUM CARTÃO FOI COBRADO");
  });

  test("repeats the arrependimento sentence, with its montagem clause conditional", () => {
    const semMontagem = pedidoDe(checkoutDe(preenchido())!, carrinho, catalogo);
    expect(semMontagem.arrependimento).toBe(
      "Você pode desistir da compra em até 7 dias corridos após receber a peça.",
    );

    const comMontagem = pedidoDe(
      checkoutDe(preenchido())!,
      { ...carrinho, itens: carrinho.itens.map((item) => ({ ...item, montagem: true })) },
      catalogo,
    );
    expect(comMontagem.arrependimento).toContain("ou após a montagem, quando contratada");
    expect(comMontagem.linhas.some((linha) => linha.montagem?.startsWith("Montagem incluída"))).toBe(
      true,
    );
  });
});

// checkout.md §11 — the cart is cleared at the transition
describe("the cart after the transition", () => {
  test("is empty, so the navbar counter returns to zero", () => {
    const carrinho = { ...carrinhoCom(LINHA_CRU, SEIXO), cep: CEP_FIXTURE };
    expect(esvaziarCarrinho(carrinho).itens).toEqual([]);
  });

  test("keeps the session CEP, which is the reader's and not the cart's contents", () => {
    const carrinho = { ...carrinhoCom(LINHA_CRU), cep: CEP_FIXTURE };
    expect(esvaziarCarrinho(carrinho).cep).toBe(CEP_FIXTURE);
    expect(esvaziarCarrinho(carrinhoCom(LINHA_CRU)).cep).toBeUndefined();
  });
});
