// The cart's state, in the browser and nowhere else.
//
// This file exists because the navbar counter and the cart page must read **one**
// source — `build-spec.md` states that as the reason `Carrinho` is a single piece
// of client state, so the badge and the page cannot disagree. Nothing is
// persisted and nothing is transmitted.
//
// The mutations are **pure functions over `Carrinho`**, and the store below is a
// thin wrapper around them. That split is `build-spec.md` §Seam 2's deal: the
// interaction logic that can be pulled below the DOM is pulled here and tested
// at seam 1, and what is left in the component is wiring. Every rule
// `carrinho.md` §9 states — increment rather than append, removal explicit and
// never a quantidade of zero — lives in a function a test can call with no DOM.
//
// **Not persisted.** `carrinho.md` §9 leaves persistence to the build and says
// nothing depends on it. A `localStorage` rehydration would make the prerendered
// `/carrinho` disagree with its own first client render, and the empty cart is a
// designed surface (§7) rather than a flash to hide.

import { create } from "zustand";

/** `carrinho.md` §9. */
export type ItemCarrinho = { slug: string; quantidade: number; montagem: boolean };
export type Carrinho = { itens: ItemCarrinho[]; cep?: string };

export const carrinhoVazio: Carrinho = { itens: [] };

/** The count the navbar shows: pieces, not lines. */
export function quantidadeTotal(carrinho: Carrinho): number {
  return carrinho.itens.reduce((total, item) => total + item.quantidade, 0);
}

/**
 * What the produto page's `COMPRAR` hands over — `carrinho.md` §§4.1, 4.3.
 *
 * Adding a slug already present **increments** its quantidade rather than
 * appending a second line: one acabamento is one line, and two acabamentos of
 * one família are two, which the slug already decides. Montagem travels as an
 * attribute of the line and takes the choice made on this visit, the later
 * statement of the same preference — the cart's own checkbox stays editable
 * either way.
 */
export function adicionarAoCarrinho(
  carrinho: Carrinho,
  { slug, montagem }: { slug: string; montagem: boolean },
): Carrinho {
  const presente = carrinho.itens.some((item) => item.slug === slug);

  return {
    ...carrinho,
    itens: presente
      ? carrinho.itens.map((item) =>
          item.slug === slug
            ? { ...item, quantidade: item.quantidade + 1, montagem }
            : item,
        )
      : [...carrinho.itens, { slug, quantidade: 1, montagem }],
  };
}

/**
 * One line's edit, applied in place — the shape the three editing rules below
 * share. Insertion order survives because the map never reorders, which is
 * `carrinho.md` §4.1's ordering rule and §4.4's refusal to regroup at once.
 *
 * A slug the cart does not hold leaves it untouched rather than throwing: the
 * only caller is a control rendered from a line that exists, so a miss is a
 * double submit and not a defect worth a white screen.
 */
const editarLinha = (
  carrinho: Carrinho,
  slug: string,
  edicao: (item: ItemCarrinho) => ItemCarrinho,
): Carrinho => ({
  ...carrinho,
  itens: carrinho.itens.map((item) => (item.slug === slug ? edicao(item) : item)),
});

/** `+` on the stepper — `carrinho.md` §4.2. No ceiling: a select would need one. */
export function aumentarQuantidade(carrinho: Carrinho, slug: string): Carrinho {
  return editarLinha(carrinho, slug, (item) => ({ ...item, quantidade: item.quantidade + 1 }));
}

/**
 * `−` on the stepper, and it **floors at 1** — `carrinho.md` §4.2.
 *
 * The control is disabled there rather than becoming a delete shortcut, and this
 * function holds the same floor so the rule survives a caller that forgets:
 * removal is a word, and a quantidade of zero is a state `carrinho.md` §9 says
 * the cart never represents.
 */
export function diminuirQuantidade(carrinho: Carrinho, slug: string): Carrinho {
  return editarLinha(carrinho, slug, (item) => ({
    ...item,
    quantidade: Math.max(1, item.quantidade - 1),
  }));
}

/** `REMOVER`, the word — the only exit a line has, and there is no undo (§4.2). */
export function removerDoCarrinho(carrinho: Carrinho, slug: string): Carrinho {
  return { ...carrinho, itens: carrinho.itens.filter((item) => item.slug !== slug) };
}

