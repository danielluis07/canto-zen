import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { catalogoDoCarrinho } from "../lib/carrinho/catalogo";
import { adicionarAoCarrinho, carrinhoVazio, type Carrinho } from "../lib/carrinho/estado";
import {
  freteDoCheckout,
  opcoesDeParcela,
  resumoDoCheckout,
  INTERSTICIO_PARAGRAFO,
  INTERSTICIO_TITULO,
} from "../lib/checkout/conteudo";
import { checkoutDe, rascunhoInicial, type Rascunho } from "../lib/checkout/estado";
import { pedidoDe } from "../lib/checkout/pedido";
import { Entrega } from "../components/checkout/entrega";
import { Intersticio, Processando } from "../components/checkout/intersticio";
import { Pagamento } from "../components/checkout/pagamento";
import { Superficie } from "../components/checkout/superficie";
import { Conteudo } from "../components/pedido/registro";

// The checkout renders from state this project cannot drive, so what needs a
// browser — the accordion opening, the beat elapsing, a field taking focus — is
// not asserted here; `tests/checkout.test.ts` holds the reasoning below the DOM.
//
// What only markup can answer is what this file asserts: the sections, the
// radiogroups, the ink-only error treatment, the live region, the verbatim copy
// the interstitial and the confirmation commit to, and the absences the spec
// authors — no consent checkbox, no QR code, no `R$ 0,00`, no régua.

const catalogo = catalogoDoCarrinho();

const LINHA_CRU = "poltrona-lina-linho-cru";
const SEIXO = "mesa-de-centro-seixo-freijo";
const CEP_FIXTURE = "01310100";
const CPF_VALIDO = "143.882.907-85";
const CARTAO_VALIDO = "4111 1111 1111 1111";

const carrinhoCom = (...slugs: string[]): Carrinho => ({
  ...slugs.reduce(
    (carrinho, slug) => adicionarAoCarrinho(carrinho, { slug, montagem: false }),
    carrinhoVazio,
  ),
  cep: CEP_FIXTURE,
});

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

const carrinho = carrinhoCom(LINHA_CRU, SEIXO);

const marcar = (): string =>
  renderToStaticMarkup(
    <Superficie
      carrinho={carrinho}
      catalogo={catalogo}
      processando={false}
      aoFinalizar={() => {}}
    />,
  );

const semTags = (markup: string) => markup.replace(/<[^>]+>/g, " ");

// checkout.md §§3, 4 — one page, three accordion sections, a sticky resumo
describe("the checkout page", () => {
  const html = marcar();

  test("is a single page with three numbered sections in order", () => {
    expect(html).toContain("IDENTIFICAÇÃO");
    expect(html).toContain("ENTREGA");
    expect(html).toContain("PAGAMENTO");
    expect(html.indexOf("IDENTIFICAÇÃO")).toBeLessThan(html.indexOf(">02<"));
    expect(html).toContain(">01<");
    expect(html).toContain(">02<");
    expect(html).toContain(">03<");
  });

  test("opens on Identificação and collapses nothing it has no answer for", () => {
    expect(html).toContain('id="checkout-email"');
    // §4 — `ALTERAR` renders only where there is something to go back to.
    expect(html).not.toContain("ALTERAR");
  });

  test("carries the resumo, with freight as a row of its own inside the total", () => {
    expect(html).toContain("RESUMO");
    expect(html).toContain("Frete");
    expect(html).toContain("Total");
  });

  test("takes the annotation voice for its heading — the body has no Mincho", () => {
    expect(html).toContain('<h1 class="t-annotation text-ink">CHECKOUT</h1>');
    expect(html).not.toContain("t-display-xl");
    expect(html).not.toContain("t-display-l");
  });

  // §8 — selection resolves in ink, so the only índigo that is not interactive
  // state is the Pix badge. A naively built checkout wants at least four.
  test("spends índigo once outside interactive state, on the Pix disclosure", () => {
    const emRepouso = html.match(/(?<!hover:|focus-visible:)text-indigo/g) ?? [];
    expect(emRepouso).toHaveLength(1);
    expect(html).toContain('class="t-annotation text-indigo">10% À VISTA NO PIX');
  });

  test("tints nothing with índigo — selection resolves in ink", () => {
    expect(html).not.toContain("background-color:var(--indigo)");
    expect(html).not.toContain("bg-indigo");
  });

  // §8, marca.md §2 — no régua in a form, and none on this page
  test("carries no régua", () => {
    expect(html).not.toContain("absolute inset-x-0 top-[6px] h-px bg-ink");
  });

  // §5, §7.3 — the basis is execução de contrato, so a tick-box would offer a
  // choice that does not exist; and a terms checkbox gates nothing that happens
  test("has no consent checkbox, and no checkbox at all", () => {
    expect(html).not.toContain('type="checkbox"');
    expect(semTags(html)).not.toContain("Li e aceito");
    expect(semTags(html)).not.toContain("Concordo");
  });

  test("closes Identificação on the LGPD purpose line, conditionality included", () => {
    const texto = semTags(html);
    expect(texto).toContain("Usamos estes dados apenas para emitir a nota e combinar a entrega.");
    // LGPD art. 9º §3 — the treatment is a *condition*, and must be said so.
    expect(texto).toContain("Sem eles não há entrega.");
    // art. 9º VII — a route to the rights, opened without costing the form.
    expect(html).toContain('href="/politicas/privacidade"');
    expect(html).toContain('target="_blank"');
  });

  test("never writes `R$ 0,00`", () => {
    expect(html).not.toContain("R$ 0,00");
  });

  // §14 — the total announces, because the movement is the point
  test("puts the total in a polite live region", () => {
    expect(html).toContain('aria-live="polite"');
  });

  // §3 — the one place carrinho.md §5.5's refusal does not transfer
  test("collapses the resumo to a sticky bottom bar under 1024px", () => {
    expect(html).toContain("VER RESUMO");
    expect(html).toContain("lg:hidden");
  });
});

