import type {Metadata} from "next";
import {appRouteT} from "@/lib/i18n-app-routes";
import {getRequestLocale} from "@/lib/locale-server";
import {privateRouteMetadata} from "@/lib/private-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = appRouteT(locale).adminDashboard;
  return privateRouteMetadata({path: "/admin", title: t.title, description: t.description});
}

export default function AdminLayout({children}: {children: React.ReactNode}) {
  return children;
}
