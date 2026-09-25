"use client";

import {useEffect, useState} from "react";
import {defaultLocale, messages, type Locale} from "@/lib/i18n";

const DISMISS_KEY = "relivro-beta-banner-dismissed";

function readLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const saved = localStorage.getItem("relivro-locale") as Locale | null;
  if (saved && saved in messages) return saved;
  return defaultLocale;
}

/** Shown when NEXT_PUBLIC_BETA=true at build time. Dismissal stored in localStorage. */
export function BetaBanner() {
  const enabled = process.env.NEXT_PUBLIC_BETA === "true";
  const [visible, setVisible] = useState(false);
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    if (!enabled) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    setLocale(readLocale());
    setVisible(true);

    const onLocale = (e: Event) => {
      setLocale((e as CustomEvent<Locale>).detail);
    };
    window.addEventListener("relivro-locale", onLocale);
    return () => window.removeEventListener("relivro-locale", onLocale);
  }, [enabled]);

  if (!enabled || !visible) return null;

  const t = messages[locale].beta;

  return (
    <div className="beta-banner" role="status">
      <p>
        <strong>{t.label}</strong> {t.message}
      </p>
      <button
        type="button"
        className="beta-banner-dismiss"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, "1");
          setVisible(false);
        }}
      >
        {t.dismiss}
      </button>
    </div>
  );
}
