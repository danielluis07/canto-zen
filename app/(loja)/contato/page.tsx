import type { Metadata } from "next";
import { FormularioDeContato } from "@/components/institucional/formulario-de-contato";
import {
  METADADOS_DE_CONTATO,
  TITULO_DA_PAGINA,
  mira,
  showroom,
} from "@/lib/institucional/contato";

/**
 * `/contato` — the form, then the showroom (`institucional.md` §§8–10).
 *
 * **Two sections and no third.** The atendimento channels are omitted:
 * `rodape.md` §7 promoted them to a footer column of their own precisely so
 * WhatsApp, telefone, e-mail and hours are visible on every page, and on a page
 * this short the footer is on screen anyway. Repeating them would make this a
 * page that mostly quotes its own footer.
 *
 * The page keeps the ordinary one-feature-line grant that `/sobre` forfeited:
 * `Contato` in Mincho `Display L`, and no other Mincho anywhere below.
 *
 * It reads one query parameter and that parameter adds **no field**.
 * `?assunto=arrependimento` aims the page: one annotation line above the form
 * and a pre-filled `Mensagem`. There is no *assunto* select — the select would
 * have been a control the reader operates into inboxes that do not exist; this
 * is a link the store aims, from the footer and the confirmation.
 *
 * No régua (`marca.md` §2 excludes forms outright), no photograph (§4), and no
 * embedded map (§10).
 */
export const metadata: Metadata = {
  title: METADADOS_DE_CONTATO.titulo,
  description: METADADOS_DE_CONTATO.descricao,
};

export default async function PaginaDeContato({ searchParams }: PageProps<"/contato">) {
  const { assunto } = await searchParams;
  const aimada = mira(typeof assunto === "string" ? assunto : undefined);
  const espaco = showroom();

  return (
    <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-5 pb-rhythm-7">
      <h1 className="t-display-l text-ink">{TITULO_DA_PAGINA}</h1>

      {/* Form on columns 1–5, showroom on 7–11, right gutter empty. Mobile
          stacks in the same order (§8). */}
      <div className="mt-rhythm-6 lg:grid lg:grid-cols-12 lg:gap-x-gutter">
        <section className="lg:col-span-5">
          <FormularioDeContato mira={aimada} />
        </section>

        {/* Stays rendered through the form's swap — the reader who submitted
            still has a real place to go (§9). */}
        <section className="mt-rhythm-6 lg:col-span-5 lg:col-start-7 lg:mt-0">
          <h2 className="t-body font-medium text-ink">{espaco.titulo}</h2>

          <address className="t-body mt-rhythm-3 text-ink not-italic">
            {espaco.endereco.map((linha) => (
              <span key={linha} className="block">
                {linha}
              </span>
            ))}
          </address>

          <p className="t-annotation mt-rhythm-3 text-muted">{espaco.horario}</p>

          {/* Statement 1 of the manifesto paying off as a practical
              consequence, and the only place the two institutional surfaces
              touch (§10). */}
          <p className="t-body mt-rhythm-3 max-w-reading text-ink">{espaco.nota}</p>

          {/* A plain text link that hands the address to the visitor's own map
              app. An iframe would import another system's colour, type, radius
              and UI into a page whose whole identity is one accent and zero
              radius. */}
          <a
            href={espaco.mapa.href}
            target="_blank"
            rel="noopener noreferrer"
            className="t-annotation mt-rhythm-4 inline-block text-ink hover:text-indigo">
            {espaco.mapa.rotulo}
          </a>
        </section>
      </div>
    </div>
  );
}
