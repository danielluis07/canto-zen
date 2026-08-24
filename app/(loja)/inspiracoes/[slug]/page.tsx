import type { Metadata } from "next";
import Link from "next/link";
import { Foto } from "@/components/inspiracoes/foto";
import {
  artigoEnumerado,
  artigosEnumerados,
  metadadosDoArtigo,
  paginaDoArtigo,
} from "@/lib/inspiracoes/conteudo";

/**
 * `/inspiracoes/[slug]` — `inspiracoes.md` §6.
 *
 * The skeleton is **fixed and identical across all four articles**: cabeçalho,
 * the wide shot, a passagem, a closer frame, a passagem, a closer frame, the
 * fecho. Three photographs, not "as many as the story needs" — a variable-length
 * article hands the layout an engine to invent, and §6.2 refused that for the
 * same reason `pagina-produto.md` §7 made image `papel` an instruction of
 * position. It also keeps the four genuine peers.
 *
 * Every slug is enumerated and the page reads no query, so `dynamicParams =
 * false` answers an unknown one with a real `404` (`rotas.md` §7). `proxy.ts`
 * refuses it one layer earlier all the same — not for the status, which is
 * already right, but for the document: Next serves that `404` from its minimal
 * error page, outside the root layout, and `rodape.md` §6 makes the footer's
 * identification non-negotiable on a public page.
 *
 * **No price and no régua anywhere on this page**, and both absences are
 * authored (§3). A piece named here is a name and a link; the figure is one
 * click away on its PDP, where every disclosure obligation is already met in
 * full. Nor is there a date, an author, a category, a share row or a
 * next-article link — §8 and §6.6 refuse each by name, and the newsletter lives
 * in the footer and is not repeated.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return artigosEnumerados().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/inspiracoes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!artigoEnumerado(slug)) return {};
  const { titulo, descricao } = metadadosDoArtigo(slug);
  return { title: titulo, description: descricao };
}

export default async function PaginaDeArtigo({ params }: PageProps<"/inspiracoes/[slug]">) {
  const { slug } = await params;
  // Unreachable through the router, which refuses an unenumerated slug before
  // this renders. It is here so the read narrows on a fact the route already
  // guarantees, never as a second enumeration.
  const artigo = paginaDoArtigo(slug);

  return (
    <article className="pt-rhythm-5 pb-rhythm-7">
      {/* §6.3 — left five columns, right gutter empty. The título is the page's
          single Mincho headline; the passagens are Body throughout. */}
      <header className="mx-auto w-full max-w-measure px-gutter">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-gutter">
          <div className="lg:col-span-5">
            <p className="t-annotation text-muted">{artigo.ambiente}</p>
            <h1 className="t-display-xl mt-rhythm-3 text-ink">{artigo.titulo}</h1>
            <p className="t-body mt-rhythm-4 text-ink">{artigo.abertura}</p>
          </div>
        </div>
      </header>

      <div className="mt-rhythm-7">
        <Foto foto={artigo.fotos[0]} />
      </div>

      <Passagem texto={artigo.passagens[0]} />

      <div className="mt-rhythm-7">
        <Foto foto={artigo.fotos[1]} />
      </div>

      <Passagem texto={artigo.passagens[1]} />

      <div className="mt-rhythm-7">
        <Foto foto={artigo.fotos[2]} />
      </div>

      {/* §6.6 — exactly one exit, and it is real navigation to a listing that
          exists. "Próximo artigo" was refused because it implies a reading
          sequence; a recap of every piece was refused because the legends
          already did it and a recap is where the price would try to re-enter. */}
      <div className="mx-auto mt-rhythm-7 w-full max-w-measure px-gutter">
        <Link href={artigo.fecho.href} className="t-cta inline-block text-ink hover:text-muted">
          {`${artigo.fecho.rotulo} →`}
        </Link>
      </div>
    </article>
  );
}

/**
 * §6.4 — 2–4 sentences on columns 1–5, at a 60–70 character measure. Pieces are
 * named in running language and the name is the link the legend carries; a
 * passagem is never a specification list, never a price, and never an imperative
 * to buy.
 */
function Passagem({ texto }: { texto: string }) {
  return (
    <div className="mx-auto mt-rhythm-7 w-full max-w-measure px-gutter">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-gutter">
        <p className="t-body max-w-reading text-ink lg:col-span-5">{texto}</p>
      </div>
    </div>
  );
}
