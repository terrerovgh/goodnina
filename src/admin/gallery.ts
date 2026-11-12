import Sortable from "sortablejs";
import { CATEGORIES, LIMITS, type Category, type ObjectPosition, type Work } from "../lib/schema";
import { confirmButton, h } from "./dom";
import { thumb, toJpeg } from "./images";
import { addUpload, dropUpload, isTemp, key, state, tempId, touch } from "./store";
import { biField, check, closeSheet, field, openSheet, toast } from "./ui";

const CATEGORY_LABEL: Record<Category, string> = {
  floral: "Floral",
  ornamental: "Ornamental",
  lettering: "Lettering",
  fineline: "Fine line",
};

const FRAMING: [ObjectPosition, string][] = [
  ["center", "Centro"],
  ["left", "Izquierda"],
  ["top", "Arriba"],
];

let root: HTMLElement;

const gallery = () => state.content.gallery;
const describe = (w: Work) => w.alt.es || w.alt.en;

function reorderFromDom<T>(container: HTMLElement, items: T[], idOf: (item: T) => string): T[] {
  const order = [...container.querySelectorAll<HTMLElement>(":scope > [data-id]")].map(
    (el) => el.dataset.id,
  );
  return order
    .map((id) => items.find((item) => idOf(item) === id))
    .filter((item): item is T => item !== undefined);
}

async function addPhotos(files: FileList | null) {
  if (!files?.length) return;
  const room = LIMITS.imagesPerPublish - state.uploads.size;
  const chosen = [...files].slice(0, Math.max(0, room));
  if (chosen.length < files.length) {
    toast(`Solo se pueden subir ${LIMITS.imagesPerPublish} fotos por publicación. Publica y sube el resto después.`, "error");
  }
  let first = "";
  for (const file of chosen) {
    try {
      const blob = await toJpeg(file);
      const id = tempId("foto");
      addUpload("gallery", id, blob);
      // Newest first, the way a portfolio is usually read.
      gallery().works.unshift({ id, category: "fineline", alt: { es: "", en: "" } });
      first ||= id;
    } catch (err) {
      toast(err instanceof Error ? err.message : "No se pudo preparar la foto.", "error");
    }
  }
  touch();
  render();
  if (first) openWork(first);
}

function removeWork(id: string) {
  const g = gallery();
  g.works = g.works.filter((w) => w.id !== id);
  g.cover = g.cover.filter((c) => c !== id);
  dropUpload("gallery", id);
  touch();
  closeSheet();
}

function openWork(id: string) {
  const work = gallery().works.find((w) => w.id === id);
  if (!work) return;

  const category = h(
    "select",
    {
      class: "adm-input",
      onchange: () => {
        work.category = category.value as Category;
        touch();
      },
    },
    CATEGORIES.map((c) => h("option", { value: c, selected: c === work.category }, CATEGORY_LABEL[c])),
  );

  const framing = h(
    "select",
    {
      class: "adm-input",
      onchange: () => {
        if (framing.value === "center") delete work.object;
        else work.object = framing.value as ObjectPosition;
        touch();
      },
    },
    FRAMING.map(([value, label]) =>
      h("option", { value, selected: value === (work.object ?? "center") }, label),
    ),
  );

  openSheet(
    "Foto",
    [
      h("div", { class: "adm-sheet-photo" }, thumb("gallery", id, describe(work))),
      biField("Descripción", work.alt, {
        long: true,
        hint: "Qué se ve en el tatuaje. Aparece al abrir la foto y ayuda a que te encuentren en Google. Si escribes solo un idioma, se usa también para el otro.",
      }),
      field("Categoría", category),
      check("Foto ancha (ocupa dos columnas, para fotos horizontales)", Boolean(work.wide), (on) => {
        if (on) work.wide = true;
        else delete work.wide;
      }),
      field("Encuadre", framing, "Qué parte se conserva cuando el mosaico recorta la foto."),
      check("Mostrar en la tira de la portada", gallery().cover.includes(id), (on) => {
        const g = gallery();
        if (on && g.cover.length >= LIMITS.cover) {
          toast(`La portada admite ${LIMITS.cover} fotos como máximo.`, "error");
          return;
        }
        g.cover = on ? [...g.cover, id] : g.cover.filter((c) => c !== id);
      }),
      h(
        "div",
        { class: "adm-sheet-foot" },
        confirmButton("Eliminar foto", "¿Seguro? Toca otra vez para eliminar", () => removeWork(id)),
      ),
    ],
    render,
  );
}

