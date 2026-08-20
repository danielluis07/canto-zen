import { describe, expect, test } from "bun:test";
import {
  ambientes,
  familia,
  garantiaMeses,
  linhaDeParcelamento,
  precoAVista,
  precoMontagem,
  produto,
  rotulosMedidasExtras,
  todosOsProdutos,
} from "../lib/catalogo";
import type { Produto } from "../lib/catalogo";

// dados.md §9 — six records written first, one per structural case, so the
// derivation rules have a checkable output before the other 59 are transcribed.
// Every figure below is the spec's, not this module's.

const exemplar = (slug: string): Produto => {
  const encontrado = produto(slug);
  if (!encontrado) throw new Error(`exemplar missing from the catalogue: ${slug}`);
  return encontrado;
};

describe("1 — sofa-heron-linho-cru, the hero", () => {
  const heron = exemplar("sofa-heron-linho-cru");

  test("carries the cota the home's hero layout requires", () => {
    const principal = heron.imagens[0]!;
    expect(principal.papel).toBe("principal");
    expect(principal.cotas).toEqual(["largura"]);
  });

  test("ships in two volumes, because it is 220 cm wide", () => {
    expect(heron.medidas).toEqual({ largura: 220, profundidade: 96, altura: 76 });
    expect(heron.embalagem).toEqual({
      volumes: 2,
      largura: 228,
      profundidade: 104,
      altura: 82,
      pesoKg: 107,
    });
  });

  test("carries freteGratis in the region dados.md §3.8 names", () => {
    expect(heron.freteGratis).toBe("sudeste");
  });

  test("derives its prices from the one authored number", () => {
    expect(heron.precoTabela).toBe(980000);
    expect(precoAVista(heron.precoTabela)).toBe(882000);
    expect(linhaDeParcelamento(heron.precoTabela)).toEqual({
      parcelas: 10,
      valorCentavos: 98000,
    });
    expect(precoMontagem(heron.montagem.nivel)).toBe(19900);
  });

  test("lists its loose cushions", () => {
    expect(heron.itensInclusos).toEqual([
      "1 sofá",
      "5 almofadas soltas",
      "manual de montagem",
      "chave allen e gabarito de furação",
    ]);
  });
});

describe("2 — poltrona-lina-linho-cru, produto.md's own example", () => {
  const lina = exemplar("poltrona-lina-linho-cru");

  test("transcribes the example's authored fields", () => {
    expect(lina.nome).toBe("Poltrona Lina");
    expect(lina.familia).toBe("poltrona-lina");
    expect(lina.acabamento).toBe("Linho Cru");
    expect(lina.tipo).toBe("poltronas");
    expect(lina.ambientePrincipal).toBe("sala");
    expect(lina.ambientes).toEqual(["sala", "quarto"]);
    expect(lina.precoTabela).toBe(389000);
    expect(lina.disponibilidade).toBe("sob-encomenda");
    expect(lina.prazoProducaoSemanas).toBe(4);
  });

  test("derives the example's derived fields to the same values", () => {
    expect(lina.cor).toBe("cru");
    expect(lina.materiais).toEqual(["linho", "carvalho"]);
    expect(lina.medidas).toEqual({ largura: 78, profundidade: 82, altura: 74 });
    expect(lina.medidasExtras).toEqual([
      { rotulo: "Altura do assento", valor: 42, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 120, unidade: "kg" },
    ]);
    expect(lina.montagem).toEqual({
      necessaria: true,
      nivel: "simples",
      pessoas: 1,
      pecas: 5,
      tempoMinutos: 20,
    });
    expect(lina.itensInclusos).toEqual(["1 poltrona", "manual de montagem", "chave allen"]);
    expect(precoAVista(lina.precoTabela)).toBe(350100);
  });

  test("boxes the example to §8.4's rule, which its own block predates", () => {
    // The one place the two sources disagree. produto.md's Example block reads
    // `pesoKg: 24`; dados.md §8.4 later made embalagem derived and its formula
    // gives 34 — 0,86 x 0,90 x 0,80 m at 55 kg/m3. The rule wins, because §8.4
    // says a hand-typed pesoKg that disagrees with the box makes the freight
    // quote arbitrary. The box dimensions match the example exactly.
    expect(lina.embalagem).toEqual({
      volumes: 1,
      largura: 86,
      profundidade: 90,
      altura: 80,
      pesoKg: 34,
    });
  });

  test("carries the example's own alt, verbatim", () => {
    expect(lina.imagens[0]!.alt).toBe("Poltrona Lina em linho cru sobre reboco");
  });

  test("carries all three papel roles, principal first", () => {
    expect(lina.imagens.map((i) => i.papel)).toEqual(["principal", "ambientada", "detalhe"]);
  });

  test("takes its designer from its tipo", () => {
    expect(familia(lina.familia)?.designer).toBe("Marina Aoki");
  });
});

