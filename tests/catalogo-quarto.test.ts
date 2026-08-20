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

// dados.md §3.2 — the Quarto slice, transcribed. Every figure below is the
// spec's: identity from §3.2, the régua budget from §7.3, the envelopes from
// §8.2, the frete pieces from §3.8. Nothing here asserts how the module is laid
// out, only what a caller reads back.

/** §3.2, verbatim. `Preço` is reais in the table and centavos in the record. */
const LINHAS: Array<{
  ordem: number;
  slug: string;
  nome: string;
  acabamento: string;
  tipo: string;
  reais: number;
  disponibilidade: Produto["disponibilidade"];
}> = [
  { ordem: 21, slug: "cama-nuvem-linho-cru", nome: "Cama Nuvem", acabamento: "Linho Cru", tipo: "camas", reais: 8200, disponibilidade: "sob-encomenda" },
  { ordem: 22, slug: "cama-nuvem-boucle-areia", nome: "Cama Nuvem", acabamento: "Bouclé Areia", tipo: "camas", reais: 9100, disponibilidade: "sob-encomenda" },
  { ordem: 23, slug: "cama-orvalho-carvalho", nome: "Cama Orvalho", acabamento: "Carvalho", tipo: "camas", reais: 7400, disponibilidade: "envio-imediato" },
  { ordem: 24, slug: "cama-tatami-freijo", nome: "Cama Tatami", acabamento: "Freijó", tipo: "camas", reais: 6800, disponibilidade: "sob-encomenda" },
  { ordem: 25, slug: "cama-abrigo-couro-argila", nome: "Cama Abrigo", acabamento: "Couro Argila", tipo: "camas", reais: 13500, disponibilidade: "sob-encomenda" },
  { ordem: 26, slug: "cabeceira-vela-linho-areia", nome: "Cabeceira Vela", acabamento: "Linho Areia", tipo: "cabeceiras", reais: 3200, disponibilidade: "envio-imediato" },
  { ordem: 27, slug: "cabeceira-vela-boucle-cru", nome: "Cabeceira Vela", acabamento: "Bouclé Cru", tipo: "cabeceiras", reais: 3600, disponibilidade: "sob-encomenda" },
  { ordem: 28, slug: "cabeceira-ripado-carvalho", nome: "Cabeceira Ripado", acabamento: "Carvalho", tipo: "cabeceiras", reais: 4400, disponibilidade: "sob-encomenda" },
  { ordem: 29, slug: "criado-mudo-seixo-freijo", nome: "Criado-mudo Seixo", acabamento: "Freijó", tipo: "criados-mudos", reais: 1850, disponibilidade: "envio-imediato" },
  { ordem: 30, slug: "criado-mudo-luar-nogueira", nome: "Criado-mudo Luar", acabamento: "Nogueira", tipo: "criados-mudos", reais: 2300, disponibilidade: "sob-encomenda" },
  { ordem: 31, slug: "criado-mudo-junco-palhinha", nome: "Criado-mudo Junco", acabamento: "Palhinha e Freijó", tipo: "criados-mudos", reais: 1680, disponibilidade: "envio-imediato" },
  { ordem: 32, slug: "comoda-vargem-carvalho", nome: "Cômoda Vargem", acabamento: "Carvalho", tipo: "comodas", reais: 5800, disponibilidade: "sob-encomenda" },
  { ordem: 33, slug: "comoda-tramo-nogueira", nome: "Cômoda Tramo", acabamento: "Nogueira", tipo: "comodas", reais: 6900, disponibilidade: "sob-encomenda" },
  { ordem: 34, slug: "comoda-bruma-freijo", nome: "Cômoda Bruma", acabamento: "Freijó", tipo: "comodas", reais: 4700, disponibilidade: "esgotado" },
  { ordem: 35, slug: "guarda-roupa-cais-carvalho", nome: "Guarda-roupa Cais", acabamento: "Carvalho", tipo: "guarda-roupas", reais: 15600, disponibilidade: "sob-encomenda" },
  { ordem: 36, slug: "guarda-roupa-ripado-freijo", nome: "Guarda-roupa Ripado", acabamento: "Freijó", tipo: "guarda-roupas", reais: 11900, disponibilidade: "sob-encomenda" },
  { ordem: 37, slug: "guarda-roupa-bruma-nogueira", nome: "Guarda-roupa Bruma", acabamento: "Nogueira", tipo: "guarda-roupas", reais: 13200, disponibilidade: "sob-encomenda" },
];

