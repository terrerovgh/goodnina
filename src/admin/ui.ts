import type { Bi } from "../lib/schema";
import { h } from "./dom";
import { touch } from "./store";

/** One text in both languages, bound to the object it edits. */
export function biField(label: string, value: Bi, opts: { long?: boolean; hint?: string } = {}): HTMLElement {
  const input = (lang: "es" | "en", name: string) => {
    const el = h(opts.long ? "textarea" : "input", {
      class: "adm-input",
      value: value[lang],
      lang,
      ...(opts.long ? { rows: 3 } : { type: "text" }),
      oninput: () => {
        value[lang] = el.value;
        touch();
      },
    });
    return h("label", { class: "adm-lang" }, h("span", { class: "adm-lang-name" }, name), el);
  };
  return h(
    "fieldset",
    { class: "adm-field" },
    h("legend", null, label),
    opts.hint ? h("p", { class: "adm-hint" }, opts.hint) : null,
    h("div", { class: "adm-bi" }, input("es", "Español"), input("en", "English")),
  );
}

export function field(label: string, control: HTMLElement, hint?: string): HTMLElement {
  return h(
    "label",
    { class: "adm-field" },
    h("span", { class: "adm-label" }, label),
    control,
    hint ? h("span", { class: "adm-hint" }, hint) : null,
  );
}

export function check(label: string, checked: boolean, onChange: (on: boolean) => void): HTMLElement {
  const box = h("input", {
    type: "checkbox",
    checked,
    onchange: () => {
      onChange(box.checked);
      touch();
    },
  });
  return h("label", { class: "adm-check" }, box, h("span", null, label));
}

let sheet: HTMLDialogElement | null = null;
let afterClose: (() => void) | null = null;

/** Full-height editing sheet. `onClose` runs once, however it is closed. */
export function openSheet(title: string, body: (Node | null)[], onClose: () => void) {
  if (!sheet) {
    sheet = h("dialog", { class: "adm-sheet" });
    sheet.addEventListener("close", () => {
      const fn = afterClose;
      afterClose = null;
      fn?.();
    });
    // A click on the backdrop lands on the dialog element itself.
    sheet.addEventListener("click", (e) => {
      if (e.target === sheet) sheet?.close();
    });
    document.body.append(sheet);
  }
  afterClose = onClose;
  sheet.replaceChildren(
    h(
      "div",
      { class: "adm-sheet-inner" },
      h(
        "header",
        { class: "adm-sheet-head" },
        h("h2", null, title),
        h("button", { type: "button", class: "adm-btn adm-btn-primary", onclick: () => sheet?.close() }, "Listo"),
      ),
      h("div", { class: "adm-sheet-body" }, body),
    ),
  );
  // Re-rendering an open sheet (after choosing a photo) must not reopen it.
  if (!sheet.open) sheet.showModal();
}

export function closeSheet() {
  sheet?.close();
}

let toastTimer = 0;
export function toast(message: string, kind: "info" | "error" = "info") {
  let el = document.querySelector<HTMLElement>(".adm-toast");
  if (!el) {
    el = h("div", { class: "adm-toast", role: "status" });
    document.body.append(el);
  }
  el.textContent = message;
  el.dataset.kind = kind;
  el.classList.add("is-on");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el?.classList.remove("is-on"), kind === "error" ? 8000 : 3500);
}
