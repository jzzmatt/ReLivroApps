"use client";

import Link from "next/link";
import {useState} from "react";
import {BookImage} from "@/components/BookImage";
import {ListingActions} from "@/components/ListingActions";
import {ListingStatusActions} from "@/components/ListingStatusActions";
import type {Book} from "@/lib/books";
import type {Locale} from "@/lib/i18n";
import {formatMarketplaceCatalogSize, type MarketplaceLabels} from "@/lib/i18n-marketplace";
import type {listingsManageMessages} from "@/lib/i18n-listings-manage";

type ManageLabels = (typeof listingsManageMessages)[Locale];

export function MyListingsClient({
  books: initialBooks,
  totalListings,
  pageSize,
  locale,
  imagesPublicBase,
  labels,
  loadMoreLabels,
}: {
  books: Book[];
  totalListings: number;
  pageSize: number;
  locale: Locale;
  imagesPublicBase?: string | null;
  labels: ManageLabels;
  loadMoreLabels: MarketplaceLabels;
}) {
  const [books, setBooks] = useState(initialBooks);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const hasMore = page * pageSize < totalListings;
  const numberLocale = locale === "pt" ? "pt-AO" : locale === "fr" ? "fr-FR" : "en-GB";

  const statusLabels = {
    statusActive: labels.statusActive,
    statusReserved: labels.statusReserved,
    statusSold: labels.statusSold,
    statusExchanged: labels.statusExchanged,
  };

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/profile/listings?page=${nextPage}&limit=${pageSize}`);
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
      {totalListings > pageSize ? (
        <p className="my-listings-count">
          {formatMarketplaceCatalogSize(locale, Math.min(page * pageSize, totalListings), totalListings)}
        </p>
      ) : null}
      <div className="listing-list">
        {books.map((book) => {
          const image = book.book_images?.[0];
          return (
            <article className="listing-row" key={book.id}>
              <div className="listing-thumb">
                <BookImage
                  path={image?.storage_path}
                  title={book.title}
                  className="book-image"
                  imagesPublicBase={imagesPublicBase}
                />
              </div>
              <div className="listing-info">
                <Link href={"/books/" + book.id}>
                  <h3>{book.title}</h3>
                </Link>
                <p>
                  {book.condition} · {book.city || "Angola"} ·{" "}
                  {Number(book.price_kz).toLocaleString(numberLocale)} Kz
                </p>
                <div className="listing-status-line">
                  <span className={"listing-status " + (book.is_published ? "live" : "paused")}>
                    {book.is_published ? labels.statusPublished : labels.statusPaused}
                  </span>
                  <ListingStatusActions id={book.id} status={book.status || "active"} labels={statusLabels} />
                </div>
              </div>
              <ListingActions id={book.id} published={book.is_published} labels={labels.actions} />
            </article>
          );
        })}
      </div>
      {hasMore ? (
        <div className="marketplace-load-more">
          <button type="button" className="secondary-button" disabled={loadingMore} onClick={() => void loadMore()}>
            {loadingMore ? loadMoreLabels.loadingMore : loadMoreLabels.loadMore}
          </button>
        </div>
      ) : null}
    </>
  );
}
