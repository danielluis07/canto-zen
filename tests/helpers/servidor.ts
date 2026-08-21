// The seam-2 harness — `build-spec.md`, Testing Decisions.
//
// A route in, rendered output plus status out. The app is built once and served
// locally, so what is asserted is what Next actually returns. That is the only
// way the `404`-vs-`200` contract can be tested at all: the status is a
// property of the response and not of a component, and a component-testing
// framework would assert the one thing that cannot go wrong here while missing
// the thing that can.
//
// There is deliberately no DOM and no parser. Assertions read the HTML the
// server sent, because that is what a crawler and a reader receive.

import { fileURLToPath } from "node:url";

export type Resposta = { status: number; html: string };

const raiz = fileURLToPath(new URL("../..", import.meta.url));
const executavel = "node_modules/next/dist/bin/next";

/** Long enough for a cold Next start on a loaded machine, short enough to fail. */
const ESPERA_MAXIMA_MS = 60_000;

type Servidor = { origem: string; encerrar: () => void };

let servidor: Promise<Servidor> | null = null;

/**
 * Build, then serve. Both happen once per test run, however many files call in:
 * the promise is the lock, so a second caller waits on the first rather than
 * starting a second build over the same `.next`.
 *
 * `SEAM2_PULAR_BUILD=1` reuses whatever is already in `.next`. It is for a tight
 * edit loop and nothing else — the whole point of this seam is that it asserts
 * against a real build, so CI never sets it.
 */
const iniciar = async (): Promise<Servidor> => {
  if (process.env.SEAM2_PULAR_BUILD !== "1") {
    const build = Bun.spawnSync([process.execPath, executavel, "build"], {
      cwd: raiz,
      stdout: "pipe",
      stderr: "pipe",
    });
    if (build.exitCode !== 0) {
      throw new Error(
        `next build failed, so no route can be asserted:\n${build.stdout.toString()}\n${build.stderr.toString()}`,
      );
    }
  }

  const porta = await portaLivre();
  const processo = Bun.spawn([process.execPath, executavel, "start", "--port", String(porta)], {
    cwd: raiz,
    stdout: "pipe",
    stderr: "pipe",
  });

  const origem = `http://127.0.0.1:${porta}`;
  await esperarAtender(origem, processo);

  return { origem, encerrar: () => processo.kill() };
};

export const servidorDeTeste = (): Promise<Servidor> => (servidor ??= iniciar());

/** Stops the server a run started. Idempotent — a run that never served is fine. */
export const encerrarServidor = async (): Promise<void> => {
  if (!servidor) return;
  const emExecucao = await servidor;
  servidor = null;
  emExecucao.encerrar();
};

/**
 * One route, fetched as a reader would. Redirects are not followed: a route
 * that redirects is a different fact from a route that renders, and a harness
 * that quietly follows one reports the other's status.
 */
export const buscar = async (rota: string): Promise<Resposta> => {
  const { origem } = await servidorDeTeste();
  const resposta = await fetch(new URL(rota, origem), { redirect: "manual" });
  return { status: resposta.status, html: await resposta.text() };
};

/** Ask the OS for one, then let it go — the race is narrower than a guess. */
const portaLivre = async (): Promise<number> => {
  const sondagem = Bun.serve({ port: 0, fetch: () => new Response("") });
  const porta = sondagem.port;
  await sondagem.stop(true);
  if (!porta) throw new Error("the OS handed back no port to serve the build on");
  return porta;
};

const esperarAtender = async (origem: string, processo: Bun.Subprocess): Promise<void> => {
  const limite = Date.now() + ESPERA_MAXIMA_MS;

  while (Date.now() < limite) {
    if (processo.exitCode !== null) {
      throw new Error(`next start exited before it served anything (${processo.exitCode})`);
    }
    try {
      await fetch(origem, { redirect: "manual" });
      return;
    } catch {
      await Bun.sleep(150);
    }
  }

  processo.kill();
  throw new Error(`next start did not answer on ${origem} within ${ESPERA_MAXIMA_MS}ms`);
};

/**
 * The markup without the RSC payload. Next serializes the whole tree into
 * `<script>` tags after the body, so a naive `indexOf` over the response counts
 * everything twice and a "renders exactly once" assertion can never hold. What
 * a reader sees is what is left after these are removed.
 */
export const semScripts = (html: string): string =>
  html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
