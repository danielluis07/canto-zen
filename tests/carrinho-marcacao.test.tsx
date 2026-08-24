import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { Superficie } from "../components/carrinho/superficie";
import { catalogoDoCarrinho } from "../lib/carrinho/catalogo";
import {
  adicionarAoCarrinho,
  carrinhoVazio,
  definirMontagem,
  lembrarCep,
  type Carrinho,
} from "../lib/carrinho/estado";

// The cart renders from one store, so its markup is observable without a browser
// — the same seam `tests/chrome-marcacao.test.tsx` and `tests/home-marcacao.test.tsx`
// use, with the store standing in for the reader's clicks. What needs a browser
// — the stepper firing, the checkbox toggling, the CEP field reopening — is not
// asserted here: `build-spec.md` leaves interaction to a seam this project does
// not have, and the reasoning behind those controls is already tested below the
// DOM in `tests/carrinho.test.ts`.
//
// What only markup can answer is what this file asserts: the 96px field, the
// contained packshot, the accessible names, the live region, the disabled CTA's
// association with its reason, and the absences the spec authors.

const catalogo = catalogoDoCarrinho();

const LINHA_CRU = "poltrona-lina-linho-cru";
const BOUCLE = "poltrona-lina-boucle-carvalho";
const SEIXO = "mesa-de-centro-seixo-freijo";
const ESGOTADA = "sofa-taipa-couro-argila";
const GRATIS_NACIONAL = "guarda-roupa-cais-carvalho";

const carrinhoCom = (...slugs: string[]): Carrinho =>
  slugs.reduce(
    (carrinho, slug) => adicionarAoCarrinho(carrinho, { slug, montagem: false }),
    carrinhoVazio,
  );

/**
 * The reader's cart, handed straight to the surface — which is why `Superficie`
 * takes it as a prop rather than subscribing: a component that reads the store
 * can only ever be rendered in the store's own state, and this page has three
 * worth asserting.
 */
const marcar = (carrinho: Carrinho): string =>
  renderToStaticMarkup(<Superficie carrinho={carrinho} catalogo={catalogo} />);

const semTags = (markup: string) => markup.replace(/<[^>]+>/g, " ");

// carrinho.md §7 — zero items is a designed surface, not a missing one
describe("an empty cart", () => {
  const html = () => marcar(carrinhoVazio);

  test("states the fact in one line and offers the way on", () => {
    expect(semTags(html())).toContain("Seu carrinho está vazio.");
    expect(html()).toContain("VER TODAS AS PEÇAS →");
    expect(html()).toContain('href="/produtos"');
  });

  test("fabricates nothing — no suggestions, no recovered cart, no resumo", () => {
    const markup = html();
    expect(semTags(markup)).not.toContain("você pode gostar");
    expect(markup).not.toContain("RESUMO");
    expect(markup).not.toContain("FINALIZAR COMPRA");
    expect(markup).not.toContain("R$");
  });

  test("rebuilds neither the mega menu nor the four ambientes in the body", () => {
    const markup = html();
    for (const ambiente of ["/sala", "/quarto", "/cozinha", "/escritorio"]) {
      expect(markup).not.toContain(`href="${ambiente}"`);
    }
  });
});

