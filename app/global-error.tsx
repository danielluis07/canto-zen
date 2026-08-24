"use client";

/**
 * `erros.md` §3.2 — the boundary of last resort, **specified to assume
 * nothing**, because the thing that failed may be the root layout itself.
 *
 * What it therefore refuses:
 *
 * - **It reads no data at all** — no produto, no politicas, no `loja`. A
 *   boundary that needs the data layer in order to render cannot be the boundary
 *   for the data layer failing. That is why the three strings are literals here
 *   rather than imports from `lib/erros/conteudo`: that module reaches the
 *   catálogo for §2.2's offer, and a boundary may not import a module that can
 *   throw. `tests/erros.test.ts` asserts the copy stays identical to §3.1's.
 * - **No navbar component.** The wordmark is plain text.
 * - **No footer.** The identification duty is a duty on the store's *pages*, and
 *   this surface is the admission that no page rendered.
 * - **No `IR PARA O INÍCIO`.** It cannot honestly promise a route it has no
 *   evidence still renders.
 * - **No stylesheet and no font.** `global-error` replaces the root layout, so
 *   `globals.css` and the two `next/font` families are not loaded here and a
 *   class name would resolve to nothing. A page that cannot guarantee its own
 *   fonts loaded should not pretend otherwise, so this one accepts a system
 *   stack. `--ink` on `--plaster` still holds — those are two hex values, not a
 *   dependency, and they are written out as such.
 *
 * `<title>` is the React element rather than a `metadata` export, which a Client
 * Component cannot have.
 */
const TITULO = "Algo quebrou aqui.";
const CORPO = "A falha é nossa, não do que você fez. Recarregar esta página costuma bastar.";
const TENTAR_NOVAMENTE = "TENTAR NOVAMENTE";

const INK = "#1b1a18";
const PLASTER = "#f5f4f0";
const SISTEMA = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif";

export default function ErroGlobal({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, background: PLASTER, color: INK, fontFamily: SISTEMA }}>
        <title>Algo quebrou | Canto Zen</title>

        <main
          style={{
            boxSizing: "border-box",
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "7rem 1.5rem",
          }}>
          <p style={{ margin: 0, fontSize: "0.75rem", letterSpacing: "0.12em" }}>CANTO ZEN</p>

          <h1
            style={{
              margin: "7rem 0 0",
              maxWidth: "24ch",
              fontSize: "2.5rem",
              fontWeight: 400,
              lineHeight: 1.15,
            }}>
            {TITULO}
          </h1>

          <p style={{ margin: "1.5rem 0 0", maxWidth: "60ch", fontSize: "1rem", lineHeight: 1.6 }}>
            {CORPO}
          </p>

          <button
            type="button"
            onClick={retry}
            style={{
              margin: "4rem 0 0",
              padding: "0.75rem 1.5rem",
              border: `1px solid ${INK}`,
              background: "transparent",
              color: INK,
              font: "inherit",
              fontSize: "0.75rem",
              letterSpacing: "0.12em",
              cursor: "pointer",
            }}>
            {TENTAR_NOVAMENTE}
          </button>
        </main>
      </body>
    </html>
  );
}
