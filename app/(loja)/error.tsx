"use client";

import { SuperficieDeErro } from "@/components/erros/superficie-de-erro";

/**
 * `erros.md` §3.1 — the route-level boundary for every page in the loja group.
 *
 * It sits in the same segment as `layout.tsx`, so it renders *inside* it: the
 * navbar above, `<main>` around it, the full footer below. That is the point of
 * placing it here rather than at the root — a boundary outside both groups would
 * get neither `<main>` nor a footer, and §3.1 asks this surface for full chrome.
 *
 * `retry` is Next 16's name for what the spec calls `reset()`; `reset` still
 * exists but the docs now reserve it for clearing the boundary *without*
 * re-fetching, which is not what "TENTAR NOVAMENTE" promises here.
 */
export default function ErroDaLoja({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <SuperficieDeErro tentarNovamente={retry} />;
}
