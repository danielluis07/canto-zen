import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Listagem } from "@/components/catalogo/listagem";
import {
  cabecalhoDaColecao,
  metadadosDaColecao,
  produtosDaColecao,
} from "@/lib/listagem/conteudo";
import { lerConsulta } from "@/lib/listagem/consulta";
import { paginarNaOrdemAutorada } from "@/lib/listagem/controles";
import { colecaoEnumerada, colecoesEnumeradas } from "@/lib/listagem/rotas";

/**
 * The same template as the other three listings, minus two blocks and minus a
 * sort — `catalogo.md` §9.
 *
 * `Colecao.produtos` is an ordered list whose **sequence is the editorial act**
 * (`produto.md`). So this page renders neither the tipo band nor the filter and
 * sort bar: a sort control offers to destroy the only thing the page exists
 * for, and filtering a curated selection of a few pieces leaves it incoherent
 * with the description sitting above it. `produtosDaColecao` therefore never
 * re-sorts — not into curadoria order, and not to push `esgotado` last.
 *
 * Pagination stays, because §9 says a coleção over twelve pieces paginates like
 * any other; curation simply should not get there.
 *
 * `dynamicParams = false` states the enumeration at the prerendering layer, and
 * as on the room × tipo pair it is not enough on its own: reading the query
 * renders this route per request, and a request-rendered path never meets that
 * check. `proxy.ts` decides an unknown slug before routing so the `404` is the
 * store's own page with its chrome; the `notFound()` below is the same table
 * asked a second time, never a second list.
 *
 * There is **no `/colecoes` index**, and the absence is authored: `rotas.md`'s
 * *Deliberate omissions* rules it out as a thin page needing its own spec and
 * its own navbar slot, coleções being a merchandising device surfaced in
 * context on the home and inside Inspirações. The segment stays reserved, so
 * the missing `page.tsx` beside this folder is the decision, not an oversight —
 * and `/colecoes` answers `404`, which is what the omission means.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return colecoesEnumeradas().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/colecoes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!colecaoEnumerada(slug)) return {};
  const { titulo, descricao } = metadadosDaColecao(slug);
  return { title: titulo, description: descricao };
}

export default async function PaginaDeColecao({
  params,
  searchParams,
}: PageProps<"/colecoes/[slug]">) {
  const { slug } = await params;
  if (!colecaoEnumerada(slug)) notFound();

  // `pagina` is the only key this surface supports. `cor`, `material`, `preco`
  // and `ordem` are read off the query and dropped here — ignored rather than
  // an error, as `rotas.md` requires of every key a surface does not support.
  const consulta = lerConsulta(await searchParams);
  const { pagina, total, paginacao } = paginarNaOrdemAutorada({
    caminho: `/colecoes/${slug}`,
    conjunto: produtosDaColecao(slug),
    pagina: consulta.pagina,
  });

  return (
    <Listagem
      cabecalho={cabecalhoDaColecao(slug)}
      produtos={pagina.itens}
      total={total}
      paginacao={paginacao}
    />
  );
}
