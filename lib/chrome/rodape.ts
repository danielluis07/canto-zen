// The footer's structure, kept out of the component: which links each column
// holds, which zones a variant carries, and the identification line the decree
// asks for. Copy that is a legal commitment lives in the component beside the
// markup it ships in; what is composed from `loja` is composed here, once.

import { ambientes, loja, paginasDePolitica } from "../catalogo";

export type LinkRodape = { label: string; href: string };

export type ColunaRodape = {
  /** Also the `id` the column's `<nav>` is labelled by (`rodape.md` §11). */
  id: string;
  titulo: string;
  itens: LinkRodape[];
};

/**
 * Three columns — `rodape.md` §6. Atendimento is not among them: it is contact
 * data rather than navigation, it gets a column of its own (§7), and the decree
 * wants it visible rather than filed under a heading.
 *
 * Tipos, coleções, `/carrinho` and `/checkout` are deliberately out.
 */
export function colunasDeLinks(): ColunaRodape[] {
  return [
    {
      id: "rodape-ambientes",
      titulo: "AMBIENTES",
      itens: [
        ...ambientes.map((a) => ({ label: a.label, href: `/${a.slug}` })),
        { label: "Todas as peças", href: "/produtos" },
      ],
    },
    {
      id: "rodape-marca",
      titulo: "A MARCA",
      itens: [
        { label: "Inspirações", href: "/inspiracoes" },
        { label: "Sobre", href: "/sobre" },
        { label: "Contato", href: "/contato" },
      ],
    },
    {
      // One source with the routes, so a policy cannot exist in the footer
      // without a page behind it, or the other way round.
      id: "rodape-ajuda",
      titulo: "AJUDA",
      itens: paginasDePolitica.map((p) => ({
        label: p.titulo,
        href: `/politicas/${p.slug}`,
      })),
    },
  ];
}

/** `completo` everywhere; `reduzido` on `/checkout` alone (`rodape.md` §9). */
export type VarianteRodape = "completo" | "reduzido";

export type ZonasRodape = {
  linhaDeFecho: boolean;
  newsletter: boolean;
  /** The titles of the columns this variant renders, in order. */
  colunas: string[];
  atendimento: boolean;
  marcas: boolean;
  legal: boolean;
};

/**
 * What each variant carries. The reduced one is this same footer with zones
 * withheld — not a second footer — and it keeps all of zone D, because the
 * identification duty does not stop at checkout.
 */
export function zonasDoRodape(variante: VarianteRodape): ZonasRodape {
  const completo = variante === "completo";
  return {
    linhaDeFecho: completo,
    newsletter: completo,
    colunas: completo ? ["AMBIENTES", "A MARCA", "AJUDA"] : ["AJUDA"],
    atendimento: true,
    marcas: true,
    legal: true,
  };
}

/**
 * Decreto 7.962/2013 art. 2º I–II, as one running line: razão social, CNPJ,
 * Inscrição Estadual and the complete address. Composed from `loja`, which
 * `/contato` reads too, so the two surfaces cannot disagree.
 */
export function linhaDeIdentificacao(): string {
  const { endereco } = loja;
  return [
    loja.razaoSocial,
    `CNPJ ${loja.cnpj}`,
    `IE ${loja.inscricaoEstadual}`,
    `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ` +
      `${endereco.cidade} — ${endereco.uf}, CEP ${endereco.cep}`,
  ].join(" · ");
}
