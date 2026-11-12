import type { Content } from "../lib/schema";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    // "manual" so an expired session (a redirect to the login page) is noticed
    // instead of failing as an opaque network error.
    res = await fetch(path, { ...init, redirect: "manual", credentials: "same-origin" });
  } catch {
    throw new ApiError(0, "No hay conexión. Revisa tu internet e inténtalo de nuevo.");
  }
  if (res.type === "opaqueredirect") {
    throw new ApiError(401, "Tu sesión caducó. Recarga la página para volver a entrar.");
  }
  const data = (await res.json().catch(() => null)) as (T & { error?: string }) | null;
  if (!res.ok || data === null) {
    throw new ApiError(res.status, data?.error ?? "Algo salió mal. Inténtalo de nuevo.");
  }
  return data;
}

export type LoadedState = Content & { sha: string; email: string };

export const loadState = () => request<LoadedState>("/api/admin/state");

export const publish = (form: FormData) =>
  request<{ sha: string; unchanged?: boolean }>("/api/admin/publish", {
    method: "POST",
    body: form,
    headers: { "X-Admin-Request": "1" },
  });

/** Commit the live site was built from, or null if it cannot be read. */
export async function liveSha(): Promise<string | null> {
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { sha?: string };
    return data.sha ?? null;
  } catch {
    return null;
  }
}
