import { describe, expect, test } from "bun:test";
import {
  ambiente,
  cor,
  familia,
  material,
  precoAVista,
  rotulosMedidasExtras,
  todosOsProdutos,
} from "../lib/catalogo";
import type { Medidas, Produto } from "../lib/catalogo";
import { exigirProduto as buscar, MADEIRAS } from "./helpers/catalogo";

// dados.md §3.1 — the Sala slice, transcribed. Every figure below is the
// spec's: identity from §3.1, the régua budget from §7.3, the envelopes from
// §8.2, the promo and frete pieces from §3.8. Nothing here asserts how the
// module is laid out, only what a caller reads back.

/** §3.1, verbatim. `Preço` is reais in the table and centavos in the record. */
const LINHAS: Array<{
  ordem: number;
  slug: string;
  nome: string;
  acabamento: string;
  tipo: string;
  reais: number;
  disponibilidade: Produto["disponibilidade"];
}> = [
  { ordem: 1, slug: "sofa-heron-linho-cru", nome: "Sofá Héron", acabamento: "Linho Cru", tipo: "sofas", reais: 9800, disponibilidade: "sob-encomenda" },
  { ordem: 2, slug: "sofa-heron-boucle-areia", nome: "Sofá Héron", acabamento: "Bouclé Areia", tipo: "sofas", reais: 11400, disponibilidade: "sob-encomenda" },
  { ordem: 3, slug: "sofa-orla-linho-areia", nome: "Sofá Orla", acabamento: "Linho Areia", tipo: "sofas", reais: 7600, disponibilidade: "envio-imediato" },
  { ordem: 4, slug: "sofa-taipa-couro-argila", nome: "Sofá Taipa", acabamento: "Couro Argila", tipo: "sofas", reais: 14200, disponibilidade: "esgotado" },
  { ordem: 5, slug: "sofa-maruja-linho-carvao", nome: "Sofá Marujá", acabamento: "Linho Carvão", tipo: "sofas", reais: 8400, disponibilidade: "sob-encomenda" },
  { ordem: 6, slug: "poltrona-lina-linho-cru", nome: "Poltrona Lina", acabamento: "Linho Cru", tipo: "poltronas", reais: 3890, disponibilidade: "sob-encomenda" },
  { ordem: 7, slug: "poltrona-lina-boucle-carvalho", nome: "Poltrona Lina", acabamento: "Bouclé Carvalho", tipo: "poltronas", reais: 4200, disponibilidade: "envio-imediato" },
  { ordem: 8, slug: "poltrona-sagui-couro-nogueira", nome: "Poltrona Saguí", acabamento: "Couro Nogueira", tipo: "poltronas", reais: 5600, disponibilidade: "sob-encomenda" },
  { ordem: 9, slug: "mesa-de-centro-seixo-freijo", nome: "Mesa de Centro Seixo", acabamento: "Freijó", tipo: "mesas-de-centro", reais: 2400, disponibilidade: "envio-imediato" },
  { ordem: 10, slug: "mesa-de-centro-luar-marmore-off-white", nome: "Mesa de Centro Luar", acabamento: "Mármore Off-white", tipo: "mesas-de-centro", reais: 4900, disponibilidade: "sob-encomenda" },
  { ordem: 11, slug: "mesa-de-centro-vau-jatoba", nome: "Mesa de Centro Vau", acabamento: "Jatobá", tipo: "mesas-de-centro", reais: 3100, disponibilidade: "envio-imediato" },
  { ordem: 12, slug: "mesa-de-jantar-vargem-carvalho", nome: "Mesa de Jantar Vargem", acabamento: "Carvalho", tipo: "mesas-de-jantar", reais: 8900, disponibilidade: "sob-encomenda" },
  { ordem: 13, slug: "mesa-de-jantar-vargem-nogueira", nome: "Mesa de Jantar Vargem", acabamento: "Nogueira", tipo: "mesas-de-jantar", reais: 9600, disponibilidade: "sob-encomenda" },
  { ordem: 14, slug: "mesa-de-jantar-ilhota-jatoba", nome: "Mesa de Jantar Ilhota", acabamento: "Jatobá", tipo: "mesas-de-jantar", reais: 12800, disponibilidade: "sob-encomenda" },
  { ordem: 15, slug: "estante-cais-freijo", nome: "Estante Cais", acabamento: "Freijó", tipo: "racks-e-estantes", reais: 6400, disponibilidade: "sob-encomenda" },
  { ordem: 16, slug: "rack-varjao-carvalho", nome: "Rack Varjão", acabamento: "Carvalho", tipo: "racks-e-estantes", reais: 5200, disponibilidade: "envio-imediato" },
  { ordem: 17, slug: "estante-tramo-aco-carvao", nome: "Estante Tramo", acabamento: "Aço Carvão", tipo: "racks-e-estantes", reais: 4100, disponibilidade: "envio-imediato" },
  { ordem: 18, slug: "aparador-sereno-carvalho", nome: "Aparador Sereno", acabamento: "Carvalho", tipo: "aparadores", reais: 4600, disponibilidade: "sob-encomenda" },
  { ordem: 19, slug: "aparador-pedra-marmore-cru", nome: "Aparador Pedra", acabamento: "Mármore Cru", tipo: "aparadores", reais: 7200, disponibilidade: "sob-encomenda" },
  { ordem: 20, slug: "aparador-junco-palhinha-freijo", nome: "Aparador Junco", acabamento: "Palhinha e Freijó", tipo: "aparadores", reais: 3400, disponibilidade: "envio-imediato" },
];

