"use client";

// The store's loading language — `erros.md` §4.2, and CONTEXT.md's *conteúdo
// velho*.
//
// Content being replaced stays on screen at reduced contrast; nothing is ever
// swapped for a placeholder of its own shape. There is no skeleton, no spinner
// and no fade, and the ramp itself lives in `globals.css` as the second and
// last entry of `marca.md` §9's closed motion list — including the `120ms`
// delay that keeps a prefetched navigation from flickering.
//
// The trigger is `useLinkStatus().pending`, which is only readable **inside** a
// `<Link>`. The region that dims is not inside one, so the two are joined here:
// every filter, sort and pagination link carries a `<SinalDeNavegacao/>`, and
// the region reads how many of them are pending.

import { useLinkStatus } from "next/link";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Contexto = { pendente: boolean; registrar: (ativo: boolean) => void };

const ContextoDeNavegacao = createContext<Contexto>({ pendente: false, registrar: () => {} });

export function ProvedorDeConteudoVelho({ children }: { children: ReactNode }) {
  // A count, not a flag: two links can be pending at once — the reader clicked
  // a second one — and the first to settle must not clear the region.
  const [pendentes, setPendentes] = useState(0);

  const registrar = useCallback((ativo: boolean) => {
    setPendentes((atual) => Math.max(0, atual + (ativo ? 1 : -1)));
  }, []);

  const valor = useMemo(() => ({ pendente: pendentes > 0, registrar }), [pendentes, registrar]);

  return <ContextoDeNavegacao.Provider value={valor}>{children}</ContextoDeNavegacao.Provider>;
}

/**
 * Rendered inside a `<Link>` and nothing else. It draws nothing: its whole job
 * is to report that link's pending state up to the region being replaced.
 */
export function SinalDeNavegacao() {
  const { pending } = useLinkStatus();
  const { registrar } = useContext(ContextoDeNavegacao);

  useEffect(() => {
    if (!pending) return;
    registrar(true);
    return () => registrar(false);
  }, [pending, registrar]);

  return null;
}

/**
 * The region about to be replaced — the régua and the grid.
 *
 * The chrome is deliberately outside it: navbar, header, tipo band, filter bar
 * and pagination stay at full contrast, because they are the way out and
 * dimming the way out reads as breakage rather than as work in progress.
 *
 * `aria-busy` is both the announcement and the selector the dim hangs off, so
 * the state and its assistive-technology reading cannot drift apart.
 */
export function RegiaoDeResultados({ children }: { children: ReactNode }) {
  const { pendente } = useContext(ContextoDeNavegacao);

  return (
    <div className="conteudo-velho" aria-busy={pendente}>
      {/* Present at all times, empty at rest: a live region announces a change
          to text it already had, never its own arrival. */}
      <p role="status" className="sr-only">
        {pendente ? "Carregando" : ""}
      </p>
      {children}
    </div>
  );
}
