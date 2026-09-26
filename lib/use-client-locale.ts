"use client";

import {useEffect, useState} from "react";
import {defaultLocale, locales, type Locale} from "@/lib/i18n";

/** Reads `relivro-locale` from localStorage (same as LanguageSwitcher). */
export function useClientLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const saved = localStorage.getItem("relivro-locale") as Locale | null;
    if (saved && locales.includes(saved)) setLocale(saved);
    const fn = (e: Event) => setLocale((e as CustomEvent<Locale>).detail);
    window.addEventListener("relivro-locale", fn);
    return () => window.removeEventListener("relivro-locale", fn);
  }, []);

  return locale;
}
