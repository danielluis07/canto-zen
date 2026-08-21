import type { Metadata } from "next";
import { Listagem } from "@/components/catalogo/listagem";
import { ambiente } from "@/lib/catalogo";
import {
  bandaDeTipos,
  cabecalhoDoTipo,
  metadadosDoTipo,
  produtosDoTipo,
} from "@/lib/listagem/conteudo";
import { paresEnumerados } from "@/lib/listagem/rotas";

/**
 * **Enumerated, not generated** — `rotas.md` §6. The declared room × tipo pairs
 * are the only ones that exist; `/cozinha/sofas` is a `404`, not an empty grid,
 * even though `cozinha` and `sofas` are each perfectly real.
 *
 * `dynamicParams = false` is what makes that a property of the *response*
 * rather than a check inside a page: an unenumerated pair never reaches this
 * component, so there is nowhere for a soft-404 to be introduced later.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return paresEnumerados();
}

export async function generateMetadata({
  params,
}: PageProps<"/[ambiente]/[tipo]">): Promise<Metadata> {
  const { ambiente: slugAmbiente, tipo: slugTipo } = await params;
  const { titulo, descricao } = metadadosDoTipo(slugAmbiente, slugTipo);
  return { title: titulo, description: descricao };
}

export default async function PaginaDeTipo({ params }: PageProps<"/[ambiente]/[tipo]">) {
  const { ambiente: slugAmbiente, tipo: slugTipo } = await params;
  const encontrado = ambiente(slugAmbiente);
  if (!encontrado) throw new Error(`an enumerated ambiente resolved to nothing: ${slugAmbiente}`);

  return (
    <Listagem
      cabecalho={cabecalhoDoTipo(slugAmbiente, slugTipo)}
      banda={{
        rotulo: `Tipos em ${encontrado.label}`,
        itens: bandaDeTipos(slugAmbiente, slugTipo),
      }}
      produtos={produtosDoTipo(slugAmbiente, slugTipo)}
    />
  );
}
