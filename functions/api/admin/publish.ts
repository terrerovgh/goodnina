import { NOT_CONFIGURED, problem, reply, repoFrom, type Env } from "../../../src/server/env";
import {
  ConflictError,
  commit,
  createBlob,
  headSha,
  listDir,
  readText,
  type Change,
} from "../../../src/server/github";
import { planPublish, type Upload } from "../../../src/server/publish";
import {
  DATA_FILES,
  ID_RE,
  IMAGE_DIRS,
  LIMITS,
  ValidationError,
  parseContent,
  type ImageKind,
} from "../../../src/lib/schema";

const CONFLICT =
  "El contenido cambió desde que abriste el panel. Recarga la página y vuelve a hacer los cambios.";

/**
 * multipart/form-data:
 *   baseSha  commit the panel loaded its content from
 *   content  JSON { gallery, texts, news }
 *   gallery/<id>, news/<id>  new photos (JPEG)
 * Writes everything as one commit, which triggers one site build.
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const repo = repoFrom(env);
  if (!repo) return problem(NOT_CONFIGURED, 500);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return problem("No se pudo leer lo que enviaste.", 400);
  }

  const baseSha = form.get("baseSha");
  const rawContent = form.get("content");
  if (typeof baseSha !== "string" || !/^[0-9a-f]{40}$/.test(baseSha) || typeof rawContent !== "string") {
    return problem("Faltan datos en la solicitud.", 400);
  }

  try {
    const content = parseContent(JSON.parse(rawContent));

    const uploads: Upload[] = [];
    for (const [name, value] of form.entries()) {
      if (typeof value === "string") continue;
      const [kind, id, extra] = name.split("/");
      if (extra !== undefined || !(kind in IMAGE_DIRS) || !id || id.length > 80 || !ID_RE.test(id)) {
        throw new ValidationError("Una de las fotos tiene un nombre no válido.");
      }
      if (value.size > LIMITS.imageBytes) {
        throw new ValidationError(`La foto "${id}" pesa demasiado.`);
      }
      uploads.push({
        kind: kind as ImageKind,
        id,
        bytes: new Uint8Array(await value.arrayBuffer()),
      });
    }

    if ((await headSha(repo)) !== baseSha) return problem(CONFLICT, 409);

    const [gallery, texts, news, galleryJpg, galleryOpt, newsJpg, newsOpt] = await Promise.all([
      readText(repo, DATA_FILES.gallery, baseSha),
      readText(repo, DATA_FILES.texts, baseSha),
      readText(repo, DATA_FILES.news, baseSha),
      listDir(repo, IMAGE_DIRS.gallery, baseSha),
      listDir(repo, "public/images/opt/gallery", baseSha),
      listDir(repo, IMAGE_DIRS.news, baseSha),
      listDir(repo, "public/images/opt/news", baseSha),
    ]);

    const plan = planPublish(content, uploads, {
      files: { gallery, texts, news },
      originals: { gallery: galleryJpg, news: newsJpg },
      derived: { gallery: galleryOpt, news: newsOpt },
    });
    if (plan.changes.length === 0) return reply({ sha: baseSha, unchanged: true });

    const changes: Change[] = await Promise.all(
      plan.changes.map(async (c) =>
        "upload" in c ? { path: c.path, blobSha: await createBlob(repo, c.upload.bytes) } : c,
      ),
    );

    const sha = await commit(repo, baseSha, plan.message, changes);
    return reply({ sha });
  } catch (err) {
    if (err instanceof ValidationError) return problem(err.message, 400);
    if (err instanceof SyntaxError) return problem("El contenido enviado no es válido.", 400);
    if (err instanceof ConflictError) return problem(CONFLICT, 409);
    console.error(err);
    return problem("No se pudo publicar. Inténtalo de nuevo en un momento.", 502);
  }
};