/** An axis's range in §8.2's table, in cm: `[mínimo, máximo]`. */
type Faixa = [number, number];

/** §8.2, for the six tipos the room exposes. */
const ENVELOPES: Record<string, Record<keyof Medidas, Faixa>> = {
  sofas: { largura: [180, 260], profundidade: [88, 102], altura: [68, 82] },
  poltronas: { largura: [68, 92], profundidade: [74, 88], altura: [70, 84] },
  "mesas-de-centro": { largura: [90, 130], profundidade: [55, 75], altura: [32, 42] },
  "mesas-de-jantar": { largura: [160, 240], profundidade: [85, 100], altura: [74, 78] },
  "racks-e-estantes": { largura: [90, 200], profundidade: [32, 45], altura: [140, 210] },
  aparadores: { largura: [120, 180], profundidade: [38, 48], altura: [75, 88] },
};

/** The room's slice, read once — `todosOsProdutos` composes the whole set. */
const SALA: Produto[] = todosOsProdutos().filter((p) => p.ambientePrincipal === "sala");

const FAMILIAS_DA_SALA: string[] = [...new Set(SALA.map((p) => p.familia))];

const EIXOS = ["largura", "profundidade", "altura"] as const;

/** The bounding volume, in cm³ — what "a larger piece" means across the trio. */
const volume = ({ largura, profundidade, altura }: Medidas) => largura * profundidade * altura;

