import type {Metadata} from "next";
import {appRouteT} from "@/lib/i18n-app-routes";
import {getRequestLocale} from "@/lib/locale-server";
import {privateRouteMetadata} from "@/lib/private-route-metadata";
import {createClient} from "@/lib/supabase/server";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{id: string}>;
};

export async function generateMetadata({params}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const {id} = await params;
  const locale = await getRequestLocale();
  const fallback = appRouteT(locale).bookEdit;

  const supabase = await createClient();
  const {data} = await supabase.from("books").select("title").eq("id", id).maybeSingle();
  const title = data?.title ? `${fallback.title}: ${data.title}` : fallback.title;

  return privateRouteMetadata({
    path: `/books/${id}/edit`,
    title,
    description: fallback.description,
  });
}

export default function BookEditLayout({children}: LayoutProps) {
  return children;
}
