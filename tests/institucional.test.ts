import { describe, expect, test } from "bun:test";
import { loja, paginasDePolitica } from "../lib/catalogo";
import { DECLARACOES, METADADOS_DE_SOBRE, ROTULO_DA_REGUA } from "../lib/institucional/sobre";
import {
  ASSUNTO_ARREPENDIMENTO,
  CAMPOS,
  METADADOS_DE_CONTATO,
  RESOLUCAO,
  emailPareceCompleto,
  mira,
  showroom,
} from "../lib/institucional/contato";
import {
  LINHA_DE_LOJA_CONCEITO,
  MINIMO_PARA_INDICE,
  documentoDePolitica,
  documentos,
  indiceVisivel,
  linhaDeAtualizacao,
  metadadosDaPolitica,
  politicaEnumerada,
  slugsDePoliticas,
  type Politica,
} from "../lib/institucional/politicas";

// Seam 1 — the institutional content modules. `institucional.md` is the one
// spec in the map that ships **copy** rather than direction, so most of what
// follows is an equality against a sentence. That is the point: on these
// surfaces a paraphrase is the defect, and a test that only checked shape would
// pass through the exact failure the spec exists to prevent.

// ---------------------------------------------------------------------------
// /sobre — institucional.md §§2, 3, 5
// ---------------------------------------------------------------------------

describe("the manifesto", () => {
  // §2 — five is a hard ceiling, not a target. `marca.md` §4 rations Mincho to
  // one feature line per page and Sobre is the map's single registered
  // exception; the exception is auditable precisely by counting.
  test("is exactly five statements", () => {
    expect(DECLARACOES.length).toBe(5);
  });

  // §3 — four refusals, then one affirmation. Five negations leave the reader
  // holding nothing; the affirmation is what the refusals cleared space for.
  test("refuses four times and then affirms once", () => {
    const titulos = DECLARACOES.map((d) => d.titulo);
    expect(titulos.slice(0, 4).every((t) => t.startsWith("Não "))).toBe(true);
    expect(titulos[4].startsWith("Não ")).toBe(false);
  });

  test("ships §3's wording, not a paraphrase of it", () => {
    expect(DECLARACOES.map((d) => d.titulo)).toEqual([
      "Não temos estoque.",
      "Não fazemos promoção.",
      "Não escondemos o preço.",
      "Não vendemos o que não sai da nossa oficina.",
      "O que sai daqui é assinado.",
    ]);

    expect(DECLARACOES[0].corpo).toBe(
      "Nenhuma peça fica esperando num galpão. A produção começa depois que a peça é pedida, e leva o tempo que leva — em média 45 dias úteis. É por isso que a gente sabe dizer de que árvore veio a madeira do seu aparador.",
    );
    expect(DECLARACOES[4].corpo).toBe(
      "Toda peça carrega o nome de quem a desenhou e as medidas reais de quem a construiu. Nenhuma das duas coisas é enfeite: uma diz de quem é a decisão, a outra diz se cabe na sua casa.",
    );
  });

  // §2 — each statement is followed by two to three sentences in Body.
  test("gives each statement a short body, never an essay", () => {
    for (const declaracao of DECLARACOES) {
      const frases = declaracao.corpo.split(". ").length;
      expect({ titulo: declaracao.titulo, duasOuTres: frases >= 2 && frases <= 3 }).toEqual({
        titulo: declaracao.titulo,
        duasOuTres: true,
      });
    }
  });

  // §7 — the store consistently declines to fabricate credentials, and both
  // refusals are of the same species: a person's life story reads as a real
  // claim about a real human.
  test("names no founder and no designer", () => {
    const tudo = DECLARACOES.map((d) => `${d.titulo} ${d.corpo}`).join(" ");
    for (const palavra of ["fundador", "fundou", "designer", "arquiteto", "sócio"]) {
      expect({ palavra, presente: tudo.toLowerCase().includes(palavra) }).toEqual({
        palavra,
        presente: false,
      });
    }
  });

  // §5 — 2014 lives in `loja`, never inline, so the year the footer implies and
  // the year the page states cannot become two numbers.
  test("closes on a régua whose figure comes from Loja", () => {
    expect(ROTULO_DA_REGUA).toBe("DESDE 2014");
    expect(ROTULO_DA_REGUA).toBe(`DESDE ${loja.fundacao}`);
  });

  // rotas.md §§1–2 — the document title does not inherit the page's absence,
  // and the description is statement 1 plus its first body sentence.
  test("carries a title although the page has none, and a composed description", () => {
    expect(METADADOS_DE_SOBRE.titulo).toBe("Sobre nós");
    expect(METADADOS_DE_SOBRE.descricao).toBe(
      "Não temos estoque. Nenhuma peça fica esperando num galpão.",
    );
    expect(METADADOS_DE_SOBRE.titulo).not.toBe(DECLARACOES[0].titulo);
  });
});

