import { beforeAll, describe, expect, mock, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";

// The chrome renders on the server, so its markup is observable without a
// browser. What needs one — the panel opening, the accordion, the intent delay
// — is not asserted here: `build-spec.md` leaves interaction to a seam this
// project does not have, and says so.
mock.module("next/navigation", () => ({ usePathname: () => "/" }));

// The font loader is the Next compiler's, not a runtime module; the layout only
// spends its `variable`, so a stand-in is enough to render the document here.
mock.module("next/font/local", () => ({
  default: () => ({ variable: "--fonte-substituta", className: "" }),
}));

let Navbar: typeof import("../components/chrome/navbar").Navbar;
let Rodape: typeof import("../components/chrome/rodape").Rodape;
let RootLayout: typeof import("../app/layout").default;

beforeAll(async () => {
  Navbar = (await import("../components/chrome/navbar")).Navbar;
  Rodape = (await import("../components/chrome/rodape")).Rodape;
  RootLayout = (await import("../app/layout")).default;
});

const semTags = (markup: string) => markup.replace(/<[^>]+>/g, " ");

describe("the document", () => {
  const html = () =>
    renderToStaticMarkup(<RootLayout params={Promise.resolve({})}>{null}</RootLayout>);

  test("declares lang=pt-BR", () => {
    expect(html()).toContain('lang="pt-BR"');
  });

  test("carries no skip link — acessibilidade.md §6 records the omission", () => {
    expect(html()).not.toContain('href="#');
    expect(html().toLowerCase()).not.toContain("pular para");
  });
});

describe("the navbar", () => {
  const html = () => renderToStaticMarkup(<Navbar />);

  // navbar.md §3
  test("opens on one static notice line, and it is not a promotion", () => {
    expect(semTags(html())).toContain(
      "FRETE CALCULADO POR CEP · ATÉ 10X SEM JUROS · PEÇAS SOB ENCOMENDA",
    );
  });

  // navbar.md §2
  test("is one constant height, taken from one token", () => {
    expect(html().match(/h-\[var\(--altura-navbar\)\]/g)?.length).toBe(1);
  });

  // navbar.md §4
  test("signs the page with the wordmark, in Mincho, pointing home", () => {
    expect(html()).toContain('href="/"');
    expect(html()).toContain("t-display-m");
    expect(semTags(html())).toContain("Canto Zen");
  });

  // navbar.md §5
  test("carries the five navigation items and nothing else", () => {
    // Scoped to the bar's own group: `navbar.md` §11 has the mobile panel repeat
    // Sobre, Contato and the policies, which is a different surface.
    const grupo = html().match(/<nav aria-label="Navegação principal"[\s\S]*?<\/nav>/)![0];
    for (const href of ["/sala", "/quarto", "/cozinha", "/escritorio", "/inspiracoes"]) {
      expect(grupo).toContain(`href="${href}"`);
    }
    for (const recusado of ["/sobre", "/contato", "/produtos", "/colecoes"]) {
      expect(grupo).not.toContain(`href="${recusado}"`);
    }
  });

  // navbar.md §6, acessibilidade.md §4
  test("hands every ambiente a panel of its tipos and a way out to the landing", () => {
    const texto = semTags(html());
    expect(texto).toContain("Sofás");
    expect(texto).toContain("Ver tudo em Sala");
    expect(texto).toContain("Ver tudo em Escritório");
    expect(html()).toContain('href="/sala/sofas"');
  });

  test("exposes aria-expanded on each ambiente label, closed at rest", () => {
    expect(html().match(/aria-expanded="false"/g)?.length).toBeGreaterThanOrEqual(4);
    expect(html()).not.toContain('aria-expanded="true"');
  });

  // navbar.md §7
  test("makes the cart a link to /carrinho and never claims (0)", () => {
    const markup = html();
    expect(markup).toContain('href="/carrinho"');
    expect(semTags(markup)).toContain("CARRINHO");
    expect(semTags(markup)).not.toContain("(0)");
  });

  // navbar.md §11
  test("words the mobile trigger MENU", () => {
    expect(semTags(html())).toContain("MENU");
  });

  // navbar.md §§1, 11 — zero icons at every breakpoint
  test("draws nothing: there is no icon in the bar", () => {
    expect(html()).not.toContain("<svg");
    expect(html()).not.toContain("<img");
  });
});

describe("the footer", () => {
  const completo = () => renderToStaticMarkup(<Rodape variante="completo" />);
  const reduzido = () => renderToStaticMarkup(<Rodape variante="reduzido" />);

  // rodape.md §11
  test("is the page's one contentinfo", () => {
    expect(completo().match(/role="contentinfo"/g)?.length).toBe(1);
  });

  // rodape.md §§1, 4
  test("closes the page on the atelier's position, in Mincho", () => {
    expect(semTags(completo())).toContain(
      "Peças feitas sob encomenda em marcenaria própria, em São Paulo.",
    );
  });

  // rodape.md §2 — substantial in text, never in imagery
  test("carries no photograph", () => {
    expect(completo()).not.toContain("<img");
  });

  // rodape.md §§6, 7
  test("titles four zones of its own, Atendimento among them", () => {
    const texto = semTags(completo());
    for (const titulo of ["AMBIENTES", "A MARCA", "AJUDA", "ATENDIMENTO"]) {
      expect(texto).toContain(titulo);
    }
  });

  test("labels each link column by its own title", () => {
    const markup = completo();
    for (const id of ["rodape-ambientes", "rodape-marca", "rodape-ajuda"]) {
      expect(markup).toContain(`aria-labelledby="${id}"`);
      expect(markup).toContain(`id="${id}"`);
    }
  });

  test("names the channel a person is reached through", () => {
    const markup = completo();
    expect(markup).toContain("https://wa.me/");
    expect(markup).toContain('href="tel:');
    expect(markup).toContain('href="mailto:oi@cantozen.com.br"');
    expect(semTags(markup)).toContain("Seg a sex, 9h às 18h");
  });

  // rodape.md §3
  test("identifies the supplier the way the decree expects", () => {
    const texto = semTags(completo());
    expect(texto).toContain("Canto Zen Marcenaria e Comércio de Móveis Ltda.");
    expect(texto).toContain("CNPJ 51.204.876/0001-40");
    expect(texto).toContain("IE 116.482.930.114");
    expect(texto).toContain("Rua Harmonia, 742, Vila Madalena, São Paulo — SP, CEP 05435-000");
  });

  test("discloses that the identification is fictional", () => {
    expect(semTags(completo())).toContain("DADOS DE IDENTIFICAÇÃO FICTÍCIOS — LOJA CONCEITO");
  });

  test("states the seven-day arrependimento inline, with the means of exercising it", () => {
    const markup = completo();
    expect(semTags(markup)).toContain(
      "Você pode desistir da compra em até 7 dias corridos a contar do recebimento",
    );
    expect(markup).toContain('href="/contato?assunto=arrependimento"');
    expect(markup).toContain('href="/politicas/trocas-e-devolucoes"');
  });

  test("closes on the copyright and credits nobody else", () => {
    const texto = semTags(completo());
    expect(texto).toContain("© 2026 Canto Zen · Todos os direitos reservados");
    expect(texto.toLowerCase()).not.toContain("next.js");
  });

  // rodape.md §8
  test("states what the store accepts, in words a screen reader hears", () => {
    const texto = semTags(completo());
    expect(texto).toContain("COMPRA SEGURA");
    for (const meio of ["Pix", "Visa", "Mastercard", "Elo", "American Express", "Boleto"]) {
      expect(texto).toContain(meio);
    }
    expect(texto).toContain("@cantozen");
  });

  test("hides the marks themselves from the accessibility tree", () => {
    const marcas = completo().match(/<svg[^>]*>/g) ?? [];
    expect(marcas.length).toBeGreaterThan(0);
    for (const svg of marcas) expect(svg).toContain('aria-hidden="true"');
  });

  test("shows no third-party credential anywhere", () => {
    const texto = completo().toLowerCase();
    for (const selo of ["reclame aqui", "ebit", "site blindado", "ssl", "pci"]) {
      expect(texto).not.toContain(selo);
    }
  });

  // rodape.md §9
  describe("reduced, on checkout", () => {
    test("drops the closing line, the newsletter and two columns", () => {
      const texto = semTags(reduzido());
      expect(texto).not.toContain("Peças feitas sob encomenda em marcenaria própria");
      expect(texto).not.toContain("AVISO DE NOVAS PEÇAS");
      expect(texto).not.toContain("AMBIENTES");
      expect(texto).not.toContain("A MARCA");
    });

    test("keeps Ajuda, Atendimento, the marks and the whole legal block", () => {
      const texto = semTags(reduzido());
      expect(texto).toContain("AJUDA");
      expect(texto).toContain("ATENDIMENTO");
      expect(texto).toContain("COMPRA SEGURA");
      expect(texto).toContain("CNPJ 51.204.876/0001-40");
      expect(texto).toContain("DADOS DE IDENTIFICAÇÃO FICTÍCIOS — LOJA CONCEITO");
      expect(texto).toContain("Você pode desistir da compra em até 7 dias corridos");
    });

    test("is the same footer with zones withheld, not a second one", () => {
      expect(reduzido().match(/role="contentinfo"/g)?.length).toBe(1);
    });
  });

  // rodape.md §5
  test("captures an e-mail with a labelled field and an LGPD note", () => {
    const markup = completo();
    expect(semTags(markup)).toContain("AVISO DE NOVAS PEÇAS");
    expect(markup).toContain('type="email"');
    expect(markup.toLowerCase()).toContain('autocomplete="email"');
    expect(markup).toContain("<label");
    expect(semTags(markup)).toContain("Enviamos só quando há peça nova.");
    expect(markup).toContain('href="/politicas/privacidade"');
  });
});
