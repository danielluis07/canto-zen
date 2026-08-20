// The navbar's reasoning, kept out of the components.
//
// `navbar.md` §13 lists the bar's required data: the ambientes with their
// curated tipos, the cart count and the current route. The first comes from the
// catálogo module — the taxonomy is authored there and this file must never
// carry a second copy of it — and the last two arrive as arguments. Nothing
// here touches the DOM: it is seam-1 code, and it is tested there.

import { ambiente, ambientes, tipo } from "../catalogo";

export type ItemNav = {
  slug: string;
  label: string;
  href: string;
  /** Only an ambiente opens one — Inspirações is a flat link (`navbar.md` §5). */
  abrePainel: boolean;
};

/**
 * Five, in this order. `/produtos` lives inside the panel and in the footer,
 * Sobre and Contato in the footer, and coleções have no index — so none of the
 * three gets a slot here (`navbar.md` §5).
 */
export const itensDeNavegacao: ItemNav[] = [
  ...ambientes.map((a) => ({
    slug: a.slug,
    label: a.label,
    href: `/${a.slug}`,
    abrePainel: true,
  })),
  { slug: "inspiracoes", label: "Inspirações", href: "/inspiracoes", abrePainel: false },
];

export type ItemPainel = { slug: string; label: string; href: string };

export type PainelAmbiente = {
  /** The panel is labelled by the ambiente that opened it (`navbar.md` §10). */
  rotulo: string;
  tipos: ItemPainel[];
  verTudo: { label: string; href: string };
};

/**
 * That ambiente's curated tipos in the authored order, then the way out to the
 * landing. Nothing else goes in: no image, no featured piece, no collection, no
 * editorial text (`navbar.md` §6).
 */
export function painelDoAmbiente(slug: string): PainelAmbiente {
  const encontrado = ambiente(slug);
  if (!encontrado) throw new Error(`the navbar has no panel for an unknown ambiente: ${slug}`);

  return {
    rotulo: encontrado.label,
    tipos: encontrado.tipos.map((slugTipo) => {
      const t = tipo(slugTipo);
      if (!t) throw new Error(`${slug} curates a tipo the taxonomy does not carry: ${slugTipo}`);
      return { slug: t.slug, label: t.label, href: `/${encontrado.slug}/${t.slug}` };
    }),
    verTudo: {
      label: `Ver tudo em ${encontrado.label}`,
      href: `/${encontrado.slug}`,
    },
  };
}

/**
 * The item the current route marks with the 1px ink rule, or nothing.
 *
 * `navbar.md` §9's table, read from the first path segment: a room marks itself
 * from its landing and from any of its tipo listings, Inspirações marks itself
 * from the index and from an article, and every other route — the produto page
 * included, where the breadcrumb already states the primary ambiente — marks
 * nothing at all.
 */
export function itemAtivo(pathname: string): string | null {
  const primeiro = pathname.split("/").filter(Boolean)[0];
  const item = itensDeNavegacao.find((candidato) => candidato.slug === primeiro);
  return item ? item.slug : null;
}

/**
 * `(n)`, or nothing at all below one. Never `(0)`: an empty cart makes no claim
 * (`navbar.md` §7).
 */
export function rotuloDaContagem(quantidade: number): string | null {
  return quantidade > 0 ? `(${quantidade})` : null;
}