/**
 * The per-line montagem toggle — `carrinho.md` §4.3.
 *
 * Editable here and not only on the PDP: someone who skipped it on the product
 * page must not have to navigate back. The price it implies is never stored on
 * the line; it is derived from the produto's `montagem.nivel` at read time.
 */
export function definirMontagem(carrinho: Carrinho, slug: string, montagem: boolean): Carrinho {
  return editarLinha(carrinho, slug, (item) => ({ ...item, montagem }));
}

/**
 * What the checkout's transition leaves behind — `checkout.md` §11.
 *
 * **The cart is cleared at the transition**, and clearing is what makes the
 * confirmation mean anything: a cart that survives its own purchase is a bug the
 * reader will correctly read as one. The navbar counter returns to zero and the
 * word `CARRINHO` loses its `(n)` (`navbar.md` §7).
 *
 * **The session CEP stays.** It is not cart contents — it is the reader's own
 * CEP, typed on a PDP and shared by three surfaces (`build-spec.md` §State), and
 * forgetting it here would ask for it a fourth time on the next visit. §11 names
 * the counter and the items; it does not name this.
 */
export function esvaziarCarrinho(carrinho: Carrinho): Carrinho {
  return carrinho.cep ? { itens: [], cep: carrinho.cep } : carrinhoVazio;
}

/**
 * The session CEP — `pagina-produto.md` §2.7, `build-spec.md` §State.
 *
 * Typed once on the produto page and read pre-filled by the cart and the
 * checkout: asking for the same CEP three times is the defect the convention
 * exists to avoid, and one field on `Carrinho` is what makes the three surfaces
 * unable to disagree. Stored as the **bare eight digits**, so a reader who typed
 * the hyphen and one who did not leave the same value behind, and the surfaces
 * downstream mask it themselves.
 *
 * A malformed CEP is not remembered: it is the `Corrigível` the field answers,
 * and carrying it forward would pre-fill checkout with a known typo.
 */
export function lembrarCep(carrinho: Carrinho, cep: string): Carrinho {
  const digitos = cep.replace(/\D/g, "");
  return digitos.length === 8 ? { ...carrinho, cep: digitos } : carrinho;
}

// ---------------------------------------------------------------------------
// The store
// ---------------------------------------------------------------------------

type LojaDoCarrinho = {
  carrinho: Carrinho;
  adicionar: (peca: { slug: string; montagem: boolean }) => void;
  aumentar: (slug: string) => void;
  diminuir: (slug: string) => void;
  remover: (slug: string) => void;
  alternarMontagem: (slug: string, montagem: boolean) => void;
  lembrarCepDe: (cep: string) => void;
  esvaziar: () => void;
};

/**
 * One store for the whole tab, created at module scope — which is what makes the
 * navbar counter and the cart page the same reading rather than two subscriptions
 * to two trees. There is no provider, and that is the change zustand buys: a
 * context has to wrap something, and the counter renders in the root layout above
 * every route while the page that edits the cart renders below it.
 *
 * Every action delegates to the pure function above it and does nothing else, so
 * the rules stay where a test can reach them without a renderer.
 *
 * On the server this store is simply empty — the cart is browser state, the
 * surfaces that read it are client components, and their prerender is the empty
 * cart. Nothing here is written during a request.
 */
export const useLojaDoCarrinho = create<LojaDoCarrinho>()((set) => ({
  carrinho: carrinhoVazio,
  adicionar: (peca) => set(({ carrinho }) => ({ carrinho: adicionarAoCarrinho(carrinho, peca) })),
  aumentar: (slug) => set(({ carrinho }) => ({ carrinho: aumentarQuantidade(carrinho, slug) })),
  diminuir: (slug) => set(({ carrinho }) => ({ carrinho: diminuirQuantidade(carrinho, slug) })),
  remover: (slug) => set(({ carrinho }) => ({ carrinho: removerDoCarrinho(carrinho, slug) })),
  alternarMontagem: (slug, montagem) =>
    set(({ carrinho }) => ({ carrinho: definirMontagem(carrinho, slug, montagem) })),
  lembrarCepDe: (cep) => set(({ carrinho }) => ({ carrinho: lembrarCep(carrinho, cep) })),
  esvaziar: () => set(({ carrinho }) => ({ carrinho: esvaziarCarrinho(carrinho) })),
}));

/** The whole cart — the navbar counter's reading, and the cart page's. */
export const useCarrinho = (): Carrinho => useLojaDoCarrinho((estado) => estado.carrinho);
