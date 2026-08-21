import Link from "next/link";
import type { ItemDaBanda } from "@/lib/listagem/conteudo";

/**
 * `catalogo.md` §2 — the page's permanent statement of where its tipos are.
 *
 * It does not duplicate the navbar panel: the panel is revealed on intent and
 * disappears, and the band is what makes a tipo visibly a **landable path**
 * rather than a filter. The active item takes the 1px `--ink` rule the navbar
 * already fixed for the idea (§9 there); a second device would be a dialect.
 *
 * It wraps onto as many lines as it needs and never scrolls horizontally —
 * hidden navigation is the reason the navbar panel exists.
 */
export function BandaDeTipos({ rotulo, itens }: { rotulo: string; itens: ItemDaBanda[] }) {
  return (
    <nav aria-label={rotulo} className="border-b border-hairline pb-rhythm-2">
      <ul className="flex flex-wrap gap-x-rhythm-4 gap-y-rhythm-2">
        {itens.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.ativo ? "page" : undefined}
              className={
                item.ativo
                  ? "t-annotation border-b border-ink pb-rhythm-1 text-ink"
                  : "t-annotation text-muted hover:text-indigo"
              }>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
