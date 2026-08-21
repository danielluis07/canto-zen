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

export function Regua({ rotulo }: { rotulo: string }) {
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
