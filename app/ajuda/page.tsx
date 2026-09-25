import Link from "next/link";
import {helpT} from "@/lib/i18n-help";
import {shareT} from "@/lib/i18n-share";
import {getRequestLocale} from "@/lib/locale-server";
import {getSupportEmail} from "@/lib/support-public";

export default async function HelpPage() {
  const locale = await getRequestLocale();
  const t = helpT(locale);
  const share = shareT(locale);
  const supportEmail = getSupportEmail();

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
        {supportEmail && (
          <a className="button help-email-button" href={`mailto:${supportEmail}`}>
            {share.emailSupport} <span>→</span>
          </a>
        )}
        <Link className="button" href="/books">
          {t.explore} <span>→</span>
        </Link>
      </div>
    </main>
  );
}