describe("§3.1 — the twenty rows", () => {
  test("every row is transcribed, and nothing else lists sala as its room", () => {
    expect(SALA.map((p) => p.slug)).toEqual(LINHAS.map((l) => l.slug));
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
      expect(p.ambientePrincipal).toBe("sala");
      expect(p.ambientes[0]).toBe("sala");
    });
  }

  test("one record per acabamento — every slug is its own", () => {
    const slugs = SALA.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("a prazo de produção is stated iff the piece is sob-encomenda", () => {
    // produto.md — `required iff 'sob-encomenda'`.
    for (const p of SALA) {
      if (p.disponibilidade === "sob-encomenda") {
        expect(p.prazoProducaoSemanas).toBeGreaterThan(0);
      } else {
        expect(p.prazoProducaoSemanas).toBeUndefined();
      }
    }
  });

  test("precoDe and freteGratis land on exactly the pieces §3.8 names", () => {
    const comPrecoDe = SALA.filter((p) => p.precoDe !== undefined);
    expect(comPrecoDe.map((p) => [p.slug, p.precoDe])).toEqual([
      ["sofa-orla-linho-areia", 890000],
      ["rack-varjao-carvalho", 590000],
    ]);
    for (const p of comPrecoDe) expect(p.precoDe!).toBeGreaterThan(p.precoTabela);

    expect(SALA.filter((p) => p.freteGratis).map((p) => [p.slug, p.freteGratis])).toEqual([
      ["sofa-heron-linho-cru", "sudeste"],
      ["sofa-taipa-couro-argila", "nacional"],
      ["mesa-de-jantar-ilhota-jatoba", "sudeste"],
    ]);
  });

  test("the coleções' sala pieces list the coleção back", () => {
    expect(buscar("mesa-de-centro-luar-marmore-off-white").colecoes).toEqual(["reboco"]);
    expect(buscar("aparador-pedra-marmore-cru").colecoes).toEqual(["reboco"]);
    expect(buscar("mesa-de-jantar-ilhota-jatoba").colecoes).toEqual(["serra"]);
    expect(buscar("aparador-sereno-carvalho").colecoes).toEqual(["serra"]);
  });

  test("the room's curated tipos[] covers every transcribed tipo", () => {
    const curados = ambiente("sala")!.tipos;
    for (const p of SALA) expect(curados).toContain(p.tipo);
  });
});

describe("famílias", () => {
  test("acabamentos of one família share medidas exactly", () => {
    for (const slug of FAMILIAS_DA_SALA) {
      for (const p of SALA.filter((acabamento) => acabamento.familia === slug)) {
        expect(p.medidas).toEqual(familia(slug)!.medidas);
      }
    }
  });

  test("the two-acabamento famílias §3.7 names carry two rows here", () => {
    const pares = FAMILIAS_DA_SALA.filter(
      (slug) => SALA.filter((p) => p.familia === slug).length === 2,
    );
    expect(pares.sort()).toEqual(["mesa-de-jantar-vargem", "poltrona-lina", "sofa-heron"]);
  });

  test("every família carries medidas, designer and desenho", () => {
    for (const slug of FAMILIAS_DA_SALA) {
      const fam = familia(slug)!;
      expect(fam.nome.length).toBeGreaterThan(0);
      expect(fam.designer.length).toBeGreaterThan(0);
      expect(fam.desenho.alt.length).toBeGreaterThan(0);
    }
  });

  test("desenho is inline SVG in the régua's stroke grammar", () => {
    for (const slug of FAMILIAS_DA_SALA) {
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
    for (const p of SALA) {
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
    // família, at the lowest price its acabamentos carry. "Larger" is the
    // piece as a whole: no axis may shrink as the price rises, and the piece
    // has to actually grow — a tipo whose envelope is four centímetres tall
    // cannot afford a strict increase on every axis.
    for (const tipoSlug of Object.keys(ENVELOPES)) {
      const doTipo = SALA.filter((p) => p.tipo === tipoSlug);
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
    for (const p of SALA) {
      expect(p.imagens.filter((i) => i.papel === "principal")).toHaveLength(1);
      expect(p.imagens[0]!.papel).toBe("principal");
    }
  });

  test("every src is a phase-1 Unsplash hotlink", () => {
    for (const p of SALA) {
      for (const imagem of p.imagens) {
        expect(imagem.src.startsWith("https://images.unsplash.com/photo-")).toBe(true);
      }
    }
  });

  test("no decorative image exists — alt is never empty", () => {
    for (const p of SALA) {
      for (const imagem of p.imagens) expect(imagem.alt.trim().length).toBeGreaterThan(0);
    }
  });

  test("principal and ambientada are templated; detalhe is authored", () => {
    for (const p of SALA) {
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
    const comCota = SALA
      .flatMap((p) => p.imagens.map((i) => ({ slug: p.slug, cotas: i.cotas })))
      .filter((i) => i.cotas.length > 0);
    expect(comCota).toEqual([
      { slug: "sofa-heron-linho-cru", cotas: ["largura"] },
      { slug: "poltrona-lina-linho-cru", cotas: ["largura"] },
    ]);
  });

  test("a cota is only ever declared where medidas supplies the figure", () => {
    for (const p of SALA) {
      for (const imagem of p.imagens) {
        for (const cota of imagem.cotas) expect(p.medidas[cota]).toBeGreaterThan(0);
      }
    }
  });

  test("the poltrona-lina pair is two visibly different photographs", () => {
    // imagens.md §10.3 — the cart thumbnail's one argument, at 96px.
    const cru = buscar("poltrona-lina-linho-cru");
    const boucle = buscar("poltrona-lina-boucle-carvalho");
    expect(boucle.imagens[0]!.src).not.toBe(cru.imagens[0]!.src);
    expect(boucle.imagens[0]!.alt).not.toBe(cru.imagens[0]!.alt);
  });

  test("ambientada and detalhe stay rare — §9.3's volume rule", () => {
    const extras = SALA.flatMap((p) => p.imagens.filter((i) => i.papel !== "principal"));
    expect(extras.length).toBeLessThan(SALA.length);
    // §7.2 — one produto per ambiente carries all three roles.
    expect(buscar("poltrona-lina-linho-cru").imagens.map((i) => i.papel)).toEqual([
      "principal",
      "ambientada",
      "detalhe",
    ]);
  });
});

describe("the derivations produce sane output for every row", () => {
  test("cor and materiais resolve against the taxonomy", () => {
    for (const p of SALA) {
      expect(cor(p.cor)).toBeDefined();
      expect(p.materiais.length).toBeGreaterThan(0);
      for (const slug of p.materiais) expect(material(slug)?.cuidados.length).toBeGreaterThan(0);
    }
  });

  test("a piece that names only a surface gains its structural wood", () => {
    // §8.1's rule. Its stated consequence — that every produto has ≥2
    // materiais — does not follow for the bare-wood acabamentos this room is
    // the first to carry: `Carvalho` names the structural material itself, so
    // the rule adds nothing and the Cuidados union is one line. The rule wins
    // over the consequence, the same way §8.4 won over produto.md's example.
    for (const p of SALA) {
      expect(p.materiais.some((m) => MADEIRAS.includes(m))).toBe(true);
      if (!MADEIRAS.includes(p.materiais[0]!)) expect(p.materiais).toHaveLength(2);
    }
  });

  test("embalagem is the piece plus §8.4's margin, and weighs something", () => {
    for (const p of SALA) {
      expect(p.embalagem.largura).toBe(p.medidas.largura + 8);
      expect(p.embalagem.profundidade).toBe(p.medidas.profundidade + 8);
      expect(p.embalagem.altura).toBe(p.medidas.altura + 6);
      expect(p.embalagem.pesoKg).toBeGreaterThan(0);
      expect(p.embalagem.volumes).toBeGreaterThanOrEqual(1);
    }
  });

  test("montagem and itensInclusos follow the tipo", () => {
    for (const p of SALA) {
      // No sala tipo is a luminária, so every piece here is assembled.
      expect(p.montagem.necessaria).toBe(true);
      expect(p.montagem.pecas).toBeGreaterThan(0);
      expect(p.itensInclusos[0]!.startsWith("1 ")).toBe(true);
      expect(p.itensInclusos).toContain("manual de montagem");
    }
  });

  test("medidasExtras carries exactly the rows its tipo rules", () => {
    for (const p of SALA) {
      expect(p.medidasExtras.map((m) => m.rotulo)).toEqual(rotulosMedidasExtras(p.tipo));
      for (const linha of p.medidasExtras) expect(linha.valor).toBeGreaterThan(0);
    }
  });

  test("the à-vista price is a discount on the one authored number", () => {
    for (const p of SALA) expect(precoAVista(p.precoTabela)).toBeLessThan(p.precoTabela);
  });

  test("every row takes the store's garantia", () => {
    for (const p of SALA) expect(p.garantiaMeses).toBeUndefined();
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
});
