"use client";

import {useEffect, useState} from "react";
import {shellT} from "@/lib/i18n-shell";
import {defaultLocale, localeLabels, locales, type Locale} from "@/lib/i18n";

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>(defaultLocale);
  const t = shellT(locale);

  useEffect(() => {
    const saved = localStorage.getItem("relivro-locale") as Locale | null;
    if (saved && locales.includes(saved)) setLocale(saved);
  }, []);

  function change(v: Locale) {
    setLocale(v);
    localStorage.setItem("relivro-locale", v);
    document.cookie = `relivro-locale=${v};path=/;max-age=31536000;samesite=lax`;
    window.dispatchEvent(new CustomEvent("relivro-locale", {detail: v}));
    window.location.reload();
  }

  return (
    <select
      className="language-select"
      aria-label={t.languageSelect}
      value={locale}
      onChange={e => change(e.target.value as Locale)}
    >
      {locales.map(l => (
        <option key={l} value={l}>
          {localeLabels[l]}
        </option>
      ))}
    </select>
  );
}