// ---------------------------------------------------------------------------
// /contato — institucional.md §§9, 10
// ---------------------------------------------------------------------------

describe("the contact form", () => {
  // §9 — no *assunto* select, because it would route to inboxes that do not
  // exist, and no telefone, a field the store cannot act on.
  test("is three fields, and the two that are missing are decisions", () => {
    expect(CAMPOS.map((c) => c.nome)).toEqual(["nome", "email", "mensagem"]);
    expect(CAMPOS.some((c) => c.nome === ("assunto" as string))).toBe(false);
    expect(CAMPOS.some((c) => c.nome === ("telefone" as string))).toBe(false);
  });

  test("asks for the autofill the browser can answer, and six rows of message", () => {
    expect(CAMPOS[0].autocomplete).toBe("name");
    expect(CAMPOS[1].autocomplete).toBe("email");
    expect(CAMPOS[2].linhas).toBe(6);
  });

  // erros.md §5.2 — a Corrigível states the fix and never the fault. Not one of
  // these messages may become `Nome inválido.`
  test("states the fix in every message, never the fault", () => {
    expect(CAMPOS.map((c) => c.faltando)).toEqual([
      "Escreva seu nome.",
      "Escreva seu e-mail.",
      "Escreva sua mensagem.",
    ]);
    for (const campo of CAMPOS) {
      expect(campo.faltando.toLowerCase()).not.toContain("inválid");
      expect(campo.faltando.toLowerCase()).not.toContain("obrigatóri");
    }
  });

  test("checks the e-mail's shape loosely, because it is a typo guard", () => {
    expect(emailPareceCompleto("oi@cantozen.com.br")).toBe(true);
    expect(emailPareceCompleto("oi@cantozen")).toBe(false);
    expect(emailPareceCompleto("cantozen.com.br")).toBe(false);
  });

  // §9 — one query parameter, and it adds no field. Unrecognised or absent
  // renders the plain form; **no other value exists**.
  test("is aimed by ?assunto=arrependimento and by nothing else", () => {
    const aimada = mira(ASSUNTO_ARREPENDIMENTO);
    expect(aimada?.anotacao).toBe("PEDIDO DE ARREPENDIMENTO");
    expect(aimada?.mensagemInicial).toBe("Quero desistir da compra nº ");

    expect(mira(undefined)).toBeNull();
    expect(mira("")).toBeNull();
    expect(mira("defeito")).toBeNull();
    expect(mira("Arrependimento")).toBeNull();
  });

  // §9 — the sixth refusal of a fabricated artefact, and the plainest one: no
  // fake `Recebemos sua mensagem`.
  test("resolves by saying nothing was sent", () => {
    expect(RESOLUCAO.titulo).toBe("Nada foi enviado.");
    expect(RESOLUCAO.corpo).toContain("não há caixa de entrada do outro lado");
    expect(RESOLUCAO.corpo).not.toContain("Recebemos");
  });

  // legal-copy verification §3 — five days is the **resolution** deadline.
  // Confirmation of receipt is immediate and by the channel the message
  // arrived on, and collapsing the two promises the slower thing about the
  // duty that must be instant.
  test("names five days as resolution, never as acknowledgement", () => {
    expect(RESOLUCAO.corpo).toContain("responderia em até 5 dias úteis");
  });
});

