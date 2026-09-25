import Link from "next/link";
import {helpT} from "@/lib/i18n-help";
import {getRequestLocale} from "@/lib/locale-server";

export default async function HelpPage() {
  const locale = await getRequestLocale();
  const t = helpT(locale);

  return (
    <main className="help-page">
      <div className="container">
        <Link className="back-link" href="/">
          {t.backHome}
        </Link>
        <span className="eyebrow">{t.eyebrow}</span>
        <h1>{t.title}</h1>
        <p className="help-lead">{t.lead}</p>
        <div className="help-faq">
          {t.faqs.map((item) => (
            <details key={item.q} className="help-faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <p className="help-contact">{t.contact}</p>
        <Link className="button" href="/books">
          {t.explore} <span>→</span>
        </Link>
      </div>
    </main>
  );
}
