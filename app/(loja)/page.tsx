import type { Metadata } from "next";
import { Ambientes } from "@/components/home/ambientes";
import { Colecao } from "@/components/home/colecao";
import { FaixaDeDestaques } from "@/components/home/faixa-de-destaques";
import { Inspiracoes } from "@/components/home/inspiracoes";
import { Marcenaria } from "@/components/home/marcenaria";
import { PecaEmDestaque } from "@/components/home/peca-em-destaque";
import { Servico } from "@/components/home/servico";
import {
  camposDeAmbientes,
  colecaoEmDestaque,
  descricaoDaHome,
  destaqueDaHome,
  linhasDeInspiracao,
  marcenariaDaHome,
  pecasEmDestaque,
} from "@/lib/home/conteudo";

/**
 * The home — `home.md`. Seven sections in one order, and the page has one job:
 * **make navigation by ambiente feel inevitable, not imposed.**
 *
 * It is the busiest page in the store and still the quietest, which is what the
 * three budgets in §§9–11 buy: two réguas on the entire page, two índigos, and
 * Mincho spent on piece names, the coleção, the article titles and exactly one
 * feature line. The home is the only page that teaches what the régua means — a
 * visitor who meets it six times before reaching a produto page has learned
 * that it is ornament, and ornament is what the régua was chosen not to be.
 *
 * **No title is declared here.** `rotas.md` §1 leaves the home unsuffixed and
 * the root layout's `title.default` is already the bare wordmark; stating one
 * on this route would run it through `%s | Canto Zen` and print the brand
 * twice. Only the description is this route's to state.
 *
 * The rhythm between sections is `7rem`, dropping to the `4rem` floor on mobile
 * (§13) — never below. There is no scroll reveal, no parallax and no section
 * entry animation: the only transition on this page is the 120ms colour one on
 * interactive states.
 */
export const metadata: Metadata = { description: descricaoDaHome() };

export default function Home() {
  // `null` only where the authored hero would have to be drawn without its
  // cota, which the invariant suite makes unreachable — §1's prohibition, not a
  // fallback. Nothing is promoted into the slot; the page opens on §2 instead.
  const destaque = destaqueDaHome();

  return (
    <div className="flex flex-col gap-y-rhythm-6 pt-rhythm-5 pb-rhythm-6 lg:gap-y-rhythm-7 lg:pb-rhythm-7">
      {destaque && <PecaEmDestaque destaque={destaque} />}
      <Ambientes campos={camposDeAmbientes()} />
      <FaixaDeDestaques cartoes={pecasEmDestaque()} />
      <Colecao bloco={colecaoEmDestaque()} />
      <Servico />
      <Inspiracoes linhas={linhasDeInspiracao()} />
      <Marcenaria bloco={marcenariaDaHome()} />
    </div>
  );
}