describe("the showroom", () => {
  // §10 — both sets of hours live in `loja` so the two cannot drift apart, and
  // the showroom's are not the atendimento's.
  test("states its own hours, distinct from atendimento's", () => {
    expect(showroom().horario).toBe("Seg a sex, 10h às 19h · Sáb, 10h às 14h");
    expect(showroom().horario).not.toContain(loja.atendimento.horario);
  });

  test("reads the address off Loja rather than restating it", () => {
    const { endereco } = loja;
    expect(showroom().endereco).toEqual([
      `${endereco.logradouro}, ${endereco.numero} — ${endereco.bairro}`,
      `${endereco.cidade} — ${endereco.uf}, CEP ${endereco.cep}`,
    ]);
  });

  // The agendamento line is statement 1 (`Não temos estoque.`) paying off as a
  // practical consequence — the only place the two institutional surfaces
  // touch.
  test("says the visit needs no appointment, and why a piece may be absent", () => {
    expect(showroom().nota).toContain("não precisa de hora marcada");
    expect(showroom().nota).toContain("não trabalhamos com estoque");
  });

  test("links out to a map instead of embedding one", () => {
    expect(showroom().mapa.rotulo).toBe("VER NO MAPA →");
    expect(showroom().mapa.href.startsWith("https://")).toBe(true);
  });

  // rotas.md §2 — descriptions run 110–160 characters, and this one is derived
  // from `loja` rather than written for the metadata layer.
  test("is what the route's description is composed from", () => {
    expect(METADADOS_DE_CONTATO.titulo).toBe("Contato");
    expect(METADADOS_DE_CONTATO.descricao).toContain(loja.endereco.logradouro);
    expect(METADADOS_DE_CONTATO.descricao.length).toBeGreaterThanOrEqual(110);
    expect(METADADOS_DE_CONTATO.descricao.length).toBeLessThanOrEqual(160);
  });
});

// ---------------------------------------------------------------------------
// /politicas/[slug] — institucional.md §§11, 11b
// ---------------------------------------------------------------------------

/** §11b's four openers, as the verification pass wrote them. */
const ABERTURAS: Record<string, string> = {
  "trocas-e-devolucoes":
    "Você pode desistir de uma compra feita no site da Canto Zen em até 7 dias corridos, contados do recebimento da peça.",
  "entrega-e-frete":
    "O frete da Canto Zen é calculado pelo seu CEP, e o prazo de entrega começa a contar da confirmação do pagamento — não do pedido.",
  privacidade:
    "A Canto Zen trata seus dados pessoais para uma coisa só: concluir a compra que você pediu — nome, CPF, e-mail, celular e endereço.",
  "termos-de-uso":
    "Estes termos valem para o uso do site da Canto Zen e para a compra das peças oferecidas nele, que são feitas sob encomenda em madeira maciça.",
};

const texto = (politica: Politica): string =>
  politica.secoes.flatMap((s) => s.corpo.map((p) => p.texto)).join("\n");

