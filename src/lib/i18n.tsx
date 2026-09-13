import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { copy, type Copy, type Lang } from "./content";

type I18n = {
  lang: Lang;
  t: Copy;
  setLang: (lang: Lang) => void;
  toggle: () => void;
};

const I18nContext = createContext<I18n | null>(null);
const STORAGE_KEY = "nina-lang";

function browserLang(): Lang {
  const nav = (navigator.language || "").toLowerCase();
  if (nav === "es" || nav.startsWith("es-")) return "es";
  return "en";
}

function pickLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en") return saved;
  } catch {
    /* private mode */
  }
  return browserLang();
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(pickLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "es" ? "en" : "es");
  }, [lang, setLang]);

  const value = useMemo<I18n>(
    () => ({ lang, t: copy[lang], setLang, toggle }),
    [lang, setLang, toggle],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
