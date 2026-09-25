import type {Metadata, Viewport} from "next";
import "./globals.css";
import {AnalyticsTracker} from "@/components/AnalyticsTracker";
import {SupabaseConfigBanner} from "@/components/SupabaseConfigBanner";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://relivroapps.vercel.app";
const siteDescription =
  "Marketplace mobile-first para encontrar, trocar e partilhar livros escolares em Angola.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ReLivroApps — Livros escolares para todos",
    template: "%s — ReLivroApps",
  },
  description: siteDescription,
  applicationName: "ReLivroApps",
  authors: [{name: "ReLivroApps"}],
  keywords: ["livros escolares", "Angola", "troca de livros", "marketplace escolar"],
  robots: {index: true, follow: true},
  openGraph: {
    type: "website",
    locale: "pt_AO",
    url: siteUrl,
    siteName: "ReLivroApps",
    title: "ReLivroApps — Livros escolares para todos",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "ReLivroApps — Livros escolares para todos",
    description: siteDescription,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fffaf1",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-AO">
      <body>
        <SupabaseConfigBanner/>
        <AnalyticsTracker/>
        {children}
      </body>
    </html>
  );
}
