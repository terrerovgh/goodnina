type Lang = "es" | "en";

const STORAGE_KEY = "nina-lang";

function browserLang(): Lang {
  const nav = (navigator.language || "").toLowerCase();
  if (nav === "es" || nav.startsWith("es-")) return "es";
  return "en";
}

function savedLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en") return saved;
  } catch {
    /* private */
  }
  return browserLang();
}

function applyLang(lang: Lang) {
  const root = document.documentElement;
  root.lang = lang;
  document.querySelectorAll<HTMLElement>("[data-en][data-es]").forEach((el) => {
    const next = lang === "es" ? el.dataset.es : el.dataset.en;
    if (next) el.textContent = next;
  });
  document.querySelectorAll<HTMLImageElement>("[data-alt-en]").forEach((img) => {
    img.alt =
      lang === "es" ? img.dataset.altEs || img.alt : img.dataset.altEn || img.alt;
  });
  document.querySelectorAll<HTMLElement>("[data-aria-en]").forEach((el) => {
    const label = lang === "es" ? el.dataset.ariaEs : el.dataset.ariaEn;
    if (label) el.setAttribute("aria-label", label);
  });
  const title = lang === "es" ? root.dataset.titleEs : root.dataset.titleEn;
  if (title) document.title = title;
  const desc = lang === "es" ? root.dataset.descEs : root.dataset.descEn;
  const meta = document.querySelector('meta[name="description"]');
  if (meta && desc) meta.setAttribute("content", desc);
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.getAttribute("data-lang-btn") === lang);
  });
}

function initHeader() {
  const header = document.querySelector<HTMLElement>("[data-header]");
  if (!header) return;
  const overHero = header.getAttribute("data-over-hero") === "true";
  const onScroll = () => {
    const onPhoto =
      overHero && window.scrollY < 24 && !header.querySelector("details[open]");
    header.toggleAttribute("data-on-photo", Boolean(onPhoto));
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  header.querySelectorAll("details").forEach((d) => {
    d.addEventListener("toggle", onScroll);
  });
}

function initGallery() {
  const root = document.querySelector("[data-gallery]");
  const dialog = document.querySelector<HTMLDialogElement>("#lightbox");
  if (!root || !dialog) return;

  const figure = dialog.querySelector("img")!;
  const caption = dialog.querySelector("figcaption")!;
  const buttons = [...root.querySelectorAll<HTMLElement>("[data-open]")];
  let index = 0;
  let visible = buttons;

  const itemsOf = () => (visible.length ? visible : buttons);

  const lang = (): Lang =>
    document.documentElement.lang === "es" ? "es" : "en";

  const show = (i: number) => {
    const pool = itemsOf();
    index = (i + pool.length) % pool.length;
    const btn = pool[index];
    const id = btn.dataset.open!;
    figure.src = `/images/opt/gallery/${id}-960.webp`;
    figure.alt =
      lang() === "es" ? btn.dataset.altEs || "" : btn.dataset.altEn || "";
    caption.textContent = figure.alt;
  };

  const openAt = (btn: HTMLElement) => {
    visible = buttons.filter((b) => b.offsetParent !== null);
    const pool = itemsOf();
    index = Math.max(0, pool.indexOf(btn));
    show(index);
    dialog.showModal();
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    dialog.close();
    document.body.style.overflow = "";
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => openAt(btn));
  });

  dialog.querySelector("[data-close]")?.addEventListener("click", close);
  dialog.querySelector("[data-prev]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    show(index - 1);
  });
  dialog.querySelector("[data-next]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    show(index + 1);
  });
  dialog.addEventListener("close", () => {
    document.body.style.overflow = "";
  });
  window.addEventListener("keydown", (e) => {
    if (!dialog.open) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") show(index + 1);
    if (e.key === "ArrowLeft") show(index - 1);
  });

  const scroller = document.querySelector<HTMLElement>("[data-scroller]");
  if (scroller) {
    document.querySelectorAll("[data-scroll]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const dir = Number(btn.getAttribute("data-scroll")) || 1;
        scroller.scrollBy({ left: dir * 280, behavior: "smooth" });
      });
    });
    let down = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    scroller.addEventListener("pointerdown", (e) => {
      down = true;
      moved = false;
      startX = e.clientX;
      startScroll = scroller.scrollLeft;
    });
    scroller.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 8) {
        moved = true;
        scroller.setPointerCapture(e.pointerId);
      }
      if (moved) scroller.scrollLeft = startScroll - dx;
    });
    const end = () => {
      down = false;
    };
    scroller.addEventListener("pointerup", end);
    scroller.addEventListener("pointercancel", end);
    scroller.addEventListener(
      "click",
      (e) => {
        if (moved) {
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        }
      },
      true,
    );
  }

  document.querySelectorAll("[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      const next = chip.getAttribute("data-filter") || "all";
      document.querySelectorAll("[data-filter]").forEach((c) => {
        c.classList.toggle("is-active", c === chip);
      });
      document.querySelectorAll<HTMLElement>("[data-category]").forEach((item) => {
        item.hidden = !(next === "all" || item.dataset.category === next);
      });
    });
  });
}

function whenIdle(fn: () => void) {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(fn, { timeout: 1200 });
  } else {
    setTimeout(fn, 1);
  }
}

function init() {
  const lang = savedLang();
  if (lang !== "en") applyLang(lang);
  document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-lang-btn") as Lang;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private */
      }
      applyLang(next);
    });
  });
  initHeader();
  whenIdle(initGallery);
}

init();
