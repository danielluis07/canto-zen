import { describe, expect, test } from "bun:test";
import {
  ambiente,
  colecao,
  cor,
  familia,
  material,
  precoAVista,
  rotulosMedidasExtras,
  todosOsProdutos,
} from "../lib/catalogo";
import type { Medidas, Produto } from "../lib/catalogo";
import { exigirProduto as buscar, MADEIRAS } from "./helpers/catalogo";

// dados.md §3.4 — the Escritório slice, transcribed. Every figure below is the
// spec's: identity from §3.4, the régua budget from §7.3, the envelopes from
// §8.2, the closed-room argument from §1.2 and §3.6. Nothing here asserts how
// the module is laid out, only what a caller reads back.

/** §3.4, verbatim. `Preço` is reais in the table and centavos in the record. */
const LINHAS: Array<{
  ordem: number;
  slug: string;
  nome: string;
  acabamento: string;
  tipo: string;
  reais: number;
  disponibilidade: Produto["disponibilidade"];
}> = [
  { ordem: 54, slug: "escrivaninha-cais-carvalho", nome: "Escrivaninha Cais", acabamento: "Carvalho", tipo: "escrivaninhas", reais: 5900, disponibilidade: "sob-encomenda" },
  { ordem: 55, slug: "escrivaninha-vau-freijo", nome: "Escrivaninha Vau", acabamento: "Freijó", tipo: "escrivaninhas", reais: 4800, disponibilidade: "envio-imediato" },
  { ordem: 56, slug: "escrivaninha-tramo-aco-carvao", nome: "Escrivaninha Tramo", acabamento: "Aço Carvão", tipo: "escrivaninhas", reais: 3900, disponibilidade: "envio-imediato" },
  { ordem: 57, slug: "cadeira-de-trabalho-orla-couro-argila", nome: "Cadeira de Trabalho Orla", acabamento: "Couro Argila", tipo: "cadeiras-de-trabalho", reais: 4200, disponibilidade: "sob-encomenda" },
  { ordem: 58, slug: "cadeira-de-trabalho-junco-palhinha-freijo", nome: "Cadeira de Trabalho Junco", acabamento: "Palhinha e Freijó", tipo: "cadeiras-de-trabalho", reais: 2600, disponibilidade: "envio-imediato" },
  { ordem: 59, slug: "cadeira-de-trabalho-ripado-carvalho", nome: "Cadeira de Trabalho Ripado", acabamento: "Carvalho", tipo: "cadeiras-de-trabalho", reais: 3100, disponibilidade: "sob-encomenda" },
  { ordem: 60, slug: "estante-bruma-freijo", nome: "Estante Bruma", acabamento: "Freijó", tipo: "estantes", reais: 5100, disponibilidade: "sob-encomenda" },
  { ordem: 61, slug: "estante-vargem-carvalho", nome: "Estante Vargem", acabamento: "Carvalho", tipo: "estantes", reais: 5700, disponibilidade: "envio-imediato" },
  { ordem: 62, slug: "estante-mirante-nogueira", nome: "Estante Mirante", acabamento: "Nogueira", tipo: "estantes", reais: 6600, disponibilidade: "sob-encomenda" },
  { ordem: 63, slug: "luminaria-de-mesa-farol-latao", nome: "Luminária de Mesa Farol", acabamento: "Latão", tipo: "luminarias-de-mesa", reais: 1420, disponibilidade: "esgotado" },
  { ordem: 64, slug: "luminaria-de-mesa-seixo-ceramica-cru", nome: "Luminária de Mesa Seixo", acabamento: "Cerâmica Cru", tipo: "luminarias-de-mesa", reais: 980, disponibilidade: "envio-imediato" },
  { ordem: 65, slug: "luminaria-de-mesa-junco-palhinha", nome: "Luminária de Mesa Junco", acabamento: "Palhinha", tipo: "luminarias-de-mesa", reais: 760, disponibilidade: "envio-imediato" },
];

/** An axis's range in §8.2's table, in cm: `[mínimo, máximo]`. */
type Faixa = [number, number];

