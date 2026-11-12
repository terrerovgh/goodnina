import type { APIRoute } from "astro";

/** Commit this build came from, so the admin panel can tell when a publish is live. */
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ sha: process.env.CF_PAGES_COMMIT_SHA ?? "dev" }), {
    headers: { "Content-Type": "application/json" },
  });
