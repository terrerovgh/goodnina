type Child = Node | string | number | null | undefined | false;
type Props = Record<string, unknown>;

/** Tiny element builder: h("button", { class: "x", onclick: fn }, "Label"). */
export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props?: Props | null,
  ...children: (Child | Child[])[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value === undefined || value === null || value === false) continue;
    if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
    } else if (key === "class") {
      el.className = String(value);
    } else if (key in el && !key.includes("-")) {
      (el as unknown as Props)[key] = value;
    } else {
      el.setAttribute(key, value === true ? "" : String(value));
    }
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    el.append(typeof child === "number" ? String(child) : child);
  }
  return el;
}

/** A button that asks once more before doing something that cannot be undone. */
export function confirmButton(label: string, sure: string, run: () => void, cls = ""): HTMLButtonElement {
  let armed = false;
  let timer = 0;
  const btn = h("button", { type: "button", class: `adm-btn adm-btn-danger ${cls}` }, label);
  btn.addEventListener("click", () => {
    if (armed) {
      window.clearTimeout(timer);
      run();
      return;
    }
    armed = true;
    btn.textContent = sure;
    btn.classList.add("is-armed");
    timer = window.setTimeout(() => {
      armed = false;
      btn.textContent = label;
      btn.classList.remove("is-armed");
    }, 4000);
  });
  return btn;
}
