import { describe, expect, test } from "bun:test";
// Seam 1 — `build-spec.md` §Seam 2 names cart mutation as one of the three
// things pulled below the DOM precisely so it can be asserted here. Every rule
// `carrinho.md` §§4–9 states about a line, a figure or a group is a function
// call in this file; what is left in the components is wiring.
import { politicas, precoAVista, precoMontagem, reais } from "../lib/catalogo";
import {
  adicionarAoCarrinho,
  aumentarQuantidade,
  carrinhoVazio,
  definirMontagem,
  diminuirQuantidade,
  lembrarCep,
  quantidadeTotal,
  removerDoCarrinho,
  type Carrinho,
} from "../lib/carrinho/estado";
import { catalogoDoCarrinho } from "../lib/carrinho/catalogo";
import {
  anuncioDeQuantidade,
  BLOQUEIO,
  estimarFrete,
  grupoDeEntrega,
  linhasDoCarrinho,
  nomeCompleto,
  resumoDoPedido,
} from "../lib/carrinho/conteudo";

const catalogo = catalogoDoCarrinho();

const exigirPeca = (slug: string) => {
  const peca = catalogo[slug];
  if (!peca) throw new Error(`no such peça in the cart's catálogo: ${slug}`);
  return peca;
};

// The família whose two acabamentos share a nome and differ only in a line of
// annotation and a photograph — §4.1's whole argument for the thumbnail.
const LINHA_CRU = "poltrona-lina-linho-cru";
const BOUCLE = "poltrona-lina-boucle-carvalho";
// `envio-imediato`, so it groups apart from a sob-encomenda line (§§4.4, 5.3).
const SEIXO = "mesa-de-centro-seixo-freijo";
// `esgotado`, and its família holds a piece the reader can still buy (§6).
const ESGOTADA = "sofa-taipa-couro-argila";
// `necessaria: false` — the montagem row does not render (§4.3).
const LUMINARIA = "luminaria-de-mesa-seixo-ceramica-cru";
// `freteGratis: "nacional"`, which is what makes `Grátis` reachable (§5.2).
const GRATIS_NACIONAL = "guarda-roupa-cais-carvalho";

const PAULISTA = "01310100";
const RIO_BRANCO = "69900000";

const carrinhoCom = (...slugs: string[]): Carrinho =>
  slugs.reduce(
    (carrinho, slug) => adicionarAoCarrinho(carrinho, { slug, montagem: false }),
    carrinhoVazio,
  );

const linhaDe = (carrinho: Carrinho, slug: string) => {
  const linha = linhasDoCarrinho(carrinho, catalogo).find((l) => l.slug === slug);
  if (!linha) throw new Error(`the cart holds no line for ${slug}`);
  return linha;
};

// ---------------------------------------------------------------------------
// carrinho.md §9 — the shape, and what may happen to it
// ---------------------------------------------------------------------------

