import type {Metadata} from "next";
import Link from "next/link";
import {BreadcrumbJsonLd} from "@/components/BreadcrumbJsonLd";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {WebPageJsonLd} from "@/components/WebPageJsonLd";
import {breadcrumbsT} from "@/lib/i18n-breadcrumbs";
import {legalT} from "@/lib/i18n-legal";
import {getRequestLocale} from "@/lib/locale-server";
import {getSiteUrl} from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = legalT(locale).privacy;
  const canonical = `${getSiteUrl()}/privacidade`;

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

export default async function PrivacyPage() {
  const locale = await getRequestLocale();
  const t = legalT(locale).privacy;
  const nav = legalT(locale);
  const bc = breadcrumbsT(locale);
  const breadcrumbItems = [
    {href: "/", label: bc.home},
    {label: bc.privacy},
  ];

  return (
    <main className="legal-page">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <WebPageJsonLd path="/privacidade" name={t.title} description={t.metaDescription} />
      <div className="container">
        <Breadcrumbs items={breadcrumbItems} />
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
