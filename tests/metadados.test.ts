import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { ambiente, artigo, colecoes, produto } from "../lib/catalogo";
import { descricaoDaHome } from "../lib/home/conteudo";
import { artigosEnumerados, metadadosDoArtigo } from "../lib/inspiracoes/conteudo";
import { METADADOS_DE_CONTATO } from "../lib/institucional/contato";
import { METADADOS_DE_SOBRE } from "../lib/institucional/sobre";
import { metadadosDaPolitica, slugsDePoliticas } from "../lib/institucional/politicas";
import { metadadosDaColecao, metadadosDoAmbiente, metadadosDoTipo } from "../lib/listagem/conteudo";
import { ambientesEnumerados, produtosEnumerados } from "../lib/listagem/rotas";
import { metadadosDoProduto } from "../lib/produto/conteudo";
import {
  CAMPO_DE_COMPARTILHAMENTO,
  ORIGEM,
  campoDeCompartilhamento,
} from "../lib/metadados/conteudo";
import { parseCss, rootTokens } from "./helpers/css";
import { buscar, encerrarServidor, servidorDeTeste } from "./helpers/servidor";

// Seam 2 — what the store says to machines, and the closed list of refusals.
//
// `rotas.md`'s Metadata section is half claims and half absences, and the
// absences are the half a later build session is most likely to "fix": adding
// `offers` to earn a rich result, adding `Organization` because a store has a
// name, adding `ItemList` because a listing is a list. Every one of those is
// asserted here as a refusal, in rendered output, because that is the only
// place an absence is observable at all.
beforeAll(async () => {
  await servidorDeTeste();
}, 300_000);

afterAll(encerrarServidor);

const raiz = fileURLToPath(new URL("..", import.meta.url));

const cabeca = (html: string): string => html.slice(0, html.indexOf("</head>"));

const titulo = (html: string): string | null => html.match(/<title>([^<]*)<\/title>/)?.[1] ?? null;

const descricao = (html: string): string | null =>
  cabeca(html).match(/<meta name="description" content="([^"]*)"/)?.[1] ?? null;

const canonica = (html: string): string | null =>
  cabeca(html).match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? null;

const robots = (html: string): string[] =>
  [...cabeca(html).matchAll(/<meta name="robots" content="([^"]*)"/g)].map((m) => m[1]!);

const propriedade = (html: string, nome: string): string | null =>
  cabeca(html).match(new RegExp(`<meta property="${nome}" content="([^"]*)"`))?.[1] ?? null;

const nomeada = (html: string, nome: string): string | null =>
  cabeca(html).match(new RegExp(`<meta name="${nome}" content="([^"]*)"`))?.[1] ?? null;

/** One rung of a `BreadcrumbList`; the last carries no `item`, being the page. */
type ItemDaTrilha = { name: string; item?: string };

/** Every JSON-LD node in the document, parsed. */
const nos = (html: string): Record<string, unknown>[] =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
    JSON.parse(m[1]!.replace(/\\u003c/g, "<")),
  );

const absoluta = (caminho: string) => new URL(caminho, ORIGEM).toString();

// One route per kind in `rotas.md` §1's table, which is what `build-spec.md`
// asks of this seam: the title shape **sampled**, not enumerated.
const amostra = () => {
  const slugDoProduto = produtosEnumerados()[0]!;
  const slugDaColecao = colecoes[0]!.slug;
  const slugDoArtigo = artigosEnumerados()[0]!;
  const slugDaPolitica = slugsDePoliticas()[0]!;

  return [
    { rota: "/", titulo: "Canto Zen" },
    { rota: "/sala", titulo: `${metadadosDoAmbiente("sala").titulo} | Canto Zen` },
    {
      rota: "/sala/poltronas",
      titulo: `${metadadosDoTipo("sala", "poltronas").titulo} | Canto Zen`,
    },
    { rota: "/produtos", titulo: "Todas as peças | Canto Zen" },
    {
      rota: `/produtos/${slugDoProduto}`,
      titulo: `${metadadosDoProduto(produto(slugDoProduto)!).titulo} | Canto Zen`,
    },
    {
      rota: `/colecoes/${slugDaColecao}`,
      titulo: `${metadadosDaColecao(slugDaColecao).titulo} | Canto Zen`,
    },
    { rota: "/inspiracoes", titulo: "Inspirações | Canto Zen" },
    {
      rota: `/inspiracoes/${slugDoArtigo}`,
      titulo: `${metadadosDoArtigo(slugDoArtigo).titulo} | Canto Zen`,
    },
    { rota: "/carrinho", titulo: "Carrinho | Canto Zen" },
    { rota: "/checkout", titulo: "Checkout | Canto Zen" },
    { rota: "/pedido-confirmado", titulo: "Pedido | Canto Zen" },
    { rota: "/sobre", titulo: "Sobre nós | Canto Zen" },
    { rota: "/contato", titulo: "Contato | Canto Zen" },
    {
      rota: `/politicas/${slugDaPolitica}`,
      titulo: `${metadadosDaPolitica(slugDaPolitica).titulo} | Canto Zen`,
    },
    { rota: "/nao-existe", titulo: "Página não encontrada | Canto Zen" },
  ];
};