describe("3 — poltrona-lina-boucle-carvalho, the second acabamento", () => {
  const cru = exemplar("poltrona-lina-linho-cru");
  const boucle = exemplar("poltrona-lina-boucle-carvalho");

  test("shares its família's geometry exactly", () => {
    expect(boucle.medidas).toEqual(cru.medidas);
    expect(boucle.embalagem).toEqual(cru.embalagem);
  });

  test("differs in everything the acabamento touches", () => {
    expect(boucle.slug).not.toBe(cru.slug);
    expect(boucle.precoTabela).toBe(420000);
    expect(boucle.cor).toBe("areia");
    expect(boucle.materiais).toEqual(["boucle", "carvalho"]);
    expect(boucle.disponibilidade).toBe("envio-imediato");
  });

  test("is visibly a different photograph — imagens.md §10.3's carve-out", () => {
    expect(boucle.imagens[0]!.src).not.toBe(cru.imagens[0]!.src);
  });
});

describe("4 — sofa-taipa-couro-argila, esgotado", () => {
  const taipa = exemplar("sofa-taipa-couro-argila");

  test("is esgotado and states no prazo de produção", () => {
    expect(taipa.disponibilidade).toBe("esgotado");
    expect(taipa.prazoProducaoSemanas).toBeUndefined();
  });

  test("keeps every other field populated anyway", () => {
    expect(taipa.cor).toBe("argila");
    expect(taipa.materiais).toEqual(["couro-natural", "carvalho"]);
    expect(taipa.embalagem).toEqual({
      volumes: 2,
      largura: 253,
      profundidade: 108,
      altura: 86,
      pesoKg: 129,
    });
    expect(precoAVista(taipa.precoTabela)).toBe(1278000);
    expect(taipa.freteGratis).toBe("nacional");
    expect(taipa.descricao.length).toBeGreaterThan(0);
  });
});

describe("5 — luminaria-de-mesa-junco-palhinha, the no-assembly case", () => {
  const luminaria = exemplar("luminaria-de-mesa-junco-palhinha");

  test("needs no montagem", () => {
    expect(luminaria.montagem.necessaria).toBe(false);
    expect(luminaria.montagem.pecas).toBe(1);
    expect(luminaria.montagem.tempoMinutos).toBe(0);
  });

  test("carries the one negative row in the set", () => {
    expect(luminaria.itensInclusos).toEqual(["1 luminária de mesa", "lâmpada não inclusa"]);
  });

  test("is the entry price, and parcels down to the store minimum", () => {
    expect(luminaria.precoTabela).toBe(76000);
    expect(linhaDeParcelamento(luminaria.precoTabela)).toEqual({
      parcelas: 5,
      valorCentavos: 15200,
    });
  });

  test("carries principal alone", () => {
    expect(luminaria.imagens.map((i) => i.papel)).toEqual(["principal"]);
  });

  test("takes the palhinha's colour and a structural wood", () => {
    expect(luminaria.cor).toBe("cru");
    expect(luminaria.materiais).toEqual(["palhinha", "carvalho"]);
    expect(luminaria.embalagem.pesoKg).toBe(3);
  });
});

describe("6 — cadeira-junco-palhinha-freijo, cross-listed", () => {
  const cadeira = exemplar("cadeira-junco-palhinha-freijo");

  test("lists under two rooms, and the breadcrumb reads the first", () => {
    expect(cadeira.ambientePrincipal).toBe("cozinha");
    expect(cadeira.ambientes).toEqual(["cozinha", "sala"]);
  });

  test("names both its materials, and adds no third", () => {
    expect(cadeira.materiais).toEqual(["palhinha", "freijo"]);
    expect(cadeira.cor).toBe("cru");
  });

  test("carries all three papel roles", () => {
    expect(cadeira.imagens.map((i) => i.papel)).toEqual(["principal", "ambientada", "detalhe"]);
  });

  test("derives its figures", () => {
    expect(precoAVista(cadeira.precoTabela)).toBe(133200);
    expect(linhaDeParcelamento(cadeira.precoTabela)).toEqual({
      parcelas: 9,
      valorCentavos: 16444,
    });
    expect(cadeira.embalagem).toEqual({
      volumes: 1,
      largura: 60,
      profundidade: 64,
      altura: 94,
      pesoKg: 25,
    });
    expect(familia(cadeira.familia)?.designer).toBe("Yuki Nakamura");
  });
});