// checkout.md §6 — CEP first, autofilled, with Número separate
describe("the Entrega section", () => {
  const rascunho = preenchido();
  const frete = resumoDoCheckout(rascunho, carrinho, catalogo).frete;

  const html = renderToStaticMarkup(
    <Entrega
      rascunho={rascunho}
      erros={{}}
      frete={frete}
      editar={() => {}}
      aoTrocarCep={() => {}}
      aoContinuar={() => {}}
    />,
  );

  test("asks the CEP first and offers the way out of not knowing it", () => {
    expect(html.indexOf('id="checkout-cep"')).toBeLessThan(html.indexOf('id="checkout-logradouro"'));
    expect(html).toContain("NÃO SEI MEU CEP");
    expect(html).toContain('href="/politicas/entrega-e-frete"');
  });

  test("keeps Número a field of its own, and marks Complemento optional", () => {
    expect(html).toContain('id="checkout-numero"');
    expect(html).toContain("NÚMERO");
    expect(html).toContain("OPCIONAL");
  });

  test("offers padrão and agendada as a radiogroup, padrão preselected", () => {
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain("ENTREGA PADRÃO");
    expect(html).toContain("ENTREGA AGENDADA");
    expect(html).toContain('type="radio"');
    expect(html).toContain('value="padrao"');
    // Padrão is preselected: a checkout that opens on the dearer option is
    // charging for the reader's inattention.
    const padrao = html.slice(html.indexOf("radiogroup"), html.indexOf("ENTREGA AGENDADA"));
    expect(padrao).toContain('checked=""');
    expect(padrao).toContain("border-color:var(--ink);background-color:var(--kozo)");
  });

  test("offers no montagem control — /carrinho owns it", () => {
    expect(html).not.toContain("Montagem");
    expect(html).not.toContain('type="checkbox"');
  });

  // erros.md §5.1 — ink and typographic weight only, and the field never
  // thickens: the border goes --muted → --ink and stays 1px
  test("resolves a field error in ink, with no colour and no icon", () => {
    const comErro = renderToStaticMarkup(
      <Entrega
        rascunho={preenchido({ cep: "0131" })}
        erros={{ cep: { classe: "corrigivel", texto: "CEP tem 8 dígitos." } }}
        frete={{ estado: "sem-cep" }}
        editar={() => {}}
        aoTrocarCep={() => {}}
        aoContinuar={() => {}}
      />,
    );

    expect(comErro).toContain('aria-invalid="true"');
    expect(comErro).toContain('aria-describedby="checkout-cep-mensagem"');
    expect(comErro).toContain('role="alert"');
    expect(comErro).toContain("border-color:var(--ink)");
    expect(comErro).toContain('class="t-body-s mt-rhythm-2 text-ink"');
    expect(comErro).not.toContain("border-2");
  });

  test("gives a Fato its way on, and a Corrigível none", () => {
    const fato = renderToStaticMarkup(
      <Entrega
        rascunho={preenchido({ cep: "69900000" })}
        erros={{
          cep: {
            classe: "fato",
            texto: "Ainda não entregamos neste CEP.",
            saibaMais: "/politicas/entrega-e-frete",
          },
        }}
        frete={{
          estado: "nao-atendida",
          mensagem: "Ainda não entregamos neste CEP.",
          saibaMais: "/politicas/entrega-e-frete",
        }}
        editar={() => {}}
        aoTrocarCep={() => {}}
        aoContinuar={() => {}}
      />,
    );

    expect(fato).toContain("Ainda não entregamos neste CEP.");
    expect(fato).toContain("Veja a política de entrega e frete");
    // The refusal has no quote behind it, so no modality rows are offered.
    expect(fato).not.toContain("ENTREGA AGENDADA");
  });
});

