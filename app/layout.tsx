import type {Metadata, Viewport} from "next";
import "./globals.css";
import {AnalyticsTracker} from "@/components/AnalyticsTracker";
import {BetaBanner} from "@/components/BetaBanner";
import {SupabaseConfigBanner} from "@/components/SupabaseConfigBanner";
import {htmlLang, openGraphLocale} from "@/lib/html-lang";
import {siteMetadataT} from "@/lib/i18n-metadata";
import {getRequestLocale} from "@/lib/locale-server";
import {getSiteUrl} from "@/lib/site-url";
import {isClosedBeta} from "@/lib/site-mode";

const siteUrl = getSiteUrl();
const isBeta = isClosedBeta();

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const meta = siteMetadataT(locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: meta.title,
      template: "%s — ReLivroApps",
    },
    description: meta.description,
    applicationName: "ReLivroApps",
    authors: [{name: "ReLivroApps"}],
    keywords: [...meta.keywords],
    robots: isBeta ? {index: false, follow: false} : {index: true, follow: true},
    openGraph: {
      type: "website",
      locale: openGraphLocale(locale),
      url: siteUrl,
      siteName: "ReLivroApps",
      title: meta.title,
      description: meta.description,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf1",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const locale = await getRequestLocale();

  return (
    <html lang={htmlLang(locale)}>
      <body>
        <SupabaseConfigBanner/>
        <BetaBanner/>
        <AnalyticsTracker/>
        {children}
      </body>
    </html>
  );
}
