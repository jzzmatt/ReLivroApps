"use client";

import {useState} from "react";
import {BookCard} from "@/components/BookCard";
import type {Book} from "@/lib/books";
import type {Locale} from "@/lib/i18n";
import {formatMarketplaceCatalogSize, type MarketplaceLabels} from "@/lib/i18n-marketplace";

export function SellerListingsClient({
  sellerId,
  books: initialBooks,
  totalListings,
  pageSize,
  favorites,
  labels,
  locale,
  imagesPublicBase,
}: {
  sellerId: string;
  books: Book[];
  totalListings: number;
  pageSize: number;
  favorites: string[];
  labels: MarketplaceLabels;
  locale: Locale;
  imagesPublicBase?: string | null;
}) {
  const [books, setBooks] = useState(initialBooks);
  const [loadingMore, setLoadingMore] = useState(false);
  const hasMore = books.length < totalListings;

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = Math.floor(books.length / pageSize) + 1;
      const res = await fetch(`/api/sellers/${sellerId}/books?page=${nextPage}&limit=${pageSize}`);
      const json = (await res.json()) as {books?: Book[]};
      if (!res.ok || !json.books) return;
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
      {totalListings > pageSize ? (
        <p className="seller-listings-count">
          {formatMarketplaceCatalogSize(locale, books.length, totalListings)}
        </p>
      ) : null}
      <div className="book-grid">
        {books.map((book, i) => (
          <BookCard
            key={book.id}
            book={book}
            index={i}
            isFavorite={favorites.includes(book.id)}
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
