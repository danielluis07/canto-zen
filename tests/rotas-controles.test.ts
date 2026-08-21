import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { cor } from "../lib/catalogo";
import { consultaVazia, selecionar } from "../lib/listagem/consulta";
import { SEM_RESULTADOS } from "../lib/listagem/controles";
import { produtosDoAmbiente } from "../lib/listagem/conteudo";
import { buscar, encerrarServidor, semScripts, servidorDeTeste } from "./helpers/servidor";

// Seam 2 — the rendered route, for the query state `catalogo.md` §§3, 7 and 8
// put in the URL. Everything here is asserted against a built app served
// locally, because the contract under test is a property of the response.
beforeAll(async () => {
  await servidorDeTeste();
}, 300_000);

afterAll(encerrarServidor);

/** A cru piece in couro natural does not exist in Sala, and that is the point. */
const SEM_NADA = "/sala?cor=cru&material=couro-natural";

// rotas.md §7 — the two things that must never swap
describe("a filter that matches nothing", () => {
  let html = "";

  beforeAll(async () => {
    const resposta = await buscar(SEM_NADA);
    expect(resposta.status).toBe(200);
    html = semScripts(resposta.html);
  });

  // The URL exists and the state matches nothing: a 404 here would make
  // legitimate state look broken, exactly as a 200 on an unenumerated pair
  // would put empty grids into the index.
  test("is a 200, not a 404", async () => {
    expect((await buscar(SEM_NADA)).status).toBe(200);
  });

  test("says so in the store's own words", () => {
    expect(html).toContain(SEM_RESULTADOS);
  });

  // §8 — `0 PEÇAS` annotates a grid that does not exist, and marca.md §2
  // prohibits an empty régua. The prohibition bites here as designed.
  test("renders no régua at all", () => {
    // The régua's own markup, and no element whose whole text is the count.
    // `VER 0 PEÇAS` on the mobile sheet is a different thing: it is the sheet's
    // closing action, and zero is what tells the reader the combination is
    // empty without closing it (§12).
    expect(html).not.toContain('h-[13px]');
    expect(html).not.toMatch(/>\d+ PEÇAS?</);
  });

  test("keeps the way out — the header, the band, the bar and LIMPAR", () => {
    expect(html).toContain("Sala");
    expect(html).toContain(">TODAS<");
    expect(html).toContain("LIMPAR FILTROS");
    expect(html).toContain('href="/sala"');
  });
});

// catalogo.md §3
describe("the filter bar", () => {
  let html = "";

  beforeAll(async () => {
    html = semScripts((await buscar("/sala")).html);
  });

  test("offers cor, material and preço, and not tipo or ambiente", () => {
    expect(html).toContain(">COR<");
    expect(html).toContain(">MATERIAL<");
    expect(html).toContain(">PREÇO<");
    // The room's own eyebrow says AMBIENTE; what must not exist is the facet.
    expect(html).not.toContain("?ambiente=");
  });

  test("paints each cor's own amostra behind its label", () => {
    const cru = cor("cru")!;
    expect(html.toUpperCase()).toContain(`BACKGROUND-COLOR:${cru.amostra.toUpperCase()}`);
  });

  test("names the four price ranges as store constants", () => {
    expect(html).toContain("Até R$ 2.000");
    expect(html).toContain("Acima de R$ 10.000");
    expect(html).toContain('href="/sala?preco=10000-"');
  });

  test("offers the three sort tokens, and omits the default from the URL", () => {
    expect(html).toContain("Curadoria");
    expect(html).toContain('href="/sala?ordem=menor-preco"');
    expect(html).toContain('href="/sala?ordem=maior-preco"');
    expect(html).not.toContain("ordem=curadoria");
  });

  // §3 — the state lives in the trigger, never in a row of chips below the bar.
  test("shows LIMPAR only once a facet is applied", () => {
    expect(html).not.toContain(">LIMPAR<");
  });

  test("carries the applied values in the trigger itself", async () => {
    const filtrado = semScripts((await buscar("/sala?cor=cru")).html);
    expect(filtrado).toContain("COR · CRU");
    expect(filtrado).toContain(">LIMPAR<");
  });
});

// catalogo.md §3, §7 — the query is the state, and the sort really sorts
describe("the query", () => {
  test("?ordem= puts the cheapest piece first", async () => {
    const html = semScripts((await buscar("/sala?ordem=menor-preco")).html);
    const esperado = selecionar(produtosDoAmbiente("sala"), {
      ...consultaVazia(),
      ordem: "menor-preco",
    }).slice(0, 12);

    const posicoes = esperado.map((produto) => html.indexOf(`/produtos/${produto.slug}`));
    expect(posicoes.every((posicao) => posicao > -1)).toBe(true);
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
  });

  test("?pagina= hands back the next twelve, and the first twelve are gone", async () => {
    const sala = produtosDoAmbiente("sala");
    const html = semScripts((await buscar("/sala?pagina=2")).html);
    expect(html).toContain(`/produtos/${sala[12].slug}`);
    expect(html).not.toContain(`/produtos/${sala[0].slug}"`);
  });

  // A room route takes its room from the path — rotas.md's query table.
  test("a room route ignores ?ambiente= rather than erroring on it", async () => {
    const resposta = await buscar("/sala?ambiente=quarto");
    expect(resposta.status).toBe(200);
    expect(regua(semScripts(resposta.html))).toBe(regua(semScripts((await buscar("/sala")).html)));
  });

  // build-spec.md, Routing — reserved by the route table, never used.
  test("?q= changes nothing", async () => {
    const resposta = await buscar("/sala?q=poltrona");
    expect(resposta.status).toBe(200);
    expect(regua(semScripts(resposta.html))).toBe(regua(semScripts((await buscar("/sala")).html)));
  });

  test("an unknown value falls back to the unfiltered room", async () => {
    const resposta = await buscar("/sala?cor=roxo&ordem=mais-vendidos");
    expect(resposta.status).toBe(200);
    expect(regua(semScripts(resposta.html))).toBe(regua(semScripts((await buscar("/sala")).html)));
  });
});

// catalogo.md §7 — numbered, twelve to a page, page one canonical
describe("the pagination", () => {
  test("numbers the pages and never writes pagina=1", async () => {
    const html = semScripts((await buscar("/sala")).html);
    expect(html).toContain('aria-label="Paginação"');
    expect(html).toContain('href="/sala?pagina=2"');
    expect(html).not.toContain("pagina=1");
  });

  test("drops the dead end instead of disabling it", async () => {
    const primeira = semScripts((await buscar("/sala")).html);
    expect(primeira).not.toContain("←");
    expect(primeira).toContain("→");

    const ultima = semScripts((await buscar("/sala?pagina=3")).html);
    expect(ultima).toContain("←");
    expect(ultima).not.toContain("→");
  });

  // Escritório holds exactly twelve pieces, so it is one full page — and a
  // control offering the page the reader is already on is not rendered.
  test("does not render where everything fits on one page", async () => {
    expect(produtosDoAmbiente("escritorio").length).toBe(12);
    const html = semScripts((await buscar("/escritorio")).html);
    expect(html).toContain("12 PEÇAS");
    expect(html).not.toContain('aria-label="Paginação"');
    expect(html).not.toContain("pagina=");
  });
});

/** The régua's figure, which is the whole filtered count and nothing else. */
const regua = (html: string): string => html.match(/\d+ PEÇAS?/)?.[0] ?? "";
