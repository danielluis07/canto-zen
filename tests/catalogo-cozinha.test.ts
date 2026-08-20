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

// dados.md §3.3 — the Cozinha slice, transcribed. Every figure below is the
// spec's: identity from §3.3, the régua budget from §7.3, the envelopes from
// §8.2, the marked-down piece from §3.8. Nothing here asserts how the module is
// laid out, only what a caller reads back.

/** §3.3, verbatim. `Preço` is reais in the table and centavos in the record. */
const LINHAS: Array<{
  ordem: number;
  slug: string;
  nome: string;
  acabamento: string;
  tipo: string;
  reais: number;
  disponibilidade: Produto["disponibilidade"];
}> = [
  { ordem: 38, slug: "mesa-taipa-jatoba", nome: "Mesa Taipa", acabamento: "Jatobá", tipo: "mesas", reais: 6200, disponibilidade: "sob-encomenda" },
  { ordem: 39, slug: "mesa-orla-carvalho", nome: "Mesa Orla", acabamento: "Carvalho", tipo: "mesas", reais: 5400, disponibilidade: "envio-imediato" },
  { ordem: 40, slug: "mesa-pedra-marmore-carvao", nome: "Mesa Pedra", acabamento: "Mármore Carvão", tipo: "mesas", reais: 9800, disponibilidade: "sob-encomenda" },
  { ordem: 41, slug: "cadeira-junco-palhinha-freijo", nome: "Cadeira Junco", acabamento: "Palhinha e Freijó", tipo: "cadeiras", reais: 1480, disponibilidade: "envio-imediato" },
  { ordem: 42, slug: "cadeira-junco-couro-argila", nome: "Cadeira Junco", acabamento: "Couro Argila", tipo: "cadeiras", reais: 1920, disponibilidade: "sob-encomenda" },
  { ordem: 43, slug: "cadeira-vime-rattan-cru", nome: "Cadeira Vime", acabamento: "Rattan Cru", tipo: "cadeiras", reais: 1240, disponibilidade: "envio-imediato" },
  { ordem: 44, slug: "cadeira-tramo-aco-carvao", nome: "Cadeira Tramo", acabamento: "Aço Carvão", tipo: "cadeiras", reais: 980, disponibilidade: "envio-imediato" },
  { ordem: 45, slug: "banqueta-seixo-carvalho", nome: "Banqueta Seixo", acabamento: "Carvalho", tipo: "banquetas", reais: 1180, disponibilidade: "envio-imediato" },
  { ordem: 46, slug: "banqueta-vau-freijo", nome: "Banqueta Vau", acabamento: "Freijó", tipo: "banquetas", reais: 1350, disponibilidade: "sob-encomenda" },
  { ordem: 47, slug: "banqueta-tramo-aco-carvao", nome: "Banqueta Tramo", acabamento: "Aço Carvão", tipo: "banquetas", reais: 890, disponibilidade: "envio-imediato" },
  { ordem: 48, slug: "armario-cais-carvalho", nome: "Armário Cais", acabamento: "Carvalho", tipo: "armarios", reais: 8600, disponibilidade: "sob-encomenda" },
  { ordem: 49, slug: "armario-ripado-freijo", nome: "Armário Ripado", acabamento: "Freijó", tipo: "armarios", reais: 7100, disponibilidade: "sob-encomenda" },
  { ordem: 50, slug: "armario-bruma-off-white", nome: "Armário Bruma", acabamento: "Laca Off-white", tipo: "armarios", reais: 6300, disponibilidade: "envio-imediato" },
  { ordem: 51, slug: "carrinho-roldana-aco-carvao", nome: "Carrinho Roldana", acabamento: "Aço Carvão", tipo: "carrinhos-e-apoios", reais: 2100, disponibilidade: "envio-imediato" },
  { ordem: 52, slug: "carrinho-junco-rattan-cru", nome: "Carrinho Junco", acabamento: "Rattan Cru", tipo: "carrinhos-e-apoios", reais: 1740, disponibilidade: "envio-imediato" },
  { ordem: 53, slug: "mesa-de-apoio-luar-marmore-cru", nome: "Mesa de Apoio Luar", acabamento: "Mármore Cru", tipo: "carrinhos-e-apoios", reais: 2680, disponibilidade: "sob-encomenda" },
];

/** An axis's range in §8.2's table, in cm: `[mínimo, máximo]`. */
type Faixa = [number, number];

/** §8.2, for the five tipos the room exposes. */
const ENVELOPES: Record<string, Record<keyof Medidas, Faixa>> = {
  mesas: { largura: [120, 180], profundidade: [75, 90], altura: [74, 78] },
  cadeiras: { largura: [44, 58], profundidade: [48, 60], altura: [78, 92] },
  banquetas: { largura: [38, 46], profundidade: [38, 46], altura: [62, 76] },
  armarios: { largura: [80, 160], profundidade: [40, 55], altura: [180, 220] },
  "carrinhos-e-apoios": { largura: [40, 75], profundidade: [38, 55], altura: [55, 78] },
};

