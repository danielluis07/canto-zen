// Store-wide constants, stated once. Every price, badge and add-on figure in the
// store derives from `politicas`; the footer and `/contato` both read `loja`,
// which is the whole reason it is one object.

import type { Centavos, NivelMontagem } from "./modelo";

/** `produto.md` — Commercial policies. */
export const politicas: {
  descontoPixPercent: number;
  parcelasMax: number;
  parcelaMinimaCentavos: Centavos;
  garantiaPadraoMeses: number;
  montagemCentavos: Record<NivelMontagem, Centavos>;
} = {
  descontoPixPercent: 10,
  parcelasMax: 10,
  parcelaMinimaCentavos: 15000, // R$ 150,00
  garantiaPadraoMeses: 24,
  montagemCentavos: {
    simples: 9900,
    media: 19900,
    complexa: 34900,
  },
};

/** `institucional.md` §12. */
export type Loja = {
  razaoSocial: string;
  cnpj: string;
  inscricaoEstadual: string;
  fundacao: number;
  endereco: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  };
  atendimento: {
    whatsapp: string;
    telefone: string;
    email: string;
    horario: string;
  };
  showroom: {
    horario: string[];
  };
};

/**
 * Fictional and well-formed on purpose — `rodape.md` §3. It must be replaced
 * before any real transaction, and it must never be left blank: an empty legal
 * block is exactly the failure that spec exists to prevent. The fabrication is
 * disclosed in shipped copy, in the footer's legal block.
 */
export const loja: Loja = {
  razaoSocial: "Canto Zen Marcenaria e Comércio de Móveis Ltda.",
  cnpj: "51.204.876/0001-40",
  inscricaoEstadual: "116.482.930.114",
  fundacao: 2014,
  endereco: {
    logradouro: "Rua Harmonia",
    numero: "742",
    bairro: "Vila Madalena",
    cidade: "São Paulo",
    uf: "SP",
    cep: "05435-000",
  },
  atendimento: {
    whatsapp: "(11) 90000-0000",
    telefone: "(11) 3000-0000",
    email: "oi@cantozen.com.br",
    horario: "Seg a sex, 9h às 18h",
  },
  showroom: {
    // Distinct from atendimento — `institucional.md` §10.
    horario: ["Seg a sex, 10h às 19h", "Sáb, 10h às 14h"],
  },
};

/** `rotas.md` — Policies. One shared template, four pages. */
export type PaginaDePolitica = { slug: string; titulo: string };

/**
 * The one list. It generates the four `/politicas/[slug]` routes *and* the
 * footer's Ajuda column — `rodape.md` §6 asks for one source precisely so a
 * fifth policy cannot appear in the footer without a page behind it.
 *
 * `prazos-e-entrega` is deliberately not among them: the three links that once
 * pointed there target `entrega-e-frete`, and the old slug is a 404.
 */
export const paginasDePolitica: PaginaDePolitica[] = [
  { slug: "trocas-e-devolucoes", titulo: "Trocas e devoluções" },
  { slug: "entrega-e-frete", titulo: "Entrega e frete" },
  { slug: "privacidade", titulo: "Privacidade" },
  { slug: "termos-de-uso", titulo: "Termos de uso" },
];
