"use client";

import Image from "next/image";
import Link from "next/link";
import { anuncioDeQuantidade, REMOVER, type LinhaDoCarrinho } from "@/lib/carrinho/conteudo";
import { useLojaDoCarrinho } from "@/lib/carrinho/estado";

type Props = {
  linha: LinhaDoCarrinho;
  /** The list owns the live region; a line only says what happened (§10). */
  anunciar: (texto: string) => void;
};

/**
 * One `<li>` of the cart — `carrinho.md` §4.
 *
 * Every string and every figure here arrives composed from
 * `lib/carrinho/conteudo.ts`; what is left is placement and three store calls.
 * The line computes nothing, not even the announcement it makes.
 *
 * **The thumbnail stays and the width in cm goes** (§4.1). A `Produto` is one
 * record per acabamento, so the two `poltrona-lina` lines carry the same nome and
 * differ only in a line of annotation and a photograph — buying the wrong finish
 * is the highest-frequency error this data shape allows, and the cart is the last
 * surface where catching it is cheap. The cm is the mirror image: on the listing
 * and the PDP it is the debt owed for keeping the measurement out of `nome`, and
 * here the piece is already chosen, so the figure would only compete with the
 * price for the one number the eye should land on.
 */
export function Linha({ linha, anunciar }: Props) {
  const aumentar = useLojaDoCarrinho((estado) => estado.aumentar);
  const diminuir = useLojaDoCarrinho((estado) => estado.diminuir);
  const remover = useLojaDoCarrinho((estado) => estado.remover);
  const alternarMontagem = useLojaDoCarrinho((estado) => estado.alternarMontagem);

  const passo = (delta: 1 | -1) => {
    (delta === 1 ? aumentar : diminuir)(linha.slug);
    anunciar(anuncioDeQuantidade(linha, linha.quantidade + delta));
  };

  return (
    <li className="flex gap-rhythm-4 border-b border-hairline py-rhythm-4">
      {/* 96px of `--kozo` holding a **contained** packshot — the same field the
          listing card and the PDP use, at the size `imagens.md` calls the crop's
          lower bound. Never a crop: `object-contain`, no radius, no shadow. */}
      <Link href={linha.href} className="relative h-24 w-24 shrink-0 bg-kozo" tabIndex={-1}>
        <Image
          src={linha.imagem.src}
          alt={linha.imagem.alt}
          fill
          sizes="96px"
          className="object-contain"
        />
      </Link>

      <div className="flex flex-1 flex-wrap items-start justify-between gap-x-rhythm-4 gap-y-rhythm-3">
        <div className="min-w-0">
          <Link href={linha.href} className="t-body text-ink hover:text-indigo">
            {linha.nome}
          </Link>

          <p className="t-annotation mt-rhythm-1 text-muted">{linha.acabamento}</p>

          {/* §4.3 — an attribute of the line, not a line of its own. Montagem
              without its piece does not exist, and a sibling row would raise a
              question with no good answer. Editable here so someone who skipped
              it on the PDP does not have to navigate back; the four facts that
              justify the price stay on the PDP, and this shows the price alone. */}
          {linha.montagem && (
            <label className="mt-rhythm-2 flex items-center gap-rhythm-2 text-ink hover:text-muted">
              <input
                type="checkbox"
                checked={linha.montagem.contratada}
                onChange={(evento) => alternarMontagem(linha.slug, evento.target.checked)}
                className="h-[13px] w-[13px] shrink-0 appearance-none border border-muted checked:border-ink checked:bg-ink"
              />
              <span className="t-body-s">{linha.montagem.rotulo}</span>
              <span className="t-body-s text-muted">{linha.montagem.preco}</span>
            </label>
          )}

          {/* §4.4 — the piece's own state, never a count, never a badge, never a
              colour. The esgotado line goes to `--ink` and nothing else moves:
              no veil over the row, no icon. */}
          <p
            className={`t-annotation mt-rhythm-2 ${linha.esgotado ? "text-ink" : "text-muted"}`}>
            {linha.disponibilidade}
          </p>

          {linha.irmao && (
            <Link
              href={linha.irmao.href}
              className="t-annotation mt-rhythm-2 inline-block text-muted hover:text-ink">
              {`${linha.irmao.rotulo} →`}
            </Link>
          )}
        </div>

        <div className="flex flex-col items-end gap-rhythm-3">
          <p className="t-price text-ink">{linha.preco}</p>

          {/* §4.2 — a text stepper. Not a numeric field, which summons the mobile
              keyboard for a change of ±1; not a select, which needs an arbitrary
              ceiling. `−` at quantidade 1 is disabled and is **not** a delete
              shortcut: removal is a word. */}
          <div className="flex items-center">
            {/* The disabled glyph goes to `--hairline`, boundary and all. It is
                the one place that token touches a control, and the reading is
                deliberate: `acessibilidade.md` §5.2 made `--muted` the resting
                border because `--hairline` cannot carry meaning at 1.41 on
                plaster — and a control that cannot be operated has no meaning to
                carry. Both floors exempt an inactive component, and taking the
                glyph alone would leave a dead control inside a live-looking box. */}
            <button
              type="button"
              onClick={() => passo(-1)}
              disabled={!linha.podeDiminuir}
              aria-label={linha.rotuloDiminuir}
              className="flex h-8 w-8 items-center justify-center border border-muted text-muted hover:text-ink disabled:cursor-not-allowed disabled:border-hairline disabled:text-hairline disabled:hover:text-hairline">
              −
            </button>
            <span className="t-annotation w-8 text-center text-ink">{linha.quantidade}</span>
            <button
              type="button"
              onClick={() => passo(1)}
              aria-label={linha.rotuloAumentar}
              className="flex h-8 w-8 items-center justify-center border border-muted text-muted hover:text-ink">
              +
            </button>
          </div>

          {/* The word, not `×`: `navbar.md` fixed zero icons at every breakpoint
              and the footer is the sole registered exception. There is no undo —
              a three-line cart does not justify transient state, and every piece
              is one click from returning via the PDP the nome already links to. */}
          <button
            type="button"
            onClick={() => remover(linha.slug)}
            aria-label={linha.rotuloRemover}
            className="t-annotation text-muted hover:text-ink">
            {REMOVER}
          </button>
        </div>
      </div>
    </li>
  );
}
