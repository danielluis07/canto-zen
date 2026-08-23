import Link from "next/link";
import type { AcabamentoIrmao } from "@/lib/produto/conteudo";

/**
 * *Outros acabamentos* — `pagina-produto.md` §2.4.
 *
 * It sits **inside the buy box**, right below the price, because each acabamento
 * is another produto with another price: choosing between them is a purchase
 * decision, not a navigation one, and it has to be in the block whose figure it
 * changes.
 *
 * Each swatch is a **link** to the sibling's own URL — no client state, no
 * in-place image swap — and the current one is marked with a 1px `--ink`
 * hairline underneath, the same active-item signal the navbar uses and for the
 * same reason: índigo is already spent on the Pix badge.
 *
 * This is where product colour is admitted into the interface. The precedent is
 * `catalogo.md` §3: the swatch arrives as **product data**, not as brand colour,
 * which is why the hex is an inline style rather than a token.
 */
export function Acabamentos({ itens }: { itens: AcabamentoIrmao[] }) {
  if (itens.length === 0) return null;

  return (
    <div className="mt-rhythm-5">
      <p className="t-annotation text-muted">OUTROS ACABAMENTOS</p>

      <ul className="mt-rhythm-3 flex flex-wrap gap-x-rhythm-4 gap-y-rhythm-3">
        {itens.map((item) => (
          <li key={item.slug}>
            <Link
              href={item.href}
              aria-current={item.atual ? "page" : undefined}
              className={`flex items-center gap-rhythm-2 border-b pb-rhythm-1 ${
                item.atual ? "border-ink" : "border-transparent"
              } text-ink hover:text-muted`}>
              <span
                aria-hidden
                style={{ backgroundColor: item.amostra }}
                className="block h-[28px] w-[28px] border border-hairline"
              />
              <span className="t-annotation">{item.label}</span>
            </Link>

            {/* An esgotado sibling stays listed — nothing disappears, exactly
                as in the grid. All that changes is the line underneath. */}
            {item.esgotado && <p className="t-annotation mt-rhythm-1 text-muted">ESGOTADO</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
