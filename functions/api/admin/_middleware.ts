import { createRemoteJWKSet, jwtVerify } from "jose";
import { problem, type Env } from "../../../src/server/env";

/*
 * Every /api/admin request must carry a valid Cloudflare Access token for an
 * allowed email. Access in front of goodnina.com is not enough on its own: the
 * project is also reachable at *.pages.dev, where Access does not apply.
 */

const keySets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function keysFor(team: string) {
  let keys = keySets.get(team);
  if (!keys) {
    keys = createRemoteJWKSet(new URL(`https://${team}/cdn-cgi/access/certs`));
    keySets.set(team, keys);
  }
  return keys;
}

function isLocal(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export const onRequest: PagesFunction<Env> = async ({ request, env, next, data }) => {
  const url = new URL(request.url);

  if (request.method !== "GET" && request.method !== "HEAD") {
    // The Access cookie is sent automatically, so a write must also prove it
    // comes from the panel itself.
    if (
      request.headers.get("Origin") !== url.origin ||
      request.headers.get("X-Admin-Request") !== "1"
    ) {
      return problem("Solicitud no permitida.", 403);
    }
  }

  // Local development only: never honoured on a real hostname.
  if (env.DEV_BYPASS_AUTH === "1" && isLocal(url.hostname)) {
    data.email = "dev@localhost";
    return next();
  }

  const team = (env.ACCESS_TEAM_DOMAIN ?? "")
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  const allowed = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!team || !env.ACCESS_AUD || allowed.length === 0) {
    return problem(
      "El panel no está configurado: faltan ACCESS_TEAM_DOMAIN, ACCESS_AUD o ADMIN_EMAILS en Cloudflare.",
      500,
    );
  }

  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return problem("Inicia sesión para usar el panel.", 401);

  let email = "";
  try {
    const { payload } = await jwtVerify(token, keysFor(team), {
      issuer: `https://${team}`,
      audience: env.ACCESS_AUD,
    });
    email = typeof payload.email === "string" ? payload.email.toLowerCase() : "";
  } catch {
    return problem("La sesión no es válida o caducó. Vuelve a entrar.", 401);
  }

  if (!allowed.includes(email)) {
    return problem("Esta cuenta no tiene permiso para usar el panel.", 403);
  }

  data.email = email;
  return next();
};
