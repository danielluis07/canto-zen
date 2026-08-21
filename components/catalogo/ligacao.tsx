"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { SinalDeNavegacao } from "./conteudo-velho";

/**
 * A filter, sort or pagination link — `catalogo.md` §3's "each selection is a
 * real navigation to a server-rendered URL".
 *
 * Two things it adds to a bare `<Link>`, both for the same reason:
 *
 * - **`prefetch={false}`.** A filter bar is a few dozen URLs on screen at once,
 *   and prefetching every one of them fetches the whole cross-product of a
 *   catalogue the reader will look at one slice of.
 * - **The pending signal.** `useLinkStatus` reads only inside a `<Link>`, and a
 *   prefetched link never has a pending phase to read — so the store's loading
 *   language depends on the line above.
 */
export function LigacaoDeControle({
  href,
  className,
  ariaCurrent,
  children,
}: {
  href: string;
  className?: string;
  ariaCurrent?: "page" | "true";
  children: ReactNode;
}) {
  return (
    <Link href={href} prefetch={false} aria-current={ariaCurrent} className={className}>
      {children}
      <SinalDeNavegacao />
    </Link>
  );
}