// rotas.md §1
describe("os títulos", () => {
  test("every route kind states its name and takes the suffix", async () => {
    for (const caso of amostra()) {
      expect(titulo((await buscar(caso.rota)).html)).toBe(caso.titulo);
    }
  });

  test("the home is unsuffixed — appending the brand to the brand stutters", async () => {
    expect(titulo((await buscar("/")).html)).toBe("Canto Zen");
  });

  test("no title carries a figure, a category gloss or a selling line", async () => {
    for (const caso of amostra()) {
      const nome = caso.titulo.replace(" | Canto Zen", "");
      expect(nome).not.toMatch(/R\$|\d+ ?cm|\d+ peças/i);
    }
  });

  test("pagination appends the page; page 1 never does", async () => {
    expect(titulo((await buscar("/produtos?pagina=2")).html)).toBe(
      "Todas as peças — página 2 | Canto Zen",
    );
    expect(titulo((await buscar("/produtos?pagina=1")).html)).toBe("Todas as peças | Canto Zen");
  });

  test("filters never change the title", async () => {
    const limpo = titulo((await buscar("/sala")).html);
    expect(titulo((await buscar("/sala?cor=cru")).html)).toBe(limpo);
    expect(titulo((await buscar("/sala?ordem=menor-preco")).html)).toBe(limpo);
  });
});

// rotas.md §2 — derived, or an authored line the data already holds
describe("as descrições", () => {
  test("each one is the line its own module computed, verbatim", async () => {
    const esperado: [string, string][] = [
      ["/", descricaoDaHome()],
      // Authored: `ambiente.descricao`, the same sentence the page header shows.
      ["/sala", metadadosDoAmbiente("sala").descricao],
      ["/sala/poltronas", metadadosDoTipo("sala", "poltronas").descricao],
      ["/sobre", METADADOS_DE_SOBRE.descricao],
      ["/contato", METADADOS_DE_CONTATO.descricao],
    ];

    for (const [rota, linha] of esperado) {
      expect(descricao((await buscar(rota)).html)).toBe(linha);
    }
  });

  test("the produto description carries physical facts and no price", async () => {
    const slug = produtosEnumerados()[0]!;
    const linha = descricao((await buscar(`/produtos/${slug}`)).html);
    expect(linha).toBe(metadadosDoProduto(produto(slug)!).descricao);
    expect(linha).not.toMatch(/R\$/);
  });

  // §3 — the fourth *ausência autorada*. A description on a page nobody may
  // index is metadata written for no reader.
  test("the cart, the checkout, /pedido-confirmado and the 404 carry none", async () => {
    for (const rota of ["/carrinho", "/checkout", "/pedido-confirmado", "/nao-existe"]) {
      const { html } = await buscar(rota);
      expect(descricao(html)).toBeNull();
      expect(propriedade(html, "og:image")).toBeNull();
      expect(propriedade(html, "og:description")).toBeNull();
      expect(nos(html)).toEqual([]);
    }
  });
});

