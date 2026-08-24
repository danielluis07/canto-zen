// `/sobre` — the manifesto, and the only page in the store whose copy is fixed
// rather than left as direction (`institucional.md` §3).
//
// This module is **five strings and a label**. It imports nothing from the
// catálogo but `loja`, and that only for the founding year: §12 records that
// Sobre is the one page with no data dependency, and that property is what
// makes the Mincho exception auditable — five statements, countable, with no
// list that could grow.
//
// **Nothing here may be paraphrased.** §3 ships this wording because on this
// page the wording *is* the structure, and `tests/institucional.test.ts` plus
// the seam-2 suite assert every one of the five verbatim for that reason.

import { loja } from "../catalogo";

/** One statement and its body — a refusal, or the affirmation that closes. */
export type Declaracao = {
  /** `Display L` Mincho. The first of these is the page's `<h1>` (§13). */
  titulo: string;
  /** Two to three sentences in Body, `--ink`, measure 60–70ch (§2). */
  corpo: string;
};

/**
 * **Four refusals, then one affirmation** (§3). Five is a hard ceiling, not a
 * target: `marca.md` §4 rations Mincho to one feature line per page, and Sobre
 * is the map's single registered exception to that — bounded at five, paid for
 * by the page having no title of its own.
 *
 * The statements are impersonal (*não temos*, never *nós não temos*); the
 * bodies use *a gente*, which is the register the rest of the store's copy
 * already speaks in (`rodape.md` §3).
 *
 * A sixth entry here is not a content decision. It spends an exception the
 * brand spec granted by number.
 */
export const DECLARACOES: readonly Declaracao[] = [
  {
    titulo: "Não temos estoque.",
    corpo:
      "Nenhuma peça fica esperando num galpão. A produção começa depois que a peça é pedida, e leva o tempo que leva — em média 45 dias úteis. É por isso que a gente sabe dizer de que árvore veio a madeira do seu aparador.",
  },
  {
    titulo: "Não fazemos promoção.",
    corpo:
      "O preço de uma peça é o mesmo em março e em novembro. Descontar em novembro o que se cobrou o ano inteiro é admitir que o preço do ano inteiro estava errado. O único desconto da loja é o do Pix, e ele existe porque o custo é menor de fato.",
  },
  {
    titulo: "Não escondemos o preço.",
    corpo:
      "Ateliê costuma escrever “sob consulta”. A gente escreve o número: à vista e parcelado, nos dois lugares onde a peça aparece. Quem precisa perguntar quanto custa já foi informado de que não é para ele.",
  },
  {
    titulo: "Não vendemos o que não sai da nossa oficina.",
    corpo:
      "Não revendemos importado e não completamos a grade com peça de terceiro. O que está no site foi desenhado aqui e montado aqui, o que limita o catálogo — e é exatamente esse limite que a gente está vendendo.",
  },
  {
    titulo: "O que sai daqui é assinado.",
    corpo:
      "Toda peça carrega o nome de quem a desenhou e as medidas reais de quem a construiu. Nenhuma das duas coisas é enfeite: uma diz de quem é a decisão, a outra diz se cabe na sua casa.",
  },
];

/**
 * The page's one régua, closing it — §5. `marca.md` §2 permits a régua with no
 * object to annotate *when there is a real figure to state*, and lists the
 * collection year among its own examples; the figure comes from `loja` and is
 * never typed inline, so the year the footer implies and the year the page
 * states are the same number.
 */
export const ROTULO_DA_REGUA = `DESDE ${loja.fundacao}`;

/**
 * §§6 and 7 as a note, because absences do not appear in a module's exports and
 * a later session reads this file before it reads the spec:
 *
 * - **No CTA.** The régua, and then the footer. A manifesto that ends in a
 *   button sells the argument it just made.
 * - **No photograph** (§4), and no founder, biography, portrait or designer
 *   roster (§7). None of them is a field this module declined to fill.
 */

/**
 * `rotas.md` §§1–2. Sobre has a `<title>` although the page has no title: the
 * document title is not the page title and does not inherit that absence — a
 * browser tab reading `Não temos estoque.` is the manifesto leaking into
 * chrome.
 *
 * The description is **statement 1 plus its first body sentence**, composed
 * rather than retyped, so the meta tag cannot drift from the page. It is the
 * only description in the store that is finished copy, and it is short by the
 * §2 window's standards on purpose — `rotas.md` §2 prints this exact line as
 * the table's example.
 */
export const METADADOS_DE_SOBRE = {
  titulo: "Sobre nós",
  descricao: `${DECLARACOES[0].titulo} ${primeiraFrase(DECLARACOES[0].corpo)}`,
};

/** Up to and including the first full stop — the sentence, not a truncation. */
function primeiraFrase(texto: string): string {
  const fim = texto.indexOf(". ");
  return fim === -1 ? texto : texto.slice(0, fim + 1);
}
