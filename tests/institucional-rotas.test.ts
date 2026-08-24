import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { loja } from "../lib/catalogo";
import { DECLARACOES, METADADOS_DE_SOBRE, ROTULO_DA_REGUA } from "../lib/institucional/sobre";
import { RESOLUCAO, showroom } from "../lib/institucional/contato";
import {
  LINHA_DE_LOJA_CONCEITO,
  documentoDePolitica,
  slugsDePoliticas,
} from "../lib/institucional/politicas";
import { buscar, encerrarServidor, semScripts, servidorDeTeste } from "./helpers/servidor";

// Seam 2 — the institutional lane as the document the server actually sends.
//
// `build-spec.md`'s Testing Decisions names this suite's job precisely: **copy
// that is a commitment rather than direction**. The five `/sobre` statements and
// the §11b statutory openers are asserted here, verbatim, because these are the
// places where a paraphrase is a defect and a component test would assert the
// one thing that cannot go wrong while missing the thing that can.
beforeAll(async () => {
  await servidorDeTeste();
}, 300_000);

afterAll(encerrarServidor);

// institucional.md §§1–7
describe("/sobre", () => {
  let html = "";

  beforeAll(async () => {
    const resposta = await buscar("/sobre");
    expect(resposta.status).toBe(200);
    html = semScripts(resposta.html);
  });

  // The one assertion this ticket exists for. Five statements, in order, as
  // §3 wrote them — the copy *is* the structure on this page.
  test("carries the five statements verbatim, in order", () => {
    let posicao = -1;
    for (const declaracao of DECLARACOES) {
      const encontrada = html.indexOf(declaracao.titulo);
      expect({ titulo: declaracao.titulo, presente: encontrada !== -1 }).toEqual({
        titulo: declaracao.titulo,
        presente: true,
      });
      expect(encontrada).toBeGreaterThan(posicao);
      posicao = encontrada;
      expect(html).toContain(declaracao.corpo);
    }
  });

  // §2 and §13 — there is no page title, so the first statement is the `<h1>`:
  // the page's structural heading and its first argument are the same string,
  // which is what the registered five-Mincho exception pays for.
  test("has no page title — its first statement is the h1", () => {
    expect(html).toMatch(new RegExp(`<h1 class="t-display-l[^"]*">${DECLARACOES[0].titulo}</h1>`));
    expect(html).not.toContain(">Sobre nós<");
    expect((html.match(/<h1/g) ?? []).length).toBe(1);
  });

  // rotas.md §1 — the document title does not inherit the page's absence. A
  // browser tab reading `Não temos estoque.` is the manifesto leaking into
  // chrome.
  test("still names itself in the tab, and describes itself in its own copy", () => {
    expect(html).toContain(`<title>${METADADOS_DE_SOBRE.titulo} | Canto Zen</title>`);
    expect(html).toContain(`content="${METADADOS_DE_SOBRE.descricao}"`);
  });

  // §5 — exactly one régua, closing the page, carrying a real figure.
  test("closes on exactly one régua reading DESDE 2014", () => {
    expect(html).toContain(ROTULO_DA_REGUA);
    // The régua's own container, not its two end ticks, which carry the same
    // 13px and would triple the count.
    expect((html.match(/h-\[13px\] items-center/g) ?? []).length).toBe(1);
  });

  // §6 — no `VER PEÇAS`, no link to a room, no link to `/contato`. The régua,
  // and then the footer. A manifesto that ends in a button sells the argument
  // it just made.
  test("ends without a CTA of its own", () => {
    const corpo = html.slice(html.indexOf("<main"), html.indexOf("<footer"));
    expect(corpo).not.toContain("VER PEÇAS");
    expect(corpo).not.toContain("<button");
    expect(corpo).not.toContain('href="/contato"');
    expect(corpo).not.toContain('href="/produtos"');
  });

  // §4 — the third authored absence, on the store's most photography-led site.
  test("carries no photograph", () => {
    const corpo = html.slice(html.indexOf("<main"), html.indexOf("<footer"));
    expect(corpo).not.toContain("<img");
    expect(corpo).not.toContain("images.unsplash.com");
  });

  // §7 — the store declines to fabricate credentials, twice over.
  test("names no founder and lists no designer", () => {
    const corpo = html.slice(html.indexOf("<main"), html.indexOf("<footer"));
    for (const palavra of ["Fundador", "fundador", "Designers", "Nossa equipe"]) {
      expect({ palavra, presente: corpo.includes(palavra) }).toEqual({ palavra, presente: false });
    }
  });
});

