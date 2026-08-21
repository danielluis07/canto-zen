"use client";

// The filter and sort bar — `catalogo.md` §3 on desktop, §12 on small screens.
//
// **A horizontal bar of hairlines**, not a side rail and not a single hidden
// `FILTRAR` trigger: filtering is the only navigation aid this page has after
// the tipo band, and hiding it behind one word on desktop is hiding the page.
// `ORDENAR` sits at the far right of the same bar, pushed there by the empty
// space, because sort is not a filter and the distance says so without a group
// label. The bar does not stick — `navbar.md` §8 already fixes one bar at 72px.
//
// Below `md` the trade-off inverts: there is no spare column, and a bar that
// wraps onto four lines above every grid is worse than two triggers opening a
// sheet. Both sheets and both desktop panels are overlays and obey
// `acessibilidade.md` §4 — `Escape` closes, focus returns to the trigger, focus
// is contained while open, `aria-expanded` on the trigger, one open at a time.
//
// The only client state in the whole surface is **which panel is open**.
// Everything else is an href computed on the server by `lib/listagem/controles`.

import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import type { Controles, Faceta, Opcao } from "@/lib/listagem/controles";
import { LigacaoDeControle } from "./ligacao";

type Props = { controles: Controles };

export function BarraDeFiltros({ controles }: Props) {
  const [aberto, setAberto] = useState<string | null>(null);
  const gatilhos = useRef<Record<string, HTMLButtonElement | null>>({});
  const paineis = useRef<Record<string, HTMLElement | null>>({});

  const fechar = useCallback((devolverFoco: boolean) => {
    setAberto((atual) => {
      if (atual && devolverFoco) gatilhos.current[atual]?.focus();
      return null;
    });
  }, []);

  /** One at a time: opening any overlay closes whichever one was open. */
  const alternar = (chave: string) => setAberto((atual) => (atual === chave ? null : chave));

  // Close on a click outside. Focus goes back to the trigger only when it was
  // inside the overlay: a pointer that lands somewhere else has already chosen
  // where it is going, and moving it back would be the overlay arguing.
  useEffect(() => {
    if (!aberto) return;

    const aoApontar = (evento: PointerEvent) => {
      const alvo = evento.target as Node;
      if (paineis.current[aberto]?.contains(alvo) || gatilhos.current[aberto]?.contains(alvo)) {
        return;
      }
      const foraDoFoco = !paineis.current[aberto]?.contains(document.activeElement);
      fechar(!foraDoFoco);
    };

    document.addEventListener("pointerdown", aoApontar);
    return () => document.removeEventListener("pointerdown", aoApontar);
  }, [aberto, fechar]);

  const aoTeclar = (evento: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!aberto) return;

    if (evento.key === "Escape") {
      evento.preventDefault();
      fechar(true);
      return;
    }

    if (evento.key !== "Tab") return;

    const ciclo = [
      gatilhos.current[aberto],
      ...Array.from(
        paineis.current[aberto]?.querySelectorAll<HTMLElement>(
          "a[href], button:not([disabled])",
        ) ?? [],
      ),
    ].filter((no): no is HTMLElement => no !== null);
    if (ciclo.length === 0) return;

    const posicao = ciclo.indexOf(document.activeElement as HTMLElement);
    if (posicao === -1) return;

    const ultimo = ciclo.length - 1;
    if (!evento.shiftKey && posicao === ultimo) {
      evento.preventDefault();
      ciclo[0].focus();
    } else if (evento.shiftKey && posicao === 0) {
      evento.preventDefault();
      ciclo[ultimo].focus();
    }
  };

  const registrarGatilho = (chave: string) => (no: HTMLButtonElement | null) => {
    gatilhos.current[chave] = no;
  };
  const registrarPainel = (chave: string) => (no: HTMLElement | null) => {
    paineis.current[chave] = no;
  };

  const { facetas, ordenacao, limparHref, total } = controles;
  const algumFiltro = limparHref !== null;

  return (
    <div onKeyDown={aoTeclar}>
      {/* Desktop — one strip of triggers, hairlines between them. */}
      <div className="hidden border-b border-hairline md:flex md:items-stretch">
        {facetas.map((faceta, indice) => (
          <Painel
            key={faceta.chave}
            chave={`faceta-${faceta.chave}`}
            rotulo={faceta.estado}
            titulo={faceta.rotulo}
            destacado={faceta.aplicada}
            primeiro={indice === 0}
            aberto={aberto === `faceta-${faceta.chave}`}
            alternar={alternar}
            registrarGatilho={registrarGatilho}
            registrarPainel={registrarPainel}>
            <ListaDeOpcoes opcoes={faceta.opcoes} />
          </Painel>
        ))}

        {limparHref && (
          <LigacaoDeControle
            href={limparHref}
            className="t-annotation self-center pl-rhythm-4 text-muted hover:text-indigo">
            LIMPAR
          </LigacaoDeControle>
        )}

        {/* Pushed to the right by the empty space, and by nothing else. */}
        <div className="ml-auto flex">
          <Painel
            chave="ordenar"
            rotulo={ordenacao.estado}
            titulo={ordenacao.rotulo}
            destacado={ordenacao.estado !== ordenacao.rotulo}
            primeiro
            alinharADireita
            aberto={aberto === "ordenar"}
            alternar={alternar}
            registrarGatilho={registrarGatilho}
            registrarPainel={registrarPainel}>
            <ListaDeOpcoes opcoes={ordenacao.opcoes} />
          </Painel>
        </div>
      </div>

      {/* Small screens — two triggers, two full-height sheets. */}
      <div className="grid grid-cols-2 border-b border-hairline md:hidden">
        <button
          type="button"
          ref={registrarGatilho("folha-filtrar")}
          aria-expanded={aberto === "folha-filtrar"}
          aria-controls="folha-filtrar"
          onClick={() => alternar("folha-filtrar")}
          className={`t-annotation border-r border-hairline py-rhythm-2 text-left ${
            algumFiltro ? "text-ink" : "text-muted"
          }`}>
          FILTRAR
        </button>
        <button
          type="button"
          ref={registrarGatilho("folha-ordenar")}
          aria-expanded={aberto === "folha-ordenar"}
          aria-controls="folha-ordenar"
          onClick={() => alternar("folha-ordenar")}
          className={`t-annotation py-rhythm-2 pl-rhythm-3 text-left ${
            ordenacao.estado === ordenacao.rotulo ? "text-muted" : "text-ink"
          }`}>
          ORDENAR
        </button>
      </div>

      <Folha
        chave="folha-filtrar"
        rotulo="FILTRAR"
        aberta={aberto === "folha-filtrar"}
        total={total}
        fechar={fechar}
        registrarPainel={registrarPainel}>
        {facetas.map((faceta: Faceta) => (
          <section key={faceta.chave} className="border-b border-hairline py-rhythm-3">
            <h2 className="t-annotation text-muted">{faceta.estado}</h2>
            <div className="mt-rhythm-2">
              <ListaDeOpcoes opcoes={faceta.opcoes} />
            </div>
          </section>
        ))}

        {limparHref && (
          <LigacaoDeControle
            href={limparHref}
            className="t-annotation mt-rhythm-3 inline-block text-muted">
            LIMPAR
          </LigacaoDeControle>
        )}
      </Folha>

      <Folha
        chave="folha-ordenar"
        rotulo="ORDENAR"
        aberta={aberto === "folha-ordenar"}
        total={total}
        fechar={fechar}
        registrarPainel={registrarPainel}>
        <ListaDeOpcoes opcoes={ordenacao.opcoes} />
      </Folha>
    </div>
  );
}

