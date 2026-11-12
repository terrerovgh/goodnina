import type { Repo } from "./github";

/** Bindings of the Pages project. See README, "Admin panel". */
export type Env = {
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  /** Only for tests against a stand-in server; unset in production. */
  GITHUB_API_URL?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  ADMIN_EMAILS?: string;
  DEV_BYPASS_AUTH?: string;
};

export function reply(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

/** Error shown to the person using the panel, in Spanish. */
export function problem(message: string, status: number): Response {
  return reply({ error: message }, status);
}

export function repoFrom(env: Env): Repo | null {
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) return null;
  return {
    token: env.GITHUB_TOKEN,
    repo: env.GITHUB_REPO,
    branch: env.GITHUB_BRANCH || "main",
    api: env.GITHUB_API_URL || undefined,
  };
}

export const NOT_CONFIGURED =
  "El panel no está configurado: faltan GITHUB_TOKEN o GITHUB_REPO en Cloudflare.";
