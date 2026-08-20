import Link from "next/link";
import { loja } from "@/lib/catalogo";
import {
  colunasDeLinks,
  linhaDeIdentificacao,
  zonasDoRodape,
  type VarianteRodape,
} from "@/lib/chrome/rodape";
import {
  MarcaAmex,
  MarcaBoleto,
  MarcaElo,
  MarcaInstagram,
  MarcaMastercard,
  MarcaPinterest,
  MarcaPix,
  MarcaVisa,
} from "./marcas";
import { Newsletter } from "./newsletter";

const apenasDigitos = (valor: string) => valor.replace(/\D/g, "");

/** `rodape.md` §3 fixes the line, year included: it is copy, not a clock. */
const ANO_DO_COPYRIGHT = 2026;

const MEIOS_DE_PAGAMENTO = [
  { nome: "Pix", Marca: MarcaPix },
  { nome: "Visa", Marca: MarcaVisa },
  { nome: "Mastercard", Marca: MarcaMastercard },
  { nome: "Elo", Marca: MarcaElo },
  { nome: "American Express", Marca: MarcaAmex },
  { nome: "Boleto", Marca: MarcaBoleto },
];

const REDES = [
  { nome: "Instagram", Marca: MarcaInstagram },
  { nome: "Pinterest", Marca: MarcaPinterest },
];

/**
 * The footer does three jobs before it does navigation — `rodape.md` §1: it
 * identifies the supplier the way Decreto 7.962/2013 art. 2º I–II requires, it
 * makes the right of withdrawal conspicuous, and it closes the page on the
 * atelier's position. It is substantial in *text*: there is no photograph in it,
 * on any route, and no régua, which `marca.md` §2 prohibits here by name.
 *
 * `reduzido` is this same footer with zones withheld on `/checkout`, reading the
 * same `loja` — not a second footer (§9).
 */
export function Rodape({ variante = "completo" }: { variante?: VarianteRodape }) {
  const zonas = zonasDoRodape(variante);
  const colunas = colunasDeLinks().filter((coluna) => zonas.colunas.includes(coluna.titulo));
  const { atendimento } = loja;

  return (
    <footer
      role="contentinfo"
      className="mt-rhythm-7 border-t border-hairline bg-plaster text-ink">
      {/* Zone A — the closing line and the newsletter. */}
      {zonas.linhaDeFecho || zonas.newsletter ? (
        <div className="border-b border-hairline">
          <div className="mx-auto grid w-full max-w-measure grid-cols-1 gap-rhythm-5 px-gutter py-rhythm-5 md:grid-cols-12">
            {zonas.linhaDeFecho ? (
              <p className="t-display-m text-ink md:col-span-5">
                Peças feitas sob encomenda em marcenaria própria, em São Paulo.
              </p>
            ) : null}
            {zonas.newsletter ? (
              <div className="md:col-span-4 md:col-start-7">
                <Newsletter />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Zone B — the link columns, and Atendimento as a column of its own. */}
      <div className="border-b border-hairline">
        <div className="mx-auto grid w-full max-w-measure grid-cols-1 gap-rhythm-5 px-gutter py-rhythm-5 sm:grid-cols-2 md:grid-cols-4">
          {colunas.map((coluna) => (
            <nav key={coluna.id} aria-labelledby={coluna.id}>
              <h2 id={coluna.id} className="t-annotation text-muted">
                {coluna.titulo}
              </h2>
              <ul className="mt-rhythm-3 flex flex-col gap-rhythm-1">
                {coluna.itens.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="t-body-s text-ink hover:text-indigo">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          {zonas.atendimento ? (
            <div>
              <h2 className="t-annotation text-muted">ATENDIMENTO</h2>
              <ul className="mt-rhythm-3 flex flex-col gap-rhythm-1">
                <li>
                  <a
                    href={`https://wa.me/55${apenasDigitos(atendimento.whatsapp)}`}
                    className="t-body-s text-ink hover:text-indigo">
                    WhatsApp {atendimento.whatsapp}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:+55${apenasDigitos(atendimento.telefone)}`}
                    className="t-body-s text-ink hover:text-indigo">
                    Telefone {atendimento.telefone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${atendimento.email}`}
                    className="t-body-s text-ink hover:text-indigo">
                    {atendimento.email}
                  </a>
                </li>
                {/* The hours are a fact, not a destination. */}
                <li className="t-body-s text-muted">{atendimento.horario}</li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* Zone C — payment and social marks. No third-party badge: Reclame Aqui,
          Ebit and a PCI certificate are marks earned by a real CNPJ, and showing
          one here would be misrepresentation rather than a design choice. */}
      {zonas.marcas ? (
        <div className="border-b border-hairline">
          <div className="mx-auto flex w-full max-w-measure flex-col gap-rhythm-4 px-gutter py-rhythm-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-rhythm-3 text-muted">
                {MEIOS_DE_PAGAMENTO.map(({ nome, Marca }) => (
                  <Marca key={nome} />
                ))}
              </div>
              <p className="sr-only">
                Formas de pagamento: {MEIOS_DE_PAGAMENTO.map((meio) => meio.nome).join(", ")}.
              </p>
              <p className="t-annotation mt-rhythm-2 text-muted">COMPRA SEGURA</p>
            </div>

            {/* Not links: a signal of presence, not an exit from the store. */}
            <div className="flex items-center gap-rhythm-4 text-muted">
              {REDES.map(({ nome, Marca }) => (
                <span key={nome} className="flex items-center gap-rhythm-1">
                  <Marca />
                  <span className="sr-only">{nome}</span>
                  <span className="t-annotation">@cantozen</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Zone D — the legal block, recessed in --kozo. The tone appears once in
          the store, and at its quietest point. */}
      <div className="bg-kozo">
        <div className="mx-auto flex w-full max-w-measure flex-col gap-rhythm-3 px-gutter py-rhythm-4">
          <p className="t-body-s text-muted">{linhaDeIdentificacao()}</p>

          {/* The one fabricated artefact in the store with a third party on the
              other end of it, and therefore the one that ships qualified. */}
          <p className="t-annotation text-muted">DADOS DE IDENTIFICAÇÃO FICTÍCIOS — LOJA CONCEITO</p>

          {/* CDC art. 49 and Decreto 7.962 art. 5º: ostensive, inline, on every
              route. The site's own form leads because the contract is concluded
              on the site, so the site is the *mesma ferramenta*; WhatsApp and
              e-mail are the *outros meios* the paragraph permits in addition. */}
          <p className="t-body-s text-ink">
            Você pode desistir da compra em até 7 dias corridos a contar do recebimento — ou da
            montagem, quando contratada. Para desistir, use o{" "}
            <Link
              href="/contato?assunto=arrependimento"
              className="underline decoration-hairline underline-offset-4 hover:text-indigo">
              formulário de contato
            </Link>
            ; se preferir, fale pelo WhatsApp ou por {atendimento.email}. Confirmamos na hora e
            concluímos em até 5 dias úteis.{" "}
            <Link
              href="/politicas/trocas-e-devolucoes"
              className="underline decoration-hairline underline-offset-4 hover:text-indigo">
              Como funciona
            </Link>
          </p>

          <p className="t-annotation text-muted">
            © {ANO_DO_COPYRIGHT} Canto Zen · Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