/**
 * A trigger and the panel anchored below it — `--plaster`, a 1px hairline, no
 * radius, no shadow, `220px` minimum, `1.25rem` of padding.
 */
function Painel({
  chave,
  rotulo,
  titulo,
  destacado,
  primeiro,
  alinharADireita,
  aberto,
  alternar,
  registrarGatilho,
  registrarPainel,
  children,
}: {
  chave: string;
  rotulo: string;
  titulo: string;
  destacado: boolean;
  primeiro: boolean;
  alinharADireita?: boolean;
  aberto: boolean;
  alternar: (chave: string) => void;
  registrarGatilho: (chave: string) => (no: HTMLButtonElement | null) => void;
  registrarPainel: (chave: string) => (no: HTMLElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${primeiro ? "" : "border-l border-hairline"}`}>
      <button
        type="button"
        ref={registrarGatilho(chave)}
        aria-expanded={aberto}
        aria-controls={chave}
        onClick={() => alternar(chave)}
        className={`t-annotation py-rhythm-2 ${primeiro ? "pr-rhythm-4" : "px-rhythm-4"} ${
          destacado ? "text-ink" : "text-muted"
        } hover:text-indigo`}>
        {rotulo}
      </button>

      <div
        id={chave}
        ref={registrarPainel(chave)}
        hidden={!aberto}
        aria-label={titulo}
        className={`absolute top-full z-30 min-w-[220px] border border-hairline bg-plaster p-[1.25rem] ${
          alinharADireita ? "right-0" : "left-0"
        }`}>
        {children}
      </div>
    </div>
  );
}

/**
 * A full-height sheet in `--plaster` with the facets stacked and a closing
 * action at the foot: `VER {n} PEÇAS`, the count updated on every selection
 * because every selection is a navigation. It appears and disappears without
 * animation — `marca.md` §9.3 permits no `transform` and no size transition.
 */
function Folha({
  chave,
  rotulo,
  aberta,
  total,
  fechar,
  registrarPainel,
  children,
}: {
  chave: string;
  rotulo: string;
  aberta: boolean;
  total: number;
  fechar: (devolverFoco: boolean) => void;
  registrarPainel: (chave: string) => (no: HTMLElement | null) => void;
  children: React.ReactNode;
}) {
  return (
    <div
      id={chave}
      ref={registrarPainel(chave)}
      hidden={!aberta}
      aria-label={rotulo}
      className="fixed inset-0 top-[var(--altura-navbar)] z-40 flex flex-col overflow-y-auto bg-plaster px-gutter py-rhythm-4 md:hidden">
      <div className="flex-1">{children}</div>

      <button
        type="button"
        onClick={() => fechar(true)}
        className="t-cta mt-rhythm-5 w-full border border-ink py-rhythm-3 text-ink">
        {`VER ${total} ${total === 1 ? "PEÇA" : "PEÇAS"}`}
      </button>
    </div>
  );
}

/**
 * The panel's items — Body S, `--ink`, `0.375rem` of vertical padding, hover to
 * `--indigo`, exactly as the navbar panel's links.
 *
 * A marked value takes a **1px `--ink` hairline under the label**, never a
 * checkbox: a checkbox is a form control, and this is a set of links, each one
 * pointing at the URL that removes it again.
 *
 * Cor carries the swatch — a 12px square of `cor.amostra` with a hairline. It
 * is the only place in the storefront where a colour outside the palette
 * appears in interface, and it appears as **product data**, not decoration.
 */
function ListaDeOpcoes({ opcoes }: { opcoes: Opcao[] }) {
  return (
    <ul>
      {opcoes.map((opcao) => (
        <li key={opcao.slug}>
          <LigacaoDeControle
            href={opcao.href}
            ariaCurrent={opcao.marcado ? "true" : undefined}
            className="flex items-center gap-rhythm-2 py-[0.375rem] text-body-s text-ink hover:text-indigo">
            {opcao.amostra && (
              <span
                aria-hidden
                style={{ backgroundColor: opcao.amostra }}
                className="inline-block h-[12px] w-[12px] shrink-0 border border-hairline"
              />
            )}
            <span className={opcao.marcado ? "border-b border-ink" : undefined}>{opcao.label}</span>
          </LigacaoDeControle>
        </li>
      ))}
    </ul>
  );
}
