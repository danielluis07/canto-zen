"use client";

import { SuperficieDeErro } from "@/components/erros/superficie-de-erro";

/**
 * The same surface for `/checkout`, inside the compra group's reduced footer —
 * `rodape.md` §9 keeps the identification block there, and `erros.md` §3.1's
 * "full chrome" means whatever chrome the route already wears.
 */
export default function ErroDaCompra({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <SuperficieDeErro tentarNovamente={retry} />;
}
