import type { Metadata } from "next";
import { Linhas } from "@/components/inspiracoes/linhas";
import {
  LINHA_DO_INDICE,
  METADADOS_DO_INDICE,
  TITULO_DO_INDICE,
  linhasDoIndice,
} from "@/lib/inspiracoes/conteudo";
import { compartilhamento, indexavel, tituloCompleto } from "@/lib/metadados/conteudo";

/**
 * `/inspiracoes` — `inspiracoes.md` §5.
 *
 * Two blocks and the page ends: a cabeçalho and four hairline-separated rows.
 * No pagination, no closing CTA, and **no `?ambiente=` filter** — `rotas.md`
 * reserved that key and §7.1 retires it unused, because with four articles
 * where each article *is* a room, a room filter reduces four rows to one and
 * each row already carries its ambiente as its first annotation. That is a
 * control computing what the reader has on screen, which is the objection that
 * killed the PDP's "cabe no meu espaço" widget.
 *
 * There is **no empty state** either, and it resolves by impossibility (§7.2):
 * the four articles are structural content rather than data that can be absent,
 * there is no filter to return nothing and no query to miss. So this route
 * reads no `searchParams` at all — which is also what lets it prerender.
 *
 * There is **no photography above the rows** (§5.2). A photograph over a list of
 * photographs is the page competing with itself, and it would additionally
 * spend the room-shot exception on a page that is not a room story.
 */
export const metadata: Metadata = {
  title: METADADOS_DO_INDICE.titulo,
  description: METADADOS_DO_INDICE.descricao,
  ...indexavel("/inspiracoes"),
  // `rotas.md` §5's table gives this route `artigo.thumb`, and the four rows are
  // peers in one authored order — so the card takes the **first** row's thumb.
  // It is the same photograph that opens the page, which is what keeps a share
  // preview about the page rather than about a piece chosen for the card.
  ...compartilhamento({
    titulo: tituloCompleto(METADADOS_DO_INDICE.titulo),
    descricao: METADADOS_DO_INDICE.descricao,
    imagem: linhasDoIndice()[0]?.thumb,
  }),
};

export default function PaginaDeInspiracoes() {
  return (
    <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-5 pb-rhythm-7">
      {/* §5.2 — the Mincho line names the act, not the section: the navbar has
          already said "Inspirações" and the tab repeats it, so the word is
          deliberately absent here. Left five columns, right gutter empty. */}
      <header className="lg:grid lg:grid-cols-12 lg:gap-x-gutter">
        <div className="lg:col-span-5">
          <h1 className="t-display-l text-ink">{TITULO_DO_INDICE}</h1>
          <p className="t-body mt-rhythm-3 text-muted">{LINHA_DO_INDICE}</p>
        </div>
      </header>

      <div className="mt-rhythm-6">
        <Linhas linhas={linhasDoIndice()} />
      </div>
    </div>
  );
}
