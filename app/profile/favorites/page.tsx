import Link from "next/link";
import {AppShell} from "@/components/AppShell";
import {BookCard} from "@/components/BookCard";
import {bookImagesPublicBase} from "@/lib/book-image-url";
import type {Book} from "@/lib/books";
import {messages} from "@/lib/i18n";
import {marketplaceT} from "@/lib/i18n-marketplace";
import {getRequestLocale} from "@/lib/locale-server";
import {oneRelation} from "@/lib/supabase-relations";
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

  const {data: favRows} = await supabase
    .from("favorites")
    .select(
      "book_id, books:book_id(*, book_images(id,storage_path,sort_order), profiles!books_seller_id_fkey(display_name,avatar_url))",
    )
    .eq("user_id", user.id)
    .order("created_at", {ascending: false});

  const books = (favRows || [])
    .map((row) => oneRelation(row.books as Book | Book[] | null))
    .filter((book): book is Book => !!book && book.is_published);

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
          <div className="book-grid favorites-grid">
            {books.map((book, i) => (
              <BookCard
                key={book.id}
                book={book}
                index={i}
                isFavorite
                labels={marketLabels}
                imagesPublicBase={imagesPublicBase}
              />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