// checkout.md §7 — two methods, and nothing else in the section
describe("the Pagamento section", () => {
  const rascunho = preenchido();
  const resumo = resumoDoCheckout(rascunho, carrinho, catalogo);

  const marcarPagamento = (proprio: Rascunho, bloqueio: string | null = null) =>
    renderToStaticMarkup(
      <Pagamento
        rascunho={proprio}
        erros={{}}
        resumo={resumoDoCheckout(proprio, carrinho, catalogo)}
        parcelas={opcoesDeParcela(resumo.totalCentavos)}
        bloqueio={bloqueio}
        processando={false}
        editar={() => {}}
        aoTrocarMetodo={() => {}}
        aoFinalizar={() => {}}
      />,
    );

  test("offers Pix and cartão as a radiogroup, and no boleto", () => {
    const html = marcarPagamento(rascunho);
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain("PIX");
    expect(html).toContain("CARTÃO DE CRÉDITO");
    expect(html).not.toContain("BOLETO");
    expect(html).not.toContain("Boleto");
  });

  test("states when the Pix code would appear, and fabricates none", () => {
    const html = marcarPagamento(rascunho);
    expect(html).toContain("O CÓDIGO PIX É GERADO APÓS A CONFIRMAÇÃO DO PEDIDO");
    expect(semTags(html)).not.toContain("QR");
    expect(semTags(html).toLowerCase()).not.toContain("copia e cola");
    expect(html).not.toContain("<svg");
    // No expiry countdown: a timer on a purchase that cannot expire is theatre.
    expect(semTags(html).toLowerCase()).not.toContain("expira");
  });

  test("shows the discounted total against the Pix row, with the badge in índigo", () => {
    const html = marcarPagamento(rascunho);
    expect(html).toContain(resumo.aVistaValor);
    expect(html).toContain('class="t-annotation text-indigo">10% À VISTA NO PIX');
    // The discount is Pix-exclusive here, so the copy never says `ou 1x no cartão`.
    expect(semTags(html)).not.toContain("ou 1x no cartão");
  });

  test("opens the card form only under cartão, with parcelas mandatory", () => {
    const html = marcarPagamento(preenchido({ metodo: "cartao" }));
    expect(html).toContain('id="checkout-cartao-numero"');
    expect(html).toContain('id="checkout-cartao-cpf"');
    expect(html).toContain('id="checkout-parcelas"');
    expect(html).toContain("PARCELAS");

    for (const opcao of opcoesDeParcela(resumo.totalCentavos)) {
      expect(html).toContain(opcao.rotulo);
    }
    expect(opcoesDeParcela(resumo.totalCentavos).length).toBeLessThanOrEqual(10);
  });

  test("carries no disclosure block and no terms checkbox", () => {
    const html = marcarPagamento(rascunho);
    expect(semTags(html)).not.toContain("loja conceito");
    expect(semTags(html)).not.toContain("Nada foi cobrado");
    expect(html).not.toContain('type="checkbox"');
  });

  test("calls the button FINALIZAR PEDIDO — not PAGAR, and not a knowing label", () => {
    const html = marcarPagamento(rascunho);
    expect(html).toContain("FINALIZAR PEDIDO");
    expect(html).not.toContain(">PAGAR<");
    expect(html).not.toContain("SIMULAR");
  });

  test("keeps a blocked CTA in the tab order with its reason attached", () => {
    const html = marcarPagamento(rascunho, "COMPLETE A IDENTIFICAÇÃO PARA CONTINUAR.");
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('aria-describedby="checkout-bloqueio"');
    expect(html).toContain('id="checkout-bloqueio"');
    expect(html).not.toContain("<button disabled");
  });
});

// checkout.md §2 — the beat, and the statement it resolves into
describe("the beat", () => {
  const html = renderToStaticMarkup(<Processando />);

  test("announces itself politely and says only what it is doing", () => {
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("PROCESSANDO O PAGAMENTO");
  });

  test("has no spinner, no progress bar and no percentage", () => {
    expect(html).not.toContain("<svg");
    expect(html).not.toContain("animate-");
    expect(html).not.toContain("progress");
    expect(html).not.toContain("%");
  });
});

