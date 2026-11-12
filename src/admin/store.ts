import { referencedImages, type Content, type ImageKind } from "../lib/schema";

export type PendingUpload = { kind: ImageKind; id: string; blob: Blob };

/** Everything the panel knows. `content` is edited in place; call touch() after. */
export const state = {
  sha: "",
  email: "",
  content: null as unknown as Content,
  /** JSON of `content` as last loaded or published, to tell if there are changes. */
  saved: "",
  /** Photos chosen but not published yet, keyed by "<kind>/<id>". */
  uploads: new Map<string, PendingUpload>(),
  /** Local preview URLs for photos uploaded in this session. */
  previews: new Map<string, string>(),
  /** Ids whose photo already exists in the repository (they cannot be reused). */
  repoIds: {} as Record<ImageKind, Set<string>>,
};

export const key = (kind: ImageKind, id: string) => `${kind}/${id}`;

export function isDirty(): boolean {
  return state.content !== null && JSON.stringify(state.content) !== state.saved;
}

const listeners = new Set<() => void>();
export function onChange(fn: () => void) {
  listeners.add(fn);
}
/** Tell the shell that content changed (updates the publish bar). */
export function touch() {
  listeners.forEach((fn) => fn());
}

export function setLoaded(sha: string, content: Content, email = state.email) {
  state.sha = sha;
  state.email = email;
  state.content = content;
  state.saved = JSON.stringify(content);
  state.uploads.clear();
  state.repoIds = referencedImages(content);
}

let counter = 0;
/** Placeholder id for something not published yet; replaced by a readable slug on publish. */
export function tempId(prefix: string): string {
  counter += 1;
  return `${prefix}-tmp-${Date.now().toString(36)}${counter}`;
}
export const isTemp = (id: string) => id.includes("-tmp-");

export function addUpload(kind: ImageKind, id: string, blob: Blob) {
  state.uploads.set(key(kind, id), { kind, id, blob });
  state.previews.set(key(kind, id), URL.createObjectURL(blob));
}

export function dropUpload(kind: ImageKind, id: string) {
  const k = key(kind, id);
  state.uploads.delete(k);
  const url = state.previews.get(k);
  if (url) URL.revokeObjectURL(url);
  state.previews.delete(k);
}

/** Move a pending upload and its preview to a new id. */
export function renameUpload(kind: ImageKind, from: string, to: string) {
  const up = state.uploads.get(key(kind, from));
  if (up) {
    state.uploads.delete(key(kind, from));
    state.uploads.set(key(kind, to), { ...up, id: to });
  }
  const url = state.previews.get(key(kind, from));
  if (url) {
    state.previews.delete(key(kind, from));
    state.previews.set(key(kind, to), url);
  }
}
