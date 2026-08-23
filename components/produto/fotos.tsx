import Image from "next/image";
import { proporcaoDoPrincipal, type Imagem, type Produto } from "@/lib/catalogo";
import { cotasDoPrincipal } from "@/lib/produto/conteudo";
import { CLASSE_DA_PROPORCAO } from "@/components/marca/proporcao";
import { Regua } from "@/components/marca/regua";

/**
 * The purchase block's photograph — `pagina-produto.md` §2.1.
 *
 * **The gallery is not a gallery.** Only the `principal` lives here, in the real
 * proportion `medidas` derives, uncropped, with whatever cota `imagens[0].cotas`
 * declares. There are no thumbnails and no click-to-swap: that is a stateful
 * widget on a page `marca.md` §9 grants only a colour transition, and the other
 * roles are position instructions rather than alternates (`Intervalo` below).
 *
 * It loads eagerly. `imagens.md` §6 makes exactly one loading distinction in the
 * whole store, and this image and the home hero are its two eager cases.
 */
export function Principal({ produto }: { produto: Produto }) {
  const imagem = produto.imagens[0];
  if (!imagem) return null;

  const cotas = cotasDoPrincipal(produto);
  const largura = cotas.find((cota) => cota.eixo === "largura");
  const altura = cotas.find((cota) => cota.eixo === "altura");

  return (
    <figure>
      <div className="flex items-stretch gap-rhythm-3">
        <div
          className={`relative w-full bg-kozo ${CLASSE_DA_PROPORCAO[proporcaoDoPrincipal(produto.medidas)]}`}>
          <Image
            src={imagem.src}
            alt={imagem.alt}
            fill
            priority
            sizes="(min-width: 64rem) 58vw, 100vw"
            className="object-contain"
          />
        </div>
        {altura && <Regua rotulo={altura.rotulo} orientacao="vertical" />}
      </div>

      {largura && (
        <div className="mt-rhythm-3">
          <Regua rotulo={largura.rotulo} />
        </div>
      )}
    </figure>
  );
}

/**
 * A full-bleed break — `ambientada` between §3 and §4, `detalhe` between §5 and
 * §6. Each `papel` is a **position instruction**, so a piece with no ambientada
 * simply does not have that break and nothing is promoted into the empty slot.
 *
 * Both render with **no cota**, always (§8): the page's two régua instances are
 * the one over the packshot and the scale drawing.
 *
 * The band takes the slot's ratio and caps at the viewport, and the photograph
 * is **contained** on the `--kozo` field rather than cropped to it — which is
 * the containment `imagens.md` §4 grants wherever a slot's shape and an image's
 * own shape disagree. A `1:1` macro at full viewport width would otherwise be
 * taller than the screen it breaks.
 */
export function Intervalo({ imagem }: { imagem: Imagem }) {
  const proporcao = imagem.papel === "detalhe" ? "aspect-square" : "aspect-[3/2]";

  return (
    <div className={`relative w-full max-h-[78vh] bg-kozo ${proporcao}`}>
      <Image
        src={imagem.src}
        alt={imagem.alt}
        fill
        sizes="100vw"
        className="object-contain"
      />
    </div>
  );
}
