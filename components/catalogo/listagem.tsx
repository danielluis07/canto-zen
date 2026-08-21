import type { Produto } from "@/lib/catalogo";
import {
  linhaDePolitica,
  rotuloDaContagem,
  type Cabecalho,
  type ItemDaBanda,
} from "@/lib/listagem/conteudo";
import { Regua } from "@/components/marca/regua";
import { BandaDeTipos } from "./banda-de-tipos";
import { Cartao } from "./cartao";

type Props = {
  cabecalho: Cabecalho;
  /** Only `/[ambiente]` and `/[ambiente]/[tipo]` carry one — `catalogo.md` §2. */
  banda?: { rotulo: string; itens: ItemDaBanda[] };
  produtos: Produto[];
};

/**
 * One template for four routes — `catalogo.md`. What changes between them is
 * the header and which controls render; never the grid, and never the card.
 *
 * The rhythm here is **reading rhythm**, not the home's editorial rhythm:
 * `2.75rem` from the header to the band, `1.5rem` from the band to the régua,
 * `2.75rem` from the régua to the grid, and `7rem` only at the close. `7rem`
 * between a control and the grid it governs separates cause from effect (§0).
 *
 * None of it streams and there is no `loading.tsx` anywhere in the app: under
 * Next 16 a `not-found` inside a streamed response returns `200`, and the
 * `404`-vs-`200` contract `rotas.md` §7 fixes may never swap.
 */
export function Listagem({ cabecalho, banda, produtos }: Props) {
  const contagem = rotuloDaContagem(produtos.length);

  return (
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
            cabecalho.mincho ? "t-display-l mt-rhythm-2 text-ink" : "t-annotation mt-rhythm-2 text-ink"
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

      {contagem && (
        <div className="mt-rhythm-4">
          <Regua rotulo={contagem} />
        </div>
      )}

      {/* Three columns filling all twelve, two on mobile. No fixed card height
          and no baseline alignment: the image keeps the piece's real
          proportion, so the text starts where the image ends (§5). */}
      <div className="mt-rhythm-5 grid grid-cols-2 gap-x-gutter gap-y-rhythm-6 lg:grid-cols-3">
        {produtos.map((produto) => (
          <Cartao key={produto.slug} produto={produto} />
        ))}
      </div>

      {/* The policy stated once per screen instead of twelve times, which would
          spend índigo ten more times than `marca.md` §3 permits (§7). */}
      <div className="mt-rhythm-6 border-t border-hairline pt-rhythm-3">
        <p className="t-annotation text-indigo lg:text-right">{linhaDePolitica()}</p>
      </div>
    </div>
  );
}