describe("the interstitial", () => {
  const html = renderToStaticMarkup(<Intersticio aoVerOPedido={() => {}} />);

  test("states, verbatim, that nothing was charged and nothing left the browser", () => {
    expect(html).toContain(INTERSTICIO_TITULO);
    expect(INTERSTICIO_TITULO).toBe("Nada foi cobrado.");
    expect(html).toContain(INTERSTICIO_PARAGRAFO);
    expect(INTERSTICIO_PARAGRAFO).toContain("nada que você digitou saiu deste navegador");
  });

  test("spends its single Mincho line on the statement", () => {
    expect(html).toContain("t-display-xl");
    expect(html.match(/t-display-/g) ?? []).toHaveLength(1);
  });

  test("carries the eyebrow, the way on, and no chrome of any kind", () => {
    expect(html).toContain("CANTO ZEN");
    expect(html).toContain("VER O PEDIDO");
    expect(html).not.toContain("<footer");
    expect(html).not.toContain("<header");
    expect(html).not.toContain("CNPJ");
  });

  test("spends no índigo and draws no régua", () => {
    expect(html).not.toContain("text-indigo");
    expect(html).not.toContain("absolute inset-x-0 top-[6px] h-px bg-ink");
  });

  test("arrives as a cut — it is mounted, never faded", () => {
    expect(html).not.toContain("transition");
    expect(html).not.toContain("opacity-0");
    expect(html).not.toContain("animate");
  });
});

// checkout.md §10 — the full record, not a stub
describe("the confirmation record", () => {
  const pedido = pedidoDe(checkoutDe(preenchido())!, carrinho, catalogo);
  const html = renderToStaticMarkup(<Conteudo pedido={pedido} />);

  test("leads on its single Mincho line and the honest order number", () => {
    expect(html).toContain("Pedido confirmado");
    expect(html).toContain("PEDIDO Nº 0000 — CONCEITO");
    expect(html.match(/t-display-/g) ?? []).toHaveLength(1);
    // §13, B — an em dash where a number belongs reads as a rendering bug.
    expect(html).not.toContain("Pedido nº —");
  });

  test("is a complete record — peças, prazos, endereço and the total as paid", () => {
    const texto = semTags(html);
    expect(html).toContain("PEÇAS");
    expect(html).toContain("ENTREGA");
    expect(html).toContain("PAGAMENTO");
    expect(texto).toContain("Ana Ribeiro");
    expect(texto).toContain("Rua Augusta, 1412 · apto 92 · Consolação · São Paulo/SP · 01310-100");
    expect(texto).toContain(pedido.pagamento.total);
    for (const linha of pedido.linhas) {
      expect(texto).toContain(linha.nome);
      expect(texto).toContain(linha.disponibilidade);
    }
  });

  test("carries the arrependimento notice, and here the means of exercising it", () => {
    expect(semTags(html)).toContain("Você pode desistir da compra em até 7 dias corridos");
    expect(html).toContain('href="/contato?assunto=arrependimento"');
    expect(html).toContain('href="/politicas/trocas-e-devolucoes"');
    expect(html).toContain("formulário de contato");
  });

  test("keeps §7.1's promise — no QR code, no receipt, no e-mail", () => {
    expect(html).toContain("O CÓDIGO PIX NÃO SERÁ GERADO");
    expect(semTags(html)).not.toContain("QR");
    expect(html).not.toContain("<svg");
    expect(semTags(html).toLowerCase()).not.toContain("e-mail de confirmação");
    expect(semTags(html).toLowerCase()).not.toContain("recibo");
  });

  test("says no card was charged where the method was cartão", () => {
    const comCartao = pedidoDe(
      checkoutDe(
        preenchido({
          metodo: "cartao",
          parcelas: 3,
          cartao: {
            numero: CARTAO_VALIDO,
            nome: "ANA RIBEIRO",
            validade: "12/29",
            cvv: "123",
            cpf: CPF_VALIDO,
          },
        }),
      )!,
      carrinho,
      catalogo,
    );
    const cartao = renderToStaticMarkup(<Conteudo pedido={comCartao} />);

    expect(cartao).toContain("NENHUM CARTÃO FOI COBRADO");
    expect(cartao).not.toContain("O CÓDIGO PIX NÃO SERÁ GERADO");
    // Nothing the reader typed into the card form reaches this surface.
    expect(cartao).not.toContain("4111");
    expect(cartao).not.toContain("123");
  });

  test("never writes `R$ 0,00`, and draws no régua", () => {
    const gratis = pedidoDe(
      checkoutDe(preenchido())!,
      carrinhoCom("guarda-roupa-cais-carvalho"),
      catalogo,
    );
    const html = renderToStaticMarkup(<Conteudo pedido={gratis} />);

    expect(html).toContain("Grátis");
    expect(html).not.toContain("R$ 0,00");
    expect(html).not.toContain("absolute inset-x-0 top-[6px] h-px bg-ink");
  });
});

// A cold arrival has no record, and the freight quote it would need does not exist
describe("the record's preconditions", () => {
  test("a confirmed order always has a quote behind it", () => {
    const semQuote = checkoutDe(preenchido({ cep: "69900000" }));
    expect(semQuote).toBeNull();
    expect(freteDoCheckout("69900000", carrinho, catalogo).estado).toBe("nao-atendida");
  });
});
