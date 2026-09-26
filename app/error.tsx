"use client";

import {shellT} from "@/lib/i18n-shell";
import {useClientLocale} from "@/lib/use-client-locale";

export default function Error({reset}: {error: Error & {digest?: string}; reset: () => void}) {
  const locale = useClientLocale();
  const t = shellT(locale).routeError;

  return (
    <main className="route-state">
      <div className="route-state-card">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <button className="button" type="button" onClick={() => reset()}>
          {t.cta}
        </button>
      </div>
    </main>
  );
}
