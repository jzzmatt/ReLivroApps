import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {MarketplaceClient} from "@/components/MarketplaceClient";
import {messages} from "@/lib/i18n";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {getRequestLocale} from "@/lib/locale-server";
import type {Book} from "@/lib/books";
import {createClient} from "@/lib/supabase/server";

export default async function BooksPage() {
  const locale = await getRequestLocale();
  const t = messages[locale];
  const marketLabels = marketplaceT(locale);
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();
  const {data, error} = await supabase
    .from("books")
    .select("*,book_images(id,storage_path,sort_order),profiles(display_name,avatar_url)")
    .eq("is_published", true)
    .order("created_at", {ascending: false});
  const books = (data || []) as Book[];
  const {data: favorites} = user
    ? await supabase.from("favorites").select("book_id").eq("user_id", user.id)
    : {data: []};

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
        {error ? (
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
            favorites={(favorites || []).map((f) => f.book_id)}
            labels={marketLabels}
          />
        )}
      </section>
    </AppShell>
  );
}
