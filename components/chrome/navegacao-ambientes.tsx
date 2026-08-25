"use client";

// The desktop navigation group and its panels.
//
// `navbar.md` §10 and `acessibilidade.md` §4 fix the behaviour between them: the
// label is a link, hover opens after a 120ms intent delay, leaving closes after
// 180ms, scrolling closes immediately, one panel is open at a time, Escape closes
// and returns focus to the label that opened it, and the label carries
// `aria-expanded`. Touch and keyboard have no hover, so the first activation opens
// instead of navigating.
//
// **This panel does not contain focus.** It is a non-modal disclosure hanging off
// a link that never leaves the page's own tab order, so Tab walks through the
// tipos and straight on into the next ambiente — `navbar.md` §10's order,
// unmodified — and the panel closes as soon as focus lands outside the group.
// `acessibilidade.md` §4.2 reserves containment for the modal overlays: a
// disclosure that swallowed Tab in both directions would leave Escape as the only
// way out, which is a trap however well it is documented.
//
// **The bar hinges at `lg`, with the rest of the store.** `DESIGN.md`'s Layout
// section fixes one breakpoint — `1024px`, card grids the only exception, "no
// tablet-specific layer" — and the group used to appear at `md` (`768px`). In
// the 256px between them the chrome ran its desktop layout, five labels and four
// hover panels hanging a 260px column, over a page still in its single-column
// arrangement. That gap was the tablet layer the rule forbids, arrived at by
// accident rather than by design; `navbar.md` §11 is corrected to match.
//
// The tipo links inside a panel speak in `.t-body-s`, the **role class**, not in
// the `text-body-s` size utility. `marca.md` §4 has a surface pick a voice rather
// than a size, and the difference is load-bearing rather than stylistic: the
// utility sets the size and leaves `font-variant-numeric` alone, so the tabular
// figures that make Body S a data voice never arrive.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  FocusEvent as ReactFocusEvent,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
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

  // Escape is an accelerator, not the exit of last resort: it closes without
  // walking back out through the tipos and returns focus to the label. Tab is
  // deliberately left alone — see the note at the top of the file.
  const aoTeclar = (evento: ReactKeyboardEvent<HTMLElement>) => {
    if (!aberto) return;
    if (evento.key !== "Escape") return;
    evento.preventDefault();
    fechar(true);
  };

  // Focus leaving the group closes the panel, with no focus return: the keyboard
  // has already moved on and pulling it back would be the trap by another name.
  // Movement *within* the group is left to the labels' own `onFocus`, which opens
  // the next ambiente's panel or, on Inspirações, closes the open one — still one
  // panel at a time.
  const aoDesfocar = (evento: ReactFocusEvent<HTMLElement>) => {
    if (!aberto) return;
    if (grupo.current?.contains(evento.relatedTarget)) return;
    setAberto(null);
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
      onBlur={aoDesfocar}
      className="ml-[3.5rem] hidden self-stretch lg:block">
      {/*
        The group stretches to the bar's full 72px and so does every `<li>`,
        which settles two things that were one bug each. Each panel is now
        positioned by its own trigger instead of by the whole group, so it hangs
        under the ambiente that opened it and no pointer path to it crosses a
        neighbouring label; and `top-full` now resolves at the bottom of the bar
        instead of halfway up it, so the panel starts below the bar's
        `border-b border-hairline` — `mt-px` clears the rule itself — and the
        hairline is never interrupted.
      */}
      <ul className="flex h-full items-center gap-[2rem]">
        {itens.map((item) => {
          const painel = item.abrePainel ? paineis[item.slug] : undefined;
          const marcado = ativo === item.slug;
          const escancarado = aberto === item.slug;

          return (
            <li
              key={item.slug}
              className="relative flex h-full items-center"
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
                onFocus={() => {
                  limpar();
                  setAberto(painel ? item.slug : null);
                }}
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
                // `role="group"` is what makes the `aria-label` real.
                // `acessibilidade.md` §4 requires the overlay to be labelled by
                // its trigger's own text, and a bare `<div>` cannot hold a name:
                // ARIA only names elements with a role that supports naming, so
                // every major screen reader discarded this one and the panel
                // announced as nothing. `group` is the accurate role for a
                // non-modal disclosure hanging off a link — it is not a dialog
                // (§4.2 forbids containing focus here) and it is not a second
                // `nav`, since it opens inside `Navegação principal`.
                <div
                  id={`painel-${item.slug}`}
                  hidden={!escancarado}
                  role="group"
                  aria-label={painel.rotulo}
                  className="absolute left-0 top-full z-40 mt-px w-[260px] border-b border-hairline bg-plaster py-[2rem]">
                  <ul>
                    {painel.tipos.map((tipo) => (
                      <li key={tipo.slug}>
                        <Link
                          href={tipo.href}
                          className="t-body-s block py-[0.375rem] text-ink hover:text-indigo">
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
