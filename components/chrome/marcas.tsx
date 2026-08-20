// The footer's graphical marks — the one place in the storefront that has any.
//
// `rodape.md` §8 registers the exception to the zero-icon rule and fixes its
// price: uniform 18px height, drawn in `--muted`, never in a brand colour, so
// índigo stays the palette's only accent. They are simplified monochrome
// renderings in the régua's stroke grammar rather than the operators' own
// artwork — the store states what it accepts without shipping somebody else's
// asset — and they are `aria-hidden`, because the words beside them in the band
// are what carries the information.

type Props = { className?: string };

const comum = {
  height: 18,
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1,
  "aria-hidden": true as const,
  focusable: "false" as const,
};

export function MarcaPix({ className }: Props) {
  return (
    <svg {...comum} viewBox="0 0 28 18" className={className}>
      <path d="M8 9l5-5 5 5-5 5-5-5z" />
      <path d="M13 4l-2.5-2.5M13 14l-2.5 2.5M18 9h4M8 9H4" />
    </svg>
  );
}

export function MarcaVisa({ className }: Props) {
  return (
    <svg {...comum} viewBox="0 0 28 18" className={className}>
      <rect x="1" y="2" width="26" height="14" />
      <path d="M8 6l3 6 3-6M16 12l3-6 2 6" />
    </svg>
  );
}

export function MarcaMastercard({ className }: Props) {
  return (
    <svg {...comum} viewBox="0 0 28 18" className={className}>
      <circle cx="11" cy="9" r="6" />
      <circle cx="17" cy="9" r="6" />
    </svg>
  );
}

export function MarcaElo({ className }: Props) {
  return (
    <svg {...comum} viewBox="0 0 28 18" className={className}>
      <circle cx="14" cy="9" r="6.5" />
      <path d="M10 5.5a5 5 0 000 7M18.5 6.5l-6 2.5 6 2.5" />
    </svg>
  );
}

export function MarcaAmex({ className }: Props) {
  return (
    <svg {...comum} viewBox="0 0 28 18" className={className}>
      <rect x="1" y="2" width="26" height="14" />
      <path d="M6 12l3-6 3 6M7 10.5h4M15 6h6M15 9h5M15 12h6" />
    </svg>
  );
}

export function MarcaBoleto({ className }: Props) {
  return (
    <svg {...comum} viewBox="0 0 28 18" className={className}>
      <path d="M3 3v12M6 3v12M8.5 3v12M12 3v12M14 3v12M17.5 3v12M20 3v12M23 3v12M25 3v12" />
    </svg>
  );
}

export function MarcaInstagram({ className }: Props) {
  return (
    <svg {...comum} viewBox="0 0 18 18" className={className}>
      <rect x="2" y="2" width="14" height="14" />
      <circle cx="9" cy="9" r="3.5" />
      <circle cx="13" cy="5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MarcaPinterest({ className }: Props) {
  return (
    <svg {...comum} viewBox="0 0 18 18" className={className}>
      <circle cx="9" cy="9" r="7" />
      <path d="M7.5 15l1.5-6M7.5 9.5a2.5 2.5 0 114.5-1.5c0 2-1.2 3.5-2.7 3.5" />
    </svg>
  );
}
