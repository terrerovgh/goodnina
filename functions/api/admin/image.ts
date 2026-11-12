import { NOT_CONFIGURED, problem, repoFrom, type Env } from "../../../src/server/env";
import { readFile } from "../../../src/server/github";
import { ID_RE, IMAGE_DIRS, imagePath, type ImageKind } from "../../../src/lib/schema";

/** Original photo straight from the repository, for thumbnails not deployed yet. */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const repo = repoFrom(env);
  if (!repo) return problem(NOT_CONFIGURED, 500);

  const params = new URL(request.url).searchParams;
  const kind = params.get("kind") ?? "";
  const id = params.get("id") ?? "";
  if (!(kind in IMAGE_DIRS) || id.length > 80 || !ID_RE.test(id)) {
    return problem("Foto no válida.", 400);
  }

  try {
    const file = await readFile(repo, imagePath(kind as ImageKind, id), repo.branch);
    if (!file) return problem("La foto no existe.", 404);
    return new Response(file.body, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error(err);
    return problem("No se pudo cargar la foto.", 502);
  }
};
