"use client";

import {useState} from "react";
import {AdminListingAction} from "@/components/AdminListingAction";
import type {AdminListingRow} from "@/lib/admin-listings-query";
import type {AdminActionLabels} from "@/lib/i18n-admin";
import type {Locale} from "@/lib/i18n";
import {formatMarketplaceCatalogSize, type MarketplaceLabels} from "@/lib/i18n-marketplace";

export function AdminListingsClient({
  books: initialBooks,
  totalListings,
  pageSize,
  locale,
  actionLabels,
  loadMoreLabels,
}: {
  books: AdminListingRow[];
  totalListings: number;
  pageSize: number;
  locale: Locale;
  actionLabels: AdminActionLabels;
  loadMoreLabels: MarketplaceLabels;
}) {
  const [books, setBooks] = useState(initialBooks);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const hasMore = page * pageSize < totalListings;
  const numberLocale = locale === "pt" ? "pt-AO" : locale === "fr" ? "fr-FR" : "en-GB";

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/admin/listings?page=${nextPage}&limit=${pageSize}`);
      const json = (await res.json()) as {books?: AdminListingRow[]};
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
        <p className="admin-listings-count">
          {formatMarketplaceCatalogSize(locale, Math.min(page * pageSize, totalListings), totalListings)}
        </p>
      ) : null}
      <div className="admin-table">
        {books.map((b) => (
          <article key={b.id}>
            <div>
              <strong>{b.title}</strong>
              <span>
                {Number(b.price_kz || 0).toLocaleString(numberLocale)} Kz · {b.city || "Angola"} · {b.status}
              </span>
            </div>
            <AdminListingAction id={b.id} published={b.is_published} labels={actionLabels} />
          </article>
        ))}
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
