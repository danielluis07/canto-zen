import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  LINHA_DE_LOJA_CONCEITO,
  ROTULO_DO_INDICE,
  documentoDePolitica,
  indiceVisivel,
  linhaDeAtualizacao,
  metadadosDaPolitica,
  politicaEnumerada,
  slugsDePoliticas,
} from "@/lib/institucional/politicas";

/**
 * `/politicas/[slug]` — one layout, four pages (`institucional.md` §11).
 *
 * The set is **exactly four and enumerated**, matching `rotas.md`'s
 * enumerated-not-generated convention: an unknown slug is a `404`, and
 * `prazos-e-entrega` is deliberately not among them — the three links that once
 * pointed there target `entrega-e-frete`.
 *
 * `dynamicParams = false` states the enumeration at the prerendering layer.
 * As on `/produtos/[slug]`, that is enough for the *status* and not for the
 * *document*: Next serves an unenumerated param from its minimal error page,
 * outside the root layout, which loses the navbar and the footer — and
 * `rodape.md` §6 makes the footer's identification non-negotiable on a public
 * page. `proxy.ts` refuses the slug before routing so the store's own 404 is
 * what a reader gets; the `notFound()` below is the same table asked a second
 * time, never a second list.
 *
 * Three structural refusals, all of them §11's:
 *
 * - **No accordion.** It would hide legally required text behind a click, which
 *   is the opposite of the *ostensive* standard Decreto 7.962 art. 5º sets.
 * - **The side index is non-sticky**, and renders only at four or more
 *   sections. Below that it is noise beside a short document.
 * - **A date, not a byline.** `inspiracoes.md` bans dates on an `Artigo` as
 *   blog-signalling; a policy without a version date is a real defect, because
 *   the reader needs to know which version they agreed to.
 *
 * No photograph (§4) and **no régua** (§5): these pages are running text whose
 * figures sit inside sentences, and annotating `7 DIAS` beside a paragraph that
 * says *7 dias corridos* would make the régua a legal-notice device.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return slugsDePoliticas().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/politicas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!politicaEnumerada(slug)) return {};
  const { titulo, descricao } = metadadosDaPolitica(slug);
  return { title: titulo, description: descricao };
}

export default async function PaginaDePolitica({ params }: PageProps<"/politicas/[slug]">) {
  const { slug } = await params;
  if (!politicaEnumerada(slug)) notFound();

  const documento = documentoDePolitica(slug);
  const comIndice = indiceVisivel(documento);

  return (
    <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-5 pb-rhythm-7">
      <header>
        <h1 className="t-display-l text-ink">{documento.titulo}</h1>
        <p className="t-annotation mt-rhythm-3 text-muted">
          {linhaDeAtualizacao(documento.atualizadaEm)}
        </p>
      </header>

      <div className="mt-rhythm-6 lg:grid lg:grid-cols-12 lg:gap-x-gutter">
        {comIndice && (
          // Columns 1–3, `--muted`, annotation voice, **non-sticky**. A `<nav>`
          // with an accessible name, whose anchors target real `id`s (§13).
          <nav
            aria-labelledby="indice-da-politica"
            className="lg:col-span-3 lg:col-start-1 lg:row-start-1">
            <p id="indice-da-politica" className="t-annotation text-muted">
              {ROTULO_DO_INDICE}
            </p>
            <ul className="mt-rhythm-3 flex flex-col gap-rhythm-2">
              {documento.secoes.map((secao) => (
                <li key={secao.id}>
                  <a href={`#${secao.id}`} className="t-body-s text-muted hover:text-ink">
                    {secao.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* The document on columns 5–9, at reading measure. Where there is no
            index the document simply takes the text lane. */}
        <article
          className={`max-w-reading lg:row-start-1 ${
            comIndice ? "mt-rhythm-6 lg:col-span-5 lg:col-start-5 lg:mt-0" : "lg:col-span-7"
          }`}>
          {/* One line, once, at the top — not a banner, and not repeated per
              section (§11). */}
          <p className="t-body-s text-muted">{LINHA_DE_LOJA_CONCEITO}</p>

          {documento.secoes.map((secao) => (
            <section key={secao.id} className="mt-rhythm-5">
              {/* Grotesk 500, not Mincho — the page has spent its one feature
                  line on the title. */}
              <h2 id={secao.id} className="t-body font-medium text-ink">
                {secao.titulo}
              </h2>

              {secao.corpo.map((paragrafo) => (
                <div key={paragrafo.texto} className="mt-rhythm-3">
                  <p className="t-body text-ink">{paragrafo.texto}</p>
                  {/* The article number, once, at the end of its paragraph —
                      visible for the reader who wants to check, silent for the
                      one who does not (§11b). */}
                  {paragrafo.fonte && (
                    <p className="t-annotation mt-rhythm-2 text-muted">{paragrafo.fonte}</p>
                  )}
                </div>
              ))}
            </section>
          ))}
        </article>
      </div>

      {/* A 1px hairline above the footer. No card, no panel, no `--kozo` band. */}
      <hr className="mt-rhythm-7" />
    </div>
  );
}
