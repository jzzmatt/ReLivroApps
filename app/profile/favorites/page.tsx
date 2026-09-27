import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {FavoritesGridClient} from "@/components/FavoritesGridClient";
import {bookImagesPublicBase} from "@/lib/book-image-url";
import {booksFromFavoriteRows} from "@/lib/favorites-books";
import {messages} from "@/lib/i18n";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {FAVORITES_LIST_SELECT, MARKETPLACE_PAGE_SIZE} from "@/lib/marketplace-query";
import {getRequestLocale} from "@/lib/locale-server";
import {createClient} from "@/lib/supabase/server";

export default async function FavoritesPage() {
  const locale = await getRequestLocale();
  const t = messages[locale];
  const marketLabels = marketplaceT(locale);
  const imagesPublicBase = bookImagesPublicBase();
  const supabase = await createClient();
  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <AppShell>
        <section className="profile-page container">
          <h1>{t.favorites.title}</h1>
          <p>{t.favorites.login}</p>
          <Link className="button" href="/auth">
            {t.auth.signin}
          </Link>
        </section>
      </AppShell>
    );
  }

  const {data: favRows, count} = await supabase
    .from("favorites")
    .select(FAVORITES_LIST_SELECT, {count: "exact"})
    .eq("user_id", user.id)
    .order("created_at", {ascending: false})
    .range(0, MARKETPLACE_PAGE_SIZE - 1);

  const books = booksFromFavoriteRows(favRows);
  const totalFavorites = count ?? books.length;

  return (
    <AppShell>
      <section className="profile-page container">
        <span className="eyebrow">{t.favorites.eyebrow}</span>
        <h1>{t.favorites.title}</h1>
        {books.length === 0 ? (
          <div className="empty-state">
            <h2>{t.favorites.empty}</h2>
            <p>{t.favorites.emptyHint}</p>
            <Link className="button" href="/books">
              {t.favorites.explore}
            </Link>
          </div>
        ) : (
          <FavoritesGridClient
            books={books}
            totalFavorites={totalFavorites}
            pageSize={MARKETPLACE_PAGE_SIZE}
            labels={marketLabels}
            locale={locale}
            imagesPublicBase={imagesPublicBase}
          />
        )}
      </section>
    </AppShell>
  );
}
