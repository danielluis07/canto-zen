import type { Metadata } from "next";
import { Listagem } from "@/components/catalogo/listagem";
import { cabecalhoDaLoja, metadadosDaLoja, produtosDaLoja } from "@/lib/listagem/conteudo";
import { lerConsulta } from "@/lib/listagem/consulta";
import { controlesDaListagem } from "@/lib/listagem/controles";
import { destaqueDaHome } from "@/lib/home/conteudo";
import { metadadosDeListagem } from "@/lib/metadados/conteudo";

/**
 * The listing with the room taken away — `catalogo.md` §10.
 *
 * Everything the room routes have is here except the scope: the same grid, the
 * same card, the same filter, sort and pagination state. What it gains is
 * `AMBIENTE`, and it gains it for a structural reason rather than a
 * merchandising one — a room route reads its room from the path and therefore
 * ignores `?ambiente=`; this one has no room in its path, so the key is the
 * only place the cut can live (`rotas.md`'s query table).
 *
 * `AMBIENTE` matches `produto.ambientes`, the complete set, never
 * `ambientePrincipal`: a bench belonging to Quarto and Sala appears under both,
 * and `ambientePrincipal` decides only the PDP breadcrumb.
 *
 * **`TIPO` is not a facet here**, although `catalogo.md` §3 lists it as a
 * trigger on this route. That same table gives it the key `—`, and `rotas.md`'s
 * canonical query table grants no `tipo` key at all: type is a *path segment*,
 * which is rule 5 of the whole route map. Every control on this page is a link
 * to URL state (§3), so a facet with no key has nowhere to go, and inventing
 * `?tipo=` would put a sixth listing key into a table that enumerates five.
 * The tipo cut stays where it is landable — `/[ambiente]/[tipo]`.
 *
 * There is **no `generateStaticParams` and no enumeration** to carry: this is a
 * single literal path. It renders per request because it reads the query, like
 * every other listing.
 */
export async function generateMetadata({
  searchParams,
}: PageProps<"/produtos">): Promise<Metadata> {
  const { titulo, descricao } = metadadosDaLoja();
  return metadadosDeListagem({
    caminho: "/produtos",
    titulo,
    descricao,
    // `rotas.md` §5's table sends this route to the **home hero's** `principal`.
    // It has no room and therefore no room photograph, and the alternative —
    // the first card in the grid — is the result-dependent image §5 refuses.
    imagem: destaqueDaHome()?.imagem,
    // `?ambiente=` is supported here and nowhere else, and it is filter state:
    // §4 canonicalises `/produtos?ambiente=quarto` to `/produtos`.
    consulta: lerConsulta(await searchParams, { ambiente: true }),
    conjunto: produtosDaLoja(),
  });
}

export default async function PaginaDeProdutos({ searchParams }: PageProps<"/produtos">) {
  const consulta = lerConsulta(await searchParams, { ambiente: true });
  const controles = controlesDaListagem({
    caminho: "/produtos",
    conjunto: produtosDaLoja(),
    consulta,
    suporte: { ambiente: true },
  });

  return (
    <Listagem
      cabecalho={cabecalhoDaLoja()}
      produtos={controles.pagina.itens}
      total={controles.total}
      controles={controles}
    />
  );
}
