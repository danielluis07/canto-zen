// The metadata layer — `rotas.md` §§ Metadata, 0–5.
//
// Every route's title and description are already computed by the module that
// owns the route's data (`lib/listagem/conteudo.ts`, `lib/produto/conteudo.ts`,
// `lib/inspiracoes/conteudo.ts`, `lib/institucional/*`), because §0's rule 2
// forbids writing a line *for* the metadata layer. What is left over is the
// part that is the same on every route and nowhere else in the store: the
// canonical URL, the robots directive, and the share card.
//
// So this file adds no copy. It assembles.

import type { Metadata } from "next";
import type { Figura, Produto } from "../catalogo/modelo";
import { type Consulta, paginar, selecionar, temFiltro } from "../listagem/consulta";

/**
 * Canonicals are **absolute** (`rotas.md` §4), which in Next means one
 * `metadataBase` at the root and relative paths everywhere below it. The
 * domain is the store's own, taken from the address the atendimento e-mail
 * already publishes rather than invented here.
 */
export const ORIGEM = new URL("https://cantozen.com.br");

/**
 * The `--kozo` field, as imgix writes a colour: no `#`, because the parameter
 * is a value and not CSS. It has to be the token and not a grey that resembles
 * it — the card is the same containment treatment `imagens.md` gives the cart's
 * 96px square — so `tests/metadados.test.ts` reads `--kozo` out of
 * `app/globals.css` and holds the two together.
 */
export const CAMPO_DE_COMPARTILHAMENTO = "f1f0ec";

/** 1.91:1 — the one frame proportion the store does not control (§5). */
export const LARGURA_DO_CARTAO = 1200;
export const ALTURA_DO_CARTAO = 630;

/**
 * The photograph **contained** in a 1200×630 `--kozo` field, never cropped.
 *
 * This is not a new rule: `imagens.md` gives the cart's 96px and the checkout's
 * 64px squares exactly this treatment, and §5 applies it to the share card
 * because the store's own ratios are `3:2`, `1:1` and `4:5` *derived from
 * `medidas`* — an authored 1.91:1 crop is the one composition the imagery
 * system cannot produce, and cropping to it would cut the cast shadow that
 * `marca.md` §7 makes part of the frame.
 *
 * Phase 1 hotlinks Unsplash, whose URLs are imgix, so the containment is the
 * source's own `fit=fill` rather than a compositing step this build would
 * otherwise have to own. `fill-color` is where the field goes. When phase 2
 * lands local photographs this function is the one place that changes.
 */
export const campoDeCompartilhamento = (figura: Figura): string => {
  const url = new URL(figura.src);
  url.searchParams.set("w", String(LARGURA_DO_CARTAO));
  url.searchParams.set("h", String(ALTURA_DO_CARTAO));
  url.searchParams.set("fit", "fill");
  url.searchParams.set("fill", "solid");
  url.searchParams.set("fill-color", CAMPO_DE_COMPARTILHAMENTO);
  return url.toString();
};

export type Cartao = {
  /**
   * The **finished** `og:title`, suffix and all. Next applies the root layout's
   * `title.template` to the `<title>` and to nothing else, so a card that took
   * the bare name would silently drop the wordmark — and the home, which is
   * unsuffixed by §1, would have no way to say so.
   */
  titulo: string;
  descricao: string;
  /**
   * Absent on `/sobre`, `/contato` and the four `/politicas/[slug]`, and that
   * absence is authored: `institucional.md` made those pages photography-free,
   * and generating a wordmark card to fill the slot re-adds the image the page
   * refused one layer down (§5). A text-only preview is what those pages are.
   */
  imagem?: Figura;
  /** `article` on `/inspiracoes/[slug]`; `website` everywhere else. Never `product`. */
  tipo?: "website" | "article";
};

/**
 * `og:title` and `og:description` **mirror the tab exactly** (§5) — never a
 * second, more enthusiastic pair — so this takes the same two strings the
 * `<title>` and the description were built from and does not touch them.
 *
 * `og:type` is never `product`: that type expects `og:price:amount` and
 * `product:availability`, which is the offer claim §6 refuses.
 */
