"use client";

// Below 768px the bar keeps its 72px, the wordmark and `CARRINHO (n)`; the way
// into the rest of the store is the word `MENU` — not a hamburger, because the
// zero-icon rule holds at every breakpoint (`navbar.md` §11).
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
  const painel = useRef<HTMLDivElement | null>(null);

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
    <div className="md:hidden" onKeyDown={aoTeclar}>
      <button
        type="button"
        ref={gatilho}
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        onClick={() => (aberto ? fechar(true) : setAbertoEm(pathname))}
        className="t-annotation text-ink hover:text-indigo">
        {aberto ? "FECHAR" : "MENU"}
      </button>

      <div
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
                          className="block py-[0.375rem] text-body-s text-ink hover:text-indigo">
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
                className="block py-[0.375rem] text-body-s text-muted hover:text-indigo">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