describe("what every exemplar shares", () => {
  const transcritos = todosOsProdutos();

  test("all six structural cases are transcribed", () => {
    expect(transcritos.map((p) => p.slug)).toEqual([
      "sofa-heron-linho-cru",
      "sofa-taipa-couro-argila",
      "poltrona-lina-linho-cru",
      "poltrona-lina-boucle-carvalho",
      "cadeira-junco-palhinha-freijo",
      "luminaria-de-mesa-junco-palhinha",
    ]);
  });

  test("ordem is the row each piece holds in dados.md §3, not its table slot", () => {
    // §8.9 — global, 1 through 65. The other 59 rows land between these six.
    expect(transcritos.map((p) => p.ordem)).toEqual([1, 4, 6, 7, 41, 65]);
  });

  test("the catalogue reads in curatorial order whatever order it is written in", () => {
    const ordens = transcritos.map((p) => p.ordem);
    expect(ordens).toEqual([...ordens].sort((a, b) => a - b));
  });

  test("every one takes the store's garantia, because none states its own", () => {
    // dados.md §8.9 — leaving it unset everywhere is what proves the fallback.
    for (const p of transcritos) {
      expect(p.garantiaMeses).toBeUndefined();
      expect(garantiaMeses(p)).toBe(24);
    }
  });

  test("disponibilidade is one of three states and never a count", () => {
    for (const p of transcritos) {
      expect(["envio-imediato", "sob-encomenda", "esgotado"]).toContain(p.disponibilidade);
    }
    expect(new Set(transcritos.map((p) => p.disponibilidade)).size).toBe(3);
  });

  test("exactly one principal image, and it is first", () => {
    for (const p of transcritos) {
      expect(p.imagens.filter((i) => i.papel === "principal")).toHaveLength(1);
      expect(p.imagens[0]!.papel).toBe("principal");
    }
  });

  test("the principal alt follows imagens.md §5.1's template", () => {
    for (const p of transcritos) {
      const nome = familia(p.familia)!.nome;
      expect(p.imagens[0]!.alt).toBe(`${nome} em ${p.acabamento.toLowerCase()} sobre reboco`);
    }
  });

  test("medidasExtras carries exactly the rows its tipo rules", () => {
    for (const p of transcritos) {
      expect(p.medidasExtras.map((m) => m.rotulo)).toEqual(rotulosMedidasExtras(p.tipo));
    }
  });

  test("every produto's tipo is in its ambientePrincipal's curated tipos[]", () => {
    for (const p of transcritos) {
      const ambiente = ambientes.find((a) => a.slug === p.ambientePrincipal);
      expect(ambiente?.tipos).toContain(p.tipo);
    }
  });

  test("ambientes always opens with ambientePrincipal", () => {
    for (const p of transcritos) expect(p.ambientes[0]).toBe(p.ambientePrincipal);
  });

  test("every família resolves, and carries a desenho with a real figure", () => {
    for (const p of transcritos) {
      const fam = familia(p.familia);
      expect(fam).toBeDefined();
      // marca.md forbids an empty régua: the trio has to be in the drawing.
      const trio = `L ${fam!.medidas.largura} × P ${fam!.medidas.profundidade} × A ${fam!.medidas.altura} cm`;
      expect(fam!.desenho.src).toContain(trio);
      expect(fam!.desenho.src.startsWith("<svg")).toBe(true);
    }
  });

  test("each cota states the figure its own axis measures", () => {
    for (const p of transcritos) {
      const { desenho, medidas } = familia(p.familia)!;
      const figuras = [...desenho.src.matchAll(/<text[^>]*>([^<]+)<\/text>/g)].map((m) => m[1]);
      expect(figuras).toContain(String(medidas.largura));
      expect(figuras).toContain(String(medidas.altura));
    }
  });

  test("the drawing never runs off its own viewBox", () => {
    for (const p of transcritos) {
      const { desenho } = familia(p.familia)!;
      const [, caixaX, caixaY] = desenho.src.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)!.map(Number);
      const [, deslocX, deslocY] = desenho.src.match(/translate\(([\d.]+) ([\d.]+)\)/)!.map(Number);
      const fimDoCorpo = desenho.src.indexOf("</g>");

      for (const trecho of desenho.src.matchAll(/<path d="([^"]+)"/g)) {
        // Only the silhouette is translated; the dimension frame is absolute.
        const noCorpo = trecho.index! < fimDoCorpo;
        let x = noCorpo ? deslocX! : 0;
        let y = noCorpo ? deslocY! : 0;

        for (const comando of trecho[1]!.match(/[MHVLZ][^MHVLZ]*/g)!) {
          const args = comando.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(Number);
          if (comando[0] === "M" || comando[0] === "L") {
            x = (noCorpo ? deslocX! : 0) + args[0]!;
            y = (noCorpo ? deslocY! : 0) + args[1]!;
          } else if (comando[0] === "H") x = (noCorpo ? deslocX! : 0) + args[0]!;
          else if (comando[0] === "V") y = (noCorpo ? deslocY! : 0) + args[0]!;
          else continue;

          expect(x).toBeGreaterThanOrEqual(0);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(caixaX!);
          expect(y).toBeLessThanOrEqual(caixaY!);
        }
      }
    }
  });
});