// rotas.md §4
describe("a canônica e o robots", () => {
  test("an indexable route is self-canonical, at an absolute URL", async () => {
    for (const rota of ["/sala", "/sala/poltronas", "/produtos", "/inspiracoes", "/sobre"]) {
      const alvo = canonica((await buscar(rota)).html);
      expect(alvo).toBe(absoluta(rota));
      expect(alvo?.startsWith("https://")).toBe(true);
    }
  });

  test("a filtered URL is noindex, with a canonical to the clean path", async () => {
    for (const rota of [
      "/sala?cor=cru",
      "/sala?material=linho",
      "/sala?preco=2000-5000",
      "/sala?ordem=menor-preco",
      "/sala/poltronas?cor=cru&pagina=2",
    ]) {
      const { html } = await buscar(rota);
      expect(robots(html)).toContain("noindex, follow");
      expect(canonica(html)).toBe(absoluta(rota.split("?")[0]!));
    }
  });

  test("`ambiente` on /produtos is filter state, canonical to /produtos", async () => {
    const { html } = await buscar("/produtos?ambiente=quarto");
    expect(robots(html)).toContain("noindex, follow");
    expect(canonica(html)).toBe(absoluta("/produtos"));
  });

  // The single exception: pages 2+ hold pieces that exist at no other indexable
  // URL, and canonicalising them away hides part of the catalogue from itself.
  test("`pagina` is indexable and self-canonical, with the page intact", async () => {
    const { html } = await buscar("/produtos?pagina=2");
    expect(robots(html)).toEqual([]);
    expect(canonica(html)).toBe(absoluta("/produtos?pagina=2"));
  });

  test("the four noindex surfaces say so", async () => {
    for (const rota of ["/carrinho", "/checkout", "/pedido-confirmado", "/nao-existe"]) {
      expect(robots((await buscar(rota)).html)).toContain("noindex, follow");
    }
  });

  test("robots.txt disallows exactly three paths, and never a ? wildcard", async () => {
    const { html } = await buscar("/robots.txt");
    const negados = [...html.matchAll(/Disallow: (.*)/g)].map((m) => m[1]!.trim());
    expect(negados).toEqual(["/carrinho", "/checkout", "/pedido-confirmado"]);
    expect(html).not.toContain("?");
  });

  test("the sitemap lists exactly the indexable set", async () => {
    const { html } = await buscar("/sitemap.xml");
    const urls = [...html.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]!);

    for (const rota of ["/produtos", "/inspiracoes", "/sobre", "/contato"]) {
      expect(urls).toContain(absoluta(rota));
    }
    for (const slug of ambientesEnumerados()) expect(urls).toContain(absoluta(`/${slug}`));
    for (const slug of produtosEnumerados()) expect(urls).toContain(absoluta(`/produtos/${slug}`));
    // The enumerated pairs are written out, from the declaration the router reads.
    expect(urls).toContain(absoluta("/sala/poltronas"));

    for (const rota of ["/carrinho", "/checkout", "/pedido-confirmado"]) {
      expect(urls).not.toContain(absoluta(rota));
    }
    expect(urls.some((url) => url.includes("?"))).toBe(false);
  });
});

// rotas.md §5
describe("o cartão", () => {
  test("og:title and og:description mirror the tab exactly", async () => {
    for (const rota of ["/sala", "/produtos", "/inspiracoes", "/sobre"]) {
      const { html } = await buscar(rota);
      expect(propriedade(html, "og:title")).toBe(titulo(html));
      expect(propriedade(html, "og:description")).toBe(descricao(html));
    }
  });

  test("og:site_name and og:locale are the store's, everywhere there is a card", async () => {
    for (const rota of ["/", "/sala", "/produtos", "/sobre"]) {
      const { html } = await buscar(rota);
      expect(propriedade(html, "og:site_name")).toBe("Canto Zen");
      expect(propriedade(html, "og:locale")).toBe("pt_BR");
    }
  });

  test("the image is contained in a 1200×630 --kozo field, never cropped", async () => {
    const { html } = await buscar("/sala");
    const url = propriedade(html, "og:image")!.replace(/&amp;/g, "&");

    expect(url).toBe(campoDeCompartilhamento(ambiente("sala")!.imagem));
    expect(propriedade(html, "og:image:width")).toBe("1200");
    expect(propriedade(html, "og:image:height")).toBe("630");

    const parametros = new URL(url).searchParams;
    // `fit=fill` contains. A crop would be `fit=crop`, and what it would cut is
    // the cast shadow `marca.md` §7 makes part of the frame.
    expect(parametros.get("fit")).toBe("fill");
    expect(parametros.get("fill")).toBe("solid");
    expect(parametros.get("fill-color")).toBe("f1f0ec");
    expect(url).not.toContain("fit=crop");
  });

  // The field is `--kozo` itself, not a colour that happens to resemble it: the
  // share card is the same containment treatment `imagens.md` gives the cart's
  // 96px square, so the two have to be the same grey.
  test("the field is the --kozo token, as imgix spells a colour", () => {
    const folha = readFileSync(`${raiz}app/globals.css`, "utf8");
    const kozo = rootTokens(parseCss(folha))["--kozo"]!;
    expect(CAMPO_DE_COMPARTILHAMENTO).toBe(kozo.replace("#", "").toLowerCase());
  });

  test("the type listing borrows the room's photograph, not its first result", async () => {
    const { html } = await buscar("/sala/poltronas");
    expect(propriedade(html, "og:image")!.replace(/&amp;/g, "&")).toBe(
      campoDeCompartilhamento(ambiente("sala")!.imagem),
    );
  });

  // The institutional pages made photography-free an authored absence, and a
  // manufactured wordmark card re-adds the image the page refused.
  test("institucional offers no card and no fallback wordmark", async () => {
    const rotas = ["/sobre", "/contato", ...slugsDePoliticas().map((s) => `/politicas/${s}`)];
    for (const rota of rotas) {
      const { html } = await buscar(rota);
      expect(propriedade(html, "og:image")).toBeNull();
      expect(nomeada(html, "twitter:image")).toBeNull();
      expect(nomeada(html, "twitter:card")).toBe("summary");
    }
  });

  test("twitter:card is summary_large_image where there is an image", async () => {
    for (const rota of ["/", "/sala", "/produtos", "/inspiracoes"]) {
      expect(nomeada((await buscar(rota)).html, "twitter:card")).toBe("summary_large_image");
    }
  });

  test("og:type is article on an article and website everywhere else", async () => {
    const slug = artigosEnumerados()[0]!;
    expect(propriedade((await buscar(`/inspiracoes/${slug}`)).html, "og:type")).toBe("article");

    for (const rota of ["/", "/sala", "/produtos", "/inspiracoes", "/sobre"]) {
      expect(propriedade((await buscar(rota)).html, "og:type")).toBe("website");
    }
  });
});

