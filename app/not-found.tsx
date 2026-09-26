import Link from "next/link";
import {shellT} from "@/lib/i18n-shell";
import {getRequestLocale} from "@/lib/locale-server";

export default async function NotFound() {
  const locale = await getRequestLocale();
  const t = shellT(locale).routeNotFound;

  return (
    <main className="route-state">
      <div className="route-state-card">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p>{t.body}</p>
        <Link className="button" href="/books">
          {t.cta}
        </Link>
      </div>
    </main>
  );
}
