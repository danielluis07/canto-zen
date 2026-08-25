"use client";

// Below 1024px the bar keeps its 72px, the wordmark and `CARRINHO (n)`; the way
// into the rest of the store is the word `MENU` — not a hamburger, because the
// zero-icon rule holds at every breakpoint (`navbar.md` §11).
//
// **The threshold is `lg`, not `md`.** `navbar.md` §11 said `768px` and this
// file implemented it, which put the store's one hinge in a different place from
// every page it sits above — `DESIGN.md`'s Layout section allows exactly one, at
// `1024px`, and refuses a tablet-specific layer. Between `768` and `1024` the
// page was one column and the chrome was not. §11 is corrected to `1024px`; what
// the section actually fixes is the *word* `MENU` and the panel's contents, and
// neither of those changes with the number.
//
// The tipo and policy links speak in `.t-body-s`, the **role class**, not in the
// `text-body-s` size utility they used to carry. `marca.md` §4 has a surface pick
// a voice rather than a size, and the two are not interchangeable here: the
// utility sets the size and drops `font-variant-numeric: tabular-nums`, which is
// half of what makes Body S the data voice.
//
// It opens a full-screen panel in `--plaster` with no translucent overlay: the
// four ambientes as an accordion, one open at a time, Inspirações flat, and a
// closing block repeating Sobre, Contato and the policies, which on a small
// screen are too far down the page to be reachable only from the footer.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { paginasDePolitica } from "@/lib/catalogo";
import type { ItemNav, PainelAmbiente } from "@/lib/chrome/navegacao";

type Props = {
  itens: ItemNav[];
  paineis: Record<string, PainelAmbiente>;
};

export function MenuMobile({ itens, paineis }: Props) {
  const pathname = usePathname() ?? "/";
  // The panel remembers the route it was opened on, so following a link inside
  // it closes it without an effect firing a second render after every tap.
  const [abertoEm, setAbertoEm] = useState<string | null>(null);
  const aberto = abertoEm === pathname;
  const [expandido, setExpandido] = useState<string | null>(null);
  const gatilho = useRef<HTMLButtonElement | null>(null);
  const painel = useRef<HTMLElement | null>(null);

  const fechar = useCallback((devolverFoco: boolean) => {
    setAbertoEm(null);
    setExpandido(null);
    if (devolverFoco) gatilho.current?.focus();
  }, []);

  const aoTeclar = (evento: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!aberto) return;

    if (evento.key === "Escape") {
      evento.preventDefault();
      fechar(true);
      return;
    }

    if (evento.key !== "Tab") return;

    const ciclo = [
      gatilho.current,
      ...Array.from(
        painel.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
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

  const ambientesDoMenu = itens.filter((item) => item.abrePainel);
  const inspiracoes = itens.filter((item) => !item.abrePainel);

  return (
    <div className="lg:hidden" onKeyDown={aoTeclar}>
      <button
        type="button"
        ref={gatilho}
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        onClick={() => (aberto ? fechar(true) : setAbertoEm(pathname))}
        className="t-annotation text-ink hover:text-indigo">
        {aberto ? "FECHAR" : "MENU"}
      </button>

      {/* A `<nav>`, so the `aria-label` is attached to something that can carry
          a name. On a bare `<div>` it was discarded — ARIA names only elements
          with a role that supports naming — and `acessibilidade.md` §4's
          "labelled by the trigger's own text" was satisfied in the markup and
          nowhere else. `nav` is the honest role for what this holds: the four
          ambientes, Inspirações and the closing policy links. It is not nested
          inside the desktop group; the two are siblings in the bar, and only one
          of them is ever displayed. */}
      <nav
        id="menu-mobile"
        ref={painel}
        hidden={!aberto}
        aria-label="Menu"
        className="fixed inset-0 top-[var(--altura-navbar)] z-40 overflow-y-auto bg-plaster px-gutter py-rhythm-5">
        <ul>
          {ambientesDoMenu.map((item) => {
            const conteudo = paineis[item.slug];
            const abertoAqui = expandido === item.slug;

            return (
              <li key={item.slug} className="border-b border-hairline py-rhythm-2">
                <button
                  type="button"
                  aria-expanded={abertoAqui}
                  aria-controls={`menu-mobile-${item.slug}`}
                  onClick={() => setExpandido(abertoAqui ? null : item.slug)}
                  className="t-annotation w-full text-left text-ink">
                  {item.label}
                </button>

                <div id={`menu-mobile-${item.slug}`} hidden={!abertoAqui} className="pt-rhythm-2">
                  <ul>
                    {conteudo.tipos.map((tipo) => (
                      <li key={tipo.slug}>
                        <Link
                          href={tipo.href}
                          className="t-body-s block py-[0.375rem] text-ink hover:text-indigo">
                          {tipo.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={conteudo.verTudo.href}
                    className="t-annotation mt-rhythm-2 inline-block text-ink underline decoration-hairline underline-offset-4">
                    {conteudo.verTudo.label}
                  </Link>
                </div>
              </li>
            );
          })}

          {inspiracoes.map((item) => (
            <li key={item.slug} className="border-b border-hairline py-rhythm-3">
              <Link href={item.href} className="t-annotation text-ink hover:text-indigo">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="pt-rhythm-5">
          {[
            { label: "Sobre", href: "/sobre" },
            { label: "Contato", href: "/contato" },
            ...paginasDePolitica.map((p) => ({
              label: p.titulo,
              href: `/politicas/${p.slug}`,
            })),
          ].map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="t-body-s block py-[0.375rem] text-muted hover:text-indigo">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