describe("the four policies", () => {
  // rotas.md — exactly four slugs, enumerated. `prazos-e-entrega` is not one of
  // them, and the three links that pointed there target `entrega-e-frete`.
  test("are exactly four, and prazos-e-entrega is not among them", () => {
    expect(slugsDePoliticas()).toEqual([
      "trocas-e-devolucoes",
      "entrega-e-frete",
      "privacidade",
      "termos-de-uso",
    ]);
    expect(politicaEnumerada("prazos-e-entrega")).toBe(false);
    expect(politicaEnumerada("garantia")).toBe(false);
  });

  // §11 — one source with the routes and the footer's Ajuda column, so a title
  // typed twice cannot disagree with itself.
  test("take their titles from the list the footer renders", () => {
    expect(documentos().map((d) => `${d.slug}: ${d.titulo}`)).toEqual(
      paginasDePolitica.map((p) => `${p.slug}: ${p.titulo}`),
    );
  });

  // §11 — the four documents do **not** share a heading skeleton. Forcing
  // unrelated documents into identical sections is the false symmetry that
  // produces empty sections.
  test("carry their own headings within the one layout", () => {
    const esqueletos = documentos().map((d) => d.secoes.map((s) => s.id).join("|"));
    expect(new Set(esqueletos).size).toBe(4);
  });

  test("give every section a real anchor, unique within its document", () => {
    for (const documento of documentos()) {
      const ids = documento.secoes.map((s) => s.id);
      expect({ slug: documento.slug, unicos: new Set(ids).size }).toEqual({
        slug: documento.slug,
        unicos: ids.length,
      });
      for (const secao of documento.secoes) {
        expect(secao.corpo.length).toBeGreaterThan(0);
      }
    }
  });

  // §11 — a date, not a byline. A policy without a version is a defect, because
  // the reader needs to know which version they agreed to.
  test("carry a version date, rendered in full pt-BR", () => {
    for (const documento of documentos()) {
      expect(documento.atualizadaEm).toBe("2026-03-12");
    }
    expect(linhaDeAtualizacao("2026-03-12")).toBe("ÚLTIMA ATUALIZAÇÃO — 12 DE MARÇO DE 2026");
    // Parsed by hand rather than through `Date`, which reads the ISO string as
    // UTC midnight and prints the previous day west of Greenwich.
    expect(linhaDeAtualizacao("2026-01-01")).toBe("ÚLTIMA ATUALIZAÇÃO — 1 DE JANEIRO DE 2026");
  });

  // §11 — the index renders only at four or more sections. It is the template's
  // rule and not a fact about the current four, so it is tested as one.
  test("show the side index only at four sections or more", () => {
    for (const documento of documentos()) {
      expect(indiceVisivel(documento)).toBe(true);
      expect(documento.secoes.length).toBeGreaterThanOrEqual(MINIMO_PARA_INDICE);
    }

    const curta: Politica = { ...documentoDePolitica("privacidade"), secoes: [] };
    curta.secoes = documentoDePolitica("privacidade").secoes.slice(0, 3);
    expect(indiceVisivel(curta)).toBe(false);
  });

  // §11 — one line, once, at the top. Not a banner, and not repeated per
  // section: four unqualified legal documents would be the seventh fabricated
  // artefact.
  test("open on the concept-store line, once", () => {
    expect(LINHA_DE_LOJA_CONCEITO).toBe(
      "Canto Zen é uma loja conceito. Esta página descreve como a política funcionaria; nenhuma compra é processada aqui.",
    );
    for (const documento of documentos()) {
      expect(texto(documento)).not.toContain("loja conceito. Esta página descreve");
    }
  });

  // §11b rule 1 — the first sentence is self-contained, because `rotas.md`
  // ships it as the page's meta description. Editing one of these edits the
  // page's only description, which is why the window is asserted here.
  test("open on §11b's verified sentence, at the measured length", () => {
    const medidas: Record<string, number> = {
      "trocas-e-devolucoes": 116,
      "entrega-e-frete": 128,
      privacidade: 130,
      "termos-de-uso": 141,
    };

    for (const slug of slugsDePoliticas()) {
      const documento = documentoDePolitica(slug);
      expect({ slug, abertura: documento.secoes[0].corpo[0].texto }).toEqual({
        slug,
        abertura: ABERTURAS[slug],
      });
      expect({ slug, tamanho: ABERTURAS[slug].length }).toEqual({ slug, tamanho: medidas[slug] });
      expect(metadadosDaPolitica(slug).descricao).toBe(ABERTURAS[slug]);
      // Self-contained: it has to read correctly with no heading above it.
      expect(ABERTURAS[slug]).not.toContain("Nesta página");
      expect(ABERTURAS[slug]).toContain("Canto Zen");
    }
  });

  // §11b rule 2 — the article numbers appear once each, at the end of their
  // paragraph, in the annotation voice.
  test("cite each article once, and never quote the statute", () => {
    for (const documento of documentos()) {
      const fontes = documento.secoes.flatMap((s) => s.corpo.flatMap((p) => p.fonte ?? []));
      expect({ slug: documento.slug, unicas: new Set(fontes).size }).toEqual({
        slug: documento.slug,
        unicas: fontes.length,
      });
      expect(fontes.length).toBeGreaterThan(0);
      // A block quotation of art. 49 in a page written for a person is the
      // register break the whole institutional spec exists to avoid.
      expect(texto(documento)).not.toContain("O consumidor pode desistir do contrato");
    }
  });

  // §11b — "No `salvo casos de` anywhere. The exceptions clause is where
  // consumer policies go to die, and the store has none to declare."
  test("declare no exceptions clause", () => {
    for (const documento of documentos()) {
      expect(texto(documento).toLowerCase()).not.toContain("salvo casos de");
      expect(texto(documento).toLowerCase()).not.toContain("salvo nos casos");
    }
  });
});