// carrinho.md §4 — the line
describe("a line", () => {
  const html = () => marcar(carrinhoCom(LINHA_CRU, BOUCLE));

  test("is an <li> in a <ul>, and never a table", () => {
    const markup = html();
    expect(markup).toContain("<ul");
    expect(markup.match(/<li\b/g) ?? []).toHaveLength(2);
    expect(markup).not.toContain("<table");
  });

  test("holds a 96px --kozo field with a contained packshot, never a crop", () => {
    const markup = html();
    expect(markup.match(/relative h-24 w-24 shrink-0 bg-kozo/g) ?? []).toHaveLength(2);
    expect(markup).toContain("object-contain");
    expect(markup).not.toContain("object-cover");
    expect(markup).not.toContain("IMAGEM INDISPONÍVEL");
  });

  test("shows the two poltrona-lina acabamentos as visibly different pictures", () => {
    const markup = html();
    // §4.1's whole argument for the thumbnail: same nome, same medidas, and the
    // photograph is the only thing that catches the wrong finish.
    expect(markup).toContain(catalogo[LINHA_CRU]!.imagem.alt);
    expect(markup).toContain(catalogo[BOUCLE]!.imagem.alt);
    expect(catalogo[LINHA_CRU]!.imagem.src).not.toBe(catalogo[BOUCLE]!.imagem.src);
    expect(semTags(markup)).toContain("LINHO CRU");
    expect(semTags(markup)).toContain("BOUCLÉ CARVALHO");
  });

  test("links each nome to its PDP", () => {
    expect(html()).toContain(`href="/produtos/${LINHA_CRU}"`);
    expect(html()).toContain(`href="/produtos/${BOUCLE}"`);
  });

  test("carries no width in cm — the piece is chosen, so the figure stops helping", () => {
    expect(semTags(html())).not.toMatch(/L \d+ CM/);
  });

  test("steps quantity with two glyphs and a figure, and disables − at 1", () => {
    const markup = html();
    expect(markup).toContain('aria-label="Aumentar quantidade de Poltrona Lina em linho cru"');
    expect(markup).toContain('aria-label="Diminuir quantidade de Poltrona Lina em linho cru"');
    expect(markup.match(/<button[^>]*disabled=""/g) ?? []).toHaveLength(2);
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain('type="number"');
  });

  test("removes with the word, and the word names its piece", () => {
    const markup = html();
    expect(markup.match(/>REMOVER</g) ?? []).toHaveLength(2);
    expect(markup).toContain('aria-label="Remover Poltrona Lina em linho cru"');
    expect(markup).toContain('aria-label="Remover Poltrona Lina em bouclé carvalho"');
  });

  test("announces quantity through one polite live region for the whole list", () => {
    const markup = html();
    expect(markup.match(/aria-live="polite"/g) ?? []).toHaveLength(1);
    expect(markup).toContain('aria-live="polite" class="sr-only"');
  });

  test("toggles montagem inside the row, priced and never justified here", () => {
    const markup = marcar(definirMontagem(carrinhoCom(LINHA_CRU), LINHA_CRU, true));
    expect(markup).toContain('type="checkbox"');
    expect(markup).toContain('checked=""');
    expect(semTags(markup)).toContain("Montagem");
    expect(semTags(markup)).toContain("+ R$ 99,00");
    // The four facts live only on the PDP — §4.3.
    expect(semTags(markup)).not.toContain("SIMPLES");
    expect(semTags(markup)).not.toContain("MIN");
  });

  test("leaves a piece that needs no montagem without the row", () => {
    const markup = marcar(carrinhoCom("luminaria-de-mesa-seixo-ceramica-cru"));
    expect(markup).not.toContain('type="checkbox"');
  });

  test("keeps the lines in the order they were added, and does not group them", () => {
    const markup = marcar(carrinhoCom(LINHA_CRU, SEIXO));
    expect(markup.indexOf("Poltrona Lina")).toBeLessThan(markup.indexOf("Mesa de Centro Seixo"));
    // §4.4 refuses ENVIO IMEDIATO / SOB ENCOMENDA headers over the list: they
    // reorder it underneath a reader in response to an edit they did not make.
    expect(markup).not.toContain("<h3");
  });
});

// carrinho.md §5 — the resumo
describe("the resumo", () => {
  const html = () => marcar(carrinhoCom(LINHA_CRU, SEIXO));

  test("itemises Subtotal → rule → Total, and nothing between them", () => {
    const markup = html();
    const resumo = markup.slice(markup.indexOf("RESUMO"));
    expect(semTags(resumo)).toContain("Subtotal (2 peças)");
    expect(resumo).toContain("<hr");
    expect(semTags(resumo)).toContain("Total");
    // No montagem row and no frete row inside the sum — §§4.3, 5.1, 5.2.
    expect(resumo).not.toContain(">Montagem<");
    expect(resumo).not.toContain(">Frete<");
  });

  test("leads with Total, then à-vista, then parcelamento — the PDP's order", () => {
    const markup = html();
    const total = markup.indexOf("t-price");
    const aVista = markup.indexOf("à vista");
    const parcelas = markup.indexOf("sem juros");
    expect([total, aVista, parcelas]).not.toContain(-1);
    expect(total).toBeLessThan(aVista);
    expect(aVista).toBeLessThan(parcelas);
  });

  test("spends índigo once outside focus rings, on the Pix badge", () => {
    const markup = html();
    expect(markup.match(/(?<![:\w-])text-indigo\b/g) ?? []).toHaveLength(1);
    expect(markup).toContain("10% À VISTA NO PIX");
  });

  test("closes on the arrependimento notice, in prose and not a badge", () => {
    expect(semTags(html())).toContain(
      "Você pode desistir da compra em até 7 dias corridos após receber a peça.",
    );
  });

  test("offers CONTINUAR COMPRANDO as a link, never a second button", () => {
    const markup = html();
    expect(markup).toContain("CONTINUAR COMPRANDO →");
    expect(markup.match(/<button/g) ?? []).not.toContain("CONTINUAR");
    expect(markup).toContain('href="/checkout"');
  });
});