export const compartilhamento = ({
  titulo,
  descricao,
  imagem,
  tipo = "website",
}: Cartao): Metadata => ({
  openGraph: {
    type: tipo,
    title: titulo,
    description: descricao,
    siteName: "Canto Zen",
    locale: "pt_BR",
    images: imagem
      ? [
          {
            url: campoDeCompartilhamento(imagem),
            width: LARGURA_DO_CARTAO,
            height: ALTURA_DO_CARTAO,
            alt: imagem.alt,
          },
        ]
      : undefined,
  },
  twitter: {
    card: imagem ? "summary_large_image" : "summary",
    title: titulo,
    description: descricao,
    images: imagem ? [campoDeCompartilhamento(imagem)] : undefined,
  },
});

/**
 * The suffix `rotas.md` §1 puts on every route but the home. `app/layout.tsx`
 * states it as a `title.template`, which Next applies to the `<title>` and to
 * nothing else — so the one other place a full title is written out is here.
 */
export const tituloCompleto = (titulo: string): string => `${titulo} | Canto Zen`;

/** Indexable and self-canonical — the default for every route in §4's first list. */
export const indexavel = (caminho: string): Metadata => ({
  alternates: { canonical: caminho },
});

/**
 * `noindex, follow` with the canonical pointing at the clean path. The pages
 * that are `noindex` for their own sake (`/carrinho`, `/checkout`,
 * `/pedido-confirmado`, the 404) declare it themselves, because they also carry
 * no description and no card and it would be misleading to route them through a
 * helper whose other half they refuse.
 */
export const naoIndexavel = (caminho: string): Metadata => ({
  alternates: { canonical: caminho },
  robots: { index: false, follow: true },
});

/**
 * Whether a listing URL carries **filter or sort** state, which is what makes
 * it `noindex` (§4). `ordem` counts and `pagina` does not: a sort is a
 * rearrangement of a set already indexed at the clean path, while pages 2+ hold
 * pieces that exist at no other indexable URL — which is the whole reason
 * `pagina` is the single indexable param.
 */
export const filtrada = (consulta: Consulta): boolean =>
  temFiltro(consulta) || consulta.ordem !== "curadoria";

export type Listagem = {
  caminho: string;
  titulo: string;
  descricao: string;
  imagem?: Figura;
  consulta: Consulta;
  /** The route's unfiltered set — what the page number is clamped against. */
  conjunto: Produto[];
  /**
   * `/colecoes/[slug]` renders its curated order and **ignores** the facet
   * keys (`catalogo.md`), so clamping its page against a filtered set would
   * name a page the grid does not have. It is `noindex` when those keys are
   * present all the same: §4 makes that a property of the URL, not of what the
   * route chose to do with it.
   */
  filtravel?: boolean;
};

/**
 * One listing's whole head: title, description, canonical, robots and card.
 *
 * **Filters never change the title** (§1) — `?cor=cru` changes the canonical,
 * not the tab. **Pagination does**, because page 2+ is indexable and two
 * indexable URLs may not share a title. The page number is clamped exactly as
 * the grid clamps it, so `?pagina=99` on a two-page room does not put a title
 * in the head naming a page the body does not render.
 */
export const metadadosDeListagem = ({
  caminho,
  titulo,
  descricao,
  imagem,
  consulta,
  conjunto,
  filtravel = true,
}: Listagem): Metadata => {
  const { pagina } = paginar(
    filtravel ? selecionar(conjunto, consulta) : conjunto,
    consulta.pagina,
  );
  const nomeada = pagina > 1 ? `${titulo} — página ${pagina}` : titulo;

  return {
    title: nomeada,
    description: descricao,
    ...(filtrada(consulta)
      ? naoIndexavel(caminho)
      : indexavel(pagina > 1 ? `${caminho}?pagina=${pagina}` : caminho)),
    ...compartilhamento({ titulo: tituloCompleto(nomeada), descricao, imagem }),
  };
};
