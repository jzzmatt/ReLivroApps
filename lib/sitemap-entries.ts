import type {MetadataRoute} from "next";
import {isSupabaseConfigured} from "@/lib/supabase/public-env";
import {createClient} from "@/lib/supabase/server";

const BOOK_LIMIT = 2000;

export async function buildDynamicSitemap(siteUrl: string): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const staticPaths = ["/", "/books", "/auth", "/sell", "/ajuda", "/privacidade", "/termos"];

  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  if (!isSupabaseConfigured()) return entries;

  try {
    const supabase = await createClient();
    const {data: books} = await supabase
      .from("books")
      .select("id,seller_id,updated_at")
      .eq("is_published", true)
      .order("updated_at", {ascending: false})
      .limit(BOOK_LIMIT);

    const sellerLatest = new Map<string, string>();

    for (const book of books || []) {
      entries.push({
        url: `${siteUrl}/books/${book.id}`,
        lastModified: book.updated_at ? new Date(book.updated_at) : lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      });
      const ts = book.updated_at || "";
      const prev = sellerLatest.get(book.seller_id);
      if (!prev || ts > prev) sellerLatest.set(book.seller_id, ts);
    }

    for (const [sellerId, updatedAt] of sellerLatest) {
      entries.push({
        url: `${siteUrl}/seller/${sellerId}`,
        lastModified: updatedAt ? new Date(updatedAt) : lastModified,
        changeFrequency: "weekly",
        priority: 0.65,
      });
    }
  } catch (err) {
    console.error("[sitemap] dynamic entries skipped", err);
  }

  return entries;
}
