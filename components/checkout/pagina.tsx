"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { CatalogoDoCarrinho } from "@/lib/carrinho/catalogo";
import { itensResolvidos } from "@/lib/carrinho/conteudo";
import { useCarrinho, useLojaDoCarrinho } from "@/lib/carrinho/estado";
import { BEAT_MS } from "@/lib/checkout/conteudo";
import type { Checkout } from "@/lib/checkout/estado";
import { pedidoDe, useLojaDoPedido } from "@/lib/checkout/pedido";
import { Intersticio, Processando } from "./intersticio";
import { Superficie } from "./superficie";

/**
 * The three phases of `/checkout` — `checkout.md` §2.
 *
 * `processando` and `intersticio` are **phases of this route, not routes**: they
 * have no URL and no history entry, so `rotas.md`'s table is unchanged and the
 * back button from the interstitial returns to the cart rather than to a
 * half-submitted form.
 */
type Fase = "formulario" | "processando" | "intersticio";

/**
 * `/checkout`, connected to the browser's cart — `carrinho.md` §9, `checkout.md`
 * §11.
 *
 * This component reads the store and owns the transition; the surface it renders
 * is pure over the `Carrinho` it is handed, which is what keeps every state of
 * the page renderable in a test without a browser.
 *
 * **The prerendered document is always the empty cart**, and that is correct
 * rather than a limitation: the cart lives in this tab and nothing persists it,
 * so a reader arriving from `/carrinho` arrives by client navigation with the
 * store already holding what they added. A genuine cold arrival has an empty
 * cart and is sent to `/carrinho`, which owns the empty state (§11).
 *
 * **Nothing here fetches, transmits or persists.** The 1500ms beat is a
 * `setTimeout` and nothing else — there is no request behind it to wait for,
 * which is the whole admission the interstitial then makes out loud.
 */
export function PaginaDoCheckout({ catalogo }: { catalogo: CatalogoDoCarrinho }) {
  const router = useRouter();
  const carrinho = useCarrinho();
  const esvaziar = useLojaDoCarrinho((estado) => estado.esvaziar);
  const registrar = useLojaDoPedido((estado) => estado.registrar);

  const [fase, definirFase] = useState<Fase>("formulario");
  const [pendente, definirPendente] = useState<Checkout | null>(null);

  const vazio = itensResolvidos(carrinho, catalogo).length === 0;

  // §11 — `/checkout` with an empty cart redirects to `/carrinho`. Guarded on
  // the phase: the cart is cleared at the transition, and without the guard the
  // clearing would bounce the reader out of their own confirmation.
  useEffect(() => {
    if (fase === "formulario" && vazio) router.replace("/carrinho");
  }, [fase, vazio, router]);

  // §2.2 — **1500ms and no longer.** The beat exists to set an expectation, not
  // to simulate work; a longer wait is the same lie with more syllables.
  useEffect(() => {
    if (fase !== "processando") return;
    const relogio = setTimeout(() => definirFase("intersticio"), BEAT_MS);
    return () => clearTimeout(relogio);
  }, [fase]);

  const finalizar = (checkout: Checkout) => {
    definirPendente(checkout);
    definirFase("processando");
  };

  /**
   * The transition — §11. The record is composed from what the reader chose,
   * the cart is cleared, and only then does the route change: composing after
   * the clear would produce an order with no lines in it.
   */
  const verOPedido = () => {
    if (!pendente) return;
    registrar(pedidoDe(pendente, carrinho, catalogo));
    esvaziar();
    router.push("/pedido-confirmado");
  };

  // There is no checkout without a cart, so an empty one renders nothing at all
  // rather than a form over a `R$ 0,00` resumo — a figure four specs forbid, and
  // the last thing a reader should see on their way to `/carrinho`.
  //
  // Guarded on the phase, like the redirect above and for the same reason: §11
  // clears the cart *at the transition*, so between `VER O PEDIDO` and
  // `/pedido-confirmado` this page is briefly a checkout with an empty cart.
  // Without the guard the interstitial would blank out under the reader's own
  // click, which is the one frame of this flow that must not flicker.
  if (fase === "formulario" && vazio) return null;

  return (
    <>
      <Superficie
        carrinho={carrinho}
        catalogo={catalogo}
        processando={fase !== "formulario"}
        aoFinalizar={finalizar}
      />

      {/* The wash and the statement both **arrive as a cut**: they are mounted,
          never faded, and `marca.md` §9's closed list of two is not spent here.
          The moment the surface exists to admit was never real work, so
          dramatising its arrival would be the one thing this page must not do. */}
      {fase === "processando" && <Processando />}
      {fase === "intersticio" && <Intersticio aoVerOPedido={verOPedido} />}
    </>
  );
}
