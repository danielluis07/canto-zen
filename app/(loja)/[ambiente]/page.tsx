import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Listagem } from "@/components/catalogo/listagem";
import { ambiente } from "@/lib/catalogo";
import {
  bandaDeTipos,
  cabecalhoDoAmbiente,
  metadadosDoAmbiente,
  produtosDoAmbiente,
} from "@/lib/listagem/conteudo";
import { lerConsulta } from "@/lib/listagem/consulta";
import { controlesDaListagem } from "@/lib/listagem/controles";
import { ambientesEnumerados } from "@/lib/listagem/rotas";

/**
 * The four rooms are the store's spine, so they take the shortest paths and the
 * top-level namespace is reserved around them (`rotas.md`). They are enumerated
 * at build time rather than validated at request time, which is what makes
 * `/varanda` a real `404` instead of a page that decides it is one.
 *
 * The **path** is what is enumerated. The query is not: `catalogo.md` §3 makes
 * every filter selection a real navigation, so the route reads `searchParams`
 * and renders per request — and `dynamicParams` only governs *prerendering*.
 * The `notFound()` below is what carries the enumeration into the dynamic
 * response. It is not a second list: it asks the same table, so a room cannot
 * be in one and not the other.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return ambientesEnumerados().map((slug) => ({ ambiente: slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[ambiente]">): Promise<Metadata> {
  const { ambiente: slug } = await params;
  if (!ambiente(slug)) return {};
  const { titulo, descricao } = metadadosDoAmbiente(slug);
  return { title: titulo, description: descricao };
}

export default async function PaginaDeAmbiente({
  params,
  searchParams,
}: PageProps<"/[ambiente]">) {
  const { ambiente: slug } = await params;
  const encontrado = ambiente(slug);
  if (!encontrado) notFound();

  // The room comes from the path, so `?ambiente=` is a key this surface does
  // not support — and `rotas.md` says a surface ignores such a key rather than
  // erroring on it. `?q=` is read by nothing, here or anywhere.
  const consulta = lerConsulta(await searchParams);
  const controles = controlesDaListagem({
    caminho: `/${slug}`,
    conjunto: produtosDoAmbiente(slug),
    consulta,
    suporte: {},
  });

  return (
    <Listagem
      cabecalho={cabecalhoDoAmbiente(slug)}
      banda={{ rotulo: `Tipos em ${encontrado.label}`, itens: bandaDeTipos(slug) }}
      produtos={controles.pagina.itens}
      total={controles.total}
      controles={controles}
    />
  );
}
