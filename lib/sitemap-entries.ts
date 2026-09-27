import type {MetadataRoute} from "next";
import {isSupabaseConfigured} from "@/lib/supabase/public-env";
import {createSitemapClient} from "@/lib/supabase/sitemap-client";

/** Book URLs per sitemap file (well under Google’s 50k URL limit). */
export const SITEMAP_BOOKS_PER_FILE = 5000;

const SELLER_SCAN_PAGE = 1000;

export async function countPublishedBooks(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  try {
    const supabase = createSitemapClient();
    if (!supabase) return 0;
    const {count} = await supabase
      .from("books")
      .select("id", {count: "exact", head: true})
      .eq("is_published", true);
    return count ?? 0;
  } catch (err) {
    console.error("[sitemap] book count failed", err);
    return 0;
  }
}

export async function sitemapIdsForBooks(): Promise<{id: number}[]> {
  const bookCount = await countPublishedBooks();
  const bookFiles = bookCount > 0 ? Math.ceil(bookCount / SITEMAP_BOOKS_PER_FILE) : 0;
  const ids: {id: number}[] = [{id: 0}];
  for (let i = 0; i < bookFiles; i++) ids.push({id: i + 1});
  return ids;
}

export async function buildSitemapById(
  siteUrl: string,
  id: number,
): Promise<MetadataRoute.Sitemap> {
  if (id === 0) return buildStaticAndSellerSitemap(siteUrl);
  return buildBookSitemapChunk(siteUrl, id - 1);
}

/** Static routes only — used when Supabase is unavailable. */
export async function buildDynamicSitemap(siteUrl: string): Promise<MetadataRoute.Sitemap> {
  return buildSitemapById(siteUrl, 0);
}

async function buildStaticAndSellerSitemap(siteUrl: string): Promise<MetadataRoute.Sitemap> {
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
    const supabase = createSitemapClient();
    if (!supabase) return entries;
    const sellerLatest = new Map<string, string>();
    let offset = 0;

    for (;;) {
      const {data: books} = await supabase
        .from("books")
        .select("seller_id,updated_at")
        .eq("is_published", true)
        .order("updated_at", {ascending: false})
        .range(offset, offset + SELLER_SCAN_PAGE - 1);

      if (!books?.length) break;

      for (const book of books) {
        const ts = book.updated_at || "";
        const prev = sellerLatest.get(book.seller_id);
        if (!prev || ts > prev) sellerLatest.set(book.seller_id, ts);
      }

      if (books.length < SELLER_SCAN_PAGE) break;
      offset += SELLER_SCAN_PAGE;
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
    console.error("[sitemap] seller entries skipped", err);
  }

  return entries;
}

async function buildBookSitemapChunk(
  siteUrl: string,
  chunkIndex: number,
): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  if (!isSupabaseConfigured()) return entries;

  const from = chunkIndex * SITEMAP_BOOKS_PER_FILE;
  const to = from + SITEMAP_BOOKS_PER_FILE - 1;

  try {
    const supabase = createSitemapClient();
    if (!supabase) return entries;
    const {data: books} = await supabase
      .from("books")
      .select("id,updated_at")
      .eq("is_published", true)
      .order("updated_at", {ascending: false})
      .range(from, to);

    for (const book of books || []) {
      entries.push({
        url: `${siteUrl}/books/${book.id}`,
        lastModified: book.updated_at ? new Date(book.updated_at) : lastModified,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  } catch (err) {
    console.error("[sitemap] book chunk skipped", err);
  }

  return entries;
}