function coverStrip(): HTMLElement {
  const g = gallery();
  const row = h(
    "ul",
    { class: "adm-cover" },
    g.cover.map((id) => {
      const work = g.works.find((w) => w.id === id);
      if (!work) return null;
      return h(
        "li",
        { "data-id": id },
        thumb("gallery", id, describe(work)),
        h(
          "button",
          {
            type: "button",
            class: "adm-cover-x",
            "aria-label": "Quitar de la portada",
            onclick: () => {
              g.cover = g.cover.filter((c) => c !== id);
              touch();
              render();
            },
          },
          "×",
        ),
      );
    }),
  );
  Sortable.create(row, {
    animation: 150,
    delay: 180,
    delayOnTouchOnly: true,
    filter: ".adm-cover-x",
    preventOnFilter: false,
    onEnd: () => {
      const order = [...row.querySelectorAll<HTMLElement>(":scope > [data-id]")].map(
        (el) => el.dataset.id as string,
      );
      g.cover = order;
      touch();
    },
  });
  return h(
    "section",
    { class: "adm-block" },
    h("h2", null, "Portada"),
    h(
      "p",
      { class: "adm-hint" },
      g.cover.length
        ? "Las fotos de la tira que se desliza en la página de inicio, en este orden. Arrastra para reordenar."
        : "Aún no hay fotos en la portada. Abre una foto y marca «Mostrar en la tira de la portada».",
    ),
    row,
  );
}

function mosaic(): HTMLElement {
  const g = gallery();
  const grid = h(
    "ul",
    { class: "adm-mosaic" },
    g.works.map((work) =>
      h(
        "li",
        { "data-id": work.id, class: work.wide ? "is-wide" : "" },
        h(
          "button",
          { type: "button", class: "adm-tile", onclick: () => openWork(work.id) },
          thumb(
            "gallery",
            work.id,
            describe(work),
            work.object === "left" ? "is-left" : work.object === "top" ? "is-top" : "",
          ),
          h(
            "span",
            { class: "adm-tags" },
            h("span", { class: "adm-tag" }, CATEGORY_LABEL[work.category]),
            g.cover.includes(work.id) ? h("span", { class: "adm-tag" }, "Portada") : null,
            isTemp(work.id) || state.uploads.has(key("gallery", work.id))
              ? h("span", { class: "adm-tag is-new" }, "Nueva")
              : null,
          ),
          describe(work) ? null : h("span", { class: "adm-warn" }, "Falta la descripción"),
        ),
      ),
    ),
  );
  Sortable.create(grid, {
    animation: 180,
    delay: 180,
    delayOnTouchOnly: true,
    touchStartThreshold: 4,
    ghostClass: "is-ghost",
    chosenClass: "is-chosen",
    onEnd: () => {
      g.works = reorderFromDom(grid, g.works, (w) => w.id);
      touch();
    },
  });
  return grid;
}

function render() {
  const picker = h("input", {
    type: "file",
    accept: "image/jpeg,image/png,image/webp",
    multiple: true,
    hidden: true,
    onchange: () => {
      void addPhotos(picker.files);
      picker.value = "";
    },
  });
  root.replaceChildren(
    coverStrip(),
    h(
      "section",
      { class: "adm-block" },
      h(
        "div",
        { class: "adm-block-head" },
        h("h2", null, `Galería · ${gallery().works.length} fotos`),
        h("button", { type: "button", class: "adm-btn adm-btn-primary", onclick: () => picker.click() }, "Añadir fotos"),
        picker,
      ),
      h(
        "p",
        { class: "adm-hint" },
        "Así se ve el mosaico en la página de galería. Arrastra una foto para cambiarla de sitio (en el teléfono, mantenla pulsada un momento) y tócala para editarla.",
      ),
      mosaic(),
    ),
  );
}

export function renderGallery(container: HTMLElement) {
  root = container;
  render();
}
