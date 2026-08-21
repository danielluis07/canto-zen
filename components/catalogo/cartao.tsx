import Image from "next/image";
import Link from "next/link";
import { proporcaoDoPrincipal, type Produto, type Proporcao } from "@/lib/catalogo";
import { linhaDoCartao, precoAnteriorDoCartao, precoDoCartao } from "@/lib/listagem/conteudo";

/**
 * The three enumerated ratios — `imagens.md` §2. The box declares the piece's
 * own proportion before anything loads and holds a flat `--kozo` field until
 * the photograph paints, so the ragged grid `catalogo.md` §5 asked for never
 * shifts a row. On failure the field simply stays: no icon, no placeholder
 * glyph, no `IMAGEM INDISPONÍVEL`.
 */
const CLASSE_DA_PROPORCAO: Record<Proporcao, string> = {
  "3:2": "aspect-[3/2]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
};

/**
 * The piece plus the text under it — there is no box, no border, no background
 * and no shadow (`catalogo.md` §6). The whole card is the link, and it holds no
 * control of its own: the decision to buy furniture goes through measurement,
 * CEP-quoted frete and montagem, all of which live on the PDP.
 *
 * The parcelamento line is deliberately **not** here. Twelve cards × two price
 * lines is a price table; it survives once per listing, in the policy line.
 */
export function Cartao({ produto }: { produto: Produto }) {
  // Exactly one `principal`, first in `imagens` — an invariant asserted over
  // the whole catalogue, which is why this reads position and not `papel`.
  const principal = produto.imagens[0];
  const anterior = precoAnteriorDoCartao(produto);

  return (
    <Link href={`/produtos/${produto.slug}`} className="group block">
      <div
        className={`relative w-full bg-kozo ${CLASSE_DA_PROPORCAO[proporcaoDoPrincipal(produto.medidas)]}`}>
        <Image
          src={principal.src}
          alt={principal.alt}
          fill
          sizes="(min-width: 64rem) 33vw, 50vw"
          className="object-contain"
        />
      </div>

      <h2 className="t-display-m mt-rhythm-3 text-ink group-hover:text-indigo">{produto.nome}</h2>

      <p className="t-annotation mt-rhythm-1 text-muted">{linhaDoCartao(produto)}</p>

      {/* No colour and no percentage badge — a strikethrough and nothing else. */}
      {anterior && (
        <p className="t-body-s mt-rhythm-1 text-muted line-through decoration-1">{anterior}</p>
      )}

      {/* Body with tabular figures: the Price role stays reserved for the hero
          and the PDP (`home.md` §3). */}
      <p className="t-body mt-rhythm-1 tabular-nums text-ink">{precoDoCartao(produto)}</p>
    </Link>
  );
}