// institucional.md §§8–10
describe("/contato", () => {
  let html = "";

  beforeAll(async () => {
    const resposta = await buscar("/contato");
    expect(resposta.status).toBe(200);
    html = semScripts(resposta.html);
  });

  test("is a three-field form under the page's one Mincho title", () => {
    expect(html).toContain(`<title>Contato | Canto Zen</title>`);
    expect(html).toContain('<h1 class="t-display-l text-ink">Contato</h1>');
    for (const campo of ["nome", "email", "mensagem"]) {
      expect(html).toContain(`id="${campo}"`);
    }
    expect(html).toContain('rows="6"');
    expect(html).toContain("ENVIAR MENSAGEM");
  });

  // §9 — no *assunto* select, because it would route to inboxes that do not
  // exist, and no telefone, a field the store cannot act on.
  test("offers no assunto select and no telefone field", () => {
    expect(html).not.toContain("<select");
    expect(html).not.toContain('id="telefone"');
    expect(html).not.toContain('id="assunto"');
  });

  // §8 — the footer already carries the channel, and on a page this short it is
  // on screen anyway. Repeating them would make `/contato` a page that mostly
  // quotes its own footer, so the channels appear once: in the footer.
  test("omits the channels, which appear only in the footer", () => {
    const corpo = html.slice(html.indexOf("<main"), html.indexOf("<footer"));
    expect(corpo).not.toContain(loja.atendimento.whatsapp);
    expect(corpo).not.toContain(loja.atendimento.telefone);
    expect(corpo).not.toContain(loja.atendimento.horario);
    expect(html.slice(html.indexOf("<footer"))).toContain(loja.atendimento.telefone);
  });

  // §10 — stated as real, with its own hours, and no embedded map.
  test("states the showroom with its hours and links out instead of embedding", () => {
    const espaco = showroom();
    for (const linha of espaco.endereco) expect(html).toContain(linha);
    expect(html).toContain(espaco.horario);
    expect(html).toContain(espaco.nota);
    expect(html).toContain("VER NO MAPA");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("google.com/maps/embed");
  });

  // §§4, 5 — no photograph, and no régua: `marca.md` §2 excludes forms outright.
  test("carries no photograph and no régua", () => {
    const corpo = html.slice(html.indexOf("<main"), html.indexOf("<footer"));
    expect(corpo).not.toContain("<img");
    expect(corpo).not.toContain("h-[13px]");
  });

  // §9 — the resolution is a swap the reader triggers, so the statement is not
  // in the document the server sends. Shipping it in the markup would be the
  // page telling a reader who has not submitted that nothing was sent.
  test("does not ship the resolution statement before anything is submitted", () => {
    expect(html).not.toContain(RESOLUCAO.titulo);
  });
});

// §9 — the store aims this link; the reader operates no control to reach it.
describe("/contato?assunto=arrependimento", () => {
  let html = "";

  beforeAll(async () => {
    const resposta = await buscar("/contato?assunto=arrependimento");
    expect(resposta.status).toBe(200);
    html = semScripts(resposta.html);
  });

  // Decreto 7.962 art. 5º §1: the contract is concluded on the site, so the
  // site is the *mesma ferramenta*, and with auth out of scope this form is the
  // only in-site tool there is.
  test("aims the page at withdrawal, and pre-fills the message", () => {
    expect(html).toContain("PEDIDO DE ARREPENDIMENTO");
    expect(html).toContain("Quero desistir da compra nº ");
    // Still no select — the aim is a link, not a control.
    expect(html).not.toContain("<select");
  });

  test("is the target the footer's arrependimento notice already points at", async () => {
    expect(html).toContain('href="/contato?assunto=arrependimento"');
  });

  // Unrecognised or absent `assunto` renders the plain form. No other value
  // exists, so an invented one is not a second page.
  test("renders the plain form for any other value", async () => {
    const outro = semScripts((await buscar("/contato?assunto=defeito")).html);
    expect(outro).not.toContain("PEDIDO DE ARREPENDIMENTO");
    expect(outro).not.toContain("Quero desistir da compra");
  });
});

