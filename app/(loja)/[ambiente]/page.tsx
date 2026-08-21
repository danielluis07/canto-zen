import type { Metadata } from "next";
import { Listagem } from "@/components/catalogo/listagem";
import { ambiente } from "@/lib/catalogo";
import {
  bandaDeTipos,
  cabecalhoDoAmbiente,
  metadadosDoAmbiente,
  produtosDoAmbiente,
} from "@/lib/listagem/conteudo";
import { ambientesEnumerados } from "@/lib/listagem/rotas";

/**
 * The four rooms are the store's spine, so they take the shortest paths and the
 * top-level namespace is reserved around them (`rotas.md`). They are enumerated
 * at build time rather than validated at request time, which is what makes
 * `/varanda` a real `404` instead of a page that decides it is one.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return ambientesEnumerados().map((slug) => ({ ambiente: slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[ambiente]">): Promise<Metadata> {
  const { ambiente: slug } = await params;
  const { titulo, descricao } = metadadosDoAmbiente(slug);
  return { title: titulo, description: descricao };
}

export default async function PaginaDeAmbiente({ params }: PageProps<"/[ambiente]">) {
  const { ambiente: slug } = await params;
  const encontrado = ambiente(slug);
  if (!encontrado) throw new Error(`an enumerated ambiente resolved to nothing: ${slug}`);

  return (
    <Listagem
      cabecalho={cabecalhoDoAmbiente(slug)}
      banda={{ rotulo: `Tipos em ${encontrado.label}`, itens: bandaDeTipos(slug) }}
      produtos={produtosDoAmbiente(slug)}
    />
  );
}