/** An axis's range in §8.2's table, in cm: `[mínimo, máximo]`. */
type Faixa = [number, number];

/** §8.2, for the five tipos the room exposes. */
const ENVELOPES: Record<string, Record<keyof Medidas, Faixa>> = {
  camas: { largura: [145, 200], profundidade: [200, 215], altura: [35, 110] },
  cabeceiras: { largura: [145, 200], profundidade: [8, 14], altura: [90, 120] },
  "criados-mudos": { largura: [45, 60], profundidade: [38, 45], altura: [50, 62] },
  comodas: { largura: [90, 140], profundidade: [45, 52], altura: [75, 95] },
  "guarda-roupas": { largura: [160, 260], profundidade: [58, 65], altura: [210, 240] },
};

/** The room's slice, read once — `todosOsProdutos` composes the whole set. */
const QUARTO: Produto[] = todosOsProdutos().filter((p) => p.ambientePrincipal === "quarto");

const FAMILIAS_DO_QUARTO: string[] = [...new Set(QUARTO.map((p) => p.familia))];

const EIXOS = ["largura", "profundidade", "altura"] as const;

/** The bounding volume, in cm³ — what "a larger piece" means across the trio. */
const volume = ({ largura, profundidade, altura }: Medidas) => largura * profundidade * altura;

