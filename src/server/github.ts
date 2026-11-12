/**
 * Minimal GitHub client for the admin panel: read files at a commit and write
 * one atomic commit through the Git Data API. Uses only fetch, so it runs in
 * Pages Functions.
 */

const DEFAULT_API = "https://api.github.com";

export type Repo = { token: string; repo: string; branch: string; api?: string };

export class GitHubError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

/** The branch moved since the panel loaded its copy. */
export class ConflictError extends Error {
  constructor() {
    super("conflict");
    this.name = "ConflictError";
  }
}

export type Change =
  | { path: string; content: string }
  | { path: string; blobSha: string }
  | { path: string; delete: true };

async function call(
  r: Repo,
  path: string,
  init: { method?: string; body?: unknown; raw?: boolean } = {},
): Promise<Response> {
  return fetch(`${r.api || DEFAULT_API}/repos/${r.repo}${path}`, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${r.token}`,
      Accept: init.raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "goodnina-admin",
      ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
}

async function json<T>(res: Response, what: string): Promise<T> {
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    throw new GitHubError(res.status, `GitHub ${res.status} (${what}): ${detail}`);
  }
  return (await res.json()) as T;
}

function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

export async function headSha(r: Repo): Promise<string> {
  const res = await call(r, `/git/ref/heads/${encodePath(r.branch)}`);
  const data = await json<{ object: { sha: string } }>(res, "ref");
  return data.object.sha;
}

/** Raw file at a commit, or null when it does not exist. */
export async function readFile(r: Repo, path: string, ref: string): Promise<Response | null> {
  const res = await call(r, `/contents/${encodePath(path)}?ref=${ref}`, { raw: true });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new GitHubError(res.status, `GitHub ${res.status} (read ${path})`);
  }
  return res;
}

export async function readText(r: Repo, path: string, ref: string): Promise<string | null> {
  const res = await readFile(r, path, ref);
  return res ? res.text() : null;
}

/** File names directly inside a directory; empty when it does not exist. */
export async function listDir(r: Repo, dir: string, ref: string): Promise<string[]> {
  const res = await call(r, `/contents/${encodePath(dir)}?ref=${ref}`);
  if (res.status === 404) return [];
  const entries = await json<{ name: string; type: string }[]>(res, `list ${dir}`);
  return entries.filter((e) => e.type === "file").map((e) => e.name);
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  return btoa(binary);
}

export async function createBlob(r: Repo, bytes: Uint8Array): Promise<string> {
  const res = await call(r, "/git/blobs", {
    method: "POST",
    body: { content: toBase64(bytes), encoding: "base64" },
  });
  return (await json<{ sha: string }>(res, "blob")).sha;
}

/**
 * Write all changes as a single commit on top of `baseSha` and move the branch
 * to it. Throws ConflictError if the branch is no longer at `baseSha`.
 */
export async function commit(
  r: Repo,
  baseSha: string,
  message: string,
  changes: Change[],
): Promise<string> {
  const base = await json<{ tree: { sha: string } }>(
    await call(r, `/git/commits/${baseSha}`),
    "base commit",
  );

  const tree = await json<{ sha: string }>(
    await call(r, "/git/trees", {
      method: "POST",
      body: {
        base_tree: base.tree.sha,
        tree: changes.map((c) => ({
          path: c.path,
          mode: "100644",
          type: "blob",
          ...("content" in c
            ? { content: c.content }
            : { sha: "blobSha" in c ? c.blobSha : null }),
        })),
      },
    }),
    "tree",
  );

  const created = await json<{ sha: string }>(
    await call(r, "/git/commits", {
      method: "POST",
      body: {
        message,
        tree: tree.sha,
        parents: [baseSha],
        author: { name: "Panel goodnina", email: "admin@goodnina.com" },
      },
    }),
    "commit",
  );

  const moved = await call(r, `/git/refs/heads/${encodePath(r.branch)}`, {
    method: "PATCH",
    body: { sha: created.sha, force: false },
  });
  if (moved.status === 422 || moved.status === 409) throw new ConflictError();
  await json(moved, "update ref");
  return created.sha;
}
