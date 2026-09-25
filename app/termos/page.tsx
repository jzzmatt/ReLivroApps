import Link from "next/link";
import {legalT} from "@/lib/i18n-legal";
import {getRequestLocale} from "@/lib/locale-server";

export default async function TermsPage() {
  const locale = await getRequestLocale();
  const t = legalT(locale).terms;
  const nav = legalT(locale);

  return (
    <main className="legal-page">
      <div className="container">
        <Link className="back-link" href="/">
          {nav.backHome}
        </Link>
        <h1>{t.title}</h1>
        <p className="legal-updated">{t.updated}</p>
        {t.sections.map((section) => (
          <section key={section.heading} className="legal-section">
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
