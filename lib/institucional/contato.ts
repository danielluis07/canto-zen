// `/contato` — the form, the showroom, and the resolution that sends nothing.
//
// `institucional.md` §8 gives the page two sections and no third: **the
// channels are omitted**, because `rodape.md` §7 promoted *Atendimento* to a
// column of its own precisely so WhatsApp, telefone, e-mail and hours are on
// every page. On a page this short the footer is on screen anyway, and
// repeating them would make `/contato` a page that mostly quotes its own
// footer.
//
// Every store fact below is read from `loja` (§12), never typed: the footer and
// this page compose the same object, which is the whole reason it is one.

import { loja } from "../catalogo";

// ---------------------------------------------------------------------------
// §9 — the form
// ---------------------------------------------------------------------------

export const TITULO_DA_PAGINA = "Contato";

export type CampoDeContato = {
  /** Also the `id` the label points at, and the state key the form holds. */
  nome: "nome" | "email" | "mensagem";
  /** Annotation voice, above the field (`marca.md` §6). */
  rotulo: string;
  tipo: "text" | "email" | "textarea";
  autocomplete?: string;
  /** Textarea only — §9 fixes six rows. */
  linhas?: number;
  /** A **Corrigível**: it states the fix and never the fault (`erros.md` §5.2). */
  faltando: string;
};

/**
 * Three fields, stacked, and the two that are absent are decisions rather than
 * omissions: **no *assunto* select**, because it would route to inboxes that do
 * not exist, and **no telefone**, because it is a field the store cannot act
 * on.
 */
export const CAMPOS: readonly CampoDeContato[] = [
  {
    nome: "nome",
    rotulo: "NOME",
    tipo: "text",
    autocomplete: "name",
    faltando: "Escreva seu nome.",
  },
  {
    nome: "email",
    rotulo: "E-MAIL",
    tipo: "email",
    autocomplete: "email",
    faltando: "Escreva seu e-mail.",
  },
  {
    nome: "mensagem",
    rotulo: "MENSAGEM",
    tipo: "textarea",
    linhas: 6,
    faltando: "Escreva sua mensagem.",
  },
];

/** The one shape check the form makes, and it states the fix. */
export const EMAIL_INCOMPLETO = "E-mail leva um @ e um domínio.";

