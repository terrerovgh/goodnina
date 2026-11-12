import { NOT_CONFIGURED, problem, reply, repoFrom, type Env } from "../../../src/server/env";
import { headSha, readText } from "../../../src/server/github";
import { DATA_FILES, parseContent, ValidationError } from "../../../src/lib/schema";

/** The content as it is in the repository right now, plus the commit it came from. */
export const onRequestGet: PagesFunction<Env> = async ({ env, data }) => {
  const repo = repoFrom(env);
  if (!repo) return problem(NOT_CONFIGURED, 500);

  try {
    const sha = await headSha(repo);
    const [gallery, texts, news] = await Promise.all([
      readText(repo, DATA_FILES.gallery, sha),
      readText(repo, DATA_FILES.texts, sha),
      readText(repo, DATA_FILES.news, sha),
    ]);
    if (gallery === null || texts === null) {
      return problem("No se encontró el contenido del sitio en el repositorio.", 500);
    }
    const content = parseContent({
      gallery: JSON.parse(gallery),
      texts: JSON.parse(texts),
      news: news === null ? { items: [] } : JSON.parse(news),
    });
    return reply({ sha, email: data.email, ...content });
  } catch (err) {
    if (err instanceof ValidationError || err instanceof SyntaxError) {
      return problem(`El contenido guardado tiene un error: ${err.message}`, 500);
    }
    console.error(err);
    return problem("No se pudo leer el contenido. Inténtalo de nuevo en un momento.", 502);
  }
};
