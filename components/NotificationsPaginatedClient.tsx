"use client";

import {useState} from "react";
import {NotificationList, type NotificationItem} from "@/components/NotificationList";
import type {Locale} from "@/lib/i18n";
import {formatMarketplaceCatalogSize, type MarketplaceLabels} from "@/lib/i18n-marketplace";
import {localeTag} from "@/lib/locale-format";

export function NotificationsPaginatedClient({
  items: initialItems,
  totalNotifications,
  pageSize,
  locale,
  loadMoreLabels,
}: {
  items: NotificationItem[];
  totalNotifications: number;
  pageSize: number;
  locale: Locale;
  loadMoreLabels: MarketplaceLabels;
}) {
  const [items, setItems] = useState(initialItems);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const hasMore = page * pageSize < totalNotifications;
  const dateLocale = localeTag(locale);

  async function loadMore() {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/notifications?page=${nextPage}&limit=${pageSize}`);
      const json = (await res.json()) as {notifications?: NotificationItem[]};
      if (!res.ok || !json.notifications) return;
      setPage(nextPage);
      setItems((prev) => {
        const seen = new Set(prev.map((n) => n.id));
        const merged = [...prev];
        for (const row of json.notifications || []) {
          if (!seen.has(row.id)) {
            seen.add(row.id);
            merged.push(row);
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
      {totalNotifications > pageSize ? (
        <p className="notifications-catalog-size">
          {formatMarketplaceCatalogSize(
            locale,
            Math.min(page * pageSize, totalNotifications),
            totalNotifications,
          )}
        </p>
      ) : null}
      <NotificationList items={items} dateLocale={dateLocale} />
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
