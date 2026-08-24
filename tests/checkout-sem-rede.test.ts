import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "bun:test";

// `checkout.md` §12 and `build-spec.md` §State state the same thing twice, and
// both call it a constraint on the build rather than a description of one:
//
//   > **`Checkout` is never persisted and never transmitted.** … the interstício
//   > claims literally that nothing left the browser. No fetch, no server
//   > action, no analytics call, no `localStorage` write in the checkout flow.
//
// The interstitial's sentence — *nada que você digitou saiu deste navegador* —
// is therefore a claim about the source, so the source is what is asserted. This
// walks the real import closure of both routes rather than a hand-listed set of
// files, because a hand-listed set stops covering the flow the moment somebody
// adds a module to it.

const raiz = fileURLToPath(new URL("..", import.meta.url));

const ENTRADAS = ["app/(compra)/checkout/page.tsx", "app/(compra)/pedido-confirmado/page.tsx"];

const EXTENSOES = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

/** `@/x` is the repo root; `./x` and `../x` are relative. Anything else is a
 *  package, and the walk stops there — `next/link` is not this flow's code. */
const resolverImportacao = (especificador: string, de: string): string | null => {
  const base = especificador.startsWith("@/")
    ? join(raiz, especificador.slice(2))
    : especificador.startsWith(".")
      ? resolve(dirname(de), especificador)
      : null;
  if (!base) return null;

  for (const extensao of EXTENSOES) {
    const caminho = base + extensao;
    if (existsSync(caminho) && !caminho.endsWith("/")) {
      try {
        if (readFileSync(caminho).length >= 0) return caminho;
      } catch {
        continue;
      }
    }
  }
  return null;
};

const IMPORTACAO = /(?:from\s+|import\s+|import\()\s*["']([^"']+)["']/g;

const fecho = (): Map<string, string> => {
  const visitados = new Map<string, string>();
  const fila = ENTRADAS.map((entrada) => join(raiz, entrada));

  while (fila.length > 0) {
    const caminho = fila.pop()!;
    if (visitados.has(caminho)) continue;

    const fonte = readFileSync(caminho, "utf8");
    visitados.set(caminho, fonte);

    for (const [, especificador] of fonte.matchAll(IMPORTACAO)) {
      const alvo = resolverImportacao(especificador, caminho);
      if (alvo) fila.push(alvo);
    }
  }

  return visitados;
};

/**
 * Prose is not code. Every file in this flow *talks* about not fetching and not
 * persisting, so the scan reads what runs and not what is written about it.
 */
const semComentarios = (fonte: string): string =>
  fonte.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/.*$/gm, "$1");

const modulos = fecho();

describe("the checkout flow's import closure", () => {
  test("reaches the modules the flow is actually built from", () => {
    const nomes = [...modulos.keys()].map((caminho) => relative(raiz, caminho).replace(/\\/g, "/"));

    for (const esperado of [
      "lib/checkout/estado.ts",
      "lib/checkout/campos.ts",
      "lib/checkout/conteudo.ts",
      "lib/checkout/pedido.ts",
      "lib/carrinho/estado.ts",
      "components/checkout/pagina.tsx",
      "components/checkout/superficie.tsx",
      "components/checkout/intersticio.tsx",
      "components/pedido/registro.tsx",
    ]) {
      expect(nomes).toContain(esperado);
    }
  });
});

// The literal claim, asserted against the code that makes it
describe("nothing the reader types leaves the browser", () => {
  const proibidos: Array<[string, RegExp]> = [
    ["a fetch", /\bfetch\s*\(/],
    ["an XMLHttpRequest", /XMLHttpRequest/],
    ["a beacon", /sendBeacon/],
    ["a socket", /\b(WebSocket|EventSource)\b/],
    ["a server action", /["']use server["']/],
    ["a submitting form action", /<form[^>]*\saction=/],
    ["an analytics call", /\b(gtag|dataLayer|analytics|posthog|plausible)\b/],
  ];

  for (const [oQue, padrao] of proibidos) {
    test(`the flow contains no ${oQue}`, () => {
      for (const [caminho, fonte] of modulos) {
        expect({ arquivo: relative(raiz, caminho), encontrou: padrao.test(semComentarios(fonte)) })
          .toEqual({ arquivo: relative(raiz, caminho), encontrou: false });
      }
    });
  }
});

describe("nothing the reader types is written down", () => {
  const armazenamentos: Array<[string, RegExp]> = [
    ["localStorage", /\blocalStorage\b/],
    ["sessionStorage", /\bsessionStorage\b/],
    ["indexedDB", /\bindexedDB\b/i],
    ["a cookie write", /document\s*\.\s*cookie/],
    ["a cache write", /caches\s*\./],
  ];

  for (const [oQue, padrao] of armazenamentos) {
    test(`the flow writes no ${oQue}`, () => {
      for (const [caminho, fonte] of modulos) {
        expect({ arquivo: relative(raiz, caminho), encontrou: padrao.test(semComentarios(fonte)) })
          .toEqual({ arquivo: relative(raiz, caminho), encontrou: false });
      }
    });
  }

  // `checkout.md` §11 — a record that survived a reload would render a fictional
  // order to somebody who did not just place one. The store is deliberately
  // plain zustand, with no `persist` middleware behind it.
  test("the order record is not persisted through zustand either", () => {
    for (const [, fonte] of modulos) {
      expect(semComentarios(fonte)).not.toContain("zustand/middleware");
      expect(semComentarios(fonte)).not.toContain("persist(");
    }
  });
});
