"use client";

import {useState} from "react";
import {BookCard} from "@/components/BookCard";
import type {Book} from "@/lib/books";
import type {Locale} from "@/lib/i18n";
import {formatMarketplaceCatalogSize, type MarketplaceLabels} from "@/lib/i18n-marketplace";

export function FavoritesGridClient({
  books: initialBooks,
  totalFavorites,
  pageSize,
  labels,
  locale,
  imagesPublicBase,
}: {
  books: Book[];
  totalFavorites: number;
  pageSize: number;
  labels: MarketplaceLabels;
  locale: Locale;
  imagesPublicBase?: string | null;
}) {
  const [books, setBooks] = useState(initialBooks);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const hasMore = page * pageSize < totalFavorites;

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/favorites/books?page=${nextPage}&limit=${pageSize}`);
      const json = (await res.json()) as {books?: Book[]};
      if (!res.ok || !json.books) return;
      setPage(nextPage);
      setBooks((prev) => {
        const seen = new Set(prev.map((b) => b.id));
        const merged = [...prev];
        for (const book of json.books || []) {
          if (!seen.has(book.id)) {
            seen.add(book.id);
            merged.push(book);
          }
        }
        return merged;
      });
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <>
      {totalFavorites > pageSize ? (
        <p className="favorites-catalog-size">
          {formatMarketplaceCatalogSize(locale, Math.min(page * pageSize, totalFavorites), totalFavorites)}
        </p>
      ) : null}
      <div className="book-grid favorites-grid">
        {books.map((book, i) => (
          <BookCard
            key={book.id}
            book={book}
            index={i}
            isFavorite
            labels={labels}
            imagesPublicBase={imagesPublicBase}
          />
        ))}
      </div>
      {hasMore ? (
        <div className="marketplace-load-more">
          <button type="button" className="secondary-button" disabled={loadingMore} onClick={() => void loadMore()}>
            {loadingMore ? labels.loadingMore : labels.loadMore}
          </button>
        </div>
      ) : null}
    </>
  );
}
