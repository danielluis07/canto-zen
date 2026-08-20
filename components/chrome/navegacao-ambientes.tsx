"use client";

// The desktop navigation group and its panels.
//
// `navbar.md` §10 and `acessibilidade.md` §4 fix the behaviour between them: the
// label is a link, hover opens after a 120ms intent delay, leaving closes after
// 180ms, scrolling closes immediately, one panel is open at a time, Escape closes
// and returns focus to the label that opened it, focus is contained while open,
// and the label carries `aria-expanded`. Touch and keyboard have no hover, so the
// first activation opens instead of navigating.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { itemAtivo, type ItemNav, type PainelAmbiente } from "@/lib/chrome/navegacao";

const ATRASO_ABERTURA = 120;
const ATRASO_FECHAMENTO = 180;

type Props = {
  itens: ItemNav[];
  /** Composed on the server — the taxonomy never travels twice. */
  paineis: Record<string, PainelAmbiente>;
};

export function NavegacaoAmbientes({ itens, paineis }: Props) {
  const pathname = usePathname() ?? "/";
  const ativo = itemAtivo(pathname);
  // The open panel is remembered together with the route it was opened on, so a
  // navigation closes it by arithmetic rather than by an effect that would fire
  // a second render after every click.
  const [abertura, setAbertura] = useState<{ slug: string; rota: string } | null>(null);
  const aberto = abertura && abertura.rota === pathname ? abertura.slug : null;
  const setAberto = useCallback(
    (slug: string | null) => setAbertura(slug ? { slug, rota: pathname } : null),
    [pathname],
  );

  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gatilhos = useRef(new Map<string, HTMLAnchorElement | null>());
  const paineisRef = useRef(new Map<string, HTMLDivElement | null>());
  const grupo = useRef<HTMLElement | null>(null);

  const limpar = useCallback(() => {
    if (temporizador.current) clearTimeout(temporizador.current);
    temporizador.current = null;
  }, []);

  const agendar = useCallback(
    (slug: string | null, atraso: number) => {
      limpar();
      temporizador.current = setTimeout(() => setAberto(slug), atraso);
    },
    [limpar, setAberto],
  );

  const fechar = useCallback(
    (devolverFoco: boolean) => {
      limpar();
      const anterior = aberto;
      setAberto(null);
      if (devolverFoco && anterior) gatilhos.current.get(anterior)?.focus();
    },
    [aberto, limpar, setAberto],
  );

  useEffect(() => limpar, [limpar]);

  useEffect(() => {
    if (!aberto) return;

    // Scrolling closes immediately: the panel hangs off a bar that is about to
    // move under it.
    const aoRolar = () => setAberto(null);
    const aoApontarFora = (evento: PointerEvent) => {
      if (!grupo.current?.contains(evento.target as Node)) setAberto(null);
    };

    window.addEventListener("scroll", aoRolar, { passive: true });
    document.addEventListener("pointerdown", aoApontarFora);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      document.removeEventListener("pointerdown", aoApontarFora);
    };
  }, [aberto, setAberto]);

  /** The trigger and its panel's links, in tab order — the loop focus stays in. */
  const focalizaveis = (slug: string): HTMLElement[] => {
    const gatilho = gatilhos.current.get(slug);
    const painel = paineisRef.current.get(slug);
    const dentro = painel ? Array.from(painel.querySelectorAll<HTMLElement>("a[href]")) : [];
    return gatilho ? [gatilho, ...dentro] : dentro;
  };

  const aoTeclar = (evento: ReactKeyboardEvent<HTMLElement>) => {
    if (!aberto) return;

    if (evento.key === "Escape") {
      evento.preventDefault();
      fechar(true);
      return;
    }

    if (evento.key !== "Tab") return;

    const ciclo = focalizaveis(aberto);
    if (ciclo.length === 0) return;
    const atual = document.activeElement as HTMLElement | null;
    const posicao = atual ? ciclo.indexOf(atual) : -1;
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

  const aoApontar = (evento: ReactPointerEvent<HTMLAnchorElement>, slug: string) => {
    // A pointer that is not a mouse has no hover, so the first activation opens
    // the panel instead of navigating; "Ver tudo em {Ambiente}" is the way on.
    if (evento.pointerType === "mouse") return;
    if (aberto === slug) return;
    evento.preventDefault();
    limpar();
    setAberto(slug);
  };

  return (
    <nav
      aria-label="Navegação principal"
      ref={grupo}
      onKeyDown={aoTeclar}
      className="ml-[3.5rem] hidden md:block">
      <ul className="relative flex items-center gap-[2rem]">
        {itens.map((item) => {
          const painel = item.abrePainel ? paineis[item.slug] : undefined;
          const marcado = ativo === item.slug;
          const escancarado = aberto === item.slug;

          return (
            <li
              key={item.slug}
              onPointerEnter={
                painel ? (e) => e.pointerType === "mouse" && agendar(item.slug, ATRASO_ABERTURA) : undefined
              }
              onPointerLeave={
                painel ? (e) => e.pointerType === "mouse" && agendar(null, ATRASO_FECHAMENTO) : undefined
              }>
              <Link
                href={item.href}
                ref={(node) => {
                  gatilhos.current.set(item.slug, node);
                }}
                aria-expanded={painel ? escancarado : undefined}
                aria-controls={painel ? `painel-${item.slug}` : undefined}
                onFocus={painel ? () => {
                  limpar();
                  setAberto(item.slug);
                } : undefined}
                onPointerDown={painel ? (e) => aoApontar(e, item.slug) : undefined}
                className={[
                  "t-annotation block py-[0.5rem]",
                  // Open takes the label to full ink; only the current route
                  // draws the 1px rule under it (`navbar.md` §9).
                  marcado || escancarado ? "text-ink" : "text-muted hover:text-ink",
                  marcado ? "border-b border-ink" : "border-b border-transparent",
                ].join(" ")}>
                {item.label}
              </Link>

              {painel ? (
                <div
                  id={`painel-${item.slug}`}
                  ref={(node) => {
                    paineisRef.current.set(item.slug, node);
                  }}
                  hidden={!escancarado}
                  aria-label={painel.rotulo}
                  className="absolute left-0 top-full z-40 w-[260px] border-b border-hairline bg-plaster py-[2rem]">
                  <ul>
                    {painel.tipos.map((tipo) => (
                      <li key={tipo.slug}>
                        <Link
                          href={tipo.href}
                          className="block py-[0.375rem] text-body-s text-ink hover:text-indigo">
                          {tipo.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <hr className="my-[1.25rem]" />
                  <Link
                    href={painel.verTudo.href}
                    className="t-annotation text-ink underline decoration-hairline underline-offset-4 hover:text-indigo">
                    {painel.verTudo.label}
                  </Link>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
