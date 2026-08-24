import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Listagem } from "@/components/catalogo/listagem";
import { ambiente } from "@/lib/catalogo";
import {
  bandaDeTipos,
  cabecalhoDoTipo,
  metadadosDoTipo,
  produtosDoTipo,
} from "@/lib/listagem/conteudo";
import { lerConsulta } from "@/lib/listagem/consulta";
import { controlesDaListagem } from "@/lib/listagem/controles";
import { parEnumerado, paresEnumerados } from "@/lib/listagem/rotas";
import { metadadosDeListagem } from "@/lib/metadados/conteudo";

/**
 * **Enumerated, not generated** — `rotas.md` §6. The declared room × tipo pairs
 * are the only ones that exist; `/cozinha/sofas` is a `404`, not an empty grid,
 * even though `cozinha` and `sofas` are each perfectly real.
 *
 * `dynamicParams = false` states that at the prerendering layer. It is not
 * enough on its own here: `catalogo.md` §3 makes every filter selection a real
 * navigation, so this route reads `searchParams` and renders per request, and a
 * request-rendered path never meets that check. `parEnumerado` carries the same
 * declaration into the dynamic response — one table asked twice, never a second
 * list, which is the drift the declaration exists to prevent.
 *
 * What it constrains is the **path only**. `?cor=` matching nothing on a
 * declared pair is a `200` with a zero-results surface, and the two must never
 * swap (`rotas.md` §7).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return paresEnumerados();
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[ambiente]/[tipo]">): Promise<Metadata> {
  const { ambiente: slugAmbiente, tipo: slugTipo } = await params;
  if (!parEnumerado(slugAmbiente, slugTipo)) return {};

  const { titulo, descricao } = metadadosDoTipo(slugAmbiente, slugTipo);
  return metadadosDeListagem({
    caminho: `/${slugAmbiente}/${slugTipo}`,
    titulo,
    descricao,
    // **The type listing borrows the room's photograph** rather than its first
    // result (`rotas.md` §5): a card whose image changes when a piece is
    // reordered or sells out is a share preview that is not about the page.
    imagem: ambiente(slugAmbiente)!.imagem,
    consulta: lerConsulta(await searchParams),
    conjunto: produtosDoTipo(slugAmbiente, slugTipo),
  });
}

export default async function PaginaDeTipo({
  params,
  searchParams,
}: PageProps<"/[ambiente]/[tipo]">) {
  const { ambiente: slugAmbiente, tipo: slugTipo } = await params;
  if (!parEnumerado(slugAmbiente, slugTipo)) notFound();
  const encontrado = ambiente(slugAmbiente)!;

  // `TIPO` is not a facet here: it is §2's band, and the same choice offered
  // twice in two vocabularies is a modelling error, not a convenience.
  const consulta = lerConsulta(await searchParams);
  const controles = controlesDaListagem({
    caminho: `/${slugAmbiente}/${slugTipo}`,
    conjunto: produtosDoTipo(slugAmbiente, slugTipo),
    consulta,
    suporte: {},
  });

  return (
    <Listagem
      cabecalho={cabecalhoDoTipo(slugAmbiente, slugTipo)}
      banda={{
        rotulo: `Tipos em ${encontrado.label}`,
        itens: bandaDeTipos(slugAmbiente, slugTipo),
      }}
      produtos={controles.pagina.itens}
      total={controles.total}
      controles={controles}
    />
  );
}