/** §8.2, for the four tipos the room exposes. */
const ENVELOPES: Record<string, Record<keyof Medidas, Faixa>> = {
  escrivaninhas: { largura: [110, 160], profundidade: [55, 70], altura: [74, 78] },
  "cadeiras-de-trabalho": { largura: [44, 58], profundidade: [48, 60], altura: [78, 92] },
  estantes: { largura: [90, 200], profundidade: [32, 45], altura: [140, 210] },
  "luminarias-de-mesa": { largura: [18, 34], profundidade: [18, 34], altura: [38, 56] },
};

/** The room's slice, read once — `todosOsProdutos` composes the whole set. */
const ESCRITORIO: Produto[] = todosOsProdutos().filter(
  (p) => p.ambientePrincipal === "escritorio",
);

const FAMILIAS_DO_ESCRITORIO: string[] = [...new Set(ESCRITORIO.map((p) => p.familia))];

const EIXOS = ["largura", "profundidade", "altura"] as const;

/** The bounding volume, in cm³ — what "a larger piece" means across the trio. */
const volume = ({ largura, profundidade, altura }: Medidas) => largura * profundidade * altura;

describe("§3.4 — the twelve rows", () => {
  test("every row is transcribed, and nothing else lists escritório as its room", () => {
    expect(ESCRITORIO.map((p) => p.slug)).toEqual(LINHAS.map((l) => l.slug));
  });

  for (const linha of LINHAS) {
    test(`row ${linha.ordem} — ${linha.slug}`, () => {
      const p = buscar(linha.slug);
      expect(p.nome).toBe(linha.nome);
      expect(p.acabamento).toBe(linha.acabamento);
      expect(p.tipo).toBe(linha.tipo);
      expect(p.ordem).toBe(linha.ordem);
      expect(p.precoTabela).toBe(linha.reais * 100);
      expect(p.disponibilidade).toBe(linha.disponibilidade);
      expect(p.ambientePrincipal).toBe("escritorio");
      expect(p.ambientes[0]).toBe("escritorio");
    });
  }

  test("one record per acabamento — every slug is its own", () => {
    const slugs = ESCRITORIO.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("a prazo de produção is stated iff the piece is sob-encomenda", () => {
    // produto.md — `required iff 'sob-encomenda'`.
    for (const p of ESCRITORIO) {
      if (p.disponibilidade === "sob-encomenda") {
        expect(p.prazoProducaoSemanas).toBeGreaterThan(0);
      } else {
        expect(p.prazoProducaoSemanas).toBeUndefined();
      }
    }
  });

  test("the room holds §3.8's third esgotado piece and neither promo state", () => {
    // §3.8 — `X` on #63, and every precoDe and freteGratis piece is elsewhere.
    expect(ESCRITORIO.filter((p) => p.disponibilidade === "esgotado").map((p) => p.slug)).toEqual([
      "luminaria-de-mesa-farol-latao",
    ]);
    expect(ESCRITORIO.filter((p) => p.precoDe !== undefined)).toEqual([]);
    expect(ESCRITORIO.filter((p) => p.freteGratis)).toEqual([]);
  });

  test("an esgotado piece keeps every field a listed piece carries", () => {
    // catalogo.md §13 — the state removes the CTA, not the record.
    const farol = buscar("luminaria-de-mesa-farol-latao");
    expect(farol.precoTabela).toBeGreaterThan(0);
    expect(farol.imagens.length).toBeGreaterThan(0);
    expect(farol.descricao.length).toBeGreaterThan(0);
    expect(farol.medidasExtras.length).toBeGreaterThan(0);
  });

  test("the two coleção pieces list their coleção back, and it lists them", () => {
    // §2.6 — `serra` carries `estante-mirante-nogueira`, `reboco` carries
    // `luminaria-de-mesa-seixo-ceramica-cru`, and nothing else here.
    expect(buscar("estante-mirante-nogueira").colecoes).toEqual(["serra"]);
    expect(buscar("luminaria-de-mesa-seixo-ceramica-cru").colecoes).toEqual(["reboco"]);
    expect(ESCRITORIO.filter((p) => p.colecoes.length > 0).map((p) => p.slug)).toEqual([
      "estante-mirante-nogueira",
      "luminaria-de-mesa-seixo-ceramica-cru",
    ]);
    expect(colecao("serra")!.produtos).toContain("estante-mirante-nogueira");
    expect(colecao("reboco")!.produtos).toContain("luminaria-de-mesa-seixo-ceramica-cru");
  });

  test("the one cross-listed piece carries §3.6's second room", () => {
    expect(buscar("estante-mirante-nogueira").ambientes).toEqual(["escritorio", "sala"]);
    const cruzadas = ESCRITORIO.filter((p) => p.ambientes.length > 1).map((p) => p.slug);
    expect(cruzadas).toEqual(["estante-mirante-nogueira"]);
  });

  test("the room's curated tipos[] covers every transcribed tipo", () => {
    const curados = ambiente("escritorio")!.tipos;
    for (const p of ESCRITORIO) expect(curados).toContain(p.tipo);
    // §1.2 — four tipos, three pieces each, no spine bump.
    for (const tipoSlug of curados) {
      expect(ESCRITORIO.filter((p) => p.tipo === tipoSlug)).toHaveLength(3);
    }
  });

  test("nothing cross-lists into escritório, so the route renders exactly twelve", () => {
    // §1.2 and §3.6 — 12 is the pagination boundary, and this room is the one
    // that renders a single full page with no pagination control at all.
    const listadas = todosOsProdutos().filter((p) => p.ambientes.includes("escritorio"));
    expect(listadas.map((p) => p.slug)).toEqual(ESCRITORIO.map((p) => p.slug));
    expect(listadas).toHaveLength(12);
  });
});

describe("famílias", () => {
  test("acabamentos of one família share medidas exactly", () => {
    for (const slug of FAMILIAS_DO_ESCRITORIO) {
      for (const p of ESCRITORIO.filter((acabamento) => acabamento.familia === slug)) {
        expect(p.medidas).toEqual(familia(slug)!.medidas);
      }
    }
  });

  test("no família here carries two acabamentos — §3.7 names none in this room", () => {
    expect(FAMILIAS_DO_ESCRITORIO).toHaveLength(ESCRITORIO.length);
  });

  test("every família carries medidas, designer and desenho", () => {
    for (const slug of FAMILIAS_DO_ESCRITORIO) {
      const fam = familia(slug)!;
      expect(fam.nome.length).toBeGreaterThan(0);
      expect(fam.designer.length).toBeGreaterThan(0);
      expect(fam.desenho.alt.length).toBeGreaterThan(0);
    }
  });

  test("the room's famílias read as §2.5's three designers", () => {
    // §2.5 maps by tipo: Rui Kimura holds the desk and the work chair, Henrique
    // Sato the shelving, Beatriz Amaral the lamp.
    const designerDe = (slug: string) => familia(buscar(slug).familia)!.designer;
    expect(designerDe("escrivaninha-cais-carvalho")).toBe("Rui Kimura");
    expect(designerDe("cadeira-de-trabalho-orla-couro-argila")).toBe("Rui Kimura");
    expect(designerDe("estante-mirante-nogueira")).toBe("Henrique Sato");
    expect(designerDe("luminaria-de-mesa-farol-latao")).toBe("Beatriz Amaral");
  });

  test("desenho is inline SVG in the régua's stroke grammar", () => {
    for (const slug of FAMILIAS_DO_ESCRITORIO) {
      const { desenho, medidas } = familia(slug)!;
      expect(desenho.src.startsWith("<svg")).toBe(true);
      // imagens.md §7 — never an <img>, and the strokes read the tokens.
      expect(desenho.src).not.toContain("<img");
      expect(desenho.src).toContain('stroke="var(--ink)"');
      expect(desenho.src).toContain('stroke="var(--hairline)"');
      // marca.md forbids an empty régua: the figures are in the drawing.
      expect(desenho.src).toContain(
        `L ${medidas.largura} × P ${medidas.profundidade} × A ${medidas.altura} cm`,
      );
    }
  });

  test("medidas sit inside §8.2's envelope for the tipo", () => {
    for (const p of ESCRITORIO) {
      const envelope = ENVELOPES[p.tipo]!;
      for (const eixo of EIXOS) {
        const valor = p.medidas[eixo];
        expect(Number.isInteger(valor)).toBe(true);
        expect(valor).toBeGreaterThanOrEqual(envelope[eixo][0]);
        expect(valor).toBeLessThanOrEqual(envelope[eixo][1]);
      }
    }
  });

  test("within a tipo, a larger price is a larger piece", () => {
    // §8.2 — so the régua never contradicts the price beside it. Compared per
    // família, at the lowest price its acabamentos carry.
    for (const tipoSlug of Object.keys(ENVELOPES)) {
      const doTipo = ESCRITORIO.filter((p) => p.tipo === tipoSlug);
      const ordenadas = [...new Set(doTipo.map((p) => p.familia))]
        .map((slug) => ({
          medidas: familia(slug)!.medidas,
          preco: Math.min(...doTipo.filter((p) => p.familia === slug).map((p) => p.precoTabela)),
        }))
        .sort((a, b) => a.preco - b.preco);

      for (let i = 1; i < ordenadas.length; i++) {
        const menor = ordenadas[i - 1]!.medidas;
        const maior = ordenadas[i]!.medidas;
        for (const eixo of EIXOS) expect(maior[eixo]).toBeGreaterThanOrEqual(menor[eixo]);
        expect(volume(maior)).toBeGreaterThan(volume(menor));
      }
    }
  });
});

describe("imagens — imagens.md §5, §9.3 and §10.1", () => {
  test("exactly one principal, first in imagens", () => {
    for (const p of ESCRITORIO) {
      expect(p.imagens.filter((i) => i.papel === "principal")).toHaveLength(1);
      expect(p.imagens[0]!.papel).toBe("principal");
    }
  });

  test("every src is a phase-1 Unsplash hotlink", () => {
    for (const p of ESCRITORIO) {
      for (const imagem of p.imagens) {
        expect(imagem.src.startsWith("https://images.unsplash.com/photo-")).toBe(true);
      }
    }
  });

  test("no decorative image exists — alt is never empty", () => {
    for (const p of ESCRITORIO) {
      for (const imagem of p.imagens) expect(imagem.alt.trim().length).toBeGreaterThan(0);
    }
  });

  test("principal and ambientada are templated; detalhe is authored", () => {
    for (const p of ESCRITORIO) {
      const nome = familia(p.familia)!.nome;
      for (const imagem of p.imagens) {
        if (imagem.papel === "principal") {
          expect(imagem.alt).toBe(`${nome} em ${p.acabamento.toLowerCase()} sobre reboco`);
        } else if (imagem.papel === "ambientada") {
          expect(imagem.alt).toBe(`${nome} em ${ambiente(p.ambientePrincipal)!.label}`);
        } else {
          // §5.2 — a detail macro carries information no template can reach.
          expect(imagem.alt).not.toContain("sobre reboco");
          expect(imagem.alt.endsWith(".")).toBe(false);
        }
      }
    }
  });

  test("cotas are spent on exactly §7.3's régua budget", () => {
    const comCota = ESCRITORIO.flatMap((p) =>
      p.imagens.map((i) => ({ slug: p.slug, cotas: i.cotas })),
    ).filter((i) => i.cotas.length > 0);
    expect(comCota).toEqual([{ slug: "escrivaninha-cais-carvalho", cotas: ["largura"] }]);
  });

  test("a cota is only ever declared where medidas supplies the figure", () => {
    for (const p of ESCRITORIO) {
      for (const imagem of p.imagens) {
        for (const cota of imagem.cotas) expect(p.medidas[cota]).toBeGreaterThan(0);
      }
    }
  });

  test("no image record authors a ratio — it is computed from medidas", () => {
    // imagens.md §3. The record carries the four fields the shape names and
    // nothing else, so a proportion can only ever come from `medidas`.
    for (const p of ESCRITORIO) {
      for (const imagem of p.imagens) {
        expect(Object.keys(imagem).sort()).toEqual(["alt", "cotas", "papel", "src"]);
      }
    }
  });

  test("the carve-out pair is not in this room", () => {
    // imagens.md §10.3 carves out `poltrona-lina`, which lists sala and quarto;
    // §3.6 holds escritório closed, so the pair cannot land here.
    expect(ESCRITORIO.map((p) => p.familia)).not.toContain("poltrona-lina");
  });

  test("ambientada and detalhe stay rare — §9.3's volume rule", () => {
    const extras = ESCRITORIO.flatMap((p) => p.imagens.filter((i) => i.papel !== "principal"));
    expect(extras.length).toBeLessThan(ESCRITORIO.length);
    // §7.2 — the room's full-coverage piece is the one that opens its article.
    expect(buscar("escrivaninha-cais-carvalho").imagens.map((i) => i.papel)).toEqual([
      "principal",
      "ambientada",
      "detalhe",
    ]);
  });
});

describe("the derivations produce sane output for every row", () => {
  test("cor and materiais resolve against the taxonomy", () => {
    for (const p of ESCRITORIO) {
      expect(cor(p.cor)).toBeDefined();
      expect(p.materiais.length).toBeGreaterThan(0);
      for (const slug of p.materiais) expect(material(slug)?.cuidados.length).toBeGreaterThan(0);
    }
  });

  test("a piece that names only a surface gains its structural wood", () => {
    // §8.1's rule, and the same deviation the other three rooms recorded: a
    // bare-wood acabamento (`Carvalho`, `Freijó`, `Nogueira`) names the
    // structural material itself, so the clause adds nothing and the piece
    // carries one material rather than the section's stated ≥2.
    for (const p of ESCRITORIO) {
      expect(p.materiais.some((m) => MADEIRAS.includes(m))).toBe(true);
      if (!MADEIRAS.includes(p.materiais[0]!)) expect(p.materiais).toHaveLength(2);
    }
  });

  test("embalagem is the piece plus §8.4's margin, and weighs something", () => {
    for (const p of ESCRITORIO) {
      expect(p.embalagem.largura).toBe(p.medidas.largura + 8);
      expect(p.embalagem.profundidade).toBe(p.medidas.profundidade + 8);
      expect(p.embalagem.altura).toBe(p.medidas.altura + 6);
      expect(p.embalagem.pesoKg).toBeGreaterThan(0);
    }
  });

  test("every piece here ships in one volume — §8.4 names no tipo of this room", () => {
    // `camas 2`, `guarda-roupas 3`, `armarios 2`, `mesas-de-jantar 2` and wide
    // `sofas`; escritório holds none of them, so the whole room is single-box.
    for (const p of ESCRITORIO) expect(p.embalagem.volumes).toBe(1);
  });

  test("the three luminárias are the catalogue's only unassembled pieces", () => {
    // §8.5 — the PDP's montagem block must render its no-assembly state
    // somewhere, and this room is where.
    const luminarias = ESCRITORIO.filter((p) => p.tipo === "luminarias-de-mesa");
    expect(luminarias).toHaveLength(3);
    for (const p of luminarias) {
      expect(p.montagem.necessaria).toBe(false);
      expect(p.montagem.tempoMinutos).toBe(0);
      // §8.7 — no manual and no tooling where there is no assembly.
      expect(p.itensInclusos).not.toContain("manual de montagem");
      expect(p.itensInclusos).toContain("lâmpada não inclusa");
    }
    expect(todosOsProdutos().filter((p) => !p.montagem.necessaria).map((p) => p.slug)).toEqual(
      luminarias.map((p) => p.slug),
    );
  });

  test("everything else in the room is assembled, and names its own tooling", () => {
    for (const p of ESCRITORIO.filter((linha) => linha.tipo !== "luminarias-de-mesa")) {
      expect(p.montagem.necessaria).toBe(true);
      expect(p.montagem.pecas).toBeGreaterThan(0);
      expect(p.itensInclusos[0]!.startsWith("1 ")).toBe(true);
      expect(p.itensInclusos).toContain("manual de montagem");
    }
  });

  test("medidasExtras carries exactly the rows its tipo rules", () => {
    for (const p of ESCRITORIO) {
      expect(p.medidasExtras.map((m) => m.rotulo)).toEqual(rotulosMedidasExtras(p.tipo));
      for (const linha of p.medidasExtras) expect(linha.valor).toBeGreaterThan(0);
    }
  });

  test("escrivaninhas carry none, the empty case §8.3 wants rendered", () => {
    // §8.3's table assigns rows to tipos and assigns `escrivaninhas` none — the
    // same reading `mesas-de-centro` already took. A desk's real extras would be
    // a vão livre and a passagem de fios, neither of which the table names, and
    // authoring rows here would invent a rule this ticket cannot.
    expect(rotulosMedidasExtras("escrivaninhas")).toEqual([]);
    for (const p of ESCRITORIO.filter((linha) => linha.tipo === "escrivaninhas")) {
      expect(p.medidasExtras).toEqual([]);
    }
  });

  test("a work chair's altura do assento sits under the piece's own altura", () => {
    for (const p of ESCRITORIO.filter((linha) => linha.tipo === "cadeiras-de-trabalho")) {
      const assento = p.medidasExtras.find((m) => m.rotulo === "Altura do assento")!;
      expect(assento.valor).toBeLessThan(p.medidas.altura);
    }
  });

  test("a luminária's reach and socket are both real figures", () => {
    // §8.3 gives the tipo `Alcance do braço` and `Soquete`; a socket count of
    // one is what a table lamp is, and the reach is per piece.
    for (const p of ESCRITORIO.filter((linha) => linha.tipo === "luminarias-de-mesa")) {
      const alcance = p.medidasExtras.find((m) => m.rotulo === "Alcance do braço")!;
      expect(alcance.unidade).toBe("cm");
      expect(alcance.valor).toBeLessThan(p.medidas.altura);
      expect(p.medidasExtras.find((m) => m.rotulo === "Soquete")!.valor).toBe(1);
    }
  });

  test("an estante's shelf count and load are both real figures", () => {
    for (const p of ESCRITORIO.filter((linha) => linha.tipo === "estantes")) {
      const prateleiras = p.medidasExtras.find((m) => m.rotulo === "Prateleiras")!;
      expect(prateleiras.unidade).toBe("un");
      expect(prateleiras.valor).toBeGreaterThanOrEqual(3);
      expect(p.medidasExtras.find((m) => m.rotulo === "Capacidade por prateleira")!.unidade).toBe(
        "kg",
      );
    }
  });

  test("the à-vista price is a discount on the one authored number", () => {
    for (const p of ESCRITORIO) expect(precoAVista(p.precoTabela)).toBeLessThan(p.precoTabela);
  });

  test("every row takes the store's garantia", () => {
    for (const p of ESCRITORIO) expect(p.garantiaMeses).toBeUndefined();
  });
});

describe("descrição — §8.6's copy direction", () => {
  for (const linha of LINHAS) {
    test(`row ${linha.ordem} reads in the atelier's voice`, () => {
      const p = buscar(linha.slug);
      const palavras = p.descricao.split(/\s+/).filter(Boolean);
      expect(palavras.length).toBeGreaterThanOrEqual(45);
      expect(palavras.length).toBeLessThanOrEqual(70);
      expect(p.descricao.split(". ").length).toBe(3);
      expect(p.descricao.endsWith(".")).toBe(true);
      // Never opens with the piece's own name, and never shouts.
      expect(p.descricao.startsWith(p.nome)).toBe(false);
      expect(p.descricao).not.toContain("!");
    });
  }

  test("a descrição never names a wood the record does not carry", () => {
    // §8.6's second sentence is the marcenaria's, so it names materials — and
    // §8.1 derives `materiais` from the acabamento rather than from the prose.
    // Nothing else stops the two from disagreeing, and the PDP prints them side
    // by side: the copy would claim a joint in freijó while Cuidados carries
    // carvalho's care line.
    const MADEIRAS_POR_PALAVRA: Record<string, string> = {
      carvalho: "carvalho",
      freijó: "freijo",
      nogueira: "nogueira",
      jatobá: "jatoba",
    };

    for (const p of ESCRITORIO) {
      const prosa = p.descricao.toLowerCase();
      for (const [palavra, slug] of Object.entries(MADEIRAS_POR_PALAVRA)) {
        if (prosa.includes(palavra)) expect(p.materiais).toContain(slug);
      }
    }
  });
});
