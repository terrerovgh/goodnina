import Sortable from "sortablejs";
import { LIMITS, type IntroImage } from "../lib/schema";
import { confirmButton, h } from "./dom";
import { thumb, toJpeg } from "./images";
import { addUpload, dropUpload, state, tempId, touch } from "./store";
import { biField, toast } from "./ui";

let root: HTMLElement;

function block(title: string, hint: string, ...children: (Node | null)[]): HTMLElement {
  return h(
    "details",
    { class: "adm-block adm-fold" },
    h("summary", null, h("h2", null, title), h("span", { class: "adm-hint" }, hint)),
    h("div", { class: "adm-fold-body" }, children),
  );
}

function faq(): HTMLElement {
  const data = state.content.texts.faq;
  const list = h(
    "ul",
    { class: "adm-faq" },
    data.items.map((item, i) =>
      h(
        "li",
        { "data-index": i },
        h(
          "div",
          { class: "adm-faq-head" },
          h("span", { class: "adm-handle", "aria-hidden": "true" }, "⋮⋮"),
          h("strong", null, `Pregunta ${i + 1}`),
          confirmButton(
            "Eliminar",
            "¿Seguro?",
            () => {
              data.items.splice(i, 1);
              touch();
              render("faq");
            },
            "adm-btn-small",
          ),
        ),
        biField("Pregunta", item.q),
        biField("Respuesta", item.a, { long: true }),
      ),
    ),
  );
  Sortable.create(list, {
    animation: 150,
    handle: ".adm-handle",
    onEnd: () => {
      const order = [...list.querySelectorAll<HTMLElement>(":scope > [data-index]")].map((el) =>
        Number(el.dataset.index),
      );
      data.items = order.map((i) => data.items[i]);
      touch();
      render("faq");
    },
  });
  return h(
    "div",
    null,
    biField("Título de la sección", data.title),
    list,
    h(
      "button",
      {
        type: "button",
        class: "adm-btn",
        disabled: data.items.length >= LIMITS.faq,
        onclick: () => {
          data.items.push({ q: { es: "", en: "" }, a: { es: "", en: "" } });
          touch();
          render("faq");
        },
      },
      "Añadir pregunta",
    ),
  );
}

async function replacePhoto(img: IntroImage, file: File | undefined) {
  if (!file) return;
  try {
    const blob = await toJpeg(file);
    // A photo never overwrites a file in the repository: a new photo, a new id.
    dropUpload("intro", img.id);
    img.id = tempId("sobre-mi");
    addUpload("intro", img.id, blob);
    touch();
    render("intro");
  } catch (err) {
    toast(err instanceof Error ? err.message : "No se pudo preparar la foto.", "error");
  }
}

function introPhotos(): HTMLElement {
  const labels = [
    ["Foto grande", "La de atrás."],
    ["Foto pequeña", "La que va encima, en la esquina."],
  ];
  return h(
    "div",
    { class: "adm-intro-photos" },
    state.content.texts.intro.images.map((img, i) => {
      const picker = h("input", {
        type: "file",
        accept: "image/jpeg,image/png,image/webp",
        hidden: true,
        onchange: () => void replacePhoto(img, picker.files?.[0]),
      });
      return h(
        "fieldset",
        { class: "adm-field adm-intro-photo" },
        h("legend", null, labels[i][0]),
        h("p", { class: "adm-hint" }, `${labels[i][1]} Se recorta en vertical (3:4).`),
        h(
          "div",
          { class: "adm-intro-row" },
          thumb("intro", img.id, img.alt.es || img.alt.en, "adm-intro-thumb"),
          h("button", { type: "button", class: "adm-btn", onclick: () => picker.click() }, "Cambiar foto"),
          picker,
        ),
        biField("Descripción", img.alt, { hint: "Para quien no puede ver la foto y para Google." }),
      );
    }),
  );
}

function render(open?: string) {
  const t = state.content.texts;
  const wasOpen = new Set(
    [...root.querySelectorAll<HTMLDetailsElement>("details[open]")].map((d) => d.dataset.name),
  );
  if (open) wasOpen.add(open);

  const sections: [string, HTMLElement][] = [
    [
      "hero",
      block(
        "Portada",
        "El texto sobre la foto principal.",
        biField("Línea superior", t.hero.kicker),
        biField("Título", t.hero.title),
        biField("Línea inferior", t.hero.lede),
      ),
    ],
    [
      "intro",
      block(
        "Sobre mí",
        "Tu presentación y sus dos fotos.",
        biField("Título", t.intro.title),
        biField("Primer párrafo", t.intro.p1, { long: true }),
        biField("Segundo párrafo", t.intro.p2, { long: true }),
        introPhotos(),
      ),
    ],
    [
      "styles",
      block(
        "Estilos",
        "Los cuatro tipos de trabajo.",
        biField("Título de la sección", t.styles.title),
        ...t.styles.items.flatMap((item, i) => [
          biField(`Estilo ${i + 1}: nombre`, item.name),
          biField(`Estilo ${i + 1}: texto`, item.body, { long: true }),
        ]),
      ),
    ],
    ["quote", block("Cita", "La frase destacada sobre fondo oscuro.", biField("Cita", t.quote, { long: true }))],
    ["faq", block("Preguntas frecuentes", `${t.faq.items.length} preguntas.`, faq())],
    [
      "book",
      block(
        "Agendar",
        "La sección final, con el botón de reserva.",
        biField("Título", t.book.title),
        biField("Texto", t.book.body, { long: true }),
        biField("Texto del botón", t.book.cta),
      ),
    ],
  ];

  root.replaceChildren(
    h(
      "p",
      { class: "adm-hint adm-lead" },
      "Cada texto tiene su versión en español y en inglés. Si dejas un idioma vacío, se usa el otro.",
    ),
    ...sections.map(([name, el]) => {
      el.dataset.name = name;
      (el as HTMLDetailsElement).open = wasOpen.has(name);
      return el;
    }),
  );
}

export function renderTexts(container: HTMLElement) {
  root = container;
  render();
}
