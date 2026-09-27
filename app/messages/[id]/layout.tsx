import type {Metadata} from "next";
import {appRouteT} from "@/lib/i18n-app-routes";
import {getRequestLocale} from "@/lib/locale-server";
import {privateRouteMetadata} from "@/lib/private-route-metadata";
import {oneRelation} from "@/lib/supabase-relations";
import {createClient} from "@/lib/supabase/server";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{id: string}>;
};

export async function generateMetadata({params}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const {id} = await params;
  const locale = await getRequestLocale();
  const fallback = appRouteT(locale).messageThread;

  const supabase = await createClient();
  const {data} = await supabase
    .from("conversations")
    .select("books(title)")
    .eq("id", id)
    .maybeSingle();

  const book = oneRelation(data?.books as {title: string} | {title: string}[] | null | undefined);
  const title = book?.title ? `${book.title} · ${fallback.title}` : fallback.title;

  return privateRouteMetadata({
    path: `/messages/${id}`,
    title,
    description: fallback.description,
  });
}

export default function MessageThreadLayout({children}: LayoutProps) {
  return children;
}
