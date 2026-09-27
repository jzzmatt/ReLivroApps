import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {MarketplaceClient} from "@/components/MarketplaceClient";
import {messages} from "@/lib/i18n";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {getRequestLocale} from "@/lib/locale-server";
import type {Book} from "@/lib/books";
import {createClient} from "@/lib/supabase/server";
import {isSupabaseConfigured} from "@/lib/supabase/public-env";

/** Always read Supabase env at request time (Vercel runtime vars). */
export const dynamic = "force-dynamic";

export default async function BooksPage() {
  const locale = await getRequestLocale();
  const t = messages[locale];
  const marketLabels = marketplaceT(locale);

  let books: Book[] = [];
  let favorites: string[] = [];
  let loadError: unknown = null;

  try {
    if (!isSupabaseConfigured()) {
      return (
        <AppShell>
          <section className="marketplace container">
            <div className="empty-state">{t.market.error}</div>
          </section>
        </AppShell>
      );
    }

    const supabase = await createClient();
    const {data: authData} = await supabase.auth.getUser();
    const user = authData?.user ?? null;
    const {data, error} = await supabase
      .from("books")
      .select("*,book_images(id,storage_path,sort_order),profiles!books_seller_id_fkey(display_name,avatar_url)")
      .eq("is_published", true)
      .order("created_at", {ascending: false});
    if (error) loadError = error;
    else books = (data || []) as Book[];
    const {data: favRows} = user
      ? await supabase.from("favorites").select("book_id").eq("user_id", user.id)
      : {data: []};
    favorites = (favRows || []).map((f) => f.book_id);
  } catch (err) {
    console.error("[books] load failed", err);
    loadError = err;
  }

  return (
    <AppShell>
      <section className="marketplace container">
        <div className="marketplace-head">
          <div>
            <span className="eyebrow">{t.market.eyebrow}</span>
            <h1>{t.market.title}</h1>
            <p>{t.market.description}</p>
          </div>
          <Link className="button button-small" href="/sell">
            {t.market.publish}
          </Link>
        </div>
        {loadError ? (
          <div className="empty-state">{t.market.error}</div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <h2>{t.market.emptyTitle}</h2>
            <p>{t.market.emptyText}</p>
            <Link className="button" href="/sell">
              {t.market.publish}
            </Link>
          </div>
        ) : (
          <MarketplaceClient
            books={books}
            favorites={favorites}
            labels={marketLabels}
            locale={locale}
          />
        )}
      </section>
    </AppShell>
  );
}