// institucional.md §§11, 11b
describe("the policy template", () => {
  test("is exactly four slugs, all 200", async () => {
    for (const slug of slugsDePoliticas()) {
      const resposta = await buscar(`/politicas/${slug}`);
      expect({ slug, status: resposta.status }).toEqual({ slug, status: 200 });
    }
  });

  // rotas.md and build-spec's status contract. `prazos-e-entrega` is a live
  // inbound link in the wild, so it has to land on the store's own 404 rather
  // than on Next's bare error document.
  test("answers /politicas/prazos-e-entrega with a real 404 and the store's chrome", async () => {
    const resposta = await buscar("/politicas/prazos-e-entrega");
    expect(resposta.status).toBe(404);
    expect(resposta.html).toContain('lang="pt-BR"');
    expect(resposta.html).toContain("Não há nada neste endereço.");
    expect(resposta.html).toContain(loja.cnpj);
  });

  test("answers any other invented slug the same way", async () => {
    expect((await buscar("/politicas/garantia")).status).toBe(404);
    expect((await buscar("/politicas")).status).toBe(404);
  });

  test("renders the title, the date, the index and the document", async () => {
    for (const slug of slugsDePoliticas()) {
      const html = semScripts((await buscar(`/politicas/${slug}`)).html);
      const documento = documentoDePolitica(slug);

      expect(html).toContain(`<title>${documento.titulo} | Canto Zen</title>`);
      expect(html).toMatch(new RegExp(`<h1 class="t-display-l[^"]*">${documento.titulo}</h1>`));
      expect(html).toContain("ÚLTIMA ATUALIZAÇÃO — 12 DE MARÇO DE 2026");
      expect(html).toContain(LINHA_DE_LOJA_CONCEITO);

      // §11 — the index is a `<nav>` with an accessible name, non-sticky, whose
      // anchors target real `id`s on the section headings. The navbar above is
      // sticky and always will be, so the assertion reads the index's own tag.
      const indice = html.match(/<nav[^>]*aria-labelledby="indice-da-politica"[^>]*>/)?.[0];
      expect(indice).toBeDefined();
      expect(indice).not.toContain("sticky");
      for (const secao of documento.secoes) {
        expect(html).toContain(`href="#${secao.id}"`);
        expect(html).toContain(`id="${secao.id}"`);
        expect(html).toContain(secao.titulo);
      }
    }
  });

  // §11 — an accordion would hide legally required text behind a click, which
  // is the opposite of the *ostensive* standard Decreto 7.962 art. 5º sets.
  test("hides nothing behind a click, and carries no photograph and no régua", async () => {
    for (const slug of slugsDePoliticas()) {
      const html = semScripts((await buscar(`/politicas/${slug}`)).html);
      expect(html).not.toContain("<details");
      expect(html).not.toContain("<summary");
      const corpo = html.slice(html.indexOf("<main"), html.indexOf("<footer"));
      expect(corpo).not.toContain("<img");
      expect(corpo).not.toContain("h-[13px]");
    }
  });

  // §11 — the four documents do not share a heading skeleton, and the layout
  // does not flatten them into one.
  test("gives each of the four its own headings", async () => {
    const esqueletos: string[] = [];
    for (const slug of slugsDePoliticas()) {
      const html = semScripts((await buscar(`/politicas/${slug}`)).html);
      const ids = [...html.matchAll(/href="#([a-z-]+)"/g)].map((m) => m[1]);
      esqueletos.push(ids.join("|"));
    }
    expect(new Set(esqueletos).size).toBe(4);
  });
});

