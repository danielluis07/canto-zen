import type { Paginacao as Modelo } from "@/lib/listagem/controles";
import { LigacaoDeControle } from "./ligacao";

/**
 * `← 1 2 3 →` — `catalogo.md` §7. Numbered and server-rendered, twelve to a
 * page, `7rem` below the grid.
 *
 * The arrows are the **characters** `←` and `→`, not icons: `navbar.md` fixed
 * zero icons and the footer is the one registered exception. Disabled ends do
 * not render, so page one has no `←` rather than a greyed one.
 *
 * There is no infinite scroll and no `VER MAIS`: both make the footer — which
 * carries the identification the law requires — unreachable, and both break the
 * linkable, indexable URL the whole route table was built on.
 */
export function Paginacao({ paginacao }: { paginacao: Modelo }) {
  return (
    <nav aria-label="Paginação" className="mt-rhythm-7 flex justify-center">
      <ul className="flex items-center gap-rhythm-4">
        {paginacao.anterior && (
          <li>
            <LigacaoDeControle href={paginacao.anterior} className="t-annotation text-muted hover:text-indigo">
              <span aria-hidden>←</span>
              <span className="sr-only">Página anterior</span>
            </LigacaoDeControle>
          </li>
        )}

        {paginacao.paginas.map((pagina) => (
          <li key={pagina.numero}>
            <LigacaoDeControle
              href={pagina.href}
              ariaCurrent={pagina.atual ? "page" : undefined}
              className={
                pagina.atual
                  ? "t-annotation border-b border-ink pb-rhythm-1 text-ink"
                  : "t-annotation text-muted hover:text-indigo"
              }>
              <span className="sr-only">Página </span>
              {pagina.numero}
            </LigacaoDeControle>
          </li>
        ))}

        {paginacao.proxima && (
          <li>
            <LigacaoDeControle href={paginacao.proxima} className="t-annotation text-muted hover:text-indigo">
              <span aria-hidden>→</span>
              <span className="sr-only">Próxima página</span>
            </LigacaoDeControle>
          </li>
        )}
      </ul>
    </nav>
  );
}
