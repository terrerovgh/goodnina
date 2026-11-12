import { parseContent, slugify, uniqueId, type Content } from "../lib/schema";
import { ApiError, liveSha, loadState, publish } from "./api";
import { confirmButton, h } from "./dom";
import { renderGallery } from "./gallery";
import { renderNews } from "./news";
import { isDirty, isTemp, onChange, renameUpload, setLoaded, state } from "./store";
import { renderTexts } from "./texts";
import { toast } from "./ui";

const TABS = [
  { id: "galeria", label: "Galería", render: renderGallery },
  { id: "novedades", label: "Novedades", render: renderNews },
  { id: "textos", label: "Textos", render: renderTexts },
] as const;

type Phase =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "deploying" }
  | { kind: "live" }
  | { kind: "saved" }
  | { kind: "slow" }
  | { kind: "error"; message: string; reload?: boolean };

const app = document.querySelector<HTMLElement>("#app")!;
let panel: HTMLElement;
let statusText: HTMLElement;
let publishBtn: HTMLButtonElement;
let discardSlot: HTMLElement;
let phase: Phase = { kind: "idle" };
let current: (typeof TABS)[number] = TABS[0];
let watch = 0;

function showTab(id: string) {
  current = TABS.find((t) => t.id === id) ?? TABS[0];
  document.querySelectorAll<HTMLElement>("[data-tab]").forEach((btn) => {
    const on = btn.dataset.tab === current.id;
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-selected", String(on));
  });
  history.replaceState(null, "", `#${current.id}`);
  current.render(panel);
}

function updateBar() {
  const dirty = isDirty();
  const busy = phase.kind === "sending";
  let message = "";
  let tone = "";
  if (busy) message = "Enviando los cambios…";
  else if (phase.kind === "error") [message, tone] = [phase.message, "is-error"];
  else if (dirty) [message, tone] = ["Tienes cambios sin publicar.", "is-dirty"];
  else if (phase.kind === "deploying") message = "Publicando… el sitio tarda 1 o 2 minutos en actualizarse.";
  else if (phase.kind === "live") [message, tone] = ["Publicado. Ya está en el sitio.", "is-ok"];
  else if (phase.kind === "saved") [message, tone] = ["Cambios guardados.", "is-ok"];
  else if (phase.kind === "slow")
    [message, tone] = [
      "Los cambios se guardaron, pero el sitio está tardando en actualizarse. Si en unos minutos no los ves, avisa a quien mantiene la web.",
      "is-error",
    ];
  else message = "No hay cambios pendientes.";

  statusText.textContent = message;
  statusText.className = `adm-status ${tone}`;
  publishBtn.disabled = busy || !dirty;
  publishBtn.textContent = busy ? "Publicando…" : "Publicar";
  discardSlot.hidden = busy || !dirty;
}

/** Give everything created in this session a readable, unique, permanent id. */
function finalizeIds() {
  const { gallery, news, texts } = state.content;

  const takenWorks = new Set([
    ...state.repoIds.gallery,
    ...gallery.works.filter((w) => !isTemp(w.id)).map((w) => w.id),
  ]);
  for (const work of gallery.works) {
    if (!isTemp(work.id)) continue;
    const base = slugify(work.alt.en || work.alt.es);
    if (!base) continue; // no description yet: validation reports it
    const id = uniqueId(base, takenWorks);
    takenWorks.add(id);
    renameUpload("gallery", work.id, id);
    gallery.cover = gallery.cover.map((c) => (c === work.id ? id : c));
    work.id = id;
  }

  const takenNews = new Set([
    ...state.repoIds.news,
    ...news.items.filter((n) => !isTemp(n.id)).map((n) => n.id),
  ]);
  for (const item of news.items) {
    if (!isTemp(item.id)) continue;
    const id = uniqueId(slugify(item.title.en || item.title.es) || "novedad", takenNews);
    takenNews.add(id);
    renameUpload("news", item.id, id);
    item.id = id;
  }

  const takenIntro = new Set([
    ...state.repoIds.intro,
    ...texts.intro.images.filter((img) => !isTemp(img.id)).map((img) => img.id),
  ]);
  for (const img of texts.intro.images) {
    if (!isTemp(img.id)) continue;
    const id = uniqueId(slugify(img.alt.en || img.alt.es) || "sobre-mi", takenIntro);
    takenIntro.add(id);
    renameUpload("intro", img.id, id);
    img.id = id;
  }
}