// rotas.md §6 — the three nodes
describe("os dados estruturados", () => {
  test("the produto page emits Product and BreadcrumbList, and nothing else", async () => {
    const slug = produtosEnumerados()[0]!;
    const peca = produto(slug)!;
    const emitidos = nos((await buscar(`/produtos/${slug}`)).html);

    expect(emitidos.map((no) => no["@type"])).toEqual(["Product", "BreadcrumbList"]);

    const [produtoNo, trilhaNo] = emitidos as [Record<string, unknown>, Record<string, unknown>];
    expect(produtoNo.name).toBe(peca.nome);
    expect(produtoNo.description).toBe(metadadosDoProduto(peca).descricao);
    expect(produtoNo.brand).toEqual({ "@type": "Brand", name: "Canto Zen" });
    expect(produtoNo.width).toEqual({
      "@type": "QuantitativeValue",
      value: peca.medidas.largura,
      unitCode: "CMT",
    });
    expect(produtoNo.depth).toMatchObject({ unitCode: "CMT" });
    expect(produtoNo.height).toMatchObject({ unitCode: "CMT" });

    // `produto.md` refused synthetic ids, and this is where inventing one would
    // have paid off.
    expect(produtoNo.sku).toBeUndefined();
    expect(produtoNo.gtin).toBeUndefined();

    // The trail mirrors the visible one and reads the **primary** room.
    const itens = trilhaNo.itemListElement as ItemDaTrilha[];
    expect(itens.map((item) => item.name)).toEqual([
      "Início",
      ambiente(peca.ambientePrincipal)!.label,
      expect.any(String),
      peca.nome,
    ]);
    // The page the reader is on is a name without a link, as the visible trail
    // renders it — `aria-current="page"`, not an anchor.
    expect(itens.at(-1)!.item).toBeUndefined();
  });

  test("the article page emits Article, with no date and no named author", async () => {
    const slug = artigosEnumerados()[0]!;
    const registro = artigo(slug)!;
    const emitidos = nos((await buscar(`/inspiracoes/${slug}`)).html);

    expect(emitidos.map((no) => no["@type"])).toEqual(["Article"]);
    const [artigoNo] = emitidos as [Record<string, unknown>];
    expect(artigoNo.headline).toBe(registro.titulo);
    expect(artigoNo.description).toBe(registro.resumo);
    expect(artigoNo.image).toBe(registro.thumb.src);
    expect(artigoNo.author).toEqual({ "@type": "Organization", name: "Canto Zen" });
    expect(artigoNo.datePublished).toBeUndefined();
  });

  test("listings and institucional emit no node at all", async () => {
    const rotas = [
      "/",
      "/sala",
      "/sala/poltronas",
      "/produtos",
      "/inspiracoes",
      `/colecoes/${colecoes[0]!.slug}`,
      "/sobre",
      "/contato",
      `/politicas/${slugsDePoliticas()[0]!}`,
    ];
    for (const rota of rotas) expect(nos((await buscar(rota)).html)).toEqual([]);
  });
});

