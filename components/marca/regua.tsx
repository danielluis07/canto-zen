// The identity's signature — `marca.md` §2.
//
// A 1px `--ink` hairline with a 13px perpendicular tick at each end, carrying a
// real figure in the annotation voice. The label sits on the rule with a breath
// of the page background behind it, which is what cuts the hairline.
//
// The component takes a label and nothing else, because the one rule that
// governs it cannot be expressed as a prop: **an empty régua is prohibited.** A
// caller with no figure to state does not render this at all — see
// `rotuloDaContagem`, which returns `null` at zero for exactly that reason.

/**
 * The horizontal cota runs along the bottom edge of a piece; the vertical one
 * sits **outside** the image, to its right, with the label rotated 90°
 * (`marca.md` §2). `writing-mode` rather than a `transform`, so the label keeps
 * a real box the flow can reserve.
 */
export function Regua({
  rotulo,
  orientacao = "horizontal",
}: {
  rotulo: string;
  orientacao?: "horizontal" | "vertical";
}) {
  if (orientacao === "vertical") {
    return (
      <div className="relative flex w-[13px] justify-center self-stretch">
        <span aria-hidden className="absolute inset-y-0 left-[6px] w-px bg-ink" />
        <span aria-hidden className="absolute top-0 left-0 h-px w-[13px] bg-ink" />
        <span aria-hidden className="absolute bottom-0 left-0 h-px w-[13px] bg-ink" />
        <span className="t-annotation relative mt-rhythm-4 bg-plaster py-rhythm-2 text-ink [writing-mode:vertical-rl]">
          {rotulo}
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex h-[13px] items-center">
      <span aria-hidden className="absolute inset-x-0 top-[6px] h-px bg-ink" />
      <span aria-hidden className="absolute top-0 left-0 h-[13px] w-px bg-ink" />
      <span aria-hidden className="absolute top-0 right-0 h-[13px] w-px bg-ink" />
      <span className="t-annotation relative ml-rhythm-4 bg-plaster px-rhythm-2 text-ink">
        {rotulo}
      </span>
    </div>
  );
}
