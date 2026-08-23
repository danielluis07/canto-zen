import type { Metadata } from "next";
import Link from "next/link";
import { familia, produto as buscarProduto } from "@/lib/catalogo";
import { disponibilidadeEmTexto } from "@/lib/listagem/conteudo";
import { produtosEnumerados } from "@/lib/listagem/rotas";
import {
  acabamentosDaFamilia,
  assinatura,
  distintivoDePix,
  embalagemEmTexto,
  entregaEAcesso,
  fechamento,
  fichaTecnica,
  irmaoDisponivel,
  linhasDeMedidasExtras,
  metadadosDoProduto,
  montagemDaPagina,
  parcelamentoDaPagina,
  precoAVistaEmTexto,
  precoAnteriorEmTexto,
  trilha,
  trioDeMedidas,
} from "@/lib/produto/conteudo";
import { Cartao } from "@/components/catalogo/cartao";
import { Acabamentos } from "@/components/produto/acabamentos";
import { Compra } from "@/components/produto/compra";
import { Desenho } from "@/components/produto/desenho";
import { Intervalo, Principal } from "@/components/produto/fotos";

/**
 * The produto page — `pagina-produto.md`.
 *
 * **Flat at `/produtos/[slug]`, with no ambiente in the path** (`rotas.md`), and
 * the breadcrumb is what reconstructs the room: it reads `ambientePrincipal`,
 * so the trail is identical for a reader who arrived from Quarto, a reader who
 * arrived from `/produtos`, and a crawler that arrived from nowhere.
 *
 * Every slug is enumerated, so `dynamicParams = false` answers an unknown one
 * with a real `404`. Unlike the listing routes this page reads no query, so it
 * prerenders and the declaration is enforced by the router rather than at
 * request time. `proxy.ts` refuses the unenumerated slug one layer earlier all
 * the same — not for the status, which is already right, but for the document:
 * Next serves that `404` from its minimal error page, outside the root layout,
 * and `rodape.md` §6 makes the footer's identification non-negotiable on a
 * public page.
 *
 * **The buy box is not sticky** (§0) and there is **no fixed bottom bar** on
 * mobile (§9), although both are near-universal on Brazilian PDPs: on mobile the
 * bar would cover exactly the scale drawing and the measurements table, the two
 * things this page exists for.
 *
 * The CEP block of §2.7 renders inside the buy box, below the CTA: frete is
 * answered here rather than first met at checkout.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return produtosEnumerados().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const produto = buscarProduto(slug);
  if (!produto) return {};

  const { titulo, descricao } = metadadosDoProduto(produto);
  return { title: titulo, description: descricao };
}

export default async function PaginaDeProduto({ params }: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const produto = buscarProduto(slug);
  // Unreachable through the router, which refuses an unenumerated slug before
  // this renders. It is here so the type narrows on a fact the route already
  // guarantees, never as a second enumeration.
  if (!produto) throw new Error(`no such produto: ${slug}`);

  const desenho = familia(produto.familia)?.desenho;
  const ambientada = produto.imagens.find((imagem) => imagem.papel === "ambientada");
  const detalhe = produto.imagens.find((imagem) => imagem.papel === "detalhe");
  const parcelamento = parcelamentoDaPagina(produto);
  const precoAnterior = precoAnteriorEmTexto(produto);
  const extras = linhasDeMedidasExtras(produto);
  const fim = fechamento(produto);

  return (
    <div className="pt-rhythm-5 pb-rhythm-7">
      <div className="mx-auto w-full max-w-measure px-gutter">
        {/* §1 — annotation voice, `/` separator, and no chevron: the system's
            arrows are characters, and here the character is the separator. */}
        <nav aria-label="Você está em">
          <ol className="flex flex-wrap items-center gap-x-rhythm-2">
            {trilha(produto).map((item) => (
              <li key={item.rotulo} className="flex items-center gap-x-rhythm-2">
                {item.href ? (
                  <Link href={item.href} className="t-annotation text-muted hover:text-ink">
                    {item.rotulo}
                  </Link>
                ) : (
                  <span aria-current="page" className="t-annotation text-ink">
                    {item.rotulo}
                  </span>
                )}
                {item.href && (
                  <span aria-hidden className="t-annotation text-muted">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* §2 — the default pair from `marca.md` §5: image on 7 columns, buy box
            on 5. It stacks on mobile in exactly §9's order. */}
        <div className="mt-rhythm-5 grid gap-y-rhythm-6 lg:grid-cols-12 lg:gap-x-gutter">
          <div className="lg:col-span-7">
            <Principal produto={produto} />
          </div>

          <div className="lg:col-span-5">
            {/* The only Mincho line on the entire page — `marca.md` §4 grants
                one feature line, and the piece's name spends it. No section
                below gets a display title. */}
            <h1 className="t-display-xl text-ink">{produto.nome}</h1>
            <p className="t-annotation mt-rhythm-3 text-muted">{assinatura(produto)}</p>

            <div className="mt-rhythm-5">
              {/* No colour and no percentage badge — a strikethrough and
                  nothing else, same as the card. */}
              {precoAnterior && (
                <p className="t-body-s text-muted line-through decoration-1">{precoAnterior}</p>
              )}

              <div
                className={`flex flex-wrap items-baseline gap-x-rhythm-3 gap-y-rhythm-1 ${
                  precoAnterior ? "mt-rhythm-1" : ""
                }`}>
                <p className="t-price text-ink">{precoAVistaEmTexto(produto)}</p>
                {/* The first of the page's two índigos, and the conspicuous
                    disclosure Lei 13.455 requires for the differentiated price
                    to be lawful. The focus ring spends the second. */}
                <p className="t-annotation text-indigo">{distintivoDePix()}</p>
              </div>

              {parcelamento && <p className="t-body-s mt-rhythm-2 text-muted">{parcelamento}</p>}
            </div>

            <Acabamentos itens={acabamentosDaFamilia(produto)} />

            {/* Three states and never a count. No state colour, no stock
                figure, no "restam apenas 2". */}
            <p className="t-annotation mt-rhythm-5 text-muted">
              {disponibilidadeEmTexto(produto)}
            </p>

            <Compra
              slug={produto.slug}
              esgotado={produto.disponibilidade === "esgotado"}
              // The four fields §2.7's quote reads, and not the whole record:
              // this is the client boundary, and what crosses it is named.
              peca={{
                embalagem: produto.embalagem,
                freteGratis: produto.freteGratis,
                disponibilidade: produto.disponibilidade,
                prazoProducaoSemanas: produto.prazoProducaoSemanas,
              }}
              irmao={irmaoDisponivel(produto)}
              montagem={montagemDaPagina(produto)}
            />
          </div>
        </div>

        {/* §3 — no Mincho opening: the name already spent the page's one feature
            line, and a second display here would give the page two heroes. */}
        <section className="mt-rhythm-7">
          <h2 className="t-annotation text-muted">DESCRIÇÃO</h2>
          <p className="t-body mt-rhythm-4 max-w-reading text-ink">{produto.descricao}</p>
        </section>
      </div>

      {/* A piece with no `ambientada` simply does not have this break; nothing
          is promoted into the empty slot. */}
      {ambientada && (
        <div className="mt-rhythm-7">
          <Intervalo imagem={ambientada} />
        </div>
      )}

      <div className="mx-auto w-full max-w-measure px-gutter">
        {/* §4 — the section that decides the purchase. Everything here is a
            figure; every attribute is in §5. */}
        <section className="mt-rhythm-7">
          <h2 className="t-annotation text-muted">MEDIDAS</h2>

          <div className="mt-rhythm-5 grid gap-y-rhythm-6 lg:grid-cols-12 lg:gap-x-gutter">
            {desenho && (
              <div className="lg:col-span-7">
                <Desenho desenho={desenho} />
              </div>
            )}

            <div className="lg:col-span-5">
              <p className="t-annotation text-ink">{trioDeMedidas(produto.medidas)}</p>

              {/* The open list, and empty is a supported state: five tipos
                  carry no extras at all, and the section still renders. */}
              {extras.length > 0 && (
                <dl className="mt-rhythm-4 border-t border-hairline">
                  {extras.map((linha) => (
                    <div
                      key={linha.rotulo}
                      className="flex items-baseline justify-between gap-rhythm-3 border-b border-hairline py-rhythm-2">
                      <dt className="t-annotation text-muted">{linha.rotulo}</dt>
                      <dd className="t-annotation text-ink">{linha.valor}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* §4.3 — recessed in `--kozo`, because it is another set of
                  figures with another function: this is what has to get through
                  the door and the lift. */}
              <div className="mt-rhythm-5 bg-kozo px-rhythm-4 py-rhythm-3">
                <p className="t-annotation text-muted">EMBALAGEM</p>
                <p className="t-annotation mt-rhythm-2 text-ink">{embalagemEmTexto(produto)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* §5 — everything qualitative. The split from §4 is by species of
            fact, not by label. */}
        <section className="mt-rhythm-7">
          <h2 className="t-annotation text-muted">FICHA TÉCNICA</h2>

          <dl className="mt-rhythm-5 border-t border-hairline">
            {fichaTecnica(produto).map((linha) => (
              <div
                key={linha.rotulo}
                className="grid gap-rhythm-2 border-b border-hairline py-rhythm-3 lg:grid-cols-12 lg:gap-x-gutter">
                <dt className="t-annotation text-muted lg:col-span-4">{linha.rotulo}</dt>
                <dd className="lg:col-span-8">
                  {linha.valores.map((valor) => (
                    <p key={valor} className="t-body text-ink">
                      {valor}
                    </p>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {detalhe && (
        <div className="mt-rhythm-7">
          <Intervalo imagem={detalhe} />
        </div>
      )}

      <div className="mx-auto w-full max-w-measure px-gutter">
        {/* §6 — prose, not a table. The access warning is a caution, and a
            table row would bury it. No box, no alert icon, no colour. */}
        <section className="mt-rhythm-7">
          <h2 className="t-annotation text-muted">ENTREGA E ACESSO</h2>
          <div className="mt-rhythm-4 max-w-reading">
            {entregaEAcesso(produto).map((paragrafo) => (
              <p key={paragrafo} className="t-body mt-rhythm-3 text-ink">
                {paragrafo}
              </p>
            ))}
          </div>
        </section>

        {/* §7 — a link back to a real listing is navigation, not a suggestion.
            There is no "quem viu também viu" and no "complete o ambiente". */}
        <section className="mt-rhythm-7">
          {fim.tipo === "colecao" ? (
            <>
              <h2 className="t-annotation text-muted">{fim.titulo}</h2>
              <div className="mt-rhythm-5 grid grid-cols-2 gap-x-gutter gap-y-rhythm-6 lg:grid-cols-3">
                {fim.produtos.map((irmao) => (
                  <Cartao key={irmao.slug} produto={irmao} />
                ))}
              </div>
            </>
          ) : (
            <Link href={fim.href} className="t-annotation text-ink hover:text-muted">
              {`${fim.rotulo} →`}
            </Link>
          )}
        </section>
      </div>
    </div>
  );
}
