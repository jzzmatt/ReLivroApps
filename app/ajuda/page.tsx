import type {Metadata} from "next";
import Link from "next/link";
import {BreadcrumbJsonLd} from "@/components/BreadcrumbJsonLd";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {HelpFaqJsonLd} from "@/components/HelpFaqJsonLd";
import {breadcrumbsT} from "@/lib/i18n-breadcrumbs";
import {helpT} from "@/lib/i18n-help";
import {shareT} from "@/lib/i18n-share";
import {getRequestLocale} from "@/lib/locale-server";
import {getSiteUrl} from "@/lib/site-url";
import {getSupportEmail} from "@/lib/support-public";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = helpT(locale);
  const canonical = `${getSiteUrl()}/ajuda`;

  return {
    title: t.title,
    description: t.metaDescription,
    alternates: {canonical},
    openGraph: {
      title: t.title,
      description: t.metaDescription,
      url: canonical,
      type: "website",
      siteName: "ReLivroApps",
    },
    twitter: {
      card: "summary",
      title: t.title,
      description: t.metaDescription,
    },
  };
}

export default async function HelpPage() {
  const locale = await getRequestLocale();
  const t = helpT(locale);
  const bc = breadcrumbsT(locale);
  const share = shareT(locale);
  const supportEmail = getSupportEmail();
  const breadcrumbItems = [
    {href: "/", label: bc.home},
    {label: bc.help},
  ];

  return (
    <main className="help-page">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <HelpFaqJsonLd faqs={[...t.faqs]} />
      <div className="container">
        <Breadcrumbs items={breadcrumbItems} />
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