describe("trocas-e-devolucoes", () => {
  const documento = documentoDePolitica("trocas-e-devolucoes");

  // CDC art. 49 parágrafo único — *de imediato, monetariamente atualizados*.
  // Half-quoting it was the defect the verification pass found: no surface
  // mentioned money coming back at all.
  test("returns the money, monetarily updated", () => {
    expect(texto(documento)).toContain(
      "devolvemos todos os valores pagos, corrigidos monetariamente",
    );
  });

  // Decreto 7.962 art. 5º §2 — accessory contracts rescind *sem qualquer ônus
  // para o consumidor*. "Who pays return freight" was never an open question.
  test("pays the collection and refunds the montagem itself", () => {
    expect(texto(documento)).toContain("Desistir não tem custo nenhum para você");
    expect(texto(documento)).toContain("A coleta da peça é por nossa conta");
    expect(texto(documento)).toContain("são cancelados sem ônus");
  });

  // The montagem paragraph **names itself as a store grant**. A later session
  // that "corrects" it back to the statutory count would be silently shortening
  // a promise the store chose to make.
  test("labels the montagem extension a store grant beyond art. 49", () => {
    expect(texto(documento)).toContain(
      "Isso é uma escolha nossa: a lei conta do recebimento",
    );
  });

  // Decreto 7.962 art. 5º §1 — the site is the *mesma ferramenta*; WhatsApp and
  // e-mail are the *outros meios* the paragraph permits in addition.
  test("makes the site's own form the tool, with the channels beside it", () => {
    expect(texto(documento)).toContain("use o formulário de contato aqui do site");
    expect(texto(documento)).toContain("é a mesma ferramenta pela qual a compra foi feita");
    expect(texto(documento)).toContain(loja.atendimento.email);
  });

  // art. 5º §4 and art. 4º VI — confirmation is immediate and by the consumer's
  // own channel; five days is the resolution deadline.
  test("confirms receipt immediately and by the visitor's own channel", () => {
    expect(texto(documento)).toContain(
      "Confirmamos o recebimento do seu pedido na hora, pelo mesmo canal em que ele chegou",
    );
    expect(texto(documento)).toContain("concluímos a devolução em até 5 dias úteis");
  });

  test("treats sob encomenda the same, and defeito as a different path", () => {
    expect(texto(documento)).toContain("Peças sob encomenda seguem a mesma regra");
    expect(texto(documento)).toContain("Peça com defeito é outro caminho");
    expect(texto(documento)).toContain("90 dias");
  });

  // The last paragraph's second sentence is load-bearing: phrasing a convention
  // as a requirement is how a policy page turns into a trap.
  test("asks for the original packaging without making it a condition", () => {
    expect(texto(documento)).toContain("Isso é um pedido nosso, não uma condição para o seu direito");
  });
});

describe("entrega-e-frete", () => {
  const documento = documentoDePolitica("entrega-e-frete");

  test("counts the prazo from payment, and says which event it is not", () => {
    expect(texto(documento)).toContain("da confirmação do pagamento — não do pedido");
    expect(texto(documento)).toContain("Prazo de produção e prazo de entrega são coisas diferentes");
  });

  // CDC art. 35 — the one delivery promise a furniture store cannot write
  // loosely, because sob-encomenda production is exactly where dates slip.
  test("gives the reader art. 35's three choices when the date slips", () => {
    expect(texto(documento)).toContain("esperar uma nova data, aceitar outra peça equivalente");
    expect(texto(documento)).toContain("receber tudo o que pagou de volta, corrigido");
  });

  // The conventional detail §11 lists, composed from the catálogo's own tables
  // rather than retyped — a tarifa that changes changes this page with it.
  test("states the six regions, the unserved prefix and cubed weight", () => {
    for (const regiao of ["Sudeste capitais", "Sudeste interior", "Sul", "Centro-Oeste", "Nordeste", "Norte"]) {
      expect(texto(documento)).toContain(regiao);
    }
    expect(texto(documento)).toContain("começam em 69");
    expect(texto(documento)).toContain("peso cubado");
    expect(texto(documento)).toContain("divididos por 6.000");
  });

  test("states montagem on the delivery day, its prices and the access limit", () => {
    expect(texto(documento)).toContain("no mesmo dia da entrega");
    expect(texto(documento)).toContain("R$ 99,00, R$ 199,00 ou R$ 349,00");
    expect(texto(documento)).toContain("sobe por escada até o 3º andar");
    expect(texto(documento)).toContain("R$ 100,00 a mais que a padrão");
  });
});

