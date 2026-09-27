import type {Metadata} from "next";
import {authRouteT} from "@/lib/i18n-auth-route";
import {getRequestLocale} from "@/lib/locale-server";
import {getSiteUrl} from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = authRouteT(locale);
  const canonical = `${getSiteUrl()}/auth`;

  return {
    title: t.title,
    description: t.description,
    alternates: {canonical},
    robots: {index: false, follow: false},
    openGraph: {
      title: t.title,
      description: t.description,
      url: canonical,
      type: "website",
      siteName: "ReLivroApps",
    },
    twitter: {
      card: "summary",
      title: t.title,
      description: t.description,
    },
  };
}

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return children;
}
