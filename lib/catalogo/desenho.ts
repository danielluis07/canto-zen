// `Familia.desenho` — the PDP's scale mechanism.
//
// `imagens.md` §7 fixes it as inline SVG line art: an orthographic front
// elevation, 1px strokes in --ink, construction and extension lines in
// --hairline, dimension lines in the régua's own grammar — hairline with end
// ticks, the figure in the annotation voice with tabular figures. Inline rather
// than an `<img>` so it inherits the colour tokens and stays crisp at any size.
//
// The silhouette is authored per família; the dimension frame is not, because
// fifty-nine hand-copied frames is fifty-nine chances for the grammar to drift.
// The frame reads `medidas`, which is what makes marca.md's prohibition
// enforceable: no figure, no régua.

import type { Figura, Medidas } from "./modelo";

type Elevacao = {
  /** The piece's own geometry — the frame's only source of figures. */
  medidas: Medidas;
  /**
   * The silhouette, as SVG path `d` strings in piece coordinates: x runs
   * 0..largura, y runs 0..altura from the top.
   */
  corpo: string[];
  alt: string;
};

const trio = ({ largura, profundidade, altura }: Medidas) =>
  `L ${largura} × P ${profundidade} × A ${altura} cm`;

/** Coordinates carry two decimals; binary float tails are not draughtsmanship. */
const arredondar = (valor: number) => Number(valor.toFixed(2));

export const elevacao = ({ medidas, corpo, alt }: Elevacao): Figura => {
  const { largura: larguraPeca, altura: alturaPeca } = medidas;

  // The drawing's own unit, so a luminária and a sofá carry proportionally
  // identical annotation however far apart their real sizes are.
  const escala = Math.max(larguraPeca, alturaPeca) / 100;
  const un = (valor: number) => arredondar(valor * escala);

  const margemEsquerda = un(4);
  const margemTopo = un(8);
  const margemDireita = un(34);
  const margemBase = un(42);

  const tick = un(4);
  const meioTick = arredondar(tick / 2);
  const fonteCota = un(9);
  const fonteTrio = un(6.5);
  const tracking = un(1.2);

  // The trio is the widest thing on the page and it is not allowed to run off
  // it, so the box opens up rather than the figure shrinking out of the voice.
  const larguraTrio = trio(medidas).length * (fonteTrio * 0.62 + tracking);
  const larguraCaixa = arredondar(
    Math.max(margemEsquerda + larguraPeca + margemDireita, larguraTrio + 2 * margemEsquerda),
  );
  const alturaCaixa = arredondar(margemTopo + alturaPeca + margemBase);

  // Horizontal cota, under the piece.
  const yCota = arredondar(margemTopo + alturaPeca + un(12));
  const xFim = arredondar(margemEsquerda + larguraPeca);

  // Vertical cota, to its right.
  const xCota = arredondar(margemEsquerda + larguraPeca + un(12));
  const yFim = arredondar(margemTopo + alturaPeca);

  const anotacao = (tamanho: number) =>
    [
      `font-family="var(--font-grotesk), sans-serif"`,
      `font-weight="500"`,
      `font-size="${tamanho}"`,
      `letter-spacing="${tracking}"`,
      `fill="var(--muted)"`,
      `style="font-variant-numeric:tabular-nums"`,
    ].join(" ");

  const src = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${larguraCaixa} ${alturaCaixa}" role="img" aria-label="${alt}" fill="none" stroke-linecap="square">`,
    // The piece.
    `<g transform="translate(${margemEsquerda} ${margemTopo})" stroke="var(--ink)" stroke-width="1" vector-effect="non-scaling-stroke">`,
    ...corpo.map((d) => `<path d="${d}"/>`),
    `</g>`,
    // Extension and dimension lines.
    `<g stroke="var(--hairline)" stroke-width="1" vector-effect="non-scaling-stroke">`,
    `<path d="M${margemEsquerda} ${yFim} V${arredondar(yCota + meioTick)}"/>`,
    `<path d="M${xFim} ${yFim} V${arredondar(yCota + meioTick)}"/>`,
    `<path d="M${margemEsquerda} ${yCota} H${xFim}"/>`,
    `<path d="M${margemEsquerda} ${arredondar(yCota - meioTick)} V${arredondar(yCota + meioTick)}"/>`,
    `<path d="M${xFim} ${arredondar(yCota - meioTick)} V${arredondar(yCota + meioTick)}"/>`,
    `<path d="M${xFim} ${margemTopo} H${arredondar(xCota + meioTick)}"/>`,
    `<path d="M${xFim} ${yFim} H${arredondar(xCota + meioTick)}"/>`,
    `<path d="M${xCota} ${margemTopo} V${yFim}"/>`,
    `<path d="M${arredondar(xCota - meioTick)} ${margemTopo} H${arredondar(xCota + meioTick)}"/>`,
    `<path d="M${arredondar(xCota - meioTick)} ${yFim} H${arredondar(xCota + meioTick)}"/>`,
    `</g>`,
    // The figures. A cota without one is forbidden, so each rule carries its own.
    `<text x="${arredondar(margemEsquerda + larguraPeca / 2)}" y="${arredondar(yCota - un(4))}" text-anchor="middle" ${anotacao(fonteCota)}>${larguraPeca}</text>`,
    `<text x="${arredondar(xCota + un(4))}" y="${arredondar(margemTopo + alturaPeca / 2)}" dominant-baseline="middle" ${anotacao(fonteCota)}>${alturaPeca}</text>`,
    // Profundidade is the figure an elevation cannot draw, so the trio carries it.
    `<text x="${arredondar(larguraCaixa / 2)}" y="${arredondar(alturaCaixa - un(9))}" text-anchor="middle" ${anotacao(fonteTrio)}>${trio(medidas)}</text>`,
    `</svg>`,
  ].join("");

  return { src, alt };
};