describe("the cart's mutations", () => {
  test("adding a slug already present increments its line, never appending a second", () => {
    const duas = adicionarAoCarrinho(carrinhoCom(LINHA_CRU), {
      slug: LINHA_CRU,
      montagem: false,
    });
    expect(duas.itens).toHaveLength(1);
    expect(duas.itens[0]!.quantidade).toBe(2);
    expect(quantidadeTotal(duas)).toBe(2);
  });

  test("two acabamentos of one família stay two lines", () => {
    const carrinho = carrinhoCom(LINHA_CRU, BOUCLE);
    expect(carrinho.itens.map((item) => item.slug)).toEqual([LINHA_CRU, BOUCLE]);
  });

  test("the stepper's − floors at 1: removal is a word, not a decrement", () => {
    const ainda = diminuirQuantidade(carrinhoCom(LINHA_CRU), LINHA_CRU);
    expect(ainda.itens).toHaveLength(1);
    expect(ainda.itens[0]!.quantidade).toBe(1);
  });

  test("the stepper's + has no ceiling", () => {
    const cinco = [1, 2, 3, 4].reduce(
      (carrinho) => aumentarQuantidade(carrinho, LINHA_CRU),
      carrinhoCom(LINHA_CRU),
    );
    expect(cinco.itens[0]!.quantidade).toBe(5);
  });

  test("removal is explicit, and takes the whole line however large", () => {
    const carrinho = aumentarQuantidade(carrinhoCom(LINHA_CRU, BOUCLE), LINHA_CRU);
    const restante = removerDoCarrinho(carrinho, LINHA_CRU);
    expect(restante.itens.map((item) => item.slug)).toEqual([BOUCLE]);
  });

  test("montagem is toggleable per line, and only that line moves", () => {
    const carrinho = definirMontagem(carrinhoCom(LINHA_CRU, BOUCLE), LINHA_CRU, true);
    expect(carrinho.itens.map((item) => item.montagem)).toEqual([true, false]);
  });

  test("insertion order survives every edit — §4.1's lines never reorder", () => {
    const carrinho = definirMontagem(
      diminuirQuantidade(aumentarQuantidade(carrinhoCom(LINHA_CRU, SEIXO, BOUCLE), SEIXO), SEIXO),
      BOUCLE,
      true,
    );
    expect(carrinho.itens.map((item) => item.slug)).toEqual([LINHA_CRU, SEIXO, BOUCLE]);
  });

  test("the session CEP is the bare eight digits, and a typo is not remembered", () => {
    expect(lembrarCep(carrinhoVazio, "01310-100").cep).toBe(PAULISTA);
    expect(lembrarCep(carrinhoVazio, "013101").cep).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// carrinho.md §4 — the line
// ---------------------------------------------------------------------------

describe("a line", () => {
  test("carries its principal packshot, and the two acabamentos differ", () => {
    const cru = linhaDe(carrinhoCom(LINHA_CRU), LINHA_CRU);
    const boucle = linhaDe(carrinhoCom(BOUCLE), BOUCLE);

    expect(cru.imagem.src).toBe(exigirPeca(LINHA_CRU).imagem.src);
    // §4.1's argument for showing an image at all: buying the wrong acabamento
    // is the highest-frequency error this data shape makes possible, and the
    // thumbnail only catches it if the two are visibly different.
    expect(boucle.imagem.src).not.toBe(cru.imagem.src);
    expect(boucle.imagem.alt).not.toBe(cru.imagem.alt);
  });

  test("links its nome to the PDP — the cart confirms a piece, never introduces one", () => {
    expect(linhaDe(carrinhoCom(LINHA_CRU), LINHA_CRU).href).toBe(`/produtos/${LINHA_CRU}`);
  });

  test("prices the piece as precoTabela × quantidade", () => {
    const carrinho = aumentarQuantidade(carrinhoCom(LINHA_CRU), LINHA_CRU);
    expect(linhaDe(carrinho, LINHA_CRU).preco).toBe(reais(exigirPeca(LINHA_CRU).precoTabela * 2));
  });

  test("states disponibilidade in §4.4's words, and the esgotado line says what to do", () => {
    expect(linhaDe(carrinhoCom(SEIXO), SEIXO).disponibilidade).toBe("ENVIO IMEDIATO");
    expect(linhaDe(carrinhoCom(LINHA_CRU), LINHA_CRU).disponibilidade).toBe(
      `SOB ENCOMENDA · PRODUÇÃO DE ${exigirPeca(LINHA_CRU).prazoProducaoSemanas} SEMANAS`,
    );
    expect(linhaDe(carrinhoCom(ESGOTADA), ESGOTADA).disponibilidade).toBe(
      "ESGOTADO · REMOVA PARA CONTINUAR",
    );
  });

  test("offers the família's available sibling only on an esgotado line", () => {
    // All three esgotado peças are the only acabamento of their família, so the
    // link is `null` on every line this catálogo can currently produce — the
    // same absence the PDP shows, and §6's condition rather than a defect.
    expect(linhaDe(carrinhoCom(ESGOTADA), ESGOTADA).irmao).toBeNull();
    expect(linhaDe(carrinhoCom(LINHA_CRU), LINHA_CRU).irmao).toBeNull();

    // The branch itself, against a família that does hold one: the line carries
    // the link through verbatim, exactly as the PDP composes it.
    const irmao = { rotulo: "VER SOFÁ TAIPA EM LINHO CRU", href: "/produtos/sofa-taipa-linho-cru" };
    const linha = linhasDoCarrinho(carrinhoCom(ESGOTADA), {
      ...catalogo,
      [ESGOTADA]: { ...exigirPeca(ESGOTADA), irmao },
    })[0];
    expect(linha!.irmao).toEqual(irmao);
  });

  test("renders no montagem row for a peça that needs none", () => {
    expect(linhaDe(carrinhoCom(LUMINARIA), LUMINARIA).montagem).toBeNull();
  });

  test("derives the montagem price from nivel × quantidade, never storing it", () => {
    const peca = exigirPeca(LINHA_CRU);
    const carrinho = definirMontagem(
      aumentarQuantidade(carrinhoCom(LINHA_CRU), LINHA_CRU),
      LINHA_CRU,
      true,
    );
    const linha = linhaDe(carrinho, LINHA_CRU);
    expect(linha.montagem?.contratada).toBe(true);
    expect(linha.montagem?.preco).toBe(`+ ${reais(precoMontagem(peca.montagem.nivel) * 2)}`);
    expect(linha.montagem?.preco).toBe(`+ ${reais(politicas.montagemCentavos.simples * 2)}`);
  });

  test("states the montagem price whether or not it is contracted", () => {
    expect(linhaDe(carrinhoCom(LINHA_CRU), LINHA_CRU).montagem).toEqual({
      contratada: false,
      rotulo: "Montagem",
      preco: `+ ${reais(precoMontagem("simples"))}`,
    });
  });

  test("disables − at quantidade 1 and enables it above", () => {
    expect(linhaDe(carrinhoCom(LINHA_CRU), LINHA_CRU).podeDiminuir).toBe(false);
    expect(
      linhaDe(aumentarQuantidade(carrinhoCom(LINHA_CRU), LINHA_CRU), LINHA_CRU).podeDiminuir,
    ).toBe(true);
  });

  test("drops a slug the catálogo no longer knows rather than inventing a line", () => {
    const carrinho = adicionarAoCarrinho(carrinhoCom(LINHA_CRU), {
      slug: "peca-que-nao-existe",
      montagem: false,
    });
    expect(linhasDoCarrinho(carrinho, catalogo).map((linha) => linha.slug)).toEqual([LINHA_CRU]);
  });
});

// carrinho.md §10 — the accessible names
describe("what a control says out loud", () => {
  test("REMOVER names its piece and its acabamento", () => {
    expect(linhaDe(carrinhoCom(LINHA_CRU), LINHA_CRU).rotuloRemover).toBe(
      "Remover Poltrona Lina em linho cru",
    );
    // The reason the acabamento is in the name: the two lines are otherwise a
    // pair of identical buttons.
    expect(linhaDe(carrinhoCom(BOUCLE), BOUCLE).rotuloRemover).toBe(
      "Remover Poltrona Lina em bouclé carvalho",
    );
  });

  test("both stepper glyphs name their piece", () => {
    const linha = linhaDe(carrinhoCom(LINHA_CRU), LINHA_CRU);
    expect(linha.rotuloAumentar).toBe("Aumentar quantidade de Poltrona Lina em linho cru");
    expect(linha.rotuloDiminuir).toBe("Diminuir quantidade de Poltrona Lina em linho cru");
  });

  test("a quantity change announces the piece and its new quantidade", () => {
    const linha = linhaDe(carrinhoCom(LINHA_CRU), LINHA_CRU);
    expect(anuncioDeQuantidade(linha, 3)).toBe("Poltrona Lina em linho cru: quantidade 3");
    expect(nomeCompleto(exigirPeca(LINHA_CRU))).toBe("Poltrona Lina em linho cru");
  });
});

// ---------------------------------------------------------------------------
// carrinho.md §5 — the resumo, every figure of it derived
// ---------------------------------------------------------------------------

describe("the resumo", () => {
  test("counts peças, not lines, and states the count exactly once", () => {
    const carrinho = aumentarQuantidade(carrinhoCom(LINHA_CRU, SEIXO), LINHA_CRU);
    expect(resumoDoPedido(carrinho, catalogo).subtotalRotulo).toBe("Subtotal (3 peças)");
    expect(resumoDoPedido(carrinhoCom(LINHA_CRU), catalogo).subtotalRotulo).toBe(
      "Subtotal (1 peça)",
    );
  });

  test("sums the pieces and the montagem contracted on them", () => {
    const lina = exigirPeca(LINHA_CRU);
    const seixo = exigirPeca(SEIXO);
    const carrinho = definirMontagem(carrinhoCom(LINHA_CRU, SEIXO), LINHA_CRU, true);
    const esperado = lina.precoTabela + seixo.precoTabela + precoMontagem(lina.montagem.nivel);

    const resumo = resumoDoPedido(carrinho, catalogo);
    expect(resumo.subtotal).toBe(reais(esperado));
    // §5.1 — Subtotal → rule → Total, and nothing between them: no montagem row
    // (it is inside the line) and no frete row (it is outside the arithmetic).
    expect(resumo.total).toBe(resumo.subtotal);
  });

  test("derives à-vista and the Pix badge from politicas, against the cart total", () => {
    const carrinho = carrinhoCom(LINHA_CRU, SEIXO);
    const total = exigirPeca(LINHA_CRU).precoTabela + exigirPeca(SEIXO).precoTabela;
    const resumo = resumoDoPedido(carrinho, catalogo);

    expect(resumo.aVista).toBe(`${reais(precoAVista(total))} à vista`);
    expect(resumo.pix).toBe(`${politicas.descontoPixPercent}% À VISTA NO PIX`);
  });

  test("derives parcelamento against the cart total, not per piece", () => {
    const uma = resumoDoPedido(carrinhoCom(SEIXO), catalogo);
    const duas = resumoDoPedido(carrinhoCom(SEIXO, LINHA_CRU), catalogo);
    // Both quote the policy maximum, and the parcela of the larger cart is
    // larger — which is only true if the split is taken over the sum.
    expect(uma.parcelamento).toContain(`${politicas.parcelasMax}x de `);
    expect(duas.parcelamento).toContain(`${politicas.parcelasMax}x de `);
    expect(duas.parcelamento).not.toBe(uma.parcelamento);
  });

  test("keeps an esgotado line in the sum and blocks the CTA with its reason", () => {
    const resumo = resumoDoPedido(carrinhoCom(ESGOTADA, SEIXO), catalogo);
    const total = exigirPeca(ESGOTADA).precoTabela + exigirPeca(SEIXO).precoTabela;

    expect(resumo.total).toBe(reais(total));
    expect(resumo.bloqueio).toBe(BLOQUEIO);
    expect(resumoDoPedido(carrinhoCom(SEIXO), catalogo).bloqueio).toBeNull();
  });

  test("adds the montagem clause to the arrependimento only when one is contracted", () => {
    expect(resumoDoPedido(carrinhoCom(LINHA_CRU), catalogo).arrependimento).toBe(
      "Você pode desistir da compra em até 7 dias corridos após receber a peça.",
    );
    expect(
      resumoDoPedido(definirMontagem(carrinhoCom(LINHA_CRU), LINHA_CRU, true), catalogo)
        .arrependimento,
    ).toBe(
      "Você pode desistir da compra em até 7 dias corridos após receber a peça — ou após a montagem, quando contratada.",
    );
  });
});

// carrinho.md §§4.4, 5.3 — the groups are counted, never drawn
describe("delivery groups", () => {
  test("a shared prazo is one group, and one group states nothing", () => {
    expect(resumoDoPedido(carrinhoCom(SEIXO, BOUCLE), catalogo).entregas).toBeNull();
    expect(grupoDeEntrega(exigirPeca(SEIXO))).toBe(grupoDeEntrega(exigirPeca(BOUCLE))!);
  });

  test("pieces that ship separately split into more than one, and the resumo says so", () => {
    expect(resumoDoPedido(carrinhoCom(SEIXO, LINHA_CRU), catalogo).entregas).toBe(
      "Sua compra chega em duas entregas.",
    );
  });

  test("two production windows are two groups, not one sob-encomenda bucket", () => {
    const outra = Object.values(catalogo).find(
      (peca) =>
        peca.disponibilidade === "sob-encomenda" &&
        peca.prazoProducaoSemanas !== exigirPeca(LINHA_CRU).prazoProducaoSemanas,
    );
    expect(outra).toBeDefined();
    expect(resumoDoPedido(carrinhoCom(SEIXO, LINHA_CRU, outra!.slug), catalogo).entregas).toBe(
      "Sua compra chega em três entregas.",
    );
  });

  test("an esgotado piece joins no group — it blocks the order rather than arriving", () => {
    expect(grupoDeEntrega(exigirPeca(ESGOTADA))).toBeNull();
    expect(resumoDoPedido(carrinhoCom(SEIXO, ESGOTADA), catalogo).entregas).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// carrinho.md §§5.2, 8 — freight is stated, never summed into the total
// ---------------------------------------------------------------------------

describe("the freight estimate", () => {
  test("with no session CEP the line becomes the field", () => {
    expect(estimarFrete(carrinhoCom(LINHA_CRU), catalogo)).toEqual({ estado: "sem-cep" });
  });

  test("quotes one figure, prefixed A PARTIR DE, for the session CEP", () => {
    const carrinho = lembrarCep(carrinhoCom(LINHA_CRU), PAULISTA);
    const estimativa = estimarFrete(carrinho, catalogo);
    expect(estimativa.estado).toBe("estimado");
    expect(estimativa.estado === "estimado" && estimativa.linha).toStartWith(
      "FRETE ESTIMADO A PARTIR DE R$ ",
    );
    expect(estimativa.estado === "estimado" && estimativa.linha).toEndWith(" PARA 01310-100");
  });

  test("scales with quantidade — two boxes are two freights", () => {
    const uma = estimarFrete(lembrarCep(carrinhoCom(LINHA_CRU), PAULISTA), catalogo);
    const duas = estimarFrete(
      lembrarCep(aumentarQuantidade(carrinhoCom(LINHA_CRU), LINHA_CRU), PAULISTA),
      catalogo,
    );
    expect(uma.estado === "estimado" && duas.estado === "estimado" && duas.linha).not.toBe(
      uma.estado === "estimado" && uma.linha,
    );
  });

  test("writes Grátis, the word, and never R$ 0,00", () => {
    const carrinho = lembrarCep(carrinhoCom(GRATIS_NACIONAL), PAULISTA);
    const estimativa = estimarFrete(carrinho, catalogo);
    expect(estimativa.estado === "estimado" && estimativa.linha).toBe(
      "FRETE GRÁTIS PARA 01310-100",
    );
    expect(estimativa.estado === "estimado" && estimativa.linha).not.toContain("R$ 0,00");
  });

  test("a part-covered cart quotes the paying line rather than claiming Grátis", () => {
    const carrinho = lembrarCep(carrinhoCom(GRATIS_NACIONAL, SEIXO), PAULISTA);
    const estimativa = estimarFrete(carrinho, catalogo);
    expect(estimativa.estado === "estimado" && estimativa.linha).toStartWith(
      "FRETE ESTIMADO A PARTIR DE R$ ",
    );
  });

  test("an unserved CEP is a Fato with the way on, never an invalid field", () => {
    const estimativa = estimarFrete(lembrarCep(carrinhoCom(SEIXO), RIO_BRANCO), catalogo);
    expect(estimativa).toEqual({
      estado: "nao-atendida",
      cep: "69900-000",
      mensagem: "Ainda não entregamos neste CEP.",
      saibaMais: "/politicas/entrega-e-frete",
    });
  });

  test("stays outside the arithmetic — the total is the same with a CEP and without", () => {
    const sem = resumoDoPedido(carrinhoCom(SEIXO), catalogo);
    const com = resumoDoPedido(lembrarCep(carrinhoCom(SEIXO), PAULISTA), catalogo);
    expect(com.total).toBe(sem.total);
    expect(com.subtotal).toBe(sem.subtotal);
  });
});

// ---------------------------------------------------------------------------
// carrinho.md §7 — zero items is a designed surface
// ---------------------------------------------------------------------------

describe("an empty cart", () => {
  test("has no lines and no count to annotate", () => {
    expect(linhasDoCarrinho(carrinhoVazio, catalogo)).toEqual([]);
    expect(quantidadeTotal(carrinhoVazio)).toBe(0);
  });
});