describe("privacidade", () => {
  const documento = documentoDePolitica("privacidade");

  // LGPD art. 7º V for the checkout, art. 7º I for the newsletter. Writing one
  // basis for both is what produces the consent checkbox `checkout.md` §5
  // refuses — so the two are stated separately, and that is the point.
  test("states the checkout's basis as the contract, and refuses a consent checkbox", () => {
    expect(texto(documento)).toContain("a base legal para eles é a execução do contrato");
    expect(texto(documento)).toContain("a gente não pede o seu consentimento para eles");
    expect(texto(documento)).toContain("não haveria escolha real a oferecer");
  });

  test("states the newsletter's basis as consent, revocable", () => {
    expect(texto(documento)).toContain("o único caso em que a base é o seu consentimento");
    expect(texto(documento)).toContain("Você pode retirá-lo quando quiser");
  });

  // Art. 9º VII requires explicit mention of the art. 18 rights, and art. 19 II
  // gives the 15-day deadline.
  test("enumerates the art. 18 rights in one sentence, with the 15-day answer", () => {
    for (const direito of [
      "confirmação de que tratamos seus dados",
      "acesso a eles",
      "correção do que estiver errado",
      "anonimização ou eliminação",
      "portabilidade",
      "revogação do consentimento",
    ]) {
      expect(texto(documento)).toContain(direito);
    }
    expect(texto(documento)).toContain("Respondemos em até 15 dias");
  });

  // Retention and cookies are the build's to write, and both must say what is
  // true of a store with no backend.
  test("says nothing is stored and nothing is tracked", () => {
    expect(texto(documento)).toContain("nada é guardado");
    expect(texto(documento)).toContain("não usa cookie de publicidade");
    expect(texto(documento)).toContain("não há banner de cookies");
  });

  // The controller paragraph points at the footer instead of restating the
  // identification, so the footer's own fiction disclosure covers this page too.
  test("names the controller by pointing at the footer", () => {
    expect(texto(documento)).toContain(loja.razaoSocial);
    expect(texto(documento)).toContain("no endereço e CNPJ do rodapé desta página");
    expect(texto(documento)).not.toContain(loja.cnpj);
  });
});

describe("termos-de-uso", () => {
  const documento = documentoDePolitica("termos-de-uso");

  // CDC art. 101 I — the consumer sues where they live. A clause electing São
  // Paulo is the single most common abusive clause in Brazilian e-commerce
  // terms, and silence reads as the clause being elsewhere.
  test("states the right to sue at home, and elects no forum against it", () => {
    expect(texto(documento)).toContain(
      "você pode processar a Canto Zen no foro do seu próprio domicílio",
    );
    expect(texto(documento)).toContain("Esta página não elege foro diferente disso");
    expect(texto(documento).toLowerCase()).not.toContain("fica eleito o foro");
    expect(texto(documento)).not.toContain("comarca de São Paulo");
  });

  // CDC art. 31 — variance is a *characteristic to disclose*, and the sentence
  // that discloses one is one comma away from the one that disclaims liability.
  // It says which it is.
  test("discloses wood variance as a characteristic, not as a disclaimer", () => {
    expect(texto(documento)).toContain("Essa variação é uma característica da madeira");
    expect(texto(documento)).toContain(
      "não é defeito, e também não é uma isenção de responsabilidade nossa por defeito",
    );
  });

  test("points at the identification block rather than restating it", () => {
    expect(texto(documento)).toContain("a empresa identificada no rodapé de todas as páginas");
    expect(texto(documento)).not.toContain(loja.cnpj);
  });

  test("keeps the IP paragraph to one line", () => {
    expect(texto(documento)).toContain("Usar é preciso pedir");
  });
});
