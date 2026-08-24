import type { Metadata } from "next";
import { compartilhamento, indexavel, tituloCompleto } from "@/lib/metadados/conteudo";
import { Regua } from "@/components/marca/regua";
import { DECLARACOES, METADADOS_DE_SOBRE, ROTULO_DA_REGUA } from "@/lib/institucional/sobre";

/**
 * `/sobre` — the manifesto (`institucional.md` §§1–7).
 *
 * Five statements down the page, each with a short body, and then the page
 * stops. It is the **only page in the store with no data dependency**: the copy
 * is `lib/institucional/sobre.ts` and there is no entity behind it, which is
 * what makes the Mincho exception auditable by counting.
 *
 * Four things here are absences, and all four are authored:
 *
 * - **No page title.** `marca.md` §4 rations Zen Old Mincho to one feature line
 *   per page; §2 registers this page as the single exception, bounded at five
 *   statements, and the price of the exception is that the first statement is
 *   the `<h1>` (§13). A `<title>` still exists — `rotas.md` §1 is explicit that
 *   the document title does not inherit the page's absence.
 * - **No photograph** (§4), on the store's most photography-led site. The page
 *   of refusals refuses the store's own most reliable device.
 * - **No founder, biography, portrait or designer roster** (§7). The store
 *   declines to fabricate credentials, and a person's life story would be the
 *   heaviest fabrication in the map.
 * - **No CTA** (§6). The régua, and then the footer. A manifesto that ends in a
 *   button sells the argument it just made.
 *
 * Layout is `marca.md` §5's grid: statements on columns 1–9, each body on
 * columns 1–5, and the large right-hand gutter left empty. No rules between the
 * blocks and **no numbering** — ordinal numbering is banned system-wide.
 */
export const metadata: Metadata = {
  title: METADADOS_DE_SOBRE.titulo,
  description: METADADOS_DE_SOBRE.descricao,
  ...indexavel("/sobre"),
  // **No card image, and no fallback wordmark card** (`rotas.md` §5). §4 made
  // photography-free an authored absence, and manufacturing a typographic card
  // to fill the slot re-adds the image the page refused, one layer down.
  // WhatsApp renders a text-only preview, which is what this page is.
  ...compartilhamento({
    titulo: tituloCompleto(METADADOS_DE_SOBRE.titulo),
    descricao: METADADOS_DE_SOBRE.descricao,
  }),
};

export default function PaginaSobre() {
  const [primeira, ...demais] = DECLARACOES;

  return (
    <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-7 pb-rhythm-7">
      <div className="flex flex-col gap-rhythm-6">
        {/* The page's structural heading and its first argument are the same
            string, which is the point (§13). */}
        <Declaracao titulo={primeira.titulo} corpo={primeira.corpo} nivel="h1" />
        {demais.map((declaracao) => (
          <Declaracao
            key={declaracao.titulo}
            titulo={declaracao.titulo}
            corpo={declaracao.corpo}
            nivel="h2"
          />
        ))}
      </div>

      {/* §5 — exactly one régua, closing the page, at full container measure.
          It is legal without an object to annotate because `marca.md` §2 lists
          a year among the figures a régua may carry, and the figure is real. */}
      <div className="mt-rhythm-7">
        <Regua rotulo={ROTULO_DA_REGUA} alinhamento="centro" />
      </div>
    </div>
  );
}

function Declaracao({
  titulo,
  corpo,
  nivel,
}: {
  titulo: string;
  corpo: string;
  nivel: "h1" | "h2";
}) {
  const Titulo = nivel;
  return (
    <section className="lg:grid lg:grid-cols-12 lg:gap-x-gutter">
      <Titulo className="t-display-l text-ink lg:col-span-9">{titulo}</Titulo>
      {/* `col-start-1` on purpose: the statement above occupies columns 1–9, so
          auto-placement would drop the body into column 10. */}
      <p className="t-body mt-rhythm-3 max-w-reading text-ink lg:col-span-5 lg:col-start-1">
        {corpo}
      </p>
    </section>
  );
}
