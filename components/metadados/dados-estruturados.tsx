import type { No } from "@/lib/metadados/estrutura";

/**
 * The one place JSON-LD reaches the document — `rotas.md` §6.
 *
 * It is a server component rendering a `<script>` into the page body, which is
 * where Next puts application/ld+json: `metadata` has no slot for it, and the
 * alternative is a `<head>` injection that a route cannot compose per node.
 *
 * The payload is serialized with `<` escaped. A produto's `nome` or an artigo's
 * `resumo` is authored pt-BR prose and none of the 65 records holds a `<`
 * today, so this is a guard rather than a fix — but the failure it guards
 * against is a script that closes early, which is the one JSON-LD bug that is
 * invisible until a crawler reads it.
 */
export const DadosEstruturados = ({ nos }: { nos: No[] }) => (
  <>
    {nos.map((no, indice) => (
      <script
        key={indice}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(no).replace(/</g, "\u003c") }}
      />
    ))}
  </>
);