/** Deliberately loose: this is a Corrigível for a typo, not a gatekeeper. */
export const emailPareceCompleto = (valor: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

export const CTA_ENVIAR = "ENVIAR MENSAGEM";

// ---------------------------------------------------------------------------
// §9 — the one query parameter, and it adds no field
// ---------------------------------------------------------------------------

/**
 * `/contato?assunto=arrependimento` is the store's **withdrawal tool**: Decreto
 * 7.962 art. 5º §1 lets the consumer withdraw *pela mesma ferramenta utilizada
 * para a contratação*, the contract is concluded on the site, and with auth out
 * of scope this form is the only in-site tool there is.
 *
 * It is a link the *store* aims, from the footer and the confirmation — not a
 * control the reader operates. That is exactly why the refusal of an *assunto*
 * select survives it: the select would have offered inboxes that do not exist.
 */
export const ASSUNTO_ARREPENDIMENTO = "arrependimento";

export type Mira = {
  /** One annotation line above the form. */
  anotacao: string;
  /** Pre-fills `Mensagem`, cursor at the end. */
  mensagemInicial: string;
};

const MIRA_DE_ARREPENDIMENTO: Mira = {
  anotacao: "PEDIDO DE ARREPENDIMENTO",
  mensagemInicial: "Quero desistir da compra nº ",
};

/**
 * Unrecognised or absent `assunto` renders the plain form. **No other value
 * exists** — this is not a lookup table with one row today, it is the whole
 * enumeration, and a second value would be a second inbox.
 */
export const mira = (assunto: string | undefined): Mira | null =>
  assunto === ASSUNTO_ARREPENDIMENTO ? MIRA_DE_ARREPENDIMENTO : null;

// ---------------------------------------------------------------------------
// §9 — resolution: swap in place
// ---------------------------------------------------------------------------

/**
 * The sixth refusal of a fabricated artefact, and the plainest one: no fake
 * `Recebemos sua mensagem`. On submit the form's region is **replaced** by
 * this — no route change, no processing beat, no fade.
 *
 * `Nada foi enviado.` would be a second feature line if set in Mincho, so it
 * ships in **Body, `--ink`, 500 weight**: the page's one Mincho grant is
 * already spent on the title.
 *
 * The five-day figure is the **resolution** deadline and the sentence says so.
 * Decreto 7.962 art. 5º §4 and art. 4º VI put confirmation of receipt on a
 * different clock — immediate, by the channel the message arrived on — and
 * collapsing the two promises the slower thing about the duty that must be
 * instant (legal-copy verification §3).
 */
export const RESOLUCAO = {
  titulo: "Nada foi enviado.",
  corpo:
    `Esta é uma loja conceito — não há caixa de entrada do outro lado. Numa loja de verdade sua ` +
    `mensagem chegaria por aqui e a gente responderia em até 5 dias úteis; se você precisa falar ` +
    `com alguém agora, o WhatsApp e o e-mail no rodapé são os canais que valem.`,
};

// ---------------------------------------------------------------------------
// §10 — the showroom
// ---------------------------------------------------------------------------

export type Showroom = {
  titulo: string;
  /** The address as two lines, composed from `loja.endereco`. */
  endereco: [string, string];
  /** `loja.showroom.horario`, joined with the store's middot. */
  horario: string;
  nota: string;
  mapa: { rotulo: string; href: string };
};

/**
 * Stated as real, in Body and the annotation voice, with **no photograph and no
 * embedded map** (§§4, 10). A Google Maps iframe imports another system's
 * colour, type, radius and UI into a page whose entire identity is one accent
 * and zero radius — the same reasoning `rodape.md` used to keep third-party
 * marks out. `VER NO MAPA` is a plain text link that opens the address in the
 * visitor's own map app.
 *
 * The agendamento line is not filler: it is statement 1 (`Não temos estoque.`)
 * paying off as a practical consequence, and it is the only place the two
 * institutional surfaces touch.
 */
export const showroom = (): Showroom => {
  const { endereco } = loja;
  return {
    titulo: "Showroom",
    endereco: [
      `${endereco.logradouro}, ${endereco.numero} — ${endereco.bairro}`,
      `${endereco.cidade} — ${endereco.uf}, CEP ${endereco.cep}`,
    ],
    // Showroom hours are distinct from atendimento hours, and both live in
    // `loja` so the two cannot drift apart in copy (§10).
    horario: loja.showroom.horario.join(" · "),
    nota: "A visita não precisa de hora marcada, mas avise antes se quiser ver uma peça específica: como não trabalhamos com estoque, nem tudo está no salão.",
    mapa: { rotulo: "VER NO MAPA →", href: enderecoNoMapa() },
  };
};

/** A search URL, not an embed — it hands the address to whatever app answers. */
const enderecoNoMapa = (): string => {
  const { endereco } = loja;
  const consulta = `${endereco.logradouro}, ${endereco.numero} — ${endereco.bairro}, ${endereco.cidade} — ${endereco.uf}, ${endereco.cep}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consulta)}`;
};

// ---------------------------------------------------------------------------
// Metadata — rotas.md §§1–2
// ---------------------------------------------------------------------------

/**
 * Derived from `loja`, per `rotas.md` §2's rule that this page's description is
 * composed from the store's own facts rather than written for the metadata
 * layer.
 *
 * **One deviation from the formula, recorded.** `rotas.md` §2 shapes the line
 * as `Showroom em {…}, com visita agendada.` — but `institucional.md` §10 is
 * the spec that owns the showroom, and it states the opposite: the visit needs
 * no appointment. Shipping the formula's words would put a false fact in the
 * one place the concept-store frame cannot follow it (`rotas.md`'s own rule 3).
 * So the shape holds, the address and hours are still read from `loja`, and the
 * sentence states what §10 says is true.
 */
export const METADADOS_DE_CONTATO = {
  titulo: TITULO_DA_PAGINA,
  descricao: (() => {
    const { endereco } = loja;
    return (
      `Showroom em ${endereco.logradouro}, ${endereco.numero} — ${endereco.bairro}, ` +
      `${endereco.cidade} — ${endereco.uf}. ${loja.showroom.horario[0]}. ` +
      `A visita não precisa de hora marcada.`
    );
  })(),
};
