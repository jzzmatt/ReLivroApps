import type {Metadata} from "next";
import {sellRouteT} from "@/lib/i18n-sell-route";
import {getRequestLocale} from "@/lib/locale-server";
import {privateRouteMetadata} from "@/lib/private-route-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const t = sellRouteT(locale);
  return privateRouteMetadata({path: "/sell", title: t.title, description: t.description});
}

export default function SellLayout({children}: {children: React.ReactNode}) {
  return children;
}