// §11b — the statutory copy, as the server sends it. `build-spec.md` names this
// among the places where a paraphrase is a defect, which is why the sentences
// are written out here rather than read from the module under test.
describe("the statutory wording", () => {
  const pagina = async (slug: string) =>
    semScripts((await buscar(`/politicas/${slug}`)).html);

  test("opens each document on §11b's verified first sentence", async () => {
    const aberturas: Record<string, string> = {
      "trocas-e-devolucoes":
        "Você pode desistir de uma compra feita no site da Canto Zen em até 7 dias corridos, contados do recebimento da peça.",
      "entrega-e-frete":
        "O frete da Canto Zen é calculado pelo seu CEP, e o prazo de entrega começa a contar da confirmação do pagamento — não do pedido.",
      privacidade:
        "A Canto Zen trata seus dados pessoais para uma coisa só: concluir a compra que você pediu — nome, CPF, e-mail, celular e endereço.",
      "termos-de-uso":
        "Estes termos valem para o uso do site da Canto Zen e para a compra das peças oferecidas nele, que são feitas sob encomenda em madeira maciça.",
    };

    for (const [slug, abertura] of Object.entries(aberturas)) {
      const html = await pagina(slug);
      expect({ slug, presente: html.includes(abertura) }).toEqual({ slug, presente: true });
      // It is also the page's description, because nothing else generates one.
      expect(html).toContain(`content="${abertura}"`);
    }
  });

  // CDC art. 49 parágrafo único, and Decreto 7.962 art. 5º §§2 and 4.
  test("returns the money updated, at no cost, confirmed immediately", async () => {
    const html = await pagina("trocas-e-devolucoes");
    expect(html).toContain("devolvemos todos os valores pagos, corrigidos monetariamente");
    expect(html).toContain("Desistir não tem custo nenhum para você");
    expect(html).toContain("A coleta da peça é por nossa conta");
    expect(html).toContain("são cancelados sem ônus");
    expect(html).toContain(
      "Confirmamos o recebimento do seu pedido na hora, pelo mesmo canal em que ele chegou",
    );
    expect(html).toContain("concluímos a devolução em até 5 dias úteis");
    expect(html).toContain("CDC, ART. 49");
  });

  // The montagem paragraph names itself as a store grant, so a later session
  // cannot silently shorten a promise the store chose to make.
  test("labels the montagem extension a grant beyond the statute", async () => {
    const html = await pagina("trocas-e-devolucoes");
    expect(html).toContain("o prazo passa a contar da data em que a peça foi montada");
    expect(html).toContain("Isso é uma escolha nossa: a lei conta do recebimento");
  });

  // LGPD art. 7º V, and the reason `checkout.md` §5 refuses a consent checkbox.
  test("states the checkout's basis and why there is no consent checkbox", async () => {
    const html = await pagina("privacidade");
    expect(html).toContain("a base legal para eles é a execução do contrato");
    expect(html).toContain("a gente não pede o seu consentimento para eles");
    expect(html).toContain("LGPD, ART. 7º, V");
    expect(html).toContain("o único caso em que a base é o seu consentimento");
  });

  // CDC art. 101 I — the consumer sues where they live, and no forum is elected
  // against them.
  test("states the right to sue at home and elects no forum", async () => {
    const html = await pagina("termos-de-uso");
    expect(html).toContain("você pode processar a Canto Zen no foro do seu próprio domicílio");
    expect(html).toContain("Esta página não elege foro diferente disso");
    expect(html).not.toContain("fica eleito o foro");
    expect(html).toContain("CDC, ART. 101, I");
  });
});

// §12 — `Loja` is one object read by the footer and by `/contato`, which is the
// whole reason it is one. This is the assertion that makes that true rather
// than intended.
describe("Loja is read, never restated", () => {
  test("/contato and the footer agree on the address, because it is one object", async () => {
    const html = semScripts((await buscar("/contato")).html);
    const { endereco } = loja;
    expect(html).toContain(`${endereco.logradouro}, ${endereco.numero} — ${endereco.bairro}`);
    expect(html).toContain(`CEP ${endereco.cep}`);
    // The footer's own identification line, on the same document.
    expect(html).toContain(loja.cnpj);
    expect(html).toContain(loja.razaoSocial);
  });

  test("/sobre states the founding year the footer's data already holds", async () => {
    const html = semScripts((await buscar("/sobre")).html);
    expect(html).toContain(`DESDE ${loja.fundacao}`);
  });
});
