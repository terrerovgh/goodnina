import Sortable from "sortablejs";
import { LIMITS, isNewsVisible, type NewsItem } from "../lib/schema";
import { confirmButton, h } from "./dom";
import { thumb, toJpeg } from "./images";
import { addUpload, dropUpload, state, tempId, touch } from "./store";
import { biField, check, closeSheet, field, openSheet, toast } from "./ui";

let root: HTMLElement;

const items = () => state.content.news.items;
const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local time

function status(item: NewsItem): [string, string] {
  if (item.hidden) return ["Oculta", "is-off"];
  if (!isNewsVisible(item, today())) return ["Caducada", "is-off"];
  return ["Visible", "is-on"];
}

function dateInput(value: string | undefined, set: (v: string | undefined) => void): HTMLInputElement {
  const input = h("input", {
    type: "date",
    class: "adm-input",
    value: value ?? "",
    onchange: () => {
      set(input.value || undefined);
      touch();
    },
  });
  return input;
}

async function setPhoto(item: NewsItem, file: File | undefined) {
  if (!file) return;
  try {
    const blob = await toJpeg(file);
    // A photo can never overwrite one already in the repository, so an item
    // whose photo changes gets a fresh id.
    const id = tempId("novedad");
    dropUpload("news", item.id);
    item.id = id;
    item.image = true;
    addUpload("news", id, blob);
    touch();
    openItem(id);
  } catch (err) {
    toast(err instanceof Error ? err.message : "No se pudo preparar la foto.", "error");
  }
}

function openItem(id: string) {
  const item = items().find((n) => n.id === id);
  if (!item) return;
  // Edited on a copy: an empty link text is stored as absent, and merely
  // opening the sheet must not count as a change.
  const cta = item.cta ?? { es: "", en: "" };
  const ctaField = biField("Texto del enlace", cta, { hint: "Si lo dejas vacío dirá «Más información»." });
  ctaField.addEventListener("input", () => {
    if (cta.es.trim() || cta.en.trim()) item.cta = cta;
    else delete item.cta;
    touch();
  });

  const picker = h("input", {
    type: "file",
    accept: "image/jpeg,image/png,image/webp",
    hidden: true,
    onchange: () => void setPhoto(item, picker.files?.[0]),
  });
  const url = h("input", {
    type: "url",
    class: "adm-input",
    placeholder: "https://",
    value: item.url ?? "",
    oninput: () => {
      if (url.value.trim()) item.url = url.value.trim();
      else delete item.url;
      touch();
    },
  });

  openSheet(
    "Novedad",
    [
      h(
        "div",
        { class: "adm-sheet-photo" },
        item.image ? thumb("news", item.id, item.title.es || item.title.en) : null,
        h(
          "div",
          { class: "adm-row" },
          h("button", { type: "button", class: "adm-btn", onclick: () => picker.click() }, item.image ? "Cambiar foto" : "Añadir foto"),
          item.image
            ? h(
                "button",
                {
                  type: "button",
                  class: "adm-btn",
                  onclick: () => {
                    dropUpload("news", item.id);
                    delete item.image;
                    touch();
                    openItem(item.id);
                  },
                },
                "Quitar foto",
              )
            : null,
          picker,
        ),
      ),
      biField("Título", item.title),
      biField("Texto", item.body, { long: true }),
      field("Fecha", dateInput(item.date, (v) => (v ? (item.date = v) : delete item.date)), "Opcional. Se muestra en la tarjeta, por ejemplo el día del evento."),
      field("Enlace", url, "Opcional. Por ejemplo, la página para reservar."),
      ctaField,
      field(
        "Ocultar después de",
        dateInput(item.expires, (v) => (v ? (item.expires = v) : delete item.expires)),
        "Opcional. La novedad deja de mostrarse al día siguiente de esta fecha.",
      ),
      check("Visible en el sitio", !item.hidden, (on) => {
        if (on) delete item.hidden;
        else item.hidden = true;
      }),
      h(
        "div",
        { class: "adm-sheet-foot" },
        confirmButton("Eliminar novedad", "¿Seguro? Toca otra vez para eliminar", () => {
          state.content.news.items = items().filter((n) => n.id !== item.id);
          dropUpload("news", item.id);
          touch();
          closeSheet();
        }),
      ),
    ],
    render,
  );
}

function render() {
  const list = h(
    "ul",
    { class: "adm-list" },
    items().map((item) => {
      const [label, cls] = status(item);
      return h(
        "li",
        { "data-id": item.id },
        h("span", { class: "adm-handle", "aria-hidden": "true" }, "⋮⋮"),
        h(
          "button",
          { type: "button", class: "adm-list-main", onclick: () => openItem(item.id) },
          item.image ? thumb("news", item.id, "", "adm-list-thumb") : h("span", { class: "adm-list-thumb" }),
          h(
            "span",
            { class: "adm-list-text" },
            h("strong", null, item.title.es || item.title.en || "Sin título"),
            h("span", { class: `adm-chip ${cls}` }, label),
          ),
        ),
      );
    }),
  );
  Sortable.create(list, {
    animation: 150,
    handle: ".adm-handle",
    onEnd: () => {
      const order = [...list.querySelectorAll<HTMLElement>(":scope > [data-id]")].map((el) => el.dataset.id);
      state.content.news.items = order
        .map((id) => items().find((n) => n.id === id))
        .filter((n): n is NewsItem => n !== undefined);
      touch();
    },
  });

  root.replaceChildren(
    h(
      "section",
      { class: "adm-block" },
      h(
        "div",
        { class: "adm-block-head" },
        h("h2", null, "Novedades"),
        h(
          "button",
          {
            type: "button",
            class: "adm-btn adm-btn-primary",
            onclick: () => {
              if (items().length >= LIMITS.news) {
                toast("Hay demasiadas novedades. Elimina alguna antigua primero.", "error");
                return;
              }
              const id = tempId("novedad");
              items().unshift({ id, title: { es: "", en: "" }, body: { es: "", en: "" } });
              touch();
              render();
              openItem(id);
            },
          },
          "Añadir novedad",
        ),
      ),
      h(
        "p",
        { class: "adm-hint" },
        items().length
          ? "Aparecen como tarjetas en la página de inicio, justo debajo de la foto principal, en este orden. Arrastra por ⋮⋮ para reordenar."
          : "Aquí puedes anunciar flash days, guest spots, promociones o cuándo abres agenda. Aparecen como tarjetas en la página de inicio.",
      ),
      list,
    ),
  );
}

export function renderNews(container: HTMLElement) {
  root = container;
  render();
}