describe("§3.2 — the seventeen rows", () => {
  test("every row is transcribed, and nothing else lists quarto as its room", () => {
    expect(QUARTO.map((p) => p.slug)).toEqual(LINHAS.map((l) => l.slug));
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
      expect(p.ambientePrincipal).toBe("quarto");
      expect(p.ambientes[0]).toBe("quarto");
    });
  }

  test("one record per acabamento — every slug is its own", () => {
    const slugs = QUARTO.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("a prazo de produção is stated iff the piece is sob-encomenda", () => {
    // produto.md — `required iff 'sob-encomenda'`.
    for (const p of QUARTO) {
      if (p.disponibilidade === "sob-encomenda") {
        expect(p.prazoProducaoSemanas).toBeGreaterThan(0);
      } else {
        expect(p.prazoProducaoSemanas).toBeUndefined();
      }
    }
  });

  test("no quarto piece is marked down, and freteGratis lands where §3.8 says", () => {
    // §3.8 names three precoDe pieces — #3 and #16 in sala, #43 in cozinha.
    expect(QUARTO.filter((p) => p.precoDe !== undefined)).toEqual([]);

    expect(QUARTO.filter((p) => p.freteGratis).map((p) => [p.slug, p.freteGratis])).toEqual([
      ["cama-abrigo-couro-argila", "sudeste"],
      ["guarda-roupa-cais-carvalho", "nacional"],
    ]);
  });

  test("the coleções' quarto pieces list the coleção back", () => {
    expect(buscar("cabeceira-vela-linho-areia").colecoes).toEqual(["reboco"]);
    expect(buscar("comoda-tramo-nogueira").colecoes).toEqual(["serra"]);
  });

  test("the cross-listed criado-mudo carries §3.6's second room", () => {
    expect(buscar("criado-mudo-junco-palhinha").ambientes).toEqual(["quarto", "sala"]);
  });

  test("the room's curated tipos[] covers every transcribed tipo", () => {
    const curados = ambiente("quarto")!.tipos;
    for (const p of QUARTO) expect(curados).toContain(p.tipo);
  });
});

describe("famílias", () => {
  test("acabamentos of one família share medidas exactly", () => {
    for (const slug of FAMILIAS_DO_QUARTO) {
      for (const p of QUARTO.filter((acabamento) => acabamento.familia === slug)) {
        expect(p.medidas).toEqual(familia(slug)!.medidas);
      }
    }
  });

  test("the two-acabamento famílias §3.7 names carry two rows here", () => {
    const pares = FAMILIAS_DO_QUARTO.filter(
      (slug) => QUARTO.filter((p) => p.familia === slug).length === 2,
    );
    expect(pares.sort()).toEqual(["cabeceira-vela", "cama-nuvem"]);
  });

  test("every família carries medidas, designer and desenho", () => {
    for (const slug of FAMILIAS_DO_QUARTO) {
      const fam = familia(slug)!;
      expect(fam.nome.length).toBeGreaterThan(0);
      expect(fam.designer.length).toBeGreaterThan(0);
      expect(fam.desenho.alt.length).toBeGreaterThan(0);
    }
  });

  test("desenho is inline SVG in the régua's stroke grammar", () => {
    for (const slug of FAMILIAS_DO_QUARTO) {
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
    for (const p of QUARTO) {
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
      const doTipo = QUARTO.filter((p) => p.tipo === tipoSlug);
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
    for (const p of QUARTO) {
      expect(p.imagens.filter((i) => i.papel === "principal")).toHaveLength(1);
      expect(p.imagens[0]!.papel).toBe("principal");
    }
  });

  test("every src is a phase-1 Unsplash hotlink", () => {
    for (const p of QUARTO) {
      for (const imagem of p.imagens) {
        expect(imagem.src.startsWith("https://images.unsplash.com/photo-")).toBe(true);
      }
    }
  });

  test("no decorative image exists — alt is never empty", () => {
    for (const p of QUARTO) {
      for (const imagem of p.imagens) expect(imagem.alt.trim().length).toBeGreaterThan(0);
    }
  });

  test("principal and ambientada are templated; detalhe is authored", () => {
    for (const p of QUARTO) {
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
    const comCota = QUARTO.flatMap((p) => p.imagens.map((i) => ({ slug: p.slug, cotas: i.cotas })))
      .filter((i) => i.cotas.length > 0);
    expect(comCota).toEqual([{ slug: "cama-nuvem-linho-cru", cotas: ["largura"] }]);
  });

  test("a cota is only ever declared where medidas supplies the figure", () => {
    for (const p of QUARTO) {
      for (const imagem of p.imagens) {
        for (const cota of imagem.cotas) expect(p.medidas[cota]).toBeGreaterThan(0);
      }
    }
  });

  test("no image record authors a ratio — it is computed from medidas", () => {
    // imagens.md §3. The record carries the four fields the shape names and
    // nothing else, so a proportion can only ever come from `medidas`.
    for (const p of QUARTO) {
      for (const imagem of p.imagens) {
        expect(Object.keys(imagem).sort()).toEqual(["alt", "cotas", "papel", "src"]);
      }
    }
  });

  test("the carve-out pair stays visibly distinct where it cross-lists here", () => {
    // imagens.md §10.3 — poltrona-lina lists quarto as a second room (§3.6),
    // so the cart thumbnail's one argument has to survive in this room too.
    const cru = buscar("poltrona-lina-linho-cru");
    const boucle = buscar("poltrona-lina-boucle-carvalho");
    expect(cru.ambientes).toContain("quarto");
    expect(boucle.ambientes).toContain("quarto");
    expect(boucle.imagens[0]!.src).not.toBe(cru.imagens[0]!.src);
    expect(boucle.imagens[0]!.alt).not.toBe(cru.imagens[0]!.alt);
  });

  test("ambientada and detalhe stay rare — §9.3's volume rule", () => {
    const extras = QUARTO.flatMap((p) => p.imagens.filter((i) => i.papel !== "principal"));
    expect(extras.length).toBeLessThan(QUARTO.length);
    // §7.2 — one produto per ambiente carries all three roles.
    expect(buscar("cama-nuvem-linho-cru").imagens.map((i) => i.papel)).toEqual([
      "principal",
      "ambientada",
      "detalhe",
    ]);
  });
});

describe("the derivations produce sane output for every row", () => {
  test("cor and materiais resolve against the taxonomy", () => {
    for (const p of QUARTO) {
      expect(cor(p.cor)).toBeDefined();
      expect(p.materiais.length).toBeGreaterThan(0);
      for (const slug of p.materiais) expect(material(slug)?.cuidados.length).toBeGreaterThan(0);
    }
  });

  test("a piece that names only a surface gains its structural wood", () => {
    // §8.1's rule, and the same deviation the Sala transcription recorded: the
    // section's stated consequence — that every produto has ≥2 materiais — does
    // not follow for a bare-wood acabamento, because `Carvalho` names the
    // structural material itself and the rule then adds nothing. Quarto is
    // where that bites at scale: ten of these seventeen rows carry one
    // material, so their Cuidados union is one line. The rule wins over the
    // consequence; changing it would need a spec correction, not a record.
    for (const p of QUARTO) {
      expect(p.materiais.some((m) => MADEIRAS.includes(m))).toBe(true);
      if (!MADEIRAS.includes(p.materiais[0]!)) expect(p.materiais).toHaveLength(2);
    }
  });

  test("embalagem is the piece plus §8.4's margin, and weighs something", () => {
    for (const p of QUARTO) {
      expect(p.embalagem.largura).toBe(p.medidas.largura + 8);
      expect(p.embalagem.profundidade).toBe(p.medidas.profundidade + 8);
      expect(p.embalagem.altura).toBe(p.medidas.altura + 6);
      expect(p.embalagem.pesoKg).toBeGreaterThan(0);
    }
  });

  test("the room's multi-volume tipos ship in the number §8.4 fixes", () => {
    // Quarto is the only room that reaches `guarda-roupas 3`, §8.4's largest
    // case; `camas 2` is also its own, and the rest of the room ships in one.
    const VOLUMES: Record<string, number> = { camas: 2, "guarda-roupas": 3 };
    for (const p of QUARTO) expect(p.embalagem.volumes).toBe(VOLUMES[p.tipo] ?? 1);
  });

  test("montagem and itensInclusos follow the tipo", () => {
    for (const p of QUARTO) {
      // No quarto tipo is a luminária, so every piece here is assembled.
      expect(p.montagem.necessaria).toBe(true);
      expect(p.montagem.pecas).toBeGreaterThan(0);
      expect(p.itensInclusos[0]!.startsWith("1 ")).toBe(true);
      expect(p.itensInclusos).toContain("manual de montagem");
    }
  });

  test("medidasExtras carries exactly the rows its tipo rules", () => {
    for (const p of QUARTO) {
      expect(p.medidasExtras.map((m) => m.rotulo)).toEqual(rotulosMedidasExtras(p.tipo));
      for (const linha of p.medidasExtras) expect(linha.valor).toBeGreaterThan(0);
    }
  });

  test("cabeceiras carry none, which is the empty case §8.3 wants rendered", () => {
    for (const p of QUARTO.filter((linha) => linha.tipo === "cabeceiras")) {
      expect(p.medidasExtras).toEqual([]);
    }
  });

  test("the à-vista price is a discount on the one authored number", () => {
    for (const p of QUARTO) expect(precoAVista(p.precoTabela)).toBeLessThan(p.precoTabela);
  });

  test("every row takes the store's garantia", () => {
    for (const p of QUARTO) expect(p.garantiaMeses).toBeUndefined();
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