/** The room's slice, read once — `todosOsProdutos` composes the whole set. */
const COZINHA: Produto[] = todosOsProdutos().filter((p) => p.ambientePrincipal === "cozinha");

const FAMILIAS_DA_COZINHA: string[] = [...new Set(COZINHA.map((p) => p.familia))];

const EIXOS = ["largura", "profundidade", "altura"] as const;

/** The bounding volume, in cm³ — what "a larger piece" means across the trio. */
const volume = ({ largura, profundidade, altura }: Medidas) => largura * profundidade * altura;

describe("§3.3 — the sixteen rows", () => {
  test("every row is transcribed, and nothing else lists cozinha as its room", () => {
    expect(COZINHA.map((p) => p.slug)).toEqual(LINHAS.map((l) => l.slug));
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
      expect(p.ambientePrincipal).toBe("cozinha");
      expect(p.ambientes[0]).toBe("cozinha");
    });
  }

  test("one record per acabamento — every slug is its own", () => {
    const slugs = COZINHA.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  test("a prazo de produção is stated iff the piece is sob-encomenda", () => {
    // produto.md — `required iff 'sob-encomenda'`.
    for (const p of COZINHA) {
      if (p.disponibilidade === "sob-encomenda") {
        expect(p.prazoProducaoSemanas).toBeGreaterThan(0);
      } else {
        expect(p.prazoProducaoSemanas).toBeUndefined();
      }
    }
  });

  test("the room holds §3.8's third precoDe piece and none of its freteGratis", () => {
    // §3.8 names #43 `cadeira-vime-rattan-cru` (de 1.480) and puts every
    // freteGratis piece in sala or quarto.
    expect(COZINHA.filter((p) => p.precoDe !== undefined).map((p) => [p.slug, p.precoDe])).toEqual([
      ["cadeira-vime-rattan-cru", 148000],
    ]);
    expect(COZINHA.filter((p) => p.freteGratis)).toEqual([]);
  });

  test("no piece here is esgotado — §3.8 spends that state elsewhere", () => {
    // The three `X` rows are #4, #34 and #63: sala, quarto, escritório.
    expect(COZINHA.filter((p) => p.disponibilidade === "esgotado")).toEqual([]);
  });

  test("the coleção's cozinha piece lists the coleção back", () => {
    // §2.6 — `serra` carries `cadeira-junco-couro-argila`, and nothing else here.
    expect(buscar("cadeira-junco-couro-argila").colecoes).toEqual(["serra"]);
    expect(COZINHA.filter((p) => p.colecoes.length > 0).map((p) => p.slug)).toEqual([
      "cadeira-junco-couro-argila",
    ]);
  });

  test("the three cross-listed pieces carry §3.6's second room", () => {
    for (const slug of [
      "cadeira-junco-palhinha-freijo",
      "banqueta-seixo-carvalho",
      "mesa-de-apoio-luar-marmore-cru",
    ]) {
      expect(buscar(slug).ambientes).toEqual(["cozinha", "sala"]);
    }
    // Everything else lists under one room only.
    const cruzadas = COZINHA.filter((p) => p.ambientes.length > 1).map((p) => p.slug);
    expect(cruzadas.sort()).toEqual(
      [
        "banqueta-seixo-carvalho",
        "cadeira-junco-palhinha-freijo",
        "mesa-de-apoio-luar-marmore-cru",
      ].sort(),
    );
  });

  test("the room's curated tipos[] covers every transcribed tipo", () => {
    const curados = ambiente("cozinha")!.tipos;
    for (const p of COZINHA) expect(curados).toContain(p.tipo);
  });

  test("nothing cross-lists into cozinha, so the room route is its own sixteen", () => {
    // §1.3 — `/cozinha` renders 16, which only holds if no other room's piece
    // names cozinha in `ambientes[]`.
    const listadas = todosOsProdutos().filter((p) => p.ambientes.includes("cozinha"));
    expect(listadas.map((p) => p.slug)).toEqual(COZINHA.map((p) => p.slug));
  });
});

describe("famílias", () => {
  test("acabamentos of one família share medidas exactly", () => {
    for (const slug of FAMILIAS_DA_COZINHA) {
      for (const p of COZINHA.filter((acabamento) => acabamento.familia === slug)) {
        expect(p.medidas).toEqual(familia(slug)!.medidas);
      }
    }
  });

  test("the two-acabamento família §3.7 names carries two rows here", () => {
    const pares = FAMILIAS_DA_COZINHA.filter(
      (slug) => COZINHA.filter((p) => p.familia === slug).length === 2,
    );
    expect(pares).toEqual(["cadeira-junco"]);
  });

  test("every família carries medidas, designer and desenho", () => {
    for (const slug of FAMILIAS_DA_COZINHA) {
      const fam = familia(slug)!;
      expect(fam.nome.length).toBeGreaterThan(0);
      expect(fam.designer.length).toBeGreaterThan(0);
      expect(fam.desenho.alt.length).toBeGreaterThan(0);
    }
  });

  test("desenho is inline SVG in the régua's stroke grammar", () => {
    for (const slug of FAMILIAS_DA_COZINHA) {
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
    for (const p of COZINHA) {
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
      const doTipo = COZINHA.filter((p) => p.tipo === tipoSlug);
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
    for (const p of COZINHA) {
      expect(p.imagens.filter((i) => i.papel === "principal")).toHaveLength(1);
      expect(p.imagens[0]!.papel).toBe("principal");
    }
  });

  test("every src is a phase-1 Unsplash hotlink", () => {
    for (const p of COZINHA) {
      for (const imagem of p.imagens) {
        expect(imagem.src.startsWith("https://images.unsplash.com/photo-")).toBe(true);
      }
    }
  });

  test("no decorative image exists — alt is never empty", () => {
    for (const p of COZINHA) {
      for (const imagem of p.imagens) expect(imagem.alt.trim().length).toBeGreaterThan(0);
    }
  });

  test("principal and ambientada are templated; detalhe is authored", () => {
    for (const p of COZINHA) {
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
    const comCota = COZINHA.flatMap((p) =>
      p.imagens.map((i) => ({ slug: p.slug, cotas: i.cotas })),
    ).filter((i) => i.cotas.length > 0);
    expect(comCota).toEqual([{ slug: "cadeira-junco-palhinha-freijo", cotas: ["largura"] }]);
  });

  test("a cota is only ever declared where medidas supplies the figure", () => {
    for (const p of COZINHA) {
      for (const imagem of p.imagens) {
        for (const cota of imagem.cotas) expect(p.medidas[cota]).toBeGreaterThan(0);
      }
    }
  });

  test("no image record authors a ratio — it is computed from medidas", () => {
    // imagens.md §3. The record carries the four fields the shape names and
    // nothing else, so a proportion can only ever come from `medidas`.
    for (const p of COZINHA) {
      for (const imagem of p.imagens) {
        expect(Object.keys(imagem).sort()).toEqual(["alt", "cotas", "papel", "src"]);
      }
    }
  });

  test("the carve-out pair is not in this room, and the pair here still differs", () => {
    // imagens.md §10.3 carves out `poltrona-lina`, which lists sala and quarto.
    // Cozinha's own two-acabamento família is not held to that bar, but two
    // records that share a família still have to be told apart in the cart.
    expect(COZINHA.map((p) => p.familia)).not.toContain("poltrona-lina");
    const palhinha = buscar("cadeira-junco-palhinha-freijo");
    const couro = buscar("cadeira-junco-couro-argila");
    expect(couro.imagens[0]!.alt).not.toBe(palhinha.imagens[0]!.alt);
  });

  test("ambientada and detalhe stay rare — §9.3's volume rule", () => {
    const extras = COZINHA.flatMap((p) => p.imagens.filter((i) => i.papel !== "principal"));
    expect(extras.length).toBeLessThan(COZINHA.length);
    // §7.2 — one produto per ambiente carries all three roles.
    expect(buscar("cadeira-junco-palhinha-freijo").imagens.map((i) => i.papel)).toEqual([
      "principal",
      "ambientada",
      "detalhe",
    ]);
  });
});

describe("the derivations produce sane output for every row", () => {
  test("cor and materiais resolve against the taxonomy", () => {
    for (const p of COZINHA) {
      expect(cor(p.cor)).toBeDefined();
      expect(p.materiais.length).toBeGreaterThan(0);
      for (const slug of p.materiais) expect(material(slug)?.cuidados.length).toBeGreaterThan(0);
    }
  });

  test("a piece that names only a surface gains its structural wood", () => {
    // §8.1's rule, and the same deviation Sala and Quarto recorded: the
    // section's stated consequence — that every produto has ≥2 materiais — does
    // not follow for a bare-wood acabamento, because `Carvalho` names the
    // structural material itself and the rule then adds nothing. Cozinha widens
    // it by one class: `Laca Off-white` names a finish §2.4 has no row for, so
    // nothing in the Cuidados union covers the lacquer either. Both are the rule
    // winning over its own consequence; closing the gap needs a spec
    // correction — a `laca` material row — not a record.
    for (const p of COZINHA) {
      expect(p.materiais.some((m) => MADEIRAS.includes(m))).toBe(true);
      if (!MADEIRAS.includes(p.materiais[0]!)) expect(p.materiais).toHaveLength(2);
    }
  });

  test("Laca Off-white is a finish, so the piece reads as its structural wood", () => {
    // §2.4's material table has no `laca` and §3.3 row 50 names one anyway. The
    // acabamento is read as finish-plus-cor: the cor is authored (`off-white`),
    // and §8.1's structural clause supplies the material. Inventing a material
    // row would author an entity this ticket is not allowed to add.
    const bruma = buscar("armario-bruma-off-white");
    expect(bruma.cor).toBe("off-white");
    expect(bruma.materiais).toEqual(["carvalho"]);
  });

  test("embalagem is the piece plus §8.4's margin, and weighs something", () => {
    for (const p of COZINHA) {
      expect(p.embalagem.largura).toBe(p.medidas.largura + 8);
      expect(p.embalagem.profundidade).toBe(p.medidas.profundidade + 8);
      expect(p.embalagem.altura).toBe(p.medidas.altura + 6);
      expect(p.embalagem.pesoKg).toBeGreaterThan(0);
    }
  });

  test("the room's one multi-volume tipo ships in the number §8.4 fixes", () => {
    // `armarios 2`; the rest of the room ships in one. §8.4's `mesas-de-jantar`
    // rule does not reach `mesas`, which is a different tipo.
    for (const p of COZINHA) expect(p.embalagem.volumes).toBe(p.tipo === "armarios" ? 2 : 1);
  });

  test("montagem and itensInclusos follow the tipo", () => {
    for (const p of COZINHA) {
      // No cozinha tipo is a luminária, so every piece here is assembled.
      expect(p.montagem.necessaria).toBe(true);
      expect(p.montagem.pecas).toBeGreaterThan(0);
      expect(p.itensInclusos[0]!.startsWith("1 ")).toBe(true);
      expect(p.itensInclusos).toContain("manual de montagem");
    }
  });

  test("itensInclusos names the tipo, which is what §8.7 has to name", () => {
    // The one place that reads oddly: `mesa-de-apoio-luar` is a
    // `carrinhos-e-apoios`, so §8.7's "the piece itself" resolves through the
    // tipo's labelSingular and the row says `1 carrinho`. The tipo is a pair —
    // carrinhos *e apoios* — and no field names the half a produto belongs to,
    // so the alternative is authoring a label per produto. Recorded rather than
    // worked around.
    expect(buscar("mesa-de-apoio-luar-marmore-cru").itensInclusos[0]).toBe("1 carrinho");
  });

  test("medidasExtras carries exactly the rows its tipo rules", () => {
    for (const p of COZINHA) {
      expect(p.medidasExtras.map((m) => m.rotulo)).toEqual(rotulosMedidasExtras(p.tipo));
      for (const linha of p.medidasExtras) expect(linha.valor).toBeGreaterThan(0);
    }
  });

  test("carrinhos-e-apoios carry none, the empty case §8.3 wants rendered", () => {
    for (const p of COZINHA.filter((linha) => linha.tipo === "carrinhos-e-apoios")) {
      expect(p.medidasExtras).toEqual([]);
    }
  });

  test("a seat's altura do assento sits under the piece's own altura", () => {
    for (const p of COZINHA.filter((linha) => ["cadeiras", "banquetas"].includes(linha.tipo))) {
      const assento = p.medidasExtras.find((m) => m.rotulo === "Altura do assento")!;
      expect(assento.valor).toBeLessThan(p.medidas.altura);
    }
  });

  test("the à-vista price is a discount on the one authored number", () => {
    for (const p of COZINHA) expect(precoAVista(p.precoTabela)).toBeLessThan(p.precoTabela);
  });

  test("every row takes the store's garantia", () => {
    for (const p of COZINHA) expect(p.garantiaMeses).toBeUndefined();
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
    // by side: the copy claims a joint in freijó while Cuidados carries
    // carvalho's care line. `cadeira-junco`'s two acabamentos are where this
    // bites — one is `['palhinha','freijo']` and the other `['couro-natural',
    // 'carvalho']`, so the shared família does not imply a shared wood.
    const MADEIRAS_POR_PALAVRA: Record<string, string> = {
      carvalho: "carvalho",
      freijó: "freijo",
      nogueira: "nogueira",
      jatobá: "jatoba",
    };

    for (const p of COZINHA) {
      const prosa = p.descricao.toLowerCase();
      for (const [palavra, slug] of Object.entries(MADEIRAS_POR_PALAVRA)) {
        if (prosa.includes(palavra)) expect(p.materiais).toContain(slug);
      }
    }
  });
});
