import type { Produto } from "@/lib/catalogo";
import {
  linhaDePolitica,
  rotuloDaContagem,
  type Cabecalho,
  type ItemDaBanda,
} from "@/lib/listagem/conteudo";
import {
  LIMPAR_FILTROS,
  SEM_RESULTADOS,
  type Controles,
  type Paginacao as DadosDePaginacao,
} from "@/lib/listagem/controles";
import { Regua } from "@/components/marca/regua";
import { BandaDeTipos } from "./banda-de-tipos";
import { BarraDeFiltros } from "./barra-de-filtros";
import { Cartao } from "./cartao";
import { ProvedorDeConteudoVelho, RegiaoDeResultados } from "./conteudo-velho";
import { LigacaoDeControle } from "./ligacao";
import { Paginacao } from "./paginacao";

type Props = {
  cabecalho: Cabecalho;
  /** Only `/[ambiente]` and `/[ambiente]/[tipo]` carry one — `catalogo.md` §2. */
  banda?: { rotulo: string; itens: ItemDaBanda[] };
  /** The cards on this page — one page of the result, never the whole result. */
  produtos: Produto[];
  /** The régua's figure: the count **after filtering**, not the cards on screen. */
  total?: number;
  /** The filter and sort bar. Absent on `/colecoes/[slug]` — `catalogo.md` §9. */
  controles?: Controles;
  /**
   * Kept separate from `controles` because the coleção takes one and not the
   * other: §9 refuses it the bar, and in the same breath says a coleção over
   * twelve pieces paginates like any other. Folding the two into one prop would
   * make the refusal of the bar silently refuse the pages too.
   */
  paginacao?: DadosDePaginacao | null;
};

/**
 * One template for four routes — `catalogo.md`. What changes between them is
 * the header and which controls render; never the grid, and never the card.
 *
 * The rhythm here is **reading rhythm**, not the home's editorial rhythm:
 * `2.75rem` from the header to the band, `1.5rem` from the band to the bar and
 * from the bar to the régua, `2.75rem` from the régua to the grid, and `7rem`
 * only at the close. `7rem` between a control and the grid it governs separates
 * cause from effect (§0).
 *
 * None of it streams and there is no `loading.tsx` anywhere in the app: under
 * Next 16 a `not-found` inside a streamed response returns `200`, and the
 * `404`-vs-`200` contract `rotas.md` §7 fixes may never swap. The loading
 * language is the stale-content dim instead, which needs no boundary at all.
 */
export function Listagem({
  cabecalho,
  banda,
  produtos,
  total,
  controles,
  paginacao = controles?.paginacao,
}: Props) {
  const contagem = rotuloDaContagem(total ?? produtos.length);

  return (
    <ProvedorDeConteudoVelho>
      <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-5 pb-rhythm-7">
        {/* Always textual. None of the four routes opens with photography: the
            room's own photograph is already spent on the home, where it does
            routing work, and repeating it re-sells a decision already made. */}
        <header>
          {cabecalho.sobretitulo && (
            <p className="t-annotation text-muted">{cabecalho.sobretitulo}</p>
          )}
          <h1
            className={
              cabecalho.mincho
                ? "t-display-l mt-rhythm-2 text-ink"
                : "t-annotation mt-rhythm-2 text-ink"
            }>
            {cabecalho.titulo}
          </h1>
          {cabecalho.prosa && (
            <p className="t-body mt-rhythm-3 max-w-aside text-ink">{cabecalho.prosa}</p>
          )}
        </header>

        {banda && (
          <div className="mt-rhythm-5">
            <BandaDeTipos rotulo={banda.rotulo} itens={banda.itens} />
          </div>
        )}

        {controles && (
          <div className="mt-rhythm-4">
            <BarraDeFiltros controles={controles} />
          </div>
        )}

        {/* The only region that dims while the next result is fetched. The
            chrome above and the pagination below stay at full contrast: they
            are the way out, and dimming the way out reads as breakage. */}
        <RegiaoDeResultados>
          {contagem && (
            <div className="mt-rhythm-4">
              <Regua rotulo={contagem} />
            </div>
          )}

          {/* Three columns filling all twelve, two on mobile. No fixed card
              height and no baseline alignment: the image keeps the piece's real
              proportion, so the text starts where the image ends (§5). */}
          {produtos.length > 0 ? (
            <div className="mt-rhythm-5 grid grid-cols-2 gap-x-gutter gap-y-rhythm-6 lg:grid-cols-3">
              {produtos.map((produto) => (
                <Cartao key={produto.slug} produto={produto} />
              ))}
            </div>
          ) : (
            /* §8 — a combination of filters that matches nothing is a designed
               surface with a `200`, never a missing page. No suggestions and no
               related pieces: a concept store has no honest basis for
               recommending. The header, band and bar stay; they are the way
               out, and so is this. */
            <div className="mt-rhythm-5">
              <p className="t-body text-ink">{SEM_RESULTADOS}</p>
              {controles?.limparHref && (
                <LigacaoDeControle
                  href={controles.limparHref}
                  className="t-cta mt-rhythm-4 inline-block border border-ink px-rhythm-4 py-rhythm-2 text-ink">
                  {LIMPAR_FILTROS}
                </LigacaoDeControle>
              )}
            </div>
          )}
        </RegiaoDeResultados>

        {/* The policy stated once per screen instead of twelve times, which would
            spend índigo ten more times than `marca.md` §3 permits (§7). */}
        <div className="mt-rhythm-6 border-t border-hairline pt-rhythm-3">
          <p className="t-annotation text-indigo lg:text-right">{linhaDePolitica()}</p>
        </div>

        {paginacao && <Paginacao paginacao={paginacao} />}
      </div>
    </ProvedorDeConteudoVelho>
  );
}
