import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { FieldSpecies } from "@shared/species";
import { dateLocale, locales, speciesMessageKey, translate, type Locale } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
  speciesLabel: (species: FieldSpecies) => string;
  formatDateTime: (date: Date | string | number) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const STORAGE_KEY = "cropguide-language";

function isLocale(value: string | null): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function resolveInitialLocale(search: string, stored: string | null): Locale {
  const fromUrl = new URLSearchParams(search).get("lang");
  if (isLocale(fromUrl)) return fromUrl;
  return isLocale(stored) ? stored : "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => resolveInitialLocale(window.location.search, localStorage.getItem(STORAGE_KEY)));

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale;
    root.dir = "ltr";
    localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale,
    t: (key, values) => translate(locale, key, values),
    speciesLabel: species => translate(locale, speciesMessageKey(species)),
    formatDateTime: date => new Date(date).toLocaleString(dateLocale(locale)),
  }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