function watchDeploy(sha: string) {
  window.clearInterval(watch);
  const started = Date.now();
  const tick = async () => {
    const live = await liveSha();
    if (live === sha) {
      window.clearInterval(watch);
      phase = { kind: "live" };
    } else if (live === "dev") {
      // Local preview: there is no deployment to wait for.
      window.clearInterval(watch);
      phase = { kind: "saved" };
    } else if (Date.now() - started > 5 * 60_000) {
      window.clearInterval(watch);
      phase = { kind: "slow" };
    } else {
      return;
    }
    updateBar();
  };
  watch = window.setInterval(tick, 8000);
  void tick();
}

async function doPublish() {
  finalizeIds();
  let clean: Content;
  try {
    clean = parseContent(JSON.parse(JSON.stringify(state.content)));
  } catch (err) {
    current.render(panel);
    phase = { kind: "error", message: err instanceof Error ? err.message : "Revisa el contenido." };
    updateBar();
    return;
  }

  const form = new FormData();
  form.set("baseSha", state.sha);
  form.set("content", JSON.stringify(clean));
  for (const up of state.uploads.values()) {
    form.set(`${up.kind}/${up.id}`, up.blob, `${up.id}.jpg`);
  }

  phase = { kind: "sending" };
  updateBar();
  try {
    const res = await publish(form);
    setLoaded(res.sha, clean);
    current.render(panel);
    if (res.unchanged) {
      phase = { kind: "idle" };
    } else {
      phase = { kind: "deploying" };
      watchDeploy(res.sha);
    }
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "No se pudo publicar. Inténtalo de nuevo.";
    phase = { kind: "error", message };
  }
  updateBar();
}

async function reload() {
  const loaded = await loadState();
  const { sha, email, ...content } = loaded;
  setLoaded(sha, content, email);
}

async function discard() {
  try {
    await reload();
    phase = { kind: "idle" };
    current.render(panel);
    updateBar();
    toast("Cambios descartados.");
  } catch (err) {
    toast(err instanceof ApiError ? err.message : "No se pudo recargar.", "error");
  }
}

function shell() {
  panel = h("main", { class: "adm-main", id: "panel" });
  statusText = h("p", { class: "adm-status", role: "status" });
  publishBtn = h("button", { type: "button", class: "adm-btn adm-btn-primary adm-publish", onclick: () => void doPublish() }, "Publicar");
  discardSlot = h(
    "span",
    null,
    confirmButton("Descartar", "¿Descartar todo?", () => void discard(), "adm-btn-quiet"),
  );

  app.replaceChildren(
    h(
      "header",
      { class: "adm-top" },
      h(
        "div",
        { class: "adm-top-inner" },
        h("p", { class: "adm-brand" }, "Nina Romero", h("span", null, "Panel")),
        h("a", { class: "adm-link", href: "/", target: "_blank", rel: "noopener" }, "Ver el sitio ↗"),
      ),
      h(
        "nav",
        { class: "adm-tabs", role: "tablist", "aria-label": "Secciones" },
        TABS.map((t) =>
          h("button", { type: "button", role: "tab", "data-tab": t.id, onclick: () => showTab(t.id) }, t.label),
        ),
      ),
    ),
    panel,
    h(
      "footer",
      { class: "adm-bar" },
      h("div", { class: "adm-bar-inner" }, statusText, h("div", { class: "adm-row" }, discardSlot, publishBtn)),
    ),
  );
}

async function boot() {
  try {
    await reload();
  } catch (err) {
    const message = err instanceof ApiError ? err.message : "No se pudo abrir el panel.";
    app.replaceChildren(
      h(
        "div",
        { class: "adm-boot" },
        h("p", null, message),
        h("button", { type: "button", class: "adm-btn adm-btn-primary", onclick: () => location.reload() }, "Reintentar"),
      ),
    );
    return;
  }

  shell();
  onChange(() => {
    // Any edit clears a stale "published" or error message.
    if (phase.kind !== "sending") phase = { kind: "idle" };
    updateBar();
  });
  window.addEventListener("beforeunload", (e) => {
    if (isDirty()) e.preventDefault();
  });
  showTab(location.hash.slice(1));
  updateBar();
}

void boot();