// carrinho.md §§5.2, 8 — freight is stated, never summed
describe("the freight estimate", () => {
  test("with no session CEP the line is the field itself", () => {
    const markup = marcar(carrinhoCom(SEIXO));
    expect(markup).toContain("CALCULE O FRETE");
    expect(markup).toContain('id="carrinho-cep"');
    expect(markup).toContain("CALCULAR");
  });

  test("with one, states one estimate prefixed A PARTIR DE and the way to change it", () => {
    const markup = marcar(lembrarCep(carrinhoCom(SEIXO), "01310100"));
    expect(semTags(markup)).toContain("FRETE ESTIMADO A PARTIR DE R$ ");
    expect(semTags(markup)).toContain("PARA 01310-100");
    expect(markup).toContain("CALCULADO NO CHECKOUT");
    expect(markup).toContain("ALTERAR CEP");
    // The modality choice belongs to the checkout — §5.2.
    expect(markup).not.toContain("Entrega agendada");
  });

  test("writes Grátis, the word, and never R$ 0,00 on a freteGratis piece", () => {
    const markup = marcar(lembrarCep(carrinhoCom(GRATIS_NACIONAL), "01310100"));
    expect(semTags(markup)).toContain("FRETE GRÁTIS PARA 01310-100");
    expect(markup).not.toContain("R$ 0,00");
  });

  test("says how many deliveries only when the prazos actually differ", () => {
    expect(semTags(marcar(carrinhoCom(SEIXO, BOUCLE)))).not.toContain("Sua compra chega");
    expect(semTags(marcar(carrinhoCom(SEIXO, LINHA_CRU)))).toContain(
      "Sua compra chega em duas entregas.",
    );
  });
});

// carrinho.md §6 — a piece that went esgotado after it was added
describe("an esgotado line", () => {
  const html = () => marcar(carrinhoCom(ESGOTADA, SEIXO));

  test("stays, is marked in ink, and takes no colour and no icon", () => {
    const markup = html();
    expect(semTags(markup)).toContain("ESGOTADO · REMOVA PARA CONTINUAR");
    expect(markup).toContain('class="t-annotation mt-rhythm-2 text-ink"');
    expect(markup).not.toContain("<svg");
    expect(markup).not.toContain("opacity-");
  });

  test("disables the CTA with its reason associated by aria-describedby", () => {
    const markup = html();
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('aria-describedby="carrinho-bloqueio"');
    expect(markup).toContain('id="carrinho-bloqueio"');
    expect(semTags(markup)).toContain("REMOVA AS PEÇAS ESGOTADAS PARA CONTINUAR.");
    // The CTA is a button now, so it cannot navigate — and the checkout link is
    // gone from the document rather than merely styled as unavailable.
    expect(markup).not.toContain('href="/checkout"');
  });

  test("still counts its price in the sum", () => {
    // Silently excluding it produces the "why is my total different from what I
    // saw?" defect, which is worse than a blocked button that says why.
    expect(semTags(html())).toContain("Subtotal (2 peças)");
  });
});

// carrinho.md §2 — the first authored absence in the system
describe("the page's absences", () => {
  test("carries no régua, on either state", () => {
    for (const markup of [marcar(carrinhoVazio), marcar(carrinhoCom(LINHA_CRU, SEIXO))]) {
      expect(markup).not.toContain("absolute inset-x-0 top-[6px] h-px bg-ink");
      expect(markup).not.toContain('class="relative flex h-[13px] items-center"');
    }
  });

  test("opens on CARRINHO alone — no count, no subtitle, no breadcrumb", () => {
    const markup = marcar(carrinhoCom(LINHA_CRU, SEIXO));
    expect(markup).toContain('<h1 class="t-annotation text-ink">CARRINHO</h1>');
    expect(markup).not.toContain("t-display");
    expect(markup).not.toContain("<nav");
  });

  test("removes as a cut: no exit transition, and no undo", () => {
    const markup = marcar(carrinhoCom(LINHA_CRU, SEIXO));
    expect(markup).not.toContain("transition-");
    expect(markup).not.toContain("animate-");
    expect(semTags(markup)).not.toContain("Desfazer");
  });

  test("offers no coupon field and no cross-sell", () => {
    const markup = marcar(carrinhoCom(LINHA_CRU, SEIXO));
    expect(semTags(markup).toLowerCase()).not.toContain("cupom");
    expect(semTags(markup).toLowerCase()).not.toContain("complete seu ambiente");
  });
});