// The closed list. Each of these is a thing a later session would plausibly
// add, and each is refused for a stated reason (`rotas.md` §6).
describe("as recusas", () => {
  const rotasDaLoja = () => [
    "/",
    "/sala",
    "/sala/poltronas",
    "/produtos",
    `/produtos/${produtosEnumerados()[0]!}`,
    `/colecoes/${colecoes[0]!.slug}`,
    "/inspiracoes",
    `/inspiracoes/${artigosEnumerados()[0]!}`,
    "/carrinho",
    "/checkout",
    "/pedido-confirmado",
    "/sobre",
    "/contato",
    `/politicas/${slugsDePoliticas()[0]!}`,
    "/nao-existe",
  ];

  test("no offers node anywhere — the store declines a placement it cannot honour", async () => {
    for (const rota of rotasDaLoja()) {
      for (const no of nos((await buscar(rota)).html)) {
        const serializado = JSON.stringify(no);
        expect(serializado).not.toContain('"offers"');
        expect(serializado).not.toContain("priceCurrency");
        expect(serializado).not.toContain("availability");
      }
    }
  });

  test("no Organization, LocalBusiness, AggregateRating, ItemList or SearchAction", async () => {
    // `author: Organization { name }` is the one permitted appearance — a name
    // and nothing else — so the type assertion is on the node's own `@type`.
    const proibidos = [
      "Organization",
      "LocalBusiness",
      "AggregateRating",
      "Review",
      "ItemList",
      "WebSite",
    ];

    for (const rota of rotasDaLoja()) {
      for (const no of nos((await buscar(rota)).html)) {
        const serializado = JSON.stringify(no);
        expect(proibidos).not.toContain(no["@type"]);
        expect(serializado).not.toContain("SearchAction");
        expect(serializado).not.toContain("LocalBusiness");
        expect(serializado).not.toContain("AggregateRating");
        expect(serializado).not.toContain("ItemList");
      }
    }
  });

  test("og:type is never product", async () => {
    for (const rota of rotasDaLoja()) {
      const { html } = await buscar(rota);
      expect(propriedade(html, "og:type")).not.toBe("product");
      expect(html).not.toContain("og:price:amount");
      expect(html).not.toContain("product:availability");
    }
  });
});

// build-spec.md, Testing Decisions — "refusals that are absences in output",
// asserted store-wide rather than on the surface that argued for each. A rule
// that holds on the page that specified it and nowhere else has not held.
describe("as recusas em toda a loja", () => {
  const todasAsRotas = () => [
    "/",
    ...ambientesEnumerados().map((slug) => `/${slug}`),
    "/sala/poltronas",
    "/produtos",
    `/produtos/${produtosEnumerados()[0]!}`,
    `/colecoes/${colecoes[0]!.slug}`,
    "/inspiracoes",
    ...artigosEnumerados().map((slug) => `/inspiracoes/${slug}`),
    "/carrinho",
    "/checkout",
    "/pedido-confirmado",
    "/sobre",
    "/contato",
    ...slugsDePoliticas().map((slug) => `/politicas/${slug}`),
    "/nao-existe",
  ];

  // `imagens.md` §6 — the seventh refusal. On failure the `--kozo` field simply
  // stays: no broken-image icon, and no such string in the codebase to render.
  test("no IMAGEM INDISPONÍVEL string anywhere", async () => {
    for (const rota of todasAsRotas()) {
      expect((await buscar(rota)).html).not.toContain("IMAGEM INDISPONÍVEL");
    }
  });

  // A `freteGratis` piece states the fact, never a figure of zero.
  test("no R$ 0,00 on a freteGratis piece", async () => {
    const gratuitos = produtosEnumerados()
      .map((slug) => produto(slug)!)
      .filter((peca) => peca.freteGratis !== undefined)
      .slice(0, 8);

    expect(gratuitos.length).toBeGreaterThan(0);
    for (const peca of gratuitos) {
      expect((await buscar(`/produtos/${peca.slug}`)).html).not.toContain("R$ 0,00");
    }
  });

  // Fixed by `marca.md` §4 and not restated in `rotas.md` §8 — which is exactly
  // why it is asserted here, on every route rather than on the one that set it.
  test("lang=pt-BR on every route", async () => {
    for (const rota of todasAsRotas()) {
      expect((await buscar(rota)).html).toContain('lang="pt-BR"');
    }
  });
});
